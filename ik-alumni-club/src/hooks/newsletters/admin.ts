import { BaseAdminHooks } from '@/hooks/common/BaseAdminHooks';
import { Newsletter, NewsletterFormData, NewsletterQueryOptions } from '@/types/newsletter';
import * as newslettersAdminApi from '@/lib/firestore/newsletters/admin';
import { Author } from '@/types/author';

// BaseAdminHooksのインスタンスを作成
const adminNewslettersHooks = new BaseAdminHooks<Newsletter, NewsletterFormData, NewsletterQueryOptions>({
  getAll: newslettersAdminApi.getAdminNewsletters,
  getById: async (id: string) => {
    // adminでもgetByIdは必要なので、baseから取得
    const { getNewsletterById } = await import('@/lib/firestore/newsletters/base');
    return getNewsletterById(id);
  },
  getCacheKey: (options) => JSON.stringify(options || {}),
  create: newslettersAdminApi.createNewsletter,
  update: newslettersAdminApi.updateNewsletter,
  delete: newslettersAdminApi.deleteNewsletter,
  cachePrefix: 'newsletters_admin',
});

// 管理者向けニュースレター一覧取得フック
export const useAdminNewslettersList = (options: NewsletterQueryOptions = {}) => {
  const { items: newsletters, loading, error, refresh } = adminNewslettersHooks.useList(options);
  return { newsletters, loading, error, refresh };
};

// 管理者向け単一ニュースレター取得フック
export const useAdminNewsletterDetail = (id: string | null) => {
  const { item: newsletter, loading, error, refresh } = adminNewslettersHooks.useDetail(id);
  return { newsletter, loading, error, refresh };
};

// 管理者向けCRUD操作フック
export const useAdminNewsletterMutations = () => {
  const { create, update, deleteItem, loading, error } = adminNewslettersHooks.useMutations();
  
  // 最新号数を自動設定する拡張create関数
  const createWithLatestIssue = async (formData: NewsletterFormData, author?: Author) => {
    // 号数が未設定の場合、最新号数を取得して自動設定
    if (!formData.issueNumber) {
      const latestIssue = await newslettersAdminApi.getLatestIssueNumber();
      formData.issueNumber = latestIssue + 1;
    }
    return create(formData, author);
  };
  
  return {
    createNewsletter: createWithLatestIssue,
    updateNewsletter: update,
    deleteNewsletter: deleteItem,
    loading,
    error,
  };
};