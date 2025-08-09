import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Fish } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';

export const AddCatch = ({ setPage }) => {
  const { apiClient, userId } = useAuth();
  const [form, setForm] = useState({ species: '', weight: '', length: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const canSubmit = apiClient && userId && form.species.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setError('');
      await apiClient.createCatch(userId, {
        species: form.species.trim(),
        weight: form.weight ? Number(form.weight) : 0,
        length: form.length ? Number(form.length) : 0,
        dateTime: new Date().toISOString(),
        isPublic: true,
      });
      setSuccess(true);
      setTimeout(() => setPage('profile'), 1000);
    } catch (err) {
      setError(err.message || 'Failed to save catch');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-slate-800 rounded-xl p-4 text-white"
      >
        {!apiClient ? (
          <div className="text-center py-10">
            <div className="relative mb-6">
              <Fish size={64} className="mx-auto text-gray-500" />
              <Plus size={24} className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1" />
            </div>
            <p className="text-gray-400">Connect API to enable catch logging.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Species</label>
              <input
                className="w-full bg-slate-900 rounded-lg px-3 py-2 border border-gray-700 focus:border-emerald-500 outline-none"
                placeholder="e.g., Largemouth Bass"
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-slate-900 rounded-lg px-3 py-2 border border-gray-700 focus:border-emerald-500 outline-none"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Length (in)</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-slate-900 rounded-lg px-3 py-2 border border-gray-700 focus:border-emerald-500 outline-none"
                  value={form.length}
                  onChange={(e) => setForm({ ...form, length: e.target.value })}
                />
              </div>
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {success && <div className="text-emerald-400 text-sm">Saved!</div>}
            <motion.button
              whileHover={{ scale: canSubmit ? 1.02 : 1 }}
              whileTap={{ scale: canSubmit ? 0.98 : 1 }}
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg py-2 font-semibold"
            >
              {submitting ? 'Saving...' : 'Save Catch'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};