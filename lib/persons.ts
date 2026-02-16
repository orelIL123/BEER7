import { db } from './firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Person } from '@/constants/Types';

const PERSONS_COLLECTION = 'persons';

export async function getPersons(): Promise<Person[]> {
    try {
        const q = query(collection(db, PERSONS_COLLECTION));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        } as Person));
    } catch (error) {
        console.error('Error fetching persons:', error);
        return [];
    }
}
