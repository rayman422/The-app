import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Settings, Shield, MapPin, Calendar, Fish, Download, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { FishingDatabase } from '../../utils/firestoreCollections';
import { db } from '../../config/firebase';
import { ProfilePrivacyToggle } from './ProfilePrivacyToggle';
import { LoadingSpinner, ErrorDisplay } from '../Common/LoadingStates';
import { dataExportService } from '../../services/dataExportService';

export const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const fishingDB = new FishingDatabase(db, import.meta.env.VITE_APP_ID);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userProfile = await fishingDB.getUserProfile(user.uid);
      setProfile(userProfile);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = (newPrivacySetting) => {
    setProfile(prev => ({
      ...prev,
      isPublic: newPrivacySetting
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    setError(null);
    
    try {
      const exportResult = await dataExportService.exportUserData(user.uid);
      
      // Create download link
      const url = URL.createObjectURL(exportResult.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportResult.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      setError('Data exported successfully! Check your downloads folder.');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to export data');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      // Delete all user data
      const deletionSummary = await dataExportService.deleteUserData(user.uid);
      console.log('Account deletion summary:', deletionSummary);
      
      // Sign out the user
      await signOut();
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      console.error('Account deletion error:', err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorDisplay 
          message={error} 
          onRetry={loadProfile}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Edit className="h-5 w-5 text-slate-400" />
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-slate-400" />
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {profile.displayName || 'Anonymous Angler'}
                </h2>
                <p className="text-slate-400">
                  {profile.email || 'No email provided'}
                </p>
              </div>
              
              {profile.bio && (
                <p className="text-slate-300 leading-relaxed">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                {profile.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location.city || profile.location.region || 'Location hidden'}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfilePrivacyToggle onToggle={handlePrivacyToggle} />
        </motion.div>

        {/* Fishing Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
            <Fish className="h-5 w-5 text-blue-500" />
            <span>Fishing Statistics</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {profile.stats?.totalCatches || 0}
              </div>
              <div className="text-sm text-slate-400">Total Catches</div>
            </div>
            
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {profile.stats?.uniqueSpecies || 0}
              </div>
              <div className="text-sm text-slate-400">Species Caught</div>
            </div>
            
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {profile.stats?.totalWeight || 0}
              </div>
              <div className="text-sm text-slate-400">Total Weight (lbs)</div>
            </div>
            
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {profile.stats?.fishingDays || 0}
              </div>
              <div className="text-sm text-slate-400">Fishing Days</div>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
            <Settings className="h-5 w-5 text-slate-400" />
            <span>Account Settings</span>
          </h3>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Edit Profile</span>
                <Edit className="h-4 w-4 text-slate-400" />
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Change Password</span>
                <Shield className="h-4 w-4 text-slate-400" />
              </div>
            </button>
            
            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Export Data</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">GDPR/CCPA</span>
                  {isExporting ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <Download className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-left p-3 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>Delete Account</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-400">Permanent</span>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-slate-800 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Delete Account</h3>
            </div>
            
            <p className="text-slate-300 mb-6">
              This action cannot be undone. All your data including catches, photos, and profile information will be permanently deleted.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};