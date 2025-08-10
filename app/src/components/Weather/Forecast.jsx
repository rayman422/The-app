import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CloudSun } from 'lucide-react';

export const Forecast = ({ setPage }) => {
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError('Location permission denied'),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coords) return;
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&hourly=temperature_2m,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch {
        setError('Failed to fetch weather');
      }
    };
    fetchWeather();
  }, [coords]);

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('profile')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Weather Forecast</h1>
        <div className="w-10"></div>
      </div>

      {!coords && !error && (
        <div className="text-center text-gray-400 py-10">Requesting your location…</div>
      )}
      {error && <div className="text-center text-red-400 py-10">{error}</div>}

      {data && (
        <div className="text-white space-y-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CloudSun />
              <div>
                <div className="font-semibold">Current</div>
                <div className="text-gray-300 text-sm">
                  {data.current_weather.temperature}°C • wind {data.current_weather.windspeed} km/h
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="font-semibold mb-2">Next days</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {data.daily.time.slice(0, 6).map((t, i) => (
                <div key={t} className="bg-slate-700 rounded-lg p-2">
                  <div className="text-gray-300">{new Date(t).toLocaleDateString()}</div>
                  <div>Min {data.daily.temperature_2m_min[i]}°C / Max {data.daily.temperature_2m_max[i]}°C</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};