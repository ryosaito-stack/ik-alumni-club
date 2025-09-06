'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Content } from '@/types';
import { getContentsForPlan, getAllContents } from '@/lib/firestore';

export function useContents() {
  const { member } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContents() {
      if (!member) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // 管理者の場合は全コンテンツ、一般会員の場合はプランに応じたコンテンツを取得
        const fetchedContents = member.role === 'admin' 
          ? await getAllContents()
          : await getContentsForPlan(member.plan);
        
        setContents(fetchedContents);
      } catch (err) {
        console.error('Error fetching contents:', err);
        setError('コンテンツの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchContents();
  }, [member]);

  return { contents, loading, error };
}