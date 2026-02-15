import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// ⚠️ IMPORTANT: Replace with your new Beer Sheva Firebase project configuration
// Get these values from: Firebase Console > Project Settings > Your apps > Web app
export const firebaseConfig = {
  apiKey: 'AIzaSyDMFbEAQejC6s6jt8TdIK5dFhHfWnIlqS8',
  authDomain: 'beer7-b898d.firebaseapp.com',
  projectId: 'beer7-b898d',
  storageBucket: 'beer7-b898d.firebasestorage.app',
  messagingSenderId: '746227083454',
  appId: '1:746227083454:web:beer7-b898d',
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export { app };

function getAuthWithPersistence() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  const authMod = require('firebase/auth') as {
    getAuth: typeof getAuth;
    initializeAuth: (app: FirebaseApp, deps: { persistence: unknown }) => ReturnType<typeof getAuth>;
    getReactNativePersistence: (storage: unknown) => unknown;
  };
  try {
    return authMod.initializeAuth(app, {
      persistence: authMod.getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    return authMod.getAuth(app);
  }
}

export const auth = getAuthWithPersistence();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
