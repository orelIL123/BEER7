import { binoArticle } from '@/constants/MockData';
import type { NewsArticle } from '@/constants/Types';
import { getApprovedArticles } from '@/lib/articles';
import { useCallback, useEffect, useState } from 'react';

export function useApprovedArticles(): {
  articles: NewsArticle[];
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const [approved, setApproved] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const list = await getApprovedArticles();
      setApproved(list);
    } catch (_) {
      setApproved([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { articles: [binoArticle, ...approved], loading, refresh: load };
}
