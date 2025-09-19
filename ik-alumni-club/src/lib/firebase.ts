import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'demo-sender',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser and production)
export let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_EMULATORS !== 'true') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Connect to emulators if enabled
if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  // Check if running on client side
  if (typeof window !== 'undefined') {
    // Prevent duplicate connections during hot reload
    if (!(auth as any)._canInitEmulator) {
      (auth as any)._canInitEmulator = false;
    }
    
    if ((auth as any)._canInitEmulator !== false) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      (auth as any)._canInitEmulator = false;
    }
    
    // Connect Firestore emulator
    if (!(db as any)._settings?.host?.includes('127.0.0.1')) {
      connectFirestoreEmulator(db, '127.0.0.1', 8081);
    }
    
    // Connect Storage emulator
    if (!(storage as any)._host?.includes('127.0.0.1')) {
      connectStorageEmulator(storage, '127.0.0.1', 9199);
    }
    
    console.log('Firebase Emulators connected');
  }
}