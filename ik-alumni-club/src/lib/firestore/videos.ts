import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Video, VideoFormData, VideoQueryOptions } from '@/types';

const COLLECTION_NAME = 'videos';

// Timestamp型をDateに変換するヘルパー関数
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Firestoreデータを型安全なVideoオブジェクトに変換
const convertToVideo = (doc: any): Video => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    date: convertTimestamp(data.date),
    videoUrl: data.videoUrl || '',
    thumbnail: data.thumbnail || '',
    published: data.published || false,
    author: data.author || { id: '', name: '', role: '' },
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

// 単一のVideoを取得
export const getVideo = async (id: string): Promise<Video | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return convertToVideo(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting video:', error);
    throw error;
  }
};

// Videoのリストを取得
export const getVideos = async (options: VideoQueryOptions = {}): Promise<Video[]> => {
  try {
    let q = query(collection(db, COLLECTION_NAME));

    // 日付範囲でフィルタリング（whereとorderByの組み合わせは避ける）
    if (options.startDate) {
      q = query(q, where('date', '>=', Timestamp.fromDate(options.startDate)));
    }
    if (options.endDate) {
      q = query(q, where('date', '<=', Timestamp.fromDate(options.endDate)));
    }

    // whereクエリがない場合のみorderByを追加
    if (!options.startDate && !options.endDate) {
      const orderField = options.orderBy || 'date';
      const direction = options.orderDirection || 'desc';
      q = query(q, orderBy(orderField, direction));
    }

    const querySnapshot = await getDocs(q);
    
    // クライアント側でフィルタリングとソート
    let videos = querySnapshot.docs.map(convertToVideo);
    
    // 公開状態でフィルタリング
    if (options.published !== undefined) {
      videos = videos.filter(video => video.published === options.published);
    }
    
    // クライアント側でソート
    if (options.startDate || options.endDate || options.orderBy) {
      const orderField = options.orderBy || 'date';
      const orderDirection = options.orderDirection || 'desc';
      
      videos.sort((a, b) => {
        if (orderField === 'date') {
          const aTime = a.date.getTime();
          const bTime = b.date.getTime();
          return orderDirection === 'asc' ? aTime - bTime : bTime - aTime;
        } else if (orderField === 'createdAt' || orderField === 'updatedAt') {
          const aTime = a[orderField].getTime();
          const bTime = b[orderField].getTime();
          return orderDirection === 'asc' ? aTime - bTime : bTime - aTime;
        }
        return 0;
      });
    }
    
    // 制限
    if (options.limit && videos.length > options.limit) {
      videos = videos.slice(0, options.limit);
    }

    return videos;
  } catch (error) {
    console.error('Error getting videos:', error);
    throw error;
  }
};

// 公開済みのVideoを取得（一般ユーザー向け）
export const getPublishedVideos = async (options: VideoQueryOptions = {}): Promise<Video[]> => {
  return getVideos({
    ...options,
    published: true,
  });
};

// 最新の動画を取得（公開済み）
export const getLatestVideos = async (limit: number = 5): Promise<Video[]> => {
  return getPublishedVideos({
    orderBy: 'date',
    orderDirection: 'desc',
    limit,
  });
};

// 指定月の動画を取得
export const getMonthVideos = async (year: number, month: number): Promise<Video[]> => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  return getPublishedVideos({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'desc',
  });
};

// Videoを作成
export const createVideo = async (
  data: VideoFormData,
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
    console.error('Error creating video:', error);
    throw error;
  }
};

// Videoを更新
export const updateVideo = async (
  id: string,
  data: VideoFormData
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
    console.error('Error updating video:', error);
    throw error;
  }
};

// Videoを削除
export const deleteVideo = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};