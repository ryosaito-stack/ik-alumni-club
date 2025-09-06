'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import DetailLayout from '@/components/DetailLayout';
import { useBlogArticle } from '@/hooks/useBlogs';

// カテゴリーのラベル（日本語）
const categoryLabels: Record<string, string> = {
  MEMBER: 'メンバー',
  BEHIND: '舞台裏',
  INTERVIEW: 'インタビュー',
  TECHNOLOGY: 'テクノロジー',
  LEADERSHIP: 'リーダーシップ',
  BUSINESS: 'ビジネス',
  CAREER: 'キャリア',
};

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Firestoreから記事データを取得
  const { article, loading } = useBlogArticle(id);

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

  if (!article) {
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

  const formattedDate = new Date(article.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  return (
    <DetailLayout
      title={article.title}
      date={formattedDate}
      showShareButtons={true}
      backLink="/blog"
      backText="BACK"
    >

      {/* サムネイル画像 */}
      {article.thumbnail && (
        <div className="mb-8">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}

      {/* 記事本文 */}
      <div className="prose prose-lg max-w-none">
        {article.content ? (
          // HTMLコンテンツを表示
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          // プレーンテキストまたは概要を表示
          <div className="whitespace-pre-wrap">
            {article.excerpt || article.description || '記事の内容がありません。'}
          </div>
        )}
      </div>

    </DetailLayout>
  );
}