'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContents } from '@/hooks/useContents';
import { ContentCard } from '@/components/ContentCard';
import { messages } from '@/constants/messages';
import {
  components,
  typography,
  spacing,
  layout,
  responsive,
} from '@/constants/design-tokens';

export default function ContentsPage() {
  const router = useRouter();
  const { user, member, loading: authLoading } = useAuth();
  const { contents, loading: contentsLoading, error } = useContents();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || contentsLoading) {
    return (
      <div className={`${layout.size.minHeight.screen} ${layout.display.flex} ${layout.flex.align.center} ${layout.flex.justify.center}`}>
        <div className={typography.fontSize.lg}>{messages.common.loading}</div>
      </div>
    );
  }

  if (!user || !member) {
    return null;
  }

  // プランごとにコンテンツをグループ化
  const contentsByPlan = {
    individual: contents.filter(c => c.requiredPlan === 'individual'),
    business: contents.filter(c => c.requiredPlan === 'business'),
    platinum: contents.filter(c => c.requiredPlan === 'platinum'),
  };

  return (
    <div className={components.page.main}>
      <div className={components.page.header}>
        <div>
          <h1 className={components.page.title}>
            {messages.contents.library}
          </h1>
          <p className={`${typography.fontSize.sm} text-gray-500 ${spacing.margin.top.sm}`}>
            {messages.contents.subtitle}
          </p>
        </div>
        <div className={`${components.badge.base} bg-indigo-600 text-white`}>
          {messages.contents.yourPlan}: {member.plan.toUpperCase()}
        </div>
      </div>

      {error && (
        <div className={`bg-red-50 text-red-800 p-4 mb-6 rounded-lg`}>
          {error}
        </div>
      )}

      {contents.length === 0 ? (
        <div className={`${layout.display.flex} ${layout.flex.align.center} ${layout.flex.justify.center} ${spacing.padding.xl}`}>
          <div className="text-center">
            <p className={`${typography.fontSize.lg} text-gray-500`}>
              {messages.contents.noContentsAvailable}
            </p>
            <p className={`${typography.fontSize.sm} text-gray-500 ${spacing.margin.top.sm}`}>
              {messages.contents.checkBackLater}
            </p>
          </div>
        </div>
      ) : (
        <div className={spacing.space.y.lg}>
          {/* Individual Plan Contents */}
          {contentsByPlan.individual.length > 0 && (
            <div>
              <h2 className={`${typography.fontSize.xl} ${typography.fontWeight.semibold} text-gray-900 ${spacing.margin.bottom.md}`}>
                {messages.contents.basicContents}
              </h2>
              <div className={`${layout.display.grid} ${responsive.patterns.gridCols.mobile1Desktop2} ${spacing.gap.md}`}>
                {contentsByPlan.individual.map((content) => (
                  <ContentCard key={content.id} content={content} showPlanBadge={false} />
                ))}
              </div>
            </div>
          )}

          {/* Business Plan Contents */}
          {contentsByPlan.business.length > 0 && member.plan !== 'individual' && (
            <div>
              <h2 className={`${typography.fontSize.xl} ${typography.fontWeight.semibold} text-gray-900 ${spacing.margin.bottom.md}`}>
                {messages.contents.businessContents}
              </h2>
              <div className={`${layout.display.grid} ${responsive.patterns.gridCols.mobile1Desktop2} ${spacing.gap.md}`}>
                {contentsByPlan.business.map((content) => (
                  <ContentCard key={content.id} content={content} showPlanBadge={false} />
                ))}
              </div>
            </div>
          )}

          {/* Platinum Plan Contents */}
          {contentsByPlan.platinum.length > 0 && member.plan === 'platinum' && (
            <div>
              <h2 className={`${typography.fontSize.xl} ${typography.fontWeight.semibold} text-gray-900 ${spacing.margin.bottom.md}`}>
                {messages.contents.platinumExclusive}
              </h2>
              <div className={`${layout.display.grid} ${responsive.patterns.gridCols.mobile1Desktop2} ${spacing.gap.md}`}>
                {contentsByPlan.platinum.map((content) => (
                  <ContentCard key={content.id} content={content} showPlanBadge={false} />
                ))}
              </div>
            </div>
          )}

          {/* 管理者の場合は全コンテンツを表示 */}
          {member.role === 'admin' && (
            <div>
              <h2 className={`${typography.fontSize.xl} ${typography.fontWeight.semibold} text-gray-900 ${spacing.margin.bottom.md} text-red-600`}>
                {messages.contents.adminViewAll}
              </h2>
              <div className={`${layout.display.grid} ${responsive.patterns.gridCols.mobile1Desktop2} ${spacing.gap.md}`}>
                {contents.map((content) => (
                  <ContentCard key={content.id} content={content} showPlanBadge={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}