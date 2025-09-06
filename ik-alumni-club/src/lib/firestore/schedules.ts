import {
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
  QueryConstraint,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Schedule, ScheduleFormData, ScheduleQueryOptions } from '@/types';

const COLLECTION_NAME = 'schedules';

// Schedule型のFirestoreデータ変換
const convertFirestoreToSchedule = (id: string, data: any): Schedule => {
  return {
    id,
    title: data.title || '',
    content: data.content || '',
    date: data.date?.toDate() || new Date(),
    link: data.link || undefined,
    sortOrder: data.sortOrder || undefined,
    published: data.published || false,
    author: data.author || { id: '', name: '', role: '' },
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// 単一のScheduleを取得
export const getSchedule = async (id: string): Promise<Schedule | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return convertFirestoreToSchedule(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error getting schedule:', error);
    throw error;
  }
};

// Scheduleのリストを取得
export const getSchedules = async (options: ScheduleQueryOptions = {}): Promise<Schedule[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // 公開状態でフィルタリング
    if (options.published !== undefined) {
      constraints.push(where('published', '==', options.published));
    }

    // 日付範囲でフィルタリング
    if (options.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(options.startDate)));
    }
    if (options.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(options.endDate)));
    }

    // ソート順
    const orderField = options.orderBy || 'date';
    const orderDirection = options.orderDirection || 'asc';
    
    // sortOrderとdateの複合ソート
    if (orderField === 'date') {
      constraints.push(orderBy('date', orderDirection));
      constraints.push(orderBy('sortOrder', 'asc'));
    } else {
      constraints.push(orderBy(orderField, orderDirection));
    }

    // 取得件数制限
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    const schedules: Schedule[] = [];
    querySnapshot.forEach((doc) => {
      schedules.push(convertFirestoreToSchedule(doc.id, doc.data()));
    });

    return schedules;
  } catch (error) {
    console.error('Error getting schedules:', error);
    throw error;
  }
};

// 公開済みのScheduleを取得（一般ユーザー向け）
export const getPublishedSchedules = async (options: ScheduleQueryOptions = {}): Promise<Schedule[]> => {
  return getSchedules({
    ...options,
    published: true,
  });
};

// Scheduleを作成
export const createSchedule = async (
  data: ScheduleFormData,
  author: { id: string; name: string; role: string }
): Promise<string> => {
  try {
    const docData = {
      ...data,
      date: Timestamp.fromDate(data.date),
      author,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

// Scheduleを更新
export const updateSchedule = async (
  id: string,
  data: ScheduleFormData
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...data,
      date: Timestamp.fromDate(data.date),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

// Scheduleを削除
export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

// 今月のScheduleを取得
export const getCurrentMonthSchedules = async (): Promise<Schedule[]> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return getPublishedSchedules({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'asc',
  });
};

// 指定月のScheduleを取得
export const getMonthSchedules = async (year: number, month: number): Promise<Schedule[]> => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  return getPublishedSchedules({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'asc',
  });
};