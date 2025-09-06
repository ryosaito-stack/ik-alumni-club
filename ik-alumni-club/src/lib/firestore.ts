import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  QueryConstraint,
  limit as limitConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { Content, Member, MemberPlan } from '@/types';

// プラン階層の定義（上位プランは下位プランのコンテンツも閲覧可能）
const planHierarchy: Record<MemberPlan, MemberPlan[]> = {
  individual: ['individual'],
  business: ['individual', 'business'],
  platinum: ['individual', 'business', 'platinum'],
};

// コンテンツ取得（プランによるフィルタリング）
export async function getContentsForPlan(userPlan: MemberPlan): Promise<Content[]> {
  try {
    const accessiblePlans = planHierarchy[userPlan] || ['individual'];
    
    // アクセス可能なプランのコンテンツを取得
    const constraints: QueryConstraint[] = [
      where('requiredPlan', 'in', accessiblePlans),
      orderBy('createdAt', 'desc')
    ];
    
    const q = query(collection(db, 'contents'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const contents: Content[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      contents.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        type: data.type,
        requiredPlan: data.requiredPlan,
        author: data.author,
        tags: data.tags || [],
        fileUrl: data.fileUrl,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      });
    });
    
    return contents;
  } catch (error) {
    console.error('Error fetching contents:', error);
    return [];
  }
}

// 全コンテンツ取得（管理者用）
export async function getAllContents(): Promise<Content[]> {
  try {
    const q = query(collection(db, 'contents'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const contents: Content[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      contents.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        type: data.type,
        requiredPlan: data.requiredPlan,
        author: data.author,
        tags: data.tags || [],
        fileUrl: data.fileUrl,
        // Blog-specific fields
        excerpt: data.excerpt,
        category: data.category,
        readTime: data.readTime,
        isPremium: data.isPremium,
        content: data.content,
        thumbnail: data.thumbnail,
        published: data.published,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      });
    });
    
    return contents;
  } catch (error) {
    console.error('Error fetching all contents:', error);
    return [];
  }
}

// getContents エイリアス（管理者用フックで使用）
export const getContents = getAllContents;

// 特定のコンテンツを取得
export async function getContentById(contentId: string): Promise<Content | null> {
  try {
    const docRef = doc(db, 'contents', contentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        type: data.type,
        requiredPlan: data.requiredPlan,
        author: data.author,
        tags: data.tags || [],
        fileUrl: data.fileUrl,
        // Blog-specific fields
        excerpt: data.excerpt,
        category: data.category,
        readTime: data.readTime,
        isPremium: data.isPremium,
        content: data.content,
        thumbnail: data.thumbnail,
        published: data.published,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

// ブログ記事（type: 'article'）を取得
export async function getBlogArticles(limit?: number): Promise<Content[]> {
  try {
    let q = query(
      collection(db, 'contents'),
      where('type', '==', 'article'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    if (limit) {
      q = query(q, limitConstraint(limit));
    }
    
    const querySnapshot = await getDocs(q);
    const articles: Content[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        type: data.type,
        requiredPlan: data.requiredPlan,
        author: data.author,
        tags: data.tags || [],
        fileUrl: data.fileUrl,
        // Blog-specific fields
        excerpt: data.excerpt,
        category: data.category,
        readTime: data.readTime,
        isPremium: data.isPremium,
        content: data.content,
        thumbnail: data.thumbnail,
        published: data.published,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return [];
  }
}

// 会報（type: 'newsletter'）を取得
export async function getNewsletters(limit?: number): Promise<Content[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('type', '==', 'newsletter'),
      orderBy('createdAt', 'desc')
    ];
    
    if (limit) {
      constraints.push(limitConstraint(limit));
    }
    
    const q = query(collection(db, 'contents'), ...constraints);
    const querySnapshot = await getDocs(q);
    const newsletters: Content[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsletters.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        type: data.type,
        requiredPlan: data.requiredPlan,
        author: data.author,
        tags: data.tags || [],
        fileUrl: data.fileUrl,
        // Newsletter-specific fields
        excerpt: data.excerpt,
        category: data.category,
        isPremium: data.isPremium,
        content: data.content,
        thumbnail: data.thumbnail,
        published: data.published,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      });
    });
    
    return newsletters;
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return [];
  }
}

// コンテンツ作成（管理者用）
export async function createContent(content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'contents'), {
      ...content,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    // 作成したコンテンツを返す
    return {
      ...content,
      id: docRef.id,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
}

// コンテンツ更新（管理者用）
export async function updateContent(
  contentId: string, 
  updates: Partial<Omit<Content, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'contents', contentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

// コンテンツ削除（管理者用）
export async function deleteContent(contentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'contents', contentId));
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

// ユーザーがコンテンツにアクセスできるかチェック
export function canAccessContent(userPlan: MemberPlan, contentPlan: MemberPlan): boolean {
  const accessiblePlans = planHierarchy[userPlan] || ['individual'];
  return accessiblePlans.includes(contentPlan);
}

// =====================================
// メンバープロフィール関連
// =====================================

// メンバー情報を取得
export async function getMemberById(uid: string): Promise<Member | null> {
  try {
    const docRef = doc(db, 'members', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        email: data.email,
        displayName: data.displayName,
        plan: data.plan || 'individual',
        role: data.role,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
        profileImageUrl: data.profileImageUrl,
        phoneNumber: data.phoneNumber,
        address: data.address,
        bio: data.bio,
        company: data.company,
        position: data.position,
        graduationYear: data.graduationYear,
        major: data.major,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching member:', error);
    return null;
  }
}

// メンバー情報を更新
export async function updateMemberProfile(
  uid: string,
  updates: Partial<Omit<Member, 'uid' | 'email' | 'createdAt' | 'plan' | 'role'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'members', uid);
    
    // 更新するデータを準備（undefined値を除外）
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };
    
    // undefined以外の値のみ追加
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        updateData[key] = value;
      }
    });
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating member profile:', error);
    throw error;
  }
}

// メンバー情報を作成または更新（初回ログイン時など）
export async function createOrUpdateMember(member: Partial<Member> & { uid: string; email: string }): Promise<void> {
  try {
    const docRef = doc(db, 'members', member.uid);
    
    const existingDoc = await getDoc(docRef);
    
    if (existingDoc.exists()) {
      // 既存のメンバーを更新
      await updateDoc(docRef, {
        ...member,
        updatedAt: Timestamp.now(),
      });
    } else {
      // 新規メンバーを作成
      await setDoc(docRef, {
        ...member,
        plan: member.plan || 'individual',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error creating/updating member:', error);
    throw error;
  }
}

// =====================================
// ユーザー管理（管理者用）
// =====================================

// 全メンバー取得
export async function getAllMembers(): Promise<Member[]> {
  try {
    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const members: Member[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      members.push({
        uid: doc.id,
        email: data.email,
        displayName: data.displayName || '',
        plan: data.plan || 'individual',
        role: data.role,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
        profileImageUrl: data.profileImageUrl,
        phoneNumber: data.phoneNumber,
        address: data.address,
        bio: data.bio,
        company: data.company,
        position: data.position,
        graduationYear: data.graduationYear,
        major: data.major,
      });
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching all members:', error);
    return [];
  }
}

// メンバーのプラン更新
export async function updateMemberPlan(uid: string, plan: MemberPlan): Promise<void> {
  try {
    const docRef = doc(db, 'members', uid);
    await updateDoc(docRef, {
      plan,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating member plan:', error);
    throw error;
  }
}

// メンバーのロール更新
export async function updateMemberRole(uid: string, role: 'admin' | 'member'): Promise<void> {
  try {
    const docRef = doc(db, 'members', uid);
    await updateDoc(docRef, {
      role,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

// メンバー削除
export async function deleteMember(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'members', uid));
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}