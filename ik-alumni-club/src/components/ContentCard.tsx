'use client';

import Link from 'next/link';
import { Content } from '@/types';
import { 
  getCardClasses, 
  getMemberPlanBadgeClass,
  colors,
  typography,
  spacing,
  components
} from '@/constants/design-tokens';

interface ContentCardProps {
  content: Content;
  showPlanBadge?: boolean;
}

// コンテンツタイプのアイコンを取得
function getContentTypeIcon(type: Content['type']): string {
  switch (type) {
    case 'article':
      return '📄';
    case 'video':
      return '🎥';
    case 'document':
      return '📁';
    default:
      return '📋';
  }
}

// 日付フォーマット
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function ContentCard({ content, showPlanBadge = true }: ContentCardProps) {
  return (
    <Link href={`/contents/${content.id}`}>
      <div className={`${getCardClasses()} hover:shadow-lg transition-shadow cursor-pointer`}>
        <div className={components.card.padding}>
          {/* ヘッダー部分 */}
          <div className={`${spacing.margin.bottom.md}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={typography.fontSize.xl}>
                    {getContentTypeIcon(content.type)}
                  </span>
                  <h3 className={`${typography.fontSize.lg} ${typography.fontWeight.semibold} ${colors.text.primary}`}>
                    {content.title}
                  </h3>
                </div>
              </div>
              {showPlanBadge && (
                <span className={`${components.badge.base} ${getMemberPlanBadgeClass(content.requiredPlan)}`}>
                  {content.requiredPlan.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* 説明文 */}
          <p className={`${typography.fontSize.sm} ${colors.text.muted} ${spacing.margin.bottom.md}`}>
            {content.description}
          </p>

          {/* メタ情報 */}
          <div className={`flex items-center justify-between ${typography.fontSize.xs} text-gray-500`}>
            <div className="flex items-center gap-4">
              <span>{content.author}</span>
              <span>{formatDate(content.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              {content.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className={`${components.badge.base} bg-gray-100 text-gray-500 text-xs`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}