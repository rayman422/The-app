import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Users, User } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { FishingDatabase } from '../../utils/firestoreCollections';
import { db } from '../../config/firebase';

export const ProfilePrivacyToggle = ({ onToggle, className = '' }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPublic, setIsPublic] = useState(user?.profile?.isPublic ?? false);
  
  const fishingDB = new FishingDatabase(db, import.meta.env.VITE_APP_ID);

  const handleToggle = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newPrivacySetting = !isPublic;
      
      // Update profile in Firestore
      await fishingDB.updateUserProfile(user.uid, {
        isPublic: newPrivacySetting,
        updatedAt: new Date()
      });
      
      // Update local state
      setIsPublic(newPrivacySetting);
      
      // Notify parent component
      onToggle?.(newPrivacySetting);
      
    } catch (err) {
      setError(err.message || 'Failed to update privacy setting');
      console.error('Privacy toggle error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrivacyDescription = () => {
    if (isPublic) {
      return {
        title: 'Public Profile',
        description: 'Other users can view your profile and basic information',
        icon: Users,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
      };
    } else {
      return {
        title: 'Private Profile',
        description: 'Only you can view your profile and fishing data',
        icon: User,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
      };
    }
  };

  const privacyInfo = getPrivacyDescription();
  const IconComponent = privacyInfo.icon;

  return (
    <div className={`bg-slate-800 rounded-lg p-4 border ${privacyInfo.borderColor} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${privacyInfo.bgColor}`}>
            <IconComponent className={`h-5 w-5 ${privacyInfo.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">{privacyInfo.title}</h3>
            <p className="text-slate-300 text-sm mt-1">{privacyInfo.description}</p>
            
            {isPublic && (
              <div className="mt-3 p-3 bg-slate-700 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Public Profile Shows:</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Your display name and bio</li>
                  <li>• Profile picture</li>
                  <li>• General location (city/region)</li>
                  <li>• Fishing statistics summary</li>
                </ul>
                <p className="text-xs text-slate-400 mt-2">
                  Your catches, gear, and detailed location data remain private.
                </p>
              </div>
            )}
            
            {!isPublic && (
              <div className="mt-3 p-3 bg-slate-700 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Private Profile:</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Only you can see your profile</li>
                  <li>• All fishing data is completely private</li>
                  <li>• No information shared with other users</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-3">
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              isPublic ? 'bg-green-600' : 'bg-slate-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          
          <div className="text-right">
            <span className="text-xs text-slate-400">
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded-lg"
        >
          <p className="text-red-200 text-sm">{error}</p>
        </motion.div>
      )}
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-2 text-slate-400">
          <Shield className="h-4 w-4" />
          <span className="text-xs">
            Privacy changes take effect immediately and apply to all future interactions.
          </span>
        </div>
      </div>
    </div>
  );
};