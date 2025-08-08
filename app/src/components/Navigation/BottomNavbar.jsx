import { motion } from 'framer-motion';
import {
  User,
  BarChart2,
  Plus,
  Map as MapIcon,
  CloudSun,
  GitPullRequest,
} from 'lucide-react';

const NavButton = ({ icon, label, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
      isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-300'
    }`}
  >
    <motion.div
      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {icon}
    </motion.div>
    <span className={`text-xs mt-1 ${isActive ? 'text-emerald-400' : ''}`}>
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute -top-1 w-1 h-1 bg-emerald-400 rounded-full"
        initial={false}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </motion.button>
);

export const BottomNavbar = ({ currentPage, setPage }) => {
  const navItems = [
    { key: 'map', icon: <MapIcon size={24} />, label: 'Map' },
    { key: 'statistics', icon: <BarChart2 size={24} />, label: 'Stats' },
    { key: 'addCatch', icon: <Plus size={24} />, label: 'Add', isSpecial: true },
    { key: 'gear', icon: <GitPullRequest size={24} />, label: 'Gear' },
    { key: 'forecast', icon: <CloudSun size={24} />, label: 'Weather' },
    { key: 'profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-gray-700"
    >
      <div className="max-w-md mx-auto px-2 py-1">
        <div className="flex justify-around items-center relative">
          {navItems.map((item) => (
            <div key={item.key} className="relative">
              {item.isSpecial ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage(item.key)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-colors"
                >
                  {item.icon}
                </motion.button>
              ) : (
                <NavButton
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPage === item.key}
                  onClick={() => setPage(item.key)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};