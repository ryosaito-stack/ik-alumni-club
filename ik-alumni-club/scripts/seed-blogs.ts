#!/usr/bin/env ts-node

/**
 * ブログ記事シードデータ投入スクリプト
 * 実行方法: npm run seed:blogs
 */

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

// ブログ記事シードデータ
const blogSeeds = [
  // TECHNOLOGYカテゴリー
  {
    title: 'AIビジネス活用の最前線',
    description: '最新のAI技術をビジネスに活用する方法について、専門家の視点から解説します。',
    excerpt: '最新のAI技術をビジネスに活用する方法について、専門家の視点から解説します。実際の導入事例と成功のポイントを紹介。',
    type: 'article',
    requiredPlan: 'individual',
    author: '山田太郎',
    tags: ['AI', 'ビジネス', 'イノベーション', 'DX'],
    category: 'TECHNOLOGY',
    readTime: 5,
    isPremium: true,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog1/800/450',
    content: `
      <h2>はじめに</h2>
      <p>人工知能（AI）の進化は、ビジネスの在り方を根本的に変えつつあります。本記事では、最新のAI技術をどのようにビジネスに活用できるか、実際の導入事例を交えながら解説していきます。</p>
      
      <h2>AIがもたらすビジネスの変革</h2>
      <p>AIの活用により、以下のような変革が期待できます：</p>
      <ul>
        <li><strong>業務効率の大幅な向上</strong> - 定型業務の自動化により、人的リソースをより創造的な業務に振り向けることが可能</li>
        <li><strong>意思決定の精度向上</strong> - データ分析に基づく客観的な意思決定が可能に</li>
        <li><strong>顧客体験の向上</strong> - パーソナライゼーションにより、個々の顧客に最適化されたサービスを提供</li>
      </ul>
      
      <h2>実際の導入事例</h2>
      <p>大手製造業A社では、AIを活用した品質管理システムを導入し、不良品の検出率を95%以上に向上させました。</p>
      
      <h2>まとめ</h2>
      <p>AI技術の進化は止まることなく、ビジネスへの活用可能性は日々広がっています。重要なのは、自社のビジネス課題を明確にし、それを解決するためにAIをどう活用するかを戦略的に考えることです。</p>
    `,
  },
  
  // LEADERSHIPカテゴリー
  {
    title: 'リーダーシップの新しいかたち',
    description: '変化の激しい現代において、求められるリーダーシップのスタイルが変わってきています。',
    excerpt: '変化の激しい現代において、求められるリーダーシップのスタイルが変わってきています。次世代のリーダーに必要な資質とは。',
    type: 'article',
    requiredPlan: 'individual',
    author: '佐藤花子',
    tags: ['リーダーシップ', 'マネジメント', '組織開発'],
    category: 'LEADERSHIP',
    readTime: 8,
    isPremium: true,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog2/800/450',
    content: `
      <h2>従来のリーダーシップから新しいリーダーシップへ</h2>
      <p>かつてのリーダーシップは、強力なカリスマ性と明確な指示命令系統に基づくものでした。しかし、VUCA（Volatility、Uncertainty、Complexity、Ambiguity）の時代と呼ばれる現代では、このような従来型のリーダーシップだけでは対応が困難になっています。</p>
      
      <h2>サーバントリーダーシップの重要性</h2>
      <p>新しいリーダーシップの形として注目されているのが「サーバントリーダーシップ」です。これは、リーダーがメンバーに奉仕し、メンバーの成長と成功を支援することを最優先とするアプローチです。</p>
      
      <h2>心理的安全性の確保</h2>
      <p>Googleの研究により、チームの生産性に最も重要な要素は「心理的安全性」であることが明らかになりました。リーダーは、メンバーが安心して意見を言える環境を作ることが求められます。</p>
    `,
  },
  
  // BUSINESSカテゴリー
  {
    title: 'グローバル市場への挑戦',
    description: '日本企業が世界市場で成功するための戦略とは。',
    excerpt: '日本企業が世界市場で成功するための戦略とは。海外展開の実例から学ぶ、グローバルビジネスの要諦。',
    type: 'article',
    requiredPlan: 'individual',
    author: '鈴木一郎',
    tags: ['グローバル', 'ビジネス戦略', '海外展開'],
    category: 'BUSINESS',
    readTime: 10,
    isPremium: false,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog3/800/450',
    content: `
      <h2>グローバル展開の必要性</h2>
      <p>日本国内の市場が縮小する中、企業の持続的な成長のためには海外市場への展開が不可欠となっています。</p>
      
      <h2>成功事例から学ぶ</h2>
      <p><strong>事例1：製造業C社</strong><br>
      アジア市場への進出にあたり、現地のニーズに合わせた製品のローカライゼーションを実施。現地パートナーとの協業により、5年で売上を10倍に拡大しました。</p>
      
      <h2>グローバル展開における課題</h2>
      <ul>
        <li>文化や商習慣の違い</li>
        <li>規制や法制度への対応</li>
        <li>為替リスクの管理</li>
        <li>現地人材の確保と育成</li>
      </ul>
    `,
  },
  
  // CAREERカテゴリー
  {
    title: 'キャリアデザインの重要性',
    description: '自身のキャリアを主体的にデザインすることの重要性が高まっています。',
    excerpt: '自身のキャリアを主体的にデザインすることの重要性が高まっています。長期的な視点でキャリアを考える方法とは。',
    type: 'article',
    requiredPlan: 'individual',
    author: '田中美咲',
    tags: ['キャリア', '自己成長', 'スキルアップ'],
    category: 'CAREER',
    readTime: 6,
    isPremium: true,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog4/800/450',
    content: `
      <h2>なぜキャリアデザインが重要なのか</h2>
      <p>終身雇用制度の崩壊、働き方の多様化、技術革新による職業の変化など、私たちを取り巻く環境は大きく変化しています。このような時代において、受動的にキャリアを歩むのではなく、主体的にデザインすることが求められています。</p>
      
      <h2>キャリアデザインの3つのステップ</h2>
      <ol>
        <li><strong>自己理解</strong> - 自分の強み、価値観、興味を明確にする</li>
        <li><strong>目標設定</strong> - 短期・中期・長期の目標を設定する</li>
        <li><strong>行動計画</strong> - 目標達成のための具体的な行動計画を立てる</li>
      </ol>
    `,
  },
  
  // MEMBERカテゴリー
  {
    title: 'メンバーインタビュー：成功への道のり',
    description: 'IK ALUMNIの活動メンバーが語る、成功への道のりと学びの共有。',
    excerpt: 'IK ALUMNIの活動メンバーが語る、成功への道のりと学びの共有。メンバーの実体験から学ぶキャリア形成のヒント。',
    type: 'article',
    requiredPlan: 'individual',
    author: 'IK ALUMNI編集部',
    tags: ['インタビュー', 'メンバー', '成功事例'],
    category: 'MEMBER',
    readTime: 7,
    isPremium: false,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog5/800/450',
    content: `
      <h2>今回のゲスト</h2>
      <p>今回は、起業家として活躍する山本さんにお話を伺いました。学生時代から現在に至るまでの道のりを振り返っていただきます。</p>
      
      <h2>転機となった出来事</h2>
      <p>「大学3年生の時に参加したビジネスコンテストが転機でした。そこで出会った仲間と一緒に起業することになり、今に至ります。」</p>
      
      <h2>後輩へのメッセージ</h2>
      <p>「失敗を恐れずに挑戦することが大切です。失敗から学ぶことの方が多いということを、身をもって経験しました。」</p>
    `,
  },
  
  // BEHINDカテゴリー
  {
    title: 'イベント運営の舞台裏',
    description: '大規模イベント成功の裏側にある、運営チームの努力と工夫を紹介。',
    excerpt: '大規模イベント成功の裏側にある、運営チームの努力と工夫を紹介。イベント運営のノウハウを公開。',
    type: 'article',
    requiredPlan: 'business',
    author: 'イベント運営チーム',
    tags: ['イベント', '舞台裏', '運営'],
    category: 'BEHIND',
    readTime: 5,
    isPremium: true,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog6/800/450',
    content: `
      <h2>イベント準備の流れ</h2>
      <p>3ヶ月前から始まる準備期間。企画立案から当日の運営まで、細かなスケジュール管理が成功の鍵となります。</p>
      
      <h2>チームワークの重要性</h2>
      <p>各セクションとの連携、情報共有の仕組み、トラブル対応など、チーム一丸となって取り組むことが大切です。</p>
      
      <h2>参加者の声</h2>
      <p>「スムーズな運営で、内容に集中できました」「細やかな配慮が感じられて良かった」など、嬉しい声をいただいています。</p>
    `,
  },
  
  // INTERVIEWカテゴリー
  {
    title: '特別対談：業界リーダーが語る未来',
    description: '各業界のリーダーが集まり、これからの10年を展望する特別対談。',
    excerpt: '各業界のリーダーが集まり、これからの10年を展望する特別対談。テクノロジー、ビジネス、社会の変化について議論。',
    type: 'article',
    requiredPlan: 'platinum',
    author: 'IK ALUMNI編集部',
    tags: ['対談', 'インタビュー', '未来予測'],
    category: 'INTERVIEW',
    readTime: 12,
    isPremium: true,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog7/800/450',
    content: `
      <h2>参加者紹介</h2>
      <p>IT業界、金融業界、製造業界から、それぞれのトップランナーをお招きしました。</p>
      
      <h2>テクノロジーがもたらす変化</h2>
      <p>「AIやIoTの進化により、産業構造が大きく変わる」「人間にしかできない価値創造がより重要になる」など、活発な議論が交わされました。</p>
      
      <h2>若手へのアドバイス</h2>
      <p>「変化を恐れず、常に学び続ける姿勢が大切」という点で、全員の意見が一致しました。</p>
    `,
  },
  
  // 追加記事
  {
    title: 'デジタルトランスフォーメーションの実践',
    description: 'DXを成功させるための実践的なアプローチを解説。',
    excerpt: 'DXを成功させるための実践的なアプローチを解説。単なるデジタル化ではない、真の変革を実現する方法。',
    type: 'article',
    requiredPlan: 'business',
    author: 'DXコンサルタント',
    tags: ['DX', 'デジタル', '変革'],
    category: 'TECHNOLOGY',
    readTime: 9,
    isPremium: true,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog8/800/450',
    content: `
      <h2>DXの本質とは</h2>
      <p>デジタルトランスフォーメーションは、単にアナログをデジタルに置き換えることではありません。ビジネスモデルそのものを変革することが本質です。</p>
      
      <h2>成功のポイント</h2>
      <ul>
        <li>経営層のコミットメント</li>
        <li>全社的な意識改革</li>
        <li>段階的な実装アプローチ</li>
        <li>継続的な改善サイクル</li>
      </ul>
    `,
  },
  
  {
    title: 'サステナビリティ経営の実現',
    description: '持続可能な経営を実現するための具体的な取り組みを紹介。',
    excerpt: '持続可能な経営を実現するための具体的な取り組みを紹介。ESG投資の観点からも重要性が高まっています。',
    type: 'article',
    requiredPlan: 'individual',
    author: 'サステナビリティ推進室',
    tags: ['サステナビリティ', 'ESG', '経営'],
    category: 'BUSINESS',
    readTime: 7,
    isPremium: false,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog9/800/450',
    content: `
      <h2>なぜサステナビリティが重要か</h2>
      <p>環境問題への対応、社会的責任の遂行、ガバナンスの強化は、企業の長期的な成長に不可欠な要素となっています。</p>
      
      <h2>具体的な取り組み事例</h2>
      <p>カーボンニュートラルの実現、ダイバーシティの推進、透明性の高い経営など、様々な取り組みが進められています。</p>
    `,
  },
  
  {
    title: 'ネットワーキングの極意',
    description: 'ビジネスを加速させる効果的なネットワーキングの方法。',
    excerpt: 'ビジネスを加速させる効果的なネットワーキングの方法。質の高い人脈を構築するためのテクニック。',
    type: 'article',
    requiredPlan: 'individual',
    author: 'ビジネスコーチ',
    tags: ['ネットワーキング', '人脈', 'ビジネススキル'],
    category: 'CAREER',
    readTime: 5,
    isPremium: false,
    published: true,
    thumbnail: 'https://picsum.photos/seed/blog10/800/450',
    content: `
      <h2>ネットワーキングの基本</h2>
      <p>Give & Takeではなく、Give & Giveの精神が大切。まず相手に価値を提供することから始めましょう。</p>
      
      <h2>オンライン時代のネットワーキング</h2>
      <p>SNSを活用した繋がり作り、オンラインイベントでの交流など、新しい形のネットワーキングが広がっています。</p>
    `,
  },
];

// データ投入実行
async function seedBlogs() {
  console.log('📝 ブログ記事シードデータ投入開始...');
  
  try {
    // contentsコレクションから既存のarticleタイプを削除
    const existingArticles = await db.collection('contents')
      .where('type', '==', 'article')
      .get();
    
    const deletePromises = existingArticles.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`🗑️  既存の${existingArticles.size}件の記事を削除しました`);

    // 新規データを投入
    const batch = db.batch();
    const now = new Date();

    blogSeeds.forEach((blog, index) => {
      const docRef = db.collection('contents').doc();
      
      // 作成日時を少しずつずらす（最新のものが上に来るように）
      const createdAt = new Date(now.getTime() - (index * 24 * 60 * 60 * 1000)); // 1日ずつ前に
      
      batch.set(docRef, {
        ...blog,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      });
    });

    await batch.commit();
    console.log(`✅ ${blogSeeds.length}件のブログ記事を投入しました`);

    // 投入したデータの確認
    const articles = await db.collection('contents')
      .where('type', '==', 'article')
      .get();
    
    console.log('\n📊 投入データサマリー:');
    console.log(`  - 総数: ${articles.size}件`);
    console.log(`  - 公開: ${articles.docs.filter(d => d.data().published).length}件`);
    console.log(`  - プレミアム: ${articles.docs.filter(d => d.data().isPremium).length}件`);
    
    // カテゴリー別集計
    const categoryCounts: { [key: string]: number } = {};
    articles.docs.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    console.log('\n📂 カテゴリー別:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count}件`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }

  console.log('\n✨ ブログ記事シードデータ投入完了！');
  process.exit(0);
}

// 実行
seedBlogs();