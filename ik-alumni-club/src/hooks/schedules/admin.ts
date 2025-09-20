// 管理者向けスケジュール関連フック
'use client';

import { Schedule, ScheduleFormData, ScheduleQueryOptions } from '@/types/schedule';
import * as schedulesApi from '@/lib/firestore/schedules/admin';
import { BaseAdminHooks } from '@/hooks/common/BaseAdminHooks';

// BaseAdminHooksのインスタンス作成
const schedulesAdminHooks = new BaseAdminHooks<Schedule, ScheduleFormData, ScheduleQueryOptions>({
  getAll: schedulesApi.getAllSchedules,
  getById: schedulesApi.getSchedule,
  getCacheKey: (options) => JSON.stringify(options || {}),
  create: (data, author) => {
    if (!author) {
      throw new Error('Author is required for schedule creation');
    }
    return schedulesApi.createSchedule(data, author);
  },
  update: schedulesApi.updateSchedule,
  delete: schedulesApi.deleteSchedule,
  cachePrefix: 'schedules_admin',
});

/**
 * 管理者用スケジュール一覧取得フック（非公開含む）
 */
export const useAdminSchedulesList = (options: ScheduleQueryOptions = {}) => {
  const { items: schedules, loading, error, refresh } = schedulesAdminHooks.useList(options);
  return { schedules, loading, error, refresh };
};

/**
 * 管理者用スケジュール詳細取得フック
 */
export const useAdminScheduleDetail = (id: string | null) => {
  const { item: schedule, loading, error, refresh } = schedulesAdminHooks.useDetail(id);
  return { schedule, loading, error, refresh };
};

/**
 * 管理者用スケジュールCRUD操作フック
 */
export const useAdminScheduleMutations = () => {
  return schedulesAdminHooks.useMutations();
};