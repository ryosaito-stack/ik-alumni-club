// Blog型変換ロジック

import { DocumentData, Timestamp } from 'firebase/firestore';
import { Blog, BlogFormData } from '@/types/blog';
import { timestampToDate } from '../utils';

// Firestore DocumentData を Blog 型に変換
export const convertToBlog = (id: string, data: DocumentData): Blog => {
  return {
    id,
    title: data.title || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    thumbnail: data.thumbnail || '',
    published: data.published || false,
    author: data.author || { id: '', name: '', role: '' },
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// BlogFormData を Firestore 用のデータに変換
export const convertToFirestoreData = (formData: BlogFormData) => {
  return {
    title: formData.title,
    excerpt: formData.excerpt,
    content: formData.content,
    thumbnail: formData.thumbnail,
    published: formData.published,
    updatedAt: Timestamp.now(),
  };
};