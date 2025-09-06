'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ViewAllLayoutProps {
  children: ReactNode;
  title: string; // ViewAllページでは必須
  className?: string;
  bgColor?: 'white' | 'gray';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
}

export default function ViewAllLayout({
  children,
  title,
  className = '',
  bgColor = 'white',
  maxWidth = '6xl'
}: ViewAllLayoutProps) {
  const bgClass = bgColor === 'gray' ? 'bg-gray-50' : 'bg-white';
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      <Header />
      
      <main className="flex-grow" style={{ paddingTop: '180px', paddingBottom: '80px' }}>
        <div className={`container mx-auto px-8 ${maxWidthClasses[maxWidth]}`}>
          {/* ページタイトル - ViewAllでは必須 */}
          <section className="px-4" style={{ marginBottom: '60px' }}>
            <h1 className="font-bold tracking-wider font-3d" style={{ fontSize: '40px', lineHeight: '40px' }}>
              {title}
            </h1>
          </section>
          
          {/* ページコンテンツ */}
          <div className={className}>
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}