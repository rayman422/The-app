import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Fish, Camera, MapPin, Calendar, Ruler, Scale, Save, X } from 'lucide-react';

// Sample species for dropdown
const speciesList = [
  'Largemouth Bass',
  'Smallmouth Bass',
  'Rainbow Trout',
  'Brown Trout',
  'Walleye',
  'Northern Pike',
  'Muskellunge',
  'Channel Catfish',
  'Bluegill',
  'Crappie',
  'Yellow Perch',
  'Other'
];

// Sample locations
const sampleLocations = [
  'Lake Michigan Pier',
  'Detroit River',
  'Huron River',
  'Lake St. Clair',
  'Current Location'
];

export const AddCatch = ({ setPage, fishingDB, userId }) => {
  const [formData, setFormData] = useState({
    species: '',
    length: '',
    weight: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    weather: 'Sunny',
    temperature: '',
    lure: '',
    technique: '',
    notes: '',
    photo: null
  });
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

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

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const catchData = {
        ...formData,
        userId,
        timestamp: new Date().toISOString(),
        coordinates: userLocation,
        length: parseFloat(formData.length) || 0,
        weight: parseFloat(formData.weight) || 0,
        temperature: parseFloat(formData.temperature) || 0
      };

      if (fishingDB) {
        await fishingDB.addCatch(catchData);
      }

      // Reset form
      setFormData({
        species: '',
        length: '',
        weight: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        weather: 'Sunny',
        temperature: '',
        lure: '',
        technique: '',
        notes: '',
        photo: null
      });

      // Show success message
      alert('Catch logged successfully!');
      setPage('profile');
    } catch (error) {
      console.error('Error logging catch:', error);
      alert('Error logging catch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      setFormData({ ...formData, location: 'Current Location' });
    } else {
      alert('Unable to get current location. Please enter location manually.');
    }
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
        <h1 className="flex-1 text-center text-xl font-bold">Log a Catch</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Section */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Camera size={20} className="text-emerald-400" />
            Catch Photo
          </h2>
          
          {formData.photo ? (
            <div className="relative">
              <img
                src={formData.photo}
                alt="Catch"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, photo: null })}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <Camera size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 mb-4">Add a photo of your catch</p>
              <label className="bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Fish size={20} className="text-emerald-400" />
            Catch Details
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Species *</label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                required
              >
                <option value="">Select Species</option>
                {speciesList.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Length (inches)</label>
              <input
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData({...formData, length: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Temperature (°F)</label>
              <input
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="72"
              />
            </div>
          </div>
        </div>

        {/* Location and Time */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-emerald-400" />
            Location & Time
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
              <div className="flex gap-2">
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Location</option>
                  {sampleLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  <MapPin size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fishing Conditions */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-400" />
            Fishing Conditions
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Weather</label>
              <select
                value={formData.weather}
                onChange={(e) => setFormData({...formData, weather: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Sunny">Sunny</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Rainy">Rainy</option>
                <option value="Overcast">Overcast</option>
                <option value="Windy">Windy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Lure/Bait</label>
              <input
                type="text"
                value={formData.lure}
                onChange={(e) => setFormData({...formData, lure: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g., Rapala F11"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">Technique</label>
              <input
                type="text"
                value={formData.technique}
                onChange={(e) => setFormData({...formData, technique: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g., Slow retrieve, Jigging"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-4">Notes</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="4"
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Any additional notes about your catch, fishing conditions, or memorable moments..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.species}
          className="w-full bg-emerald-600 text-white py-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Logging Catch...
            </>
          ) : (
            <>
              <Save size={20} />
              Log Catch
            </>
          )}
        </button>
      </form>
    </div>
  );
};