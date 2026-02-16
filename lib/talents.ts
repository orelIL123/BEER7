import type { Talent } from '@/constants/Types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

const COLLECTION = 'talents';

function toTalent(docId: string, data: Record<string, unknown>): Talent {
  return {
    id: docId,
    title: (data.title as string) ?? '',
    description: data.description as string | undefined,
    type: ((data.type as string) === 'image' ? 'image' : 'video') as 'video' | 'image',
    videoUrl: data.videoUrl as string | undefined,
    images: (data.images as string[]) ?? [],
    date: (data.date as string) ?? new Date().toISOString(),
  };
}

export async function getTalents(): Promise<Talent[]> {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toTalent(d.id, d.data()));
}

export async function uploadTalentImage(uri: string): Promise<string> {
  const storageRef = ref(
    storage,
    `talents/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`
  );
  const response = await fetch(uri);
  const blob = await response.blob();
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function createTalent(data: Omit<Talent, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    date: data.date || new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateTalent(id: string, data: Partial<Omit<Talent, 'id'>>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteTalent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
