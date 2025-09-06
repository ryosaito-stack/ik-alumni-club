'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <>
      {/* フッター本体 */}
      <footer className="bg-white text-gray-800" style={{ minHeight: '200px', paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            {/* SNSアイコン */}
            <div className="flex justify-center gap-6 mb-8">
              {[
                { name: 'X', icon: '/images/icons8-x-50.png', url: '#' },
                { name: 'Instagram', icon: '/images/icons8-instagram-50.png', url: '#' },
                { name: 'YouTube', icon: '/images/icons8-youtube-50.png', url: '#' },
                { name: 'TikTok', icon: '/images/icons8-tiktok-50.png', url: '#' }
              ].map((sns) => (
                <a
                  key={sns.name}
                  href={sns.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all hover:scale-110"
                  aria-label={sns.name}
                >
                  <Image
                    src={sns.icon}
                    alt={sns.name}
                    width={32}
                    height={32}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>

            {/* SUPPORTセクション */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">プライバシーポリシー</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">会員規約</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">特定商取引法に関する表記</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">支払時期 / 解約方法について</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">推奨環境</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">ヘルプ / お問い合わせ</a>
                <Link href="/signup" className="text-gray-600 hover:text-gray-900 transition-colors">無料会員登録</Link>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">ログイン</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* コピーライト - フッターとは別の独立した要素 */}
      <div className="bg-white py-4 text-center">
        <p className="text-gray-500 text-sm">
          <small>© IK Alumni Club, <a href="#" className="hover:text-gray-900 transition-colors">Claude Code</a>
          <br /><em>Powered by Next.js</em></small>
        </p>
      </div>
    </>
  );
}