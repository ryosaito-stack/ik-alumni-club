'use client';

import { useParams } from 'next/navigation';
import DetailLayout from '@/components/DetailLayout';

// 会報詳細データ
const newsletterData: { [key: string]: any } = {
  '1': {
    id: 1,
    date: '2025.08.15',
    category: 'MONTHLY',
    title: '2025年8月号 - チーム活動報告',
    type: 'pdf',
    pages: 12,
    isPremium: false,
    pdfUrl: '/newsletters/2025-08.pdf', // 仮のPDFパス
    content: `
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">今月のハイライト</h3>
      <p>8月は夏の大会シーズンとなり、IK ALUMNI CGTは素晴らしい成績を収めることができました。全国大会での準優勝という結果は、チーム一丸となって練習に取り組んだ成果です。</p>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">大会結果報告</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>全国カラーガード選手権大会 - <strong>準優勝</strong></li>
        <li>関東地区大会 - <strong>優勝</strong></li>
        <li>夏季オープン大会 - <strong>第3位</strong></li>
      </ul>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">新メンバー紹介</h3>
      <p>今月から3名の新メンバーが加わりました。それぞれが持つ個性と技術でチームに新たな風を吹き込んでくれています。詳細なプロフィールはPDF版でご確認ください。</p>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">今後の予定</h3>
      <p>9月には秋季大会が控えています。また、10月には創立記念イベントも予定しており、サポーターの皆様にもご参加いただける企画を準備中です。</p>
      <br />
      
      <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0;">
        <h4 style="font-weight: bold; margin-bottom: 1rem;">📄 PDF版のダウンロード</h4>
        <p style="margin-bottom: 1rem;">より詳細な内容は、PDF版でご覧いただけます。写真や詳細データも掲載しています。</p>
        <a href="#" style="display: inline-flex; align-items: center; padding: 0.75rem 1.5rem; background: #4f46e5; color: white; border-radius: 0.5rem; text-decoration: none;">
          <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF版をダウンロード（12ページ）
        </a>
      </div>
    `,
    relatedNewsletters: [
      { id: 2, title: '2025年度 年次報告書', category: 'ANNUAL' },
      { id: 4, title: '2025年7月号 - メンバーインタビュー', category: 'MONTHLY' },
      { id: 5, title: 'サポーターズクラブ通信 Vol.5', category: 'NEWSLETTER' },
    ]
  },
  '2': {
    id: 2,
    date: '2025.08.01',
    category: 'ANNUAL',
    title: '2025年度 年次報告書',
    type: 'pdf',
    pages: 24,
    isPremium: false,
    pdfUrl: '/newsletters/annual-report-2025.pdf',
    content: `
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 3rem; border-radius: 1rem; text-align: center; margin-bottom: 2rem;">
        <svg style="width: 4rem; height: 4rem; margin: 0 auto 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v7m3-2h6" />
        </svg>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">2025年度 年次報告書</h2>
        <p style="opacity: 0.9;">Annual Report 2025</p>
      </div>

      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">ご挨拶</h3>
      <p>サポーターの皆様、いつもIK ALUMNI CGTを温かく応援していただき、誠にありがとうございます。2025年度も皆様のご支援のおかげで、充実した活動を行うことができました。</p>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">活動実績</h3>
      <p>2025年度は、以下のような成果を達成することができました：</p>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>年間大会出場回数：12回</li>
        <li>獲得メダル数：金5、銀3、銅2</li>
        <li>新規メンバー加入：8名</li>
        <li>練習施設の改善・拡充</li>
      </ul>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">財務報告（概要）</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 0.75rem; text-align: left; border: 1px solid #e5e7eb;">項目</th>
          <th style="padding: 0.75rem; text-align: right; border: 1px solid #e5e7eb;">金額</th>
        </tr>
        <tr>
          <td style="padding: 0.75rem; border: 1px solid #e5e7eb;">収入合計</td>
          <td style="padding: 0.75rem; text-align: right; border: 1px solid #e5e7eb;">¥12,500,000</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem; border: 1px solid #e5e7eb;">支出合計</td>
          <td style="padding: 0.75rem; text-align: right; border: 1px solid #e5e7eb;">¥11,200,000</td>
        </tr>
        <tr style="background: #f3f4f6; font-weight: bold;">
          <td style="padding: 0.75rem; border: 1px solid #e5e7eb;">次年度繰越金</td>
          <td style="padding: 0.75rem; text-align: right; border: 1px solid #e5e7eb;">¥1,300,000</td>
        </tr>
      </table>
      <p style="font-size: 0.875rem; color: #6b7280;">※詳細な財務諸表はPDF版に掲載しています</p>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">来年度の展望</h3>
      <p>2026年度は、国際大会への初出場を目標に掲げ、より一層の技術向上と表現力の向上に努めてまいります。引き続きご支援のほど、よろしくお願いいたします。</p>
      <br />
      
      <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0;">
        <h4 style="font-weight: bold; margin-bottom: 1rem;">📄 完全版のダウンロード</h4>
        <p style="margin-bottom: 1rem;">詳細な財務諸表、活動写真、メンバー一覧などを含む完全版をダウンロードいただけます。</p>
        <a href="#" style="display: inline-flex; align-items: center; padding: 0.75rem 1.5rem; background: #4f46e5; color: white; border-radius: 0.5rem; text-decoration: none;">
          <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          年次報告書をダウンロード（24ページ）
        </a>
      </div>
    `,
    relatedNewsletters: [
      { id: 1, title: '2025年8月号 - チーム活動報告', category: 'MONTHLY' },
      { id: 3, title: '特別号：全国大会優勝記念', category: 'SPECIAL' },
      { id: 7, title: '特別企画：チーム10年の歩み', category: 'SPECIAL' },
    ]
  },
  '3': {
    id: 3,
    date: '2025.07.20',
    category: 'SPECIAL',
    title: '特別号：全国大会優勝記念',
    type: 'html',
    pages: 8,
    isPremium: true,
    content: `
      <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 3rem; border-radius: 1rem; text-align: center; margin-bottom: 2rem;">
        <svg style="width: 4rem; height: 4rem; margin: 0 auto 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">祝！全国大会優勝</h2>
        <p style="opacity: 0.9;">Special Victory Edition</p>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-bottom: 2rem;">
        <p style="color: #92400e; font-weight: bold;">🏆 プレミアム会員限定コンテンツ</p>
        <p style="color: #92400e; font-size: 0.875rem;">この記事は特別号のため、プレミアム会員の方のみご覧いただけます。</p>
      </div>

      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">歴史的な瞬間</h3>
      <p>2025年7月15日、IK ALUMNI CGTはついに全国大会での優勝を成し遂げました。創立以来の悲願であった全国制覇を、チーム一丸となって達成することができました。</p>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">優勝までの軌跡</h3>
      <p>予選から決勝まで、すべての演技で高得点を記録。特に決勝での演技は、審査員から「完璧」との評価をいただきました。</p>
      <br />
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 2rem 0;">
        <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <p style="font-size: 2rem; font-weight: bold; color: #5b21b6;">98.5</p>
          <p style="color: #6b7280;">決勝スコア</p>
        </div>
        <div style="background: #fce7f3; padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <p style="font-size: 2rem; font-weight: bold; color: #be185d;">1st</p>
          <p style="color: #6b7280;">最終順位</p>
        </div>
      </div>
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">メンバーからのメッセージ</h3>
      <blockquote style="border-left: 3px solid #4f46e5; padding-left: 1rem; margin: 1rem 0; font-style: italic;">
        「サポーターの皆様の応援があったからこそ、この優勝を勝ち取ることができました。本当にありがとうございます！」
        <footer style="margin-top: 0.5rem; font-style: normal; color: #6b7280;">- キャプテン 山田花子</footer>
      </blockquote>
      <br />
      
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">写真ギャラリー</h3>
      <div style="background: #f3f4f6; padding: 2rem; border-radius: 0.5rem; text-align: center;">
        <svg style="width: 3rem; height: 3rem; margin: 0 auto 1rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p style="color: #6b7280;">優勝の瞬間を捉えた写真ギャラリーは、プレミアム会員専用ページでご覧いただけます。</p>
      </div>
    `,
    relatedNewsletters: [
      { id: 1, title: '2025年8月号 - チーム活動報告', category: 'MONTHLY' },
      { id: 2, title: '2025年度 年次報告書', category: 'ANNUAL' },
      { id: 8, title: '2025年5月号 - 春季大会レポート', category: 'MONTHLY' },
    ]
  }
};

// デフォルトの会報詳細データ
const defaultNewsletterDetail = {
  id: 1,
  date: '2025.08.01',
  category: 'NEWSLETTER',
  title: 'Newsletter',
  type: 'pdf',
  pages: 8,
  isPremium: false,
  content: `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem; border-radius: 1rem; text-align: center; margin-bottom: 2rem;">
      <svg style="width: 4rem; height: 4rem; margin: 0 auto 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h2 style="font-size: 1.5rem;">会報</h2>
    </div>
    <p>会報の詳細内容をこちらに掲載いたします。</p>
    <br />
    <p>詳細は後日お知らせいたします。</p>
  `,
  relatedNewsletters: []
};

export default function NewsletterDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const newsletter = newsletterData[id] || { ...defaultNewsletterDetail, id: parseInt(id), title: `Newsletter ${id}` };

  return (
    <DetailLayout
      title={newsletter.title}
      date={newsletter.date}
      showShareButtons={true}
      backLink="/newsletters"
      backText="BACK"
    >
      {/* メタ情報 */}
      <div className="mb-8 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {newsletter.isPremium && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 会報本文 */}
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
      </div>

    </DetailLayout>
  );
}