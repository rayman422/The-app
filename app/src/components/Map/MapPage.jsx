import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Map, MapPin, Navigation, Search, Filter, Plus, Info, Star, Clock, Fish } from 'lucide-react';

// Sample fishing spots data
const sampleFishingSpots = [
  {
    id: 1,
    name: 'Lake Michigan Pier',
    type: 'Pier',
    coordinates: { lat: 42.3314, lng: -83.0458 },
    rating: 4.5,
    difficulty: 'Easy',
    species: ['Salmon', 'Trout', 'Bass'],
    bestTime: 'Dawn/Dusk',
    description: 'Popular pier fishing spot with great salmon runs in fall.',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop',
    userCatches: 12
  },
  {
    id: 2,
    name: 'Detroit River',
    type: 'River',
    coordinates: { lat: 42.3314, lng: -83.0458 },
    rating: 4.2,
    difficulty: 'Medium',
    species: ['Walleye', 'Bass', 'Catfish'],
    bestTime: 'Spring',
    description: 'Excellent walleye fishing during spring spawning runs.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    userCatches: 8
  },
  {
    id: 3,
    name: 'Huron River',
    type: 'River',
    coordinates: { lat: 42.3314, lng: -83.0458 },
    rating: 3.8,
    difficulty: 'Easy',
    species: ['Bass', 'Pike', 'Panfish'],
    bestTime: 'Summer',
    description: 'Scenic river with good bass fishing and easy access.',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop',
    userCatches: 15
  },
  {
    id: 4,
    name: 'Lake St. Clair',
    type: 'Lake',
    coordinates: { lat: 42.3314, lng: -83.0458 },
    rating: 4.7,
    difficulty: 'Hard',
    species: ['Muskie', 'Bass', 'Walleye'],
    bestTime: 'Fall',
    description: 'World-class muskie fishing destination.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    userCatches: 5
  }
];

const spotTypes = ['All', 'Lake', 'River', 'Pier', 'Stream', 'Pond'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

export const MapPage = ({ setPage, fishingDB, userId }) => {
  const [spots, setSpots] = useState(sampleFishingSpots);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || spot.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'All' || spot.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const addSpot = (newSpot) => {
    const spotWithId = { 
      ...newSpot, 
      id: Date.now(),
      coordinates: userLocation || { lat: 42.3314, lng: -83.0458 },
      rating: 0,
      userCatches: 0
    };
    setSpots([...spots, spotWithId]);
    setShowAddSpot(false);
  };

  const getDistance = (spot) => {
    if (!userLocation) return 'Unknown';
    // Simple distance calculation (in a real app, use proper geolocation formulas)
    const distance = Math.sqrt(
      Math.pow(spot.coordinates.lat - userLocation.lat, 2) +
      Math.pow(spot.coordinates.lng - userLocation.lng, 2)
    ) * 69; // Rough conversion to miles
    return distance < 1 ? '< 1 mile' : `${distance.toFixed(1)} miles`;
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
        <h1 className="flex-1 text-center text-xl font-bold">Fishing Map</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddSpot(true)}
          className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'list'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'map'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Map View
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search fishing spots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {spotTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {showAddSpot ? (
          <AddSpotForm
            onSave={addSpot}
            onCancel={() => setShowAddSpot(false)}
            spotTypes={spotTypes.filter(t => t !== 'All')}
            difficulties={difficulties.filter(d => d !== 'All')}
          />
        ) : selectedSpot ? (
          <SpotDetail
            spot={selectedSpot}
            onBack={() => setSelectedSpot(null)}
            onNavigate={() => {
              // In a real app, this would open navigation
              alert(`Navigating to ${selectedSpot.name}`);
            }}
          />
        ) : viewMode === 'map' ? (
          <MapView
            spots={filteredSpots}
            userLocation={userLocation}
            onSpotSelect={setSelectedSpot}
          />
        ) : (
          <SpotList
            spots={filteredSpots}
            onSpotSelect={setSelectedSpot}
            getDistance={getDistance}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Spot List Component
const SpotList = ({ spots, onSpotSelect, getDistance }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-3"
  >
    {spots.length === 0 ? (
      <div className="text-center py-20">
        <Map size={64} className="mx-auto text-gray-500 mb-4" />
        <h2 className="text-white text-xl font-semibold mb-2">No spots found</h2>
        <p className="text-gray-400">Try adjusting your search or add a new spot!</p>
      </div>
    ) : (
      spots.map((spot, index) => (
        <motion.div
          key={spot.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSpotSelect(spot)}
          className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-start space-x-4">
            <img
              src={spot.image}
              alt={spot.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{spot.name}</h3>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-white text-sm">{spot.rating}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">{spot.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="px-2 py-1 bg-slate-700 rounded text-gray-300">{spot.type}</span>
                <span className="px-2 py-1 bg-slate-700 rounded text-gray-300">{spot.difficulty}</span>
                <span className="text-emerald-400">{getDistance(spot)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Fish size={14} className="text-emerald-400" />
                <span className="text-gray-400 text-xs">{spot.species.join(', ')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))
    )}
  </motion.div>
);

// Map View Component (Simplified - in a real app this would use a mapping library)
const MapView = ({ spots, userLocation, onSpotSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-slate-800 rounded-lg p-4"
  >
    <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center mb-4">
      <div className="text-center">
        <Map size={48} className="mx-auto text-gray-500 mb-2" />
        <p className="text-gray-400">Interactive Map</p>
        <p className="text-gray-500 text-sm">Map integration coming soon</p>
      </div>
    </div>
    
    <div className="space-y-2">
      {spots.map(spot => (
        <div
          key={spot.id}
          onClick={() => onSpotSelect(spot)}
          className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600"
        >
          <MapPin size={20} className="text-emerald-400" />
          <div className="flex-1">
            <p className="text-white font-medium">{spot.name}</p>
            <p className="text-gray-400 text-sm">{spot.type} • {spot.difficulty}</p>
          </div>
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="text-white text-sm">{spot.rating}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// Spot Detail Component
const SpotDetail = ({ spot, onBack, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    className="space-y-4"
  >
    <button
      onClick={onBack}
      className="flex items-center text-emerald-400 hover:text-emerald-300 mb-4"
    >
      <ChevronLeft size={20} />
      <span className="ml-1">Back to Spots</span>
    </button>

    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <img
        src={spot.image}
        alt={spot.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{spot.name}</h2>
          <div className="flex items-center gap-1">
            <Star size={20} className="text-yellow-400 fill-current" />
            <span className="text-white font-semibold">{spot.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-300">
            <MapPin size={16} className="mr-2 text-emerald-400" />
            <span>Type: {spot.type}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Info size={16} className="mr-2 text-emerald-400" />
            <span>Difficulty: {spot.difficulty}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock size={16} className="mr-2 text-emerald-400" />
            <span>Best Time: {spot.bestTime}</span>
          </div>
          <div className="flex items-center text-emerald-400 font-semibold">
            <Fish size={16} className="mr-2" />
            <span>{spot.userCatches} catches</span>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Species</h3>
          <div className="flex flex-wrap gap-2">
            {spot.species.map(species => (
              <span key={species} className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm">
                {species}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Description</h3>
          <p className="text-gray-300 text-sm">{spot.description}</p>
        </div>

        <button
          onClick={onNavigate}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation size={20} />
          Navigate to Spot
        </button>
      </div>
    </div>
  </motion.div>
);

// Add Spot Form Component
const AddSpotForm = ({ onSave, onCancel, spotTypes, difficulties }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: spotTypes[0],
    difficulty: difficulties[0],
    species: '',
    bestTime: 'Dawn/Dusk',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      species: formData.species.split(',').map(s => s.trim()).filter(s => s)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-800 rounded-lg p-4"
    >
      <h2 className="text-white text-xl font-bold mb-4">Add New Spot</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Spot Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            >
              {spotTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Species (comma-separated)</label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => setFormData({...formData, species: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Bass, Trout, Pike"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Best Time</label>
          <select
            value={formData.bestTime}
            onChange={(e) => setFormData({...formData, bestTime: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="Dawn/Dusk">Dawn/Dusk</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="All Day">All Day</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Describe the fishing spot..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Add Spot
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};