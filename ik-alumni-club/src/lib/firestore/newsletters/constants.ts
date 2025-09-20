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
  type QueryConstraint,
  type DocumentData,
} from 'firebase/firestore';

export { db } from '@/lib/firebase';

export type {
  Newsletter,
  NewsletterFormData,
  NewsletterQueryOptions,
} from '@/types/newsletter';

export const COLLECTION_NAME = 'newsletters';