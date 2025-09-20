// フィルタリングロジックの分離
import { Schedule, ScheduleQueryOptions } from './constants';
import { filterPublished as filterPublishedUtil } from '@/lib/firestore/utils';

/**
 * 日付範囲でフィルタリング
 */
export const filterByDateRange = (
  schedules: Schedule[],
  startDate?: Date,
  endDate?: Date
): Schedule[] => {
  let filtered = [...schedules];

  if (startDate) {
    filtered = filtered.filter(schedule => schedule.date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(schedule => schedule.date <= endDate);
  }

  return filtered;
};

/**
 * 公開状態でフィルタリング
 * 共通ユーティリティを使用（published: trueのみ取得）
 */
export const filterByPublished = (schedules: Schedule[]): Schedule[] => {
  return filterPublishedUtil(schedules);
};

/**
 * スケジュールをソート
 */
export const sortSchedules = (
  schedules: Schedule[],
  orderBy: 'date' | 'sortOrder' | 'createdAt' | 'updatedAt' = 'date',
  orderDirection: 'asc' | 'desc' = 'asc'
): Schedule[] => {
  const sorted = [...schedules];

  sorted.sort((a, b) => {
    if (orderBy === 'date') {
      const dateCompare = orderDirection === 'asc'
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();

      // 同じ日付の場合、sortOrderで二次ソート（昇順）
      if (dateCompare === 0) {
        const aSortOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const bSortOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
        return aSortOrder - bSortOrder;
      }

      return dateCompare;
    }

    if (orderBy === 'sortOrder') {
      const aSortOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bSortOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      return orderDirection === 'asc'
        ? aSortOrder - bSortOrder
        : bSortOrder - aSortOrder;
    }

    if (orderBy === 'createdAt' || orderBy === 'updatedAt') {
      const aTime = a[orderBy].getTime();
      const bTime = b[orderBy].getTime();
      return orderDirection === 'asc' ? aTime - bTime : bTime - aTime;
    }

    return 0;
  });

  return sorted;
};

/**
 * リミット処理
 */
export const limitSchedules = (
  schedules: Schedule[],
  limit?: number
): Schedule[] => {
  if (!limit || limit >= schedules.length) {
    return schedules;
  }
  return schedules.slice(0, limit);
};

/**
 * 複合フィルタを適用
 */
export const applyFilters = (
  schedules: Schedule[],
  options: ScheduleQueryOptions = {}
): Schedule[] => {
  let filtered = [...schedules];

  // 公開状態フィルタ（published: trueの場合のみフィルタ）
  if (options.published === true) {
    filtered = filterByPublished(filtered);
  } else if (options.published === false) {
    // 非公開のみ取得する場合
    filtered = filtered.filter(schedule => !schedule.published);
  }

  // 日付範囲フィルタ
  filtered = filterByDateRange(filtered, options.startDate, options.endDate);

  // ソート
  filtered = sortSchedules(
    filtered,
    options.orderBy || 'date',
    options.orderDirection || 'asc'
  );

  // リミット
  filtered = limitSchedules(filtered, options.limit);

  return filtered;
};