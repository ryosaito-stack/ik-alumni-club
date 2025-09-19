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
} from '@/types/information';
import { timestampToDate } from '@/lib/firestore/utils';

const COLLECTION_NAME = 'informations';

// Firestore DocumentData を Information 型に変換
const convertToInformation = (id: string, data: DocumentData): Information => {
  return {
    id,
    date: timestampToDate(data.date),
    title: data.title || '',
    content: data.content || '',
    imageUrl: data.imageUrl,
    url: data.url,
    published: data.published || false,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};

// InformationFormData を Firestore 用のデータに変換
const convertToFirestoreData = (formData: InformationFormData) => {
  return {
    date: Timestamp.fromDate(formData.date),
    title: formData.title,
    content: formData.content,
    imageUrl: formData.imageUrl,
    url: formData.url,
    published: formData.published,
    updatedAt: Timestamp.now(),
  };
};

// お知らせを作成
export const createInformation = async (
  formData: InformationFormData
): Promise<string> => {
  try {
    const data = {
      ...convertToFirestoreData(formData),
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

    return informations;
  } catch (error) {
    console.error('Error getting informations:', error);
    throw error;
  }
};

// お知らせを更新
export const updateInformation = async (
  id: string,
  formData: InformationFormData
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const data = convertToFirestoreData(formData);
    
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

// 公開済みのお知らせを取得（全ユーザー共通）
export const getPublishedInformations = async (
  options: Omit<InformationQueryOptions, 'published'> = {}
): Promise<Information[]> => {
  return getInformations({
    ...options,
    published: true,
  });
};