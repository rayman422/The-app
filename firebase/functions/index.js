const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// On user signup: create a default profile doc
exports.onAuthCreate = functions.auth.user().onCreate(async (user) => {
  const profileRef = db.collection('users').doc(user.uid).collection('profile').doc('default');
  await profileRef.set({
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    email: user.email || '',
    bio: '',
    location: null,
    joinDate: admin.firestore.FieldValue.serverTimestamp(),
    privacy: 'private'
  }, { merge: true });
});

// On user delete: purge user data and storage
exports.onAuthDelete = functions.auth.user().onDelete(async (user) => {
  const userRef = db.collection('users').doc(user.uid);
  // Recursively delete user documents and subcollections
  await admin.firestore().recursiveDelete(userRef);
  // Delete user storage files
  await storage.bucket().deleteFiles({ prefix: `users/${user.uid}/` });
});

// Aggregate basic catch stats per user on any catch write
exports.aggregateCatchStats = functions.firestore
  .document('users/{uid}/catches/{catchId}')
  .onWrite(async (_change, context) => {
    const uid = context.params.uid;
    const catchesSnap = await db.collection('users').doc(uid).collection('catches').get();

    let total = 0;
    const bySpecies = {};
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const since = admin.firestore.Timestamp.fromDate(new Date(Date.now() - thirtyDaysMs));
    let last30 = 0;

    catchesSnap.forEach((doc) => {
      total += 1;
      const data = doc.data();
      const speciesId = data.speciesId || 'unknown';
      bySpecies[speciesId] = (bySpecies[speciesId] || 0) + 1;
      if (data.caughtAt && data.caughtAt.toMillis && data.caughtAt.toMillis() >= since.toMillis()) {
        last30 += 1;
      }
    });

    await db.collection('users').doc(uid).collection('profile').doc('stats').set({
      totalCatches: total,
      catchesBySpecies: bySpecies,
      catchesLast30Days: last30,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

// Callable to generate short-lived signed URL for a user's own file
exports.getSignedImageUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }
  const uid = context.auth.uid;
  const filePath = data && data.filePath;
  if (typeof filePath !== 'string' || !filePath.startsWith(`users/${uid}/`)) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid file path');
  }
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  const [url] = await storage.bucket().file(filePath).getSignedUrl({
    action: 'read',
    expires
  });
  return { url, expires };
});

// Scheduled cleanup (placeholder)
exports.scheduledCleanup = functions.pubsub.schedule('0 3 * * *').timeZone('UTC').onRun(async () => {
  return null;
});