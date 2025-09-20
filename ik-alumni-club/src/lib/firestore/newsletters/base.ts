import { COLLECTION_NAME, type Newsletter } from './constants';
import { convertToNewsletter } from './converter';
import { BaseRepository } from '../base-repository';

// BaseRepositoryのインスタンスを作成
const repository = new BaseRepository<Newsletter>(
  COLLECTION_NAME,
  convertToNewsletter
);

// 全件取得（フィルタリングなし、純粋なデータ取得）
export const getNewsletters = async (): Promise<Newsletter[]> => {
  return repository.getAll();
};

// ニュースレターを1件取得（公開チェックなし）
export const getNewsletterById = async (id: string): Promise<Newsletter | null> => {
  return repository.getById(id);
};