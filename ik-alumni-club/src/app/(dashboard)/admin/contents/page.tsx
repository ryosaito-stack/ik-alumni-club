'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminContents } from '@/hooks/useAdminContents';
import ContentForm from '@/components/admin/ContentForm';
import { Content, MemberPlan } from '@/types';
import { messages } from '@/constants/messages';

export default function AdminContentsPage() {
  const router = useRouter();
  const { user, member } = useAuth();
  const { 
    contents, 
    loading, 
    error, 
    actionLoading,
    createContent,
    updateContent,
    deleteContent,
    refreshContents 
  } = useAdminContents();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [filterPlan, setFilterPlan] = useState<MemberPlan | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 管理者チェック
  useEffect(() => {
    if (member && member.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [member, router]);

  // フィルター済みコンテンツ
  const filteredContents = filterPlan === 'all' 
    ? contents 
    : contents.filter(c => c.requiredPlan === filterPlan);

  // コンテンツ作成/更新処理
  const handleSubmit = async (data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingContent) {
        await updateContent(editingContent.id, data);
      } else {
        await createContent(data);
      }
      setIsFormOpen(false);
      setEditingContent(null);
    } catch (err) {
      // エラーはhook内で処理される
    }
  };

  // 編集開始
  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setIsFormOpen(true);
  };

  // 削除処理
  const handleDelete = async (id: string) => {
    try {
      await deleteContent(id);
      setDeleteConfirm(null);
    } catch (err) {
      // エラーはhook内で処理される
    }
  };

  // プラン表示用の色
  const getPlanBadgeColor = (plan: MemberPlan) => {
    switch(plan) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // タイプ表示用のアイコン
  const getTypeIcon = (type: Content['type']) => {
    switch(type) {
      case 'video':
        return '🎥';
      case 'document':
        return '📄';
      default:
        return '📝';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{messages.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* ヘッダー */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            {messages.admin.contentManagement}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {messages.admin.contentList}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingContent(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {messages.admin.addNewContent}
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* フィルター */}
      <div className="mt-6">
        <label htmlFor="planFilter" className="block text-sm font-medium text-gray-700">
          {messages.admin.filterByPlan}
        </label>
        <select
          id="planFilter"
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value as MemberPlan | 'all')}
          className="mt-1 block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">{messages.admin.allPlans}</option>
          <option value="individual">{messages.membership.individual}</option>
          <option value="business">{messages.membership.business}</option>
          <option value="platinum">{messages.membership.platinum}</option>
        </select>
      </div>

      {/* フォーム（モーダル） */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingContent ? messages.contents.editContent : messages.contents.createContent}
              </h3>
              <ContentForm
                content={editingContent || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingContent(null);
                }}
                isLoading={actionLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* コンテンツテーブル */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.contents.contentType}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.contents.contentTitle}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.contents.contentCategory}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.contents.requiredPlanLabel}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.contents.createdAt}
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">{messages.admin.actions}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredContents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                        {messages.contents.noContents}
                      </td>
                    </tr>
                  ) : (
                    filteredContents.map((content) => (
                      <tr key={content.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          <span className="text-2xl">{getTypeIcon(content.type)}</span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{content.title}</div>
                            <div className="text-gray-500 line-clamp-1">{content.description}</div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {content.category}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getPlanBadgeColor(content.requiredPlan)}`}>
                            {content.requiredPlan.toUpperCase()}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {content.createdAt ? new Date(content.createdAt).toLocaleDateString('ja-JP') : '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(content)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            {messages.common.edit}
                          </button>
                          {deleteConfirm === content.id ? (
                            <span>
                              <button
                                onClick={() => handleDelete(content.id)}
                                disabled={actionLoading}
                                className="text-red-600 hover:text-red-900 mr-2"
                              >
                                {actionLoading ? messages.admin.deleting : messages.common.confirm}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                {messages.common.cancel}
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(content.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {messages.common.delete}
                            </button>
                          )}
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