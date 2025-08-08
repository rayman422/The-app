const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export async function geocodeCity(query) {
  const url = new URL(GEOCODE_BASE);
  url.searchParams.set('name', query);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('Location not found');
  const r = data.results[0];
  return { name: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}${r.country ? ', ' + r.country : ''}`, lat: r.latitude, lon: r.longitude };
}

export async function fetchForecast(lat, lon) {
  const url = new URL(OPEN_METEO_BASE);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m');
  url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m');
  url.searchParams.set('timezone', 'auto');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Forecast fetch failed');
  return res.json();
}