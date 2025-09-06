import * as admin from 'firebase-admin';

// Firebaseアプリの初期化（エミュレーター用）
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'demo-project',
  });
}

// Firestoreエミュレーターに接続
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8081';

const db = admin.firestore();

// サンプル作者データ
const sampleAuthor = {
  id: 'admin-user-001',
  name: 'IK ALUMNI CGT 運営チーム',
  email: 'admin@ik-alumni-cgt.com'
};

// スケジュールのサンプルデータ
const scheduleData = [
  // 今月のイベント（公開済み）
  {
    title: '春の定期公演「COLORS」',
    content: `<h3>IK ALUMNI CGT 春の定期公演開催決定！</h3>
<p>今年のテーマは「COLORS」。メンバー一人ひとりの個性を色で表現し、美しいハーモニーを織りなします。</p>

<h4>公演詳細</h4>
<ul>
  <li><strong>会場:</strong> 東京国際フォーラム ホールA</li>
  <li><strong>開演:</strong> 18:30（開場 18:00）</li>
  <li><strong>料金:</strong> 一般 4,000円 / 学生 3,000円</li>
  <li><strong>チケット販売:</strong> 2月1日(土) 10:00より開始</li>
</ul>

<p>限定グッズの販売もございます。皆さまのご来場を心よりお待ちしております。</p>`,
    date: new Date('2025-03-15T18:30:00'),
    link: 'https://example.com/spring-concert-2025',
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
  },
  {
    title: 'メンバー募集説明会',
    content: `<h3>2025年度 新メンバー募集説明会のお知らせ</h3>
<p>IK ALUMNI CGTでは、共に舞台を創り上げる新しい仲間を募集しています。</p>

<h4>説明会内容</h4>
<ul>
  <li>チーム紹介・活動内容説明</li>
  <li>実際の練習見学</li>
  <li>メンバーとの質疑応答</li>
  <li>簡単な実技体験</li>
</ul>

<h4>募集要項</h4>
<ul>
  <li><strong>対象:</strong> 18歳以上の男女</li>
  <li><strong>経験:</strong> 不問（初心者歓迎）</li>
  <li><strong>練習:</strong> 週2回程度</li>
</ul>

<p>動きやすい服装でお越しください。事前申込制となっております。</p>`,
    date: new Date('2025-02-20T14:00:00'),
    link: 'https://example.com/member-recruitment-2025',
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-10T15:30:00'),
    updatedAt: new Date('2025-01-10T15:30:00'),
  },
  {
    title: '創立記念パーティー',
    content: `<h3>IK ALUMNI CGT 創立5周年記念パーティー</h3>
<p>おかげさまで、IK ALUMNI CGTは創立5周年を迎えることができました。これまでの感謝を込めて、記念パーティーを開催いたします。</p>

<h4>イベント内容</h4>
<ul>
  <li>これまでの軌跡を振り返る映像上映</li>
  <li>メンバーによるスペシャルパフォーマンス</li>
  <li>歴代メンバーとの交流会</li>
  <li>記念品の贈呈</li>
</ul>

<h4>参加対象</h4>
<ul>
  <li>現役メンバー・OB/OG</li>
  <li>サポーターズクラブ会員</li>
  <li>関係者の皆様</li>
</ul>

<p><strong>会費:</strong> 5,000円（お食事・お飲み物込み）</p>
<p>皆様のご参加をお待ちしております！</p>`,
    date: new Date('2025-04-12T19:00:00'),
    link: 'https://example.com/anniversary-party-2025',
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-05T12:00:00'),
    updatedAt: new Date('2025-01-05T12:00:00'),
  },
  {
    title: 'ワークショップ「基礎から学ぶカラーガード」',
    content: `<h3>初心者向けワークショップ開催！</h3>
<p>カラーガードの基礎技術を一から学べるワークショップを開催します。</p>

<h4>ワークショップ内容</h4>
<ul>
  <li>フラッグの基本的な持ち方・振り方</li>
  <li>基本的なボディワーク</li>
  <li>簡単な振付体験</li>
  <li>用具の扱い方とメンテナンス</li>
</ul>

<h4>こんな方におすすめ</h4>
<ul>
  <li>カラーガードに興味がある初心者の方</li>
  <li>基礎を見直したい経験者の方</li>
  <li>親子で参加したい方</li>
</ul>

<p><strong>定員:</strong> 20名（先着順）<br>
<strong>持ち物:</strong> 動きやすい服装、タオル、飲み物<br>
<strong>参加費:</strong> 2,000円</p>`,
    date: new Date('2025-03-08T13:00:00'),
    link: 'https://example.com/colorguard-workshop-2025',
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-08T09:00:00'),
    updatedAt: new Date('2025-01-08T09:00:00'),
  },
  // 来月以降のイベント
  {
    title: '合宿研修 in 軽井沢',
    content: `<h3>2025年 春の合宿研修のお知らせ</h3>
<p>チーム力向上を目的とした2泊3日の合宿研修を軽井沢にて実施します。</p>

<h4>合宿内容</h4>
<ul>
  <li>集中練習セッション</li>
  <li>新作品の創作ワークショップ</li>
  <li>チームビルディング活動</li>
  <li>外部講師による特別レッスン</li>
</ul>

<h4>宿泊施設</h4>
<p>軽井沢プリンスホテル ウエスト（長野県軽井沢町）</p>

<p><strong>参加費:</strong> メンバー 25,000円（宿泊・食事・研修費込み）</p>
<p>詳細は後日メンバー限定で配信予定です。</p>`,
    date: new Date('2025-05-10T09:00:00'),
    link: null,
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-12T14:00:00'),
    updatedAt: new Date('2025-01-12T14:00:00'),
  },
  {
    title: 'サマーコンサート 2025',
    content: `<h3>夏の恒例イベント開催決定！</h3>
<p>今年も夏のコンサートを開催いたします。暑い夏を熱いパフォーマンスで盛り上げます！</p>

<h4>今年のテーマ</h4>
<p>「SUMMER BREEZE」- 夏の爽やかな風をイメージした演出で、観客の皆様に涼しさと感動をお届けします。</p>

<h4>特別企画</h4>
<ul>
  <li>ゲストアーティストとのコラボレーション</li>
  <li>観客参加型パフォーマンス</li>
  <li>限定サマーグッズの販売</li>
</ul>

<p>詳細は3月頃に発表予定です。お楽しみに！</p>`,
    date: new Date('2025-08-15T19:00:00'),
    link: null,
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-03T11:00:00'),
    updatedAt: new Date('2025-01-03T11:00:00'),
  },
  // 非公開イベント（管理用）
  {
    title: '【内部】メンバー総会',
    content: `<h3>2025年度 メンバー総会</h3>
<p>年度の振り返りと来年度の活動計画について話し合います。</p>

<h4>議題</h4>
<ul>
  <li>2024年度活動報告</li>
  <li>2025年度活動計画</li>
  <li>役員改選</li>
  <li>予算審議</li>
</ul>

<p><strong>対象:</strong> 現役メンバーのみ<br>
<strong>場所:</strong> スタジオA</p>`,
    date: new Date('2025-03-30T15:00:00'),
    link: null,
    sortOrder: 0,
    published: false,
    author: sampleAuthor,
    createdAt: new Date('2025-01-20T10:00:00'),
    updatedAt: new Date('2025-01-20T10:00:00'),
  },
  {
    title: '地域文化祭参加',
    content: `<h3>港区文化祭への参加</h3>
<p>地域の文化祭にゲスト出演させていただきます。</p>

<h4>出演内容</h4>
<ul>
  <li>15分間のパフォーマンス</li>
  <li>体験コーナーの運営</li>
</ul>

<p>地域の皆様との交流を深める貴重な機会です。</p>`,
    date: new Date('2025-06-21T14:30:00'),
    link: 'https://example.com/minato-culture-festival',
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-18T16:00:00'),
    updatedAt: new Date('2025-01-18T16:00:00'),
  },
  {
    title: '秋の野外公演',
    content: `<h3>野外特設ステージでの特別公演</h3>
<p>自然豊かな環境での野外公演を企画中です。</p>

<h4>企画概要</h4>
<ul>
  <li>会場: お台場海浜公園 特設ステージ</li>
  <li>形式: 野外フリーコンサート</li>
  <li>テーマ: 「自然との調和」</li>
</ul>

<p>詳細は決定次第お知らせいたします。</p>`,
    date: new Date('2025-10-05T16:00:00'),
    link: null,
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-14T13:30:00'),
    updatedAt: new Date('2025-01-14T13:30:00'),
  },
  {
    title: '年末感謝公演「GRATITUDE」',
    content: `<h3>2025年を締めくくる感謝の公演</h3>
<p>一年間の感謝を込めて、特別な公演を企画しています。</p>

<h4>公演コンセプト</h4>
<p>支えてくださった全ての方々への「感謝」をテーマに、心温まる演出でお送りします。</p>

<h4>予定内容</h4>
<ul>
  <li>一年間のハイライト映像</li>
  <li>メンバー全員によるスペシャル演技</li>
  <li>観客の皆様との交流タイム</li>
</ul>

<p>詳細は秋頃に発表予定です。</p>`,
    date: new Date('2025-12-20T18:00:00'),
    link: null,
    sortOrder: 0,
    published: true,
    author: sampleAuthor,
    createdAt: new Date('2025-01-01T12:00:00'),
    updatedAt: new Date('2025-01-01T12:00:00'),
  },
];

async function seedSchedules() {
  console.log('🌱 Seeding schedules...');

  try {
    // 既存のデータを削除（オプション）
    const existingDocs = await db.collection('schedules').get();
    const deletePromises = existingDocs.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`📝 Deleted ${existingDocs.size} existing schedules`);

    // 新しいデータを追加
    for (const schedule of scheduleData) {
      const now = admin.firestore.Timestamp.now();
      const docData = {
        ...schedule,
        date: admin.firestore.Timestamp.fromDate(schedule.date),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('schedules').add(docData);
      console.log(`✅ Created schedule: ${schedule.title} (${docRef.id})`);
    }

    console.log(`\n✨ Successfully seeded ${scheduleData.length} schedules!`);
    console.log('\n📊 Summary:');
    console.log(`  - Published: ${scheduleData.filter(s => s.published).length}`);
    console.log(`  - Draft: ${scheduleData.filter(s => !s.published).length}`);
    console.log(`  - With Links: ${scheduleData.filter(s => s.link).length}`);
    console.log(`  - 2025 Events: ${scheduleData.filter(s => s.date.getFullYear() === 2025).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding schedules:', error);
    process.exit(1);
  }
}

// 実行
seedSchedules()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });