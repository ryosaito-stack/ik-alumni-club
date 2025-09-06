import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getVideo,
  getVideos,
  getPublishedVideos,
  getCarouselVideos,
  getVideosByCategory,
  createVideo,
  updateVideo,
  deleteVideo,
} from '@/lib/firestore/videos';
import { Video, VideoFormData, VideoQueryOptions, VideoCategory } from '@/types';

// 単一のVideoを取得するフック
export const useVideo = (id: string) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const data = await getVideo(id);
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch video'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  return { video, loading, error };
};

// Videoのリストを取得するフック
export const useVideos = (options: VideoQueryOptions = {}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await getVideos(options);
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [JSON.stringify(options)]);

  return { videos, loading, error };
};

// 公開済みVideoを取得するフック
export const usePublishedVideos = (options: VideoQueryOptions = {}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await getPublishedVideos(options);
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [JSON.stringify(options)]);

  return { videos, loading, error };
};

// カルーセル用の動画を取得するフック
export const useCarouselVideos = (limit: number = 5) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await getCarouselVideos(limit);
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch carousel videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [limit]);

  return { videos, loading, error };
};

// カテゴリー別の動画を取得するフック
export const useVideosByCategory = (category: VideoCategory, limit?: number) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await getVideosByCategory(category, limit);
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch videos by category'));
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchVideos();
    }
  }, [category, limit]);

  return { videos, loading, error };
};

// Video CRUD操作用フック
export const useVideoMutations = () => {
  const { user, member } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createVideoHandler = async (data: VideoFormData): Promise<string | null> => {
    if (!user || !member) {
      setError(new Error('User not authenticated'));
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const author = {
        id: user.uid,
        name: member.displayName || 'Unknown',
        role: member.role || 'member',
      };
      const id = await createVideo(data, author);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create video'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVideoHandler = async (id: string, data: VideoFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await updateVideo(id, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update video'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideoHandler = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteVideo(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete video'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createVideo: createVideoHandler,
    updateVideo: updateVideoHandler,
    deleteVideo: deleteVideoHandler,
    loading,
    error,
  };
};