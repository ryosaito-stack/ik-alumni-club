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
          const memberDoc = await getDoc(doc(db, 'members', firebaseUser.uid));
          if (memberDoc.exists()) {
            setMember(memberDoc.data() as Member);
          } else {
            // Firestoreにメンバー情報が存在しない場合は作成する
            console.log('Creating member document for existing auth user:', firebaseUser.email);
            const memberData: Member = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              plan: 'individual', // デフォルトプラン
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            // テストユーザーのプラン設定
            const testUserPlans: Record<string, { plan: MemberPlan; role?: 'admin' | 'member' }> = {
              'admin@example.com': { plan: 'platinum', role: 'admin' },
              'platinum@example.com': { plan: 'platinum', role: 'member' },
              'business@example.com': { plan: 'business', role: 'member' },
              'individual@example.com': { plan: 'individual', role: 'member' },
              'test1@example.com': { plan: 'individual', role: 'member' },
              'test2@example.com': { plan: 'business', role: 'member' },
              'test3@example.com': { plan: 'platinum', role: 'member' },
            };
            
            if (firebaseUser.email && testUserPlans[firebaseUser.email]) {
              const userConfig = testUserPlans[firebaseUser.email];
              memberData.plan = userConfig.plan;
              memberData.role = userConfig.role;
            }
            
            await setDoc(doc(db, 'members', firebaseUser.uid), memberData);
            setMember(memberData);
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

      const memberData: Member = {
        uid: userCredential.user.uid,
        email: data.email,
        displayName: data.displayName || '',
        plan: plan,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'members', userCredential.user.uid), memberData);
      setMember(memberData);

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