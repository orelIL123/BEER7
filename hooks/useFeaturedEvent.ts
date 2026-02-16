import { FeaturedEvent } from '@/constants/Types';
import { featuredEvent as mockFeaturedEvent } from '@/constants/MockData';
import { getFeaturedEvent } from '@/lib/events';
import { useCallback, useEffect, useState } from 'react';

export function useFeaturedEvent(): FeaturedEvent | null {
    const [event, setEvent] = useState<FeaturedEvent | null>(null);

    const load = useCallback(async () => {
        try {
            const data = await getFeaturedEvent();
            setEvent(data);
        } catch (_) {
            setEvent(null);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return event || mockFeaturedEvent;
}
