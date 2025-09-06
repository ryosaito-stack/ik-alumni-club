'use client';

import { useState, useEffect } from 'react';
import { Content } from '@/types';
import { 
  getContents, 
  createContent, 
  updateContent, 
  deleteContent 
} from '@/lib/firestore';
import { messages } from '@/constants/messages';

export function useAdminContents() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // コンテンツ一覧を取得
  const fetchContents = async () => {
    setLoading(true);
    setError(null);
    try {
      // 管理者は全コンテンツを取得（プラン制限なし）
      const allContents = await getContents();
      setContents(allContents);
    } catch (err) {
      console.error('Failed to fetch contents:', err);
      setError(messages.contents.fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  // コンテンツ作成
  const handleCreateContent = async (contentData: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => {
    setActionLoading(true);
    setError(null);
    try {
      const newContent = await createContent(contentData);
      setContents(prev => [newContent, ...prev]);
      return newContent;
    } catch (err) {
      console.error('Failed to create content:', err);
      setError(messages.errors.general);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // コンテンツ更新
  const handleUpdateContent = async (id: string, contentData: Partial<Content>) => {
    setActionLoading(true);
    setError(null);
    try {
      await updateContent(id, contentData);
      setContents(prev => 
        prev.map(content => 
          content.id === id 
            ? { ...content, ...contentData, updatedAt: new Date() }
            : content
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to update content:', err);
      setError(messages.errors.general);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // コンテンツ削除
  const handleDeleteContent = async (id: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await deleteContent(id);
      setContents(prev => prev.filter(content => content.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete content:', err);
      setError(messages.admin.deleteError);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    contents,
    loading,
    error,
    actionLoading,
    refreshContents: fetchContents,
    createContent: handleCreateContent,
    updateContent: handleUpdateContent,
    deleteContent: handleDeleteContent,
  };
}