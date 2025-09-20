// Blog管理者向けAPI（全CRUD操作）

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  db,
  COLLECTION_NAME,
  type Blog,
  type BlogFormData,
  type BlogQueryOptions,
} from './constants';
import { convertToBlog, convertToFirestoreData } from './converter';
import type { Author } from '@/types/author';

// 全てのBlog記事を取得（管理者向け、非公開含む）
export const getAllBlogs = async (options: BlogQueryOptions = {}): Promise<Blog[]> => {
  try {
    const orderField = options.orderBy || 'createdAt';
    const orderDirection = options.orderDirection || 'desc';
    
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy(orderField, orderDirection)
    );
    
    const querySnapshot = await getDocs(q);
    
    let blogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blog = convertToBlog(doc.id, doc.data());
      blogs.push(blog);
    });
    
    // クライアント側でフィルタリング（publishedフィルター）
    if (options.published !== undefined) {
      blogs = blogs.filter(blog => blog.published === options.published);
    }
    
    // クライアント側で制限
    if (options.limit) {
      blogs = blogs.slice(0, options.limit);
    }
    
    return blogs;
  } catch (error) {
    console.error('Error getting all blogs:', error);
    throw error;
  }
};

// 単一のBlog記事を取得（管理者向け、非公開含む）
export const getBlogAdmin = async (id: string): Promise<Blog | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return convertToBlog(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error getting blog (admin):', error);
    throw error;
  }
};

// Blog記事を作成
export const createBlog = async (
  data: BlogFormData,
  author: Author
): Promise<string> => {
  try {
    const docData = {
      ...data,
      author,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Blog記事を更新
export const updateBlog = async (
  id: string,
  data: BlogFormData
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = convertToFirestoreData(data);
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Blog記事を削除
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};