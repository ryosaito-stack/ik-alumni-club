'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useVideos, useVideoMutations } from '@/hooks/useVideos';
import { VideoCategory } from '@/types';

// カテゴリーのラベル
const categoryLabels: Record<VideoCategory, string> = {
  CONFERENCE: 'カンファレンス',
  SEMINAR: 'セミナー',
  WORKSHOP: 'ワークショップ',
  INTERVIEW: 'インタビュー',
  EVENT: 'イベント',
  FEATURE: '特集',
};

export default function AdminVideosPage() {
  const router = useRouter();
  const { member } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  // 動画一覧を取得（公開・非公開すべて）
  const { videos, loading } = useVideos({
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

  // 削除用のMutation
  const { deleteVideo, loading: deleting } = useVideoMutations();

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  // カテゴリーでフィルタリング
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

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

      {/* カテゴリーフィルター */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            すべて ({videos.length})
          </button>
          {(Object.keys(categoryLabels) as VideoCategory[]).map(category => {
            const count = videos.filter(v => v.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {categoryLabels[category]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 動画一覧テーブル */}
      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">動画がありません</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredVideos.map((video) => (
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
                        {video.featuredInCarousel && (
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            カルーセル表示
                          </span>
                        )}
                        <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                          {categoryLabels[video.category]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        作成者: {video.author.name} | 
                        作成日: {new Date(video.createdAt).toLocaleDateString('ja-JP')}
                        {video.sortOrder !== undefined && ` | 表示順: ${video.sortOrder}`}
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