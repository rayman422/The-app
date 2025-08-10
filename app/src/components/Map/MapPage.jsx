import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../Auth/AuthWrapper';
import { LocalStore } from '../../utils/localStore';

export const MapPage = ({ setPage }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const { appId, userId } = useAuth();
  const store = useMemo(() => new LocalStore(appId, userId || 'demo-user'), [appId, userId]);
  const [spots, setSpots] = useState(store.listSpots());

  useEffect(() => {
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current).setView([37.0902, -95.7129], 4);
    mapInstanceRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const onClick = (e) => {
      const name = prompt('Name this fishing spot');
      if (!name) return;
      const spot = { name, lat: e.latlng.lat, lng: e.latlng.lng, createdAt: new Date().toISOString() };
      store.addSpot(spot);
      setSpots(store.listSpots());
    };
    map.on('click', onClick);

    return () => {
      map.off('click', onClick);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [store]);

  useEffect(() => {
    // clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const map = mapInstanceRef.current;
    if (!map) return;
    spots.forEach((s) => {
      const marker = L.marker([s.lat, s.lng]).addTo(map).bindPopup(`<strong>${s.name}</strong>`);
      markersRef.current.push(marker);
    });
  }, [spots]);

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-3">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('profile')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Fishing Map</h1>
        <div className="w-10"></div>
      </div>
      <div className="text-gray-400 text-sm mb-2">Click on the map to add a fishing spot.</div>
      <div ref={mapRef} className="w-full h-[60vh] rounded-xl overflow-hidden shadow-lg" />
      <div className="mt-3 text-white">
        <h2 className="font-semibold mb-2">Saved Spots</h2>
        <ul className="space-y-1 text-sm text-gray-300">
          {spots.map((s) => (
            <li key={`${s.lat}-${s.lng}-${s.name}`}>• {s.name} ({s.lat.toFixed(4)}, {s.lng.toFixed(4)})</li>
          ))}
          {spots.length === 0 && <li className="text-gray-500">No spots yet.</li>}
        </ul>
      </div>
    </div>
  );
};