'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, member, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // スクロール状態に応じて背景と影を変更
  const headerBg = transparent
    ? (isScrolled ? 'bg-white shadow-md' : 'bg-transparent')
    : (isScrolled ? 'bg-white shadow-md' : 'bg-white');

  const textColor = transparent && !isScrolled
    ? {
        nav: 'text-white hover:text-indigo-300',
        logo: 'opacity-90',
        menu: 'text-white',
        social: 'bg-white/20 hover:bg-white/30 text-white',
        signupBorder: 'border-white text-white hover:bg-white/10',
        login: 'bg-white text-indigo-600 hover:bg-indigo-50'
      }
    : {
        nav: 'text-gray-700 hover:text-indigo-600',
        logo: 'opacity-100',
        menu: 'text-gray-700',
        social: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
        signupBorder: 'border-indigo-600 text-indigo-600 hover:bg-indigo-50',
        login: 'bg-indigo-600 text-white hover:bg-indigo-700'
      };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
        <div className="transition-all duration-300 mx-auto relative" style={{ padding: '0 5%' }}>
          {/* ロゴ - ヘッダー全体の垂直中央に配置 */}
          <div className="absolute top-1/2 -translate-y-1/2">
            <Link href="/" className="block">
              <Image 
                src="/images/logo.png" 
                alt="IK Alumni Club" 
                width={200} 
                height={100}
                className="h-24 w-auto"
                priority
              />
            </Link>
          </div>

          {/* 1行目：ナビゲーション + SNSアイコン */}
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
            {/* ロゴの分のスペース確保 */}
            <div className="w-48"></div>

            {/* デスクトップナビゲーション */}
            <div className="hidden md:flex items-center flex-1 justify-end">
              <nav className="flex items-center h-6" style={{ gap: '13px' }}>
                <Link href="/" className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}>
                  HOME
                </Link>
                <Link href="/news" className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}>
                  INFORMATION
                </Link>
                <Link href="/events" className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}>
                  SCHEDULE
                </Link>
                <Link href="/videos" className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}>
                  VIDEO
                </Link>
                <Link href="/blog" className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}>
                  BLOG
                </Link>
                <Link href="/newsletters" className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}>
                  NEWSLETTERS
                </Link>
                <a 
                  href="/contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`transition-colors font-3d flex items-center h-full ${textColor.nav}`}
                >
                  CONTACT
                </a>
              </nav>
              
              {/* SNSアイコン */}
              <div className="flex items-center relative h-6" style={{ marginLeft: '13px', paddingLeft: '13px', gap: '13px' }}>
                <div className="absolute left-0 w-px bg-black" style={{ height: '18px', top: '50%', transform: 'translateY(-50%)' }}></div>
                {[
                  { name: 'X', icon: '/images/icons8-x-50.png', url: '#' },
                  { name: 'Instagram', icon: '/images/icons8-instagram-50.png', url: '#' },
                  { name: 'YouTube', icon: '/images/icons8-youtube-50.png', url: '#' },
                  { name: 'TikTok', icon: '/images/icons8-tiktok-50.png', url: '#' }
                ].map((sns) => (
                  <a
                    key={sns.name}
                    href={sns.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-110"
                  >
                    <Image
                      src={sns.icon}
                      alt={sns.name}
                      width={24}
                      height={24}
                      className="opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden ${textColor.menu}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* 2行目：登録/ログインボタン（デスクトップのみ） */}
          <div className={`hidden md:flex justify-end items-center transition-all duration-300 ${isScrolled ? 'pb-3' : 'pb-4'}`}>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* ログイン中の表示 */}
                  <span className={`text-sm ${transparent && !isScrolled ? 'text-white' : 'text-gray-700'}`}>
                    {member?.displayName || user.email}
                  </span>
                  {member?.plan && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      member.plan === 'platinum' ? 'bg-purple-100 text-purple-800' :
                      member.plan === 'business' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {member.plan.toUpperCase()}
                    </span>
                  )}
                  {isAdmin && (
                    <Link 
                      href="/dashboard" 
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        transparent && !isScrolled 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}
                    >
                      管理画面
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                      transparent && !isScrolled
                        ? 'border-white text-white hover:bg-white/10'
                        : 'border-red-600 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup" className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${textColor.signupBorder}`}>
                    無料会員登録
                  </Link>
                  <Link href="/login" className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${textColor.login}`}>
                    ログイン
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="p-8 pt-24">
            <nav className="space-y-6">
              <Link href="/" className="block text-xl font-semibold text-gray-700 font-3d">HOME</Link>
              <Link href="/news" className="block text-xl font-semibold text-gray-700 font-3d">INFORMATION</Link>
              <Link href="/events" className="block text-xl font-semibold text-gray-700 font-3d">SCHEDULE</Link>
              <Link href="/videos" className="block text-xl font-semibold text-gray-700 font-3d">VIDEO</Link>
              <Link href="/blog" className="block text-xl font-semibold text-gray-700 font-3d">BLOG</Link>
              <Link href="/newsletters" className="block text-xl font-semibold text-gray-700 font-3d">NEWSLETTERS</Link>
              <a 
                href="/contact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xl font-semibold text-gray-700 font-3d"
              >
                CONTACT
              </a>
              {user ? (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">ログイン中: {member?.displayName || user.email}</p>
                    {member?.plan && (
                      <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        member.plan === 'platinum' ? 'bg-purple-100 text-purple-800' :
                        member.plan === 'business' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {member.plan.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <Link href="/dashboard" className="block mt-4 text-xl font-semibold text-yellow-600">管理画面</Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="block mt-4 text-xl font-semibold text-red-600"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup" className="block text-xl font-semibold text-indigo-600">無料会員登録</Link>
                  <Link href="/login" className="block text-xl font-semibold text-indigo-600">ログイン</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}