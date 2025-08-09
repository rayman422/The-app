import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PrivacyPolicy } from '../Legal/PrivacyPolicy';
import { TermsOfService } from '../Legal/TermsOfService';

export const LocationConsent = ({ onConsent, onDecline, onComplete }) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [consentStep, setConsentStep] = useState('legal'); // 'legal', 'location', 'complete'
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if location permission has already been granted
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        if (result.state === 'granted') {
          setConsentStep('complete');
        }
      });
    }
  }, []);

  const handleLegalAccept = () => {
    setShowPrivacyPolicy(false);
    setShowTermsOfService(false);
    setConsentStep('location');
  };

  const handleLegalDecline = () => {
    onDecline?.();
  };

  const requestLocationPermission = async () => {
    if (!('geolocation' in navigator)) {
      setLocationPermission('unsupported');
      return;
    }

    setIsLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      setLocationPermission('granted');
      setConsentStep('complete');
      
      // Log consent with timestamp
      const consentData = {
        timestamp: new Date().toISOString(),
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        granted: true
      };
      
      // Store consent in localStorage for now (in production, this would go to Firestore)
      localStorage.setItem('locationConsent', JSON.stringify(consentData));
      
      onConsent?.(consentData);
    } catch (error) {
      console.error('Location permission denied:', error);
      setLocationPermission('denied');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationDecline = () => {
    setLocationPermission('denied');
    setConsentStep('complete');
    
    // Log declined consent
    const consentData = {
      timestamp: new Date().toISOString(),
      granted: false,
      reason: 'user_declined'
    };
    
    localStorage.setItem('locationConsent', JSON.stringify(consentData));
    onDecline?.(consentData);
  };

  const renderLegalStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <Shield className="h-16 w-16 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Welcome to Fishing Tracker</h2>
        <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
          Before we get started, we need you to review and accept our Privacy Policy and Terms of Service.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowPrivacyPolicy(true)}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Review Privacy Policy
        </button>
        <button
          onClick={() => setShowTermsOfService(true)}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Review Terms of Service
        </button>
      </div>

      <p className="text-slate-400 text-sm">
        You must accept both documents to continue using the app.
      </p>
    </div>
  );

  const renderLocationStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <MapPin className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Location Access</h2>
        <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
          We'd like to access your location to provide better fishing tracking features like:
        </p>
        <ul className="text-slate-300 space-y-2 text-left max-w-sm mx-auto">
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Automatic weather capture</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Fishing spot recommendations</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Map-based features</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={requestLocationPermission}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Requesting...' : 'Allow Location Access'}
        </button>
        <button
          onClick={handleLocationDecline}
          className="w-full px-6 py-3 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
        >
          Skip for Now
        </button>
      </div>

      <div className="bg-slate-700 rounded-lg p-4 text-left">
        <h4 className="font-medium text-white mb-2">What happens if I skip?</h4>
        <p className="text-slate-300 text-sm">
          You can still use all app features! You'll just need to manually enter your location 
          when adding catches, and weather data won't be automatically captured.
        </p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        {locationPermission === 'granted' ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Location Access Granted!</h2>
            <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
              Great! We'll now automatically capture your location and weather data 
              to enhance your fishing tracking experience.
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-yellow-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Location Access Skipped</h2>
            <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
              No problem! You can manually enter locations and still enjoy all the 
              fishing tracking features. You can change this later in settings.
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => onComplete?.()}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Get Started
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (consentStep) {
      case 'legal':
        return renderLegalStep();
      case 'location':
        return renderLocationStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderLegalStep();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.9 }} 
          className="bg-slate-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-500" />
              <h1 className="text-lg font-semibold text-white">Setup Required</h1>
            </div>
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${consentStep === 'legal' ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <div className={`w-3 h-3 rounded-full ${consentStep === 'location' ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <div className={`w-3 h-3 rounded-full ${consentStep === 'complete' ? 'bg-blue-500' : 'bg-slate-600'}`} />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {renderStepContent()}
          </div>
        </motion.div>
      </div>

      {/* Legal Modals */}
      <AnimatePresence>
        {showPrivacyPolicy && (
          <PrivacyPolicy 
            onAccept={handleLegalAccept}
            onDecline={handleLegalDecline}
          />
        )}
        {showTermsOfService && (
          <TermsOfService 
            onAccept={handleLegalAccept}
            onDecline={handleLegalDecline}
          />
        )}
      </AnimatePresence>
    </>
  );
};