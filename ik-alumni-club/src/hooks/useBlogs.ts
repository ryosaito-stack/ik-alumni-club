import { useState, useEffect } from 'react';
import { Content, BlogCategory } from '@/types';
import { getBlogArticles, getContentById } from '@/lib/firestore';

// ブログ記事一覧を取得するフック
export function useBlogArticles(limit?: number) {
  const [articles, setArticles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getBlogArticles(limit);
        setArticles(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching blog articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  return { articles, loading, error };
}

// 特定のブログ記事を取得するフック
export function useBlogArticle(id: string) {
  const [article, setArticle] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getContentById(id);
        // articleタイプのみ取得
        if (data && data.type === 'article') {
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching blog article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
}

// カテゴリ別にフィルタリングされたブログ記事を取得するフック
export function useBlogArticlesByCategory(category?: BlogCategory | 'all') {
  const { articles, loading, error } = useBlogArticles();
  
  const filteredArticles = category && category !== 'all' 
    ? articles.filter(article => article.category === category)
    : articles;
    
  return { articles: filteredArticles, loading, error };
}