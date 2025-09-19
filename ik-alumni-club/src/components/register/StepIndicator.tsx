'use client';

import { CheckIcon } from '@heroicons/react/24/solid';

interface Step {
  id: number;
  name: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, name: '利用規約', description: '利用規約への同意' },
  { id: 2, name: 'アカウント作成', description: 'メールアドレスとパスワード' },
  { id: 3, name: '基本情報', description: 'お名前とご住所' },
  { id: 4, name: '会員種別', description: 'プランの選択' },
  { id: 5, name: '確認', description: '入力内容の確認' },
  { id: 6, name: '完了', description: '登録完了' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between md:justify-center md:space-x-8">
        {steps.map((step) => (
          <li key={step.id} className="relative">
            {step.id < currentStep ? (
              // 完了したステップ
              <div className="group flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600">
                  <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <span className="mt-2 text-xs font-medium text-gray-900 md:text-sm">
                  {step.name}
                </span>
              </div>
            ) : step.id === currentStep ? (
              // 現在のステップ
              <div className="group flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-600 bg-white">
                  <span className="text-rose-600 font-bold">{step.id}</span>
                </span>
                <span className="mt-2 text-xs font-medium text-rose-600 md:text-sm">
                  {step.name}
                </span>
              </div>
            ) : (
              // 未到達のステップ
              <div className="group flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span className="text-gray-500">{step.id}</span>
                </span>
                <span className="mt-2 text-xs font-medium text-gray-500 md:text-sm">
                  {step.name}
                </span>
              </div>
            )}
            
            {/* ステップ間の線（最後のステップ以外） */}
            {step.id !== steps.length && (
              <div
                className={`absolute top-5 left-10 hidden md:block w-full h-0.5 ${
                  step.id < currentStep ? 'bg-rose-600' : 'bg-gray-300'
                }`}
                style={{ width: 'calc(100% + 2rem)' }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}