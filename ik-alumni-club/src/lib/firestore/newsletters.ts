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
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';

// 会報の型定義
export interface Newsletter {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'MONTHLY' | 'ANNUAL' | 'SPECIAL' | 'CLUB';
  type: 'pdf' | 'html';
  fileUrl?: string;
  pages?: number;
  content?: string;
  isPremium: boolean;
  targetMembers: ('ALL' | 'PLATINUM' | 'BUSINESS' | 'INDIVIDUAL')[];
  published: boolean;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterFormData {
  title: string;
  description: string;
  date: Date;
  category: Newsletter['category'];
  type: Newsletter['type'];
  fileUrl?: string;
  pages?: number;
  content?: string;
  isPremium: boolean;
  targetMembers: Newsletter['targetMembers'];
  published: boolean;
  author: string;
  tags: string[];
}

// 会報の作成
export async function createNewsletter(data: NewsletterFormData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'newsletters'), {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating newsletter:', error);
    throw error;
  }
}

// 会報の取得（単一）
export async function getNewsletter(id: string): Promise<Newsletter | null> {
  try {
    const docRef = doc(db, 'newsletters', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        date: data.date?.toDate() || new Date(),
        category: data.category,
        type: data.type,
        fileUrl: data.fileUrl,
        pages: data.pages,
        content: data.content,
        isPremium: data.isPremium || false,
        targetMembers: data.targetMembers || ['ALL'],
        published: data.published || false,
        author: data.author,
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting newsletter:', error);
    throw error;
  }
}

// 会報一覧の取得
export async function getNewsletters(options: {
  category?: Newsletter['category'];
  isPremium?: boolean;
  published?: boolean;
  limit?: number;
  orderBy?: 'date' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
} = {}): Promise<Newsletter[]> {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (options.category) {
      constraints.push(where('category', '==', options.category));
    }
    
    if (options.isPremium !== undefined) {
      constraints.push(where('isPremium', '==', options.isPremium));
    }
    
    if (options.published !== undefined) {
      constraints.push(where('published', '==', options.published));
    }
    
    const orderField = options.orderBy || 'date';
    const orderDirection = options.orderDirection || 'desc';
    constraints.push(orderBy(orderField, orderDirection));
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    const q = query(collection(db, 'newsletters'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const newsletters: Newsletter[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsletters.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date?.toDate() || new Date(),
        category: data.category,
        type: data.type,
        fileUrl: data.fileUrl,
        pages: data.pages,
        content: data.content,
        isPremium: data.isPremium || false,
        targetMembers: data.targetMembers || ['ALL'],
        published: data.published || false,
        author: data.author,
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return newsletters;
  } catch (error) {
    console.error('Error getting newsletters:', error);
    return [];
  }
}

// ユーザーが閲覧可能な会報を取得
export async function getAvailableNewsletters(
  userPlan?: 'PLATINUM' | 'BUSINESS' | 'INDIVIDUAL',
  options: {
    category?: Newsletter['category'];
    limit?: number;
    orderBy?: 'date' | 'createdAt';
    orderDirection?: 'asc' | 'desc';
  } = {}
): Promise<Newsletter[]> {
  try {
    // published=trueの会報のみ取得
    const allNewsletters = await getNewsletters({
      ...options,
      published: true,
    });
    
    // ユーザープランに応じてフィルタリング
    if (!userPlan) {
      // 未ログインユーザーはALLのみ
      return allNewsletters.filter(newsletter => 
        newsletter.targetMembers.includes('ALL')
      );
    }
    
    // プランの階層関係
    const accessibleTargets: Newsletter['targetMembers'][0][] = ['ALL'];
    
    switch (userPlan) {
      case 'PLATINUM':
        accessibleTargets.push('PLATINUM', 'BUSINESS', 'INDIVIDUAL');
        break;
      case 'BUSINESS':
        accessibleTargets.push('BUSINESS', 'INDIVIDUAL');
        break;
      case 'INDIVIDUAL':
        accessibleTargets.push('INDIVIDUAL');
        break;
    }
    
    return allNewsletters.filter(newsletter => 
      newsletter.targetMembers.some(target => accessibleTargets.includes(target))
    );
  } catch (error) {
    console.error('Error getting available newsletters:', error);
    return [];
  }
}

// 会報の更新
export async function updateNewsletter(
  id: string,
  data: Partial<NewsletterFormData>
): Promise<void> {
  try {
    const docRef = doc(db, 'newsletters', id);
    const updateData: any = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    
    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date);
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating newsletter:', error);
    throw error;
  }
}

// 会報の削除
export async function deleteNewsletter(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'newsletters', id));
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    throw error;
  }
}