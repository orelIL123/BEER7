import { Coupon } from '@/constants/Types';
import { coupons as mockCoupons } from '@/constants/MockData';
import { getCoupons } from '@/lib/coupons';
import { useCallback, useEffect, useState } from 'react';

export function useCoupons(): Coupon[] {
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    const load = useCallback(async () => {
        try {
            const list = await getCoupons();
            setCoupons(list);
        } catch (_) {
            setCoupons([]);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Combine mock data with firestore data for now, or just use firestore if available
    return coupons.length > 0 ? coupons : mockCoupons;
}
