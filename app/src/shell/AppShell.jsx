import React, { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, BarChart2, Plus, GitPullRequest, CloudSun, Map as MapIcon } from 'lucide-react';

export default function AppShell() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <style>{`body { background-color: #0f172a; font-family: 'Inter', sans-serif; }`}</style>
      <div className="max-w-md mx-auto pb-20">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading…</div>}>
          <Outlet />
        </Suspense>
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-gray-700 p-2 flex justify-around items-center">
          <Link to="/map" className="flex flex-col items-center text-gray-400 p-2">
            <MapIcon size={24} className={current === '/map' ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${current === '/map' ? 'text-white' : ''}`}>Map</span>
          </Link>
          <Link to="/statistics" className="flex flex-col items-center text-gray-400 p-2">
            <BarChart2 size={24} className={current === '/statistics' ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${current === '/statistics' ? 'text-white' : ''}`}>Stats</span>
          </Link>
          <Link to="/add-catch" className="flex flex-col items-center text-gray-400 p-2">
            <Plus size={24} className={current === '/add-catch' ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${current === '/add-catch' ? 'text-white' : ''}`}>Add Catch</span>
          </Link>
          <Link to="/gear" className="flex flex-col items-center text-gray-400 p-2">
            <GitPullRequest size={24} className={current === '/gear' ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${current === '/gear' ? 'text-white' : ''}`}>Gear</span>
          </Link>
          <Link to="/forecast" className="flex flex-col items-center text-gray-400 p-2">
            <CloudSun size={24} className={current === '/forecast' ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${current === '/forecast' ? 'text-white' : ''}`}>Forecast</span>
          </Link>
          <Link to="/" className="flex flex-col items-center text-gray-400 p-2">
            <User size={24} className={current === '/' ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${current === '/' ? 'text-white' : ''}`}>You</span>
          </Link>
        </div>
      </div>
    </div>
  );
}