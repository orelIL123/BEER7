import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export type BusinessFromFirestore = {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  description: string;
  image: string;
  website: string;
  hours: string;
};

export async function getBusinessesFromFirestore(): Promise<BusinessFromFirestore[]> {
  const snap = await getDocs(query(collection(db, 'businesses')));
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BusinessFromFirestore));
  return data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
}

export async function getBusinessById(id: string): Promise<BusinessFromFirestore | null> {
  const snap = await getDoc(doc(db, 'businesses', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BusinessFromFirestore;
}
