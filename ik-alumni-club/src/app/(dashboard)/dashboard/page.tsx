'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { messages } from '@/constants/messages';
import { 
  components, 
  typography, 
  spacing, 
  colors, 
  layout, 
  responsive,
  getMemberPlanBadgeClass, 
  getButtonClasses, 
  getCardClasses 
} from '@/constants/design-tokens';

export default function DashboardPage() {
  const router = useRouter();
  const { user, member, loading, logout, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        // 管理者でない場合はホームページへリダイレクト
        router.push('/');
      }
    }
  }, [loading, user, isAdmin, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className={`${layout.size.minHeight.screen} ${layout.display.flex} ${layout.flex.align.center} ${layout.flex.justify.center}`}>
        <div className={typography.fontSize.lg}>{messages.common.loading}</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }


  return (
    <div className={components.page.main}>
      <div className={components.page.header}>
        <h1 className={components.page.title}>
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className={getButtonClasses('danger', 'md')}
        >
          {messages.auth.logout}
        </button>
      </div>

      <div className={spacing.space.y.lg}>
        <div className={getCardClasses()}>
          <div className={components.card.padding}>
            <h2 className={`${typography.fontSize.lg} ${typography.fontWeight.medium} ${colors.text.primary} ${spacing.margin.bottom.md}`}>
              {messages.dashboard.welcome}!
            </h2>
            
            <div className={`${layout.display.grid} ${responsive.patterns.gridCols.mobile1Desktop2} ${spacing.gap.md}`}>
              <div>
                <dt className={`${typography.fontSize.sm} ${typography.fontWeight.medium} ${colors.text.muted}`}>
                  {messages.profile.displayName}
                </dt>
                <dd className={`${spacing.margin.top.xs} ${typography.fontSize.sm} ${colors.text.primary}`}>
                  {member?.displayName || user?.displayName || messages.common.noData}
                </dd>
              </div>
              
              <div>
                <dt className={`${typography.fontSize.sm} ${typography.fontWeight.medium} ${colors.text.muted}`}>
                  {messages.auth.email}
                </dt>
                <dd className={`${spacing.margin.top.xs} ${typography.fontSize.sm} ${colors.text.primary}`}>
                  {user?.email}
                </dd>
              </div>
              
              <div>
                <dt className={`${typography.fontSize.sm} ${typography.fontWeight.medium} ${colors.text.muted}`}>
                  {messages.membership.plan}
                </dt>
                <dd className="mt-1">
                  <span className={`${components.badge.base} ${getMemberPlanBadgeClass(member?.plan || '')}`}>
                    {member?.plan?.toUpperCase() || 'INDIVIDUAL'}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className={`${typography.fontSize.sm} ${typography.fontWeight.medium} ${colors.text.muted}`}>
                  ID
                </dt>
                <dd className={`${spacing.margin.top.xs} ${typography.fontSize.xs} ${colors.text.primary} font-mono`}>
                  {user?.uid}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}