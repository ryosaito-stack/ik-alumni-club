import {
  type Newsletter,
  type NewsletterQueryOptions,
  collection,
  query,
  where,
  limit,
  getDocs,
  db,
  COLLECTION_NAME,
} from './constants';
import { convertToNewsletter } from './converter';
import { getNewsletters, getNewsletterById } from './base';
import { applyFilters } from './filters';

// ニュースレターを1件取得（公開済みのみ）
export const getNewsletter = async (id: string): Promise<Newsletter | null> => {
  try {
    const newsletter = await getNewsletterById(id);
    
    if (!newsletter) {
      return null;
    }

    // 公開済みチェック
    if (!newsletter.published) {
      console.log('Newsletter is not published');
      return null;
    }

    return newsletter;
  } catch (error) {
    console.error('Error getting newsletter:', error);
    throw error;
  }
};

// 公開済みニュースレター一覧を取得
export const getPublishedNewsletters = async (
  options: Omit<NewsletterQueryOptions, 'published'> = {}
): Promise<Newsletter[]> => {
  try {
    const allNewsletters = await getNewsletters();
    return applyFilters(allNewsletters, { ...options, published: true });
  } catch (error) {
    console.error('Error getting published newsletters:', error);
    throw error;
  }
};

// 号数でニュースレターを取得（公開済みのみ）
export const getNewsletterByIssueNumber = async (issueNumber: number): Promise<Newsletter | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('issueNumber', '==', issueNumber),
      where('published', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return convertToNewsletter(querySnapshot.docs[0].id, querySnapshot.docs[0].data());
  } catch (error) {
    console.error('Error fetching newsletter by issue number:', error);
    throw error;
  }
};