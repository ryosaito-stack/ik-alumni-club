import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Information,
  InformationFormData,
  InformationQueryOptions,
} from '@/types/information';
import { getPublishedInformations, getInformation } from '@/lib/firestore/informations/user';
import * as admin from '@/lib/firestore/informations/admin';

// お知らせ一覧を取得するフック
export const useInformations = (options: InformationQueryOptions = {}) => {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInformations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getPublishedInformations(options);
        setInformations(data);
      } catch (err) {
        console.error('Error fetching informations:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformations();
  }, [
    options.published,
    options.limit,
    options.orderBy,
    options.orderDirection,
  ]);

  return { informations, loading, error };
};

// ユーザーが閲覧可能なお知らせを取得するフック（公開されたもののみ）
export const useAvailableInformations = (options: InformationQueryOptions = {}) => {
  // useInformationsフックを再利用して、publishedをtrueに強制
  return useInformations({
    ...options,
    published: true,
  });
};

// 単一のお知らせを取得するフック
export const useInformation = (id: string) => {
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchInformation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getInformation(id);
        setInformation(result);
      } catch (err) {
        console.error('Error fetching information:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, [id]);

  return { information, loading, error };
};

// お知らせのCRUD操作用フック
export const useInformationMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { member } = useAuth();

  const createInformation = useCallback(async (formData: InformationFormData): Promise<string | null> => {
    if (!member) {
      setError(new Error('ログインが必要です'));
      return null;
    }

    if (member.role !== 'admin') {
      setError(new Error('管理者権限が必要です'));
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const id = await admin.createInformation(formData);
      setLoading(false);
      return id;
    } catch (err) {
      console.error('Error creating information:', err);
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, [member]);

  const updateInformation = useCallback(async (id: string, formData: InformationFormData): Promise<boolean> => {
    if (!member) {
      setError(new Error('ログインが必要です'));
      return false;
    }

    if (member.role !== 'admin') {
      setError(new Error('管理者権限が必要です'));
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await admin.updateInformation(id, formData);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error updating information:', err);
      setError(err as Error);
      setLoading(false);
      return false;
    }
  }, [member]);

  const deleteInformation = useCallback(async (id: string): Promise<boolean> => {
    if (!member) {
      setError(new Error('ログインが必要です'));
      return false;
    }

    if (member.role !== 'admin') {
      setError(new Error('管理者権限が必要です'));
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await admin.deleteInformation(id);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error deleting information:', err);
      setError(err as Error);
      setLoading(false);
      return false;
    }
  }, [member]);

  return {
    createInformation,
    updateInformation,
    deleteInformation,
    loading,
    error,
  };
};