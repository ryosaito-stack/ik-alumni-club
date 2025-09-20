'use client';

import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';
import { useNewslettersList } from '@/hooks/newsletters/user';

export default function NewslettersPage() {
  // Firestoreから公開済みニュースレターを取得
  const { newsletters, loading } = useNewslettersList({});

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  return (
    <ViewAllLayout title="NEWSLETTERS" bgColor="white" maxWidth="6xl">
      <ListPageContent
        loading={loading}
        items={newsletters}
        emptyMessage="該当する会報がありません"
        layout="list"
      >
        {(newsletter) => (
          <Link href={`/newsletters/${newsletter.id}`} key={newsletter.id}>
            <div className="block--txt transition-opacity duration-300 cursor-pointer hover:opacity-60" style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '0', paddingRight: '0' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-gray-500">
                      第{newsletter.issueNumber}号
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(newsletter.createdAt)}
                    </span>
                    {newsletter.pdfUrl && (
                      <span className="text-xs text-indigo-600">
                        📄 PDF版あり
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {newsletter.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {newsletter.excerpt}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </ListPageContent>
    </ViewAllLayout>
  );
}