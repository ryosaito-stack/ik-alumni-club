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

// サンプルお知らせデータ（シンプル化）
const sampleInformations = [
  {
    date: new Date('2025-08-25'),
    title: '【重要】システムメンテナンスのお知らせ',
    content: '8月25日午前2時〜5時の間、システムメンテナンスを実施いたします。メンテナンス中はサービスをご利用いただけません。ご不便をおかけしますが、ご理解とご協力をお願いいたします。',
    imageUrl: 'https://example.com/images/maintenance.jpg',
    url: 'https://example.com/maintenance-info',
    published: true,
  },
  {
    date: new Date('2025-08-22'),
    title: 'モバイルアプリ リリースのお知らせ',
    content: 'iOS/Android対応のモバイルアプリをリリースしました。App Store/Google Playストアで「IK Alumni」と検索してダウンロードください。',
    imageUrl: 'https://example.com/images/mobile-app.jpg',
    url: 'https://example.com/app-download',
    published: true,
  },
  {
    date: new Date('2025-08-20'),
    title: '特別セミナー「AIビジネスの最前線」開催',
    content: '9月15日（日）14:00〜16:00にオンラインセミナーを開催します。講師は山田太郎氏（AI研究所所長）です。参加希望の方はマイページよりお申し込みください。',
    imageUrl: 'https://example.com/images/seminar-ai.jpg',
    url: 'https://example.com/seminar/ai-business',
    published: true,
  },
  {
    date: new Date('2025-08-18'),
    title: '新機能「メンター予約システム」リリース',
    content: 'メンターの専門分野から検索し、カレンダーから空き時間を確認・予約できる新機能をリリースしました。マイページの「メンター予約」メニューからご利用いただけます。',
    imageUrl: 'https://example.com/images/mentor-system.jpg',
    published: true,
  },
  {
    date: new Date('2025-08-16'),
    title: 'Alumni交流会2025 開催決定',
    content: '10月20日（土）18:00〜21:00、グランドホテル東京にて年次交流会を開催します。プラチナ会員は無料、ビジネス会員3,000円、個人会員5,000円です。',
    imageUrl: 'https://example.com/images/alumni-event.jpg',
    url: 'https://example.com/events/alumni-2025',
    published: true,
  },
  {
    date: new Date('2025-08-15'),
    title: 'サービス利用規約改定のお知らせ',
    content: '9月1日よりサービス利用規約を改定いたします。個人情報保護方針の更新、コンテンツ利用規約の明確化、退会手続きの簡素化などが主な変更点です。',
    url: 'https://example.com/terms',
    published: true,
  },
  {
    date: new Date('2025-08-12'),
    title: 'ビジネスマッチングイベント参加者募集',
    content: '9月5日（木）18:00〜20:00、品川プリンスホテルにてビジネスマッチングイベントを開催します。1対1のビジネスマッチング（各15分×8セッション）を予定しています。',
    imageUrl: 'https://example.com/images/business-matching.jpg',
    url: 'https://example.com/events/business-matching',
    published: true,
  },
  {
    date: new Date('2025-08-10'),
    title: '緊急メンテナンス完了のお知らせ',
    content: '本日午前に発生したログイン障害について、緊急メンテナンスを実施し復旧いたしました。ご迷惑をおかけしましたことを深くお詫び申し上げます。',
    published: true,
  },
  {
    date: new Date('2025-08-08'),
    title: 'オンラインセミナーアーカイブ公開',
    content: '過去のセミナー動画「起業家マインドセット」「デジタルマーケティング入門」「リーダーシップ論」「グローバルビジネス展開」を公開しました。',
    imageUrl: 'https://example.com/images/seminar-archive.jpg',
    url: 'https://example.com/archive',
    published: true,
  },
  {
    date: new Date('2025-08-05'),
    title: '東京駅八重洲口に専用ラウンジオープン',
    content: '個室ミーティングルーム、コワーキングスペース、フリードリンク・軽食、高速Wi-Fi完備のラウンジがオープンしました。営業時間：平日9:00〜21:00、土日祝10:00〜18:00',
    imageUrl: 'https://example.com/images/lounge-tokyo.jpg',
    published: true,
  },
  {
    date: new Date('2025-08-03'),
    title: 'UIデザインリニューアル完了',
    content: 'レスポンシブデザインの改善、ナビゲーションメニューの使いやすさ向上、読み込み速度の高速化、アクセシビリティの向上を実施しました。',
    published: true,
  },
  {
    date: new Date('2025-12-20'),
    title: '年末年始の営業について',
    content: '12月29日（日）〜1月3日（金）は休業期間となります。サービスは通常通りご利用いただけますが、お問い合わせへの返信は1月6日以降となります。',
    published: true,
  },
  // 下書き（未公開）
  {
    date: new Date('2026-01-01'),
    title: '【下書き】新年のご挨拶',
    content: '新年あけましておめでとうございます。旧年中は格別のご厚情を賜り、厚く御礼申し上げます。本年もIK Alumni Clubをよろしくお願いいたします。',
    published: false,
  },
  {
    date: new Date('2025-09-01'),
    title: '【下書き】新サービス開始予定',
    content: '準備中の新サービスについて、詳細は後日発表予定です。',
    published: false,
  },
  {
    date: new Date('2025-09-30'),
    title: '【下書き】メンテナンス予定',
    content: '9月度の定期メンテナンスを予定しています。詳細な日時は確定次第お知らせします。',
    published: false,
  },
];

async function seedInformations() {
  console.log('🌱 Seeding informations...');

  try {
    // 既存のデータを削除（オプション）
    const existingDocs = await db.collection('informations').get();
    const deletePromises = existingDocs.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`📝 Deleted ${existingDocs.size} existing informations`);

    // 新しいデータを追加
    for (const info of sampleInformations) {
      const now = admin.firestore.Timestamp.now();
      const docData = {
        ...info,
        date: admin.firestore.Timestamp.fromDate(info.date),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('informations').add(docData);
      console.log(`✅ Created information: ${info.title} (${docRef.id})`);
    }

    console.log(`\n✨ Successfully seeded ${sampleInformations.length} informations!`);
    console.log('\n📊 Summary:');
    console.log(`  - Published: ${sampleInformations.filter(i => i.published).length}`);
    console.log(`  - Draft: ${sampleInformations.filter(i => !i.published).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding informations:', error);
    process.exit(1);
  }
}

// 実行
seedInformations()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });