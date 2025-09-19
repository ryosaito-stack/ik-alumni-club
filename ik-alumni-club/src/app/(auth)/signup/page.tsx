'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BenefitsAccordion from '@/components/BenefitsAccordion';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="flex-grow" style={{ paddingTop: '180px', paddingBottom: '80px' }}>
        <section className="max-w-4xl mx-auto px-4">
          {/* ヒーロー画像 */}
          <div className="mb-10">
            <img 
              src="/images/top_supporter's.jpg" 
              alt="IK ALUMNI COLOR GUARD TEAM SUPPORTER'S CLUB"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          {/* リード文 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10">
            <p className="text-gray-700 leading-relaxed mb-3">
              IK ALUMNI CGT supporter's CLUB とは、千葉県柏市を拠点に活動している「IK ALUMNI CGT」の後援会です。
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              本後援会は、年間を通してIK ALUMNI CGTの活動支援とともに、地元柏の地域活性化やカラーガードの普及活動に寄与する事を目的としています。
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              後援会特典は、「会員限定グッズ」「コンサート映像の配信」「会員ページ限定コンテンツ」「会報の配信」などなど！
            </p>
            <p className="text-gray-700 leading-relaxed font-bold text-center">
              皆様のご入会お待ちしております！
            </p>
          </div>

          {/* 会員種別 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">会員種別</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <img 
                  src="/images/member/kojin.png" 
                  alt="個人会員" 
                  className="w-full h-auto"
                />
              </div>
              <div className="text-center">
                <img 
                  src="/images/member/houjin.png" 
                  alt="法人会員" 
                  className="w-full h-auto"
                />
              </div>
              <div className="text-center transform scale-107">
                <img 
                  src="/images/member/puratina.png" 
                  alt="プラチナ会員" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* 特典一覧 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">特典一覧</h3>
            <div className="w-full">
              <img 
                src="/images/tokuten.jpg" 
                alt="特典一覧" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* 各特典詳細 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">各特典詳細</h3>
            <BenefitsAccordion />
          </div>

          {/* 入会スケジュール */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">入会スケジュール</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">募集期間</th>
                  <td className="py-3 text-gray-600">
                    <p>通年募集</p>
                    <p className="text-sm text-gray-500 mt-1">※いつでもご入会いただけます</p>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">会員期間</th>
                  <td className="py-3 text-gray-600">
                    <p>入会日から1年間</p>
                    <p className="text-sm text-gray-500 mt-1">※自動更新となります</p>
                  </td>
                </tr>
                <tr>
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">入会手続き</th>
                  <td className="py-3 text-gray-600">
                    <ul className="space-y-1">
                      <li>1. オンラインフォームからお申し込み</li>
                      <li>2. お支払い手続き</li>
                      <li>3. 会員登録完了メール受信</li>
                      <li>4. 会員サイトへログイン可能</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* お支払い方法 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">お支払い方法</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">決済方法</th>
                  <td className="py-3 text-gray-600">
                    <ul className="space-y-1">
                      <li>・銀行振込</li>
                    </ul>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">支払いサイクル</th>
                  <td className="py-3 text-gray-600">
                    <p>年払い（一括）</p>
                    <p className="text-sm text-gray-500 mt-1">※分割払いは承っておりません</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 特典の配送時期について */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">特典の配送時期について</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">会員限定グッズ</th>
                  <td className="py-3 text-gray-600">
                    <p>入会後1ヶ月以内に発送</p>
                    <p className="text-sm text-gray-500 mt-1">※在庫状況により遅れる場合があります</p>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">デジタルコンテンツ</th>
                  <td className="py-3 text-gray-600">
                    <p>入会手続き完了後、即時利用可能</p>
                    <p className="text-sm text-gray-500 mt-1">※会員サイトからアクセスいただけます</p>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">会報</th>
                  <td className="py-3 text-gray-600">
                    <p>毎月月末に配信</p>
                    <p className="text-sm text-gray-500 mt-1">※メールまたは会員サイトでご確認いただけます</p>
                  </td>
                </tr>
                <tr>
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-40">プラチナ会員<br />限定ウェア</th>
                  <td className="py-3 text-gray-600">
                    <p>入会後2ヶ月以内に発送</p>
                    <p className="text-sm text-gray-500 mt-1">※サイズ確認のご連絡をさせていただきます</p>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>※配送先は日本国内に限らせていただきます。</li>
              <li>※配送状況はマイページからご確認いただけます。</li>
            </ul>
          </div>

          {/* 登録ボタン */}
          <div className="text-center">
            <Link 
              href="/register"
              className="inline-block px-12 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg"
            >
              登録手続きに進む
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}