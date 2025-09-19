'use client';

import { useParams } from 'next/navigation';
import { useInformation } from '@/hooks/useInformations';
import DetailLayout from '@/components/DetailLayout';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Firestoreからお知らせを取得
  const { information, loading } = useInformation(id);

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  if (loading) {
    return (
      <DetailLayout
        title="読み込み中..."
        date=""
        showShareButtons={false}
        backLink="/news"
        backText="BACK"
      >
        <div className="text-center py-8 text-gray-500">
          読み込み中...
        </div>
      </DetailLayout>
    );
  }

  if (!information) {
    return (
      <DetailLayout
        title="お知らせが見つかりません"
        date=""
        showShareButtons={false}
        backLink="/news"
        backText="BACK"
      >
        <div className="text-center py-8 text-gray-500">
          指定されたお知らせが見つかりませんでした。
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout
      title={information.title}
      date={formatDate(information.date)}
      showShareButtons={true}
      backLink="/news"
      backText="BACK"
    >
      {/* 画像がある場合は表示 */}
      {information.imageUrl && (
        <div className="mb-8">
          <img
            src={information.imageUrl}
            alt={information.title}
            className="w-full rounded-lg shadow-md"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
      )}
      
      {/* コンテンツ */}
      <div dangerouslySetInnerHTML={{ __html: information.content }} />
      
      {/* 外部リンクがある場合は表示 */}
      {information.url && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <a
            href={information.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>詳細はこちら</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </DetailLayout>
  );
}