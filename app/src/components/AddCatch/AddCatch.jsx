import { LoadingSpinner, ErrorDisplay } from '../Common/LoadingStates';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { weatherService } from '../../services/weatherService';

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
        try {
          const photoRef = ref(storage, `users/${user.uid}/catches/${Date.now()}_${photo.name}`);
          const uploadResult = await uploadBytes(photoRef, photo.file);
          const downloadURL = await getDownloadURL(uploadResult.ref);
          photoUrls.push(downloadURL);
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          setError(`Failed to upload photo: ${uploadError.message}`);
          return;
        }
      }
      
      // Capture weather data if location is available
      let weatherData = null;
      if (formData.location.coordinates && weatherService.isAvailable()) {
        try {
          weatherData = await weatherService.getWeatherForCatch(formData.location);
        } catch (weatherError) {
          console.warn('Weather data capture failed:', weatherError);
          // Continue without weather data
        }
      }

      const catchData = {
        ...formData,
        photos: photoUrls,
        weather: weatherData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await fishingDB.addCatch(user.uid, catchData);
      photos.forEach(photo => URL.revokeObjectURL(photo.preview));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add catch');
    } finally {
      setIsLoading(false);
    }
  };