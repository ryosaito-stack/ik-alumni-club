// Blog基本操作 - BaseRepositoryを使用

import { BaseRepository } from '@/lib/firestore/base-repository';
import { Blog } from '@/types/blog';
import { COLLECTION_NAME } from './constants';
import { convertToBlog } from './converter';

// BaseRepositoryのインスタンス化（たった3行！）
const repository = new BaseRepository<Blog>(
  COLLECTION_NAME,
  convertToBlog
);

// 基本的なCRUD操作をエクスポート
export const getBlogs = () => repository.getAll();
export const getBlogById = (id: string) => repository.getById(id);