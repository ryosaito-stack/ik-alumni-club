'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { messages } from '@/constants/messages';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, member, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (member) {
      setIsAdmin(member.role === 'admin');
    }
    // For demo: make first user admin automatically
    if (user && !member?.role) {
      const adminEmails = ['admin@example.com'];
      setIsAdmin(adminEmails.includes(user.email || ''));
    }

    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{messages.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    { name: messages.navigation.dashboard, href: '/dashboard', icon: '📊' },
    { name: messages.navigation.contents, href: '/contents', icon: '📚' },
    { name: messages.navigation.profile, href: '/profile', icon: '👤' },
  ];

  const adminNavigation = [
    { name: 'お知らせ管理', href: '/admin/informations', icon: '📢' },
    { name: 'スケジュール管理', href: '/admin/schedules', icon: '📅' },
    { name: '動画管理', href: '/admin/videos', icon: '🎬' },
    { name: messages.navigation.manageContents, href: '/admin/contents', icon: '📝' },
    { name: messages.navigation.manageUsers, href: '/admin/users', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-6 bg-indigo-600">
            <h2 className="text-2xl font-bold text-white">
              IK Alumni Club
            </h2>
            {isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-yellow-400 text-gray-900 rounded">
                {messages.navigation.admin}
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                    {messages.navigation.admin}
                  </p>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-4 py-2 text-sm font-medium rounded-md
                        ${isActive 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                  {user.email?.[0]?.toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {member?.displayName || messages.common.welcome}
                </p>
                <p className="text-xs text-gray-500">
                  {member?.plan || 'individual'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
}