// Member plan types - プラチナを個人・法人で分割
export type MemberPlan = 'platinum_individual' | 'platinum_business' | 'business' | 'individual';

// User role types
export type UserRole = 'admin' | 'member';

// Member information - 入会時必要情報
export interface Member {
  uid: string;
  email: string;
  
  // 名前関連（必須）
  lastName: string;          // 姓
  firstName: string;         // 名
  lastNameKana: string;      // セイ（カナ）
  firstNameKana: string;     // メイ（カナ）
  
  // 住所情報（必須）
  postalCode: string;        // 郵便番号
  prefecture: string;        // 都道府県
  city: string;             // 市区町村
  address: string;          // 町名以降
  building?: string;        // 建物名（任意）
  
  // 連絡先（必須）
  phoneNumber: string;       // 電話番号
  
  // 会員情報
  plan: MemberPlan;         // 会員種別
  role?: UserRole;          // 権限（admin/member）
  isActive: boolean;        // アカウントの有効化状態
  
  // システム情報
  createdAt: Date;
  updatedAt: Date;
}

// ===== BLOG関連の型定義 =====

// Blog author
export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
}

// Blog data
export interface Blog {
  id: string;
  title: string;              // タイトル
  excerpt: string;            // 記事の概要
  content: string;            // HTML形式の本文
  thumbnail: string;          // サムネイル画像URL
  published: boolean;         // 公開状態
  author: BlogAuthor;         // 作成者情報
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
}

// Blog form data
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

// BlogCategory型も削除されたため、Contentインターフェースからも参照を削除
// Content types (Legacy - 削除予定)
export type ContentType = 'article' | 'video' | 'document';

// Content information (Legacy - 削除予定)
export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  requiredPlan: MemberPlan;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  fileUrl?: string;
  excerpt?: string;
  readTime?: number;
  isPremium?: boolean;
  content?: string;
  thumbnail?: string;
  published?: boolean;
}

// Auth form data
export interface AuthFormData {
  email: string;
  password: string;
  displayName?: string;
}

// Auth error
export interface AuthError {
  code: string;
  message: string;
}

// Plan information - 4種類のプランに対応
export interface PlanInfo {
  id: MemberPlan;
  name: string;
  displayName: string;      // 表示用名称（プラチナ個人、プラチナ法人など）
  description: string;
  price: number;
  features: string[];
  color: string;
  recommended?: boolean;
  isBusinessPlan?: boolean;  // 法人プランかどうか
}

// Information (お知らせ) interface
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

// ===== SCHEDULE関連の型定義 =====

// Schedule author
export interface ScheduleAuthor {
  id: string;
  name: string;
  role: string;
}

// Schedule data
export interface Schedule {
  id: string;
  title: string;
  content: string;
  date: Date;
  imageUrl?: string;        // 画像URL（任意）
  link?: string;
  sortOrder?: number;
  published: boolean;
  author: ScheduleAuthor;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule form data
export interface ScheduleFormData {
  title: string;
  content: string;
  date: Date;
  imageUrl?: string;
  link?: string;
  sortOrder?: number;
  published: boolean;
}

// Query options for fetching Schedule
export interface ScheduleQueryOptions {
  published?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  orderBy?: 'date' | 'sortOrder' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

// ===== VIDEO関連の型定義 =====

// Video author
export interface VideoAuthor {
  id: string;
  name: string;
  role: string;
}

// Video data
export interface Video {
  id: string;
  title: string;              // タイトル
  date: Date;                 // 日付
  videoUrl: string;           // 動画URL（必須）
  thumbnail: string;          // サムネイル画像（必須）
  published: boolean;         // 公開状態
  author: VideoAuthor;        // 作成者情報
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
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

// ===== NEWSLETTER関連の型定義 =====

// Newsletter data
export interface Newsletter {
  id: string;
  title: string;              // タイトル
  issueNumber: number;        // 第○号
  content: string;            // HTML形式のコンテンツ
  excerpt: string;            // 概要（一覧表示用）
  pdfUrl?: string;            // PDF版URL（オプション）
  published: boolean;         // 公開/非公開
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
}

// Query options for fetching Newsletter
export interface NewsletterQueryOptions {
  published?: boolean;
  limit?: number;
  orderBy?: 'issueNumber' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}