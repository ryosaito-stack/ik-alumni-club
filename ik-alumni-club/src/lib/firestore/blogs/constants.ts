// Blog Firestore定数と共通インポート

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

export type {
  Blog,
  BlogFormData,
  BlogQueryOptions,
} from '@/types/blog';

export const COLLECTION_NAME = 'blogs';