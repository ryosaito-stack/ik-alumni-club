'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// 汎用的なコンテンツアイテムの型定義
interface ContentItem {
  id: string | number;
  title: string;
  createdAt: Date | string;
  category?: string;
  excerpt?: string;
  description?: string;
  isPremium?: boolean;
  readTime?: number;
  [key: string]: any; // 追加のプロパティに対応
}

// セクション設定の型定義
interface SectionConfig {
  title: string;
  viewAllLink: string;
  badge?: {
    text: string;
    color: 'yellow' | 'green' | 'blue' | 'red' | 'indigo';
  };
  categoryBadgeColor?: string;
  itemLinkPrefix: string;
  emptyMessage: string;
  showReadTime?: boolean;
}

interface ContentGridSectionProps {
  leftSection: {
    config: SectionConfig;
    items: ContentItem[];
    loading: boolean;
  };
  rightSection: {
    config: SectionConfig;
    items: ContentItem[];
    loading: boolean;
  };
}

// バッジカラーのマッピング
const badgeColors = {
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  indigo: 'bg-indigo-100 text-indigo-800',
};

export default function ContentGridSection({ leftSection, rightSection }: ContentGridSectionProps) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.1 });

  const renderSection = (section: typeof leftSection | typeof rightSection) => {
    const { config, items, loading } = section;

    return (
      <div>
        <div 
          className={`flex justify-between items-center ${sectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`} 
          style={{ marginBottom: '60px' }}
        >
          <div className="flex items-center gap-4">
            <h2 className="font-bold tracking-wider font-3d" style={{ fontSize: '40px' }}>
              {config.title}
            </h2>
            {config.badge && (
              <span className={`px-3 py-1 ${badgeColors[config.badge.color]} text-xs md:text-sm rounded font-medium`}>
                {config.badge.text}
              </span>
            )}
          </div>
          <Link 
            href={config.viewAllLink} 
            className="text-sm font-3d text-black hover:text-gray-700 transition-colors duration-300"
          >
            VIEW ALL
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500">{config.emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={`${config.itemLinkPrefix}/${item.id}`}
                className="block transition-opacity duration-300 cursor-pointer hover:opacity-60"
                style={{ paddingTop: '15px', paddingBottom: '15px', animationDelay: `${index * 100 + 300}ms` }}
              >
                <div className="text-black text-sm mb-2">
                  {new Date(item.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).replace(/\//g, '.')}
                </div>
                <h3 className="text-lg font-semibold">
                  {item.title}
                  {item.isPremium && (
                    <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      PREMIUM
                    </span>
                  )}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section ref={sectionRef} style={{ marginBottom: '150px' }}>
      <div className="mx-auto" style={{ padding: '0 5%' }}>
        <div className="grid md:grid-cols-2 gap-16">
          {renderSection(leftSection)}
          {renderSection(rightSection)}
        </div>
      </div>
    </section>
  );
}