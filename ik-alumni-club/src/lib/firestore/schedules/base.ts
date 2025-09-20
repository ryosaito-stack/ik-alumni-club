// 基本CRUD操作（権限チェックなし、フィルタリングなし）
import { COLLECTION_NAME, Schedule } from './constants';
import { convertToSchedule } from './converter';
import { BaseRepository } from '../base-repository';

// BaseRepositoryのインスタンスを作成
const repository = new BaseRepository<Schedule>(
  COLLECTION_NAME,
  convertToSchedule
);

// 全件取得（フィルタリングなし）
export const getSchedules = async (): Promise<Schedule[]> => {
  return repository.getAll();
};

// 詳細取得（権限チェックなし）
export const getScheduleById = async (id: string): Promise<Schedule | null> => {
  return repository.getById(id);
};