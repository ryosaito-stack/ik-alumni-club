// 一般ユーザー向けVideo関連フック
'use client';

import { Video, VideoQueryOptions } from '@/types/video';
import * as videosApi from '@/lib/firestore/videos/user';
import { BaseUserHooks } from '@/hooks/common/BaseUserHooks';

// BaseUserHooksのインスタンス作成
const videosHooks = new BaseUserHooks<Video, VideoQueryOptions>({
  getList: videosApi.getPublishedVideos,
  getById: videosApi.getVideo,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'videos_user',
});

/**
 * 動画一覧取得フック
 */
export const useVideosList = (options: VideoQueryOptions = {}) => {
  const { items: videos, loading, error, refresh } = videosHooks.useList(options);
  return { videos, loading, error, refresh };
};

/**
 * 動画詳細取得フック
 */
export const useVideoDetail = (id: string | null) => {
  const { item: video, loading, error, refresh } = videosHooks.useDetail(id);
  return { video, loading, error, refresh };
};

/**
 * 最新動画取得フック
 */
export const useLatestVideos = (limit: number = 5) => {
  const { items: videos, loading, error, refresh } = videosHooks.useList({
    orderBy: 'date',
    orderDirection: 'desc',
    limit,
  });
  return { videos, loading, error, refresh };
};

/**
 * 今月の動画取得フック
 */
export const useCurrentMonthVideos = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  const { items: videos, loading, error, refresh } = videosHooks.useList({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'desc',
  });
  
  return { videos, loading, error, refresh };
};

/**
 * 指定月の動画取得フック
 */
export const useMonthVideos = (year: number, month: number) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  
  const { items: videos, loading, error, refresh } = videosHooks.useList({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'desc',
  });
  
  return { videos, loading, error, refresh };
};

// キャッシュユーティリティ（デバッグ用）
export const userVideosCacheUtils = {
  clearAll: () => {
    videosHooks.clearCache();
  },
};

// 互換性保持のためのエイリアス（既存コード対応）
export const usePublishedVideos = useVideosList;
export const useVideo = (id: string) => useVideoDetail(id);