'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNewsletter, useNewsletterMutations } from '@/hooks/useNewsletters';
import { uploadImage, deleteImage } from '@/lib/storage';

export default function EditNewsletterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { member } = useAuth();
  const { newsletter, loading: loadingNewsletter } = useNewsletter(id);
  const { updateNewsletter, loading: updating, error } = useNewsletterMutations();

  // 管理者チェック
  const isAdmin = member?.role === 'admin';

  const [formData, setFormData] = useState({
    title: '',
    issueNumber: 0,
    excerpt: '',
    content: '',
    pdfUrl: '',
    published: false,
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string>('');

  // 既存データを読み込み
  useEffect(() => {
    if (newsletter) {
      setFormData({
        title: newsletter.title,
        issueNumber: newsletter.issueNumber,
        excerpt: newsletter.excerpt,
        content: newsletter.content,
        pdfUrl: newsletter.pdfUrl || '',
        published: newsletter.published,
      });
      setOriginalPdfUrl(newsletter.pdfUrl || '');
    }
  }, [newsletter]);

  useEffect(() => {
    if (member && !isAdmin) {
      router.push('/dashboard');
    }
  }, [member, isAdmin, router]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PDFファイルのバリデーション
    if (!file.type.includes('pdf')) {
      alert('PDFファイルを選択してください');
      return;
    }

    // 15MBまでのサイズ制限
    if (file.size > 15 * 1024 * 1024) {
      alert('ファイルサイズは15MB以下にしてください');
      return;
    }

    setPdfFile(file);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setFormData({ ...formData, pdfUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('タイトル、抜粋、本文は必須です');
      return;
    }

    if (!formData.issueNumber || formData.issueNumber <= 0) {
      alert('号数は1以上の数値を入力してください');
      return;
    }

    let uploadedPdfUrl = formData.pdfUrl;

    // PDFのアップロード
    if (pdfFile) {
      setUploadingPdf(true);
      try {
        // 古いPDFを削除（Firebase Storage URLの場合）
        if (originalPdfUrl && originalPdfUrl.includes('firebasestorage.googleapis.com')) {
          await deleteImage(originalPdfUrl);
        }
        uploadedPdfUrl = await uploadImage(pdfFile, 'newsletters');
      } catch (err) {
        console.error('Error uploading PDF:', err);
        alert('PDFのアップロードに失敗しました');
        setUploadingPdf(false);
        return;
      }
      setUploadingPdf(false);
    }

    const success = await updateNewsletter(id, {
      title: formData.title,
      issueNumber: formData.issueNumber,
      excerpt: formData.excerpt,
      content: formData.content,
      pdfUrl: uploadedPdfUrl || undefined,
      published: formData.published,
    });
    
    if (success) {
      alert('ニュースレターを更新しました');
      router.refresh();
      router.push('/admin/newsletters');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loadingNewsletter) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">ニュースレターが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">ニュースレター編集</h1>
          <Link
            href="/admin/newsletters"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 一覧に戻る
          </Link>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          第{newsletter.issueNumber}号 | 
          作成日: {new Date(newsletter.createdAt).toLocaleDateString('ja-JP')} | 
          更新日: {new Date(newsletter.updatedAt).toLocaleDateString('ja-JP')}
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
        {/* 号数 */}
        <div>
          <label htmlFor="issueNumber" className="block text-sm font-medium text-gray-700">
            号数 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="issueNumber"
            min="1"
            value={formData.issueNumber}
            onChange={(e) => setFormData({ ...formData, issueNumber: parseInt(e.target.value) || 0 })}
            className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

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

        {/* 抜粋 */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            抜粋（概要） <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="ニュースレターの概要を入力してください（一覧表示に使用されます）"
            required
          />
        </div>

        {/* 本文 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            本文（HTML可） <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={15}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-xs"
            placeholder="ニュースレターの本文を入力してください（HTMLタグ使用可）"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            HTMLタグが使用できます（例: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a href=""&gt;）
          </p>
        </div>

        {/* PDFアップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PDF版（オプション）
          </label>
          
          {/* 既存PDF表示 */}
          {formData.pdfUrl && !pdfFile && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                  </svg>
                  <a 
                    href={formData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    現在のPDFを表示
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          )}

          {/* PDF選択済み表示 */}
          {pdfFile && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                  </svg>
                  <span className="text-sm text-gray-700">{pdfFile.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* ファイル選択 */}
          {!pdfFile && !formData.pdfUrl && (
            <div className="mt-2">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  PDFを選択
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                PDF形式（最大15MB）
              </p>
            </div>
          )}
        </div>

        {/* PDF URL（直接入力） */}
        <div>
          <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700">
            またはPDF URLを直接入力
          </label>
          <input
            type="url"
            id="pdfUrl"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/newsletter.pdf"
            disabled={!!pdfFile}
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
            href="/admin/newsletters"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={updating || uploadingPdf}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploadingPdf ? 'アップロード中...' : updating ? '更新中...' : '更新'}
          </button>
        </div>
      </form>
    </div>
  );
}