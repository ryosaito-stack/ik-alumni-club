'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InformationSection from '@/components/sections/InformationSection';
import ScheduleSection from '@/components/sections/ScheduleSection';
import VideoSection from '@/components/sections/VideoSection';
import ContentGridSection from '@/components/sections/ContentGridSection';
import { useBlogArticles } from '@/hooks/useBlogs';
import { useNewsletters } from '@/hooks/useNewsletters';

export default function LandingPage() {
  const { articles: blogArticles, loading: blogLoading } = useBlogArticles(3);
  const { newsletters, loading: newslettersLoading } = useNewsletters(3);

  return (
    <div className="min-h-screen bg-white">
      {/* ヒーローセクション（フルスクリーン） */}
      <section className="relative h-screen" style={{ marginBottom: '150px' }}>
        {/* 背景画像 */}
        <Image
          src="/images/hero-bg.jpg"
          alt="IK Alumni Club Hero Background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* ヘッダーコンポーネント（透明背景） */}
        <Header transparent={true} />

        {/* ヒーローコンテンツ */}
        <div className="relative h-full flex flex-col justify-end pb-24 md:pb-32 text-center px-4">
          <div className="max-w-5xl mx-auto w-full">
            {/* デスクトップは上部ナビに表示、モバイルはここに表示 */}
            <div className="md:hidden flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animation-delay-500">
              <Link href="/signup" className="px-6 py-3 bg-white text-indigo-600 rounded-full text-base font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                無料会員登録
              </Link>
              <Link href="/login" className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-full text-base font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:scale-105">
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* INFORMATIONセクション */}
      <InformationSection />

      {/* SCHEDULEセクション */}
      <ScheduleSection />

      {/* VIDEOセクション */}
      <VideoSection />

      {/* コンテンツグリッドセクション（BLOG & NEWSLETTERS） */}
      <ContentGridSection
        leftSection={{
          config: {
            title: 'BLOG',
            viewAllLink: '/blog',
            badge: { text: '会員限定', color: 'yellow' },
            itemLinkPrefix: '/blog',
            emptyMessage: '記事がありません',
            showReadTime: true,
            categoryBadgeColor: 'bg-indigo-100 text-indigo-600'
          },
          items: blogArticles,
          loading: blogLoading
        }}
        rightSection={{
          config: {
            title: 'NEWSLETTERS',
            viewAllLink: '/newsletters',
            badge: { text: '会員限定', color: 'green' },
            itemLinkPrefix: '/newsletters',
            emptyMessage: '会報がありません',
            categoryBadgeColor: 'bg-green-100 text-green-600'
          },
          items: newsletters,
          loading: newslettersLoading
        }}
      />

      {/* フッターコンポーネント */}
      <Footer />
    </div>
  );
}