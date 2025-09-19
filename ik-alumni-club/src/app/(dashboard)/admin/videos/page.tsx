'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useVideos, useVideoMutations } from '@/hooks/useVideos';

export default function AdminVideosPage() {
  const router = useRouter();
  const { member } = useAuth();
  const [showUnpublished, setShowUnpublished] = useState(true);

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  // 動画一覧を取得
  const { videos, loading } = useVideos({
    published: showUnpublished ? undefined : true,
    orderBy: 'date',
    orderDirection: 'desc',
  });

  // 削除用のMutation
  const { deleteVideo, loading: deleting } = useVideoMutations();

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`「${title}」を削除してもよろしいですか？`)) {
      const success = await deleteVideo(id);
      if (success) {
        alert('動画を削除しました');
        router.refresh();
      } else {
        alert('削除に失敗しました');
      }
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">動画管理</h1>
          <Link
            href="/admin/videos/new"
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

      {/* 動画一覧テーブル */}
      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">動画がありません</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {videos.map((video) => (
              <li key={video.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {video.title}
                        </h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded ${
                          video.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {video.published ? '公開' : '下書き'}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        日付: {new Date(video.date).toLocaleDateString('ja-JP')} | 
                        作成者: {video.author.name} | 
                        更新日: {new Date(video.updatedAt).toLocaleDateString('ja-JP')}
                      </div>
                      {(video.videoUrl || video.thumbnail) && (
                        <div className="mt-2 text-xs text-gray-500">
                          {video.videoUrl && <span className="mr-3">📹 動画URL設定済み</span>}
                          {video.thumbnail && <span>🖼️ サムネイル設定済み</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/videos/${video.id}/edit`}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(video.id, video.title)}
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