const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Cloud Function to handle account deletion cleanup
 * Deletes all user data when an account is deleted
 * 
 * This function is triggered when a user account is deleted from Firebase Auth
 * It ensures complete data cleanup for GDPR/CCPA compliance
 */
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const userId = user.uid;
  const db = admin.firestore();
  const storage = admin.storage();
  const bucket = storage.bucket();

  console.log(`Starting cleanup for deleted user: ${userId}`);

  const cleanupSummary = {
    userId: userId,
    deletionDate: new Date().toISOString(),
    deletedCollections: {},
    deletedStorageFiles: 0,
    errors: []
  };

  try {
    // Delete Firestore documents
    await cleanupFirestoreData(userId, db, cleanupSummary);
    
    // Delete Storage files
    await cleanupStorageFiles(userId, bucket, cleanupSummary);
    
    console.log(`Cleanup completed for user ${userId}:`, cleanupSummary);
    
    // Log cleanup completion for audit purposes
    await logCleanupCompletion(userId, cleanupSummary);
    
  } catch (error) {
    console.error(`Cleanup failed for user ${userId}:`, error);
    cleanupSummary.errors.push(`General cleanup error: ${error.message}`);
    
    // Log cleanup failure for investigation
    await logCleanupFailure(userId, error, cleanupSummary);
  }

  return cleanupSummary;
});

/**
 * Clean up all Firestore data for the deleted user
 */
async function cleanupFirestoreData(userId, db, cleanupSummary) {
  const batch = db.batch();
  const collections = [
    'userProfiles',
    'catches',
    'gear',
    'weatherLogs',
    'fishingSpots',
    'socialInteractions',
    'regulations'
  ];

  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName)
        .where('userId', '==', userId)
        .get();

      if (!snapshot.empty) {
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        cleanupSummary.deletedCollections[collectionName] = snapshot.size;
        console.log(`Deleted ${snapshot.size} documents from ${collectionName} for user ${userId}`);
      } else {
        cleanupSummary.deletedCollections[collectionName] = 0;
      }
    } catch (error) {
      const errorMsg = `Failed to delete ${collectionName}: ${error.message}`;
      cleanupSummary.errors.push(errorMsg);
      console.error(errorMsg, error);
    }
  }

  // Commit the batch deletion
  try {
    await batch.commit();
    console.log(`Firestore cleanup completed for user ${userId}`);
  } catch (error) {
    const errorMsg = `Failed to commit Firestore deletions: ${error.message}`;
    cleanupSummary.errors.push(errorMsg);
    console.error(errorMsg, error);
  }
}

/**
 * Clean up all Storage files for the deleted user
 */
async function cleanupStorageFiles(userId, bucket, cleanupSummary) {
  try {
    const [files] = await bucket.getFiles({
      prefix: `users/${userId}/`
    });

    if (files.length > 0) {
      const deletePromises = files.map(file => {
        return file.delete().then(() => {
          console.log(`Deleted storage file: ${file.name}`);
          return true;
        }).catch(error => {
          console.error(`Failed to delete storage file ${file.name}:`, error);
          return false;
        });
      });

      const results = await Promise.allSettled(deletePromises);
      const deletedCount = results.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length;

      cleanupSummary.deletedStorageFiles = deletedCount;
      console.log(`Deleted ${deletedCount} storage files for user ${userId}`);
    } else {
      cleanupSummary.deletedStorageFiles = 0;
      console.log(`No storage files found for user ${userId}`);
    }
  } catch (error) {
    const errorMsg = `Failed to cleanup storage files: ${error.message}`;
    cleanupSummary.errors.push(errorMsg);
    console.error(errorMsg, error);
  }
}

/**
 * Log successful cleanup completion for audit purposes
 */
async function logCleanupCompletion(userId, cleanupSummary) {
  try {
    const auditLog = {
      userId: userId,
      event: 'account_deletion_cleanup_completed',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      summary: cleanupSummary,
      status: 'success'
    };

    await admin.firestore().collection('auditLogs').add(auditLog);
    console.log(`Audit log created for successful cleanup of user ${userId}`);
  } catch (error) {
    console.error(`Failed to create audit log for user ${userId}:`, error);
  }
}

/**
 * Log cleanup failure for investigation
 */
async function logCleanupFailure(userId, error, cleanupSummary) {
  try {
    const auditLog = {
      userId: userId,
      event: 'account_deletion_cleanup_failed',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      summary: cleanupSummary,
      status: 'failed'
    };

    await admin.firestore().collection('auditLogs').add(auditLog);
    console.log(`Audit log created for failed cleanup of user ${userId}`);
  } catch (logError) {
    console.error(`Failed to create failure audit log for user ${userId}:`, logError);
  }
}

/**
 * Manual cleanup function for admin use
 * Can be called manually if automatic cleanup fails
 */
exports.manualUserCleanup = functions.https.onCall(async (data, context) => {
  // Check if the caller is an admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can perform manual cleanup'
    );
  }

  const { userId } = data;
  if (!userId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'userId is required'
    );
  }

  console.log(`Manual cleanup requested for user: ${userId}`);

  try {
    const db = admin.firestore();
    const storage = admin.storage();
    const bucket = storage.bucket();

    const cleanupSummary = {
      userId: userId,
      deletionDate: new Date().toISOString(),
      deletedCollections: {},
      deletedStorageFiles: 0,
      errors: [],
      manualCleanup: true,
      requestedBy: context.auth.uid
    };

    // Perform cleanup
    await cleanupFirestoreData(userId, db, cleanupSummary);
    await cleanupStorageFiles(userId, bucket, cleanupSummary);

    // Log manual cleanup
    await logCleanupCompletion(userId, cleanupSummary);

    return {
      success: true,
      message: `Manual cleanup completed for user ${userId}`,
      summary: cleanupSummary
    };

  } catch (error) {
    console.error(`Manual cleanup failed for user ${userId}:`, error);
    
    // Log manual cleanup failure
    await logCleanupFailure(userId, error, {
      userId: userId,
      manualCleanup: true,
      requestedBy: context.auth.uid
    });

    throw new functions.https.HttpsError(
      'internal',
      `Manual cleanup failed: ${error.message}`
    );
  }
});