import { Information, InformationFormData, InformationQueryOptions } from '@/types/information';
import { getInformations, getInformationById } from '@/lib/firestore/informations/base';
import * as adminApi from '@/lib/firestore/informations/admin';
import { BaseAdminHooks } from '@/hooks/common/BaseAdminHooks';

// BaseAdminHooksのインスタンス作成
const informationsAdminHooks = new BaseAdminHooks<Information, InformationFormData, InformationQueryOptions>({
  getAll: async (options) => {
    // getInformationsはオプションを受け取らないので、フィルタリングは呼び出し側で行う
    const all = await getInformations();
    if (options?.published !== undefined) {
      return all.filter(item => item.published === options.published);
    }
    return all;
  },
  getById: getInformationById,
  getCacheKey: (options) => JSON.stringify(options || {}),
  create: adminApi.createInformation,
  update: adminApi.updateInformation,
  delete: adminApi.deleteInformation,
  cachePrefix: 'informations_admin',
});

/**
 * 管理者用お知らせ一覧取得フック
 */
export const useAdminInformationsList = (includeUnpublished = true) => {
  const options: InformationQueryOptions = {
    published: includeUnpublished ? undefined : true,
    orderBy: 'date',
    orderDirection: 'desc'
  };
  
  const { items: informations, loading, error, refresh } = informationsAdminHooks.useList(options);
  return { informations, loading, error, refresh };
};

/**
 * 管理者用お知らせ詳細取得フック
 */
export const useAdminInformationDetail = (id: string) => {
  const { item: information, loading, error, refresh } = informationsAdminHooks.useDetail(id);
  return { information, loading, error, refresh };
};

/**
 * 管理者用お知らせCRUD操作フック
 */
export const useAdminInformationMutations = () => {
  const { create, update, delete: deleteInformation, loading, error, clearError } = informationsAdminHooks.useMutations();
  
  return {
    createInformation: create,
    updateInformation: update,
    deleteInformation,
    loading,
    error,
    clearError,
  };
};

// キャッシュユーティリティ（デバッグ用）
export const adminInformationsCacheUtils = {
  clearAll: () => {
    informationsAdminHooks.clearCache();
  },
};