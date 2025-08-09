import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Fish, Anchor, Zap, Recycle, Ruler, LineChart, Wrench } from 'lucide-react';

export const SpeciesDetail = ({ setPage, fishingDB, speciesId }) => {
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gearRecs, setGearRecs] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const s = fishingDB && speciesId ? await fishingDB.getSpeciesById(speciesId) : null;
        const recs = fishingDB && speciesId ? await fishingDB.getSpeciesGearRecommendations(speciesId) : [];
        if (active) {
          setSpecies(s);
          setGearRecs(recs);
        }
      } catch (e) {
        console.error(e);
        if (active) setError('Failed to load species data');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [fishingDB, speciesId]);

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('species')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">{species?.commonName || 'Species'}</h1>
        <div className="w-10"></div>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-16">Loading...</div>
      ) : error ? (
        <div className="text-red-400 text-center py-16">{error}</div>
      ) : !species ? (
        <div className="text-gray-400 text-center py-16">Species not found</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-4 text-white">
            <div className="flex items-start gap-3">
              {species.images?.[0] ? (
                <img src={species.images[0]} alt={species.commonName} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center"><Fish size={24} className="text-emerald-400" /></div>
              )}
              <div className="flex-1">
                <div className="text-lg font-semibold">{species.commonName}</div>
                <div className="text-sm text-gray-300 italic">{species.scientificName}</div>
                {!!species.description && (
                  <p className="text-gray-300 mt-2 text-sm leading-relaxed line-clamp-3">{species.description}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-xs text-gray-300">
              {species.waterTypes?.length ? <div><span className="text-gray-400">Water:</span> {species.waterTypes.join(', ')}</div> : null}
              {species.regions?.length ? <div><span className="text-gray-400">Regions:</span> {species.regions.slice(0,3).join(', ')}{species.regions.length>3?'…':''}</div> : null}
              {species.seasons?.length ? <div><span className="text-gray-400">Seasons:</span> {species.seasons.join(', ')}</div> : null}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 text-white">
            <div className="font-semibold mb-3">Gear & Tackle Guide</div>
            <div className="space-y-4">
              {(gearRecs.length ? gearRecs : []).map((group) => (
                <div key={group.id} className="bg-slate-900 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Wrench size={18} />
                    <span className="font-medium">{group.type}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(group.items || []).map((item, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-lg p-3 flex items-start gap-3">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-700" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            {item.name}
                            {item.is_beginner_friendly ? <span className="text-xxs px-2 py-0.5 rounded-full bg-emerald-700 text-white">Beginner</span> : null}
                          </div>
                          <p className="text-xs text-gray-300 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {gearRecs.length === 0 && (
                <div className="text-sm text-gray-400">No expert recommendations available.</div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 text-white">
            <div className="font-semibold mb-2">Habitat & Tips</div>
            <div className="text-sm text-gray-300">
              {species.habitat || 'Prefers structure, vegetation, and ambush points. Overcast days and dawn/dusk are productive times.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};