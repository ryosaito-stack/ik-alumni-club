import { DocumentData, Timestamp } from 'firebase/firestore'
import { Information, InformationFormData } from '@/types/information';
import { timestampToDate } from '../utils';

// Firestore DocumentData を Information 型に変換
export const convertToInformation = (id: string, data: DocumentData): Information => {
  return {
    id,
    date: timestampToDate(data.date),
    title: data.title || '',
    content: data.content || '',
    imageUrl: data.imageUrl,
    url: data.url,
    published: data.published || false,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// InformationFormData を Firestore 用のデータに変換
export const convertToFirestoreData = (formData: InformationFormData) => {
  return {
    date: Timestamp.fromDate(formData.date),
    title: formData.title,
    content: formData.content,
    imageUrl: formData.imageUrl,
    url: formData.url,
    published: formData.published,
    updatedAt: Timestamp.now(),
  };
};