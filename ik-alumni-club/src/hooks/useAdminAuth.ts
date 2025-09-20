import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// 管理者権限チェック用カスタムフック
export const useAdminAuth = (redirectTo = '/login') => {
  const { member, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!member) {
        // 未ログインの場合
        console.error('ログインが必要です');
        router.push(redirectTo);
      } else if (member.role !== 'admin') {
        // 管理者権限がない場合
        console.error('管理者権限が必要です');
        router.push('/dashboard'); // 通常のダッシュボードへ
      }
    }
  }, [member, loading, router, redirectTo]);

  return {
    member,
    loading,
    isAdmin: member?.role === 'admin',
    isAuthenticated: !!member,
  };
};

// 権限チェックのみ（リダイレクトなし）
export const useAdminCheck = () => {
  const { member, loading } = useAuth();
  
  return {
    member,
    loading,
    isAdmin: member?.role === 'admin',
    isAuthenticated: !!member,
    error: !loading && (!member ? 'ログインが必要です' : 
           member.role !== 'admin' ? '管理者権限が必要です' : null)
  };
};