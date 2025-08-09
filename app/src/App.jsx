import { useState, useEffect } from 'react';
import { AuthProvider } from './components/Auth/AuthWrapper';
import { LoginScreen } from './components/Auth/LoginScreen';
import { MainApp } from './components/MainApp';
import { useAuth } from './components/Auth/AuthWrapper';
import { FishingDatabase } from './utils/firestoreCollections';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from './config/firebase';
import './index.css';

// Get app ID from environment
const appId = import.meta.env.VITE_APP_ID || 'fishing-app-dev';

// Initialize database helper
const fishingDB = db ? new FishingDatabase(db, appId) : null;

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your fishing journey...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <LoginScreen 
          key={showSignUp ? 'signup' : 'signin'}
          isSignUp={showSignUp}
          onToggleMode={() => setShowSignUp(!showSignUp)}
        />
      </AnimatePresence>
    );
  }

  return <MainApp fishingDB={fishingDB} storage={storage} />;
};

const App = () => {
  useEffect(() => {
    // Set global styles
    const style = document.createElement('style');
    style.textContent = `
      body { 
        background-color: #0f172a; 
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      
      /* Custom scrollbar */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Smooth transitions */
      * {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
      
      /* Custom focus styles */
      input:focus, button:focus, textarea:focus {
        outline: 2px solid #10b981;
        outline-offset: 2px;
      }
      
      /* Loading animations */
      @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }
      
      .loading-shimmer {
        background: linear-gradient(90deg, #1e293b 0px, #334155 40px, #1e293b 80px);
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <AuthProvider appId={appId}>
      <div className="min-h-screen bg-slate-900 font-sans">
        <div className="max-w-md mx-auto relative">
          <AppContent />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
