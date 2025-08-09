// Weather Service for capturing weather data on catches
// This service integrates with OpenWeather API to provide current weather conditions

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  constructor() {
    this.apiKey = OPENWEATHER_API_KEY;
    if (!this.apiKey) {
      console.warn('OpenWeather API key not configured. Weather data will not be captured.');
    }
  }

  /**
   * Get current weather for a specific location
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Weather data object
   */
  async getCurrentWeather(latitude, longitude) {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    try {
      const response = await fetch(
        `${OPENWEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error('Unable to fetch weather data');
    }
  }

  /**
   * Format raw weather API response into our standard format
   * @param {Object} rawData - Raw API response
   * @returns {Object} Formatted weather data
   */
  formatWeatherData(rawData) {
    return {
      timestamp: new Date().toISOString(),
      temperature: {
        air: rawData.main?.temp || null,
        feels_like: rawData.main?.feels_like || null,
        min: rawData.main?.temp_min || null,
        max: rawData.main?.temp_max || null
      },
      humidity: rawData.main?.humidity || null,
      pressure: rawData.main?.pressure || null,
      wind: {
        speed: rawData.wind?.speed || null,
        direction: rawData.wind?.deg || null,
        gust: rawData.wind?.gust || null
      },
      conditions: {
        main: rawData.weather?.[0]?.main || null,
        description: rawData.weather?.[0]?.description || null,
        icon: rawData.weather?.[0]?.icon || null
      },
      visibility: rawData.visibility || null,
      clouds: rawData.clouds?.all || null,
      sunrise: rawData.sys?.sunrise ? new Date(rawData.sys.sunrise * 1000).toISOString() : null,
      sunset: rawData.sys?.sunset ? new Date(rawData.sys.sunset * 1000).toISOString() : null,
      timezone: rawData.timezone || null
    };
  }

  /**
   * Get weather data for a catch location
   * @param {Object} location - Location object with coordinates
   * @returns {Promise<Object>} Weather data or null if unavailable
   */
  async getWeatherForCatch(location) {
    if (!location?.coordinates?.latitude || !location?.coordinates?.longitude) {
      console.warn('Location coordinates required for weather data');
      return null;
    }

    try {
      const weather = await this.getCurrentWeather(
        location.coordinates.latitude,
        location.coordinates.longitude
      );
      
      return weather;
    } catch (error) {
      console.warn('Weather data unavailable for catch:', error.message);
      return null;
    }
  }

  /**
   * Get weather forecast for a location
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {number} days - Number of days (1-5)
   * @returns {Promise<Object>} Forecast data
   */
  async getForecast(latitude, longitude, days = 3) {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    try {
      const response = await fetch(
        `${OPENWEATHER_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.formatForecastData(data);
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
      throw new Error('Unable to fetch forecast data');
    }
  }

  /**
   * Format forecast data
   * @param {Object} rawData - Raw forecast API response
   * @returns {Object} Formatted forecast data
   */
  formatForecastData(rawData) {
    const forecasts = rawData.list?.map(item => ({
      timestamp: new Date(item.dt * 1000).toISOString(),
      temperature: {
        air: item.main?.temp || null,
        feels_like: item.main?.feels_like || null,
        min: item.main?.temp_min || null,
        max: item.main?.temp_max || null
      },
      humidity: item.main?.humidity || null,
      pressure: item.main?.pressure || null,
      wind: {
        speed: item.wind?.speed || null,
        direction: item.wind?.deg || null
      },
      conditions: {
        main: item.weather?.[0]?.main || null,
        description: item.weather?.[0]?.description || null,
        icon: item.weather?.[0]?.icon || null
      },
      clouds: item.clouds?.all || null,
      pop: item.pop || null // Probability of precipitation
    })) || [];

    return {
      location: {
        latitude: rawData.city?.coord?.lat || null,
        longitude: rawData.city?.coord?.lon || null,
        name: rawData.city?.name || null,
        country: rawData.city?.country || null
      },
      forecasts,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Check if weather service is available
   * @returns {boolean} True if API key is configured
   */
  isAvailable() {
    return !!this.apiKey;
  }

  /**
   * Get service status information
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      configured: !!this.apiKey,
      baseUrl: OPENWEATHER_BASE_URL
    };
  }
}

// Export singleton instance
export const weatherService = new WeatherService();