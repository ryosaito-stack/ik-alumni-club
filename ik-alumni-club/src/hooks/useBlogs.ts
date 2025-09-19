import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getBlog,
  getBlogs,
  getPublishedBlogs,
  getLatestBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '@/lib/firestore/blogs';
import { Blog, BlogFormData, BlogQueryOptions } from '@/types';

// 単一のBlog記事を取得するフック
export const useBlog = (id: string) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlog(id);
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blog'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  return { blog, loading, error };
};

// Blogのリストを取得するフック
export const useBlogs = (options: BlogQueryOptions = {}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogs(options);
        setBlogs(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blogs'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [JSON.stringify(options)]);

  return { blogs, loading, error };
};

// 公開済みBlogを取得するフック
export const usePublishedBlogs = (options: BlogQueryOptions = {}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getPublishedBlogs(options);
        setBlogs(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blogs'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [JSON.stringify(options)]);

  return { blogs, loading, error };
};

// 最新のBlog記事を取得するフック
export const useLatestBlogs = (limit: number = 3) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getLatestBlogs(limit);
        setBlogs(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch latest blogs'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [limit]);

  return { blogs, loading, error };
};

// Blog CRUD操作用フック
export const useBlogMutations = () => {
  const { user, member } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBlogHandler = async (data: BlogFormData): Promise<string | null> => {
    if (!user || !member) {
      setError(new Error('User not authenticated'));
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const author = {
        id: user.uid,
        name: `${member.lastName} ${member.firstName}` || 'Unknown',
        role: member.role || 'member',
      };
      const id = await createBlog(data, author);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create blog'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogHandler = async (id: string, data: BlogFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await updateBlog(id, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update blog'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogHandler = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteBlog(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete blog'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBlog: createBlogHandler,
    updateBlog: updateBlogHandler,
    deleteBlog: deleteBlogHandler,
    loading,
    error,
  };
};