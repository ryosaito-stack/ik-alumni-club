import { CACHE_CONFIG } from '@/lib/constants/cache';

// キャッシュエントリの型定義
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  size?: number; // オプション: データサイズ（byte）
}

// キャッシュインターフェース
export interface ICache<T> {
  get(key: string): T | null;
  set(key: string, data: T): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
  getInfo(): CacheInfo;
}

// キャッシュ情報
interface CacheInfo {
  size: number;
  keys: string[];
  stats: {
    hits: number;
    misses: number;
    hitRate: number;
  };
}

// 汎用的なキャッシュクラス
export class MemoryCache<T> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number;
  private maxSize: number;
  private hits = 0;
  private misses = 0;
  private enableLogging: boolean;

  constructor(
    ttl: number = CACHE_CONFIG.DEFAULT_TTL,
    maxSize: number = CACHE_CONFIG.MAX_SIZE,
    enableLogging: boolean = CACHE_CONFIG.ENABLE_LOGGING
  ) {
    this.ttl = ttl;
    this.maxSize = maxSize;
    this.enableLogging = enableLogging;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      this.log(`Cache miss: ${key}`);
      return null;
    }

    // TTLチェック
    if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      this.log(`Cache expired: ${key}`);
      return null;
    }

    this.hits++;
    this.log(`Cache hit: ${key}`);
    return entry.data;
  }

  set(key: string, data: T): void {
    // サイズ制限チェック
    if (this.cache.size >= this.maxSize) {
      // LRU: 最も古いエントリを削除
      const oldestKey = this.findOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.log(`Evicted oldest cache: ${oldestKey}`);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.log(`Cache set: ${key}`);
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.log(`Cache deleted: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.log('Cache cleared');
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // TTLチェック
    if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  getInfo(): CacheInfo {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      stats: {
        hits: this.hits,
        misses: this.misses,
        hitRate: total > 0 ? this.hits / total : 0,
      },
    };
  }

  // ユーティリティメソッド
  private findOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }

  private log(message: string): void {
    if (this.enableLogging) {
      console.log(`[Cache] ${message}`);
    }
  }

  // デバッグ用メソッド
  debug(): void {
    const info = this.getInfo();
    console.table({
      'Cache Size': info.size,
      'Hit Rate': `${(info.stats.hitRate * 100).toFixed(2)}%`,
      'Total Hits': info.stats.hits,
      'Total Misses': info.stats.misses,
      'TTL': `${this.ttl / 1000}s`,
      'Max Size': this.maxSize,
    });
    
    if (info.size > 0) {
      const entries: any[] = [];
      this.cache.forEach((entry, key) => {
        const age = Date.now() - entry.timestamp;
        entries.push({
          key,
          age: `${(age / 1000).toFixed(1)}s`,
          expired: this.ttl > 0 && age > this.ttl,
        });
      });
      console.table(entries);
    }
  }
}

// ファクトリ関数
export function createCache<T>(
  ttl?: number,
  maxSize?: number,
  enableLogging?: boolean
): MemoryCache<T> {
  return new MemoryCache<T>(ttl, maxSize, enableLogging);
}

// グローバルキャッシュインスタンス管理
const globalCaches = new Map<string, MemoryCache<any>>();

export function getGlobalCache<T>(
  name: string,
  ttl?: number,
  maxSize?: number
): MemoryCache<T> {
  if (!globalCaches.has(name)) {
    globalCaches.set(name, createCache<T>(ttl, maxSize));
  }
  return globalCaches.get(name) as MemoryCache<T>;
}

export function clearAllGlobalCaches(): void {
  globalCaches.forEach(cache => cache.clear());
  console.log('All global caches cleared');
}

export function debugAllGlobalCaches(): void {
  console.log('=== Global Caches Debug Info ===');
  globalCaches.forEach((cache, name) => {
    console.log(`\n--- ${name} ---`);
    cache.debug();
  });
}