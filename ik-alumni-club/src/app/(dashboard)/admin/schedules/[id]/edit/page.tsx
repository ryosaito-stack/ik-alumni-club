'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSchedule, useScheduleMutations } from '@/hooks/useSchedules';
import { ScheduleFormData } from '@/types';

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { member } = useAuth();
  const { schedule, loading: loadingSchedule } = useSchedule(id);
  const { updateSchedule, loading: updating, error } = useScheduleMutations();

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    content: '',
    date: new Date(),
    link: '',
    sortOrder: undefined,
    published: false,
  });

  // 既存データを読み込み
  useEffect(() => {
    if (schedule) {
      setFormData({
        title: schedule.title,
        content: schedule.content,
        date: schedule.date,
        link: schedule.link || '',
        sortOrder: schedule.sortOrder,
        published: schedule.published,
      });
    }
  }, [schedule]);

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title || !formData.content) {
      alert('タイトルと内容は必須です');
      return;
    }

    const success = await updateSchedule(id, formData);
    if (success) {
      alert('スケジュールを更新しました');
      // router.refresh()を追加してキャッシュをクリア
      router.refresh();
      router.push('/admin/schedules');
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

  if (loadingSchedule) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">スケジュールが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">スケジュール編集</h1>
          <Link
            href="/admin/schedules"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 一覧に戻る
          </Link>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          作成者: {schedule.author.name} | 
          作成日: {new Date(schedule.createdAt).toLocaleDateString('ja-JP')} | 
          更新日: {new Date(schedule.updatedAt).toLocaleDateString('ja-JP')}
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
            開催日 <span className="text-red-500">*</span>
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
            placeholder="イベントの詳細内容（HTMLタグ使用可）"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            HTMLタグが使用できます（例: &lt;p&gt;, &lt;br /&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;）
          </p>
        </div>

        {/* リンク */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            リンク（任意）
          </label>
          <input
            type="url"
            id="link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/event"
          />
          <p className="mt-1 text-sm text-gray-500">
            申込フォームや詳細ページのURL
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
            同じ日付のイベント内での表示順（小さい数字が先に表示）
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
            href="/admin/schedules"
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