'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import DetailLayout from '@/components/DetailLayout';
import { useBlogDetail } from '@/hooks/blogs/user';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Firestoreから記事データを取得
  const { blog, loading } = useBlogDetail(id);

  if (loading) {
    return (
      <DetailLayout
        title="読み込み中..."
        date=""
        showShareButtons={false}
        backLink="/blog"
        backText="BACK"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </DetailLayout>
    );
  }

  if (!blog) {
    return (
      <DetailLayout
        title="記事が見つかりません"
        date=""
        showShareButtons={false}
        backLink="/blog"
        backText="BACK"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">指定された記事が見つかりませんでした。</p>
          <Link 
            href="/blog"
            className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            ブログ一覧に戻る
          </Link>
        </div>
      </DetailLayout>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  return (
    <DetailLayout
      title={blog.title}
      date={formattedDate}
      showShareButtons={true}
      backLink="/blog"
      backText="BACK"
    >
      {/* 著者情報 */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              著者: <span className="font-medium text-gray-900">{blog.author.name}</span>
              {blog.author.role === 'admin' && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">管理者</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              最終更新: {new Date(blog.updatedAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
      </div>

      {/* サムネイル画像 */}
      {blog.thumbnail && (
        <div className="mb-8">
          <img 
            src={blog.thumbnail} 
            alt={blog.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}

      {/* 抜粋 */}
      {blog.excerpt && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>
      )}

      {/* 記事本文 */}
      <div className="prose prose-lg max-w-none">
        {blog.content ? (
          // HTMLコンテンツを表示
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          // プレーンテキストを表示
          <div className="whitespace-pre-wrap">
            記事の内容がありません。
          </div>
        )}
      </div>

    </DetailLayout>
  );
}