import { motion } from 'framer-motion';
import { ChevronLeft, BarChart2 } from 'lucide-react';

export const Statistics = ({ setPage }) => {
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
        <h1 className="flex-1 text-center text-xl font-bold">Your Statistics</h1>
        <div className="w-10"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <BarChart2 size={64} className="mx-auto text-gray-500 mb-4" />
        <h2 className="text-white text-xl font-semibold mb-2">Statistics Coming Soon</h2>
        <p className="text-gray-400">
          Your detailed fishing analytics and insights will be available here.
        </p>
      </motion.div>
    </div>
  );
};