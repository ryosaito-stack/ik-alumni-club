'use client';

import { useState, useEffect } from 'react';
import { Member, MemberPlan } from '@/types';
import { 
  getAllMembers,
  updateMemberPlan,
  updateMemberRole,
  deleteMember
} from '@/lib/firestore';
import { messages } from '@/constants/messages';

export function useAdminUsers() {
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await getAllMembers();
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(messages.errors.general);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // プラン変更
  const handleUpdatePlan = async (uid: string, newPlan: MemberPlan) => {
    setActionLoading(true);
    setError(null);
    try {
      await updateMemberPlan(uid, newPlan);
      setUsers(prev => 
        prev.map(user => 
          user.uid === uid 
            ? { ...user, plan: newPlan, updatedAt: new Date() }
            : user
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to update user plan:', err);
      setError(messages.admin.userUpdateError);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ロール変更
  const handleUpdateRole = async (uid: string, newRole: 'admin' | 'member') => {
    setActionLoading(true);
    setError(null);
    try {
      await updateMemberRole(uid, newRole);
      setUsers(prev => 
        prev.map(user => 
          user.uid === uid 
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError(messages.admin.userUpdateError);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ユーザー削除
  const handleDeleteUser = async (uid: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await deleteMember(uid);
      setUsers(prev => prev.filter(user => user.uid !== uid));
      return true;
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(messages.admin.userDeleteError);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    actionLoading,
    refreshUsers: fetchUsers,
    updatePlan: handleUpdatePlan,
    updateRole: handleUpdateRole,
    deleteUser: handleDeleteUser,
  };
}