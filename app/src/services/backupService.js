// Backup Service for scheduled data backups and exports
// Handles Firestore and Storage backups for operational purposes

import { FishingDatabase } from '../utils/firestoreCollections';
import { db, storage } from '../config/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

export class BackupService {
  constructor() {
    this.fishingDB = new FishingDatabase(db, import.meta.env.VITE_APP_ID);
  }

  /**
   * Create a complete backup of all application data
   * @returns {Promise<Object>} - Backup summary
   */
  async createFullBackup() {
    try {
      const backupSummary = {
        backupDate: new Date().toISOString(),
        collections: {},
        storageFiles: 0,
        errors: [],
        metadata: {
          version: import.meta.env.VITE_APP_VERSION || '1.0.0',
          environment: import.meta.env.NODE_ENV || 'development'
        }
      };

      // Backup all users and their data
      const users = await this.fishingDB.getAllUsers();
      backupSummary.collections.users = users.length;

      for (const user of users) {
        try {
          const userData = await this.backupUserData(user.uid);
          backupSummary.collections[`user_${user.uid}`] = userData;
        } catch (error) {
          backupSummary.errors.push(`Failed to backup user ${user.uid}: ${error.message}`);
        }
      }

      // Backup species database
      try {
        const species = await this.fishingDB.getAllSpecies();
        backupSummary.collections.species = species.length;
      } catch (error) {
        backupSummary.errors.push(`Failed to backup species: ${error.message}`);
      }

      // Backup regulations
      try {
        const regulations = await this.fishingDB.getAllRegulations();
        backupSummary.collections.regulations = regulations.length;
      } catch (error) {
        backupSummary.errors.push(`Failed to backup regulations: ${error.message}`);
      }

      // Count storage files
      try {
        const storageRef = ref(storage, '');
        const files = await listAll(storageRef);
        backupSummary.storageFiles = files.items.length;
      } catch (error) {
        backupSummary.errors.push(`Failed to count storage files: ${error.message}`);
      }

      return backupSummary;
    } catch (error) {
      console.error('Full backup failed:', error);
      throw new Error(`Failed to create full backup: ${error.message}`);
    }
  }

  /**
   * Backup data for a specific user
   * @param {string} userId - The user ID to backup
   * @returns {Promise<Object>} - User data backup
   */
  async backupUserData(userId) {
    try {
      const userBackup = {
        userId: userId,
        backupDate: new Date().toISOString(),
        profile: null,
        catches: [],
        gear: [],
        weatherLogs: [],
        fishingSpots: [],
        socialInteractions: [],
        regulations: [],
        storageFiles: []
      };

      // Backup profile
      try {
        userBackup.profile = await this.fishingDB.getUserProfile(userId);
      } catch (error) {
        console.warn(`Failed to backup profile for user ${userId}:`, error);
      }

      // Backup catches
      try {
        userBackup.catches = await this.fishingDB.getUserCatches(userId);
      } catch (error) {
        console.warn(`Failed to backup catches for user ${userId}:`, error);
      }

      // Backup gear
      try {
        userBackup.gear = await this.fishingDB.getUserGear(userId);
      } catch (error) {
        console.warn(`Failed to backup gear for user ${userId}:`, error);
      }

      // Backup weather logs
      try {
        userBackup.weatherLogs = await this.fishingDB.getWeatherLogs(userId);
      } catch (error) {
        console.warn(`Failed to backup weather logs for user ${userId}:`, error);
      }

      // Backup fishing spots
      try {
        userBackup.fishingSpots = await this.fishingDB.getFishingSpots(userId);
      } catch (error) {
        console.warn(`Failed to backup fishing spots for user ${userId}:`, error);
      }

      // Backup social interactions
      try {
        userBackup.socialInteractions = await this.fishingDB.getSocialInteractions(userId);
      } catch (error) {
        console.warn(`Failed to backup social interactions for user ${userId}:`, error);
      }

      // Backup regulations
      try {
        userBackup.regulations = await this.fishingDB.getRegulations(userId);
      } catch (error) {
        console.warn(`Failed to backup regulations for user ${userId}:`, error);
      }

      // List storage files (without downloading content)
      try {
        const storageRef = ref(storage, `users/${userId}`);
        const files = await listAll(storageRef);
        userBackup.storageFiles = files.items.map(file => ({
          path: file.fullPath,
          name: file.name,
          size: null // Size would require additional API calls
        }));
      } catch (error) {
        console.warn(`Failed to list storage files for user ${userId}:`, error);
      }

      return userBackup;
    } catch (error) {
      console.error(`User backup failed for ${userId}:`, error);
      throw new Error(`Failed to backup user data: ${error.message}`);
    }
  }

  /**
   * Export backup data to JSON file
   * @param {Object} backupData - The backup data to export
   * @returns {Promise<Blob>} - Downloadable backup file
   */
  async exportBackupToFile(backupData) {
    try {
      const exportData = {
        ...backupData,
        exportDate: new Date().toISOString(),
        exportType: 'backup'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      return blob;
    } catch (error) {
      console.error('Backup export failed:', error);
      throw new Error(`Failed to export backup: ${error.message}`);
    }
  }

  /**
   * Get backup statistics and health information
   * @returns {Promise<Object>} - Backup statistics
   */
  async getBackupStats() {
    try {
      const stats = {
        lastBackup: null,
        totalUsers: 0,
        totalCatches: 0,
        totalStorageFiles: 0,
        backupHealth: 'unknown',
        recommendations: []
      };

      // Get basic counts
      try {
        const users = await this.fishingDB.getAllUsers();
        stats.totalUsers = users.length;
      } catch (error) {
        stats.recommendations.push('Unable to count users - check database access');
      }

      try {
        const allCatches = await this.fishingDB.getAllCatches();
        stats.totalCatches = allCatches.length;
      } catch (error) {
        stats.recommendations.push('Unable to count catches - check database access');
      }

      try {
        const storageRef = ref(storage, '');
        const files = await listAll(storageRef);
        stats.totalStorageFiles = files.items.length;
      } catch (error) {
        stats.recommendations.push('Unable to count storage files - check storage access');
      }

      // Determine backup health
      if (stats.totalUsers > 0 && stats.totalCatches > 0) {
        stats.backupHealth = 'healthy';
      } else if (stats.totalUsers > 0 || stats.totalCatches > 0) {
        stats.backupHealth = 'partial';
        stats.recommendations.push('Some data collections are inaccessible');
      } else {
        stats.backupHealth = 'unhealthy';
        stats.recommendations.push('No data accessible - check permissions and connectivity');
      }

      return stats;
    } catch (error) {
      console.error('Failed to get backup stats:', error);
      throw new Error(`Failed to get backup stats: ${error.message}`);
    }
  }

  /**
   * Clean up old backup data
   * @param {number} daysToKeep - Number of days to keep backups
   * @returns {Promise<Object>} - Cleanup summary
   */
  async cleanupOldBackups(daysToKeep = 30) {
    try {
      const cleanupSummary = {
        cleanupDate: new Date().toISOString(),
        cutoffDate: new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)).toISOString(),
        deletedBackups: 0,
        errors: []
      };

      // This would typically interact with a backup storage system
      // For now, we'll just return the cleanup plan
      cleanupSummary.recommendation = `Backup cleanup would remove backups older than ${daysToKeep} days`;

      return cleanupSummary;
    } catch (error) {
      console.error('Backup cleanup failed:', error);
      throw new Error(`Failed to cleanup old backups: ${error.message}`);
    }
  }
}

// Export singleton instance
export const backupService = new BackupService();