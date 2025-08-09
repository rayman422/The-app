const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();
const APP_ID = process.env.APP_ID || 'default-app-id';

// On user signup: create a default profile doc
exports.onAuthCreate = functions.auth.user().onCreate(async (user) => {
  const profileRef = db
    .collection('artifacts').doc(APP_ID)
    .collection('users').doc(user.uid)
    .collection('userProfile').doc('profile');
  await profileRef.set({
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    email: user.email || '',
    bio: '',
    location: null,
    joinDate: admin.firestore.FieldValue.serverTimestamp(),
    profilePrivacy: 'private'
  }, { merge: true });
});

// On user delete: purge user data and storage
exports.onAuthDelete = functions.auth.user().onDelete(async (user) => {
  const userRef = db
    .collection('artifacts').doc(APP_ID)
    .collection('users').doc(user.uid);
  // Recursively delete user documents and subcollections
  await admin.firestore().recursiveDelete(userRef);
  // Delete user storage files
  await storage.bucket().deleteFiles({ prefix: `artifacts/${APP_ID}/users/${user.uid}/` });
});

// Aggregate basic catch stats per user on any catch write
exports.aggregateCatchStats = functions.firestore
  .document('artifacts/{appId}/users/{uid}/catches/{catchId}')
  .onWrite(async (_change, context) => {
    const uid = context.params.uid;
    const appId = context.params.appId;
    const catchesSnap = await db
      .collection('artifacts').doc(appId)
      .collection('users').doc(uid)
      .collection('catches').get();

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
      if (data.dateTime && data.dateTime.toMillis && data.dateTime.toMillis() >= since.toMillis()) {
        last30 += 1;
      }
    });

    await db
      .collection('artifacts').doc(appId)
      .collection('users').doc(uid)
      .collection('userProfile').doc('stats')
      .set({
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
  const validPrefix = `artifacts/${APP_ID}/users/${uid}/`;
  if (typeof filePath !== 'string' || !filePath.startsWith(validPrefix)) {
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