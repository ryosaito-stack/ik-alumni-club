// 共通インポートと定数の集約
export {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
} from 'firebase/firestore';

export { db } from '@/lib/firebase';
export type { Video, VideoFormData, VideoQueryOptions } from '@/types/video';
export type { Author } from '@/types/author';

// コレクション名
export const COLLECTION_NAME = 'videos';