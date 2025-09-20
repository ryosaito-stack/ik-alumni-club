import { Author } from './author';

// Newsletter data
export interface Newsletter {
  id: string;
  title: string;              // タイトル
  issueNumber: number;        // 第○号
  content: string;            // HTML形式のコンテンツ
  excerpt: string;            // 概要（一覧表示用）
  pdfUrl?: string;            // PDF版URL（オプション）
  author?: Author;            // 作成者情報（共通型を使用）
  published: boolean;         // 公開/非公開
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
}

// Form data for creating/updating Newsletter
export interface NewsletterFormData {
  title: string;
  issueNumber: number;
  content: string;
  excerpt: string;
  pdfUrl?: string;
  published: boolean;
}

// Query options for fetching Newsletter
export interface NewsletterQueryOptions {
  published?: boolean;
  limit?: number;
  orderBy?: 'issueNumber' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}