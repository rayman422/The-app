import React from 'react';
import { motion } from 'framer-motion';
import { Home, Fish, Plus, MapPin, BarChart3, User } from 'lucide-react';

export const BottomNavigation = ({ currentRoute, onRouteChange }) => {
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'catches', label: 'Catches', icon: Fish },
    { id: 'add-catch', label: 'Add', icon: Plus },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onRouteChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-blue-400 bg-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
              aria-label={item.label}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};