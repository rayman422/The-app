import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Filter, Fish, Info, MapPin, Calendar } from 'lucide-react';

// Sample species data - in a real app this would come from an API
const speciesData = [
  {
    id: 1,
    name: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    family: 'Centrarchidae',
    habitat: 'Lakes, ponds, slow-moving rivers',
    diet: 'Fish, crayfish, frogs, insects',
    avgSize: '12-16 inches',
    maxSize: '29 inches',
    bestTime: 'Spring and Fall',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop',
    description: 'A popular game fish known for its aggressive strikes and fighting ability.'
  },
  {
    id: 2,
    name: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    family: 'Salmonidae',
    habitat: 'Cold streams, rivers, lakes',
    diet: 'Insects, small fish, crustaceans',
    avgSize: '8-12 inches',
    maxSize: '20 inches',
    bestTime: 'Spring and Fall',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    description: 'A beautiful fish with distinctive pink stripe, popular in fly fishing.'
  },
  {
    id: 3,
    name: 'Bluegill',
    scientificName: 'Lepomis macrochirus',
    family: 'Centrarchidae',
    habitat: 'Lakes, ponds, slow streams',
    diet: 'Insects, small crustaceans, plant matter',
    avgSize: '4-8 inches',
    maxSize: '12 inches',
    bestTime: 'Summer',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop',
    description: 'A common panfish that\'s great for beginners and provides consistent action.'
  },
  {
    id: 4,
    name: 'Channel Catfish',
    scientificName: 'Ictalurus punctatus',
    family: 'Ictaluridae',
    habitat: 'Rivers, lakes, reservoirs',
    diet: 'Fish, insects, worms, plant matter',
    avgSize: '12-24 inches',
    maxSize: '52 inches',
    bestTime: 'Night',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    description: 'A bottom-feeding fish that\'s active at night and can grow very large.'
  },
  {
    id: 5,
    name: 'Walleye',
    scientificName: 'Sander vitreus',
    family: 'Percidae',
    habitat: 'Lakes, reservoirs, large rivers',
    diet: 'Small fish, insects, crayfish',
    avgSize: '14-20 inches',
    maxSize: '42 inches',
    bestTime: 'Dawn and Dusk',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop',
    description: 'A prized game fish known for its excellent taste and challenging nature.'
  }
];

export const SpeciesList = ({ setPage, fishingDB, userId }) => {
  const [species, setSpecies] = useState(speciesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [userCatches, setUserCatches] = useState([]);

  const families = ['all', ...new Set(speciesData.map(s => s.family))];

  useEffect(() => {
    if (fishingDB && userId) {
      loadUserCatches();
    }
  }, [fishingDB, userId]);

  const loadUserCatches = async () => {
    try {
      const catches = await fishingDB.getCatches(userId);
      setUserCatches(catches || []);
    } catch (error) {
      console.error('Error loading catches:', error);
    }
  };

  const filteredSpecies = species.filter(species => {
    const matchesSearch = species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         species.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'all' || species.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  const getCatchCount = (speciesName) => {
    return userCatches.filter(catch_ => catch_.species === speciesName).length;
  };

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
        <h1 className="flex-1 text-center text-xl font-bold">Species Database</h1>
        <div className="w-10"></div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {families.map(family => (
            <button
              key={family}
              onClick={() => setSelectedFamily(family)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                selectedFamily === family
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {family === 'all' ? 'All Families' : family}
            </button>
          ))}
        </div>
      </div>

      {/* Species List */}
      <AnimatePresence mode="wait">
        {selectedSpecies ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            {/* Back to list button */}
            <button
              onClick={() => setSelectedSpecies(null)}
              className="flex items-center text-emerald-400 hover:text-emerald-300 mb-4"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Back to Species</span>
            </button>

            {/* Species Detail */}
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <img
                src={selectedSpecies.image}
                alt={selectedSpecies.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedSpecies.name}</h2>
                  <p className="text-gray-400 italic">{selectedSpecies.scientificName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Fish size={16} className="mr-2 text-emerald-400" />
                    <span>Family: {selectedSpecies.family}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin size={16} className="mr-2 text-emerald-400" />
                    <span>Avg Size: {selectedSpecies.avgSize}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar size={16} className="mr-2 text-emerald-400" />
                    <span>Best Time: {selectedSpecies.bestTime}</span>
                  </div>
                  <div className="flex items-center text-emerald-400 font-semibold">
                    <span>Your Catches: {getCatchCount(selectedSpecies.name)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Habitat</h3>
                  <p className="text-gray-300 text-sm">{selectedSpecies.habitat}</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Diet</h3>
                  <p className="text-gray-300 text-sm">{selectedSpecies.diet}</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-gray-300 text-sm">{selectedSpecies.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {filteredSpecies.length === 0 ? (
              <div className="text-center py-20">
                <Fish size={64} className="mx-auto text-gray-500 mb-4" />
                <h2 className="text-white text-xl font-semibold mb-2">No species found</h2>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredSpecies.map((species, index) => (
                <motion.div
                  key={species.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSpecies(species)}
                  className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={species.image}
                      alt={species.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{species.name}</h3>
                      <p className="text-gray-400 text-sm italic">{species.scientificName}</p>
                      <p className="text-gray-500 text-xs">{species.family}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold text-sm">
                        {getCatchCount(species.name)} catches
                      </div>
                      <Info size={16} className="text-gray-400 mt-1" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};