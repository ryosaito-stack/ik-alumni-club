'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormLayout from '@/components/FormLayout';
import StepIndicator from '@/components/register/StepIndicator';
import { useRegistration } from '@/contexts/RegistrationContext';

export default function TermsPage() {
  const router = useRouter();
  const { state, updateState, nextStep } = useRegistration();
  const [agreed, setAgreed] = useState(state.termsAccepted);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  // 利用規約のスクロールチェック
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToEnd = 
      Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    if (scrolledToEnd) {
      setScrolledToBottom(true);
    }
  };

  // 次へ進む処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      alert('利用規約に同意してください。');
      return;
    }

    // 状態を更新
    updateState({
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    });
    
    // 次のステップへ
    nextStep();
    router.push('/register/auth');
  };

  return (
    <FormLayout
      title="利用規約への同意"
      description="IK ALUMNI CGT サポーターズクラブの利用規約をご確認の上、同意してください。"
    >
      <div className="max-w-2xl mx-auto">
        {/* ステップインジケーター */}
        <StepIndicator currentStep={state.currentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 利用規約本文 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div 
              className="h-96 overflow-y-auto px-4 py-2 text-sm text-gray-700 leading-relaxed"
              onScroll={handleScroll}
            >
              <h3 className="font-bold text-base mb-4">IK ALUMNI CGT サポーターズクラブ 利用規約</h3>
              
              <div className="space-y-4">
                <section>
                  <h4 className="font-semibold mb-2">第1条（目的）</h4>
                  <p>本規約は、IK ALUMNI CGT（以下「当団体」といいます）が運営するサポーターズクラブ（以下「本サービス」といいます）の利用条件を定めるものです。会員の皆様には、本規約に従って本サービスをご利用いただきます。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第2条（会員登録）</h4>
                  <p>1. 本サービスの利用を希望する方は、当団体の定める方法によって会員登録を申請し、当団体がこれを承認することによって、会員登録が完了するものとします。</p>
                  <p>2. 当団体は、以下の場合には、会員登録の申請を承認しないことがあります。</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>登録申請内容に虚偽の事項が含まれている場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当団体が会員登録を相当でないと判断した場合</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第3条（会員種別と特典）</h4>
                  <p>1. 本サービスには以下の会員種別があります。</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>プラチナ会員（個人）</li>
                    <li>プラチナ会員（法人）</li>
                    <li>法人会員</li>
                    <li>個人会員</li>
                  </ul>
                  <p>2. 各会員種別に応じて、当団体が定める特典を受けることができます。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第4条（会費）</h4>
                  <p>1. 会員は、会員種別に応じて当団体が定める会費を支払うものとします。</p>
                  <p>2. 支払われた会費は、理由の如何を問わず返金いたしません。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第5条（個人情報の取扱い）</h4>
                  <p>当団体は、会員の個人情報を、当団体のプライバシーポリシーに従って適切に取り扱います。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第6条（禁止事項）</h4>
                  <p>会員は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>当団体のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                    <li>当団体のサービスの運営を妨害するおそれのある行為</li>
                    <li>他の会員に関する個人情報等を収集または蓄積する行為</li>
                    <li>他の会員に成りすます行為</li>
                    <li>当団体のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                    <li>その他、当団体が不適切と判断する行為</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第7条（本サービスの提供の停止等）</h4>
                  <p>当団体は、以下のいずれかの事由があると判断した場合、会員に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、当団体が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第8条（退会）</h4>
                  <p>会員は、当団体の定める手続きにより、本サービスから退会できるものとします。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第9条（免責事項）</h4>
                  <p>1. 当団体は、本サービスに関して、会員と他の会員または第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</p>
                  <p>2. 当団体は、本サービスの提供の停止または中断により、会員または第三者が被ったいかなる損害についても、一切の責任を負いません。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第10条（規約の変更）</h4>
                  <p>当団体は、必要と判断した場合には、会員に通知することなくいつでも本規約を変更することができるものとします。</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">第11条（準拠法・裁判管轄）</h4>
                  <p>1. 本規約の解釈にあたっては、日本法を準拠法とします。</p>
                  <p>2. 本サービスに関して紛争が生じた場合には、当団体の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>
                </section>

                <div className="mt-8 pt-4 border-t">
                  <p className="text-right">制定日：2025年1月1日</p>
                  <p className="text-right">IK ALUMNI CGT</p>
                </div>
              </div>
            </div>
            
            {!scrolledToBottom && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                ↓ 最後までスクロールしてください
              </p>
            )}
          </div>

          {/* 同意チェックボックス */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={!scrolledToBottom}
                className="mt-1 mr-3 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500 disabled:opacity-50"
              />
              <span className={`text-sm ${!scrolledToBottom ? 'text-gray-400' : 'text-gray-700'}`}>
                利用規約を最後まで読み、内容を理解した上で同意します
              </span>
            </label>
          </div>

          {/* ボタン */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              戻る
            </button>
            
            <button
              type="submit"
              disabled={!agreed || !scrolledToBottom}
              className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              同意して次へ進む
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}