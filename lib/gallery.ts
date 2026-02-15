import type { GalleryItem } from '@/constants/Types';
import {
  addDoc,
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

const COLLECTION = 'gallery_items';
const MAX_USER_UPLOADS = 4;

export async function getUserGalleryCount(phone: string): Promise<number> {
  const q = query(
    collection(db, COLLECTION),
    where('uploadedByPhone', '==', phone)
  );
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

export async function uploadGalleryImage(
  phone: string,
  isAdmin: boolean,
  payload: { title: string; imageUri: string; category?: string }
): Promise<string> {
  if (!isAdmin) {
    const count = await getUserGalleryCount(phone);
    if (count >= MAX_USER_UPLOADS) {
      throw new Error(`הגעת למכסה (${MAX_USER_UPLOADS} תמונות).`);
    }
  }
  const storageRef = ref(
    storage,
    `gallery/${phone.replace(/\D/g, '')}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`
  );
  const response = await fetch(payload.imageUri);
  const blob = await response.blob();
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);
  const docRef = await addDoc(collection(db, COLLECTION), {
    type: 'image',
    url,
    thumbnail: url,
    title: payload.title.trim(),
    category: payload.category || 'אתם משתפים',
    date: new Date().toISOString(),
    uploadedByPhone: phone,
  });
  return docRef.id;
}

export async function getGalleryItemsFromFirestore(): Promise<GalleryItem[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      type: (data.type as 'image' | 'video') || 'image',
      url: data.url ?? '',
      thumbnail: data.thumbnail ?? data.url ?? '',
      title: data.title ?? '',
      date: data.date ?? '',
      category: data.category ?? 'אתם משתפים',
    };
  });
}
