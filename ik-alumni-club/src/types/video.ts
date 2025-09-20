import { Author } from './author';

// Video data
export interface Video {
  id: string;
  title: string;              // タイトル
  date: Date;                 // 日付
  videoUrl: string;           // 動画URL（必須）
  thumbnail: string;          // サムネイル画像（必須）
  published: boolean;         // 公開状態
  author: Author;             // 作成者情報
  createdAt: Date;            // 作成日時
  updatedAt: Date;            // 更新日時
}

// Video form data
export interface VideoFormData {
  title: string;
  date: Date;
  videoUrl: string;
  thumbnail: string;
  published: boolean;
}

// Query options for fetching Video
export interface VideoQueryOptions {
  published?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  orderBy?: 'date' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}