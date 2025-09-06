'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useInformation, useInformationMutations } from '@/hooks/useInformations';
import { InformationFormData, InformationCategory, TargetMember } from '@/types';

export default function EditInformationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { member } = useAuth();
  const { information, loading: loadingInfo } = useInformation(id);
  const { updateInformation, loading: updating, error } = useInformationMutations();

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  const [formData, setFormData] = useState<InformationFormData>({
    title: '',
    date: new Date(),
    category: 'お知らせ' as InformationCategory,
    content: '',
    summary: '',
    targetMembers: ['ALL'] as TargetMember[],
    isPinned: false,
    published: false,
  });

  // 既存データを読み込み
  useEffect(() => {
    if (information) {
      setFormData({
        title: information.title,
        date: information.date,
        category: information.category,
        content: information.content,
        summary: information.summary,
        targetMembers: information.targetMembers,
        isPinned: information.isPinned,
        published: information.published,
      });
    }
  }, [information]);

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title || !formData.summary || !formData.content) {
      alert('タイトル、概要、内容は必須です');
      return;
    }

    if (formData.targetMembers.length === 0) {
      alert('対象会員を選択してください');
      return;
    }

    const success = await updateInformation(id, formData);
    if (success) {
      alert('お知らせを更新しました');
      // router.refresh()を追加してキャッシュをクリア
      router.refresh();
      router.push('/admin/informations');
    }
  };

  const handleTargetMemberChange = (member: TargetMember) => {
    setFormData(prev => {
      const newTargetMembers = prev.targetMembers.includes(member)
        ? prev.targetMembers.filter(m => m !== member)
        : [...prev.targetMembers, member];
      return { ...prev, targetMembers: newTargetMembers };
    });
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
          作成者: {information.author.name} | 
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

        {/* カテゴリー */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            カテゴリー
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as InformationCategory })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="お知らせ">お知らせ</option>
            <option value="更新情報">更新情報</option>
            <option value="メンテナンス">メンテナンス</option>
          </select>
        </div>

        {/* 概要 */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            概要（100文字程度） <span className="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            rows={2}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="一覧ページに表示される概要文"
            maxLength={200}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.summary.length}/200文字
          </p>
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

        {/* 対象会員 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            対象会員 <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 space-y-2">
            {(['ALL', 'PLATINUM', 'BUSINESS', 'INDIVIDUAL'] as TargetMember[]).map(member => (
              <label key={member} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.targetMembers.includes(member)}
                  onChange={() => handleTargetMemberChange(member)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {member === 'ALL' && '全員（非会員含む）'}
                  {member === 'PLATINUM' && 'プラチナ会員'}
                  {member === 'BUSINESS' && 'ビジネス会員以上'}
                  {member === 'INDIVIDUAL' && '個人会員以上'}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            複数選択可。階層的なアクセス制御が適用されます。
          </p>
        </div>

        {/* オプション */}
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              📌 ピン留め（常に上部に表示）
            </span>
          </label>

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