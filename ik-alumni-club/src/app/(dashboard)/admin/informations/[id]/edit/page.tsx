'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAdminInformationDetail, useAdminInformationMutations } from '@/hooks/informations/admin';
import { InformationFormData } from '@/types/information';
import { uploadImage, deleteImage, validateImageFile, createImagePreview, revokeImagePreview } from '@/lib/storage';

export default function EditInformationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { member } = useAuth();
  const { information, loading: loadingInfo } = useAdminInformationDetail(id);
  const { update, loading: updating, error } = useAdminInformationMutations();

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  const [formData, setFormData] = useState<InformationFormData>({
    title: '',
    date: new Date(),
    content: '',
    imageUrl: '',
    url: '',
    published: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');

  // 既存データを読み込み
  useEffect(() => {
    if (information) {
      setFormData({
        title: information.title,
        date: information.date,
        content: information.content,
        imageUrl: information.imageUrl || '',
        url: information.url || '',
        published: information.published,
      });
      setOriginalImageUrl(information.imageUrl || '');
    }
  }, [information]);

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // バリデーション
    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      return;
    }

    setImageError(null);
    setImageFile(file);

    // 既存のプレビューをクリーンアップ
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }

    // 新しいプレビューを作成
    const preview = createImagePreview(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      revokeImagePreview(imagePreview);
      setImagePreview(null);
    }
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title || !formData.content) {
      alert('タイトルと内容は必須です');
      return;
    }

    let uploadedImageUrl = formData.imageUrl;

    // 新しい画像のアップロード
    if (imageFile) {
      setUploadingImage(true);
      try {
        // 古い画像を削除（Firebase Storage内の画像の場合）
        if (originalImageUrl && originalImageUrl.includes('firebasestorage.googleapis.com')) {
          try {
            await deleteImage(originalImageUrl);
          } catch (err) {
            console.error('Error deleting old image:', err);
            // 削除に失敗しても続行
          }
        }

        // 新しい画像をアップロード
        uploadedImageUrl = await uploadImage(imageFile, 'informations');
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('画像のアップロードに失敗しました');
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    } else if (formData.imageUrl === '' && originalImageUrl) {
      // 画像が削除された場合、Firebase Storageから削除
      if (originalImageUrl.includes('firebasestorage.googleapis.com')) {
        try {
          await deleteImage(originalImageUrl);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    const success = await update(id, {
      ...formData,
      imageUrl: uploadedImageUrl,
    });
    
    if (success) {
      alert('お知らせを更新しました');
      router.refresh();
      router.push('/admin/informations');
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

  if (loadingInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!information) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">お知らせが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">お知らせ編集</h1>
          <Link
            href="/admin/informations"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 一覧に戻る
          </Link>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          作成日: {new Date(information.createdAt).toLocaleDateString('ja-JP')} | 
          更新日: {new Date(information.updatedAt).toLocaleDateString('ja-JP')}
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
            公開日
          </label>
          <input
            type="date"
            id="date"
            value={formatDateForInput(formData.date)}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* 内容 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            内容（HTML可） <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-xs"
            placeholder="詳細ページに表示される本文（HTMLタグ使用可）"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            HTMLタグが使用できます（例: &lt;p&gt;, &lt;br /&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;）
          </p>
        </div>

        {/* 画像アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            画像（任意）
          </label>
          
          {/* 画像プレビュー */}
          {(imagePreview || formData.imageUrl) && (
            <div className="mt-2 relative inline-block">
              <img
                src={imagePreview || formData.imageUrl}
                alt="Preview"
                className="max-w-xs h-40 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* ファイル選択 */}
          {!imagePreview && (
            <div className="mt-2">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  新しい画像を選択
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG, GIF, WebP（最大15MB）
              </p>
            </div>
          )}

          {/* エラー表示 */}
          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}
        </div>

        {/* 画像URL（直接入力） */}
        {!imagePreview && (
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              または画像URLを直接入力（任意）
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
              disabled={!!imageFile}
            />
          </div>
        )}

        {/* 外部リンク */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            外部リンクURL（任意）
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com"
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
            href="/admin/informations"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={updating || uploadingImage}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploadingImage ? 'アップロード中...' : updating ? '更新中...' : '更新'}
          </button>
        </div>
      </form>
    </div>
  );
}