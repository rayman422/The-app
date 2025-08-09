import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Fish, Upload, MapPin, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const AddCatch = ({ setPage, fishingDB, storage }) => {
  const { userId } = useAuth();
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      species: '',
      weight: '',
      length: '',
      bait: '',
      lure: '',
      notes: '',
      isPublic: true,
      latitude: '',
      longitude: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const canSubmit = !!userId && !!fishingDB;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Load species list for suggestions
        const list = fishingDB ? await fishingDB.getSpecies() : [];
        if (isMounted) setSpeciesOptions(list.map(s => s.commonName));
      } catch {
        // ignore in demo/offline
      }
    })();
    return () => { isMounted = false; };
  }, [fishingDB]);

  const onPickLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setValue('latitude', latitude.toFixed(6));
        setValue('longitude', longitude.toFixed(6));
      },
      (err) => alert(`Location error: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onPhotosSelected = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);
  };

  const uploadPhotos = async (files) => {
    if (!storage || !userId || files.length === 0) return [];
    const uploaded = [];
    for (const file of files) {
      const path = `artifacts/${fishingDB.appId}/users/${userId}/catches/uploads/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploaded.push(url);
    }
    return uploaded;
  };

  const onSubmit = async (form) => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const photoUrls = await uploadPhotos(photos);
      const latitude = form.latitude ? parseFloat(form.latitude) : null;
      const longitude = form.longitude ? parseFloat(form.longitude) : null;

      await fishingDB.addCatch(userId, {
        species: form.species,
        weight: form.weight ? parseFloat(form.weight) : null,
        length: form.length ? parseFloat(form.length) : null,
        photos: photoUrls,
        notes: form.notes,
        keptOrReleased: 'released',
        location: latitude && longitude ? {
          coordinates: [longitude, latitude],
          address: '',
          waterBodyName: '',
          waterType: '',
          spotName: ''
        } : undefined,
        fishing: {
          bait: form.bait,
          lure: form.lure
        },
        isPublic: !!form.isPublic,
        dateTime: new Date().toISOString()
      });

      reset();
      setPhotos([]);
      alert('Catch logged!');
      setPage('profile');
    } catch (e) {
      console.error(e);
      alert(`Failed to log catch: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const speciesDatalistId = useMemo(() => 'species-list', []);

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-24">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <div className="bg-slate-800 rounded-xl p-4 text-white">
          <label className="block text-sm text-gray-300 mb-1">Species</label>
          <input list={speciesDatalistId} placeholder="e.g., Largemouth Bass" className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('species', { required: true })} />
          <datalist id={speciesDatalistId}>
            {speciesOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-xl p-4 text-white">
            <label className="block text-sm text-gray-300 mb-1">Weight (lb)</label>
            <input type="number" step="0.01" className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('weight')} />
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-white">
            <label className="block text-sm text-gray-300 mb-1">Length (in)</label>
            <input type="number" step="0.1" className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('length')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-xl p-4 text-white">
            <label className="block text-sm text-gray-300 mb-1">Bait</label>
            <input className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('bait')} />
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-white">
            <label className="block text-sm text-gray-300 mb-1">Lure</label>
            <input className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('lure')} />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 text-white">
          <label className="block text-sm text-gray-300 mb-1">Notes</label>
          <textarea rows={3} className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('notes')} />
        </div>

        <div className="bg-slate-800 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} />
              <span>Photos</span>
            </div>
            <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Upload size={16} /> Upload
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPhotosSelected} />
            </label>
          </div>
          {photos.length > 0 && (
            <div className="text-sm text-gray-300">{photos.length} file(s) selected</div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-4 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>Location</span>
            </div>
            <button type="button" onClick={onPickLocation} className="text-emerald-400 hover:text-emerald-300 text-sm">Use current location</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Latitude</label>
              <input className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('latitude')} />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Longitude</label>
              <input className="w-full bg-slate-700 rounded-lg p-2 outline-none" {...register('longitude')} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white">
          <input id="isPublic" type="checkbox" className="w-4 h-4" {...register('isPublic')} />
          <label htmlFor="isPublic" className="text-sm text-gray-300">Make this catch public</label>
        </div>

        <button disabled={!canSubmit || isSubmitting} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Catch'}
        </button>
      </form>
    </div>
  );
};