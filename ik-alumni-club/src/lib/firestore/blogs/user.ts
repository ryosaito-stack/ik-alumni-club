// Blog一般ユーザー向けAPI（公開済みのみ取得）

import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  db,
  COLLECTION_NAME,
  type Blog,
  type BlogQueryOptions,
} from './constants';
import { convertToBlog } from './converter';

// 公開済みのBlog記事を取得（一般ユーザー向け）
export const getPublishedBlogs = async (options: BlogQueryOptions = {}): Promise<Blog[]> => {
  try {
    // ソートのみ適用（whereとorderByの組み合わせを避けてインデックスエラー回避）
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
      // クライアント側で公開済みのみフィルタリング
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

// 単一のBlog記事を取得（公開済みチェック付き）
export const getBlog = async (id: string): Promise<Blog | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const blog = convertToBlog(docSnap.id, docSnap.data());
    
    // 非公開の場合はnullを返す（一般ユーザーはアクセス不可）
    if (!blog.published) {
      return null;
    }
    
    return blog;
  } catch (error) {
    console.error('Error getting blog:', error);
    throw error;
  }
};