import { useState, useEffect } from 'react';

export interface Newsletter {
  id: string | number;
  title: string;
  description: string;
  excerpt?: string;
  category?: string;
  isPremium?: boolean;
  createdAt: Date;
  date?: string;
}

// 仮の会報データ
const mockNewsletterData: Newsletter[] = [
  {
    id: 1,
    title: '2025年1月号 - 新年のご挨拶',
    description: '新年のご挨拶と今年の活動方針についてお知らせします。',
    excerpt: '新年あけましておめでとうございます。本年もIK ALUMNI CGTをよろしくお願いいたします。',
    category: 'MONTHLY',
    isPremium: false,
    createdAt: new Date('2025-01-15'),
    date: '2025.01.15',
  },
  {
    id: 2,
    title: '2024年度 年次報告書',
    description: '2024年度の活動総括と財務報告をお届けします。',
    excerpt: '2024年度のIK ALUMNI CGTの活動を振り返り、財務状況と来年度の計画についてご報告いたします。',
    category: 'ANNUAL',
    isPremium: false,
    createdAt: new Date('2024-12-20'),
    date: '2024.12.20',
  },
  {
    id: 3,
    title: '特別号：全国大会優勝記念',
    description: '全国大会での優勝を記念した特別号です。',
    excerpt: '全国大会での優勝という快挙を達成しました！選手たちの努力の軌跡を振り返ります。',
    category: 'SPECIAL',
    isPremium: true,
    createdAt: new Date('2024-11-20'),
    date: '2024.11.20',
  },
];

// 会報データを取得するカスタムフック（仮データを使用）
export function useNewsletters(limit?: number) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 仮データを使用してシミュレート
    setTimeout(() => {
      const data = limit ? mockNewsletterData.slice(0, limit) : mockNewsletterData;
      setNewsletters(data);
      setLoading(false);
    }, 500); // ローディングの演出
  }, [limit]);

  return { newsletters, loading, error };
}