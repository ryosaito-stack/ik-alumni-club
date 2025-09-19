import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, collection, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import {
  Information,
  InformationFormData,
  InformationQueryOptions,
} from '@/types';
import {
  createInformation as createInformationFirestore,
  getInformation as getInformationFirestore,
  updateInformation as updateInformationFirestore,
  deleteInformation as deleteInformationFirestore,
  getInformations as getInformationsFirestore,
} from '@/lib/firestore/informations';

// お知らせ一覧を取得するフック（リアルタイム更新対応）
export const useInformations = (options: InformationQueryOptions = {}) => {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Firestoreクエリの構築
    const constraints = [];
    
    // ソート（単一フィールドのみ使用してインデックス不要に）
    const orderField = options.orderBy || 'date';
    const orderDirection = options.orderDirection || 'desc';
    constraints.push(orderBy(orderField, orderDirection));

    // リミット（多めに取得してクライアント側でフィルタリング）
    if (options.limit && !options.published) {
      constraints.push(firestoreLimit(options.limit));
    } else if (options.limit) {
      // publishedフィルターがある場合は多めに取得
      constraints.push(firestoreLimit(options.limit * 3));
    }

    const q = query(collection(db, 'informations'), ...constraints);

    // リアルタイムリスナーの設定
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const informationsList: Information[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // publishedフィルターをクライアント側で適用
          if (options.published === undefined || data.published === options.published) {
            informationsList.push({
              id: doc.id,
              title: data.title || '',
              date: data.date?.toDate() || new Date(),
              content: data.content || '',
              imageUrl: data.imageUrl,
              url: data.url,
              published: data.published || false,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
          }
        });

        // limitをクライアント側で適用
        const limitedList = options.limit && options.published !== undefined
          ? informationsList.slice(0, options.limit)
          : informationsList;

        setInformations(limitedList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching informations:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // クリーンアップ
    return () => unsubscribe();
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
        const result = await getInformationFirestore(id);
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

    setLoading(true);
    setError(null);

    try {
      const id = await createInformationFirestore(formData);
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

    setLoading(true);
    setError(null);

    try {
      await updateInformationFirestore(id, formData);
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

    setLoading(true);
    setError(null);

    try {
      await deleteInformationFirestore(id);
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