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
    imageUrl: data.imageUrl || undefined,
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

    // 日付範囲でフィルタリング（whereとorderByの組み合わせは避ける）
    if (options.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(options.startDate)));
    }
    if (options.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(options.endDate)));
    }

    // ソート順
    const orderField = options.orderBy || 'date';
    const orderDirection = options.orderDirection || 'asc';
    
    // whereクエリがない場合のみorderByを追加
    if (!options.startDate && !options.endDate) {
      constraints.push(orderBy(orderField, orderDirection));
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    let schedules: Schedule[] = [];
    querySnapshot.forEach((doc) => {
      const schedule = convertFirestoreToSchedule(doc.id, doc.data());
      // クライアント側で公開状態をフィルタリング
      if (options.published === undefined || schedule.published === options.published) {
        schedules.push(schedule);
      }
    });

    // クライアント側でソート
    schedules.sort((a, b) => {
      if (orderField === 'date') {
        const dateCompare = orderDirection === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
        
        if (dateCompare === 0) {
          // 同じ日付の場合、sortOrderでソート（昇順）
          const aSortOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
          const bSortOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
          return aSortOrder - bSortOrder;
        }
        
        return dateCompare;
      } else if (orderField === 'createdAt' || orderField === 'updatedAt') {
        const aTime = a[orderField].getTime();
        const bTime = b[orderField].getTime();
        return orderDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }
      return 0;
    });

    // limit処理
    if (options.limit && schedules.length > options.limit) {
      schedules = schedules.slice(0, options.limit);
    }

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
    const docData: any = {
      title: data.title,
      content: data.content,
      date: Timestamp.fromDate(data.date),
      published: data.published,
      author,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // オプショナルフィールドは値がある場合のみ追加
    if (data.imageUrl) {
      docData.imageUrl = data.imageUrl;
    }
    if (data.link) {
      docData.link = data.link;
    }
    if (data.sortOrder !== undefined && data.sortOrder !== null) {
      docData.sortOrder = data.sortOrder;
    }

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
    const updateData: any = {
      title: data.title,
      content: data.content,
      date: Timestamp.fromDate(data.date),
      published: data.published,
      updatedAt: serverTimestamp(),
    };

    // オプショナルフィールドは値がある場合のみ追加
    if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl || '';
    }
    if (data.link !== undefined) {
      updateData.link = data.link || '';
    }
    if (data.sortOrder !== undefined && data.sortOrder !== null) {
      updateData.sortOrder = data.sortOrder;
    }

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