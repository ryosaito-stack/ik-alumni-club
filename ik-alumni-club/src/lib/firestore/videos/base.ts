// 基本CRUD操作（権限チェックなし、フィルタリングなし）
import { COLLECTION_NAME, Video } from './constants';
import { convertToVideo } from './converter';
import { BaseRepository } from '../base-repository';

// BaseRepositoryのインスタンスを作成
const repository = new BaseRepository<Video>(
  COLLECTION_NAME,
  convertToVideo
);

// 全件取得（フィルタリングなし）
export const getVideos = async (): Promise<Video[]> => {
  return repository.getAll();
};

// 詳細取得（権限チェックなし）
export const getVideoById = async (id: string): Promise<Video | null> => {
  return repository.getById(id);
};