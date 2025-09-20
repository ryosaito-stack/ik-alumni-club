import type { Newsletter, NewsletterQueryOptions } from './constants';

// 公開済みフィルター
export const filterPublished = (newsletters: Newsletter[]): Newsletter[] => {
  return newsletters.filter(newsletter => newsletter.published);
};

// ソート処理
export const sortNewsletters = (
  newsletters: Newsletter[],
  options: NewsletterQueryOptions = {}
): Newsletter[] => {
  const { orderBy = 'issueNumber', orderDirection = 'desc' } = options;
  
  return newsletters.sort((a, b) => {
    let compareValue = 0;
    
    switch (orderBy) {
      case 'issueNumber':
        compareValue = a.issueNumber - b.issueNumber;
        break;
      case 'createdAt':
        compareValue = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'updatedAt':
        compareValue = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      default:
        compareValue = a.issueNumber - b.issueNumber;
    }
    
    return orderDirection === 'desc' ? -compareValue : compareValue;
  });
};

// 制限処理
export const limitNewsletters = (
  newsletters: Newsletter[],
  limit?: number
): Newsletter[] => {
  if (limit && limit > 0) {
    return newsletters.slice(0, limit);
  }
  return newsletters;
};

// 統合フィルター処理
export const applyFilters = (
  newsletters: Newsletter[],
  options: NewsletterQueryOptions = {}
): Newsletter[] => {
  let result = [...newsletters];
  
  // 公開フィルター
  if (options.published !== undefined) {
    result = options.published ? filterPublished(result) : result.filter(n => !n.published);
  }
  
  // ソート
  result = sortNewsletters(result, options);
  
  // 制限
  result = limitNewsletters(result, options.limit);
  
  return result;
};