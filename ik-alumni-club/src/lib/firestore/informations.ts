import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Information,
  InformationFormData,
  InformationQueryOptions,
  InformationAuthor,
} from '@/types';

const COLLECTION_NAME = 'informations';

// Firestore DocumentData を Information 型に変換
const convertToInformation = (id: string, data: DocumentData): Information => {
  return {
    id,
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
  };
};

// InformationFormData を Firestore 用のデータに変換
const convertToFirestoreData = (
  formData: InformationFormData,
  author: InformationAuthor
) => {
  return {
    title: formData.title,
    date: Timestamp.fromDate(formData.date),
    category: formData.category,
    content: formData.content,
    summary: formData.summary,
    targetMembers: formData.targetMembers,
    isPinned: formData.isPinned,
    published: formData.published,
    author,
    updatedAt: Timestamp.now(),
  };
};

// お知らせを作成
export const createInformation = async (
  formData: InformationFormData,
  author: InformationAuthor
): Promise<string> => {
  try {
    const data = {
      ...convertToFirestoreData(formData, author),
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    console.log('Information created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating information:', error);
    throw error;
  }
};

// お知らせを1件取得
export const getInformation = async (id: string): Promise<Information | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return convertToInformation(docSnap.id, docSnap.data());
    } else {
      console.log('No such information!');
      return null;
    }
  } catch (error) {
    console.error('Error getting information:', error);
    throw error;
  }
};

// お知らせ一覧を取得
export const getInformations = async (
  options: InformationQueryOptions = {}
): Promise<Information[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // published フィルター
    if (options.published !== undefined) {
      constraints.push(where('published', '==', options.published));
    }

    // category フィルター
    if (options.category) {
      constraints.push(where('category', '==', options.category));
    }

    // targetMembers フィルター（array-contains-any）
    if (options.targetMembers && options.targetMembers.length > 0) {
      constraints.push(where('targetMembers', 'array-contains-any', options.targetMembers));
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
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    const informations: Information[] = [];
    querySnapshot.forEach((doc) => {
      informations.push(convertToInformation(doc.id, doc.data()));
    });

    // isPinned の場合は、ピン留めされたものを上に
    if (options.isPinned === undefined) {
      informations.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // 同じピン留め状態の場合は日付でソート
        return b.date.getTime() - a.date.getTime();
      });
    }

    return informations;
  } catch (error) {
    console.error('Error getting informations:', error);
    throw error;
  }
};

// お知らせを更新
export const updateInformation = async (
  id: string,
  formData: InformationFormData,
  author: InformationAuthor
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const data = convertToFirestoreData(formData, author);
    
    await updateDoc(docRef, data);
    console.log('Information updated:', id);
  } catch (error) {
    console.error('Error updating information:', error);
    throw error;
  }
};

// お知らせを削除
export const deleteInformation = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('Information deleted:', id);
  } catch (error) {
    console.error('Error deleting information:', error);
    throw error;
  }
};

// ユーザーが閲覧可能なお知らせを取得
export const getAvailableInformations = async (
  userPlan?: 'PLATINUM' | 'BUSINESS' | 'INDIVIDUAL',
  options: InformationQueryOptions = {}
): Promise<Information[]> => {
  try {
    // 公開済みのお知らせのみを取得
    const queryOptions: InformationQueryOptions = {
      ...options,
      published: true,
    };

    const allInformations = await getInformations(queryOptions);

    // ユーザーのプランに応じてフィルタリング
    const filteredInformations = allInformations.filter((info) => {
      // ALLが含まれていれば全員閲覧可能
      if (info.targetMembers.includes('ALL')) {
        return true;
      }

      // ログインしていない場合はALLのみ
      if (!userPlan) {
        return false;
      }

      // プランによる階層的なアクセス制御
      if (userPlan === 'PLATINUM') {
        // PLATINUM会員は全て閲覧可能
        return true;
      } else if (userPlan === 'BUSINESS') {
        // BUSINESS会員はINDIVIDUAL以上を閲覧可能
        return info.targetMembers.includes('BUSINESS') || 
               info.targetMembers.includes('INDIVIDUAL');
      } else if (userPlan === 'INDIVIDUAL') {
        // INDIVIDUAL会員はINDIVIDUALのみ閲覧可能
        return info.targetMembers.includes('INDIVIDUAL');
      }

      return false;
    });

    return filteredInformations;
  } catch (error) {
    console.error('Error getting available informations:', error);
    throw error;
  }
};