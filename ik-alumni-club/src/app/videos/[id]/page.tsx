'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import DetailLayout from '@/components/DetailLayout';
import { useVideo } from '@/hooks/useVideos';

// YouTube URLを埋め込み用URLに変換
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // YouTube通常URLパターン
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // すでに埋め込みURL形式の場合
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // その他のビデオURLの場合はそのまま返す
  return url;
}

export default function VideoDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Firestoreから動画データを取得
  const { video, loading } = useVideo(id);

  if (loading) {
    return (
      <DetailLayout
        title="読み込み中..."
        date=""
        hideDate={true}
        showShareButtons={false}
        backLink="/videos"
        backText="BACK"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </DetailLayout>
    );
  }

  if (!video) {
    return (
      <DetailLayout
        title="動画が見つかりません"
        date=""
        hideDate={true}
        showShareButtons={false}
        backLink="/videos"
        backText="BACK"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">指定された動画が見つかりませんでした。</p>
          <Link 
            href="/videos"
            className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            動画一覧に戻る
          </Link>
        </div>
      </DetailLayout>
    );
  }

  const embedUrl = getEmbedUrl(video.videoUrl || '');

  // ビデオプレーヤーコンポーネント
  const videoPlayer = (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {embedUrl && embedUrl.includes('youtube.com/embed/') ? (
        // YouTube埋め込み
        <iframe
          src={embedUrl}
          title={video.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : embedUrl ? (
        // 通常のビデオファイル
        <video
          src={embedUrl}
          controls
          className="absolute inset-0 w-full h-full"
          poster={video.thumbnail}
        >
          お使いのブラウザは動画再生に対応していません。
        </video>
      ) : video.thumbnail ? (
        // サムネイルのみ表示
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        // プレースホルダー
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <p className="text-lg font-medium">動画が利用できません</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DetailLayout
      title={video.title}
      date=""
      hideDate={true}
      showShareButtons={true}
      backLink="/videos"
      backText="BACK"
      beforeTitle={videoPlayer}
    >
      <div />
    </DetailLayout>
  );
}