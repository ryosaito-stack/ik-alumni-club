import { useState, useEffect, useCallback } from 'react';
import { Information } from '@/types/information';
import { getPublishedInformations, getInformation } from '@/lib/firestore/informations/user';
import { getGlobalCache } from '@/lib/cache';
import { CACHE_CONFIG, CACHE_KEYS } from '@/lib/constants/cache';

// ユーザー用のキャッシュ（公開済みコンテンツのみ）
const listCache = getGlobalCache<Information[]>(
  `${CACHE_KEYS.INFORMATIONS}_user`,
  CACHE_CONFIG.DEFAULT_TTL
);

const singleCache = getGlobalCache<Information>(
  `${CACHE_KEYS.INFORMATIONS}_user_single`,
  CACHE_CONFIG.DEFAULT_TTL
);

// お知らせ一覧用フック（ユーザー向け：公開済みのみ）
export const useInformationsList = (limit?: number) => {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = 'published_list';

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getPublishedInformations({
        orderBy: 'date',
        orderDirection: 'desc'
      });
      
      listCache.set(cacheKey, data);
      setInformations(limit ? data.slice(0, limit) : data);
    } catch (err) {
      console.error('Error fetching informations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // キャッシュチェック
    const cached = listCache.get(cacheKey);
    if (cached) {
      setInformations(limit ? cached.slice(0, limit) : cached);
      setLoading(false);
      return;
    }

    // API取得
    refresh();
  }, [cacheKey, limit, refresh]);

  return { informations, loading, error, refresh };
};

// お知らせ詳細用フック（一覧キャッシュを優先的に活用）
export const useInformationDetail = (id: string) => {
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchInformation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. まず一覧キャッシュから探す（最も効率的）
        const listCached = listCache.get('published_list');
        if (listCached) {
          const found = listCached.find(item => item.id === id);
          if (found) {
            setInformation(found);
            setLoading(false);
            return;
          }
        }
        
        // 2. 単一キャッシュをチェック
        const singleCached = singleCache.get(id);
        if (singleCached) {
          setInformation(singleCached);
          setLoading(false);
          return;
        }
        
        // 3. キャッシュになければAPI取得
        const result = await getInformation(id);
        if (result) {
          singleCache.set(id, result);
        }
        setInformation(result);
      } catch (err) {
        console.error('Error fetching information:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, [id]);

  return { information, loading, error };
};

// キャッシュユーティリティ（デバッグ用）
export const userInformationsCacheUtils = {
  clearAll: () => {
    listCache.clear();
    singleCache.clear();
  },
  debug: () => {
    console.log('=== User List Cache ===');
    listCache.debug();
    console.log('=== User Single Cache ===');
    singleCache.debug();
  },
};