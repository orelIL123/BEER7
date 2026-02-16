import { auth } from '@/lib/firebase';
import type { UserDetails } from '@/lib/users';
import {
    authEmailToPhone,
    getUserProfile,
    isPhoneRegistered,
    phoneToAuthEmail,
    saveUserProfile,
    verifyPassword,
} from '@/lib/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@beer_sheva_user';

export type AuthUser = {
  phoneNumber: string;
  firstName?: string;
  fullName?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  registerWithDetails: (phone: string, details: UserDetails) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('972')) return `+${digits}`;
  if (digits.startsWith('0')) return `+972${digits.slice(1)}`;
  return `+972${digits}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser?.email) {
        setUser(null);
        setLoading(false);
        return;
      }
      const phone = authEmailToPhone(firebaseUser.email);
      if (!phone) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getUserProfile(phone);
        const authUser: AuthUser = {
          phoneNumber: phone,
          firstName: profile?.firstName,
          fullName: profile?.fullName,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          phone,
          firstName: authUser.firstName,
          fullName: authUser.fullName,
        }));
        setUser(authUser);
      } catch (e) {
        console.error('[Auth] getUserProfile on state change', e);
        setUser({ phoneNumber: phone });
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn(phone: string, password: string) {
    const normalized = normalizePhone(phone);
    const authEmail = phoneToAuthEmail(normalized);
    try {
      await signInWithEmailAndPassword(auth, authEmail, password);
      return;
    } catch (e: any) {
      const code = e?.code || e?.message || '';
      if (code === 'auth/user-not-found' || code.includes('user-not-found')) {
        const ok = await verifyPassword(normalized, password);
        if (ok) {
          await createUserWithEmailAndPassword(auth, authEmail, password);
          return;
        }
      }
      console.error('[Auth] signIn', e?.message, e);
      throw new Error('INVALID_CREDENTIALS');
    }
  }

  async function registerWithDetails(phone: string, details: UserDetails) {
    const normalized = normalizePhone(phone);
    let exists = false;
    try {
      exists = await isPhoneRegistered(normalized);
    } catch (e) {
      console.error('[Auth] isPhoneRegistered failed', normalized, e);
      throw e;
    }
    if (exists) {
      console.warn('[Auth] ALREADY_REGISTERED', normalized);
      throw new Error('ALREADY_REGISTERED');
    }
    const authEmail = phoneToAuthEmail(normalized);
    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail, details.password);
      await saveUserProfile(normalized, cred.user.uid, {
        firstName: details.firstName,
        lastName: details.lastName,
        isResident: details.isResident,
      });
    } catch (e: any) {
      const code = e?.code || e?.message || '';
      if (code === 'auth/email-already-in-use' || code.includes('email-already-in-use')) {
        throw new Error('ALREADY_REGISTERED');
      }
      console.error('[Auth] registerWithDetails failed', normalized, e);
      throw e;
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        registerWithDetails,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
