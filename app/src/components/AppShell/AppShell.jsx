import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../Auth/AuthWrapper';
import { BottomNavigation } from './BottomNavigation';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('home');

  // Don't render shell until auth is loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Bar */}
      <TopBar 
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        currentRoute={currentRoute}
      />

      {/* Main Content */}
      <main className="pb-20 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
      />
    </div>
  );
};