// Import common Author type
import type { Author } from './author';

// Use common Author type for Schedule
export type ScheduleAuthor = Author;

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
  author: Author;
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