import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, GitPullRequest, Plus, Trash2, Pencil, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const GearList = ({ setPage, fishingDB, storage }) => {
  const { userId } = useAuth();
  const [gear, setGear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', model: '', category: 'rod', notes: '' });
  const [imageFile, setImageFile] = useState(null);

  const canUse = !!userId && !!fishingDB;

  const load = useCallback(async () => {
    if (!canUse) { setLoading(false); return; }
    setLoading(true);
    try {
      const list = await fishingDB.getUserGear(userId);
      setGear(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [canUse, fishingDB, userId]);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canUse) return;
    try {
      let images = [];
      if (imageFile && storage) {
        const path = `artifacts/${fishingDB.appId}/users/${userId}/gear/${Date.now()}-${imageFile.name}`;
        const r = ref(storage, path);
        await uploadBytes(r, imageFile);
        const url = await getDownloadURL(r);
        images = [url];
      }
      if (editing) {
        await fishingDB.updateGear(userId, editing.id, { ...form, images: images.length ? images : editing.images || [] });
      } else {
        await fishingDB.addGear(userId, { ...form, images });
      }
      setShowForm(false);
      setForm({ name: '', brand: '', model: '', category: 'rod', notes: '' });
      setImageFile(null);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to save gear');
    }
  };

  const onDelete = async (id) => {
    if (!canUse) return;
    try {
      await fishingDB.deleteGear(userId, id);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to delete gear');
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
        <h1 className="flex-1 text-center text-xl font-bold">Your Gear</h1>
        <div className="w-10"></div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Gear
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading...</div>
      ) : gear.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <GitPullRequest size={64} className="mx-auto text-gray-500 mb-4" />
          No gear yet.
        </div>
      ) : (
        <div className="space-y-3">
          {gear.map(item => (
            <div key={item.id} className="bg-slate-800 rounded-xl p-4 text-white flex items-center justify-between">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-300">{item.brand} {item.model}</div>
                <div className="text-xs text-gray-400">{item.category}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing(item); setForm({ name: item.name, brand: item.brand, model: item.model, category: item.category, notes: item.notes || '' }); setShowForm(true); }} className="p-2 rounded-lg hover:bg-slate-700">
                  <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg hover:bg-slate-700 text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{editing ? 'Edit Gear' : 'Add Gear'}</div>
              <button onClick={() => setShowForm(false)} className="text-gray-400">Close</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800 rounded-lg p-2 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Brand</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full bg-slate-800 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Model</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="w-full bg-slate-800 rounded-lg p-2 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 rounded-lg p-2 outline-none">
                  <option value="rod">Rod</option>
                  <option value="reel">Reel</option>
                  <option value="lure">Lure</option>
                  <option value="line">Line</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full bg-slate-800 rounded-lg p-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Image</label>
                <label className="cursor-pointer bg-slate-800 rounded-lg p-2 flex items-center gap-2 text-gray-300">
                  <Upload size={16} /> Choose file
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-slate-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};