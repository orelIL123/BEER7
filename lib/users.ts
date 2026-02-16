import * as Crypto from 'expo-crypto';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

function normalizePhoneForDoc(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('972')) return `+${digits}`;
  if (digits.startsWith('0')) return `+972${digits.slice(1)}`;
  return `+972${digits}`;
}

export function getPhoneDocId(phone: string): string {
  return normalizePhoneForDoc(phone);
}

const AUTH_EMAIL_SUFFIX = '@beersheva.auth';

/** להצגה ב-Firebase Authentication – אימייל סינטטי מהטלפון */
export function phoneToAuthEmail(phone: string): string {
  const id = getPhoneDocId(phone);
  return id.replace('+', '') + AUTH_EMAIL_SUFFIX;
}

/** חילוץ טלפון מאימייל Auth */
export function authEmailToPhone(email: string): string {
  if (!email || !email.endsWith(AUTH_EMAIL_SUFFIX)) return '';
  return '+' + email.replace(AUTH_EMAIL_SUFFIX, '');
}

export async function isPhoneRegistered(phone: string): Promise<boolean> {
  const id = getPhoneDocId(phone);
  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists();
}

async function hashPassword(salt: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    salt + password,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
}

function saltToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type UserDetails = {
  firstName: string;
  lastName: string;
  isResident: boolean;
  password: string;
};

export type UserProfile = {
  phone: string;
  firstName: string;
  fullName: string;
  isResident: boolean;
};

/** שומר פרופיל ב-Firestore (בלי סיסמא – הסיסמא ב-Firebase Auth) */
export async function saveUserProfile(
  phone: string,
  uid: string,
  details: Omit<UserDetails, 'password'>
): Promise<void> {
  const id = getPhoneDocId(phone);
  const ref = doc(db, USERS_COLLECTION, id);
  const first = details.firstName.trim();
  const last = details.lastName.trim();
  try {
    await setDoc(ref, {
      phone: id,
      uid,
      firstName: first,
      lastName: last,
      fullName: first && last ? `${first} ${last}` : first || last,
      isResident: details.isResident,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[users] saveUserProfile failed', id, e);
    throw e;
  }
}

/** הרשמה עם סיסמא ב-Firestore (למשתמשים ישנים – ללא Firebase Auth) */
export async function registerPhone(
  phone: string,
  details: UserDetails
): Promise<void> {
  const id = getPhoneDocId(phone);
  const ref = doc(db, USERS_COLLECTION, id);
  const saltBytes = await Crypto.getRandomBytesAsync(16);
  const salt = saltToHex(saltBytes);
  const passwordHash = await hashPassword(salt, details.password);
  const first = details.firstName.trim();
  const last = details.lastName.trim();
  try {
    await setDoc(ref, {
      phone: id,
      firstName: first,
      lastName: last,
      fullName: first && last ? `${first} ${last}` : first || last,
      isResident: details.isResident,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[users] setDoc failed', id, e);
    throw e;
  }
}

export async function verifyPassword(phone: string, password: string): Promise<boolean> {
  const id = getPhoneDocId(phone);
  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const data = snap.data();
  const salt = data.salt as string | undefined;
  const storedHash = data.passwordHash as string | undefined;
  if (!salt || !storedHash) return false;
  const computedHash = await hashPassword(salt, password);
  return computedHash === storedHash;
}

export async function getUserProfile(phone: string): Promise<UserProfile | null> {
  const id = getPhoneDocId(phone);
  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    phone: (data.phone as string) ?? id,
    firstName: (data.firstName as string) ?? '',
    fullName: (data.fullName as string) ?? '',
    isResident: (data.isResident as boolean) ?? false,
  };
}
