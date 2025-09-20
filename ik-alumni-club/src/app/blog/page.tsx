'use client';

import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';
import { useBlogsList } from '@/hooks/blogs/user';

export default function BlogPage() {
  // Firestoreから公開済みブログ記事を取得
  const { blogs, loading } = useBlogsList({
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

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
        items={blogs}
        emptyMessage="該当する記事がありません"
        layout="list"
      >
        {(blog) => (
          <Link href={`/blog/${blog.id}`} key={blog.id}>
            <div className="block--txt transition-opacity duration-300 cursor-pointer hover:opacity-60" style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '0', paddingRight: '0' }}>
              <div className="flex items-start gap-4">
                {/* サムネイル画像 */}
                {blog.thumbnail && (
                  <div className="flex-shrink-0">
                    <img 
                      src={blog.thumbnail} 
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  {/* 日付と著者 */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>•</span>
                    <span>{blog.author.name}</span>
                  </div>
                  
                  {/* タイトル */}
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {blog.title}
                  </h3>
                  
                  {/* 抜粋 */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {blog.excerpt}
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