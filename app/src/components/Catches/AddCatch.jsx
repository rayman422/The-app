import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Fish } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { LocalStore } from '../../utils/localStore';

export const AddCatch = ({ setPage, fishingDB }) => {
  const { userId, appId, apiClient } = useAuth();
  const store = new LocalStore(appId, userId || 'demo-user');
  const [form, setForm] = useState({
    species: '',
    weight: '',
    length: '',
    notes: '',
    waterBodyName: '',
    isPublic: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const catchDoc = {
        species: form.species.trim(),
        weight: form.weight ? Number(form.weight) : null,
        length: form.length ? Number(form.length) : null,
        notes: form.notes.trim(),
        keptOrReleased: 'released',
        location: { waterBodyName: form.waterBodyName.trim() },
        dateTime: new Date().toISOString(),
        isPublic: !!form.isPublic,
      };

      // Local store first
      store.addCatch(catchDoc);

      // Firestore optional
      if (fishingDB && userId) {
        try { await fishingDB.addCatch(userId, catchDoc); } catch (err) { console.warn('fishingDB.addCatch failed', err); }
      }

      // API optional
      if (apiClient && userId) {
        try { await apiClient.createCatch(userId, catchDoc); } catch (err) { console.warn('apiClient.createCatch failed', err); }
      }

      setPage('profile');
    } catch (e2) {
      setError(e2.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('profile')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Log a Catch</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="text-center">
          <Fish size={48} className="mx-auto text-gray-500" />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Species</label>
          <input value={form.species} onChange={(e) => handleChange('species', e.target.value)} className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" placeholder="e.g., Largemouth Bass" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Weight (lb)</label>
            <input type="number" step="0.01" value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Length (in)</label>
            <input type="number" step="0.1" value={form.length} onChange={(e) => handleChange('length', e.target.value)} className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Water body</label>
          <input value={form.waterBodyName} onChange={(e) => handleChange('waterBodyName', e.target.value)} className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" placeholder="e.g., Lake Hartwell" />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" placeholder="Optional details" />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={saving} className="w-full bg-emerald-600 text-white rounded-xl py-3 px-4 font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center">
          {saving ? 'Saving…' : (<><Plus size={18} className="mr-2" /> Save Catch</>)}
        </motion.button>
      </form>
    </div>
  );
};