// 型変換ロジック
import { timestampToDate } from '../utils';
import { 
  DocumentData, 
  Timestamp,
  serverTimestamp,
  Schedule,
  ScheduleFormData,
  Author
} from './constants';

// Firestore DocumentData → TypeScript型変換
export const convertToSchedule = (id: string, data: DocumentData): Schedule => {
  return {
    id,
    title: data.title || '',
    content: data.content || '',
    date: timestampToDate(data.date),
    imageUrl: data.imageUrl || undefined,
    link: data.link || undefined,
    sortOrder: data.sortOrder || undefined,
    published: data.published || false,
    author: data.author || { id: '', name: '', role: '' },
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// TypeScript型 → Firestore DocumentData変換（新規作成用）
export const convertToFirestoreData = (
  formData: ScheduleFormData,
  author: Author
) => {
  const docData: any = {
    title: formData.title,
    content: formData.content,
    date: Timestamp.fromDate(formData.date),
    published: formData.published,
    author,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // オプショナルフィールドは値がある場合のみ追加
  if (formData.imageUrl) {
    docData.imageUrl = formData.imageUrl;
  }
  if (formData.link) {
    docData.link = formData.link;
  }
  if (formData.sortOrder !== undefined && formData.sortOrder !== null) {
    docData.sortOrder = formData.sortOrder;
  }

  return docData;
};

// TypeScript型 → Firestore DocumentData変換（更新用）
export const convertToFirestoreUpdateData = (formData: ScheduleFormData) => {
  const updateData: any = {
    title: formData.title,
    content: formData.content,
    date: Timestamp.fromDate(formData.date),
    published: formData.published,
    updatedAt: serverTimestamp(),
  };

  // オプショナルフィールドの処理（undefinedでも更新可能にする）
  if (formData.imageUrl !== undefined) {
    updateData.imageUrl = formData.imageUrl || '';
  }
  if (formData.link !== undefined) {
    updateData.link = formData.link || '';
  }
  if (formData.sortOrder !== undefined && formData.sortOrder !== null) {
    updateData.sortOrder = formData.sortOrder;
  }

  return updateData;
};