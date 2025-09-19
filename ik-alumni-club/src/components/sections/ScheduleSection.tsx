'use client';

import Section from '@/components/Section';
import { usePublishedSchedules } from '@/hooks/useSchedules';

export default function ScheduleSection() {
  const { schedules, loading } = usePublishedSchedules({
    limit: 3,
    orderBy: 'date',
    orderDirection: 'asc',
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return {
      month: String(d.getMonth() + 1).padStart(2, '0'),
      day: String(d.getDate()).padStart(2, '0'),
      weekday: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()],
      formatted: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
    };
  };

  return (
    <Section
      id="schedule"
      title="SCHEDULE"
      viewAllLink="/events"
      bgColor="white"
    >
      <div className="grid md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            読み込み中...
          </div>
        ) : schedules.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            現在予定されているイベントはありません
          </div>
        ) : (
          schedules.map((schedule, index) => {
            const dateInfo = formatDate(schedule.date);
            return (
              <div 
                key={schedule.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 group"
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <div className="flex h-full">
                  <div className="text-center text-white p-4 min-w-[100px] transition-all duration-300" style={{ backgroundColor: '#1D2088' }}>
                    <div className="block--date__start">
                      <span className="block--date__month text-2xl font-bold font-3d">{dateInfo.month}</span>
                      <span className="block--date__date text-3xl font-bold font-3d block">{dateInfo.day}</span>
                      <span className="block--date__youbi text-xs font-medium font-3d">[{dateInfo.weekday}]</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {schedule.title}
                    </h3>
                    
                    {/* 画像がある場合はサムネイル表示 */}
                    {schedule.imageUrl && (
                      <div className="mb-2">
                        <img 
                          src={schedule.imageUrl} 
                          alt={schedule.title}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    {schedule.link && (
                      <div className="mt-auto">
                        <a 
                          href={schedule.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          詳細を見る
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Section>
  );
}