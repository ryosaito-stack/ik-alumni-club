'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';
import { getMonthSchedules } from '@/lib/firestore/schedules';
import { Schedule } from '@/types';

// 現在の月を取得
const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URLパラメータから年月を取得
  const yearParam = searchParams?.get('year');
  const monthParam = searchParams?.get('month');
  
  const initialMonth = monthParam ? parseInt(monthParam) : currentMonth;
  const initialYear = yearParam ? parseInt(yearParam) : currentYear;
  
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  // スケジュールを取得する関数
  const fetchSchedulesForMonth = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const schedules = await getMonthSchedules(year, month);
      // 日付順にソート
      schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAllSchedules(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 初回読み込みとパラメータ変更時の読み込み
  useEffect(() => {
    fetchSchedulesForMonth(initialYear, initialMonth);
  }, [initialYear, initialMonth, fetchSchedulesForMonth]);
  
  // 月の変更処理（URLパラメータを更新）
  const handleMonthChange = (direction: 'prev' | 'next') => {
    let newMonth = initialMonth;
    let newYear = initialYear;
    
    if (direction === 'prev') {
      if (initialMonth === 1) {
        newMonth = 12;
        newYear = initialYear - 1;
      } else {
        newMonth = initialMonth - 1;
      }
    } else {
      if (initialMonth === 12) {
        newMonth = 1;
        newYear = initialYear + 1;
      } else {
        newMonth = initialMonth + 1;
      }
    }
    
    // URLパラメータを更新してページ遷移
    router.push(`/events?year=${newYear}&month=${String(newMonth).padStart(2, '0')}`);
  };


  const formatDate = (date: Date) => {
    const d = new Date(date);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return {
      month: String(d.getMonth() + 1).padStart(2, '0'),
      day: String(d.getDate()).padStart(2, '0'),
      weekday: weekdays[d.getDay()],
      time: d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <ViewAllLayout title="SCHEDULE" bgColor="white" maxWidth="6xl">
      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={() => handleMonthChange('prev')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="前の月"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {initialYear}年 {initialMonth}月
        </h2>
        
        <button
          onClick={() => handleMonthChange('next')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="次の月"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* イベントリスト */}
      <ListPageContent
        loading={loading}
        items={allSchedules}
        emptyMessage="予定されているイベントはありません"
        layout="grid"
        gridCols="grid-cols-1 gap-4"
      >
        {(schedule) => {
          const dateInfo = formatDate(schedule.date);
          return (
            <Link href={`/events/${schedule.id}`}>
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* 日付 */}
                  <div className="flex-shrink-0 text-center md:text-left">
                    <div className="inline-block bg-indigo-100 rounded-lg p-3 min-w-[80px]">
                      <div className="text-2xl font-bold text-indigo-600">
                        {dateInfo.day}
                      </div>
                      <div className="text-sm text-gray-600">
                        {dateInfo.month}月 ({dateInfo.weekday})
                      </div>
                    </div>
                  </div>
                  
                  {/* イベント情報 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {schedule.title}
                    </h3>
                    <span className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                      詳細を見る
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        }}
      </ListPageContent>
    </ViewAllLayout>
  );
}