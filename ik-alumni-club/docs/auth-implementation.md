# 認証システム実装ガイド

## 作成日：2025-08-15

このドキュメントは、IK Alumni Clubの認証システム実装について記録したものです。

## 📚 実装した機能

### 1. Firebase初期化（src/lib/firebase.ts）

#### 主な機能
- Firebaseアプリの初期化
- Auth、Firestore、Storageサービスのエクスポート
- エミュレーター自動接続（開発環境）
- ホットリロード対策（重複接続防止）

#### エミュレーター接続設定
```typescript
// エミュレーターのポート設定
- Auth: http://127.0.0.1:9099
- Firestore: 127.0.0.1:8080
- Storage: 127.0.0.1:9199
```

#### 環境変数による切り替え
- `NEXT_PUBLIC_USE_EMULATORS=true`: エミュレーター使用
- `NEXT_PUBLIC_USE_EMULATORS=false`: 本番Firebase使用

### 2. 型定義（src/types/index.ts）

#### 定義した型
- `MemberPlan`: 会員プラン（platinum | business | individual）
- `Member`: 会員情報インターフェース
- `Content`: コンテンツ情報インターフェース
- `ContentType`: コンテンツ種別（article | video | document）
- `AuthFormData`: 認証フォーム用データ
- `AuthError`: エラー情報
- `PlanInfo`: プラン詳細情報

### 3. 認証カスタムフック（src/hooks/useAuth.ts）

#### 提供する機能
```typescript
const {
  user,        // Firebase Authのユーザー情報
  member,      // Firestoreの会員情報
  loading,     // ローディング状態
  error,       // エラーメッセージ
  signup,      // サインアップ関数
  login,       // ログイン関数
  logout,      // ログアウト関数
  isAuthenticated // 認証状態
} = useAuth();
```

#### サインアップ処理の流れ
1. Firebase Authでユーザー作成
2. displayNameの設定（オプション）
3. Firestoreに会員情報保存
4. デフォルトプランは'individual'

#### ログイン処理の流れ
1. メールとパスワードで認証
2. 自動的に会員情報を取得
3. エラー時は日本語メッセージ表示

#### エラーメッセージの日本語化
- `auth/email-already-in-use`: このメールアドレスは既に使用されています
- `auth/invalid-email`: メールアドレスの形式が正しくありません
- `auth/weak-password`: パスワードは6文字以上で設定してください
- `auth/user-not-found`: ユーザーが見つかりません
- `auth/wrong-password`: パスワードが間違っています

### 4. パスエイリアスの設定（tsconfig.json）

```json
"paths": {
  "@/*": ["./src/*"]
}
```
- `@/lib/firebase`のような形式でインポート可能
- 相対パスの複雑さを回避

## 🎯 使用例

### サインアップの実装例
```tsx
const { signup, error } = useAuth();

const handleSignup = async () => {
  try {
    await signup({
      email: 'user@example.com',
      password: 'password123',
      displayName: '山田太郎'
    }, 'individual'); // プランを指定
  } catch (err) {
    console.error(error); // 日本語エラーメッセージ
  }
};
```

### ログインの実装例
```tsx
const { login, error } = useAuth();

const handleLogin = async () => {
  try {
    await login('user@example.com', 'password123');
    // 成功時は自動的にリダイレクト
  } catch (err) {
    console.error(error); // 日本語エラーメッセージ
  }
};
```

### 認証状態の確認
```tsx
const { user, member, isAuthenticated, loading } = useAuth();

if (loading) return <div>読み込み中...</div>;

if (isAuthenticated) {
  return <div>ようこそ、{member?.displayName}さん</div>;
} else {
  return <div>ログインしてください</div>;
}
```

## 📝 注意事項

### エミュレーター使用時の注意
1. エミュレーターを先に起動（`npm run emu`）
2. その後Next.jsを起動（`npm run dev`）
3. コンソールに「🔥 Firebase Emulators接続完了」が表示されることを確認

### 型安全性の確保
- すべてのFirebase操作でTypeScriptの型定義を使用
- `any`型の使用は最小限に（エミュレーター接続チェック部分のみ）

### セキュリティ考慮事項
- パスワードは6文字以上を強制
- 会員情報へのアクセスは本人のUIDのみ
- エラーメッセージで詳細な情報を漏らさない

## 次のステップ
- [ ] ログイン/サインアップページのUI実装
- [ ] プロテクトルート（認証必須ページ）の実装
- [ ] パスワードリセット機能
- [ ] ソーシャルログイン（Google認証等）の追加