'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import DetailLayout from '@/components/DetailLayout';
import { useNewsletter } from '@/hooks/useNewsletters';

export default function NewsletterDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Firestoreからニュースレターデータを取得
  const { newsletter, loading } = useNewsletter(id);

  if (loading) {
    return (
      <DetailLayout
        title="読み込み中..."
        date=""
        showShareButtons={false}
        backLink="/newsletters"
        backText="BACK"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </DetailLayout>
    );
  }

  if (!newsletter) {
    return (
      <DetailLayout
        title="会報が見つかりません"
        date=""
        showShareButtons={false}
        backLink="/newsletters"
        backText="BACK"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">指定された会報が見つかりませんでした。</p>
          <Link 
            href="/newsletters"
            className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            会報一覧に戻る
          </Link>
        </div>
      </DetailLayout>
    );
  }

  const formattedDate = new Date(newsletter.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  return (
    <DetailLayout
      title={newsletter.title}
      date={formattedDate}
      showShareButtons={true}
      backLink="/newsletters"
      backText="BACK"
    >
      {/* メタ情報 */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded font-medium">
              第{newsletter.issueNumber}号
            </span>
            {newsletter.pdfUrl && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                📄 PDF版あり
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            最終更新: {new Date(newsletter.updatedAt).toLocaleDateString('ja-JP')}
          </div>
        </div>
      </div>

      {/* 抜粋 */}
      {newsletter.excerpt && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {newsletter.excerpt}
          </p>
        </div>
      )}

      {/* PDFダウンロードセクション */}
      {newsletter.pdfUrl && (
        <div className="mb-8 p-6 bg-indigo-50 rounded-lg">
          <h3 className="font-bold text-lg mb-3">📄 PDF版のダウンロード</h3>
          <p className="text-gray-700 mb-4">
            より詳細な内容は、PDF版でご覧いただけます。
          </p>
          <a 
            href={newsletter.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF版をダウンロード
          </a>
        </div>
      )}

      {/* 会報本文 */}
      <div className="prose prose-lg max-w-none">
        {newsletter.content ? (
          // HTMLコンテンツを表示
          <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
        ) : (
          // コンテンツがない場合
          <div className="text-center py-8 text-gray-500">
            <p>本文の内容はPDF版でご確認ください。</p>
          </div>
        )}
      </div>

    </DetailLayout>
  );
}