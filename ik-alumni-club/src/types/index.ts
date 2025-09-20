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
// Blog型定義は独立ファイルに移動
export * from './blog';

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

// ===== NEWSLETTER関連の型定義 =====
export type { Newsletter, NewsletterFormData, NewsletterQueryOptions } from './newsletter';