export interface Information {
  id: string;
  date: Date;                // 日付
  title: string;             // 記事タイトル
  content: string;           // 本文
  imageUrl?: string;         // 画像URL（任意）
  url?: string;              // リンクURL（任意）
  published: boolean;        // 公開状態
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
}

// Form data for creating/updating Information
export interface InformationFormData {
  date: Date;
  title: string;
  content: string;
  imageUrl?: string;
  url?: string;
  published: boolean;
}

// Query options for fetching Information
export interface InformationQueryOptions {
  published?: boolean;
  limit?: number;
  orderBy?: 'date' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}