import { COLLECTION_NAME, type Information } from './constants';
import { convertToInformation } from '@/lib/firestore/informations/converter';
import { BaseRepository } from '../base-repository';

// BaseRepositoryのインスタンスを作成
const repository = new BaseRepository<Information>(
  COLLECTION_NAME,
  convertToInformation
);

// 全件取得（フィルタリングなし、純粋なデータ取得）
export const getInformations = async (): Promise<Information[]> => {
  return repository.getAll();
};

// お知らせを1件取得（公開チェックなし）
export const getInformationById = async (id: string): Promise<Information | null> => {
  return repository.getById(id);
};