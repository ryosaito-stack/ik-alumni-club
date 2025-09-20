import { useState, useEffect, useCallback } from 'react';
import { getGlobalCache } from '@/lib/cache';
import { CACHE_CONFIG } from '@/lib/constants/cache';

export interface BaseUserHooksConfig<T, QueryOptions> {
  getList: (options?: QueryOptions) => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  getCacheKey: (options?: QueryOptions) => string;
}

export class BaseUserHooks<T, QueryOptions> {
  private listCache;
  private singleCache;
  private config: BaseUserHooksConfig<T, QueryOptions>;
  private cachePrefix: string;

  constructor(config: BaseUserHooksConfig<T, QueryOptions> & { cachePrefix?: string }) {
    this.config = config;
    this.cachePrefix = config.cachePrefix || 'base';
    this.listCache = getGlobalCache<T[]>(`${this.cachePrefix}_list`, CACHE_CONFIG.DEFAULT_TTL);
    this.singleCache = getGlobalCache<T>(`${this.cachePrefix}_single`, CACHE_CONFIG.DEFAULT_TTL);
  }

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
        const data = await this.config.getList(options);
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
      return fetchItems();
    }, [fetchItems]);

    return {
      items,
      loading,
      error,
      refresh,
    };
  };

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
          throw new Error('Item not found or not published');
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

  // 月別取得用（schedules特有だが、汎用的に実装）
  useMonthItems = (year: number, month: number, getMonthItems: (year: number, month: number) => Promise<T[]>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchItems = useCallback(async () => {
      const cacheKey = `month_${year}_${month}`;
      
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
        const data = await getMonthItems(year, month);
        this.listCache.set(cacheKey, data);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch month items'));
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, [year, month, getMonthItems]);

    useEffect(() => {
      fetchItems();
    }, [fetchItems]);

    return {
      items,
      loading,
      error,
      refresh: fetchItems,
    };
  };

  // 今月取得用
  useCurrentMonthItems = (getCurrentMonthItems: () => Promise<T[]>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchItems = useCallback(async () => {
      const cacheKey = 'current_month';
      
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
        const data = await getCurrentMonthItems();
        this.listCache.set(cacheKey, data);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch current month items'));
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, [getCurrentMonthItems]);

    useEffect(() => {
      fetchItems();
    }, [fetchItems]);

    return {
      items,
      loading,
      error,
      refresh: fetchItems,
    };
  };

  clearCache = () => {
    this.listCache.clear();
    this.singleCache.clear();
  };
}