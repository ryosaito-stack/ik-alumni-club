'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useVideo, useVideoMutations } from '@/hooks/useVideos';
import { VideoFormData, VideoCategory } from '@/types';

// カテゴリーのラベル
const categoryOptions: { value: VideoCategory; label: string }[] = [
  { value: 'CONFERENCE', label: 'カンファレンス' },
  { value: 'SEMINAR', label: 'セミナー' },
  { value: 'WORKSHOP', label: 'ワークショップ' },
  { value: 'INTERVIEW', label: 'インタビュー' },
  { value: 'EVENT', label: 'イベント' },
  { value: 'FEATURE', label: '特集' },
];

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { member } = useAuth();
  const { video, loading: loadingVideo } = useVideo(id);
  const { updateVideo, loading: updating, error } = useVideoMutations();

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    category: 'SEMINAR',
    videoUrl: '',
    thumbnail: '',
    published: false,
    featuredInCarousel: false,
    sortOrder: undefined,
  });

  // 既存データを読み込み
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        category: video.category,
        videoUrl: video.videoUrl || '',
        thumbnail: video.thumbnail || '',
        published: video.published,
        featuredInCarousel: video.featuredInCarousel || false,
        sortOrder: video.sortOrder,
      });
    }
  }, [video]);

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title || !formData.description) {
      alert('タイトルと説明は必須です');
      return;
    }

    const success = await updateVideo(id, formData);
    if (success) {
      alert('動画を更新しました');
      // router.refresh()を追加してキャッシュをクリア
      router.refresh();
      router.push('/admin/videos');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loadingVideo) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">動画が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">動画編集</h1>
          <Link
            href="/admin/videos"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 一覧に戻る
          </Link>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          作成者: {video.author.name} | 
          作成日: {new Date(video.createdAt).toLocaleDateString('ja-JP')} | 
          更新日: {new Date(video.updatedAt).toLocaleDateString('ja-JP')}
        </p>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          エラー: {error.message}
        </div>
      )}

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-6 py-8 rounded-lg">
        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* 説明 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* カテゴリー */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            カテゴリー <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as VideoCategory })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 動画URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
            動画URL（任意）
          </label>
          <input
            type="url"
            id="videoUrl"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/video.mp4 または YouTube URL"
          />
          <p className="mt-1 text-sm text-gray-500">
            S3のURL、YouTubeのURL等を入力してください
          </p>
        </div>

        {/* サムネイルURL */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            サムネイルURL（任意）
          </label>
          <input
            type="url"
            id="thumbnail"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/thumbnail.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">
            サムネイル画像のURL（S3等）
          </p>
        </div>

        {/* 表示順 */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
            表示順（任意）
          </label>
          <input
            type="number"
            id="sortOrder"
            value={formData.sortOrder || ''}
            onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value ? parseInt(e.target.value) : undefined })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0"
            min="0"
          />
          <p className="mt-1 text-sm text-gray-500">
            カルーセル内での表示順（小さい数字が先に表示）
          </p>
        </div>

        {/* カルーセル表示 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featuredInCarousel}
              onChange={(e) => setFormData({ ...formData, featuredInCarousel: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              HOMEページのカルーセルに表示する
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            チェックを入れるとHOMEページのVIDEOセクションに表示されます
          </p>
        </div>

        {/* 公開設定 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              公開する
            </span>
          </label>
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/videos"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {updating ? '更新中...' : '更新'}
          </button>
        </div>
      </form>
    </div>
  );
}