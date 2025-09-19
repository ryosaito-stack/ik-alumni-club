'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MemberPlan } from '@/types';

// 登録フローで管理する状態の型定義
interface RegistrationState {
  // Step1: 利用規約
  termsAccepted: boolean;
  termsAcceptedAt?: Date;
  
  // Step2: Firebase Auth後に取得
  uid?: string;
  email?: string;
  password?: string; // 一時的に保持（確認画面表示用）
  
  // Step3: 基本情報
  profile?: {
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
  };
  
  // Step4: 会員種別
  selectedPlan?: MemberPlan;
  
  // 全体管理
  currentStep: number;
  isLoading: boolean;
  errors: Record<string, string>;
}

// Contextの型定義
interface RegistrationContextType {
  state: RegistrationState;
  updateState: (updates: Partial<RegistrationState>) => void;
  setError: (field: string, message: string) => void;
  clearErrors: () => void;
  resetState: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

// 初期状態
const initialState: RegistrationState = {
  termsAccepted: false,
  currentStep: 1,
  isLoading: false,
  errors: {},
};

// Context作成
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Provider コンポーネント
export function RegistrationProvider({ children }: { children: ReactNode }) {
  // LocalStorageから初期状態を読み込み
  const [state, setState] = useState<RegistrationState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('registrationState');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // 日付を復元
          if (parsed.termsAcceptedAt) {
            parsed.termsAcceptedAt = new Date(parsed.termsAcceptedAt);
          }
          return { ...initialState, ...parsed };
        } catch (e) {
          console.error('Failed to parse saved registration state:', e);
        }
      }
    }
    return initialState;
  });

  // 状態が変更されたらLocalStorageに保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('registrationState', JSON.stringify(state));
      console.log('Registration state saved:', state);
    }
  }, [state]);

  // 状態更新関数
  const updateState = (updates: Partial<RegistrationState>) => {
    console.log('Updating registration state:', updates);
    setState(prev => ({ ...prev, ...updates }));
  };

  // エラー設定
  const setError = (field: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: message }
    }));
  };

  // エラークリア
  const clearErrors = () => {
    setState(prev => ({ ...prev, errors: {} }));
  };

  // 状態リセット
  const resetState = () => {
    setState(initialState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('registrationState');
      console.log('Registration state cleared');
    }
  };

  // 次のステップへ
  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  // 前のステップへ
  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  return (
    <RegistrationContext.Provider
      value={{
        state,
        updateState,
        setError,
        clearErrors,
        resetState,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

// カスタムフック
export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}