import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from './useAuth.js';

export default function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading…</div>;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return children;
}