import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider.jsx';

const AppShell = lazy(() => import('./shell/AppShell.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage.jsx'));
const SpeciesPage = lazy(() => import('./pages/SpeciesPage.jsx'));
const GearPage = lazy(() => import('./pages/GearPage.jsx'));
const ForecastPage = lazy(() => import('./pages/ForecastPage.jsx'));
const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const AddCatchPage = lazy(() => import('./pages/AddCatchPage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage.jsx'));

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading…</div>;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Protected><ProfilePage /></Protected> },
      { path: 'statistics', element: <Protected><StatisticsPage /></Protected> },
      { path: 'species', element: <Protected><SpeciesPage /></Protected> },
      { path: 'gear', element: <Protected><GearPage /></Protected> },
      { path: 'forecast', element: <Protected><ForecastPage /></Protected> },
      { path: 'map', element: <Protected><MapPage /></Protected> },
      { path: 'add-catch', element: <Protected><AddCatchPage /></Protected> },
      { path: 'signin', element: <SignInPage /> },
    ],
  },
]);