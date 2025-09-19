import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Blog, BlogFormData, BlogQueryOptions } from '@/types';

const COLLECTION_NAME = 'blogs';

// Timestamp型をDateに変換するヘルパー関数
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// FirestoreデータをBlog型に変換
const convertToBlog = (id: string, data: any): Blog => {
  return {
    id,
    title: data.title || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    thumbnail: data.thumbnail || '',
    published: data.published || false,
    author: data.author || { id: '', name: '', role: '' },
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

// 単一のBlog記事を取得
export const getBlog = async (id: string): Promise<Blog | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return convertToBlog(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error getting blog:', error);
    throw error;
  }
};

// Blogのリストを取得（インデックスエラー回避版）
export const getBlogs = async (options: BlogQueryOptions = {}): Promise<Blog[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // ソートのみ適用（whereとorderByの組み合わせを避ける）
    const orderField = options.orderBy || 'createdAt';
    const orderDirection = options.orderDirection || 'desc';
    constraints.push(orderBy(orderField, orderDirection));

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    let blogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blog = convertToBlog(doc.id, doc.data());
      blogs.push(blog);
    });

    // クライアント側でフィルタリング
    if (options.published !== undefined) {
      blogs = blogs.filter(blog => blog.published === options.published);
    }

    // クライアント側で制限
    if (options.limit) {
      blogs = blogs.slice(0, options.limit);
    }

    return blogs;
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw error;
  }
};

// 公開済みのBlog記事を取得（一般ユーザー向け）
export const getPublishedBlogs = async (options: BlogQueryOptions = {}): Promise<Blog[]> => {
  try {
    // 全てのブログを取得してからクライアント側でフィルタリング
    const constraints: QueryConstraint[] = [];
    
    // ソートのみ適用
    const orderField = options.orderBy || 'createdAt';
    const orderDirection = options.orderDirection || 'desc';
    constraints.push(orderBy(orderField, orderDirection));

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    let blogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blog = convertToBlog(doc.id, doc.data());
      // 公開済みのみフィルタリング
      if (blog.published) {
        blogs.push(blog);
      }
    });

    // クライアント側で制限
    if (options.limit) {
      blogs = blogs.slice(0, options.limit);
    }

    return blogs;
  } catch (error) {
    console.error('Error getting published blogs:', error);
    throw error;
  }
};

// 最新のBlog記事を取得
export const getLatestBlogs = async (limit: number = 5): Promise<Blog[]> => {
  try {
    // createdAtでソートしてから、クライアント側で公開済みをフィルタリング
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const blogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blog = convertToBlog(doc.id, doc.data());
      // 公開済みのみ追加
      if (blog.published) {
        blogs.push(blog);
      }
    });

    // 指定された数だけ返す
    return blogs.slice(0, limit);
  } catch (error) {
    console.error('Error getting latest blogs:', error);
    throw error;
  }
};

// Blog記事を作成
export const createBlog = async (
  data: BlogFormData,
  author: { id: string; name: string; role: string }
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
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

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