import { db } from './firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Coupon } from '@/constants/Types';

const COUPONS_COLLECTION = 'coupons';

export async function getCoupons(): Promise<Coupon[]> {
    try {
        const q = query(collection(db, COUPONS_COLLECTION));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        } as Coupon));
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }
}
