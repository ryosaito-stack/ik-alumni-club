import { BaseUserHooks } from '@/hooks/common/BaseUserHooks';
import { Newsletter, NewsletterQueryOptions } from '@/types/newsletter';
import * as newslettersApi from '@/lib/firestore/newsletters/user';

// BaseUserHooksのインスタンスを作成
const newslettersHooks = new BaseUserHooks<Newsletter, NewsletterQueryOptions>({
  getList: newslettersApi.getPublishedNewsletters,
  getById: newslettersApi.getNewsletter,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'newsletters_user',
});

// ユーザー向けニュースレター一覧取得フック
export const useNewslettersList = (options: Omit<NewsletterQueryOptions, 'published'> = {}) => {
  const { items: newsletters, loading, error, refresh } = newslettersHooks.useList(options);
  return { newsletters, loading, error, refresh };
};

// ユーザー向け単一ニュースレター取得フック
export const useNewsletterDetail = (id: string | null) => {
  const { item: newsletter, loading, error, refresh } = newslettersHooks.useDetail(id);
  return { newsletter, loading, error, refresh };
};

