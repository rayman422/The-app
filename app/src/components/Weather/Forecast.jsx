import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CloudSun, Sun, Moon, Wind } from 'lucide-react';

const fetchWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
};

export const Forecast = ({ setPage }) => {
  const [coords, setCoords] = useState({ lat: 30.2672, lon: -97.7431 }); // Austin default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const w = await fetchWeather(coords.lat, coords.lon);
        if (active) setData(w);
      } catch {
        if (active) setError('Failed to load weather');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [coords.lat, coords.lon]);

  const hourly = data?.hourly?.time?.slice(0, 12).map((t, idx) => ({ time: new Date(t).toLocaleTimeString([], { hour: 'numeric' }), temp: Math.round(data.hourly.temperature_2m[idx]) })) || [];
  const currentTemp = data?.current?.temperature_2m;
  const windSpeed = data?.current?.wind_speed_10m;
  const windDir = data?.current?.wind_direction_10m;

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('profile')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Weather Forecast</h1>
        <div className="w-10"></div>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-red-400 text-center py-10">{error}</div>
      ) : (
        <>
          <div className="flex flex-col items-center text-white mb-6">
            <div className="text-4xl font-bold">{Math.round(currentTemp)}°</div>
            <div className="text-sm text-gray-300">Lat {coords.lat.toFixed(2)}, Lon {coords.lon.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 text-white">
            <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2"><Wind size={20} /><span>Wind</span></div>
              <div className="text-sm">{Math.round(windSpeed)} m/s {windDir ? `${windDir}°` : ''}</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2"><CloudSun size={20} /><span>Conditions</span></div>
              <div className="text-sm">Hourly temp next 12h</div>
            </div>
          </div>

          <div className="text-white">
            <div className="font-semibold mb-2">Hourly</div>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {hourly.map((h, i) => (
                <div key={i} className="flex-shrink-0 w-20 bg-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-300">{h.time}</div>
                  <div className="text-lg font-bold">{h.temp}°</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};