'use client';

import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';
import { usePublishedVideos } from '@/hooks/useVideos';

export default function VideosPage() {
  // Firestoreから公開済み動画を取得
  const { videos, loading } = usePublishedVideos({
    orderBy: 'date',
    orderDirection: 'desc',
  });

  return (
    <ViewAllLayout title="VIDEO" bgColor="white" maxWidth="6xl">
      <ListPageContent
        loading={loading}
        items={videos}
        emptyMessage="該当する動画がありません"
        layout="grid"
        gridCols="grid-cols-1 md:grid-cols-2 gap-6"
      >
        {(video) => (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="group block mb-10"
          >
            {/* サムネイル */}
            <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              {video.thumbnail && (
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:brightness-50 transition-all duration-300"
                  loading="lazy"
                />
              )}
              
              {/* プレイアイコン */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-indigo-600 ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* タイトル */}
            <h3 className="mt-5 text-left font-semibold text-gray-800">
              {video.title}
            </h3>
            
            {/* 日付 */}
            <p className="mt-2.5 text-left text-sm text-gray-500">
              {new Date(video.date).toLocaleDateString('ja-JP')}
            </p>
          </Link>
        )}
      </ListPageContent>
    </ViewAllLayout>
  );
}