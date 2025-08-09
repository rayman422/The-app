import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Eye, Database, Trash2 } from 'lucide-react';

export const PrivacyPolicy = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-slate-700">
          <Shield className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Data Collection & Use</h3>
            <p className="text-slate-300 leading-relaxed">
              We collect and use your information to provide fishing tracking services, improve our app, 
              and ensure a personalized experience. Your privacy is important to us.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-green-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Location Services</h4>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Location Consent Required:</strong> We request access to your location to:
                </p>
                <ul className="list-disc list-inside text-slate-300 mt-2 space-y-1">
                  <li>Automatically capture weather conditions for your catches</li>
                  <li>Provide accurate fishing spot information</li>
                  <li>Enable map-based features and nearby spot discovery</li>
                  <li>Improve fishing recommendations based on your area</li>
                </ul>
                <p className="text-slate-300 mt-2">
                  <strong>You can:</strong> Deny location access and still use the app with manual location entry.
                  Your location data is stored securely and never shared with third parties.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Eye className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Profile Visibility</h4>
                <p className="text-slate-300 leading-relaxed">
                  You control who can see your profile and catch data. Choose between public and private profiles.
                  Private profiles ensure only you can view your fishing data.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Database className="h-6 w-6 text-purple-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Data Storage</h4>
                <p className="text-slate-300 leading-relaxed">
                  Your data is stored securely in Firebase with encryption at rest and in transit. 
                  We implement industry-standard security measures to protect your information.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Trash2 className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Data Deletion</h4>
                <p className="text-slate-300 leading-relaxed">
                  You can delete your account at any time. This will permanently remove all your data, 
                  including catches, photos, and profile information.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-2">Your Rights</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Control profile visibility</li>
              <li>Opt-out of location tracking</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700">
          <button 
            onClick={onDecline} 
            className="px-6 py-3 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={onAccept} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Accept & Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};