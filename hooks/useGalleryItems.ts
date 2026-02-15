import { galleryItems as mockGallery, sharedGalleryItems as mockShared } from '@/constants/MockData';
import type { GalleryItem } from '@/constants/Types';
import { getGalleryItemsFromFirestore } from '@/lib/gallery';
import { useCallback, useEffect, useState } from 'react';

export function useGalleryItems(): {
  allItems: GalleryItem[];
  sharedItems: GalleryItem[];
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const [firestoreItems, setFirestoreItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const items = await getGalleryItemsFromFirestore();
      setFirestoreItems(items);
    } catch (_) {
      setFirestoreItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sharedItems = [...mockShared, ...firestoreItems];
  const allItems = [...mockGallery, ...sharedItems];
  return { allItems, sharedItems, loading, refresh: load };
}
