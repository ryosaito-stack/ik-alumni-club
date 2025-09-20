'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useBlogArticles } from '@/hooks/useBlogs';
import { useNewslettersList } from '@/hooks/newsletters/user';

export default function BlogSection() {
  const { ref: blogRef, isVisible: blogVisible } = useScrollAnimation({ threshold: 0.1 });
  const { articles, loading } = useBlogArticles(3); // 最新3件を取得
  const { newsletters, loading: newslettersLoading } = useNewslettersList({ limit: 3 }); // 最新3件の会報を取得

  return (
    <section ref={blogRef} style={{ marginBottom: '150px' }}>
      <div className="mx-auto" style={{ padding: '0 5%' }}>
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* BLOG セクション */}
          <div>
            <div className={`flex justify-between items-center ${blogVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ marginBottom: '60px' }}>
              <div className="flex items-center gap-4">
                <h2 className="font-bold tracking-wider font-3d" style={{ fontSize: '40px' }}>BLOG</h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs md:text-sm rounded font-medium">会員限定</span>
              </div>
              <Link 
                href="/blog" 
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
            ) : articles.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">記事がありません</p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.id}`}
                    className={`block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                      blogVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${(index + 1) * 100 + 300}ms` }}
                  >
                    <p className="text-sm text-gray-600 mb-2 transition-colors duration-300 group-hover:text-indigo-600">
                      {new Date(article.createdAt).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                      {article.category && (
                        <span className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
                          {article.category}
                        </span>
                      )}
                    </p>
                    <h4 className="font-semibold mb-2 transition-colors duration-300 hover:text-indigo-600">
                      {article.title}
                      {article.isPremium && (
                        <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          PREMIUM
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 transition-colors duration-300 line-clamp-2">
                      {article.excerpt || article.description}
                    </p>
                    {article.readTime && (
                      <p className="text-xs text-gray-500 mt-2">
                        読了時間: {article.readTime}分
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* NEWSLETTERS セクション */}
          <div>
            <div className={`flex justify-between items-center ${blogVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ marginBottom: '60px' }}>
              <div className="flex items-center gap-4">
                <h2 className="font-bold tracking-wider font-3d" style={{ fontSize: '40px' }}>NEWSLETTERS</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs md:text-sm rounded font-medium">会員限定</span>
              </div>
              <Link 
                href="/newsletters" 
                className="text-sm font-3d text-black hover:text-gray-700 transition-colors duration-300"
              >
                VIEW ALL
              </Link>
            </div>
            
            {newslettersLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-6 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : newsletters.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">会報がありません</p>
              </div>
            ) : (
              <div className="space-y-6">
                {newsletters.map((newsletter, index) => (
                  <Link
                    key={newsletter.id}
                    href={`/newsletters/${newsletter.id}`}
                    className={`block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                      blogVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${(index + 1) * 100 + 300}ms` }}
                  >
                    <p className="text-sm text-gray-600 mb-2 transition-colors duration-300 group-hover:text-indigo-600">
                      {new Date(newsletter.createdAt).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                      {newsletter.category && (
                        <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                          {newsletter.category}
                        </span>
                      )}
                    </p>
                    <h4 className="font-semibold mb-2 transition-colors duration-300 hover:text-indigo-600">
                      {newsletter.title}
                      {newsletter.isPremium && (
                        <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          PREMIUM
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 transition-colors duration-300 line-clamp-2">
                      {newsletter.excerpt || newsletter.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}