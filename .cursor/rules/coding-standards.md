# コーディング規約

## 📋 概要
このドキュメントは、IK Alumni Clubプロジェクトのコーディング規約を定義します。
チーム全体で一貫性のあるコードを維持するため、以下の規約に従ってください。

## 🗂 プロジェクト構造

```
ik-alumni-club/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # 認証関連ページ
│   │   ├── (dashboard)/     # ダッシュボード関連
│   │   └── api/             # APIルート
│   ├── components/          # 再利用可能コンポーネント
│   ├── constants/           # 定数定義
│   │   ├── messages.ts     # メッセージ定数
│   │   ├── design-tokens.ts # デザイントークン
│   │   ├── text-content.ts  # テキストコンテンツ
│   │   └── naming-conventions.ts # 命名規則
│   ├── hooks/              # カスタムフック
│   ├── lib/                # 外部ライブラリ設定
│   ├── types/              # 型定義
│   ├── utils/              # ユーティリティ関数
│   └── styles/             # グローバルスタイル
├── public/                 # 静的ファイル
├── .cursor/rules/          # プロジェクトルール
└── tests/                  # テストファイル
```

## 🏷 命名規則

### ファイル・ディレクトリ
```typescript
// コンポーネント: PascalCase
Button.tsx
UserProfile.tsx

// ページ: kebab-case
user-profile.tsx
login.tsx

// カスタムフック: camelCase、useプレフィックス
useAuth.ts
useModal.ts

// ユーティリティ: camelCase
formatDate.ts
validateEmail.ts

// 定数: UPPER_SNAKE_CASE または kebab-case
API_ENDPOINTS.ts
design-tokens.ts

// 型定義: PascalCase
UserType.ts
AuthTypes.ts
```

### 変数・関数
```typescript
// 変数: camelCase
const userName = 'John';
const isActive = true;

// 定数: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 関数: camelCase、動詞で始める
function getUserData() { }
function validateEmail() { }
function handleClick() { }

// Boolean変数: is/has/can/shouldプレフィックス
const isLoading = false;
const hasError = false;
const canEdit = true;
const shouldUpdate = false;

// イベントハンドラー: handle/onプレフィックス
const handleSubmit = () => { };
const onClick = () => { };
```

### React/Next.js固有
```typescript
// コンポーネント: PascalCase
export function UserCard() { }
export const ProfileHeader = () => { };

// Props型: [ComponentName]Props
interface ButtonProps { }
interface UserCardProps { }

// カスタムフック: useプレフィックス
function useAuth() { }
function useLocalStorage() { }

// State: [value, setValue]パターン
const [user, setUser] = useState();
const [isOpen, setIsOpen] = useState(false);
```

## 💅 スタイリング規約

### デザイントークンの使用
```typescript
// ❌ 悪い例: ハードコーディング
className="text-gray-900 bg-white p-4"

// ✅ 良い例: デザイントークン使用
import { colors, spacing, components } from '@/constants/design-tokens';
className={`${colors.text.primary} ${colors.background.primary} ${spacing.padding.md}`}

// ✅ より良い例: ユーティリティ関数使用
import { getButtonClasses } from '@/constants/design-tokens';
className={getButtonClasses('primary', 'lg')}
```

### Tailwind CSS使用ガイドライン
1. デザイントークン定数を優先的に使用
2. 任意の値（arbitrary values）の使用を避ける
3. レスポンシブデザインパターンを使用
4. 重複するスタイルはコンポーネント化

## 🌐 国際化（i18n）

### メッセージ定数の使用
```typescript
// ❌ 悪い例: ハードコーディング
<h1>Dashboard</h1>
<button>Sign In</button>

// ✅ 良い例: メッセージ定数使用
import { messages } from '@/constants/messages';
<h1>{messages.dashboard.title}</h1>
<button>{messages.auth.login}</button>
```

### テキストコンテンツの管理
```typescript
// テンプレート使用
import { textTemplates } from '@/constants/text-content';
const greeting = textTemplates.greeting.welcome(userName);
const error = textTemplates.error.notFound('ユーザー');
```

## 📝 TypeScript規約

### 型定義
```typescript
// インターフェース: 拡張可能な場合
interface User {
  id: string;
  name: string;
  email: string;
}

// 型エイリアス: ユニオン型、交差型、プリミティブ
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;
type UserWithRole = User & { role: string };

// Enum: 定数の集合
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

// as const: リテラル型の保持
const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
} as const;
```

### 型の使用
```typescript
// 明示的な型注釈
const count: number = 0;
const name: string = 'John';
const users: User[] = [];

// 関数の型定義
function getUser(id: string): User | null {
  // ...
}

// ジェネリック型
function getValue<T>(key: string): T | undefined {
  // ...
}

// Nullableな値の扱い
// Optional chaining
const email = user?.email;

// Nullish coalescing
const name = user.name ?? 'Guest';

// Type guards
if (typeof value === 'string') {
  // value is string
}
```

## 🎯 ベストプラクティス

### 1. 早期リターン
```typescript
// ❌ 悪い例
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      // 処理
    }
  }
}

// ✅ 良い例
function processUser(user: User | null) {
  if (!user) return;
  if (!user.isActive) return;
  
  // 処理
}
```

### 2. デストラクチャリング
```typescript
// ❌ 悪い例
const name = user.name;
const email = user.email;

// ✅ 良い例
const { name, email } = user;
```

### 3. テンプレートリテラル
```typescript
// ❌ 悪い例
const message = 'Hello, ' + name + '!';

// ✅ 良い例
const message = `Hello, ${name}!`;
```

### 4. 配列メソッドの活用
```typescript
// ❌ 悪い例
const activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) {
    activeUsers.push(users[i]);
  }
}

// ✅ 良い例
const activeUsers = users.filter(user => user.isActive);
```

### 5. async/awaitの使用
```typescript
// ❌ 悪い例
fetchUser(id).then(user => {
  fetchPosts(user.id).then(posts => {
    // ...
  });
});

// ✅ 良い例
async function loadUserData(id: string) {
  const user = await fetchUser(id);
  const posts = await fetchPosts(user.id);
  // ...
}
```

## 🔒 セキュリティ

### 1. 環境変数の管理
```typescript
// ❌ 悪い例: ハードコーディング
const apiKey = 'sk-1234567890';

// ✅ 良い例: 環境変数使用
const apiKey = process.env.API_KEY;

// クライアント側で使用する場合
const publicKey = process.env.NEXT_PUBLIC_API_KEY;
```

### 2. 入力値の検証
```typescript
// 常に入力値を検証
function processInput(input: unknown) {
  // 型ガード
  if (typeof input !== 'string') {
    throw new Error('Invalid input type');
  }
  
  // サニタイゼーション
  const sanitized = input.trim();
  
  // バリデーション
  if (!isValidEmail(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
}
```

### 3. XSS対策
```typescript
// ❌ 悪い例: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 良い例: テキストとして表示
<div>{userInput}</div>
```

## 📁 インポート順序

```typescript
// 1. React/Next.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 2. 外部ライブラリ
import { format } from 'date-fns';
import axios from 'axios';

// 3. 内部モジュール（絶対パス）
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { messages } from '@/constants/messages';

// 4. 相対パス
import { localFunction } from './utils';
import styles from './styles.module.css';

// 5. 型定義
import type { User, Post } from '@/types';
```

## 🧪 テスト

### テストファイルの配置
```typescript
// ユニットテスト
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx

// 統合テスト
tests/
├── integration/
│   └── auth.test.ts

// E2Eテスト
tests/
├── e2e/
│   └── user-flow.test.ts
```

### テストの書き方
```typescript
// describeとitの使用
describe('UserProfile', () => {
  it('should render user name when data is provided', () => {
    // Arrange
    const user = { name: 'John Doe' };
    
    // Act
    render(<UserProfile user={user} />);
    
    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  it('should show loading state when data is fetching', () => {
    // ...
  });
});
```

## 📊 パフォーマンス

### 1. メモ化の適切な使用
```typescript
// useMemo: 計算コストの高い値
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// useCallback: 参照の安定性が必要な関数
const handleClick = useCallback(() => {
  // ...
}, [dependency]);

// React.memo: 再レンダリングの最適化
const MemoizedComponent = React.memo(Component);
```

### 2. 遅延読み込み
```typescript
// 動的インポート
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// 画像の遅延読み込み
import Image from 'next/image';
<Image src="/image.jpg" loading="lazy" />
```

## 📌 コメント規約

### コメントの書き方
```typescript
// 単一行コメント: 簡潔な説明

/**
 * 複数行コメント: 関数やクラスの説明
 * @param userId - ユーザーID
 * @returns ユーザー情報またはnull
 */
function getUser(userId: string): User | null {
  // TODO: キャッシュの実装
  // FIXME: エラーハンドリングの改善
  // NOTE: 認証が必要
  // HACK: 一時的な回避策
}
```

## 🔄 Git規約

### ブランチ命名
```bash
feature/user-authentication
bugfix/login-error
hotfix/security-patch
release/v1.2.0
```

### コミットメッセージ
```bash
# Conventional Commits形式
feat(auth): add social login
fix(ui): correct button alignment
docs(readme): update installation guide
style(format): apply prettier
refactor(api): optimize database queries
test(user): add unit tests
chore(deps): update dependencies
```

## 📚 参考資料

- [命名規則定数](/src/constants/naming-conventions.ts)
- [デザインシステム](.cursor/rules/design-system.md)
- [メッセージ定数](/src/constants/messages.ts)
- [テキストコンテンツ](/src/constants/text-content.ts)

## 📝 更新履歴
- **2025-01-15**: 初回作成
  - 基本的なコーディング規約を定義
  - 命名規則、スタイリング、TypeScript規約を追加
  - セキュリティとパフォーマンスのガイドラインを追加