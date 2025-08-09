import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

// Error Toast Component
export const ErrorToast = ({ 
  message, 
  type = 'error', 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const typeConfig = {
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-600',
      borderColor: 'border-red-500',
      textColor: 'text-red-100',
      iconColor: 'text-red-200'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-600',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-100',
      iconColor: 'text-yellow-200'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-600',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-200'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-600',
      borderColor: 'border-green-500',
      textColor: 'text-green-100',
      iconColor: 'text-green-200'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${positionClasses[position]} max-w-sm w-full`}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg overflow-hidden`}>
            <div className="flex items-start p-4">
              <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
              <div className={`ml-3 flex-1 ${config.textColor}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
              <button
                onClick={handleClose}
                className={`ml-4 ${config.textColor} hover:opacity-75 transition-opacity`}
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ toasts, onRemoveToast, position = 'top-right' }) => {
  return (
    <div className={`fixed z-50 ${position === 'top-right' ? 'top-4 right-4' : 'bottom-4 right-4'} space-y-2`}>
      {toasts.map((toast) => (
        <ErrorToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemoveToast(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 rounded-lg p-6 text-center">
            <div className="mx-auto h-16 w-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-slate-400 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-slate-400 cursor-pointer hover:text-slate-300">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-slate-900 rounded text-xs text-slate-300 overflow-auto">
                  <pre>{this.state.error.toString()}</pre>
                  <pre className="mt-2">{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Display Component
export const ErrorDisplay = ({ 
  error, 
  title = 'An error occurred', 
  message = 'Something went wrong. Please try again.',
  onRetry,
  onDismiss
}) => {
  return (
    <motion.div
      className="bg-red-600/20 border border-red-500/30 rounded-lg p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-200">{title}</h3>
          <p className="text-sm text-red-300 mt-1">{message}</p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-red-300 cursor-pointer hover:text-red-200">
                Error Details
              </summary>
              <pre className="mt-1 text-xs text-red-300 bg-red-900/30 p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          
          <div className="flex space-x-2 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Network Error Component
export const NetworkError = ({ onRetry, onOfflineMode }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg p-6 text-center">
        <div className="mx-auto h-16 w-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          Connection Error
        </h2>
        
        <p className="text-slate-400 mb-6">
          Unable to connect to the server. Please check your internet connection and try again.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
          
          {onOfflineMode && (
            <button
              onClick={onOfflineMode}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Continue Offline
            </button>
          )}
        </div>
      </div>
    </div>
  );
};