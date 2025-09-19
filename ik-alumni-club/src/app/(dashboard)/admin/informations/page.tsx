'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useInformations, useInformationMutations } from '@/hooks/useInformations';
import { Information } from '@/types';

export default function AdminInformationsPage() {
  const router = useRouter();
  const { member, loading: authLoading } = useAuth();
  const [showUnpublished, setShowUnpublished] = useState(true);
  
  // 管理者チェック
  const isAdmin = member?.role === 'admin';
  
  // お知らせ一覧を取得（管理画面なので全て取得）
  const { informations, loading, error } = useInformations({
    published: showUnpublished ? undefined : true,
    orderBy: 'date',
    orderDirection: 'desc',
  });

  const { deleteInformation, loading: deleteLoading } = useInformationMutations();

  useEffect(() => {
    // 認証情報の読み込みが完了してから判定
    if (!authLoading && member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [authLoading, member, isAdmin, router]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`「${title}」を削除してよろしいですか？`)) {
      const success = await deleteInformation(id);
      if (success) {
        alert('削除しました');
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


  if (loading || authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">お知らせ管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            サイトに表示するお知らせを管理します
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/informations/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            新規作成
          </Link>
        </div>
      </div>

      {/* フィルター */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-end">
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
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          エラー: {error.message}
        </div>
      )}

      {/* テーブル */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      状態
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      日付
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      タイトル
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      画像/リンク
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {informations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                        お知らせがありません
                      </td>
                    </tr>
                  ) : (
                    informations.map((info) => (
                      <tr key={info.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {info.published ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              公開
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              下書き
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {formatDate(info.date)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div className="font-medium">{info.title}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex gap-2">
                            {info.imageUrl && (
                              <span className="text-blue-600">画像</span>
                            )}
                            {info.url && (
                              <span className="text-blue-600">リンク</span>
                            )}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/admin/informations/${info.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => handleDelete(info.id, info.title)}
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}