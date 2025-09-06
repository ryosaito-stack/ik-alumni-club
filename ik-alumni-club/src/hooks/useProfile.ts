'use client';

import { useState } from 'react';
import { updateMemberProfile } from '@/lib/firestore';
import { Member } from '@/types';
import { messages } from '@/constants/messages';

export interface ProfileFormData {
  displayName: string;
  bio: string;
  company: string;
  position: string;
  graduationYear: string;
  major: string;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = async (uid: string, data: ProfileFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // バリデーション
      if (!data.displayName || data.displayName.trim() === '') {
        throw new Error('表示名は必須です');
      }

      if (data.graduationYear && !/^\d{4}$/.test(data.graduationYear)) {
        throw new Error('卒業年度は4桁の数字で入力してください');
      }

      // 空文字をundefinedに変換（Firestoreに空文字を保存しない）
      const cleanedData: Partial<Member> = {
        displayName: data.displayName.trim(),
        bio: data.bio.trim() || undefined,
        company: data.company.trim() || undefined,
        position: data.position.trim() || undefined,
        graduationYear: data.graduationYear.trim() || undefined,
        major: data.major.trim() || undefined,
      };

      await updateMemberProfile(uid, cleanedData);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // 3秒後に成功メッセージを消す
      
      return true;
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || messages.profile.profileUpdateError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    updateProfile,
    loading,
    error,
    success,
    clearMessages,
  };
}