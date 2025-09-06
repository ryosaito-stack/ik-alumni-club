# Firestoreコレクション設計書

## INFORMATIONコレクション

### コレクション名: `informations`

### 実装フィールド（Phase 1）

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| id | string | ○ | Firestore自動生成のドキュメントID |
| title | string | ○ | お知らせのタイトル |
| date | Timestamp | ○ | 公開日時（表示用） |
| category | string | ○ | カテゴリー（お知らせ/更新情報/メンテナンス） |
| content | string | ○ | 本文内容（HTML形式で保存） |
| summary | string | ○ | 概要文（100文字程度、一覧表示用） |
| targetMembers | string[] | ○ | 対象会員（PLATINUM/BUSINESS/INDIVIDUAL/ALL） |
| isPinned | boolean | ○ | ピン留め（固定表示）フラグ |
| published | boolean | ○ | 公開/非公開の状態 |
| author | object | ○ | 作成者情報 |
| ├─ id | string | ○ | 作成者のUID |
| ├─ name | string | ○ | 作成者の表示名 |
| └─ role | string | △ | 作成者の役割（管理者など） |
| createdAt | Timestamp | ○ | 作成日時 |
| updatedAt | Timestamp | ○ | 更新日時 |

### カテゴリー定義
- `お知らせ` - 一般的なお知らせ
- `更新情報` - システムやサービスの更新情報
- `メンテナンス` - メンテナンスに関する情報

### 対象会員定義
- `PLATINUM` - プラチナ会員のみ
- `BUSINESS` - ビジネス会員以上
- `INDIVIDUAL` - 個人会員以上
- `ALL` - 全ユーザー（非会員含む）

※複数選択可能（例：["PLATINUM", "BUSINESS"]）

### 将来の拡張フィールド（Phase 2以降）

| フィールド名 | 型 | 用途 |
|------------|---|------|
| priority | string | 重要度（high/normal/low）で並び順制御 |
| expiresAt | Timestamp/null | 有効期限（自動非表示化） |
| tags | string[] | 検索用タグ |
| attachments | object[] | 添付ファイル情報 |
| relatedLinks | object[] | 関連リンク |
| viewCount | number | 閲覧数カウンター |
| ogImage | string | OGP画像URL（SNSシェア用） |
| metaDescription | string | SEO用メタディスクリプション |

### インデックス設計

1. **複合インデックス**
   - `published` (ASC) + `isPinned` (DESC) + `date` (DESC)
     - 公開中のお知らせをピン留め優先、日付順で取得
   
2. **単一インデックス**
   - `category` - カテゴリーフィルタリング用
   - `targetMembers` (Array) - 会員種別フィルタリング用
   - `createdAt` - 管理画面での並び替え用

### セキュリティルール

```javascript
// 読み取り権限
allow read: if isPublished() && isTargetMember();

// 書き込み権限（管理者のみ）
allow write: if request.auth != null && isAdmin();

// ヘルパー関数
function isPublished() {
  return resource.data.published == true;
}

function isTargetMember() {
  return resource.data.targetMembers.hasAny(['ALL']) ||
         (request.auth != null && 
          resource.data.targetMembers.hasAny([getUserMemberType()]));
}

function isAdmin() {
  return request.auth.token.admin == true;
}
```

### データ例

```json
{
  "id": "auto-generated-id",
  "title": "プラチナ会員限定イベント開催のお知らせ",
  "date": "2024-08-20T09:00:00Z",
  "category": "お知らせ",
  "content": "<p>プラチナ会員の皆様を対象とした...</p>",
  "summary": "9月15日にプラチナ会員限定のネットワーキングイベントを開催します。",
  "targetMembers": ["PLATINUM"],
  "isPinned": false,
  "published": true,
  "author": {
    "id": "user-uid-123",
    "name": "管理者太郎",
    "role": "admin"
  },
  "createdAt": "2024-08-18T10:00:00Z",
  "updatedAt": "2024-08-18T10:00:00Z"
}
```

---

*最終更新: 2025-08-18*