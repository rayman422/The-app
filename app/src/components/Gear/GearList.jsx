import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, GitPullRequest, Plus } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { LocalStore } from '../../utils/localStore';

export const GearList = ({ setPage, fishingDB }) => {
  const { userId, appId } = useAuth();
  const store = useMemo(() => new LocalStore(appId, userId || 'demo-user'), [appId, userId]);
  const [items, setItems] = useState(store.listGear());
  const [form, setForm] = useState({ name: '', brand: '', category: '' });

  const addGear = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    const gearDoc = { ...form, createdAt: new Date().toISOString() };
    store.addGear(gearDoc);
    if (fishingDB && userId) {
      try { await fishingDB.addGear(userId, gearDoc); } catch (err) { console.warn('fishingDB.addGear failed', err); }
    }
    setItems(store.listGear());
    setForm({ name: '', brand: '', category: '' });
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('profile')} className="p-2 -ml-2 rounded-lg hover:bg-slate-800">
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Your Gear</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={addGear} className="grid grid-cols-3 gap-2 mb-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
        <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand" className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="col-span-3 bg-emerald-600 text-white rounded-lg py-2 flex items-center justify-center">
          <Plus size={16} className="mr-2" /> Add Gear
        </motion.button>
      </form>

      {items.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <GitPullRequest size={48} className="mx-auto mb-2" />
          No gear yet. Add your first item above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((g) => (
            <div key={g.id} className="bg-slate-800 rounded-xl p-4 text-white">
              <div className="font-semibold">{g.name}</div>
              <div className="text-sm text-gray-300">{g.brand || '—'} • {g.category || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};