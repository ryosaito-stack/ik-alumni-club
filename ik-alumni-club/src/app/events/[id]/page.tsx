'use client';

import { useParams } from 'next/navigation';
import { useSchedule } from '@/hooks/useSchedules';
import DetailLayout from '@/components/DetailLayout';

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Firestoreからスケジュールを取得
  const { schedule, loading } = useSchedule(id);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (loading) {
    return (
      <DetailLayout
        title="読み込み中..."
        date=""
        category=""
        showShareButtons={false}
        backLink="/events"
        backText="BACK"
      >
        <div className="text-center py-8 text-gray-500">
          読み込み中...
        </div>
      </DetailLayout>
    );
  }

  if (!schedule) {
    return (
      <DetailLayout
        title="イベントが見つかりません"
        date=""
        category=""
        showShareButtons={false}
        backLink="/events"
        backText="BACK"
      >
        <div className="text-center py-8 text-gray-500">
          指定されたイベントは存在しないか、削除された可能性があります。
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout
      title={schedule.title}
      date={formatDate(schedule.date)}
      category="EVENT"
      showShareButtons={true}
      backLink="/events"
      backText="BACK"
    >
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: schedule.content }} />
        
        {schedule.link && (
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">イベント詳細・申込</h3>
            <a
              href={schedule.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              詳細ページへ
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </DetailLayout>
  );
}