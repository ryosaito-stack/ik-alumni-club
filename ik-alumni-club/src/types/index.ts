// Member plan types
export type MemberPlan = 'platinum' | 'business' | 'individual';

// User role types
export type UserRole = 'admin' | 'member';

// Member information
export interface Member {
  uid: string;
  email: string;
  displayName: string;
  plan: MemberPlan;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date;
  profileImageUrl?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  company?: string;
  position?: string;
  graduationYear?: string;
  major?: string;
}

// Content types
export type ContentType = 'article' | 'video' | 'document';

// Blog categories
export type BlogCategory = 'TECHNOLOGY' | 'LEADERSHIP' | 'BUSINESS' | 'CAREER' | 'MEMBER' | 'BEHIND' | 'INTERVIEW';

// Content information (also used for Blog articles)
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
  
  // Blog-specific fields (used when type === 'article')
  excerpt?: string;       // 記事の概要
  category?: BlogCategory; // ブログカテゴリ
  readTime?: number;      // 読了時間（分）
  isPremium?: boolean;    // プレミアムコンテンツフラグ
  content?: string;       // HTML形式の本文
  thumbnail?: string;     // サムネイル画像URL
  published?: boolean;    // 公開状態
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

// Plan information
export interface PlanInfo {
  id: MemberPlan;
  name: string;
  description: string;
  price: number;
  features: string[];
  color: string;
  recommended?: boolean;
}

// Information (お知らせ) types
export type InformationCategory = 'お知らせ' | '更新情報' | 'メンテナンス';
export type TargetMember = 'PLATINUM' | 'BUSINESS' | 'INDIVIDUAL' | 'ALL';

// Author information
export interface InformationAuthor {
  id: string;
  name: string;
  role?: string;
}

// Information (お知らせ) interface
export interface Information {
  id: string;
  title: string;
  date: Date;
  category: InformationCategory;
  content: string;
  summary: string;
  targetMembers: TargetMember[];
  isPinned: boolean;
  published: boolean;
  author: InformationAuthor;
  createdAt: Date;
  updatedAt: Date;
}

// Form data for creating/updating Information
export interface InformationFormData {
  title: string;
  date: Date;
  category: InformationCategory;
  content: string;
  summary: string;
  targetMembers: TargetMember[];
  isPinned: boolean;
  published: boolean;
}

// Query options for fetching Information
export interface InformationQueryOptions {
  category?: InformationCategory;
  targetMembers?: TargetMember[];
  published?: boolean;
  isPinned?: boolean;
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

// Video category types
export type VideoCategory = 
  | 'CONFERENCE' 
  | 'SEMINAR' 
  | 'WORKSHOP' 
  | 'INTERVIEW' 
  | 'EVENT' 
  | 'FEATURE';

// Video author
export interface VideoAuthor {
  id: string;
  name: string;
  role: string;
}

// Video data
export interface Video {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  videoUrl?: string;
  thumbnail?: string;
  published: boolean;
  featuredInCarousel?: boolean;
  sortOrder?: number;
  author: VideoAuthor;
  createdAt: Date;
  updatedAt: Date;
}

// Video form data
export interface VideoFormData {
  title: string;
  description: string;
  category: VideoCategory;
  videoUrl?: string;
  thumbnail?: string;
  published: boolean;
  featuredInCarousel?: boolean;
  sortOrder?: number;
}

// Query options for fetching Video
export interface VideoQueryOptions {
  published?: boolean;
  category?: VideoCategory;
  featuredInCarousel?: boolean;
  limit?: number;
  orderBy?: 'sortOrder' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}