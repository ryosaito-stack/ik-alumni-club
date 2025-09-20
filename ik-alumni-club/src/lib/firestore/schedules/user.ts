// 一般ユーザー向けデータアクセス（公開データのみ）
import { Schedule, ScheduleQueryOptions } from './constants';
import { getSchedules, getScheduleById } from './base';
import { applyFilters, filterByPublished } from './filters';
import { isPublished } from '@/lib/firestore/utils';

/**
 * 公開済みスケジュール一覧を取得
 */
export const getPublishedSchedules = async (
  options: ScheduleQueryOptions = {}
): Promise<Schedule[]> => {
  try {
    // 全件取得
    const allSchedules = await getSchedules();
    
    // 公開済みのみフィルタ
    const publishedSchedules = filterByPublished(allSchedules);
    
    // その他のフィルタを適用
    return applyFilters(publishedSchedules, {
      ...options,
      published: undefined // publishedフィルタは既に適用済み
    });
  } catch (error) {
    console.error('Error getting published schedules:', error);
    throw error;
  }
};

/**
 * 公開済みスケジュールを1件取得
 */
export const getSchedule = async (id: string): Promise<Schedule | null> => {
  try {
    const schedule = await getScheduleById(id);
    
    // 公開チェック
    return isPublished(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    throw error;
  }
};

/**
 * 今月のスケジュールを取得
 */
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

/**
 * 指定月のスケジュールを取得
 */
export const getMonthSchedules = async (
  year: number,
  month: number
): Promise<Schedule[]> => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  return getPublishedSchedules({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'asc',
  });
};