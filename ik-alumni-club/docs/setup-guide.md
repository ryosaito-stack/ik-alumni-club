# IK Alumni Club - 初期設定ガイド

## 作成日：2025-08-15

このドキュメントは、IK Alumni Clubプロジェクトの初期設定手順を記録したものです。

## 📝 実施した設定手順

### 1. Next.jsプロジェクトの作成
```bash
npx create-next-app@latest ik-alumni-club --typescript --tailwind --app --no-src-dir
```
- TypeScript、Tailwind CSS、App Routerを有効化
- ESLintは有効、Import aliasは無効を選択

### 2. プロジェクト構造の調整
```bash
cd ik-alumni-club
mkdir src && mv app src/
```
- srcディレクトリを作成し、appフォルダを移動

### 3. Firebaseパッケージのインストール
```bash
npm install firebase firebase-admin
npm install -D firebase-tools ts-node @types/node
```
- クライアント用SDK: firebase v12.1.0
- 管理用SDK: firebase-admin v13.4.0
- 開発ツール: firebase-tools v14.12.0

### 4. package.jsonへのスクリプト追加
```json
"scripts": {
  "emu": "firebase emulators:start",
  "emu:export": "firebase emulators:export ./emulator-data",
  "emu:import": "firebase emulators:start --import ./emulator-data",
  "seed": "ts-node scripts/seed.ts",
  "type-check": "tsc --noEmit"
}
```

### 5. Firebase初期化
```bash
npx firebase init firestore
npx firebase init emulators
```
- Firestore、Auth、Storage、Emulator UIを設定
- ポート設定：
  - Auth: 9099
  - Firestore: 8080
  - Storage: 9199
  - UI: 4000

### 6. セキュリティルールの設定

**firestore.rules:**
```javascript
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

**storage.rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.metadata.uid;
    }
  }
}
```

### 7. 環境変数の設定（.env.local）
```env
NEXT_PUBLIC_USE_EMULATORS=true
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=demo-sender
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app
```

## 🔧 トラブルシューティング

### Node.jsバージョンエラー
**問題:** Firebase CLI v14.12.0はNode.js v20以上が必要
**解決方法:**
```bash
nvm install 20
nvm use 20
```

### Java Runtime エラー（2025-08-15追記）
**問題:** `Error: Process java -version has exited with code 1`
**原因:** Firebase EmulatorsはJavaで動作するため、Javaランタイムが必要
**解決方法:**

#### Homebrewでインストール（推奨）
```bash
# Java 17 LTSをインストール
brew install openjdk@17

# パスを通す（zshの場合）
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# インストール確認
java -version
```

#### 公式サイトからインストール
1. https://www.oracle.com/java/technologies/downloads/ にアクセス
2. Java 17 LTS版をダウンロード
3. インストーラーを実行

### Firebaseコマンド選択画面でスペースキーが効かない
**問題:** 機能選択時にスペースキーで選択できない
**解決方法:** 個別にコマンドを実行
```bash
npx firebase init firestore
npx firebase init emulators
```

### プロジェクトID未指定エラー（2025-08-15追記）
**問題:** `Error: Cannot start the Authentication Emulator without a project`
**解決方法:** package.jsonのスクリプトに`--project demo-project`を追加
```json
"emu": "firebase emulators:start --project demo-project"
```

### Next.js起動時のNode.jsバージョンエラー（2025-08-15追記）
**問題:** `You are using Node.js 18.14.2. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required`
**解決方法:** 
```bash
nvm use 20  # 起動前に毎回実行
npm run dev
```

### VSCodeの文字化け問題（2025-08-15追記）
**問題:** ファイルが文字化けして表示される、日本語が正しく保存されない
**原因:** VSCodeのエンコーディング設定またはファイル作成時のエンコーディング問題

**解決方法:**
1. **VSCode設定を更新** (Cmd+Shift+P → Preferences: Open User Settings JSON)
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false
}
```

2. **ファイルを再作成**
```bash
rm <file_path> && touch <file_path>
```

3. **推奨事項:** 
- UIテキストは英語で記述（エンコーディング問題を回避）
- 日本語はコメントのみに限定
- ファイル作成時は必ずUTF-8を指定

## 📂 作成されたファイル構成
```
ik-alumni-club/
├── firebase.json          # Firebase設定
├── firestore.rules       # Firestoreセキュリティルール
├── firestore.indexes.json # Firestoreインデックス
├── storage.rules         # Storageセキュリティルール
├── .env.local           # 環境変数
├── .firebaserc          # Firebaseプロジェクト設定
└── src/
    └── app/            # Next.js App Router
```

## 📚 学習ポイント

1. **Firebase Emulatorを使う理由**
   - 本番環境を使わずローカルで開発可能
   - 無料で全機能をテスト
   - データのリセットが簡単

2. **セキュリティルールの重要性**
   - ユーザーは自分のデータのみアクセス可能
   - コンテンツは認証済みユーザーのみ閲覧可能
   - 書き込み権限は厳密に制御

3. **環境変数の管理**
   - `.env.local`で環境依存の設定を管理
   - `NEXT_PUBLIC_`プレフィックスでクライアント側で使用可能に

## 🚀 アプリケーション起動手順（完全版）

### 前提条件の確認
1. **Node.js v20以上**
   ```bash
   node -v  # v20.19.4以上を確認
   nvm use 20  # 必要に応じて切り替え
   ```

2. **Java 17**
   ```bash
   java -version  # openjdk version "17.x.x"を確認
   ```

### 起動手順
1. **ターミナル1: Firebase Emulatorを起動**
   ```bash
   cd /Users/ryosaito/Developer/learning/ik-alumni-club-demo/ik-alumni-club
   npm run emu
   ```
   
   成功時の表示：
   - ✔ All emulators ready!
   - Emulator UI: http://127.0.0.1:4000

2. **ターミナル2: Next.js開発サーバーを起動**
   ```bash
   cd /Users/ryosaito/Developer/learning/ik-alumni-club-demo/ik-alumni-club
   nvm use 20  # Node.js v20に切り替え
   npm run dev
   ```
   
   成功時の表示：
   - ▲ Next.js 15.4.6
   - Local: http://localhost:3000

### アクセスURL
- **アプリケーション**: http://localhost:3000
- **Firebase Emulator UI**: http://127.0.0.1:4000
  - Authentication: ユーザー管理
  - Firestore: データベース確認
  - Storage: ファイル管理

## 次のステップ
- [x] ディレクトリ構造の完成（lib, components, hooks, types）
- [x] Firebase初期化ファイル（lib/firebase.ts）の作成
- [x] 認証システムの基盤実装
- [ ] ログイン/サインアップUIの実装
- [ ] テストデータの投入