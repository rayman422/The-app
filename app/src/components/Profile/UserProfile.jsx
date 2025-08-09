import { useState, useRef } from 'react';
import { useAuth } from '../Auth/AuthWrapper';
import { motion } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  User,
  BarChart2,
  Fish,
  Compass,
  GitPullRequest,
  Camera,
  Edit3,
  Save,
  X,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Trophy,
  Target
} from 'lucide-react';

const StatCard = ({ icon, label, value, onClick, clickable = false }) => (
  <motion.div
    whileHover={clickable ? { scale: 1.02 } : {}}
    whileTap={clickable ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 bg-slate-800 rounded-2xl flex-1 ${
      clickable ? 'cursor-pointer hover:bg-slate-700 transition-colors' : ''
    }`}
  >
    {icon}
    <div className="text-white text-3xl font-bold mt-2">{value}</div>
    <div className="text-gray-400 text-sm text-center">{label}</div>
  </motion.div>
);

const AvatarUpload = ({ user, onAvatarUpdate, storage }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const { userId, appId } = useAuth();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !storage || !userId) return;

    try {
      setUploading(true);
      
      // Create storage reference
      const avatarRef = ref(storage, `artifacts/${appId}/users/${userId}/avatar/${file.name}`);
      
      // Upload file
      await uploadBytes(avatarRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(avatarRef);
      
      // Update user profile
      await onAvatarUpdate(downloadURL);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center overflow-hidden">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={64} className="text-gray-400" />
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
        ) : (
          <Camera size={16} className="text-white" />
        )}
      </motion.button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

const EditableField = ({ value, onSave, placeholder, multiline = false }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center space-x-2 w-full">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none resize-none"
            rows={3}
          />
        ) : (
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none"
          />
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Save size={16} className="text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCancel}
          className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <X size={16} className="text-white" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 w-full group">
      <span className="flex-1 text-white">{value || placeholder}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all"
      >
        <Edit3 size={14} />
      </motion.button>
    </div>
  );
};

const PrivacyToggle = ({ isPrivate, onToggle }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
  >
    {isPrivate ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-emerald-500" />}
    <span className="text-sm text-gray-300">
      {isPrivate ? 'Private Profile' : 'Public Profile'}
    </span>
  </motion.button>
);

export const UserProfile = ({ user, setPage, storage }) => {
  const { updateUserProfile, logout, isAnonymous, apiClient, userId } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const handleProfileUpdate = async (field, value) => {
    try {
      if (apiClient && userId) {
        await apiClient.updateProfile(userId, { [field]: value });
      } else {
        await updateUserProfile({ [field]: value });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpdate = async (url) => {
    try {
      if (apiClient && userId) {
        await apiClient.updateProfile(userId, { avatar: url });
      } else {
        await updateUserProfile({ avatar: url });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const togglePrivacy = async () => {
    const newPrivacy = user.profilePrivacy === 'public' ? 'private' : 'public';
    await handleProfileUpdate('profilePrivacy', newPrivacy);
  };

  const formatJoinDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return 'Recently';
    }
  };

  const onAvatarUpdate = async (downloadURL) => {
    await handleAvatarUpdate(downloadURL);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-900 min-h-screen pb-20">
      {/* Header with Settings */}
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-bold">Profile</h1>
        <div className="flex space-x-2">
          <PrivacyToggle 
            isPrivate={user.profilePrivacy === 'private'} 
            onToggle={togglePrivacy}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Settings size={20} className="text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full bg-slate-800 rounded-xl p-4 mb-6"
        >
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Account Settings</h3>
            
            {!isAnonymous && (
              <div className="text-sm text-gray-400">
                <span className="flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>Joined {formatJoinDate(user.joinDate)}</span>
                </span>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Avatar and Name */}
      <AvatarUpload 
        user={user} 
        onAvatarUpdate={onAvatarUpdate}
        storage={storage}
      />
      
      <div className="mt-4 w-full max-w-sm space-y-2">
        <EditableField
          value={user.name}
          onSave={(value) => handleProfileUpdate('name', value)}
          placeholder="Enter your name"
        />
        
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <span>@{user.username}</span>
          {user.location && (
            <>
              <span>•</span>
              <MapPin size={14} />
              <span>{user.location}</span>
            </>
          )}
        </div>
        
        <EditableField
          value={user.location}
          onSave={(value) => handleProfileUpdate('location', value)}
          placeholder="Add your location"
        />
        
        <EditableField
          value={user.bio}
          onSave={(value) => handleProfileUpdate('bio', value)}
          placeholder="Tell us about your fishing style..."
          multiline
        />
      </div>

      {/* Stats */}
      <div className="flex justify-around w-full mt-6 space-x-2">
        <StatCard
          icon={<Fish size={24} className="text-emerald-500" />}
          label="Catches"
          value={user.catches || 0}
        />
        <StatCard
          icon={<Trophy size={24} className="text-yellow-500" />}
          label="Species"
          value={user.species || 0}
        />
        <StatCard
          icon={<Target size={24} className="text-blue-500" />}
          label="Locations"
          value={user.locations || 0}
        />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <StatCard
          icon={<Fish size={32} className="text-gray-400" />}
          label="Species Caught"
          value={user.species || 0}
          onClick={() => setPage('species')}
          clickable
        />
        <StatCard
          icon={<BarChart2 size={32} className="text-gray-400" />}
          label="Your Statistics"
          value={user.catches || 0}
          onClick={() => setPage('statistics')}
          clickable
        />
        <StatCard
          icon={<GitPullRequest size={32} className="text-gray-400" />}
          label="Your Gear"
          value={user.gearCount || 0}
          onClick={() => setPage('gear')}
          clickable
        />
        <StatCard
          icon={<Compass size={32} className="text-gray-400" />}
          label="Fishing Map"
          value={user.locations || 0}
          onClick={() => setPage('map')}
          clickable
        />
      </div>

      {/* Recent Catches Section */}
      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Recent Catches</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('addCatch')}
            className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
          >
            Log Catch
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {(user.catches || 0) === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl"
            >
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <Fish size={32} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Start Your Logbook</h3>
                <p className="text-gray-400 text-sm">
                  Track all your catches in one place! Find and relive your fishing memories whenever you'd like.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Fish size={48} className="mx-auto mb-2 opacity-50" />
              <p>Your recent catches will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};