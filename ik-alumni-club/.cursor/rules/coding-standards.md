# コーディング規約とベストプラクティス

## 📋 概要
このドキュメントは、IK Alumni Clubプロジェクトのコーディング規約とベストプラクティスを定義します。
すべての開発者はこれらの規約に従って実装を行ってください。

最終更新: 2025-08-16

---

## 🌐 言語管理とテキスト表示

### 基本原則
1. **すべての表示テキストは`messages.ts`で一元管理する**
2. **ハードコードされた日本語・英語テキストを避ける**
3. **UIテキストは日本語で統一する**

### 実装ルール

#### ✅ 良い例
```typescript
import { messages } from '@/constants/messages';

// 正しい実装
<h1>{messages.contents.title}</h1>
<p>{messages.common.loading}</p>
<button>{messages.auth.login}</button>
```

#### ❌ 悪い例
```typescript
// 避けるべき実装
<h1>コンテンツ</h1>
<p>読み込み中...</p>
<button>Login</button>
```

### messages.ts の構造
```typescript
export const messages = {
  common: {        // 共通メッセージ
    loading: '読み込み中...',
    error: 'エラーが発生しました',
  },
  auth: {          // 認証関連
    login: 'ログイン',
    logout: 'ログアウト',
  },
  contents: {      // コンテンツ関連
    title: 'コンテンツ',
    library: 'コンテンツライブラリ',
  },
  // 機能ごとにセクションを追加
};
```

---

## 🎨 デザイントークンとスタイリング

### 基本原則
1. **デザイントークンを優先的に使用する**
2. **直接的なTailwindクラスは最小限に留める**
3. **色やスペーシングの値をハードコードしない**

### 実装ルール

#### デザイントークンの使用
```typescript
import { 
  components, 
  typography, 
  spacing, 
  layout 
} from '@/constants/design-tokens';

// 推奨される実装
<div className={components.card.base}>
  <h2 className={typography.fontSize.lg}>
    タイトル
  </h2>
  <div className={spacing.margin.bottom.md}>
    コンテンツ
  </div>
</div>
```

#### 色の参照に関する注意
- `colors.bg`や`colors.text`オブジェクトは存在するが、実装上の問題がある場合は直接Tailwindクラスを使用
- 将来的にデザイントークンの完全統一を目指す

```typescript
// 現状許容される実装
<div className="bg-indigo-600 text-white">
<div className="bg-red-50 text-red-800">

// 理想的な実装（将来的な目標）
<div className={`${colors.bg.primary} ${colors.text.white}`}>
```

---

## 📁 ファイル構造とコンポーネント設計

### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   └── (dashboard)/       # ダッシュボード関連ページ
├── components/            # 再利用可能なコンポーネント
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ関数
├── types/                 # TypeScript型定義
└── constants/            # 定数ファイル
    ├── messages.ts       # テキストメッセージ
    └── design-tokens.ts  # デザイントークン
```

### コンポーネント設計原則
1. **単一責任の原則**: 1つのコンポーネントは1つの責務を持つ
2. **再利用性**: 汎用的なコンポーネントは`components/`に配置
3. **型安全性**: TypeScriptの型定義を必ず使用

---

## 🔒 Firebase とデータアクセス

### Firestore アクセスパターン
```typescript
// lib/firestore.ts にデータアクセスロジックを集約
export async function getContentsForPlan(userPlan: MemberPlan): Promise<Content[]> {
  // プランに応じたコンテンツ取得ロジック
}

// hooks/useContents.ts でReactフックとして提供
export function useContents() {
  const [contents, setContents] = useState<Content[]>([]);
  // Firestoreからデータ取得
  return { contents, loading, error };
}
```

### アクセス制御
- プラン階層: Platinum > Business > Individual
- 管理者（admin）は全コンテンツアクセス可能
- `canAccessContent()`関数でアクセス権限をチェック

---

## 🚫 避けるべきパターン

### 1. ハードコードされたテキスト
```typescript
// ❌ 避ける
<p>コンテンツが見つかりません</p>

// ✅ 推奨
<p>{messages.contents.notFound}</p>
```

### 2. 未使用のインポート
```typescript
// ❌ 避ける
import { colors, spacing } from '@/constants/design-tokens';
// colorsを使用していない場合

// ✅ 推奨
import { spacing } from '@/constants/design-tokens';
```

### 3. 英語と日本語の混在
```typescript
// ❌ 避ける
<h1>Contents Library</h1>
<p>ようこそ</p>

// ✅ 推奨
<h1>{messages.contents.library}</h1>
<p>{messages.common.welcome}</p>
```

---

## 📝 新機能実装時のチェックリスト

新しい機能を実装する際は、以下のチェックリストを確認してください：

- [ ] すべての表示テキストが`messages.ts`で定義されている
- [ ] デザイントークンを使用してスタイリングしている
- [ ] TypeScriptの型定義が適切に設定されている
- [ ] コンポーネントが適切なディレクトリに配置されている
- [ ] Firestoreアクセスロジックが`lib/`に集約されている
- [ ] アクセス制御が適切に実装されている
- [ ] 不要なインポートがない
- [ ] コメントは日本語で記述されている（UIテキストは除く）

---

## 🔄 既存コードの改善

既存のコードを修正する際は：

1. **まずmessages.tsを確認**し、必要なメッセージが定義されているか確認
2. **ハードコードされたテキストを発見したら**、messages.tsに追加して参照に変更
3. **デザイントークンで置き換え可能な箇所**は積極的に置き換える
4. **英語テキストを発見したら**、日本語化してmessages.tsに追加

---

## 文字エンコーディング規約（既存）

### 基本原則
- **すべてのファイルはUTF-8で保存する**
- **BOMなしUTF-8を使用**
- **改行コードはLF（Unix形式）**

### VSCode設定
`.vscode/settings.json`に以下を追加：
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false,
  "files.eol": "\n"
}
```

---

## Git コミット規約

### コミットメッセージ形式
```
<type>: <subject>

<body>
```

### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: ビルド関連

---

## 📚 参考資料

- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [TypeScript ベストプラクティス](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)

---

## 更新履歴

- 2025-08-16: 大幅改訂
  - 言語管理とテキスト表示のルール強化
  - messages.ts による一元管理の徹底
  - デザイントークンの使用方法明確化
  - 新機能実装時のチェックリスト追加
- 2025-08-15: 初版作成（文字エンコーディング問題への対応を含む）