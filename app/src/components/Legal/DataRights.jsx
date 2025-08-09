import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, Trash2, Clock, FileText, User, MapPin, Fish, Database } from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';
import { dataExportService } from '../../services/dataExportService';
import { LoadingSpinner, ErrorDisplay } from '../Common/LoadingStates';

export const DataRights = ({ onClose }) => {
  const { user } = useAuth();
  const [retentionInfo, setRetentionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRetentionInfo();
    }
  }, [user]);

  const loadRetentionInfo = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await dataExportService.getDataRetentionInfo(user.uid);
      setRetentionInfo(info);
    } catch (err) {
      setError(err.message || 'Failed to load retention information');
      console.error('Retention info error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
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
    }
  };

  const handleDeleteData = async () => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }
    
    try {
      const deletionSummary = await dataExportService.deleteUserData(user.uid);
      console.log('Data deletion summary:', deletionSummary);
      
      // Close the modal and refresh retention info
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to delete data');
      console.error('Data deletion error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your Data Rights</h2>
        <p className="text-slate-400">
          Under GDPR and CCPA, you have the right to access, export, and delete your personal data.
        </p>
      </div>

      {error && (
        <ErrorDisplay 
          message={error} 
          onDismiss={() => setError(null)}
          className="max-w-md mx-auto"
        />
      )}

      {/* Data Retention Information */}
      {retentionInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Data Retention Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Activity:</span>
                <span className="text-white">
                  {retentionInfo.lastActivity ? new Date(retentionInfo.lastActivity).toLocaleDateString() : 'Never'}
                </span>
              </div>
              
              {retentionInfo.dataAge.profile && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Profile Age:</span>
                  <span className="text-white">{retentionInfo.dataAge.profile}</span>
                </div>
              )}
              
              {retentionInfo.dataAge.catches && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Oldest Catch:</span>
                  <span className="text-white">{retentionInfo.dataAge.catches}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-white mb-2">Retention Policy</h4>
              {Object.entries(retentionInfo.retentionPolicy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400 capitalize">{key}:</span>
                  <span className="text-white text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Rights Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-white text-center">Exercise Your Rights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Download className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-medium text-white">Export Data</div>
                <div className="text-sm text-blue-200">Download all your data</div>
              </div>
            </div>
          </button>

          {/* Delete Data */}
          <button
            onClick={handleDeleteData}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-medium text-white">Delete Data</div>
                <div className="text-sm text-red-200">Permanently remove all data</div>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Data Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Database className="h-5 w-5 text-green-500" />
          <span>What Data We Store</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">Profile Information</span>
            </div>
            <div className="flex items-center space-x-3">
              <Fish className="h-4 w-4 text-green-400" />
              <span className="text-slate-300">Fishing Catches</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-purple-400" />
              <span className="text-slate-300">Location Data</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-yellow-400" />
              <span className="text-slate-300">Photos & Media</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-slate-300">Weather Logs</span>
            </div>
            <div className="flex items-center space-x-3">
              <Database className="h-4 w-4 text-indigo-400" />
              <span className="text-slate-300">App Usage Data</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Legal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-slate-400"
      >
        <p>
          For more information about your data rights, please refer to our{' '}
          <button className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</button>
          {' '}and{' '}
          <button className="text-blue-400 hover:text-blue-300 underline">Terms of Service</button>.
        </p>
        <p className="mt-2">
          If you have questions about your data rights, contact us at{' '}
          <span className="text-blue-400">privacy@fishingtracker.com</span>
        </p>
      </motion.div>
    </div>
  );
};