import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, collection, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import {
  Information,
  InformationFormData,
  InformationQueryOptions,
  InformationAuthor,
} from '@/types';
import {
  createInformation as createInformationFirestore,
  getInformation as getInformationFirestore,
  updateInformation as updateInformationFirestore,
  deleteInformation as deleteInformationFirestore,
  getAvailableInformations as getAvailableInformationsFirestore,
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
    
    // published フィルター
    if (options.published !== undefined) {
      constraints.push(where('published', '==', options.published));
    }

    // category フィルター
    if (options.category) {
      constraints.push(where('category', '==', options.category));
    }

    // isPinned フィルター
    if (options.isPinned !== undefined) {
      constraints.push(where('isPinned', '==', options.isPinned));
    }

    // ソート
    const orderField = options.orderBy || 'date';
    const orderDirection = options.orderDirection || 'desc';
    constraints.push(orderBy(orderField, orderDirection));

    // リミット
    if (options.limit) {
      constraints.push(firestoreLimit(options.limit));
    }

    const q = query(collection(db, 'informations'), ...constraints);

    // リアルタイムリスナーの設定
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const informationsList: Information[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          informationsList.push({
            id: doc.id,
            title: data.title || '',
            date: data.date?.toDate() || new Date(),
            category: data.category || 'お知らせ',
            content: data.content || '',
            summary: data.summary || '',
            targetMembers: data.targetMembers || ['ALL'],
            isPinned: data.isPinned || false,
            published: data.published || false,
            author: data.author || { id: '', name: '', role: '' },
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        // targetMembers によるフィルタリング（クライアント側）
        if (options.targetMembers && options.targetMembers.length > 0) {
          const filteredList = informationsList.filter((info) => {
            return options.targetMembers?.some((target) => 
              info.targetMembers.includes(target)
            );
          });
          setInformations(filteredList);
        } else {
          // isPinned の場合は、ピン留めされたものを上に
          if (options.isPinned === undefined) {
            informationsList.sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              // 同じピン留め状態の場合は日付でソート
              return b.date.getTime() - a.date.getTime();
            });
          }
          setInformations(informationsList);
        }
        
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
    options.category,
    options.targetMembers?.join(','),
    options.published,
    options.isPinned,
    options.limit,
    options.orderBy,
    options.orderDirection,
  ]);

  return { informations, loading, error };
};

// ユーザーが閲覧可能なお知らせを取得するフック
export const useAvailableInformations = (options: InformationQueryOptions = {}) => {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { member } = useAuth();

  useEffect(() => {
    const fetchInformations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // メンバーのプランを取得
        const userPlan = member?.plan?.toUpperCase() as 'PLATINUM' | 'BUSINESS' | 'INDIVIDUAL' | undefined;
        
        const result = await getAvailableInformationsFirestore(userPlan, options);
        setInformations(result);
      } catch (err) {
        console.error('Error fetching available informations:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformations();
  }, [
    member?.plan,
    options.category,
    options.limit,
    options.orderBy,
    options.orderDirection,
  ]);

  return { informations, loading, error };
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

// お知らせのCRUD操作を提供するフック
export const useInformationMutations = () => {
  const { user, member } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 作成
  const createInformation = useCallback(async (
    formData: InformationFormData
  ): Promise<string | null> => {
    if (!user || !member) {
      setError(new Error('認証が必要です'));
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const author: InformationAuthor = {
        id: user.uid,
        name: member.displayName || user.email || '管理者',
        role: member.role || 'member',
      };

      const id = await createInformationFirestore(formData, author);
      return id;
    } catch (err) {
      console.error('Error creating information:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, member]);

  // 更新
  const updateInformation = useCallback(async (
    id: string,
    formData: InformationFormData
  ): Promise<boolean> => {
    if (!user || !member) {
      setError(new Error('認証が必要です'));
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const author: InformationAuthor = {
        id: user.uid,
        name: member.displayName || user.email || '管理者',
        role: member.role || 'member',
      };

      await updateInformationFirestore(id, formData, author);
      return true;
    } catch (err) {
      console.error('Error updating information:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, member]);

  // 削除
  const deleteInformation = useCallback(async (id: string): Promise<boolean> => {
    if (!user || !member) {
      setError(new Error('認証が必要です'));
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteInformationFirestore(id);
      return true;
    } catch (err) {
      console.error('Error deleting information:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, member]);

  return {
    createInformation,
    updateInformation,
    deleteInformation,
    loading,
    error,
  };
};