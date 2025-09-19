'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FormLayout from '@/components/FormLayout';
import StepIndicator from '@/components/register/StepIndicator';
import { useRegistration } from '@/contexts/RegistrationContext';
import { MemberPlan } from '@/types';

// メインプラン情報
const MAIN_PLANS = [
  {
    id: 'individual',
    name: '個人会員',
    image: '/images/member/kojin.png'
  },
  {
    id: 'business',
    name: '法人会員',
    image: '/images/member/houjin.png'
  },
  {
    id: 'platinum',
    name: 'プラチナ会員',
    image: '/images/member/puratina.png',
    recommended: true
  }
];


export default function PlanPage() {
  const router = useRouter();
  const { state, updateState, nextStep, prevStep } = useRegistration();
  const [selectedMainPlan, setSelectedMainPlan] = useState<string>('');
  const [selectedPlatinumType, setSelectedPlatinumType] = useState<string>('');
  const [finalPlan, setFinalPlan] = useState<MemberPlan | null>(state.selectedPlan || null);

  // 認証チェック
  useEffect(() => {
    // uidが存在しない場合のみリダイレクト
    // profileは後から読み込まれる可能性があるため、ここではチェックしない
    if (!state.uid) {
      console.log('Plan page - No uid found, redirecting to auth');
      router.push('/register/auth');
    } else {
      console.log('Plan page - State loaded:', {
        uid: state.uid,
        email: state.email,
        hasProfile: !!state.profile,
        profile: state.profile,
        selectedPlan: state.selectedPlan
      });
    }
  }, [state.uid, router]);

  // 初期値設定
  useEffect(() => {
    if (state.selectedPlan) {
      if (state.selectedPlan === 'platinum_individual' || state.selectedPlan === 'platinum_business') {
        setSelectedMainPlan('platinum');
        setSelectedPlatinumType(state.selectedPlan);
        setFinalPlan(state.selectedPlan);
      } else {
        setSelectedMainPlan(state.selectedPlan);
        setFinalPlan(state.selectedPlan);
      }
    }
  }, [state.selectedPlan]);

  // メインプラン選択
  const handleSelectMainPlan = (planId: string) => {
    setSelectedMainPlan(planId);
    setSelectedPlatinumType('');
    
    if (planId === 'individual' || planId === 'business') {
      setFinalPlan(planId as MemberPlan);
    } else {
      setFinalPlan(null);
    }
  };

  // プラチナタイプ選択
  const handleSelectPlatinumType = (typeId: string) => {
    setSelectedPlatinumType(typeId);
    setFinalPlan(typeId as MemberPlan);
  };

  // フォーム送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!finalPlan) {
      alert('会員種別を選択してください');
      return;
    }

    if (selectedMainPlan === 'platinum' && !selectedPlatinumType) {
      alert('プラチナ会員の種別（個人/法人）を選択してください');
      return;
    }

    // profileが存在するかチェック
    if (!state.profile) {
      alert('基本情報が未入力です。前のステップに戻って入力してください。');
      router.push('/register/profile');
      return;
    }

    console.log('Plan page - Submitting with plan:', finalPlan);
    console.log('Plan page - Current profile:', state.profile);

    // Contextに保存
    updateState({
      selectedPlan: finalPlan
    });

    // 次のステップへ
    nextStep();
    router.push('/register/confirm');
  };

  // 前のステップに戻る
  const handleBack = () => {
    prevStep();
    router.push('/register/profile');
  };

  return (
    <FormLayout
      title="会員種別の選択"
      description="ご希望の会員プランをお選びください"
    >
      <div className="max-w-4xl mx-auto">
        {/* ステップインジケーター */}
        <StepIndicator currentStep={state.currentStep} />

        <form onSubmit={handleSubmit}>
          {/* メインプラン選択（画像のみ） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {MAIN_PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleSelectMainPlan(plan.id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedMainPlan === plan.id
                    ? 'transform scale-105'
                    : 'hover:transform hover:scale-105'
                }`}
              >
                {/* おすすめバッジ */}
                {plan.recommended && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 text-xs font-bold rounded-full z-10">
                    おすすめ
                  </div>
                )}

                {/* 画像 */}
                <div className="relative h-64">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* 選択インジケーター */}
                {selectedMainPlan === plan.id && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-rose-500 text-white rounded-full p-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* プラチナ会員の種別選択 */}
          {selectedMainPlan === 'platinum' && (
            <div className="mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-4 text-center">
                  プラチナ会員の種別を選択してください
                </h4>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectPlatinumType('platinum_individual')}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      selectedPlatinumType === 'platinum_individual'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-500'
                    }`}
                  >
                    個人
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPlatinumType('platinum_business')}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      selectedPlatinumType === 'platinum_business'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-500'
                    }`}
                  >
                    法人
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 注意事項 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-amber-900 mb-2">ご注意事項</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• 会費は毎月自動更新となります</li>
              <li>• プラン変更は翌月から適用されます</li>
              <li>• 法人会員の場合は、別途法人情報の登録が必要です</li>
            </ul>
          </div>

          {/* ボタン */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              戻る
            </button>
            
            <button
              type="submit"
              disabled={!finalPlan}
              className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ進む
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}