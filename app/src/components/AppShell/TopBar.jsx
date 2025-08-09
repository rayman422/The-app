import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';

export const TopBar = ({ user, onMenuClick, currentRoute }) => {
  const { logout } = useAuth();

  const getRouteTitle = (route) => {
    switch (route) {
      case 'home': return 'Home';
      case 'catches': return 'My Catches';
      case 'add-catch': return 'Add Catch';
      case 'gear': return 'My Gear';
      case 'profile': return 'Profile';
      case 'map': return 'Map';
      case 'stats': return 'Statistics';
      default: return 'Fishing App';
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white">
              {getRouteTitle(currentRoute)}
            </h1>
          </div>
        </div>

        {/* Center Section - Mobile Title */}
        <div className="sm:hidden">
          <h1 className="text-lg font-semibold text-white">
            {getRouteTitle(currentRoute)}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-2 ml-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full border-2 border-slate-600"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};