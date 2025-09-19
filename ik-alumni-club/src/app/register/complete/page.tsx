'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormLayout from '@/components/FormLayout';
import StepIndicator from '@/components/register/StepIndicator';
import { useRegistration } from '@/contexts/RegistrationContext';
import { createMember } from '@/lib/firestore/members';

export default function CompletePage() {
  const router = useRouter();
  const { state, resetState } = useRegistration();
  const [isLoading, setIsLoading] = useState(false); // 初期値をfalseに変更
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasSaved, setHasSaved] = useState(false); // 保存済みフラグを追加

  // Firestore保存処理
  useEffect(() => {
    // 既に保存処理を実行済みの場合はスキップ
    if (hasSaved) {
      return;
    }

    // 必要なデータがない場合は最初から
    if (!state.uid || !state.email || !state.profile || !state.selectedPlan) {
      console.error('Missing required data, redirecting to start');
      console.log('Missing details:', {
        uid: state.uid || 'MISSING',
        email: state.email || 'MISSING',
        profile: state.profile || 'MISSING',
        selectedPlan: state.selectedPlan || 'MISSING'
      });
      
      // もしuidとemailはあるがprofileがない場合は、profile入力ページへ
      if (state.uid && state.email && !state.profile) {
        console.log('User exists but profile missing, redirecting to profile page');
        router.push('/register/profile');
        return;
      }
      
      router.push('/register');
      return;
    }

    const saveMemberData = async () => {
      console.log('Complete page - Current state:', {
        uid: state.uid,
        email: state.email,
        profile: state.profile,
        selectedPlan: state.selectedPlan,
        currentStep: state.currentStep
      });

      setIsLoading(true);
      setHasSaved(true); // 保存処理開始をマーク

      try {
        console.log('Saving member data to Firestore...');
        
        // 型安全性のためのチェック（この時点では必ず存在するはずだが念のため）
        if (!state.uid || !state.email || !state.profile || !state.selectedPlan) {
          throw new Error('Required data is missing');
        }
        
        // Firestoreに会員情報を保存
        await createMember(state.uid, {
          email: state.email,
          lastName: state.profile.lastName,
          firstName: state.profile.firstName,
          lastNameKana: state.profile.lastNameKana,
          firstNameKana: state.profile.firstNameKana,
          postalCode: state.profile.postalCode,
          prefecture: state.profile.prefecture,
          city: state.profile.city,
          address: state.profile.address,
          building: state.profile.building,
          phoneNumber: state.profile.phoneNumber,
          plan: state.selectedPlan,
        });

        console.log('Member data saved successfully');
        setIsSuccess(true);
        setIsLoading(false);
        
        // 登録フローの状態をリセット（ダッシュボードへのリダイレクト後に実行）
        setTimeout(() => {
          resetState();
        }, 11000); // カウントダウン完了後+1秒でリセット

      } catch (err) {
        console.error('Registration error:', err);
        setError('登録処理中にエラーが発生しました。お手数ですが、もう一度お試しください。');
        setIsLoading(false);
      }
    };

    saveMemberData();
  }, [state.uid, state.email, state.profile, state.selectedPlan, hasSaved, router, resetState]); // 必要な依存関係を追加

  // カウントダウンとリダイレクト
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      router.push('/dashboard');
    }
  }, [isSuccess, countdown, router]);

  // エラー時のリトライ
  const handleRetry = () => {
    router.push('/register/confirm');
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <FormLayout
        title="登録処理中"
        description="会員情報を登録しています"
      >
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            会員情報を登録しています。しばらくお待ちください...
          </p>
        </div>
      </FormLayout>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <FormLayout
        title="登録エラー"
        description="登録処理中にエラーが発生しました"
      >
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            登録処理中にエラーが発生しました
          </h3>
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              前の画面に戻る
            </button>
            <Link
              href="/contact"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </FormLayout>
    );
  }

  // 成功時の表示
  return (
    <FormLayout
      title="会員登録完了"
      description="IK ALUMNI CGT サポーターズクラブへようこそ"
    >
      <div className="max-w-2xl mx-auto">
        {/* ステップインジケーター */}
        <StepIndicator currentStep={6} />

        <div className="text-center py-12">
          {/* 成功アイコン */}
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* メッセージ */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            会員登録が完了しました
          </h3>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              IK ALUMNI CGT サポーターズクラブへのご入会、誠にありがとうございます。
            </p>
            <p className="text-gray-600">
              ご登録いただいたメールアドレス宛に、登録完了のお知らせをお送りしました。
            </p>
          </div>

          {/* 会員情報サマリー */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h4 className="font-semibold text-gray-900 mb-4">登録情報</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">お名前</span>
                <span className="text-gray-900 font-medium">
                  {state.profile ? `${state.profile.lastName} ${state.profile.firstName} 様` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">メールアドレス</span>
                <span className="text-gray-900">{state.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">会員種別</span>
                <span className="text-gray-900">
                  {state.selectedPlan === 'platinum_individual' && 'プラチナ会員（個人）'}
                  {state.selectedPlan === 'platinum_business' && 'プラチナ会員（法人）'}
                  {state.selectedPlan === 'business' && '法人会員'}
                  {state.selectedPlan === 'individual' && '個人会員'}
                </span>
              </div>
            </div>
          </div>

          {/* 次のステップ */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-2">今後のご利用について</h4>
            <ul className="text-sm text-blue-800 space-y-2 text-left">
              <li>• ダッシュボードから会員限定コンテンツをご覧いただけます</li>
              <li>• プロフィール設定から会員情報の変更が可能です</li>
              <li>• 会費のお支払い方法については、別途ご案内いたします</li>
            </ul>
          </div>

          {/* 自動リダイレクトの案内 */}
          <p className="text-sm text-gray-500 mb-8">
            {countdown}秒後に自動的にダッシュボードへ移動します
          </p>

          {/* ボタン */}
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              ダッシュボードへ進む
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              トップページへ
            </Link>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}