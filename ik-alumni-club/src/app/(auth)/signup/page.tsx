'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="flex-grow" style={{ paddingTop: '180px', paddingBottom: '80px' }}>
        <section className="max-w-4xl mx-auto px-4">
          {/* ロゴ・タイトル部分 */}
          <div className="text-center mb-10">
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-800">IK Alumni Club</span>
            </div>
            <div>
              <span className="text-lg text-gray-600">IK Alumni Club Official Site</span>
            </div>
          </div>

          {/* リード文 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10 text-center">
            <p className="text-gray-700 leading-relaxed">
              IK Alumni Club 公式ファンクラブ「IK会員倶楽部」は、イベントチケットの最速先行受付やメンバーブログなどの限定コンテンツをお楽しみいただけるサービスです。
            </p>
          </div>

          {/* サービス内容 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">SERVICE</h2>
            <div className="flex justify-center gap-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5,7h2v10H5V7z M1,10h2v4H1V10z M9,2h2v18H9V2z M13,4h2v18h-2V4z M17,7h2v10h-2V7z M21,10h2v4h-2V10z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">RADIO</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5,19h1.4l9.3-9.3l-1.4-1.4L5,17.6V19z M21,21H3v-4.2L16.4,3.3c0.4-0.4,1-0.4,1.4,0l2.8,2.8c0.4,0.4,0.4,1,0,1.4L9.2,19H21V21z M15.7,6.9l1.4,1.4l1.4-1.4l-1.4-1.4C17.1,5.4,15.7,6.9,15.7,6.9z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Blog (Trial)</p>
              </div>
            </div>
          </div>

          {/* 会費 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-10">
            <h3 className="text-lg font-bold mb-4 text-gray-800">会費</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium w-24">月額</th>
                  <td className="py-3 text-gray-700">
                    <p className="text-lg font-bold text-indigo-600">無料会員：0円（税込）</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 推奨環境 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">推奨環境</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-32">OS</th>
                  <td className="py-3 text-gray-600">
                    <ul className="space-y-1">
                      <li>・iOSの場合、iOS15.0以上</li>
                      <li>・Androidの場合、8.0以上</li>
                      <li>・Windowsの場合、Windows10以上</li>
                      <li>・Mac OS Xの場合、macOS 10.12以上</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th className="text-left py-3 pr-4 text-gray-700 font-medium align-top w-32">ブラウザ</th>
                  <td className="py-3 text-gray-600">
                    <ul className="space-y-1">
                      <li>・iOSの場合、Safariの最新版</li>
                      <li>・Androidの場合、Chromeの最新版</li>
                      <li>・Windowsの場合、Microsoft Edge、Chromeの最新版</li>
                      <li>・Mac OS Xの場合、SafariまたはChromeの最新版</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>※当サイトはタブレット端末からのご利用は動作推奨しておりません。<br />
              なお、ガラホ（テンキーの付いたスマートフォン）、らくらくスマートフォンにつきましては動作非対応となります。</li>
              <li>※「mail.ikalumni.com」からのドメインを受信可能な設定にしてください。</li>
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
            <p className="mt-4 text-sm text-gray-500">
              ※ご登録にはIK Alumni IDが必要となります。<br />
              <Link href="/faq" className="text-indigo-600 hover:underline">IK Alumni IDとは？</Link>
            </p>
          </div>
        </section>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}