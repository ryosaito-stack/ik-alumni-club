import { useState, useEffect, useCallback } from 'react';
import { Author } from '@/types/author';
import { getGlobalCache } from '@/lib/cache';
import { CACHE_CONFIG } from '@/lib/constants/cache';

export interface BaseAdminHooksConfig<T, FormData, QueryOptions> {
  // 読み取り操作
  getAll: (options?: QueryOptions) => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  getCacheKey: (options?: QueryOptions) => string;
  
  // CRUD操作（オプショナル）
  create?: (data: FormData, author?: Author) => Promise<string>;
  update?: (id: string, data: FormData) => Promise<void>;
  delete?: (id: string) => Promise<void>;
}

export class BaseAdminHooks<T, FormData, QueryOptions> {
  private listCache;
  private singleCache;
  private config: BaseAdminHooksConfig<T, FormData, QueryOptions>;
  private cachePrefix: string;

  constructor(config: BaseAdminHooksConfig<T, FormData, QueryOptions> & { cachePrefix?: string }) {
    this.config = config;
    this.cachePrefix = config.cachePrefix || 'base_admin';
    this.listCache = getGlobalCache<T[]>(`${this.cachePrefix}_list`, CACHE_CONFIG.DEFAULT_TTL);
    this.singleCache = getGlobalCache<T>(`${this.cachePrefix}_single`, CACHE_CONFIG.DEFAULT_TTL);
  }

  /**
   * 管理者用一覧取得フック
   */
  useList = (options?: QueryOptions) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchItems = useCallback(async () => {
      const cacheKey = this.config.getCacheKey(options);
      
      // キャッシュチェック
      const cached = this.listCache.get(cacheKey);
      if (cached) {
        setItems(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await this.config.getAll(options);
        this.listCache.set(cacheKey, data);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch items'));
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, [JSON.stringify(options)]);

    useEffect(() => {
      fetchItems();
    }, [fetchItems]);

    const refresh = useCallback(() => {
      // キャッシュをクリアして再取得
      this.listCache.clear();
      return fetchItems();
    }, [fetchItems]);

    return {
      items,
      loading,
      error,
      refresh,
    };
  };

  /**
   * 管理者用詳細取得フック
   */
  useDetail = (id: string | null) => {
    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchItem = useCallback(async () => {
      if (!id) {
        setItem(null);
        return;
      }

      // キャッシュチェック
      const cached = this.singleCache.get(id);
      if (cached) {
        setItem(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await this.config.getById(id);
        if (!data) {
          throw new Error('Item not found');
        }
        this.singleCache.set(id, data);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch item'));
        setItem(null);
      } finally {
        setLoading(false);
      }
    }, [id]);

    useEffect(() => {
      fetchItem();
    }, [fetchItem]);

    return {
      item,
      loading,
      error,
      refresh: fetchItem,
    };
  };

  /**
   * 管理者用CRUD操作フック
   */
  useMutations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * 作成操作
     */
    const create = useCallback(async (
      data: FormData,
      author?: Author
    ): Promise<string | null> => {
      if (!this.config.create) {
        setError(new Error('Create operation not configured'));
        return null;
      }

      try {
        setLoading(true);
        setError(null);
        const id = await this.config.create(data, author);
        // キャッシュをクリア
        this.listCache.clear();
        this.singleCache.clear();
        return id;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create item'));
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

    /**
     * 更新操作
     */
    const update = useCallback(async (
      id: string,
      data: FormData
    ): Promise<boolean> => {
      if (!this.config.update) {
        setError(new Error('Update operation not configured'));
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        await this.config.update(id, data);
        // キャッシュをクリア
        this.listCache.clear();
        this.singleCache.clear();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update item'));
        return false;
      } finally {
        setLoading(false);
      }
    }, []);

    /**
     * 削除操作
     */
    const remove = useCallback(async (id: string): Promise<boolean> => {
      if (!this.config.delete) {
        setError(new Error('Delete operation not configured'));
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        await this.config.delete(id);
        // キャッシュをクリア
        this.listCache.clear();
        this.singleCache.clear();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete item'));
        return false;
      } finally {
        setLoading(false);
      }
    }, []);

    return {
      create,
      update,
      delete: remove, // deleteはreserved wordなのでremoveとして返す
      loading,
      error,
      clearError: () => setError(null),
    };
  };

  /**
   * キャッシュクリア
   */
  clearCache = () => {
    this.listCache.clear();
    this.singleCache.clear();
  };
}