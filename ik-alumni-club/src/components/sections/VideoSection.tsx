'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/Section';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCarouselVideos } from '@/hooks/useVideos';


export default function VideoSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { ref: videoRef, isVisible: videoVisible } = useScrollAnimation({ threshold: 0.2 });
  
  // Firestoreからカルーセル用動画を取得
  const { videos, loading } = useCarouselVideos(5);

  // ビデオカルーセルの自動再生
  useEffect(() => {
    if (videos.length > 0) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [videos.length]);

  return (
    <Section
      id="video"
      title="VIDEO"
      viewAllLink="/videos"
    >
      {/* メインビデオカルーセル */}
      <div className="mb-12 max-w-4xl mx-auto" ref={videoRef}>
        {loading ? (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">動画がありません</p>
          </div>
        ) : (
          <>
            <div className={`${videoVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <div className="relative flex items-center">
                {/* 左側のカルーセルコントロール */}
                {videos.length > 1 && (
                  <button 
                    onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)}
                    className="absolute -left-16 z-10 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 hover:scale-110 transform"
                    aria-label="Previous video"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div className="relative w-full">
                  {/* YouTube埋め込み or サムネイル */}
                  {videos[currentVideoIndex]?.videoUrl && (
                    (() => {
                      // YouTubeのURLからIDを抽出
                      const url = videos[currentVideoIndex].videoUrl;
                      let youtubeId = '';
                      
                      if (url?.includes('youtube.com/watch?v=')) {
                        youtubeId = url.split('watch?v=')[1]?.split('&')[0] || '';
                      } else if (url?.includes('youtu.be/')) {
                        youtubeId = url.split('youtu.be/')[1]?.split('?')[0] || '';
                      } else if (url?.includes('youtube.com/embed/')) {
                        youtubeId = url.split('embed/')[1]?.split('?')[0] || '';
                      }
                      
                      if (youtubeId) {
                        return (
                          <div className="relative w-full aspect-video">
                            <iframe 
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&playsinline=1&enablejsapi=1`}
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              title={videos[currentVideoIndex].title}
                              style={{ border: 'none' }}
                            />
                          </div>
                        );
                      } else {
                        // YouTubeのIDが取得できない場合はサムネイル表示
                        return (
                          <div className="relative aspect-video bg-gray-900 overflow-hidden">
                            {videos[currentVideoIndex]?.thumbnail ? (
                              <img 
                                src={videos[currentVideoIndex].thumbnail} 
                                alt={videos[currentVideoIndex].title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
                            )}
                          </div>
                        );
                      }
                    })()
                  )}
                </div>

                {/* 右側のカルーセルコントロール */}
                {videos.length > 1 && (
                  <button 
                    onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
                    className="absolute -right-16 z-10 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 hover:scale-110 transform"
                    aria-label="Next video"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* タイトル表示 */}
              <div className="block--txt mt-10">
                <p className="tit text-left text-lg font-semibold">{videos[currentVideoIndex]?.title}</p>
              </div>
            </div>

            {/* インジケーター */}
            {videos.length > 1 && (
              <div className={`flex justify-center gap-2 ${videoVisible ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}>
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentVideoIndex 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to video ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
}