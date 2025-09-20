import { 
  COLLECTION_NAME, 
  collection, 
  addDoc, 
  Timestamp, 
  db,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
  type NewsletterFormData,
  type NewsletterQueryOptions,
  type Newsletter,
} from './constants';
import { convertToFirestoreData, convertToNewsletter } from './converter';
import { getNewsletters } from './base';
import { applyFilters } from './filters';
import { Author } from '@/types/author';

// ニュースレター一覧を取得（管理者用、全件）
export const getAdminNewsletters = async (
  options: NewsletterQueryOptions = {}
): Promise<Newsletter[]> => {
  try {
    const allNewsletters = await getNewsletters();
    return applyFilters(allNewsletters, options);
  } catch (error) {
    console.error('Error getting admin newsletters:', error);
    throw error;
  }
};

// ニュースレターを作成
export const createNewsletter = async (
  formData: NewsletterFormData,
  author?: Author
): Promise<string> => {
  try {
    const data = {
      ...convertToFirestoreData(formData),
      author: author || null,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    console.log('Newsletter created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating newsletter:', error);
    throw error;
  }
};

// ニュースレターを更新
export const updateNewsletter = async (
  id: string,
  formData: NewsletterFormData
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const data = convertToFirestoreData(formData);
    
    await updateDoc(docRef, data);
    console.log('Newsletter updated:', id);
  } catch (error) {
    console.error('Error updating newsletter:', error);
    throw error;
  }
};

// ニュースレターを削除
export const deleteNewsletter = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('Newsletter deleted:', id);
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    throw error;
  }
};

// 最新号数を取得
export const getLatestIssueNumber = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('issueNumber', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return 0;
    }
    
    const latestNewsletter = convertToNewsletter(
      querySnapshot.docs[0].id,
      querySnapshot.docs[0].data()
    );
    return latestNewsletter.issueNumber;
  } catch (error) {
    console.error('Error fetching latest issue number:', error);
    return 0;
  }
};