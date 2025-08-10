import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Fish, Search } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { LocalStore } from '../../utils/localStore';

const SAMPLE_SPECIES = [
  { id: 'largemouth-bass', name: 'Largemouth Bass', waterTypes: ['freshwater'] },
  { id: 'rainbow-trout', name: 'Rainbow Trout', waterTypes: ['freshwater'] },
  { id: 'redfish', name: 'Red Drum (Redfish)', waterTypes: ['saltwater'] },
  { id: 'snook', name: 'Snook', waterTypes: ['saltwater'] },
];

export const SpeciesList = ({ setPage }) => {
  const { appId, userId } = useAuth();
  const store = useMemo(() => new LocalStore(appId, userId || 'demo-user'), [appId, userId]);
  const [q, setQ] = useState('');
  const flags = store.listSpeciesFlags();

  const filtered = SAMPLE_SPECIES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id) => {
    store.toggleSpeciesFlag(id);
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('profile')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Species</h1>
        <div className="w-10" />
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search species" className="w-full bg-slate-800 text-white rounded-xl pl-9 pr-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="bg-slate-800 rounded-xl p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                <Fish size={18} className="text-gray-300" />
              </div>
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-gray-400">{s.waterTypes.join(', ')}</div>
              </div>
            </div>
            <button onClick={() => toggle(s.id)} className={`px-3 py-1 rounded-lg text-sm ${flags[s.id] ? 'bg-emerald-700' : 'bg-slate-600'} `}>
              {flags[s.id] ? 'Caught' : 'Mark caught'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-8">No species match your search.</div>
        )}
      </div>
    </div>
  );
};