'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getContentById, canAccessContent } from '@/lib/firestore';
import { Content } from '@/types';
import { messages } from '@/constants/messages';
import { 
  components,
  typography,
  spacing,
  colors,
  layout,
  getMemberPlanBadgeClass,
  getButtonClasses,
} from '@/constants/design-tokens';

// コンテンツタイプのアイコンを取得
function getContentTypeIcon(type: Content['type']): string {
  switch (type) {
    case 'article':
      return '📄';
    case 'video':
      return '🎥';
    case 'document':
      return '📁';
    default:
      return '📋';
  }
}

// 日付フォーマット
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, member, loading: authLoading } = useAuth();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchContent() {
      if (!params.id || !member) return;

      try {
        setLoading(true);
        setError(null);
        
        const fetchedContent = await getContentById(params.id as string);
        
        if (!fetchedContent) {
          setError(messages.contents.notFound);
          return;
        }

        // アクセス権限チェック
        const canAccess = member.role === 'admin' || 
                         canAccessContent(member.plan, fetchedContent.requiredPlan);
        
        setHasAccess(canAccess);
        setContent(fetchedContent);
        
        if (!canAccess) {
          setError(messages.contents.accessDenied);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(messages.contents.fetchError);
      } finally {
        setLoading(false);
      }
    }

    if (member) {
      fetchContent();
    }
  }, [params.id, member]);

  if (authLoading || loading) {
    return (
      <div className={`${layout.size.minHeight.screen} ${layout.display.flex} ${layout.flex.align.center} ${layout.flex.justify.center}`}>
        <div className={typography.fontSize.lg}>{messages.common.loading}</div>
      </div>
    );
  }

  if (!user || !member) {
    return null;
  }

  if (error && !content) {
    return (
      <div className={components.page.main}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <Link href="/contents">
              <button className={getButtonClasses('primary', 'md')}>
                {messages.contents.backToList}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className={components.page.main}>
      <div className="max-w-4xl mx-auto">
        {/* ナビゲーション */}
        <div className="mb-6">
          <Link href="/contents" className="text-indigo-600 hover:text-indigo-800">
            ← {messages.contents.backToList}
          </Link>
        </div>

        {/* アクセス制限の警告 */}
        {!hasAccess && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {messages.contents.accessRestriction}
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>このコンテンツを閲覧するには{content.requiredPlan.toUpperCase()}{messages.contents.planUpgradeNote}</p>
                  <p className="mt-1">{messages.contents.currentPlanLabel}: {member.plan.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* コンテンツヘッダー */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* タイトルとメタ情報 */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {getContentTypeIcon(content.type)}
                  </span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {content.title}
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                      {content.description}
                    </p>
                  </div>
                </div>
                <span className={`${components.badge.base} ${getMemberPlanBadgeClass(content.requiredPlan)}`}>
                  {content.requiredPlan.toUpperCase()}
                </span>
              </div>

              {/* 著者と日付 */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>著者: {content.author}</span>
                <span>公開日: {formatDate(content.createdAt)}</span>
                {content.updatedAt && content.updatedAt !== content.createdAt && (
                  <span>更新日: {formatDate(content.updatedAt)}</span>
                )}
              </div>

              {/* タグ */}
              <div className="mt-4 flex flex-wrap gap-2">
                {content.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* コンテンツ本文（アクセス権限がある場合のみ表示） */}
            {hasAccess ? (
              <div className="prose max-w-none">
                {/* ビデオコンテンツ */}
                {content.type === 'video' && content.fileUrl && (
                  <div className="mb-8">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <div className="text-6xl mb-4">🎥</div>
                      <p className="text-gray-600 mb-4">{messages.contents.videoContent}</p>
                      <a 
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={getButtonClasses('primary', 'lg')}
                      >
                        {messages.contents.watchVideo}
                      </a>
                    </div>
                  </div>
                )}

                {/* ドキュメントコンテンツ */}
                {content.type === 'document' && content.fileUrl && (
                  <div className="mb-8">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <div className="text-6xl mb-4">📁</div>
                      <p className="text-gray-600 mb-4">{messages.contents.documentContent}</p>
                      <a 
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={getButtonClasses('primary', 'lg')}
                      >
                        {messages.contents.downloadDocument}
                      </a>
                    </div>
                  </div>
                )}

                {/* 記事コンテンツ */}
                {content.type === 'article' && (
                  <div className="mt-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4">{messages.contents.articleContent}</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {messages.contents.demoText1}
                        {messages.contents.demoText2}
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        {messages.contents.demoText3}
                        {messages.contents.demoText4}
                      </p>
                    </div>
                  </div>
                )}

                {/* アクション */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {messages.contents.likes}
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {messages.contents.bookmark}
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                        </svg>
                        {messages.contents.share}
                      </button>
                    </div>
                    {member.role === 'admin' && (
                      <button className={getButtonClasses('secondary', 'sm')}>
                        {messages.common.edit}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {messages.contents.premiumContent}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {messages.contents.upgradeRequired}
                  </p>
                  <button className={getButtonClasses('primary', 'lg')}>
                    {messages.membership.upgradePlan}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}