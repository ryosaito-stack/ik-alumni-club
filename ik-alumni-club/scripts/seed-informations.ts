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

// サンプルお知らせデータ
const sampleInformations = [
  // ===== メンテナンス関連 =====
  {
    title: '【重要】システムメンテナンスのお知らせ',
    date: new Date('2025-08-25'),
    category: 'メンテナンス',
    content: `
      <p>いつもIK Alumni Clubをご利用いただきありがとうございます。</p>
      <br />
      <p>システムメンテナンスを下記の日程で実施いたします。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">メンテナンス日時</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li><strong>日時：</strong>2025年8月25日（日）午前2:00〜午前5:00</li>
        <li><strong>影響：</strong>メンテナンス中はサービスをご利用いただけません</li>
      </ul>
      <br />
      <p>ご不便をおかけしますが、ご理解とご協力をお願いいたします。</p>
    `,
    summary: '8月25日午前2時〜5時の間、システムメンテナンスを実施いたします。',
    targetMembers: ['ALL'],
    isPinned: true,
    published: true,
    author: {
      id: 'system',
      name: 'システム管理者',
      role: 'admin'
    }
  },
  {
    title: '緊急メンテナンス完了のお知らせ',
    date: new Date('2025-08-10'),
    category: 'メンテナンス',
    content: `
      <p>8月10日午前に発生したシステム障害について、緊急メンテナンスを実施し、復旧いたしました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">障害内容</h3>
      <p>一部のユーザー様でログインができない事象が発生</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">対応内容</h3>
      <p>認証システムの修正を実施し、現在は正常に動作しております。</p>
      <br />
      <p>ご迷惑をおかけしましたことを深くお詫び申し上げます。</p>
    `,
    summary: '本日午前のログイン障害は復旧しました。ご迷惑をおかけし申し訳ございません。',
    targetMembers: ['ALL'],
    isPinned: false,
    published: true,
    author: {
      id: 'system',
      name: 'システム管理者',
      role: 'admin'
    }
  },

  // ===== プラチナ会員限定 =====
  {
    title: 'プラチナ会員限定 特別セミナー開催',
    date: new Date('2025-08-20'),
    category: 'お知らせ',
    content: `
      <p>プラチナ会員の皆様へ</p>
      <br />
      <p>この度、プラチナ会員限定の特別セミナーを開催することになりました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">セミナー概要</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li><strong>タイトル：</strong>「AIビジネスの最前線」</li>
        <li><strong>講師：</strong>山田太郎氏（AI研究所所長）</li>
        <li><strong>日時：</strong>2025年9月15日（日）14:00〜16:00</li>
        <li><strong>形式：</strong>オンライン（Zoom）</li>
        <li><strong>定員：</strong>30名（先着順）</li>
      </ul>
      <br />
      <p>参加希望の方は、マイページよりお申し込みください。</p>
    `,
    summary: '9月15日開催のプラチナ会員限定セミナー「AIビジネスの最前線」の参加者を募集中です。',
    targetMembers: ['PLATINUM'],
    isPinned: false,
    published: true,
    author: {
      id: 'admin001',
      name: '運営事務局',
      role: 'admin'
    }
  },
  {
    title: 'プラチナ会員専用ラウンジオープン',
    date: new Date('2025-08-05'),
    category: 'お知らせ',
    content: `
      <p>プラチナ会員の皆様へ朗報です！</p>
      <br />
      <p>東京駅八重洲口に、プラチナ会員専用ラウンジがオープンしました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">ラウンジ設備</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>個室ミーティングルーム（3室）</li>
        <li>コワーキングスペース</li>
        <li>フリードリンク・軽食</li>
        <li>高速Wi-Fi完備</li>
      </ul>
      <br />
      <p>営業時間：平日 9:00〜21:00、土日祝 10:00〜18:00</p>
    `,
    summary: '東京駅八重洲口にプラチナ会員専用ラウンジがオープンしました。',
    targetMembers: ['PLATINUM'],
    isPinned: false,
    published: true,
    author: {
      id: 'facility001',
      name: '施設管理部',
      role: 'admin'
    }
  },

  // ===== ビジネス会員以上 =====
  {
    title: '新機能「メンター予約システム」リリース',
    date: new Date('2025-08-18'),
    category: '更新情報',
    content: `
      <p>ビジネス会員・プラチナ会員の皆様へ</p>
      <br />
      <p>お待たせいたしました。新機能「メンター予約システム」をリリースしました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">主な機能</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>メンターの専門分野から検索</li>
        <li>カレンダーから空き時間を確認・予約</li>
        <li>オンライン/オフライン選択可能</li>
        <li>セッション後のフィードバック機能</li>
      </ul>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">ご利用方法</h3>
      <p>マイページの「メンター予約」メニューからご利用いただけます。</p>
      <br />
      <p>詳しい使い方はヘルプページをご覧ください。</p>
    `,
    summary: 'ビジネス会員以上の方々が1対1メンタリングを予約できる新機能をリリースしました。',
    targetMembers: ['PLATINUM', 'BUSINESS'],
    isPinned: false,
    published: true,
    author: {
      id: 'dev001',
      name: '開発チーム',
      role: 'admin'
    }
  },
  {
    title: 'ビジネスマッチングイベント参加者募集',
    date: new Date('2025-08-12'),
    category: 'お知らせ',
    content: `
      <p>ビジネス会員・プラチナ会員限定のマッチングイベントを開催します。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">イベント詳細</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li><strong>日時：</strong>2025年9月5日（木）18:00〜20:00</li>
        <li><strong>場所：</strong>品川プリンスホテル</li>
        <li><strong>内容：</strong>1対1のビジネスマッチング（各15分×8セッション）</li>
        <li><strong>参加費：</strong>無料</li>
      </ul>
      <br />
      <p>事前にプロフィールを登録いただき、AIマッチングで最適な相手をご紹介します。</p>
    `,
    summary: '9月5日開催のビジネスマッチングイベントの参加者を募集しています。',
    targetMembers: ['PLATINUM', 'BUSINESS'],
    isPinned: false,
    published: true,
    author: {
      id: 'event001',
      name: 'イベント企画室',
      role: 'admin'
    }
  },

  // ===== 個人会員以上 =====
  {
    title: 'Alumni交流会2025 開催決定',
    date: new Date('2025-08-16'),
    category: 'お知らせ',
    content: `
      <p>会員の皆様へ</p>
      <br />
      <p>毎年恒例のAlumni交流会を今年も開催いたします！</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">開催概要</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li><strong>日時：</strong>2025年10月20日（土）18:00〜21:00</li>
        <li><strong>場所：</strong>グランドホテル東京 3F バンケットホール</li>
        <li><strong>参加費：</strong>
          <ul style="list-style: circle; padding-left: 2rem; margin: 0.5rem 0;">
            <li>プラチナ会員：無料</li>
            <li>ビジネス会員：3,000円</li>
            <li>個人会員：5,000円</li>
          </ul>
        </li>
        <li><strong>定員：</strong>200名</li>
      </ul>
      <br />
      <p>詳細は後日お知らせいたします。ぜひご予定ください！</p>
    `,
    summary: '10月20日に開催する年次交流会の日程が決定しました。詳細は後日お知らせします。',
    targetMembers: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL'],
    isPinned: false,
    published: true,
    author: {
      id: 'event001',
      name: 'イベント企画室',
      role: 'admin'
    }
  },
  {
    title: 'オンラインセミナーアーカイブ公開',
    date: new Date('2025-08-08'),
    category: '更新情報',
    content: `
      <p>会員の皆様からご要望の多かった過去のセミナー動画を公開しました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">公開コンテンツ</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>「起業家マインドセット」（60分）</li>
        <li>「デジタルマーケティング入門」（90分）</li>
        <li>「リーダーシップ論」（45分）</li>
        <li>「グローバルビジネス展開」（75分）</li>
      </ul>
      <br />
      <p>マイページの「アーカイブ」メニューからご視聴いただけます。</p>
    `,
    summary: '過去のセミナー動画4本をアーカイブとして公開しました。',
    targetMembers: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL'],
    isPinned: false,
    published: true,
    author: {
      id: 'content001',
      name: 'コンテンツ制作部',
      role: 'admin'
    }
  },

  // ===== 全員向け（更新情報） =====
  {
    title: 'モバイルアプリ リリースのお知らせ',
    date: new Date('2025-08-22'),
    category: '更新情報',
    content: `
      <p>お待たせしました！IK Alumni Clubのモバイルアプリがリリースされました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">主な機能</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>プッシュ通知でお知らせを受信</li>
        <li>オフラインでもコンテンツ閲覧可能</li>
        <li>Face ID/Touch IDでのログイン</li>
        <li>ダークモード対応</li>
      </ul>
      <br />
      <p>App Store/Google Playストアで「IK Alumni」と検索してダウンロードください。</p>
    `,
    summary: 'iOS/Android対応のモバイルアプリをリリースしました。',
    targetMembers: ['ALL'],
    isPinned: false,
    published: true,
    author: {
      id: 'dev002',
      name: 'モバイル開発チーム',
      role: 'admin'
    }
  },
  {
    title: 'UIデザインリニューアル完了',
    date: new Date('2025-08-03'),
    category: '更新情報',
    content: `
      <p>本日、サイトのUIデザインを全面リニューアルしました。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">主な変更点</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>レスポンシブデザインの改善</li>
        <li>ナビゲーションメニューの使いやすさ向上</li>
        <li>読み込み速度の高速化</li>
        <li>アクセシビリティの向上</li>
      </ul>
      <br />
      <p>ご意見・ご要望がございましたら、お問い合わせフォームよりお寄せください。</p>
    `,
    summary: 'サイトのUIデザインを全面リニューアルしました。',
    targetMembers: ['ALL'],
    isPinned: false,
    published: true,
    author: {
      id: 'design001',
      name: 'デザインチーム',
      role: 'admin'
    }
  },

  // ===== 全員向け（お知らせ） =====
  {
    title: 'サービス利用規約改定のお知らせ',
    date: new Date('2025-08-15'),
    category: 'お知らせ',
    content: `
      <p>IK Alumni Clubをご利用の皆様へ</p>
      <br />
      <p>2025年9月1日より、サービス利用規約を改定いたします。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">主な変更点</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>個人情報保護方針の更新</li>
        <li>コンテンツ利用規約の明確化</li>
        <li>退会手続きの簡素化</li>
      </ul>
      <br />
      <p>詳細は<a href="#" style="color: blue; text-decoration: underline;">こちら</a>からご確認ください。</p>
    `,
    summary: '9月1日よりサービス利用規約を改定いたします。詳細をご確認ください。',
    targetMembers: ['ALL'],
    isPinned: false,
    published: true,
    author: {
      id: 'legal001',
      name: '法務部',
      role: 'admin'
    }
  },
  {
    title: '年末年始の営業について',
    date: new Date('2025-12-20'),
    category: 'お知らせ',
    content: `
      <p>年末年始の営業についてお知らせいたします。</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">休業期間</h3>
      <p>2025年12月29日（日）〜2026年1月3日（金）</p>
      <br />
      <h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 1rem;">ご注意事項</h3>
      <ul style="list-style: disc; padding-left: 2rem; margin: 1rem 0;">
        <li>休業期間中もサービスは通常通りご利用いただけます</li>
        <li>お問い合わせへの返信は1月6日以降となります</li>
        <li>緊急のシステム障害時は対応いたします</li>
      </ul>
      <br />
      <p>良いお年をお迎えください。</p>
    `,
    summary: '年末年始（12/29〜1/3）の営業についてのお知らせです。',
    targetMembers: ['ALL'],
    isPinned: false,
    published: true,
    author: {
      id: 'admin001',
      name: '運営事務局',
      role: 'admin'
    }
  },

  // ===== 下書き =====
  {
    title: '【下書き】新年のご挨拶',
    date: new Date('2026-01-01'),
    category: 'お知らせ',
    content: `
      <p>新年あけましておめでとうございます。</p>
      <br />
      <p>旧年中は格別のご厚情を賜り、厚く御礼申し上げます。</p>
      <br />
      <p>本年もIK Alumni Clubをよろしくお願いいたします。</p>
    `,
    summary: '新年のご挨拶（下書き）',
    targetMembers: ['ALL'],
    isPinned: false,
    published: false,
    author: {
      id: 'admin001',
      name: '運営事務局',
      role: 'admin'
    }
  },
  {
    title: '【下書き】新サービス開始予定',
    date: new Date('2025-09-01'),
    category: '更新情報',
    content: `
      <p>準備中の新サービスについて</p>
      <br />
      <p>詳細は後日発表予定です。</p>
    `,
    summary: '新サービス開始の準備中（下書き）',
    targetMembers: ['PLATINUM', 'BUSINESS'],
    isPinned: false,
    published: false,
    author: {
      id: 'dev001',
      name: '開発チーム',
      role: 'admin'
    }
  },
  {
    title: '【下書き】メンテナンス予定',
    date: new Date('2025-09-30'),
    category: 'メンテナンス',
    content: `
      <p>9月度の定期メンテナンスを予定しています。</p>
      <br />
      <p>詳細な日時は確定次第お知らせします。</p>
    `,
    summary: '9月度定期メンテナンスの予定（下書き）',
    targetMembers: ['ALL'],
    isPinned: false,
    published: false,
    author: {
      id: 'system',
      name: 'システム管理者',
      role: 'admin'
    }
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
    console.log(`  - Pinned: ${sampleInformations.filter(i => i.isPinned).length}`);
    console.log(`  - Categories: ${[...new Set(sampleInformations.map(i => i.category))].join(', ')}`);
    
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