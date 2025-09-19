'use client';

import { useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Member, MemberPlan, AuthFormData } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          const memberDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (memberDoc.exists()) {
            setMember(memberDoc.data() as Member);
          } else {
            // Firestoreにメンバー情報が存在しない場合は作成する
            console.log('Creating member document for existing auth user:', firebaseUser.email);
            const memberData: Partial<Member> = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              plan: 'individual', // デフォルトプラン
              isActive: false, // 登録時は非アクティブ
              createdAt: new Date(),
              updatedAt: new Date(),
              // デフォルト値を設定（仮登録時用）
              lastName: '',
              firstName: '',
              lastNameKana: '',
              firstNameKana: '',
              postalCode: '',
              prefecture: '',
              city: '',
              address: '',
              phoneNumber: ''
            };
            
            // テストユーザーのプラン設定
            const testUserPlans: Record<string, { plan: MemberPlan; role?: 'admin' | 'member' }> = {
              'admin@example.com': { plan: 'platinum_business', role: 'admin' },
              'platinum-individual@example.com': { plan: 'platinum_individual', role: 'member' },
              'platinum-business@example.com': { plan: 'platinum_business', role: 'member' },
              'business@example.com': { plan: 'business', role: 'member' },
              'individual@example.com': { plan: 'individual', role: 'member' },
              'test1@example.com': { plan: 'individual', role: 'member' },
              'test2@example.com': { plan: 'business', role: 'member' },
              'test3@example.com': { plan: 'platinum_individual', role: 'member' },
            };
            
            if (firebaseUser.email && testUserPlans[firebaseUser.email]) {
              const userConfig = testUserPlans[firebaseUser.email];
              memberData.plan = userConfig.plan;
              memberData.role = userConfig.role;
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), memberData);
            setMember(memberData as Member);
          }
        } catch (err) {
          console.error('Failed to fetch/create member data:', err);
        }
      } else {
        setUser(null);
        setMember(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 注意: signup関数は仮登録用。正式な会員登録は別途フォームで必要情報を全て収集
  const signup = async (data: AuthFormData, plan: MemberPlan = 'individual') => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (data.displayName) {
        await updateProfile(userCredential.user, {
          displayName: data.displayName
        });
      }

      // 仮登録用の最小限のデータ
      const memberData: Partial<Member> = {
        uid: userCredential.user.uid,
        email: data.email,
        plan: plan,
        isActive: false, // 新規登録時は非アクティブ（管理者の承認が必要）
        createdAt: new Date(),
        updatedAt: new Date(),
        // 仮登録時のデフォルト値
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        postalCode: '',
        prefecture: '',
        city: '',
        address: '',
        phoneNumber: ''
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), memberData);
      setMember(memberData as Member);

      return userCredential.user;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMember(null);
    } catch (err: any) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  return {
    user,
    member,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: member?.role === 'admin'
  };
};

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email format';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/network-request-failed':
      return 'Network error occurred';
    default:
      return 'Authentication error occurred';
  }
};