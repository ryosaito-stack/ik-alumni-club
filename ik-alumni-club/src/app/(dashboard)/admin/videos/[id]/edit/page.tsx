'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useVideo, useVideoMutations } from '@/hooks/useVideos';
import { VideoFormData } from '@/types';
import { uploadImage, deleteImage, validateImageFile, createImagePreview, revokeImagePreview } from '@/lib/storage';

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
    date: new Date(),
    videoUrl: '',
    thumbnail: '',
    published: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string>('');

  // 既存データを読み込み
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        date: video.date,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        published: video.published,
      });
      setOriginalThumbnailUrl(video.thumbnail);
    }
  }, [video]);

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        revokeImagePreview(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // バリデーション
    const error = validateImageFile(file);
    if (error) {
      setThumbnailError(error);
      return;
    }

    setThumbnailError(null);
    setThumbnailFile(file);

    // 既存のプレビューをクリーンアップ
    if (thumbnailPreview) {
      revokeImagePreview(thumbnailPreview);
    }

    // 新しいプレビューを作成
    const preview = createImagePreview(file);
    setThumbnailPreview(preview);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    if (thumbnailPreview) {
      revokeImagePreview(thumbnailPreview);
      setThumbnailPreview(null);
    }
    setFormData({ ...formData, thumbnail: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title || !formData.videoUrl) {
      alert('タイトルと動画URLは必須です');
      return;
    }

    // サムネイルがない場合
    if (!formData.thumbnail && !thumbnailFile) {
      alert('サムネイル画像は必須です');
      return;
    }

    let uploadedThumbnailUrl = formData.thumbnail;

    // サムネイルのアップロード
    if (thumbnailFile) {
      setUploadingThumbnail(true);
      try {
        // 古いサムネイルを削除（Firebase Storage URLの場合）
        if (originalThumbnailUrl && originalThumbnailUrl.includes('firebasestorage.googleapis.com')) {
          await deleteImage(originalThumbnailUrl);
        }
        uploadedThumbnailUrl = await uploadImage(thumbnailFile, 'videos');
      } catch (err) {
        console.error('Error uploading thumbnail:', err);
        alert('サムネイルのアップロードに失敗しました');
        setUploadingThumbnail(false);
        return;
      }
      setUploadingThumbnail(false);
    }

    const success = await updateVideo(id, {
      ...formData,
      thumbnail: uploadedThumbnailUrl,
    });
    
    if (success) {
      alert('動画を更新しました');
      router.refresh();
      router.push('/admin/videos');
    }
  };

  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

        {/* 日付 */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            value={formatDateForInput(formData.date)}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* 動画URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
            動画URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="videoUrl"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://www.youtube.com/watch?v=... または動画ファイルのURL"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            YouTube URLやFirebase Storage URLなどを入力してください
          </p>
        </div>

        {/* サムネイルアップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            サムネイル画像 <span className="text-red-500">*</span>
          </label>
          
          {/* サムネイルプレビュー */}
          {(thumbnailPreview || formData.thumbnail) && (
            <div className="mt-2 relative inline-block">
              <img
                src={thumbnailPreview || formData.thumbnail}
                alt="Thumbnail Preview"
                className="max-w-xs h-40 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* ファイル選択 */}
          {!thumbnailPreview && !formData.thumbnail && (
            <div className="mt-2">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  画像を選択
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG, GIF, WebP（最大15MB）
              </p>
            </div>
          )}

          {/* エラー表示 */}
          {thumbnailError && (
            <p className="mt-2 text-sm text-red-600">{thumbnailError}</p>
          )}
        </div>

        {/* サムネイルURL（直接入力） */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            またはサムネイルURLを直接入力
          </label>
          <input
            type="url"
            id="thumbnail"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/thumbnail.jpg"
            disabled={!!thumbnailFile}
          />
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
            disabled={updating || uploadingThumbnail}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploadingThumbnail ? 'アップロード中...' : updating ? '更新中...' : '更新'}
          </button>
        </div>
      </form>
    </div>
  );
}