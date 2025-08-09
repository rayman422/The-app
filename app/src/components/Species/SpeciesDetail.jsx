import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Fish, Anchor, Zap, Recycle, Ruler, LineChart, Wrench } from 'lucide-react';

export const SpeciesDetail = ({ setPage, fishingDB, speciesId }) => {
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const s = fishingDB ? await fishingDB.getSpeciesById(speciesId) : null;
        if (active) setSpecies(s);
      } catch (e) {
        console.error(e);
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
      ) : !species ? (
        <div className="text-gray-400 text-center py-16">Species not found</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Fish size={28} className="text-emerald-400" />
              <div>
                <div className="text-lg font-semibold">{species.commonName}</div>
                <div className="text-sm text-gray-300 italic">{species.scientificName}</div>
              </div>
            </div>
            {!!species.description && (
              <p className="text-gray-300 mt-3 text-sm leading-relaxed">{species.description}</p>
            )}
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 text-white">
            <div className="font-semibold mb-3">Gear & Tackle Guide</div>
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl p-3">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Wrench size={18} />
                  <span className="font-medium">Rod & Reel</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Medium-Heavy Action, 7-foot Baitcasting Rod</div>
                  <p className="text-gray-300">This setup is versatile for casting a variety of lures and has enough backbone to pull a bass out of heavy cover.</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <LineChart size={18} />
                  <span className="font-medium">Line</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">15lb Fluorocarbon or 30lb Braided Line</div>
                  <p className="text-gray-300">Use fluorocarbon for finesse presentations and clear water. Use braided line for flipping and pitching into dense vegetation.</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Wrench size={18} />
                  <span className="font-medium">Top Lures & Baits</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-slate-800 rounded-lg p-2">
                    <div className="font-semibold">Crankbait</div>
                    <p className="text-xs text-gray-300">Great for covering a lot of water and finding active fish.</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2">
                    <div className="font-semibold">Jig</div>
                    <p className="text-xs text-gray-300">Excellent for a slow, bottom-bouncing presentation near structure.</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2">
                    <div className="font-semibold">Live Worms</div>
                    <p className="text-xs text-gray-300">A classic choice, effective in almost any condition.</p>
                  </div>
                </div>
              </div>
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