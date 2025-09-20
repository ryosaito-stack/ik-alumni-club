import { DocumentData, Timestamp } from 'firebase/firestore';
import { Newsletter, NewsletterFormData } from '@/types/newsletter';
import { timestampToDate } from '../utils';

// Firestore DocumentData を Newsletter 型に変換
export const convertToNewsletter = (id: string, data: DocumentData): Newsletter => {
  return {
    id,
    title: data.title || '',
    issueNumber: data.issueNumber || 0,
    content: data.content || '',
    excerpt: data.excerpt || '',
    pdfUrl: data.pdfUrl,
    author: data.author,
    published: data.published || false,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// NewsletterFormData を Firestore 用のデータに変換
export const convertToFirestoreData = (formData: NewsletterFormData) => {
  return {
    title: formData.title,
    issueNumber: formData.issueNumber,
    content: formData.content,
    excerpt: formData.excerpt,
    pdfUrl: formData.pdfUrl,
    published: formData.published,
    updatedAt: Timestamp.now(),
  };
};