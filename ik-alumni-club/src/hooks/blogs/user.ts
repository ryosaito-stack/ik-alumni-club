// Blog一般ユーザー向けフック

import { Blog, BlogQueryOptions } from '@/types/blog';
import { getPublishedBlogs, getBlog } from '@/lib/firestore/blogs/user';
import { BaseUserHooks } from '@/hooks/common/BaseUserHooks';

// BaseUserHooksのインスタンス作成
const blogsHooks = new BaseUserHooks<Blog, BlogQueryOptions>({
  getList: (options) => getPublishedBlogs(options || {}),
  getById: getBlog,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'blogs_user',
});

/**
 * ブログ一覧用フック（ユーザー向け：公開済みのみ）
 */
export const useBlogsList = (options: BlogQueryOptions = {}) => {
  const { items: blogs, loading, error, refresh } = blogsHooks.useList(options);
  return { blogs, loading, error, refresh };
};

/**
 * ブログ詳細用フック
 */
export const useBlogDetail = (id: string) => {
  const { item: blog, loading, error, refresh } = blogsHooks.useDetail(id);
  return { blog, loading, error, refresh };
};

// キャッシュユーティリティ（デバッグ用）
export const userBlogsCacheUtils = {
  clearAll: () => {
    blogsHooks.clearCache();
  },
};