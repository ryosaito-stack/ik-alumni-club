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
      <div dangerouslySetInnerHTML={{ __html: information.content }} />
    </DetailLayout>
  );
}