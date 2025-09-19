'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormLayout from '@/components/FormLayout';
import StepIndicator from '@/components/register/StepIndicator';
import { useRegistration } from '@/contexts/RegistrationContext';

// プラン名のマッピング
const PLAN_NAMES = {
  'platinum_individual': 'プラチナ会員（個人）',
  'platinum_business': 'プラチナ会員（法人）',
  'business': '法人会員',
  'individual': '個人会員'
};

export default function ConfirmPage() {
  const router = useRouter();
  const { state, nextStep, prevStep } = useRegistration();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // 認証チェック
  useEffect(() => {
    console.log('Confirm page - Checking state:', {
      uid: state.uid,
      hasProfile: !!state.profile,
      selectedPlan: state.selectedPlan
    });
    
    if (!state.uid) {
      console.log('Confirm page - No uid, redirecting to register');
      router.push('/register');
    } else if (!state.profile) {
      console.log('Confirm page - No profile, redirecting to profile page');
      router.push('/register/profile');
    } else if (!state.selectedPlan) {
      console.log('Confirm page - No plan selected, redirecting to plan page');
      router.push('/register/plan');
    }
  }, [state.uid, state.profile, state.selectedPlan, router]);

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmed) {
      alert('入力内容を確認し、チェックボックスにチェックを入れてください');
      return;
    }

    setIsLoading(true);

    // 次のステップへ（登録処理は次のページで実行）
    nextStep();
    router.push('/register/complete');
  };

  // 前のステップに戻る
  const handleBack = () => {
    prevStep();
    router.push('/register/plan');
  };

  // 編集ボタンのハンドラー
  const handleEdit = (step: string) => {
    switch (step) {
      case 'auth':
        router.push('/register/auth');
        break;
      case 'profile':
        router.push('/register/profile');
        break;
      case 'plan':
        router.push('/register/plan');
        break;
    }
  };

  if (!state.profile || !state.selectedPlan) {
    return null;
  }

  return (
    <FormLayout
      title="入力内容の確認"
      description="以下の内容で登録を進めてよろしいですか？"
    >
      <div className="max-w-3xl mx-auto">
        {/* ステップインジケーター */}
        <StepIndicator currentStep={state.currentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* アカウント情報 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">アカウント情報</h3>
              <button
                type="button"
                onClick={() => handleEdit('auth')}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                編集
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">メールアドレス</div>
                <div className="col-span-2 text-sm text-gray-900">{state.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">パスワード</div>
                <div className="col-span-2 text-sm text-gray-900">••••••••</div>
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">基本情報</h3>
              <button
                type="button"
                onClick={() => handleEdit('profile')}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                編集
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">お名前</div>
                <div className="col-span-2 text-sm text-gray-900">
                  {state.profile.lastName} {state.profile.firstName}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">フリガナ</div>
                <div className="col-span-2 text-sm text-gray-900">
                  {state.profile.lastNameKana} {state.profile.firstNameKana}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">郵便番号</div>
                <div className="col-span-2 text-sm text-gray-900">
                  〒{state.profile.postalCode}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">住所</div>
                <div className="col-span-2 text-sm text-gray-900">
                  {state.profile.prefecture}
                  {state.profile.city}
                  {state.profile.address}
                  {state.profile.building && (
                    <span className="block">{state.profile.building}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">電話番号</div>
                <div className="col-span-2 text-sm text-gray-900">
                  {state.profile.phoneNumber}
                </div>
              </div>
            </div>
          </div>

          {/* 会員種別 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">会員種別</h3>
              <button
                type="button"
                onClick={() => handleEdit('plan')}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                編集
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">選択プラン</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                    {PLAN_NAMES[state.selectedPlan]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 確認チェックボックス */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <div className="text-sm text-gray-700">
                <p>入力内容に間違いがないことを確認しました。</p>
                <p className="mt-1">利用規約に同意の上、会員登録を完了します。</p>
              </div>
            </label>
          </div>

          {/* 注意事項 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">ご注意</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• 登録完了後、メールアドレスの変更はできません</li>
              <li>• 会員情報はマイページから変更可能です</li>
              <li>• 会費の請求は登録完了後から開始されます</li>
            </ul>
          </div>

          {/* ボタン */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              戻る
            </button>
            
            <button
              type="submit"
              disabled={!confirmed || isLoading}
              className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登録中...' : '登録を完了する'}
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}