'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import DetailLayout from '@/components/DetailLayout';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// 仮の会報データ（実際はFirestoreから取得）
const newsletterData: { [key: string]: any } = {
  '1': {
    id: 1,
    title: '2025年8月号 - 夏季特別号',
    description: '夏の全国大会結果報告と秋季活動予定について。チームメンバーからの特別メッセージも掲載。',
    date: '2025.08.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '2.5MB',
    issueNumber: 'Vol.24',
    isPremium: false,
    pdfUrl: '/sample-newsletter.pdf', // 仮のPDFパス
    htmlContent: null,
    sections: [
      { title: 'チーム代表挨拶', page: 2 },
      { title: '夏季全国大会結果報告', page: 4 },
      { title: 'メンバー紹介', page: 8 },
      { title: '秋季活動予定', page: 12 },
      { title: 'サポーターズクラブからのお知らせ', page: 15 },
    ]
  },
  '2': {
    id: 2,
    title: '2025年7月号 - 新メンバー紹介特集',
    description: '新年度のメンバー紹介と意気込み。各セクションリーダーインタビューを掲載しています。',
    date: '2025.07.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '3.1MB',
    issueNumber: 'Vol.23',
    isPremium: false,
    pdfUrl: '/sample-newsletter-2.pdf',
    htmlContent: null,
    sections: [
      { title: '新メンバー紹介', page: 2 },
      { title: 'セクションリーダーインタビュー', page: 6 },
      { title: '練習スケジュール', page: 10 },
      { title: '今月の活動報告', page: 13 },
    ]
  },
  '3': {
    id: 3,
    title: '2025年度 年次報告書',
    description: '2024年度の活動実績と決算報告、2025年度の活動計画と予算案について詳しく説明しています。',
    date: '2025.06.30',
    category: '年次報告',
    format: 'HTML',
    isPremium: true,
    issueNumber: '2025年度版',
    pdfUrl: null,
    htmlContent: `
      <div class="prose prose-lg max-w-none">
        <h2>2024年度 活動実績</h2>
        <p>2024年度は、IK ALUMNI CGTにとって飛躍の年となりました。年間を通じて15回の公演を実施し、延べ5,000人以上の観客の皆様にご覧いただきました。</p>
        
        <h3>主な成果</h3>
        <ul>
          <li>全国大会での銀賞受賞</li>
          <li>地域イベントへの積極的参加（10回）</li>
          <li>新メンバー15名の加入</li>
          <li>サポーターズクラブ会員数200名突破</li>
        </ul>
        
        <h3>決算報告</h3>
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="text-left">項目</th>
              <th class="text-right">予算</th>
              <th class="text-right">実績</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>収入合計</td>
              <td class="text-right">¥3,000,000</td>
              <td class="text-right">¥3,250,000</td>
            </tr>
            <tr>
              <td>支出合計</td>
              <td class="text-right">¥2,800,000</td>
              <td class="text-right">¥2,750,000</td>
            </tr>
            <tr>
              <td>次年度繰越金</td>
              <td class="text-right">¥200,000</td>
              <td class="text-right">¥500,000</td>
            </tr>
          </tbody>
        </table>
        
        <h2>2025年度 活動計画</h2>
        <p>2025年度は「更なる高みへ」をテーマに、技術向上と地域貢献の両立を目指します。</p>
        
        <h3>重点目標</h3>
        <ol>
          <li>全国大会での金賞獲得</li>
          <li>海外遠征の実現（アメリカ・カリフォルニア州）</li>
          <li>ジュニアチームの設立</li>
          <li>サポーターズクラブ会員数300名達成</li>
        </ol>
      </div>
    `,
    sections: []
  },
};

// 関連する会報（仮データ）
const relatedNewsletters = [
  { id: 4, title: '2025年6月号 - 春季大会結果報告', date: '2025.06.15', issueNumber: 'Vol.22' },
  { id: 5, title: '特別号 - 10周年記念誌', date: '2025.05.01', issueNumber: '10th Anniversary' },
  { id: 6, title: '2025年4月号 - 新年度スタート', date: '2025.04.15', issueNumber: 'Vol.21' },
];

export default function NewsletterDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const newsletter = newsletterData[id] || newsletterData['1'];
  
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: relatedRef, isVisible: relatedVisible } = useScrollAnimation({ threshold: 0.1 });

  const breadcrumbs = [
    { label: 'HOME', href: '/' },
    { label: 'NEWSLETTER', href: '/newsletter' },
    { label: newsletter.issueNumber, href: `/newsletter/${id}` },
  ];

  return (
    <DetailLayout
      title={newsletter.title}
      breadcrumbs={breadcrumbs}
      date={newsletter.date}
      category={newsletter.category}
    >
      {/* メインコンテンツ */}
      <div 
        ref={contentRef}
        className={`${contentVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        {/* メタ情報 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {newsletter.issueNumber}
            </span>
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              発行日: {newsletter.date}
            </span>
            {newsletter.format === 'PDF' && newsletter.fileSize && (
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                ファイルサイズ: {newsletter.fileSize}
              </span>
            )}
            {newsletter.isPremium && (
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                会員限定
              </span>
            )}
          </div>
        </div>

        {/* 説明文 */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 leading-relaxed">
            {newsletter.description}
          </p>
        </div>

        {/* PDFビューア or HTMLコンテンツ */}
        {newsletter.format === 'PDF' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            {/* 目次 */}
            {newsletter.sections.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">目次</h3>
                <ul className="space-y-2">
                  {newsletter.sections.map((section: any, index: number) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{section.title}</span>
                      <span className="text-sm text-gray-500">P.{section.page}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* PDFダウンロードボタン */}
            <div className="text-center">
              <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDFをダウンロード
              </button>
              <p className="mt-2 text-sm text-gray-500">
                ※ PDFファイルの閲覧にはAdobe Readerなどが必要です
              </p>
            </div>
            
            {/* PDF埋め込み（仮） */}
            <div className="mt-8 bg-gray-100 rounded-lg p-4">
              <p className="text-center text-gray-500">
                PDFプレビューエリア（実装時はここにPDFビューアを埋め込み）
              </p>
              <div className="mt-4 bg-white rounded h-96 flex items-center justify-center">
                <span className="text-gray-400">PDF Content Preview</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            {/* HTMLコンテンツ */}
            <div dangerouslySetInnerHTML={{ __html: newsletter.htmlContent || '' }} />
          </div>
        )}

        {/* シェアボタン */}
        <div className="flex items-center justify-center gap-4 py-8 border-t border-gray-200">
          <span className="text-gray-600 font-medium">この会報をシェア:</span>
          <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 関連する会報 */}
      <div 
        ref={relatedRef}
        className={`mt-12 ${relatedVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">関連する会報</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedNewsletters.map((item) => (
            <Link
              key={item.id}
              href={`/newsletter/${item.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-sm text-indigo-600 font-medium mb-2">{item.issueNumber}</div>
              <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
              <time className="text-sm text-gray-500">{item.date}</time>
            </Link>
          ))}
        </div>
      </div>
    </DetailLayout>
  );
}