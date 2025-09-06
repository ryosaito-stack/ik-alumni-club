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
  limit as firestoreLimit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Video, VideoFormData, VideoQueryOptions, VideoCategory } from '@/types';

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
    title: data.title,
    description: data.description,
    category: data.category as VideoCategory,
    videoUrl: data.videoUrl,
    thumbnail: data.thumbnail,
    published: data.published,
    featuredInCarousel: data.featuredInCarousel,
    sortOrder: data.sortOrder,
    author: data.author,
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

    // フィルタリング
    if (options.published !== undefined) {
      q = query(q, where('published', '==', options.published));
    }
    if (options.category) {
      q = query(q, where('category', '==', options.category));
    }
    if (options.featuredInCarousel !== undefined) {
      q = query(q, where('featuredInCarousel', '==', options.featuredInCarousel));
    }

    // ソート
    if (options.orderBy) {
      const direction = options.orderDirection || 'desc';
      q = query(q, orderBy(options.orderBy, direction));
    }

    // 制限
    if (options.limit) {
      q = query(q, firestoreLimit(options.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertToVideo);
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

// カルーセル用の動画を取得（featuredInCarousel=trueかつ公開済み）
export const getCarouselVideos = async (limit: number = 5): Promise<Video[]> => {
  return getPublishedVideos({
    featuredInCarousel: true,
    orderBy: 'sortOrder',
    orderDirection: 'asc',
    limit,
  });
};

// カテゴリー別の公開動画を取得
export const getVideosByCategory = async (category: VideoCategory, limit?: number): Promise<Video[]> => {
  return getPublishedVideos({
    category,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    limit,
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