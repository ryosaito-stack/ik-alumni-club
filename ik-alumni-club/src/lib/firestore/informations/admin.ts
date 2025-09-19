import { 
    COLLECTION_NAME, 
    collection, 
    addDoc, 
    Timestamp, 
    db,
    doc,
    updateDoc,
    deleteDoc,
    type InformationFormData 
} from './constants';
import { convertToFirestoreData } from './converter';

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