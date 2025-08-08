import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { geocodeCity, fetchForecast } from '../services/openMeteo';

export default function ForecastPage() {
  const [city, setCity] = useState('Austin, TX');
  const [loc, setLoc] = useState({ name: 'Austin, TX', lat: 30.2672, lon: -97.7431 });
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [error, setError] = useState('');
  const didInit = useRef(false);

  const loadForecast = async (latitude, longitude, name) => {
    setError('');
    try {
      const data = await fetchForecast(latitude, longitude);
      setCurrent({
        temp: Math.round(data.current.temperature_2m),
        wind: Math.round(data.current.wind_speed_10m),
        code: data.current.weather_code,
      });
      const hours = data.hourly.time?.slice(0, 10).map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: 'numeric' }),
        temp: Math.round(data.hourly.temperature_2m[i]),
      })) || [];
      setHourly(hours);
      setLoc({ name, lat: latitude, lon: longitude });
    } catch {
      setError('Failed to load forecast');
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    loadForecast(loc.lat, loc.lon, loc.name);
  }, [loc.lat, loc.lon, loc.name]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const g = await geocodeCity(city);
      await loadForecast(g.lat, g.lon, g.name);
    } catch (err) {
      setError(err.message || 'Location not found');
    }
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20 text-white">
      <div className="flex items-center mb-4">
        <ChevronLeft size={24} className="cursor-pointer" />
        <h1 className="flex-1 text-center text-xl font-bold">Your Forecast</h1>
        <div className="w-6"></div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 rounded-lg bg-slate-800 text-white p-2" placeholder="Search city" />
        <button className="bg-emerald-600 rounded-lg px-4">Go</button>
      </form>

      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

      <div className="flex flex-col items-center text-center mb-6">
        <h2 className="text-4xl font-bold">{current ? `${current.temp}°` : '—'}</h2>
        <p className="text-xl font-semibold">{loc.name}</p>
        <p className="text-gray-400 text-sm">{current ? `Wind ${current.wind} km/h` : 'Loading...'}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Hourly Forecast</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {hourly.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-24 bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold mb-2">{item.time}</p>
            <p className="text-2xl font-bold mt-2">{item.temp}°</p>
          </div>
        ))}
        {hourly.length === 0 && <div className="text-gray-400">No data</div>}
      </div>
    </div>
  );
}