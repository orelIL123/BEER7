import { db } from './firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { Event, FeaturedEvent } from '@/constants/Types';

const EVENTS_COLLECTION = 'events';
const FEATURED_COLLECTION = 'featured_events';

export async function getEvents(): Promise<Event[]> {
    try {
        const q = query(collection(db, EVENTS_COLLECTION));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        } as Event));
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function getFeaturedEvent(): Promise<FeaturedEvent | null> {
    try {
        const q = query(collection(db, FEATURED_COLLECTION), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return {
            id: d.id,
            ...d.data(),
        } as FeaturedEvent;
    } catch (error) {
        console.error('Error fetching featured event:', error);
        return null;
    }
}
