import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, HelpCircle, LogOut, Shield, User, Fish, MapPin, BarChart3 } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';

export const Sidebar = ({ isOpen, onClose, user, currentRoute, onRouteChange }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: User, description: 'Your fishing dashboard' },
    { id: 'catches', label: 'My Catches', icon: Fish, description: 'View and manage your catches' },
    { id: 'map', label: 'Map View', icon: MapPin, description: 'Explore fishing locations' },
    { id: 'stats', label: 'Statistics', icon: BarChart3, description: 'Your fishing analytics' },
  ];

  const settingsItems = [
    { id: 'profile', label: 'Edit Profile', icon: User, description: 'Update your profile information' },
    { id: 'privacy', label: 'Privacy Settings', icon: Shield, description: 'Manage your privacy preferences' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, description: 'Get help and contact support' },
    { id: 'settings', label: 'App Settings', icon: Settings, description: 'Configure app preferences' },
  ];

  const handleItemClick = (itemId) => {
    if (menuItems.some(item => item.id === itemId)) {
      onRouteChange(itemId);
    }
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-slate-800 z-50 shadow-xl"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-slate-600"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white">{user.name || 'Angler'}</h2>
                  <p className="text-sm text-slate-400">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-slate-400">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Settings Menu */}
            <div className="p-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                Settings
              </h3>
              <nav className="space-y-1">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-slate-400">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};