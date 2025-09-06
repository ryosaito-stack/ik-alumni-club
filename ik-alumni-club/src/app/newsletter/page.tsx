'use client';

import Link from 'next/link';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';

// 仮の会報データ
const newsletterData = [
  {
    id: 1,
    title: '2025年8月号 - 夏季特別号',
    description: '夏の全国大会結果報告と秋季活動予定について。チームメンバーからの特別メッセージも掲載。',
    date: '2025.08.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '2.5MB',
    isPremium: false,
    issueNumber: 'Vol.24',
  },
  {
    id: 2,
    title: '2025年7月号 - 新メンバー紹介特集',
    description: '新年度のメンバー紹介と意気込み。各セクションリーダーインタビューを掲載しています。',
    date: '2025.07.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '3.1MB',
    isPremium: false,
    issueNumber: 'Vol.23',
  },
  {
    id: 3,
    title: '2025年度 年次報告書',
    description: '2024年度の活動実績と決算報告、2025年度の活動計画と予算案について詳しく説明しています。',
    date: '2025.06.30',
    category: '年次報告',
    format: 'HTML',
    isPremium: true,
    issueNumber: '2025年度版',
  },
  {
    id: 4,
    title: '2025年6月号 - 春季大会結果報告',
    description: '春季大会での演技内容と結果、審査員からのフィードバック、今後の改善点について。',
    date: '2025.06.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '2.8MB',
    isPremium: false,
    issueNumber: 'Vol.22',
  },
  {
    id: 5,
    title: '特別号 - 10周年記念誌',
    description: 'IK ALUMNI CGT設立10周年を記念した特別編集号。歴代メンバーからのメッセージと活動の軌跡。',
    date: '2025.05.01',
    category: '特別号',
    format: 'PDF',
    fileSize: '5.2MB',
    isPremium: true,
    issueNumber: '10th Anniversary',
  },
  {
    id: 6,
    title: '2025年4月号 - 新年度スタート',
    description: '新年度の活動方針と年間スケジュール。新体制の紹介とサポーターズクラブからのお知らせ。',
    date: '2025.04.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '2.2MB',
    isPremium: false,
    issueNumber: 'Vol.21',
  },
  {
    id: 7,
    title: '技術解説 - カラーガード基礎講座',
    description: 'カラーガードの基本技術を詳しく解説。初心者にもわかりやすい図解付き。',
    date: '2025.03.20',
    category: '技術資料',
    format: 'HTML',
    isPremium: true,
    issueNumber: '技術編 Vol.1',
  },
  {
    id: 8,
    title: '2025年3月号 - 年度末総括',
    description: '2024年度の活動を振り返り、成果と課題を総括。来年度への展望も含めて報告します。',
    date: '2025.03.15',
    category: '月刊会報',
    format: 'PDF',
    fileSize: '2.9MB',
    isPremium: false,
    issueNumber: 'Vol.20',
  },
];


export default function NewsletterPage() {
  const formatDate = (date: string) => {
    return date;
  };

  return (
    <ViewAllLayout title="NEWSLETTER" bgColor="white" maxWidth="6xl">
      <ListPageContent
        loading={false}
        items={newsletterData}
        emptyMessage="該当する会報がありません"
        layout="list"
      >
        {(newsletter) => (
          <Link href={`/newsletter/${newsletter.id}`}>
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