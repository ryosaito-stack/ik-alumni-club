import { 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Member, MemberPlan } from '@/types';

// メンバー情報を作成または更新
export async function createMember(
  uid: string,
  data: {
    email: string;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    postalCode: string;
    prefecture: string;
    city: string;
    address: string;
    building?: string;
    phoneNumber: string;
    plan: MemberPlan;
  }
): Promise<void> {
  try {
    const memberData: Omit<Member, 'createdAt' | 'updatedAt'> = {
      uid,
      email: data.email,
      lastName: data.lastName,
      firstName: data.firstName,
      lastNameKana: data.lastNameKana,
      firstNameKana: data.firstNameKana,
      postalCode: data.postalCode,
      prefecture: data.prefecture,
      city: data.city,
      address: data.address,
      building: data.building || '',
      phoneNumber: data.phoneNumber,
      plan: data.plan,
      role: 'member', // デフォルトは一般会員
      isActive: true, // アカウントを有効化
    };

    // 既存のドキュメントを確認
    const docRef = doc(db, 'users', uid);
    console.log('Checking for existing document for uid:', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 既存のドキュメントがある場合は更新（createdAtは保持）
      console.log('Existing document found, updating...');
      const updateData = {
        ...memberData,
        updatedAt: serverTimestamp(),
      };
      console.log('Update data:', updateData);
      await updateDoc(docRef, updateData);
      console.log('Member updated successfully:', uid);
    } else {
      // 新規作成の場合
      console.log('No existing document, creating new...');
      const newData = {
        ...memberData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      console.log('New document data:', newData);
      await setDoc(docRef, newData);
      console.log('Member created successfully:', uid);
    }
  } catch (error) {
    console.error('Error creating/updating member:', error);
    throw new Error('会員情報の登録に失敗しました');
  }
}

// メンバー情報を取得
export async function getMember(uid: string): Promise<Member | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Member;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting member:', error);
    throw new Error('会員情報の取得に失敗しました');
  }
}

// メンバー情報を更新
export async function updateMember(
  uid: string,
  data: Partial<Omit<Member, 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log('Member updated successfully:', uid);
  } catch (error) {
    console.error('Error updating member:', error);
    throw new Error('会員情報の更新に失敗しました');
  }
}