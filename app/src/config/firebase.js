import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration for development
const devConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase configuration for production
const prodConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PROD,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PROD,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PROD,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_PROD,
};

// Determine environment
const isDev = import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.DEV;
const config = isDev ? devConfig : prodConfig;

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(config);
} else {
  app = getApp();
}

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize analytics if supported and enabled
let analytics = null;
if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);
}
export { analytics };

// Connect to emulators in development
if (isDev && import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.warn('Failed to connect to emulators:', error);
  }
}

export default app;