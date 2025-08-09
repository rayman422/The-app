import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Scale, MapPin, Clock } from 'lucide-react';

export const TermsOfService = ({ onAccept, onDecline }) => {
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
          <FileText className="h-8 w-8 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Acceptance of Terms</h3>
            <p className="text-slate-300 leading-relaxed">
              By using this fishing tracking application, you agree to these terms and conditions. 
              If you do not agree, please do not use the service.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Important Disclaimers</h4>
                <p className="text-slate-300 leading-relaxed">
                  This app is designed to help you track your fishing activities and is for entertainment 
                  and personal record-keeping purposes only.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Scale className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Fishing Regulations Disclaimer</h4>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mt-2">
                  <p className="text-red-200 font-medium mb-2">⚠️ CRITICAL DISCLAIMER</p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Fishing regulations and information provided in this app are for reference only.</strong> 
                    It is your responsibility to:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 mt-2 space-y-1">
                    <li>Verify all fishing regulations with local authorities</li>
                    <li>Check current fishing seasons and limits</li>
                    <li>Obtain proper fishing licenses and permits</li>
                    <li>Follow all local, state, and federal fishing laws</li>
                    <li>Respect catch limits and size restrictions</li>
                  </ul>
                  <p className="text-slate-300 mt-2">
                    <strong>We are not responsible for:</strong> Any violations of fishing regulations, 
                    fines, or legal consequences resulting from the use of this app.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Location & Weather Data</h4>
                <p className="text-slate-300 leading-relaxed">
                  Weather and location data are provided by third-party services. We do not guarantee 
                  the accuracy, completeness, or reliability of this information. Always verify 
                  conditions before fishing.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-purple-500 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-white">Service Availability</h4>
                <p className="text-slate-300 leading-relaxed">
                  We strive to provide reliable service but cannot guarantee uninterrupted access. 
                  The app may be temporarily unavailable due to maintenance or technical issues.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">User Responsibilities</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Provide accurate and truthful information</li>
              <li>Respect the privacy of other users</li>
              <li>Not use the service for illegal activities</li>
              <li>Report any bugs or issues you encounter</li>
              <li>Keep your account credentials secure</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Limitation of Liability</h4>
            <p className="text-slate-300 leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-2">Changes to Terms</h4>
            <p className="text-slate-300">
              We reserve the right to modify these terms at any time. Continued use of the service 
              after changes constitutes acceptance of the new terms.
            </p>
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
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Accept & Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};