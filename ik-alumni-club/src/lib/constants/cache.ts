// キャッシュ設定の定数
export const CACHE_CONFIG = {
  // TTL (Time To Live) 設定
  DEFAULT_TTL: 5 * 60 * 1000,        // 5分（デフォルト）
  SHORT_TTL: 1 * 60 * 1000,          // 1分（頻繁に更新されるデータ用）
  LONG_TTL: 30 * 60 * 1000,          // 30分（静的なデータ用）
  NO_CACHE: 0,                       // キャッシュしない
  
  // キャッシュサイズ設定
  MAX_SIZE: 100,                     // 最大エントリ数
  MAX_MEMORY_MB: 50,                 // 最大メモリ使用量（MB）
  
  // デバッグ設定
  ENABLE_LOGGING: process.env.NODE_ENV === 'development', // 開発環境でのみログ出力
} as const;

// キャッシュキー プレフィックス（データタイプ別）
export const CACHE_KEYS = {
  INFORMATIONS: 'informations',
  VIDEOS: 'videos',
  BLOGS: 'blogs',
  EVENTS: 'events',
  MEMBERS: 'members',
} as const;

// キャッシュ戦略タイプ
export type CacheStrategy = 'memory' | 'localStorage' | 'sessionStorage' | 'none';