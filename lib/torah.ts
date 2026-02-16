import type { DvarTorah, ParashaShavua } from '@/constants/Types';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, orderBy, query, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

const TORAH_COLLECTION = 'torah';
const CITY_CONFIG_ID = 'main';
const SHABBAT_DOC_ID = 'main';

function toDvarTorah(docId: string, data: Record<string, unknown>): DvarTorah {
  return {
    id: docId,
    title: (data.title as string) ?? '',
    content: (data.content as string) ?? '',
    type: ((data.type as string) === 'weekly' ? 'weekly' : 'daily') as 'daily' | 'weekly',
    date: (data.date as string) ?? new Date().toISOString(),
    author: data.author as string | undefined,
    authorImage: data.authorImage as string | undefined,
    videoUrl: data.videoUrl as string | undefined,
  };
}

export async function getDvarTorahList(): Promise<DvarTorah[]> {
  const q = query(collection(db, TORAH_COLLECTION), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDvarTorah(d.id, d.data()));
}

export async function getParashaFromCityConfig(): Promise<ParashaShavua | null> {
  const snap = await getDoc(doc(db, 'cityConfig', CITY_CONFIG_ID));
  if (!snap.exists()) return null;
  const data = snap.data();
  const name = (data?.parashaName as string) || '';
  if (!name) return null;
  return {
    name,
    summary: data?.parashaDescription as string | undefined,
    weekLabel: data?.parashaDate as string | undefined,
  };
}

export type ShabbatTimes = { candleLighting?: string; havdalah?: string };

export async function getShabbatTimes(): Promise<ShabbatTimes | null> {
  try {
    const snap = await getDoc(doc(db, 'shabbat_times', SHABBAT_DOC_ID));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      candleLighting: data?.candleLighting as string | undefined,
      havdalah: data?.havdalah as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function uploadTorahImage(uri: string): Promise<string> {
  const storageRef = ref(storage, `torah/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`);
  const response = await fetch(uri);
  const blob = await response.blob();
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function createDvarTorah(data: Omit<DvarTorah, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, TORAH_COLLECTION), {
    title: data.title,
    content: data.content,
    type: data.type,
    date: data.date,
    author: data.author,
    authorImage: data.authorImage,
    videoUrl: data.videoUrl,
  });
  return docRef.id;
}

export async function updateDvarTorah(id: string, data: Partial<Omit<DvarTorah, 'id'>>): Promise<void> {
  await updateDoc(doc(db, TORAH_COLLECTION, id), data);
}

export async function deleteDvarTorah(id: string): Promise<void> {
  await deleteDoc(doc(db, TORAH_COLLECTION, id));
}

export async function saveShabbatTimes(times: ShabbatTimes): Promise<void> {
  await setDoc(doc(db, 'shabbat_times', SHABBAT_DOC_ID), times, { merge: true });
}
