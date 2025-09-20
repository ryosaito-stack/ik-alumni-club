// 管理者向けデータアクセス（全データCRUD操作）
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  db,
  COLLECTION_NAME,
  Schedule,
  ScheduleFormData,
  ScheduleQueryOptions,
  Author,
} from './constants';
import { getSchedules, getScheduleById } from './base';
import { applyFilters } from './filters';
import { convertToFirestoreData, convertToFirestoreUpdateData } from './converter';

/**
 * 全スケジュール一覧を取得（非公開含む）
 */
export const getAllSchedules = async (
  options: ScheduleQueryOptions = {}
): Promise<Schedule[]> => {
  try {
    // 全件取得
    const allSchedules = await getSchedules();
    
    // フィルタを適用（公開・非公開両方含む）
    return applyFilters(allSchedules, options);
  } catch (error) {
    console.error('Error getting all schedules:', error);
    throw error;
  }
};

/**
 * スケジュールを作成
 */
export const createSchedule = async (
  data: ScheduleFormData,
  author: Author
): Promise<string> => {
  try {
    const docData = convertToFirestoreData(data, author);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

/**
 * スケジュールを更新
 */
export const updateSchedule = async (
  id: string,
  data: ScheduleFormData
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = convertToFirestoreUpdateData(data);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

/**
 * スケジュールを削除
 */
export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

/**
 * スケジュールを1件取得（権限チェックなし）
 * base.tsのgetScheduleByIdをそのまま公開
 */
export { getScheduleById as getSchedule } from './base';