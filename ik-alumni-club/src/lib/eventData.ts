// イベントデータを月別に管理するモジュール

export interface Event {
  id: number;
  month: string;
  day: string;
  weekday: string;
  type: string;
  typeId: string;
  title: string;
  location: string;
  description: string;
  time: string;
  year?: number;
}

// 全イベントデータ（実際はAPIから取得）
const allEvents: Event[] = [
  // 8月のイベント（2025年）
  {
    id: 21,
    month: '08',
    day: '05',
    weekday: 'MON',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: '夏季特別セミナー',
    location: 'オンライン開催',
    description: '夏季特別プログラムとして開催される集中セミナーです。',
    time: '10:00-12:00',
    year: 2025,
  },
  {
    id: 22,
    month: '08',
    day: '10',
    weekday: 'SAT',
    type: 'WORKSHOP',
    typeId: 'workshop',
    title: 'データ分析ワークショップ',
    location: '東京都千代田区',
    description: 'ビジネスにおけるデータ分析の実践的な手法を学びます。',
    time: '13:00-17:00',
    year: 2025,
  },
  {
    id: 23,
    month: '08',
    day: '15',
    weekday: 'THU',
    type: 'CONFERENCE',
    typeId: 'conference',
    title: 'サマーカンファレンス2025',
    location: '横浜みなとみらい',
    description: '夏の大規模カンファレンスイベントです。',
    time: '09:00-18:00',
    year: 2025,
  },
  {
    id: 24,
    month: '08',
    day: '20',
    weekday: 'TUE',
    type: 'NETWORKING',
    typeId: 'networking',
    title: 'サマーネットワーキング',
    location: '東京都渋谷区',
    description: '夏の交流イベントです。',
    time: '18:00-20:00',
    year: 2025,
  },
  {
    id: 25,
    month: '08',
    day: '25',
    weekday: 'SUN',
    type: 'WEBINAR',
    typeId: 'webinar',
    title: 'クラウド技術最新動向',
    location: 'オンライン開催',
    description: '最新のクラウド技術とその活用方法について解説します。',
    time: '14:00-16:00',
    year: 2025,
  },
  {
    id: 26,
    month: '08',
    day: '30',
    weekday: 'FRI',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: 'マーケティング戦略セミナー',
    location: 'ハイブリッド開催',
    description: '効果的なマーケティング戦略の立案方法を学びます。',
    time: '15:00-17:00',
    year: 2025,
  },
  // 9月のイベント（2025年）
  {
    id: 1,
    month: '09',
    day: '05',
    weekday: 'FRI',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: 'AIビジネス活用セミナー',
    location: 'オンライン開催',
    description: '最新のAI技術をビジネスに活用する方法について、専門家が解説します。',
    time: '14:00-16:00',
    year: 2025,
  },
  {
    id: 2,
    month: '09',
    day: '12',
    weekday: 'FRI',
    type: 'NETWORKING',
    typeId: 'networking',
    title: 'Alumni 交流会 2025',
    location: '東京都港区',
    description: '卒業生同士の交流を深める年次イベントです。',
    time: '18:00-21:00',
    year: 2025,
  },
  {
    id: 3,
    month: '09',
    day: '20',
    weekday: 'SAT',
    type: 'WORKSHOP',
    typeId: 'workshop',
    title: 'キャリアデザインワークショップ',
    location: 'ハイブリッド開催',
    description: '自身のキャリアを見つめ直し、将来の設計を行うワークショップです。',
    time: '10:00-17:00',
    year: 2025,
  },
  {
    id: 9,
    month: '09',
    day: '28',
    weekday: 'SUN',
    type: 'WEBINAR',
    typeId: 'webinar',
    title: 'デジタルマーケティング最前線',
    location: 'オンライン開催',
    description: '最新のデジタルマーケティング手法を解説します。',
    time: '13:00-15:00',
    year: 2025,
  },
  {
    id: 10,
    month: '09',
    day: '30',
    weekday: 'TUE',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: 'ブロックチェーン技術入門',
    location: 'オンライン開催',
    description: 'ブロックチェーンの基礎から応用まで学びます。',
    time: '10:00-12:00',
    year: 2025,
  },
  // 10月のイベント（2025年）
  {
    id: 4,
    month: '10',
    day: '03',
    weekday: 'FRI',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: 'DXトランスフォーメーション講座',
    location: 'オンライン開催',
    description: 'デジタル変革の最新トレンドと実践方法を学びます。',
    time: '15:00-17:00',
    year: 2025,
  },
  {
    id: 11,
    month: '10',
    day: '05',
    weekday: 'SUN',
    type: 'WORKSHOP',
    typeId: 'workshop',
    title: 'チームビルディングワークショップ',
    location: '神奈川県横浜市',
    description: 'チームの結束力を高めるワークショップです。',
    time: '13:00-17:00',
    year: 2025,
  },
  {
    id: 12,
    month: '10',
    day: '10',
    weekday: 'FRI',
    type: 'NETWORKING',
    typeId: 'networking',
    title: '女性リーダーネットワーキング',
    location: '東京都新宿区',
    description: '女性リーダー同士の交流イベントです。',
    time: '18:30-20:30',
    year: 2025,
  },
  {
    id: 5,
    month: '10',
    day: '15',
    weekday: 'WED',
    type: 'CONFERENCE',
    typeId: 'conference',
    title: 'IKグローバルカンファレンス',
    location: '東京国際フォーラム',
    description: '世界各国の卒業生が集まる大規模カンファレンスです。',
    time: '09:00-18:00',
    year: 2025,
  },
  {
    id: 6,
    month: '10',
    day: '25',
    weekday: 'SAT',
    type: 'WORKSHOP',
    typeId: 'workshop',
    title: 'リーダーシップ開発プログラム',
    location: '大阪府大阪市',
    description: '次世代リーダー育成のための実践的プログラムです。',
    time: '13:00-18:00',
    year: 2025,
  },
  // 11月のイベント（2025年）
  {
    id: 7,
    month: '11',
    day: '08',
    weekday: 'SAT',
    type: 'NETWORKING',
    typeId: 'networking',
    title: '若手Alumni交流会',
    location: '渋谷区',
    description: '卒業5年以内の若手メンバー限定の交流会です。',
    time: '19:00-22:00',
    year: 2025,
  },
  {
    id: 13,
    month: '11',
    day: '15',
    weekday: 'SAT',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: 'サステナビリティ経営セミナー',
    location: 'オンライン開催',
    description: '持続可能な経営について学ぶセミナーです。',
    time: '14:00-16:00',
    year: 2025,
  },
  {
    id: 8,
    month: '11',
    day: '20',
    weekday: 'THU',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: 'スタートアップ成功の秘訣',
    location: 'オンライン開催',
    description: '起業家による実体験に基づく成功ノウハウを共有します。',
    time: '18:00-20:00',
    year: 2025,
  },
  {
    id: 14,
    month: '11',
    day: '28',
    weekday: 'FRI',
    type: 'WORKSHOP',
    typeId: 'workshop',
    title: 'プレゼンテーション力向上ワークショップ',
    location: '東京都千代田区',
    description: '効果的なプレゼンテーション技術を学びます。',
    time: '10:00-17:00',
    year: 2025,
  },
  // 12月のイベント（2025年）
  {
    id: 15,
    month: '12',
    day: '05',
    weekday: 'FRI',
    type: 'CONFERENCE',
    typeId: 'conference',
    title: '年末特別講演会',
    location: '東京都中央区',
    description: '今年の振り返りと来年の展望を語る特別講演会です。',
    time: '18:00-20:00',
    year: 2025,
  },
  {
    id: 16,
    month: '12',
    day: '15',
    weekday: 'MON',
    type: 'NETWORKING',
    typeId: 'networking',
    title: '忘年会 & ネットワーキング',
    location: '東京都港区',
    description: '一年の締めくくりとなる大規模な交流イベントです。',
    time: '17:00-21:00',
    year: 2025,
  },
  {
    id: 17,
    month: '12',
    day: '20',
    weekday: 'SAT',
    type: 'WEBINAR',
    typeId: 'webinar',
    title: '2026年ビジネストレンド予測',
    location: 'オンライン開催',
    description: '来年のビジネストレンドを専門家が予測します。',
    time: '15:00-17:00',
    year: 2025,
  },
  // 1月のイベント（2026年）
  {
    id: 18,
    month: '01',
    day: '10',
    weekday: 'SAT',
    type: 'SEMINAR',
    typeId: 'seminar',
    title: '新年キックオフセミナー',
    location: 'オンライン開催',
    description: '新年の目標設定と計画立案を支援するセミナーです。',
    time: '14:00-16:00',
    year: 2026,
  },
  {
    id: 19,
    month: '01',
    day: '20',
    weekday: 'TUE',
    type: 'NETWORKING',
    typeId: 'networking',
    title: '新年交流会',
    location: '東京都千代田区',
    description: '新年最初のネットワーキングイベントです。',
    time: '18:00-20:00',
    year: 2026,
  },
  // 2月のイベント（2026年）
  {
    id: 20,
    month: '02',
    day: '14',
    weekday: 'SAT',
    type: 'WORKSHOP',
    typeId: 'workshop',
    title: 'イノベーション創出ワークショップ',
    location: 'ハイブリッド開催',
    description: '新しいアイデアを生み出すための実践的ワークショップです。',
    time: '10:00-17:00',
    year: 2026,
  },
];

// 月別にイベントを取得する関数
export function getEventsByMonth(year: number, month: number): Event[] {
  return allEvents.filter(event => {
    const eventYear = event.year || 2025;
    return eventYear === year && parseInt(event.month) === month;
  });
}

// 複数月のイベントを取得する関数
export function getEventsForMonths(startYear: number, startMonth: number, monthCount: number): { month: number; year: number; events: Event[] }[] {
  const result = [];
  let currentYear = startYear;
  let currentMonth = startMonth;
  
  for (let i = 0; i < monthCount; i++) {
    const events = getEventsByMonth(currentYear, currentMonth);
    result.push({
      month: currentMonth,
      year: currentYear,
      events: events
    });
    
    // 次の月へ
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }
  
  return result;
}

// イベントタイプの定義
export const eventTypes = [
  { id: 'all', label: 'ALL', checked: true },
  { id: 'seminar', label: 'SEMINAR', checked: true },
  { id: 'networking', label: 'NETWORKING', checked: true },
  { id: 'workshop', label: 'WORKSHOP', checked: true },
  { id: 'conference', label: 'CONFERENCE', checked: true },
  { id: 'webinar', label: 'WEBINAR', checked: true },
  { id: 'other', label: 'OTHER', checked: true },
];