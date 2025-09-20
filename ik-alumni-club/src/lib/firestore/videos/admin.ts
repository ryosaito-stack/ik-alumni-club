// 管理者向けVideo API（全データアクセス・CRUD操作）
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  db,
  serverTimestamp,
  Timestamp,
  Video,
  VideoFormData,
  VideoQueryOptions,
  Author,
  COLLECTION_NAME
} from './constants';
import { convertToFirestoreData } from './converter';
import { getVideos, getVideoById } from './base';
import { getFilteredVideos } from './filters';

// 単一のVideoを取得（権限チェックなし）
export { getVideoById as getVideo };

// 全Videoを取得（フィルタリング可能）
export const getAllVideos = async (
  options: VideoQueryOptions = {}
): Promise<Video[]> => {
  // publishedがundefinedの場合は、他のオプションは維持しつつpublishedを除外
  const filteredOptions = { ...options };
  if (filteredOptions.published === undefined) {
    delete filteredOptions.published;
  }
  
  // オプションが空の場合は全件取得
  if (Object.keys(filteredOptions).length === 0) {
    return getVideos();
  }
  
  // フィルタリングされた結果を取得
  return getFilteredVideos(filteredOptions);
};

// Videoを作成
export const createVideo = async (
  data: VideoFormData,
  author: Author
): Promise<string> => {
  try {
    const docData = convertToFirestoreData(data, author);
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
    
    // Video型にはオプショナルフィールドがないため、全フィールドを更新
    const updateData = {
      title: data.title,
      date: Timestamp.fromDate(data.date),
      videoUrl: data.videoUrl,
      thumbnail: data.thumbnail,
      published: data.published,
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