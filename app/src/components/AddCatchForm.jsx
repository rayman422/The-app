import { useState } from 'react';
import { addCatch } from '../services/catches';
import toast from 'react-hot-toast';

export default function AddCatchForm({ userId, onAdded }) {
  const [species, setSpecies] = useState('Largemouth bass');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!species) { setError('Species required'); return; }
    setSaving(true);
    try {
      await addCatch(userId, { species, weight: weight || null, length: length || null, notes: notes || '' });
      setSpecies('Largemouth bass');
      setWeight('');
      setLength('');
      setNotes('');
      toast.success('Catch saved');
      onAdded?.();
    } catch (err) {
      setError('Failed to save catch');
      toast.error('Failed to save catch');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Species</label>
        <input value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Weight (lb)</label>
          <input type="number" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Length (in)</label>
          <input type="number" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg bg-slate-800 text-white p-2" rows={3} />
      </div>
      <button type="submit" disabled={saving} className="w-full bg-emerald-600 disabled:opacity-60 text-white rounded-xl py-2 font-semibold">
        {saving ? 'Saving…' : 'Save Catch'}
      </button>
    </form>
  );
}