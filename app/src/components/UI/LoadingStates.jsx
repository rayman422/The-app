import React from 'react';
import { motion } from 'framer-motion';

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

// Loading Skeleton
export const LoadingSkeleton = ({ className = '', lines = 1, height = 'h-4' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={`${height} bg-slate-700 rounded animate-pulse`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// Card Skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-slate-700 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-700 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="h-32 bg-slate-700 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-700 rounded animate-pulse" />
        <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
};

// List Skeleton
export const ListSkeleton = ({ items = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-slate-700 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-slate-700 rounded w-3/4 animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-700 px-4 py-3">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-slate-600 rounded w-20 animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-slate-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-slate-700 rounded w-16 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Full Page Loading
export const FullPageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" color="blue" />
        <motion.p
          className="text-slate-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

// Inline Loading
export const InlineLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center space-x-2 text-slate-400">
      <LoadingSpinner size="sm" color="white" />
      <span className="text-sm">{message}</span>
    </div>
  );
};