'use client';

import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';
import { useBlogArticlesByCategory } from '@/hooks/useBlogs';


export default function BlogPage() {
  // Firestoreからブログ記事を取得（すべての記事）
  const { articles, loading } = useBlogArticlesByCategory('all');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  return (
    <ViewAllLayout title="BLOG" bgColor="white" maxWidth="6xl">
      <ListPageContent
        loading={loading}
        items={articles}
        emptyMessage="該当する記事がありません"
        layout="list"
      >
        {(article) => (
          <Link href={`/blog/${article.id}`}>
            <div className="block--txt transition-opacity duration-300 cursor-pointer hover:opacity-60" style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '0', paddingRight: '0' }}>
              <p className="date text-black" style={{ fontSize: '13px', marginBottom: '10px' }}>
                {formatDate(article.createdAt)}
              </p>
              <p className="tit text-gray-800" style={{ fontSize: '14px' }}>
                {article.title}
              </p>
            </div>
          </Link>
        )}
      </ListPageContent>
    </ViewAllLayout>
  );
}