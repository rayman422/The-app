import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const AppShell = lazy(() => import('./shell/AppShell.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage.jsx'));
const SpeciesPage = lazy(() => import('./pages/SpeciesPage.jsx'));
const GearPage = lazy(() => import('./pages/GearPage.jsx'));
const ForecastPage = lazy(() => import('./pages/ForecastPage.jsx'));
const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const AddCatchPage = lazy(() => import('./pages/AddCatchPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <ProfilePage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'species', element: <SpeciesPage /> },
      { path: 'gear', element: <GearPage /> },
      { path: 'forecast', element: <ForecastPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'add-catch', element: <AddCatchPage /> },
    ],
  },
]);