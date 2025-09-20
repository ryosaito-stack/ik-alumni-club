# バックエンド設計ドキュメント

## 📊 アーキテクチャ概要

本プロジェクトは **レイヤード設計（3層構造）** を採用し、共通基盤クラスによる高度な抽象化を実現しています。

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│         (Pages / Components)            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           Hooks Layer                   │
│    (BaseUserHooks/BaseAdminHooks)       │
│         ↓ 継承・利用 ↓                  │
│    (Custom Hooks / Cache Management)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Firestore Layer                 │
│         (BaseRepository)                │
│         ↓ 継承・利用 ↓                  │
│    (Data Access / CRUD Operations)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           Types Layer                   │
│      (Type Definitions / Models)        │
│         (Common Author Type)            │
└─────────────────────────────────────────┘
```

## 🎯 主要な設計原則

1. **DRY (Don't Repeat Yourself)**: 共通基盤クラスで重複を徹底排除
2. **単一責任原則**: 各層・各クラスが明確な責務を持つ
3. **依存性逆転**: 抽象に依存し、具象に依存しない
4. **型安全性**: TypeScriptジェネリクスで完全な型サポート

## 1️⃣ Types層（データモデル定義）

### 共通型定義
```typescript
// /src/types/author.ts
export interface Author {
  id: string;
  name: string;
  role: string;
}
```

### 機能別型定義
```typescript
// /src/types/[feature].ts
export interface [Feature] {
  id: string;
  // ... 機能固有のフィールド
  author?: Author;        // 作成者情報（共通型を使用）
  published: boolean;      // 公開状態
  createdAt: Date;
  updatedAt: Date;
}

export interface [Feature]FormData {
  // フォーム用の型（id, createdAt等を除外）
}

export interface [Feature]QueryOptions {
  published?: boolean;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
```

## 2️⃣ Firestore層（データアクセス）

### 共通基盤：BaseRepository

```typescript
// /src/lib/firestore/base-repository.ts
export class BaseRepository<T> {
  constructor(
    private collectionName: string,
    private converter: (id: string, data: DocumentData) => T
  ) {}

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map(doc => 
      this.converter(doc.id, doc.data())
    );
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return this.converter(docSnap.id, docSnap.data());
    }
    return null;
  }
}
```

### 機能別実装パターン

```
/src/lib/firestore/[feature]/
├── constants.ts    # 定数・共通インポート
├── converter.ts    # 型変換ロジック
├── base.ts        # BaseRepository利用の基本操作
├── filters.ts     # フィルタリングロジック（分離推奨）
├── user.ts        # 一般ユーザー用（公開のみ）
└── admin.ts       # 管理者用（CRUD操作）
```

#### base.ts の実装例
```typescript
import { BaseRepository } from '@/lib/firestore/base-repository';
import { COLLECTION_NAME, convertToSchedule } from './constants';

// BaseRepositoryのインスタンス化（たった3行！）
const repository = new BaseRepository<Schedule>(
  COLLECTION_NAME,
  convertToSchedule
);

export const getSchedules = () => repository.getAll();
export const getScheduleById = (id: string) => repository.getById(id);
```

## 3️⃣ Hooks層（状態管理・キャッシュ）

### 共通基盤クラス

#### BaseUserHooks（ユーザー向け）
```typescript
// /src/hooks/common/BaseUserHooks.ts
export class BaseUserHooks<T, QueryOptions> {
  private listCache;
  private singleCache;
  
  constructor(config: {
    getList: (options?: QueryOptions) => Promise<T[]>;
    getById: (id: string) => Promise<T | null>;
    getCacheKey: (options?: QueryOptions) => string;
    cachePrefix: string;
  }) {
    // MemoryCacheを使用した統一キャッシュ管理
    this.listCache = getGlobalCache<T[]>(`${config.cachePrefix}_list`);
    this.singleCache = getGlobalCache<T>(`${config.cachePrefix}_single`);
  }

  useList = (options?: QueryOptions) => {
    // キャッシュ、ローディング、エラー処理を自動化
    // わずか数行で完全な状態管理を実現
  }

  useDetail = (id: string | null) => {
    // 詳細取得も同様に簡潔に実装
  }
}
```

#### BaseAdminHooks（管理者向け）
```typescript
// /src/hooks/common/BaseAdminHooks.ts
export class BaseAdminHooks<T, FormData, QueryOptions> {
  // BaseUserHooksと同様の構造
  // + CRUD操作のサポート
  
  useMutations = () => {
    return {
      create: async (data: FormData, author?: Author) => { ... },
      update: async (id: string, data: FormData) => { ... },
      delete: async (id: string) => { ... },
      loading,
      error,
    };
  }
}
```

### 実装例（驚くほどシンプル！）

```typescript
// /src/hooks/schedules/user.ts
const schedulesHooks = new BaseUserHooks<Schedule, ScheduleQueryOptions>({
  getList: schedulesApi.getPublishedSchedules,
  getById: schedulesApi.getSchedule,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'schedules_user',
});

// たった1行でフル機能のフックを作成！
export const useSchedulesList = (options = {}) => {
  const { items: schedules, loading, error, refresh } = schedulesHooks.useList(options);
  return { schedules, loading, error, refresh };
};
```

## 🚀 統一キャッシュシステム

### MemoryCache クラス
```typescript
// /src/lib/cache.ts
export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  
  // 機能：
  // - TTL（Time To Live）管理
  // - LRU（Least Recently Used）エビクション
  // - ヒット率統計
  // - デバッグ機能
  
  get(key: string): T | null { ... }
  set(key: string, data: T): void { ... }
  clear(): void { ... }
  debug(): void { ... }  // キャッシュ状態の可視化
  getInfo(): CacheInfo { ... }  // 統計情報取得
}
```

### グローバルキャッシュ管理
```typescript
// 名前付きキャッシュインスタンスの取得
const cache = getGlobalCache<T>('cache_name', TTL, maxSize);

// 全キャッシュのデバッグ情報表示
debugAllGlobalCaches();

// 全キャッシュのクリア
clearAllGlobalCaches();
```

## 📊 実装成果（コード削減率）

### 共通基盤導入による効果

| 機能 | 元のコード行数 | リファクタ後 | 削減率 |
|------|-------------|-----------|--------|
| informations admin hooks | 227行 | 59行 | **74%削減** |
| schedules admin hooks | 161行 | 49行 | **70%削減** |
| informations user hooks | 130行 | 44行 | **66%削減** |
| schedules user hooks | 154行 | 51行 | **67%削減** |
| **合計** | **672行** | **203行** | **70%削減** |

### メリット
- **保守性**: バグ修正・機能追加が1箇所で完結
- **一貫性**: 全機能が同じパターンで動作
- **拡張性**: 新機能追加が数分で完了
- **型安全**: ジェネリクスによる完全な型サポート
- **テスタビリティ**: ロジックが分離され単体テスト容易

## 🔧 新機能追加ガイド（超高速実装）

### 新しいコレクションを10分で実装する方法

#### 1. Types定義（2分）
```typescript
// /src/types/video.ts
export interface Video {
  id: string;
  title: string;
  url: string;
  author: Author;  // 共通型を使用
  published: boolean;
  // ...
}
```

#### 2. Firestore層（3分）
```typescript
// /src/lib/firestore/videos/base.ts
const repository = new BaseRepository<Video>(
  'videos',
  convertToVideo
);

export const getVideos = () => repository.getAll();
export const getVideoById = (id) => repository.getById(id);
```

#### 3. Hooks層（3分）
```typescript
// /src/hooks/videos/user.ts
const videosHooks = new BaseUserHooks<Video, VideoQueryOptions>({
  getList: videosApi.getPublishedVideos,
  getById: videosApi.getVideo,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'videos_user',
});

export const useVideosList = (options = {}) => {
  const { items: videos, loading, error, refresh } = videosHooks.useList(options);
  return { videos, loading, error, refresh };
};
```

#### 4. 完成！（残り2分でテスト）

## 🛠️ デバッグツール

### キャッシュの状態確認
```typescript
// ブラウザコンソールで実行
import { debugAllGlobalCaches } from '@/lib/cache';
debugAllGlobalCaches();

// 出力例：
// Cache: schedules_user_list
// Size: 5, Hit Rate: 85.2%, TTL: 300s
// Cache: informations_admin_single
// Size: 12, Hit Rate: 92.1%, TTL: 300s
```

### 特定キャッシュのクリア
```typescript
import { getGlobalCache } from '@/lib/cache';
const cache = getGlobalCache('schedules_user_list');
cache.clear();
```

## 🔒 セキュリティ考慮事項

1. **権限分離の徹底**
   - user/adminフックの物理的分離
   - キャッシュも独立（データ漏洩防止）

2. **公開制御**
   - `published`フラグによる一元管理
   - `filterPublished`ユーティリティの強制使用

3. **Author情報の保護**
   - 作成者情報は管理者のみアクセス可能
   - ユーザー向けAPIではAuthor情報を除外

## 📈 パフォーマンス最適化

### キャッシュ戦略
```
1. 一覧キャッシュ確認（最速: <1ms）
   ↓ ヒットしない場合
2. 単一キャッシュ確認（高速: <5ms）
   ↓ ヒットしない場合
3. Firestore API呼び出し（通常: 50-200ms）
   ↓ 取得後
4. キャッシュに保存（TTL: 5分）
```

### 統計情報の活用
```typescript
const cache = getGlobalCache('schedules_user_list');
const info = cache.getInfo();
console.log(`ヒット率: ${(info.stats.hitRate * 100).toFixed(1)}%`);
// ヒット率が低い場合はTTLの調整を検討
```

## 📚 関連ドキュメント

- [Firebase設定ガイド](./setup-guide.md)
- [コーディング規約](./.cursor/rules/coding-standards.md)
- [プロジェクト概要](../CLAUDE.md)

---

## 📝 更新履歴

- **2025-09-20 v2.0**: 
  - BaseUserHooks/BaseAdminHooks導入による大規模リファクタリング
  - 統一キャッシュシステム（MemoryCache）の完全統合
  - コード削減率70%達成
  - 共通Author型の導入
  
- **2025-09-20 v1.1**: 
  - BaseRepositoryクラスを追加
  - フィルタリングロジックの分離

- **2025-09-20 v1.0**: 
  - 初版作成

最終更新: 2025-09-20