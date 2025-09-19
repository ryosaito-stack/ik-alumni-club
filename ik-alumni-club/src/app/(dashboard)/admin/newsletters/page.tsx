'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNewslettersAdmin, useNewsletterMutations } from '@/hooks/useNewsletters';

export default function AdminNewslettersPage() {
  const router = useRouter();
  const { member } = useAuth();
  const [showUnpublished, setShowUnpublished] = useState(true);

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  // ニュースレター一覧を取得
  const { newsletters, loading } = useNewslettersAdmin({
    published: showUnpublished ? undefined : true,
    orderBy: 'issueNumber',
    orderDirection: 'desc',
  });

  // 削除用のMutation
  const { deleteNewsletter, loading: deleting } = useNewsletterMutations();

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`「${title}」を削除してもよろしいですか？`)) {
      const success = await deleteNewsletter(id);
      if (success) {
        alert('ニュースレターを削除しました');
        router.refresh();
        window.location.reload();
      } else {
        alert('削除に失敗しました');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">ニュースレター管理</h1>
          <Link
            href="/admin/newsletters/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            新規作成
          </Link>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showUnpublished}
            onChange={(e) => setShowUnpublished(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">非公開も表示</span>
        </label>
      </div>

      {/* ニュースレター一覧テーブル */}
      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : newsletters.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">ニュースレターがありません</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {newsletters.map((newsletter) => (
              <li key={newsletter.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="mr-3 text-sm font-medium text-gray-500">
                          第{newsletter.issueNumber}号
                        </span>
                        <h3 className="text-lg font-medium text-gray-900">
                          {newsletter.title}
                        </h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded ${
                          newsletter.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {newsletter.published ? '公開' : '下書き'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {newsletter.excerpt}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        作成日: {formatDate(newsletter.createdAt)} | 
                        更新日: {formatDate(newsletter.updatedAt)}
                        {newsletter.pdfUrl && (
                          <span className="ml-2">📄 PDF添付済み</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {newsletter.pdfUrl && (
                        <a
                          href={newsletter.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                        >
                          PDF
                        </a>
                      )}
                      <Link
                        href={`/admin/newsletters/${newsletter.id}/edit`}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(newsletter.id, newsletter.title)}
                        disabled={deleting}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}