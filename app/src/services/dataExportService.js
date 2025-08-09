// Data Export Service for GDPR/CCPA compliance
// Handles user data export and deletion requests

import { FishingDatabase } from '../utils/firestoreCollections';
import { db, storage } from '../config/firebase';
import { ref, listAll, deleteObject } from 'firebase/storage';

export class DataExportService {
  constructor() {
    this.fishingDB = new FishingDatabase(db, import.meta.env.VITE_APP_ID);
  }

  /**
   * Export all user data for GDPR/CCPA compliance
   * @param {string} userId - The user ID to export data for
   * @returns {Promise<Object>} - Complete user data export
   */
  async exportUserData(userId) {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        userId: userId,
        data: {}
      };

      // Export user profile
      const profile = await this.fishingDB.getUserProfile(userId);
      exportData.data.profile = profile;

      // Export all catches
      const catches = await this.fishingDB.getUserCatches(userId);
      exportData.data.catches = catches;

      // Export gear
      const gear = await this.fishingDB.getUserGear(userId);
      exportData.data.gear = gear;

      // Export weather logs
      const weatherLogs = await this.fishingDB.getWeatherLogs(userId);
      exportData.data.weatherLogs = weatherLogs;

      // Export fishing spots
      const fishingSpots = await this.fishingDB.getFishingSpots(userId);
      exportData.data.fishingSpots = fishingSpots;

      // Export social interactions
      const socialInteractions = await this.fishingDB.getSocialInteractions(userId);
      exportData.data.socialInteractions = socialInteractions;

      // Export regulations
      const regulations = await this.fishingDB.getRegulations(userId);
      exportData.data.regulations = regulations;

      // Generate downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      return {
        data: exportData,
        blob: blob,
        filename: `fishing-tracker-export-${userId}-${new Date().toISOString().split('T')[0]}.json`
      };
    } catch (error) {
      console.error('Data export failed:', error);
      throw new Error(`Failed to export user data: ${error.message}`);
    }
  }

  /**
   * Delete all user data for GDPR/CCPA compliance
   * @param {string} userId - The user ID to delete data for
   * @returns {Promise<Object>} - Deletion summary
   */
  async deleteUserData(userId) {
    try {
      const deletionSummary = {
        userId: userId,
        deletionDate: new Date().toISOString(),
        deletedCollections: {},
        deletedStorageFiles: 0,
        errors: []
      };

      // Delete Firestore documents
      try {
        // Delete catches
        const catches = await this.fishingDB.getUserCatches(userId);
        for (const catchDoc of catches) {
          await this.fishingDB.deleteCatch(userId, catchDoc.id);
        }
        deletionSummary.deletedCollections.catches = catches.length;

        // Delete gear
        const gear = await this.fishingDB.getUserGear(userId);
        for (const gearDoc of gear) {
          await this.fishingDB.deleteGear(userId, gearDoc.id);
        }
        deletionSummary.deletedCollections.gear = gear.length;

        // Delete weather logs
        const weatherLogs = await this.fishingDB.getWeatherLogs(userId);
        for (const log of weatherLogs) {
          await this.fishingDB.deleteWeatherLog(userId, log.id);
        }
        deletionSummary.deletedCollections.weatherLogs = weatherLogs.length;

        // Delete fishing spots
        const fishingSpots = await this.fishingDB.getFishingSpots(userId);
        for (const spot of fishingSpots) {
          await this.fishingDB.deleteFishingSpot(userId, spot.id);
        }
        deletionSummary.deletedCollections.fishingSpots = fishingSpots.length;

        // Delete social interactions
        const socialInteractions = await this.fishingDB.getSocialInteractions(userId);
        for (const interaction of socialInteractions) {
          await this.fishingDB.deleteSocialInteraction(userId, interaction.id);
        }
        deletionSummary.deletedCollections.socialInteractions = socialInteractions.length;

        // Delete regulations
        const regulations = await this.fishingDB.getRegulations(userId);
        for (const regulation of regulations) {
          await this.fishingDB.deleteRegulation(userId, regulation.id);
        }
        deletionSummary.deletedCollections.regulations = regulations.length;

        // Delete user profile (last to avoid breaking other operations)
        await this.fishingDB.deleteUserProfile(userId);
        deletionSummary.deletedCollections.profile = 1;

      } catch (error) {
        deletionSummary.errors.push(`Firestore deletion failed: ${error.message}`);
      }

      // Delete Storage files
      try {
        const storageRef = ref(storage, `users/${userId}`);
        const files = await listAll(storageRef);
        
        for (const file of files.items) {
          try {
            await deleteObject(file);
            deletionSummary.deletedStorageFiles++;
          } catch (fileError) {
            deletionSummary.errors.push(`Failed to delete file ${file.fullPath}: ${fileError.message}`);
          }
        }
      } catch (error) {
        deletionSummary.errors.push(`Storage deletion failed: ${error.message}`);
      }

      return deletionSummary;
    } catch (error) {
      console.error('Data deletion failed:', error);
      throw new Error(`Failed to delete user data: ${error.message}`);
    }
  }

  /**
   * Get data retention information for the user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Retention information
   */
  async getDataRetentionInfo(userId) {
    try {
      const retentionInfo = {
        userId: userId,
        lastActivity: null,
        dataAge: {},
        retentionPolicy: {
          profile: 'Until account deletion',
          catches: '7 years (fishing records)',
          gear: 'Until account deletion',
          weatherLogs: '2 years (weather data)',
          photos: 'Until account deletion',
          locationData: 'Until account deletion'
        }
      };

      // Get last activity from catches
      const catches = await this.fishingDB.getUserCatches(userId);
      if (catches.length > 0) {
        const sortedCatches = catches.sort((a, b) => new Date(b.caughtAt) - new Date(a.caughtAt));
        retentionInfo.lastActivity = sortedCatches[0].caughtAt;
      }

      // Calculate data age
      const profile = await this.fishingDB.getUserProfile(userId);
      if (profile?.createdAt) {
        retentionInfo.dataAge.profile = this.calculateAge(profile.createdAt);
      }

      if (catches.length > 0) {
        const oldestCatch = catches.sort((a, b) => new Date(a.caughtAt) - new Date(b.caughtAt))[0];
        retentionInfo.dataAge.catches = this.calculateAge(oldestCatch.caughtAt);
      }

      return retentionInfo;
    } catch (error) {
      console.error('Failed to get retention info:', error);
      throw new Error(`Failed to get retention info: ${error.message}`);
    }
  }

  /**
   * Calculate age of data
   * @param {Date|string} date - The date to calculate age from
   * @returns {string} - Human readable age
   */
  calculateAge(date) {
    const now = new Date();
    const dataDate = new Date(date);
    const diffTime = Math.abs(now - dataDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Less than 1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  }
}

// Export singleton instance
export const dataExportService = new DataExportService();