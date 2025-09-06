'use client';

import { ReactNode } from 'react';

interface ListPageContentProps {
  loading: boolean;
  items: any[];
  emptyMessage?: string;
  layout?: 'grid' | 'list';
  gridCols?: string;
  children: (item: any, index: number) => ReactNode;
  className?: string;
}

export default function ListPageContent({
  loading,
  items,
  emptyMessage = 'データがありません',
  layout = 'grid',
  gridCols = 'grid-cols-1 md:grid-cols-2 gap-6',
  children,
  className = ''
}: ListPageContentProps) {

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        読み込み中...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <section className={className}>
        <ul className="list list--information">
          {items.map((item, index) => (
            <li 
              key={item.id || index}
              className="list__item"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {children(item, index)}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <div className={`grid ${gridCols} ${className}`}>
      {items.map((item, index) => (
        <div key={item.id || index} style={{ animationDelay: `${index * 50}ms` }}>
          {children(item, index)}
        </div>
      ))}
    </div>
  );
}