'use client';

import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';

// 仮の会報データ
const newsletterData = [
  {
    id: 1,
    title: '2025年8月号 - チーム活動報告',
    excerpt: '今月のチーム活動ハイライトをお届けします。夏の大会での素晴らしいパフォーマンスと、新メンバーの紹介を含む最新情報をご覧ください。',
    date: '2025.08.15',
    type: 'pdf' as const,
    category: 'MONTHLY',
    pages: 12,
    isPremium: false,
  },
  {
    id: 2,
    title: '2025年度 年次報告書',
    excerpt: '2025年度のIK ALUMNI CGTの活動総括と財務報告。支援者の皆様への感謝と、来年度の活動計画について詳しくご報告いたします。',
    date: '2025.08.01',
    type: 'pdf' as const,
    category: 'ANNUAL',
    pages: 24,
    isPremium: false,
  },
  {
    id: 3,
    title: '特別号：全国大会優勝記念',
    excerpt: '全国大会での優勝を記念した特別号。選手たちの努力の軌跡と、大会当日の感動的な瞬間を写真とともに振り返ります。',
    date: '2025.07.20',
    type: 'html' as const,
    category: 'SPECIAL',
    pages: 8,
    isPremium: true,
  },
  {
    id: 4,
    title: '2025年7月号 - メンバーインタビュー',
    excerpt: 'チームリーダーへの独占インタビュー。練習の裏側や、チームの絆を深めるための取り組みについて語っていただきました。',
    date: '2025.07.15',
    type: 'html' as const,
    category: 'MONTHLY',
    pages: 10,
    isPremium: false,
  },
  {
    id: 5,
    title: 'サポーターズクラブ通信 Vol.5',
    excerpt: 'サポーターの皆様からのメッセージ紹介と、今後のイベント情報。会員限定の特別企画のお知らせも掲載しています。',
    date: '2025.07.01',
    type: 'pdf' as const,
    category: 'NEWSLETTER',
    pages: 6,
    isPremium: false,
  },
  {
    id: 6,
    title: '2025年6月号 - 新シーズンに向けて',
    excerpt: '新シーズンの目標と練習計画について。新しい振付けの紹介と、強化合宿のレポートをお届けします。',
    date: '2025.06.15',
    type: 'pdf' as const,
    category: 'MONTHLY',
    pages: 10,
    isPremium: false,
  },
  {
    id: 7,
    title: '特別企画：チーム10年の歩み',
    excerpt: 'IK ALUMNI CGT設立10周年を記念して、これまでの歴史を振り返る特別企画。歴代メンバーからのメッセージも収録。',
    date: '2025.06.01',
    type: 'html' as const,
    category: 'SPECIAL',
    pages: 20,
    isPremium: true,
  },
  {
    id: 8,
    title: '2025年5月号 - 春季大会レポート',
    excerpt: '春季大会での成績と、審査員からのフィードバック。次の大会に向けた改善点と練習方針について詳しく解説します。',
    date: '2025.05.15',
    type: 'pdf' as const,
    category: 'MONTHLY',
    pages: 8,
    isPremium: false,
  },
  {
    id: 9,
    title: 'サポーターズクラブ通信 Vol.4',
    excerpt: '会員の皆様への感謝企画実施のお知らせ。限定グッズの販売情報と、チーム応援イベントの詳細をご案内します。',
    date: '2025.05.01',
    type: 'pdf' as const,
    category: 'NEWSLETTER',
    pages: 6,
    isPremium: false,
  },
];


export default function NewslettersPage() {
  const formatDate = (date: string) => {
    return date;
  };

  return (
    <ViewAllLayout title="NEWSLETTERS" bgColor="white" maxWidth="6xl">
      <ListPageContent
        loading={false}
        items={newsletterData}
        emptyMessage="該当する会報がありません"
        layout="list"
      >
        {(newsletter) => (
          <Link href={`/newsletters/${newsletter.id}`}>
            <div className="block--txt transition-opacity duration-300 cursor-pointer hover:opacity-60" style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '0', paddingRight: '0' }}>
              <p className="date text-black" style={{ fontSize: '13px', marginBottom: '10px' }}>
                {formatDate(newsletter.date)}
              </p>
              <p className="tit text-gray-800" style={{ fontSize: '14px' }}>
                {newsletter.title}
              </p>
            </div>
          </Link>
        )}
      </ListPageContent>
    </ViewAllLayout>
  );
}