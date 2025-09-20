// 型変換ロジック
import { timestampToDate } from '../utils';
import { 
  DocumentData, 
  Timestamp,
  serverTimestamp,
  Video,
  VideoFormData,
  Author
} from './constants';

// Firestore DocumentData → TypeScript型変換
export const convertToVideo = (id: string, data: DocumentData): Video => {
  return {
    id,
    title: data.title || '',
    date: timestampToDate(data.date),
    videoUrl: data.videoUrl || '',
    thumbnail: data.thumbnail || '',
    published: data.published || false,
    author: data.author || { id: '', name: '', role: '' },
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// TypeScript型 → Firestore DocumentData変換
export const convertToFirestoreData = (
  formData: VideoFormData,
  author: Author
) => {
  return {
    title: formData.title,
    date: Timestamp.fromDate(formData.date),
    videoUrl: formData.videoUrl,
    thumbnail: formData.thumbnail,
    published: formData.published,
    author,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};