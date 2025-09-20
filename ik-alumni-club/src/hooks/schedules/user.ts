// 一般ユーザー向けスケジュール関連フック
'use client';

import { Schedule, ScheduleQueryOptions } from '@/types/schedule';
import * as schedulesApi from '@/lib/firestore/schedules/user';
import { BaseUserHooks } from '@/hooks/common/BaseUserHooks';

// BaseUserHooksのインスタンス作成
const schedulesHooks = new BaseUserHooks<Schedule, ScheduleQueryOptions>({
  getList: schedulesApi.getPublishedSchedules,
  getById: schedulesApi.getSchedule,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'schedules_user',
});

/**
 * スケジュール一覧取得フック
 */
export const useSchedulesList = (options: ScheduleQueryOptions = {}) => {
  const { items: schedules, loading, error, refresh } = schedulesHooks.useList(options);
  return { schedules, loading, error, refresh };
};

/**
 * スケジュール詳細取得フック
 */
export const useScheduleDetail = (id: string | null) => {
  const { item: schedule, loading, error, refresh } = schedulesHooks.useDetail(id);
  return { schedule, loading, error, refresh };
};

/**
 * 今月のスケジュール取得フック
 */
export const useCurrentMonthSchedules = () => {
  const { items: schedules, loading, error, refresh } = schedulesHooks.useCurrentMonthItems(
    schedulesApi.getCurrentMonthSchedules
  );
  return { schedules, loading, error, refresh };
};

/**
 * 指定月のスケジュール取得フック
 */
export const useMonthSchedules = (year: number, month: number) => {
  const { items: schedules, loading, error, refresh } = schedulesHooks.useMonthItems(
    year, 
    month, 
    schedulesApi.getMonthSchedules
  );
  return { schedules, loading, error, refresh };
};