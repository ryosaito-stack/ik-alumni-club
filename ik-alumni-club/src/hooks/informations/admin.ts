import { useState, useEffect, useCallback } from 'react';
import { useAdminCheck } from '@/hooks/useAdminAuth';
import {
  Information,
  InformationFormData,
  InformationQueryOptions,
} from '@/types/information';
import { getInformations, getInformationById } from '@/lib/firestore/informations/base';
import * as adminApi from '@/lib/firestore/informations/admin';
import { getGlobalCache } from '@/lib/cache';
import { CACHE_CONFIG, CACHE_KEYS } from '@/lib/constants/cache';

// 管理者用のキャッシュ（未公開含む全コンテンツ）
const listCache = getGlobalCache<Information[]>(
  `${CACHE_KEYS.INFORMATIONS}_admin`,
  CACHE_CONFIG.DEFAULT_TTL
);

const singleCache = getGlobalCache<Information>(
  `${CACHE_KEYS.INFORMATIONS}_admin_single`,
  CACHE_CONFIG.DEFAULT_TTL
);

// お知らせ一覧用フック（管理者向け：全データ取得可能）
export const useAdminInformationsList = (includeUnpublished = true) => {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAdmin, error: authError } = useAdminCheck();
  
  const cacheKey = includeUnpublished ? 'all_with_unpublished' : 'published_only';

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const options: InformationQueryOptions = {
        published: includeUnpublished ? undefined : true,
        orderBy: 'date',
        orderDirection: 'desc'
      };
      
      const data = await getInformations(options);
      listCache.set(cacheKey, data);
      setInformations(data);
    } catch (err) {
      console.error('Error fetching informations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => {
    // 管理者権限チェック
    if (authError) {
      setError(new Error(authError));
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      return;
    }

    // キャッシュチェック
    const cached = listCache.get(cacheKey);
    if (cached) {
      setInformations(cached);
      setLoading(false);
      return;
    }

    // API取得
    refresh();
  }, [cacheKey, refresh, isAdmin, authError]);

  return { informations, loading, error, refresh };
};

// お知らせ詳細用フック（管理者向け：未公開も取得可能）
export const useAdminInformationDetail = (id: string) => {
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAdmin, error: authError } = useAdminCheck();

  useEffect(() => {
    // 管理者権限チェック
    if (authError) {
      setError(new Error(authError));
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    const fetchInformation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. まず一覧キャッシュから探す
        const listCached = listCache.get('all_with_unpublished');
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
        
        // 3. キャッシュになければAPI取得（管理者は全データ取得可能）
        const result = await getInformationById(id);
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
  }, [id, isAdmin, authError]);

  return { information, loading, error };
};

// お知らせのCRUD操作用フック（管理者専用）
export const useAdminInformationMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isAdmin, error: authError } = useAdminCheck();

  // 権限チェック共通化
  const checkAdmin = useCallback((): boolean => {
    if (authError) {
      setError(new Error(authError));
      return false;
    }
    return isAdmin;
  }, [isAdmin, authError]);

  // CRUD操作の共通ラップ
  const executeMutation = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    if (!checkAdmin()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      // 両方のキャッシュをクリア（管理者とユーザー両方）
      listCache.clear();
      singleCache.clear();
      // ユーザー側のキャッシュもクリア
      const userListCache = getGlobalCache(`${CACHE_KEYS.INFORMATIONS}_user`);
      const userSingleCache = getGlobalCache(`${CACHE_KEYS.INFORMATIONS}_user_single`);
      userListCache.clear();
      userSingleCache.clear();
      return result;
    } catch (err) {
      console.error('Mutation error:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkAdmin]);

  const createInformation = useCallback((data: InformationFormData) => 
    executeMutation(() => adminApi.createInformation(data)),
  [executeMutation]);

  const updateInformation = useCallback((id: string, data: InformationFormData) => 
    executeMutation(() => adminApi.updateInformation(id, data)),
  [executeMutation]);

  const deleteInformation = useCallback((id: string) => 
    executeMutation(() => adminApi.deleteInformation(id)),
  [executeMutation]);

  return {
    createInformation,
    updateInformation,
    deleteInformation,
    loading,
    error,
  };
};

// キャッシュユーティリティ（デバッグ用）
export const adminInformationsCacheUtils = {
  clearAll: () => {
    listCache.clear();
    singleCache.clear();
  },
  debug: () => {
    console.log('=== Admin List Cache ===');
    listCache.debug();
    console.log('=== Admin Single Cache ===');
    singleCache.debug();
  },
};
