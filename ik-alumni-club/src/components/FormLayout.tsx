'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

interface FormLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
}

export default function FormLayout({
  children,
  title,
  description,
  showBackButton = false,
  backButtonHref = '/',
  backButtonText = 'トップページに戻る'
}: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ロゴヘッダー（センター配置） */}
      <div className="bg-gray-50 pt-[45px] pb-8">
        <div className="text-center">
          <h1 className="inline-block">
            <Link href="/">
              <Image 
                src="/images/logo.png" 
                alt="IK Alumni Club" 
                width={180} 
                height={54}
                className="w-[180px] h-auto mx-auto"
              />
            </Link>
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <section className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        {/* タイトル */}
        <h2 className="text-xl font-bold mb-8 max-w-md mx-auto">
          {title}
        </h2>

        {/* 説明文 */}
        {description && (
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}

        {/* フォームコンテンツ */}
        {children}

        {/* 戻るボタン */}
        {showBackButton && (
          <div className="mt-8 text-center">
            <Link 
              href={backButtonHref}
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              {backButtonText}
            </Link>
          </div>
        )}
      </section>

      {/* フッター */}
      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600">
            <small>© IK Alumni Club</small>
          </p>
        </div>
      </footer>
    </div>
  );
}