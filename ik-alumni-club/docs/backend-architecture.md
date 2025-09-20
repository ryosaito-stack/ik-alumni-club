# バックエンド設計ドキュメント

## 📊 アーキテクチャ概要

本プロジェクトは **レイヤード設計（3層構造）** を採用し、関心事の分離と再利用性を重視した設計となっています。

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│         (Pages / Components)            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           Hooks Layer                   │
│    (Custom Hooks / Cache Management)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Firestore Layer                 │
│    (Data Access / CRUD Operations)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           Types Layer                   │
│      (Type Definitions / Models)        │
└─────────────────────────────────────────┘
```

## 1️⃣ Types層（データモデル定義）

### 配置場所
`/src/types/[feature].ts`

### 実装例：Information機能
```typescript
// /src/types/information.ts
export interface Information {
  id: string;
  date: Date;               // 日付
  title: string;           // 記事タイトル
  content: string;         // 本文
  imageUrl?: string;       // 画像URL（任意）
  url?: string;           // リンクURL（任意）
  published: boolean;      // 公開状態
  createdAt: Date;        // 作成日時
  updatedAt: Date;        // 更新日時
}

// Form data for creating/updating
export interface InformationFormData {
  date: Date;
  title: string;
  content: string;
  imageUrl?: string;
  url?: string;
  published: boolean;
}

// Query options for fetching
export interface InformationQueryOptions {
  published?: boolean;
  limit?: number;
  orderBy?: 'date' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}
```

### 設計ポイント
- **明確な責任分離**: データモデル、フォーム用、クエリ用で型を分離
- **Optional型の活用**: 必須/任意フィールドの明確化
- **再利用性**: 全レイヤーで共通利用可能

## 2️⃣ Firestore層（データアクセス）

### 配置場所
`/src/lib/firestore/[feature]/`

### ディレクトリ構造
```
/src/lib/firestore/informations/
├── constants.ts    # 定数・共通インポート集約
├── converter.ts    # 型変換ロジック
├── base.ts        # 基本CRUD操作（権限チェックなし）
├── user.ts        # 一般ユーザー用API（公開済みのみ）
└── admin.ts       # 管理者用API（全データアクセス可能）
```

### 各モジュールの責務

#### constants.ts（共通定数・エクスポート集約）
```typescript
export {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, Timestamp,
  type QueryConstraint, type DocumentData,
} from 'firebase/firestore';

export { db } from '@/lib/firebase';
export type { Information, InformationFormData, InformationQueryOptions } from '@/types/information';
export const COLLECTION_NAME = 'informations';
```

#### converter.ts（型変換ロジック）
```typescript
// Firestore DocumentData → TypeScript型
export const convertToInformation = (id: string, data: DocumentData): Information => {
  return {
    id,
    date: timestampToDate(data.date),
    title: data.title || '',
    content: data.content || '',
    imageUrl: data.imageUrl,
    url: data.url,
    published: data.published || false,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// TypeScript型 → Firestore DocumentData
export const convertToFirestoreData = (formData: InformationFormData) => {
  return {
    date: Timestamp.fromDate(formData.date),
    title: formData.title,
    content: formData.content,
    imageUrl: formData.imageUrl,
    url: formData.url,
    published: formData.published,
    updatedAt: Timestamp.now(),
  };
};
```

#### base.ts（基本CRUD操作）
権限チェックを行わない基本的なデータアクセス機能を提供。
**BaseRepositoryクラスを使用して共通化**
```typescript
// BaseRepositoryのインスタンス化
const repository = new BaseRepository<Schedule>(
  COLLECTION_NAME,
  convertToSchedule
);

// 全件取得（フィルタリングなし）
export const getSchedules = async (): Promise<Schedule[]> => {
  return repository.getAll();
};

// 詳細取得（権限チェックなし）
export const getScheduleById = async (id: string): Promise<Schedule | null> => {
  return repository.getById(id);
};
```

#### user.ts（一般ユーザー用）
公開済みデータのみアクセス可能
```typescript
// 公開済みのみ取得
export const getPublishedInformations = async (options: InformationQueryOptions): Promise<Information[]>

// 公開チェック付き詳細取得
export const getInformation = async (id: string): Promise<Information | null>
```

#### admin.ts（管理者用）
全データへのCRUD操作
```typescript
export const createInformation = async (formData: InformationFormData): Promise<string>
export const updateInformation = async (id: string, formData: InformationFormData): Promise<void>
export const deleteInformation = async (id: string): Promise<void>
```

### 設計ポイント
- **権限レベルごとのモジュール分離**: user/adminで物理的に分離
- **DRY原則**: base.tsで共通ロジックを実装し再利用
- **型安全性**: converterで型変換を一元管理

## 3️⃣ Hooks層（状態管理・キャッシュ）

### 配置場所
`/src/hooks/[feature]/`

### 実装構造
```
/src/hooks/informations/
├── user.ts     # 一般ユーザー用フック
└── admin.ts    # 管理者用フック
```

### user.ts（一般ユーザー用）
```typescript
// 一覧取得フック（公開済みのみ）
export const useInformationsList = (limit?: number) => {
  // キャッシュキー: informations_user
  // 自動キャッシュ管理
  // loading, error状態管理
  return { informations, loading, error, refresh };
}

// 詳細取得フック
export const useInformationDetail = (id: string) => {
  // 一覧キャッシュから優先的に取得（効率化）
  // 単一キャッシュへの保存
  return { information, loading, error };
}
```

### admin.ts（管理者用）
```typescript
// 一覧取得フック（未公開含む）
export const useAdminInformationsList = (includeUnpublished = true) => {
  // キャッシュキー: informations_admin
  // 管理者権限チェック
  return { informations, loading, error, refresh };
}

// CRUD操作フック
export const useAdminInformationMutations = () => {
  // 更新時に全キャッシュクリア（一貫性保証）
  return {
    createInformation,
    updateInformation,
    deleteInformation,
    loading,
    error,
  };
}
```

### 設計ポイント
- **多層キャッシュ戦略**: 一覧/詳細で別管理
- **権限分離**: user/adminで独立したキャッシュ
- **効率的なデータ取得**: 一覧キャッシュを優先活用

## 🔧 共通基盤クラス

### BaseRepository（2025-09-20追加）
全コレクションで共通の基本データアクセスロジックを提供

```typescript
// /src/lib/firestore/base-repository.ts
export class BaseRepository<T> {
  constructor(
    private collectionName: string,
    private converter: (id: string, data: DocumentData) => T
  ) {}

  async getAll(): Promise<T[]> {
    // 全件取得の共通ロジック
  }

  async getById(id: string): Promise<T | null> {
    // ID指定取得の共通ロジック
  }
}
```

**メリット：**
- コードの重複を削減
- 一貫性のあるエラーハンドリング
- 保守性の向上

## 🚀 特徴的な設計パターン

### 1. 多層キャッシュシステム
```typescript
// MemoryCache実装
class MemoryCache<T> {
  - TTL（Time To Live）サポート
  - LRU（Least Recently Used）エビクション
  - ヒット率統計
  - デバッグ機能
}
```

### 2. キャッシュ戦略
```typescript
// キャッシュ階層
1. 一覧キャッシュ検索（最速）
2. 単一キャッシュ検索
3. Firestore API呼び出し（最終手段）
```

### 3. 権限分離アーキテクチャ
```
ユーザー系統:
  user.ts → filterPublished → 公開データのみ

管理者系統:
  admin.ts → 全データアクセス可能 → CRUD操作
```

### 4. 共通ユーティリティ
```typescript
// /src/lib/firestore/utils.ts
export const timestampToDate = (timestamp: any): Date
export const filterPublished = <T>(items: T[]): T[]
export const isPublished = <T>(item: T | null): T | null
```

### 5. フィルタリングの分離（推奨）
```typescript
// /src/lib/firestore/[feature]/filters.ts
export const filterByDateRange = (items: T[], start?: Date, end?: Date): T[]
export const sortItems = (items: T[], orderBy: string, direction: 'asc' | 'desc'): T[]
export const applyFilters = (items: T[], options: QueryOptions): T[]
```

## 📝 新機能追加ガイドライン

### 新しいコレクションを追加する場合

1. **Types定義**
   ```typescript
   // /src/types/[feature].ts
   export interface [Feature] { ... }
   export interface [Feature]FormData { ... }
   export interface [Feature]QueryOptions { ... }
   ```

2. **Firestoreレイヤー**
   ```
   /src/lib/firestore/[feature]/
   ├── constants.ts    # 共通インポート・定数
   ├── converter.ts    # 型変換ロジック
   ├── base.ts        # BaseRepository使用の基本操作
   ├── filters.ts     # フィルタリングロジック（推奨）
   ├── user.ts        # 公開データアクセス
   └── admin.ts       # 管理者CRUD操作
   ```

3. **Hooksレイヤー**
   ```
   /src/hooks/[feature]/
   ├── user.ts
   └── admin.ts
   ```

### 命名規則
- **コレクション名**: 複数形小文字（例：`informations`, `videos`）
- **インターフェース**: PascalCase（例：`Information`, `Video`）
- **フック**: use + 機能名（例：`useInformationsList`）
- **キャッシュキー**: snake_case（例：`informations_user`）

## 🔒 セキュリティ考慮事項

1. **権限チェックの実装箇所**
   - Firestoreレイヤー: user.tsで公開チェック
   - Hooksレイヤー: adminフックで管理者権限チェック

2. **データ公開制御**
   - `published`フラグによる公開管理
   - `filterPublished`ユーティリティの一貫使用

3. **キャッシュ分離**
   - ユーザー/管理者で独立したキャッシュ
   - 権限を跨いだデータ漏洩を防止

## 📊 パフォーマンス最適化

1. **キャッシュ活用**
   - TTL: 5分（デフォルト）
   - 最大エントリ数: 100件
   - LRUによる自動エビクション

2. **効率的なデータ取得**
   - 一覧キャッシュからの詳細取得
   - 不要なAPI呼び出しの削減

3. **バッチ処理**
   - 管理者更新時の一括キャッシュクリア
   - トランザクション処理の活用（将来実装予定）

## 🛠️ デバッグツール

### キャッシュデバッグ
```typescript
// コンソールで実行
userInformationsCacheUtils.debug();
adminInformationsCacheUtils.debug();
debugAllGlobalCaches();
```

### キャッシュクリア
```typescript
userInformationsCacheUtils.clearAll();
adminInformationsCacheUtils.clearAll();
clearAllGlobalCaches();
```

## 📚 関連ドキュメント

- [Firebase設定ガイド](./setup-guide.md)
- [コーディング規約](./.cursor/rules/coding-standards.md)
- [プロジェクト概要](../CLAUDE.md)

---

## 📝 更新履歴

- **2025-09-20**: BaseRepositoryクラスを追加し、基本データアクセスを共通化
- **2025-09-20**: フィルタリングロジックの分離を推奨設計として追加

最終更新: 2025-09-20