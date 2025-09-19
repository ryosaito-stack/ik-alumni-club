import { useState, useEffect } from 'react';
import {
  getNewsletters,
  getNewsletter,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  getPublishedNewsletters,
  getLatestIssueNumber,
} from '@/lib/firestore/newsletters';
import { Newsletter, NewsletterQueryOptions } from '@/types';

// 単一のNewsletter取得用フック
export const useNewsletter = (id: string) => {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoading(true);
        const data = await getNewsletter(id);
        setNewsletter(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch newsletter'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsletter();
    }
  }, [id]);

  return { newsletter, loading, error };
};

// Newsletter一覧取得用フック
export const useNewsletters = (limit?: number) => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        const data = await getPublishedNewsletters(limit);
        setNewsletters(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch newsletters'));
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [limit]);

  return { newsletters, loading, error };
};

// Newsletter管理用フック（管理画面用）
export const useNewslettersAdmin = (options: NewsletterQueryOptions = {}) => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        const data = await getNewsletters(options);
        setNewsletters(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch newsletters'));
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [JSON.stringify(options)]);

  return { newsletters, loading, error };
};

// Newsletter CRUD操作用フック
export const useNewsletterMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNewsletterHandler = async (
    data: Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // 最新号数を取得して自動的に次の号数を設定
      if (!data.issueNumber) {
        const latestIssue = await getLatestIssueNumber();
        data.issueNumber = latestIssue + 1;
      }
      
      const id = await createNewsletter(data);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create newsletter'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateNewsletterHandler = async (
    id: string,
    data: Partial<Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await updateNewsletter(id, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update newsletter'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteNewsletterHandler = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteNewsletter(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete newsletter'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewsletter: createNewsletterHandler,
    updateNewsletter: updateNewsletterHandler,
    deleteNewsletter: deleteNewsletterHandler,
    loading,
    error,
  };
};