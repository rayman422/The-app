import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Fish } from 'lucide-react';

export const AddCatch = ({ setPage }) => (
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
      className="text-center py-20"
    >
      <div className="relative mb-6">
        <Fish size={64} className="mx-auto text-gray-500" />
        <Plus size={24} className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1" />
      </div>
      <h2 className="text-white text-xl font-semibold mb-2">Enhanced Catch Logging Coming Soon</h2>
      <p className="text-gray-400 px-4">
        Log catches with photos, species identification, GPS location, weather conditions, and detailed fishing data.
      </p>
    </motion.div>
  </div>
);