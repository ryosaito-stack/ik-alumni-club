'use client';

import { useState } from 'react';
import { Member, MemberPlan } from '@/types';
import { messages } from '@/constants/messages';

interface UserEditModalProps {
  user: Member;
  onUpdatePlan: (uid: string, plan: MemberPlan) => Promise<boolean>;
  onUpdateRole: (uid: string, role: 'admin' | 'member') => Promise<boolean>;
  onClose: () => void;
  isLoading?: boolean;
}

export default function UserEditModal({ 
  user, 
  onUpdatePlan, 
  onUpdateRole, 
  onClose,
  isLoading 
}: UserEditModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<MemberPlan>(user.plan);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>(user.role || 'member');
  const [updateType, setUpdateType] = useState<'plan' | 'role'>('plan');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (updateType === 'plan' && selectedPlan !== user.plan) {
      success = await onUpdatePlan(user.uid, selectedPlan);
    } else if (updateType === 'role' && selectedRole !== user.role) {
      success = await onUpdateRole(user.uid, selectedRole);
    }
    
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {messages.admin.editUser}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.displayName || user.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 更新タイプ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                更新する項目
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="updateType"
                    value="plan"
                    checked={updateType === 'plan'}
                    onChange={(e) => setUpdateType(e.target.value as 'plan' | 'role')}
                    className="mr-2"
                  />
                  <span>{messages.admin.changePlan}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="updateType"
                    value="role"
                    checked={updateType === 'role'}
                    onChange={(e) => setUpdateType(e.target.value as 'plan' | 'role')}
                    className="mr-2"
                  />
                  <span>{messages.admin.changeRole}</span>
                </label>
              </div>
            </div>

            {/* プラン選択 */}
            {updateType === 'plan' && (
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                  {messages.membership.plan}
                </label>
                <select
                  id="plan"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as MemberPlan)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="individual">{messages.membership.individual}</option>
                  <option value="business">{messages.membership.business}</option>
                  <option value="platinum">{messages.membership.platinum}</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  現在: {user.plan.toUpperCase()}
                </p>
              </div>
            )}

            {/* ロール選択 */}
            {updateType === 'role' && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  ロール
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'member')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="member">{messages.admin.member}</option>
                  <option value="admin">{messages.navigation.admin}</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  現在: {user.role === 'admin' ? messages.navigation.admin : messages.admin.member}
                </p>
              </div>
            )}

            {/* ユーザー情報表示 */}
            <div className="bg-gray-50 p-3 rounded-md">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{messages.auth.email}:</dt>
                  <dd className="text-gray-900">{user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{messages.admin.registeredDate}:</dt>
                  <dd className="text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ja-JP') : '-'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {messages.common.cancel}
              </button>
              <button
                type="submit"
                disabled={isLoading || (
                  (updateType === 'plan' && selectedPlan === user.plan) ||
                  (updateType === 'role' && selectedRole === user.role)
                )}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? messages.admin.updating : messages.common.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}