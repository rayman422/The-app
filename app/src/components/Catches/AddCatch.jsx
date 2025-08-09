import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Fish, Ruler, Scale, Calendar, Upload, X } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { FishingDatabase } from '../../utils/firestoreCollections';
import { db } from '../../config/firebase';
import { LoadingSpinner, ErrorDisplay } from '../UI/LoadingStates';

export const AddCatch = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    species: '',
    speciesId: '',
    weight: '',
    length: '',
    notes: '',
    keptOrReleased: 'released',
    location: {
      coordinates: null,
      address: '',
      waterBodyName: '',
      waterType: 'lake',
      spotName: ''
    },
    environment: {
      airTemperature: '',
      waterTemperature: '',
      weatherCondition: '',
      windSpeed: '',
      windDirection: '',
      airPressure: '',
      moonPhase: '',
      tideInfo: null,
      visibility: '',
      cloudCover: ''
    },
    fishing: {
      bait: '',
      lure: '',
      technique: '',
      gearUsed: [],
      depth: '',
      timeOfDay: '',
      duration: ''
    },
    tags: []
  });

  const fileInputRef = useRef();
  const fishingDB = new FishingDatabase(db, import.meta.env.VITE_APP_ID);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleBasicChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const handleLocationSelect = (coordinates, address) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates,
        address
      }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.species || !formData.location.coordinates) {
      setError('Species and location are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload photos first
      const photoUrls = [];
      for (const photo of photos) {
        // TODO: Implement photo upload to Firebase Storage
        // For now, we'll use placeholder URLs
        photoUrls.push(photo.preview);
      }

      const catchData = {
        ...formData,
        photos: photoUrls,
        weight: parseFloat(formData.weight) || 0,
        length: parseFloat(formData.length) || 0,
        airTemperature: parseFloat(formData.environment.airTemperature) || null,
        waterTemperature: parseFloat(formData.environment.waterTemperature) || null,
        windSpeed: parseFloat(formData.environment.windSpeed) || null,
        airPressure: parseFloat(formData.environment.airPressure) || null,
        depth: parseFloat(formData.fishing.depth) || null,
        duration: parseFloat(formData.fishing.duration) || null
      };

      await fishingDB.addCatch(user.uid, catchData);
      
      // Clean up photo previews
      photos.forEach(photo => URL.revokeObjectURL(photo.preview));
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add catch');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Basic Catch Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Species *
          </label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => handleBasicChange('species', e.target.value)}
            placeholder="e.g., Largemouth Bass"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Weight (lbs)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleBasicChange('weight', e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Scale className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Length (inches)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => handleBasicChange('length', e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Ruler className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Kept or Released
          </label>
          <select
            value={formData.keptOrReleased}
            onChange={(e) => handleBasicChange('keptOrReleased', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="released">Released</option>
            <option value="kept">Kept</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleBasicChange('notes', e.target.value)}
            placeholder="Any additional notes about your catch..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Location & Environment</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Water Body Name
          </label>
          <input
            type="text"
            value={formData.location.waterBodyName}
            onChange={(e) => handleInputChange('location', 'waterBodyName', e.target.value)}
            placeholder="e.g., Lake Michigan"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Water Type
          </label>
          <select
            value={formData.location.waterType}
            onChange={(e) => handleInputChange('location', 'waterType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lake">Lake</option>
            <option value="river">River</option>
            <option value="ocean">Ocean</option>
            <option value="pond">Pond</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Air Temperature (°F)
            </label>
            <input
              type="number"
              value={formData.environment.airTemperature}
              onChange={(e) => handleInputChange('environment', 'airTemperature', e.target.value)}
              placeholder="72"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Water Temperature (°F)
            </label>
            <input
              type="number"
              value={formData.environment.waterTemperature}
              onChange={(e) => handleInputChange('environment', 'waterTemperature', e.target.value)}
              placeholder="68"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Weather Condition
          </label>
          <input
            type="text"
            value={formData.environment.weatherCondition}
            onChange={(e) => handleInputChange('environment', 'weatherCondition', e.target.value)}
            placeholder="e.g., Sunny, Cloudy, Rainy"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Wind Speed (mph)
            </label>
            <input
              type="number"
              value={formData.environment.windSpeed}
              onChange={(e) => handleInputChange('environment', 'windSpeed', e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Wind Direction
            </label>
            <input
              type="text"
              value={formData.environment.windDirection}
              onChange={(e) => handleInputChange('environment', 'windDirection', e.target.value)}
              placeholder="e.g., NW, SE"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Fishing Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Bait Used
          </label>
          <input
            type="text"
            value={formData.fishing.bait}
            onChange={(e) => handleInputChange('fishing', 'bait', e.target.value)}
            placeholder="e.g., Live minnow, Plastic worm"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Lure Used
          </label>
          <input
            type="text"
            value={formData.fishing.lure}
            onChange={(e) => handleInputChange('fishing', 'lure', e.target.value)}
            placeholder="e.g., Spinnerbait, Crankbait"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Technique
          </label>
          <input
            type="text"
            value={formData.fishing.technique}
            onChange={(e) => handleInputChange('fishing', 'technique', e.target.value)}
            placeholder="e.g., Casting, Trolling, Jigging"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Depth (feet)
            </label>
            <input
              type="number"
              value={formData.fishing.depth}
              onChange={(e) => handleInputChange('fishing', 'depth', e.target.value)}
              placeholder="10"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Time of Day
            </label>
            <select
              value={formData.fishing.timeOfDay}
              onChange={(e) => handleInputChange('fishing', 'timeOfDay', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select time</option>
              <option value="dawn">Dawn</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="dusk">Dusk</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.fishing.duration}
            onChange={(e) => handleInputChange('fishing', 'duration', e.target.value)}
            placeholder="120"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Photos & Review</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Catch Photos
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2">
                <Camera className="h-8 w-8" />
                <span>Click to add photos</span>
              </div>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.preview}
                      alt="Catch preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => handleBasicChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            placeholder="e.g., trophy, personal best, morning catch"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
        </div>

        {/* Summary */}
        <div className="bg-slate-800 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-white">Catch Summary</h4>
          <div className="text-sm text-slate-300 space-y-1">
            <p><strong>Species:</strong> {formData.species || 'Not specified'}</p>
            <p><strong>Weight:</strong> {formData.weight ? `${formData.weight} lbs` : 'Not specified'}</p>
            <p><strong>Length:</strong> {formData.length ? `${formData.length} inches` : 'Not specified'}</p>
            <p><strong>Location:</strong> {formData.location.waterBodyName || 'Not specified'}</p>
            <p><strong>Photos:</strong> {photos.length} uploaded</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Add New Catch</h2>
            <p className="text-slate-400">Step {step} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {error && (
            <ErrorDisplay
              message={error}
              onDismiss={() => setError(null)}
              className="mb-4"
            />
          )}
          
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Fish className="h-4 w-4" />
                    <span>Save Catch</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};