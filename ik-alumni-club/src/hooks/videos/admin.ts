// 管理者向けVideo関連フック
'use client';

import { Video, VideoFormData, VideoQueryOptions } from '@/types/video';
import * as videosApi from '@/lib/firestore/videos/admin';
import { BaseAdminHooks } from '@/hooks/common/BaseAdminHooks';

// BaseAdminHooksのインスタンス作成
const videosAdminHooks = new BaseAdminHooks<Video, VideoFormData, VideoQueryOptions>({
  getAll: videosApi.getAllVideos,
  getById: videosApi.getVideo,
  getCacheKey: (options) => JSON.stringify(options || {}),
  create: videosApi.createVideo,
  update: videosApi.updateVideo,
  delete: videosApi.deleteVideo,
  cachePrefix: 'videos_admin',
});

/**
 * 管理者用動画一覧取得フック（非公開含む）
 */
export const useAdminVideosList = (options: VideoQueryOptions = {}) => {
  const { items: videos, loading, error, refresh } = videosAdminHooks.useList(options);
  return { videos, loading, error, refresh };
};

/**
 * 管理者用動画詳細取得フック
 */
export const useAdminVideoDetail = (id: string | null) => {
  const { item: video, loading, error, refresh } = videosAdminHooks.useDetail(id);
  return { video, loading, error, refresh };
};

/**
 * 管理者用動画CRUD操作フック
 */
export const useAdminVideoMutations = () => {
  const { create, update, delete: deleteVideo, loading, error, clearError } = videosAdminHooks.useMutations();
  
  return {
    createVideo: create,
    updateVideo: update,
    deleteVideo,
    loading,
    error,
    clearError,
  };
};

/**
 * 管理者用最新動画取得フック
 */
export const useAdminLatestVideos = (limit: number = 5) => {
  const { items: videos, loading, error, refresh } = videosAdminHooks.useList({
    orderBy: 'date',
    orderDirection: 'desc',
    limit,
  });
  return { videos, loading, error, refresh };
};

/**
 * 管理者用公開済み動画取得フック
 */
export const useAdminPublishedVideos = (options: VideoQueryOptions = {}) => {
  const { items: videos, loading, error, refresh } = videosAdminHooks.useList({
    ...options,
    published: true,
  });
  return { videos, loading, error, refresh };
};

/**
 * 管理者用非公開動画取得フック
 */
export const useAdminUnpublishedVideos = (options: VideoQueryOptions = {}) => {
  const { items: videos, loading, error, refresh } = videosAdminHooks.useList({
    ...options,
    published: false,
  });
  return { videos, loading, error, refresh };
};

// キャッシュユーティリティ（デバッグ用）
export const adminVideosCacheUtils = {
  clearAll: () => {
    videosAdminHooks.clearCache();
  },
};

// 互換性保持のためのエイリアス（既存コード対応）
export const useVideos = useAdminVideosList;
export const useVideo = (id: string) => useAdminVideoDetail(id);
export const useVideoMutations = useAdminVideoMutations;