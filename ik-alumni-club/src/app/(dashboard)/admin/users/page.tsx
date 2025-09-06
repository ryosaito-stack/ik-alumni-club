'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UserEditModal from '@/components/admin/UserEditModal';
import { Member, MemberPlan } from '@/types';
import { messages } from '@/constants/messages';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser, member: currentMember } = useAuth();
  const { 
    users, 
    loading, 
    error, 
    actionLoading,
    updatePlan,
    updateRole,
    deleteUser,
    refreshUsers 
  } = useAdminUsers();

  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'member'>('all');
  const [editingUser, setEditingUser] = useState<Member | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 管理者チェック
  useEffect(() => {
    if (currentMember && currentMember.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [currentMember, router]);

  // フィルター済みユーザー
  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => {
        if (filterRole === 'admin') return u.role === 'admin';
        return u.role !== 'admin';
      });

  // ユーザー削除処理
  const handleDelete = async (uid: string) => {
    // 自分自身は削除できない
    if (uid === currentUser?.uid) {
      alert('自分自身は削除できません');
      setDeleteConfirm(null);
      return;
    }

    const success = await deleteUser(uid);
    if (success) {
      setDeleteConfirm(null);
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

  // ロール表示用の色
  const getRoleBadgeColor = (role?: string) => {
    return role === 'admin' 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-green-100 text-green-800';
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
            {messages.admin.userManagement}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {messages.admin.userList}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={refreshUsers}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            更新
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
        <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700">
          {messages.admin.filterByRole}
        </label>
        <select
          id="roleFilter"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'member')}
          className="mt-1 block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">{messages.admin.allRoles}</option>
          <option value="admin">{messages.navigation.admin}</option>
          <option value="member">{messages.admin.member}</option>
        </select>
      </div>

      {/* 編集モーダル */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onUpdatePlan={updatePlan}
          onUpdateRole={updateRole}
          onClose={() => setEditingUser(null)}
          isLoading={actionLoading}
        />
      )}

      {/* ユーザーテーブル */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ユーザー
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.membership.plan}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ロール
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.profile.company}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {messages.admin.registeredDate}
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">{messages.admin.actions}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                        {messages.admin.noUsers}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.uid}>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {user.displayName || '未設定'}
                              {user.uid === currentUser?.uid && (
                                <span className="ml-2 text-xs text-gray-500">(自分)</span>
                              )}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                            {user.bio && (
                              <div className="text-gray-400 text-xs line-clamp-1">{user.bio}</div>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getPlanBadgeColor(user.plan)}`}>
                            {user.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role === 'admin' ? messages.navigation.admin : messages.admin.member}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {user.company || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ja-JP') : '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            disabled={user.uid === currentUser?.uid}
                          >
                            {messages.common.edit}
                          </button>
                          {user.uid !== currentUser?.uid && (
                            deleteConfirm === user.uid ? (
                              <span>
                                <button
                                  onClick={() => handleDelete(user.uid)}
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
                                onClick={() => setDeleteConfirm(user.uid)}
                                className="text-red-600 hover:text-red-900"
                              >
                                {messages.common.delete}
                              </button>
                            )
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

      {/* 統計情報 */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {messages.admin.totalUsers}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {users.length}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              管理者数
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {users.filter(u => u.role === 'admin').length}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              プラチナ会員
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {users.filter(u => u.plan === 'platinum').length}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}