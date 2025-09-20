// Blog管理者向けフック

import { Blog, BlogFormData, BlogQueryOptions } from '@/types/blog';
import { Author } from '@/types/author';
import { 
  getAllBlogs, 
  getBlogAdmin, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from '@/lib/firestore/blogs/admin';
import { BaseAdminHooks } from '@/hooks/common/BaseAdminHooks';

// BaseAdminHooksのインスタンス作成
const blogsAdminHooks = new BaseAdminHooks<Blog, BlogFormData, BlogQueryOptions>({
  getAll: (options) => getAllBlogs(options || {}),
  getById: getBlogAdmin,
  create: createBlog,
  update: updateBlog,
  delete: deleteBlog,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'blogs_admin',
});

/**
 * ブログ一覧用フック（管理者向け：全て取得）
 */
export const useAdminBlogsList = (options: BlogQueryOptions = {}) => {
  const { items: blogs, loading, error, refresh } = blogsAdminHooks.useList(options);
  return { blogs, loading, error, refresh };
};

/**
 * ブログ詳細用フック（管理者向け）
 */
export const useAdminBlogDetail = (id: string) => {
  const { item: blog, loading, error, refresh } = blogsAdminHooks.useDetail(id);
  return { blog, loading, error, refresh };
};

/**
 * ブログCRUD操作用フック
 */
export const useBlogMutations = () => {
  return blogsAdminHooks.useMutations();
};

// キャッシュユーティリティ（デバッグ用）
export const adminBlogsCacheUtils = {
  clearAll: () => {
    blogsAdminHooks.clearCache();
  },
  refreshList: () => {
    blogsAdminHooks.clearListCache();
  },
  refreshDetail: (id: string) => {
    blogsAdminHooks.clearDetailCache(id);
  },
};