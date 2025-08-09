import { useState } from 'react';
import { useAuth } from '../Auth/AuthWrapper';
import { motion } from 'framer-motion';

export const Assistant = () => {
  const { apiClient } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  const canSend = apiClient && input.trim().length > 0;

  const onSend = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.hfTextGeneration(input.trim());
      setOutput(typeof res === 'string' ? res : (res.text || JSON.stringify(res)));
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20 text-white">
      <h1 className="text-xl font-bold mb-4 text-center">AI Assistant</h1>

      {!apiClient ? (
        <div className="text-center text-gray-400">Configure API to enable Hugging Face.</div>
      ) : (
        <form onSubmit={onSend} className="max-w-md mx-auto space-y-3">
          <textarea
            className="w-full bg-slate-800 rounded-lg p-3 border border-gray-700 focus:border-emerald-500 outline-none"
            rows={4}
            placeholder="Ask about fishing techniques, species, regulations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <motion.button
            whileHover={{ scale: canSend ? 1.02 : 1 }}
            whileTap={{ scale: canSend ? 0.98 : 1 }}
            disabled={!canSend || loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg py-2 font-semibold"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </motion.button>
        </form>
      )}

      {output && (
        <div className="max-w-md mx-auto mt-6 bg-slate-800 rounded-lg p-4 text-gray-200 whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
};