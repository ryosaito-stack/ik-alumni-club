import { Information, InformationQueryOptions } from '@/types/information';
import { getPublishedInformations, getInformation } from '@/lib/firestore/informations/user';
import { BaseUserHooks } from '@/hooks/common/BaseUserHooks';

// BaseUserHooksのインスタンス作成
const informationsHooks = new BaseUserHooks<Information, InformationQueryOptions>({
  getList: (options) => getPublishedInformations(options || {}),
  getById: getInformation,
  getCacheKey: (options) => JSON.stringify(options || {}),
  cachePrefix: 'informations_user',
});

/**
 * お知らせ一覧用フック（ユーザー向け：公開済みのみ）
 */
export const useInformationsList = (limit?: number) => {
  const options = { orderBy: 'date' as const, orderDirection: 'desc' as const, limit };
  const { items: allInformations, loading, error, refresh } = informationsHooks.useList(options);
  
  // limitが指定されている場合は、結果をスライス
  const informations = limit ? allInformations.slice(0, limit) : allInformations;
  
  return { informations, loading, error, refresh };
};

/**
 * お知らせ詳細用フック
 */
export const useInformationDetail = (id: string) => {
  const { item: information, loading, error, refresh } = informationsHooks.useDetail(id);
  return { information, loading, error, refresh };
};

// キャッシュユーティリティ（デバッグ用）
export const userInformationsCacheUtils = {
  clearAll: () => {
    informationsHooks.clearCache();
  },
};

// 互換性保持のためのエイリアス（既存コード対応）
export const useInformations = () => useInformationsList();
export const useAvailableInformations = (options: { limit?: number } = {}) => 
  useInformationsList(options.limit);
export const useInformation = (id: string) => useInformationDetail(id);