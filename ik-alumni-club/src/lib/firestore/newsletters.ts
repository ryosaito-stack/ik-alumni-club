/**
 * Newsletter Firestore操作用モジュール
 * 会報の取得、作成、更新、削除を行う
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentReference,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Newsletter, NewsletterQueryOptions } from '@/types';

const COLLECTION_NAME = 'newsletters';

/**
 * FirestoreドキュメントをNewsletter型に変換
 */
function convertToNewsletter(doc: any): Newsletter {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    issueNumber: data.issueNumber,
    content: data.content,
    excerpt: data.excerpt,
    pdfUrl: data.pdfUrl || undefined,
    published: data.published || false,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Newsletterを取得（クエリオプション付き・インデックスエラー回避版）
 */
export async function getNewsletters(options: NewsletterQueryOptions = {}): Promise<Newsletter[]> {
  try {
    const constraints: QueryConstraint[] = [];

    // ソート順を指定（whereとorderByの組み合わせを避ける）
    const sortField = options.orderBy || 'issueNumber';
    const sortDirection = options.orderDirection || 'desc';
    constraints.push(orderBy(sortField, sortDirection));

    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    let newsletters = querySnapshot.docs.map(convertToNewsletter);

    // クライアント側でフィルタリング
    if (options.published !== undefined) {
      newsletters = newsletters.filter(n => n.published === options.published);
    }

    // クライアント側で制限
    if (options.limit) {
      newsletters = newsletters.slice(0, options.limit);
    }

    return newsletters;
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    throw error;
  }
}

/**
 * 単一のNewsletterを取得
 */
export async function getNewsletter(id: string): Promise<Newsletter | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return convertToNewsletter(docSnap);
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    throw error;
  }
}

/**
 * 号数でNewsletterを取得
 */
export async function getNewsletterByIssueNumber(issueNumber: number): Promise<Newsletter | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('issueNumber', '==', issueNumber),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return convertToNewsletter(querySnapshot.docs[0]);
  } catch (error) {
    console.error('Error fetching newsletter by issue number:', error);
    throw error;
  }
}

/**
 * 新しいNewsletterを作成
 */
export async function createNewsletter(
  data: Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const now = Timestamp.now();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef: DocumentReference = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating newsletter:', error);
    throw error;
  }
}

/**
 * Newsletterを更新
 */
export async function updateNewsletter(
  id: string,
  data: Partial<Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating newsletter:', error);
    throw error;
  }
}

/**
 * Newsletterを削除
 */
export async function deleteNewsletter(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    throw error;
  }
}

/**
 * 最新号数を取得
 */
export async function getLatestIssueNumber(): Promise<number> {
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
    
    const latestNewsletter = convertToNewsletter(querySnapshot.docs[0]);
    return latestNewsletter.issueNumber;
  } catch (error) {
    console.error('Error fetching latest issue number:', error);
    return 0;
  }
}

/**
 * 公開中のNewsletterを取得
 */
export async function getPublishedNewsletters(limitCount?: number): Promise<Newsletter[]> {
  return getNewsletters({
    published: true,
    orderBy: 'issueNumber',
    orderDirection: 'desc',
    limit: limitCount,
  });
}

/**
 * 下書きのNewsletterを取得
 */
export async function getDraftNewsletters(): Promise<Newsletter[]> {
  return getNewsletters({
    published: false,
    orderBy: 'updatedAt',
    orderDirection: 'desc',
  });
}