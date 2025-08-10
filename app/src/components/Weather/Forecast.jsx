import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CloudSun, Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Eye, Navigation } from 'lucide-react';

// Sample weather data - in a real app this would come from a weather API
const sampleWeatherData = {
  current: {
    temperature: 72,
    feelsLike: 75,
    humidity: 65,
    windSpeed: 8,
    windDirection: 'SW',
    pressure: 1013,
    visibility: 10,
    description: 'Partly Cloudy',
    icon: 'cloud-sun'
  },
  hourly: [
    { time: 'Now', temp: 72, icon: 'cloud-sun', description: 'Partly Cloudy' },
    { time: '1 PM', temp: 75, icon: 'sun', description: 'Sunny' },
    { time: '2 PM', temp: 77, icon: 'sun', description: 'Sunny' },
    { time: '3 PM', temp: 76, icon: 'cloud-sun', description: 'Partly Cloudy' },
    { time: '4 PM', temp: 74, icon: 'cloud', description: 'Cloudy' },
    { time: '5 PM', temp: 71, icon: 'cloud-rain', description: 'Light Rain' },
    { time: '6 PM', temp: 68, icon: 'cloud-rain', description: 'Rain' },
    { time: '7 PM', temp: 65, icon: 'cloud', description: 'Cloudy' }
  ],
  fishingConditions: {
    overall: 'Good',
    temperature: 'Optimal',
    wind: 'Moderate',
    pressure: 'Stable',
    visibility: 'Clear',
    recommendations: [
      'Fish are active in current conditions',
      'Try topwater lures in the morning',
      'Switch to deeper presentations in afternoon',
      'Wind may affect casting accuracy'
    ]
  }
};

const getWeatherIcon = (iconName) => {
  switch (iconName) {
    case 'sun':
      return <Sun size={24} className="text-yellow-400" />;
    case 'cloud-sun':
      return <CloudSun size={24} className="text-blue-400" />;
    case 'cloud':
      return <Cloud size={24} className="text-gray-400" />;
    case 'cloud-rain':
      return <CloudRain size={24} className="text-blue-600" />;
    default:
      return <CloudSun size={24} className="text-blue-400" />;
  }
};

const getFishingConditionColor = (condition) => {
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'text-green-400';
    case 'good':
      return 'text-emerald-400';
    case 'fair':
      return 'text-yellow-400';
    case 'poor':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const Forecast = ({ setPage }) => {
  const [weatherData, setWeatherData] = useState(sampleWeatherData);
  const [selectedTab, setSelectedTab] = useState('current');
  const [location, setLocation] = useState('Current Location');

  // In a real app, you would fetch weather data here
  useEffect(() => {
    // fetchWeatherData();
  }, []);

  const tabs = [
    { id: 'current', label: 'Current', icon: Thermometer },
    { id: 'hourly', label: 'Hourly', icon: Clock },
    { id: 'fishing', label: 'Fishing', icon: Fish }
  ];

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center text-white mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('profile')}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Weather Forecast</h1>
        <div className="w-10"></div>
      </div>

      {/* Location */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">{location}</h2>
            <p className="text-gray-400 text-sm">Updated just now</p>
          </div>
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300">
            <Navigation size={20} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'current' && (
          <motion.div
            key="current"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Current Weather Card */}
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{weatherData.current.temperature}°F</h3>
                  <p className="text-gray-400">Feels like {weatherData.current.feelsLike}°F</p>
                </div>
                <div className="text-right">
                  {getWeatherIcon(weatherData.current.icon)}
                  <p className="text-white font-medium mt-1">{weatherData.current.description}</p>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Droplets size={20} className="text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Humidity</p>
                    <p className="text-white font-medium">{weatherData.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind size={20} className="text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Wind</p>
                    <p className="text-white font-medium">{weatherData.current.windSpeed} mph {weatherData.current.windDirection}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Thermometer size={20} className="text-red-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Pressure</p>
                    <p className="text-white font-medium">{weatherData.current.pressure} hPa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-emerald-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Visibility</p>
                    <p className="text-white font-medium">{weatherData.current.visibility} mi</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'hourly' && (
          <motion.div
            key="hourly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">24-Hour Forecast</h3>
              <div className="space-y-3">
                {weatherData.hourly.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(hour.icon)}
                      <div>
                        <p className="text-white font-medium">{hour.time}</p>
                        <p className="text-gray-400 text-sm">{hour.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{hour.temp}°F</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'fishing' && (
          <motion.div
            key="fishing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Overall Fishing Conditions */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Fishing Conditions</h3>
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${getFishingConditionColor(weatherData.fishingConditions.overall)}`}>
                  {weatherData.fishingConditions.overall}
                </div>
                <p className="text-gray-400">Overall fishing conditions</p>
              </div>

              {/* Condition Factors */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-gray-400 text-sm">Temperature</p>
                  <p className={`font-semibold ${getFishingConditionColor(weatherData.fishingConditions.temperature)}`}>
                    {weatherData.fishingConditions.temperature}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-gray-400 text-sm">Wind</p>
                  <p className={`font-semibold ${getFishingConditionColor(weatherData.fishingConditions.wind)}`}>
                    {weatherData.fishingConditions.wind}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-gray-400 text-sm">Pressure</p>
                  <p className={`font-semibold ${getFishingConditionColor(weatherData.fishingConditions.pressure)}`}>
                    {weatherData.fishingConditions.pressure}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-gray-400 text-sm">Visibility</p>
                  <p className={`font-semibold ${getFishingConditionColor(weatherData.fishingConditions.visibility)}`}>
                    {weatherData.fishingConditions.visibility}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-white font-semibold mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {weatherData.fishingConditions.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Missing Clock and Fish icons - let's add them
const Clock = ({ size, className }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const Fish = ({ size, className }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6.5 12c6.5-6.5 12-6.5 12-6.5s-5.5 0-12 6.5"></path>
    <path d="M6.5 12c6.5 6.5 12 6.5 12 6.5s-5.5 0-12-6.5"></path>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);