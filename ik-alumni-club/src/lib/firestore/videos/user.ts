// 一般ユーザー向けVideo API（公開済みのみ取得）
import { Video, VideoQueryOptions } from './constants';
import { getVideoById } from './base';
import { getFilteredVideos } from './filters';

// 単一のVideoを取得（公開済みチェック付き）
export const getVideo = async (id: string): Promise<Video | null> => {
  const video = await getVideoById(id);
  
  // 非公開の場合はnullを返す
  if (!video || !video.published) {
    return null;
  }
  
  return video;
};

// 公開済みVideoのリストを取得
export const getPublishedVideos = async (
  options: VideoQueryOptions = {}
): Promise<Video[]> => {
  return getFilteredVideos({
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

// 指定月の動画を取得（公開済み）
export const getMonthVideos = async (
  year: number,
  month: number
): Promise<Video[]> => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  return getPublishedVideos({
    startDate: startOfMonth,
    endDate: endOfMonth,
    orderBy: 'date',
    orderDirection: 'desc',
  });
};

// 現在の月の動画を取得（公開済み）
export const getCurrentMonthVideos = async (): Promise<Video[]> => {
  const now = new Date();
  return getMonthVideos(now.getFullYear(), now.getMonth() + 1);
};