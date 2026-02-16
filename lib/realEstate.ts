import type { RealEstateListing } from '@/constants/Types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

const COLLECTION = 'real_estate';

function toListing(docId: string, data: Record<string, unknown>): RealEstateListing {
  const images = data.images as string[] | undefined;
  const image = data.image as string | undefined;
  const imagesArr = Array.isArray(images) && images.length > 0
    ? images
    : (image ? [image] : []);

  return {
    id: docId,
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    address: (data.address as string) ?? '',
    price: data.price as string | undefined,
    type: ((data.type as string) === 'rent' ? 'rent' : 'sale') as 'sale' | 'rent',
    images: imagesArr,
    agentName: data.agentName as string | undefined,
    agentImage: data.agentImage as string | undefined,
  };
}

export async function getRealEstateListings(): Promise<RealEstateListing[]> {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toListing(d.id, d.data()));
}

export async function getRealEstateById(id: string): Promise<RealEstateListing | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return toListing(snap.id, snap.data());
}

export async function uploadRealEstateImage(uri: string, path: string): Promise<string> {
  const storageRef = ref(storage, `real_estate/${path}`);
  const response = await fetch(uri);
  const blob = await response.blob();
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function createRealEstateListing(
  data: Omit<RealEstateListing, 'id'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    title: data.title,
    description: data.description,
    address: data.address,
    price: data.price,
    type: data.type,
    images: data.images,
    agentName: data.agentName,
    agentImage: data.agentImage,
    date: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateRealEstateListing(
  id: string,
  data: Partial<Omit<RealEstateListing, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteRealEstateListing(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
