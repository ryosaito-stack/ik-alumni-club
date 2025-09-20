// Blog関連の型定義

// Import common Author type
import type { Author } from './author';

// Blog data
export interface Blog {
  id: string;
  title: string;              // タイトル
  excerpt: string;            // 記事の概要
  content: string;            // HTML形式の本文
  thumbnail: string;          // サムネイル画像URL
  published: boolean;         // 公開状態
  author: Author;             // 作成者情報（共通型を使用）
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
}

// Blog form data (フォーム用の型 - id, createdAt等を除外)
export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  published: boolean;
}

// Query options for fetching Blog
export interface BlogQueryOptions {
  published?: boolean;
  limit?: number;
  orderBy?: 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

// BlogAuthor type alias for backward compatibility
export type BlogAuthor = Author;