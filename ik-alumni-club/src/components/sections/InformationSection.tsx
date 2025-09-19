'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import { useAvailableInformations } from '@/hooks/useInformations';
import { useAuth } from '@/hooks/useAuth';

export default function InformationSection() {
  const { member } = useAuth();
  const { informations, loading, error } = useAvailableInformations({
    limit: 3,
    orderBy: 'date',
    orderDirection: 'desc',
  });

  // デバッグ用ログ
  useEffect(() => {
    console.log('InformationSection - loading:', loading);
    console.log('InformationSection - informations:', informations);
    console.log('InformationSection - error:', error);
  }, [loading, informations, error]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'お知らせ':
        return 'text-indigo-600';
      case '更新情報':
        return 'text-green-600';
      case 'メンテナンス':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  return (
    <Section
      id="information"
      title="INFORMATION"
      viewAllLink="/news"
    >
      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            読み込み中...
          </div>
        ) : informations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            お知らせはありません
          </div>
        ) : (
          informations.map((item, index) => (
            <div 
              key={item.id} 
              className="transition-opacity duration-300 cursor-pointer hover:opacity-60"
              style={{ paddingTop: '15px', paddingBottom: '15px', animationDelay: `${index * 100 + 300}ms` }}
            >
              <div className="text-black" style={{ fontSize: '13px', marginBottom: '10px' }}>
                {formatDate(item.date)}
              </div>
              <h3 className="font-semibold" style={{ fontSize: '14px' }}>
                {item.title}
              </h3>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}