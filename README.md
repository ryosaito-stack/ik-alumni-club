# IK ALUMNI CGT サポーターズクラブ会員サイト

## 📌 プロジェクト概要
カラーガードダンスチーム「IK ALUMNI CGT」のサポーターズクラブ会員向けサイト。
会員限定コンテンツや特典を提供し、チームと支援者のつながりを強化する。

## 1. このプロジェクトの目的
- **IK ALUMNI CGT**のサポーター向け会員限定サイトの構築
- Firebase Emulator（ローカル練習用Firebase）を使って **安全＆無料** で開発する
- 会員登録・ログイン（メール＆パスワード）
- 会員プランごとのページ表示（PLATINUM / BUSINESS / INDIVIDUAL）
- 実際のFirebaseにデプロイする前に、ローカルで動作確認できるようにする

---

## 2. 必要なもの
- Node.js（推奨: v20以上）
- npm または yarn
- Googleアカウント（本番用Firebase作成時に使う）
- ターミナル（コマンドを打つ画面）

---

## 3. セットアップ手順

### 3-1. 依存インストール
```bash
npm install
npm install -D firebase-tools ts-node firebase-admin
```

### 3-2. Firebaseエミュレーター設定
```bash
npx firebase init emulators
```
Firestore / Auth / Storage / Emulator UI を選択

ポート番号は以下を推奨:
- Firestore: 8080
- Auth: 9099
- Storage: 9199
- Emulator UI: 4000

### 3-3. firebase.json
```json
{
  "emulators": {
    "ui": { "enabled": true, "host": "127.0.0.1", "port": 4000 },
    "firestore": { "host": "127.0.0.1", "port": 8080 },
    "auth": { "host": "127.0.0.1", "port": 9099 },
    "storage": { "host": "127.0.0.1", "port": 9199 }
  },
  "firestore": { "rules": "firestore.rules" },
  "storage": { "rules": "storage.rules" }
}
```

### 3-4. Firestoreルール（firestore.rules）
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /contents/{id} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

### 3-5. Storageルール（storage.rules）
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## 4. Next.js でエミュレーター接続

### .env.local
```env
NEXT_PUBLIC_USE_EMULATORS=true
```

### lib/firebase.ts
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'demo',
  authDomain: 'localhost',
  projectId: 'demo-project',
  storageBucket: 'demo-bucket',
  appId: 'demo-app',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}
```

## 5. 開発の流れ

### 5-1. エミュレーター起動（データ永続化対応済み）
```bash
npm run emu
```
**📂 データ永続化機能（2025-08-16更新）**
- 初回起動時: 新規データベースとして開始
- 2回目以降: `./emulator-data`フォルダから前回のデータを自動読み込み
- 終了時（Ctrl+C）: データが自動的に`./emulator-data`に保存される

ブラウザで:
- http://127.0.0.1:4000 → エミュレーターUI（データの確認や操作ができる）

### 5-2. Next.js起動
```bash
npm run dev
```

ブラウザで:
- http://localhost:3000 → アプリ画面

### 5-3. ダミーデータ投入（シード）
```bash
npm run seed
```
→ Firestore にテスト用の会員・コンテンツデータが追加される

### 5-4. データの手動管理（オプション）
```bash
# データを手動でエクスポート
npm run emu:export

# 保存済みデータで起動
npm run emu:import
```

## ## 6. 本番に切り替えるとき
1. `.env.local` の `NEXT_PUBLIC_USE_EMULATORS=false` にする
2. Firebase Console で同じルール・データ構造を設定
3. `firebase deploy` で本番環境に公開

## ## 7. 注意
- ~~エミュレーターのデータは、終了すると消えます~~ → **データ永続化対応済み（2025-08-16）**
  - 自動的に`./emulator-data`フォルダに保存・読み込みされます
- Authのメール送信系機能（パスワードリセット等）は、実際には送られず、UIで確認用リンクを表示します
- 本番とエミュレーターの設定を混ぜないように、`.env.local` で切り替えましょう

## ## 8. よくあるエラー

| エラー | 原因 | 対策 |
|--------|------|------|
| auth/invalid-api-key | 本番キーを使っていない | エミュレーター用にダミーキーでOK |
| permission-denied | ルールが厳しすぎる | Firestoreルールを確認 |
| connection refused | エミュが起動していない | npm run emu を先に実行 |

## 9. 実装状況（2025-08-18更新）

### ✅ 実装済み機能
- 会員登録・ログイン・ダッシュボード
- プロフィール管理
- お問い合わせフォーム
- お知らせ（INFORMATION）
- イベントスケジュール
- 動画・ブログコンテンツ（基本機能）
- 管理者向けユーザー・コンテンツ管理

### 🔴 未実装機能（要件定義より）
- コンサート映像ページ（YouTube限定公開）
- 会報配信ページ（PDF/HTML）
- 特典一覧ページ
- FAQ（よくある質問）
- 利用規約・プライバシーポリシー
- 支援者の声
- 会員特典利用ガイド

詳細は `CLAUDE.md` を参照してください。

## 10. 管理者アカウント
✨ テストユーザーの作成が完了しました！

📋 ログイン情報:
================================
管理者太郎 (platinum/admin)
  Email: admin@example.com
  Password: password123
--------------------------------
プラチナ花子 (platinum/member)
  Email: platinum@example.com
  Password: password123
--------------------------------
ビジネス次郎 (business/member)
  Email: business@example.com
  Password: password123
--------------------------------
個人三郎 (individual/member)
  Email: individual@example.com
  Password: password123
--------------------------------