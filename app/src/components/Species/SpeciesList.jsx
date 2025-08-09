import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Fish, Search, Filter } from 'lucide-react';

export const SpeciesList = ({ setPage, fishingDB }) => {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [waterType, setWaterType] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const list = fishingDB ? await fishingDB.getSpecies(null, waterType || null) : [];
        if (active) setSpecies(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [fishingDB, waterType]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return species;
    return species.filter(s =>
      s.commonName?.toLowerCase().includes(term) ||
      s.scientificName?.toLowerCase().includes(term)
    );
  }, [q, species]);

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('profile')}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Species</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-slate-800 rounded-lg flex items-center gap-2 px-2">
          <Search size={16} className="text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search species" className="flex-1 bg-transparent p-2 text-white outline-none" />
        </div>
        <select value={waterType} onChange={e => setWaterType(e.target.value)} className="bg-slate-800 text-white rounded-lg p-2">
          <option value="">All</option>
          <option value="freshwater">Freshwater</option>
          <option value="saltwater">Saltwater</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400 text-center py-20">No species found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(sp => (
            <div key={sp.id} className="bg-slate-800 rounded-xl p-4 text-white flex items-center justify-between">
              <div>
                <div className="font-semibold">{sp.commonName}</div>
                <div className="text-sm text-gray-300 italic">{sp.scientificName}</div>
                {!!sp.averageSize?.length && (
                  <div className="text-xs text-gray-400">Avg Length: {sp.averageSize.length} in</div>
                )}
              </div>
              <button onClick={() => { (typeof window !== 'undefined' && (window.__speciesId = sp.id)); props?.setSelectedSpeciesId ? props.setSelectedSpeciesId(sp.id) : null; setPage('speciesDetail'); }} className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};