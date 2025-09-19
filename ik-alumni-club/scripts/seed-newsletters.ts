#!/usr/bin/env ts-node

/**
 * 会報シードデータ投入スクリプト
 * 実行方法: npm run seed:newsletters
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

// 会報シードデータ
const newsletterSeeds = [
  {
    title: 'IK ALUMNI CGT 会報 第1号',
    issueNumber: 1,
    excerpt: '創刊号！チーム発足の経緯と今後の活動方針について、メンバー紹介を掲載しています。',
    content: `<h2>創刊のご挨拶</h2>
<p>IK ALUMNI CGT サポーターズクラブ会員の皆様、この度は会報第1号をお届けできることを心より嬉しく思います。</p>

<h2>チーム発足の経緯</h2>
<p>私たちIK ALUMNI CGTは、カラーガードの魅力を多くの方々に伝えたいという思いから2020年に発足しました。元々は大学のサークル活動から始まり、卒業後も継続して活動を続けるメンバーが集まって現在のチームが形成されました。</p>

<h2>今年度の活動計画</h2>
<ul>
  <li>春季公演「COLORS」（4月開催）</li>
  <li>地域イベントへの参加（6月、9月）</li>
  <li>冬季公演「Winter Magic」（12月開催）</li>
  <li>ワークショップの定期開催（毎月第3土曜日）</li>
</ul>

<h2>メンバー紹介</h2>
<p>現在、総勢15名のメンバーで活動しています。それぞれが個性豊かで、チーム全体に活気をもたらしています。詳しいメンバープロフィールは次号以降で順次ご紹介していきます。</p>

<h2>サポーターズクラブについて</h2>
<p>皆様のご支援により、私たちは質の高いパフォーマンスをお届けすることができます。会員特典として、公演チケットの優先予約、リハーサル見学、限定グッズの提供などをご用意しています。</p>`,
    pdfUrl: 'https://example.com/newsletters/issue-001.pdf',
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第2号',
    issueNumber: 2,
    excerpt: '春季公演「COLORS」大成功！公演レポートと舞台裏エピソードを特集。',
    content: `<h2>春季公演「COLORS」公演レポート</h2>
<p>4月15日、16日の2日間にわたって開催された春季公演「COLORS」は、延べ500名を超える観客の皆様にご来場いただき、大成功を収めることができました。</p>

<h2>公演ハイライト</h2>
<p>今回の公演テーマ「COLORS」は、メンバー一人ひとりの個性を色で表現し、それが混ざり合って美しいハーモニーを作り出すというコンセプトでした。</p>

<h3>第1幕「Primary Colors」</h3>
<p>赤・青・黄の三原色をテーマに、力強いパフォーマンスで幕を開けました。特に、フラッグワークとライフルの組み合わせは圧巻でした。</p>

<h3>第2幕「Rainbow」</h3>
<p>7色の虹をイメージした華やかな演出。衣装替えを含む複雑な構成でしたが、メンバー全員の息の合った動きで観客を魅了しました。</p>

<h2>舞台裏エピソード</h2>
<p>本番前日のリハーサルでは、照明の不具合というアクシデントがありましたが、スタッフとメンバーが一丸となって対応し、本番では完璧な照明演出を実現できました。</p>

<h2>観客の声</h2>
<blockquote>「カラーガードを初めて観ましたが、こんなに感動するとは思いませんでした」（40代女性）</blockquote>
<blockquote>「色とりどりの衣装と旗が美しく、まるで絵画を見ているようでした」（20代男性）</blockquote>`,
    pdfUrl: 'https://example.com/newsletters/issue-002.pdf',
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第3号',
    issueNumber: 3,
    excerpt: '夏の地域イベント参加報告。子どもたちとの交流ワークショップの様子をお届けします。',
    content: `<h2>地域イベント参加報告</h2>
<p>6月から7月にかけて、地域の様々なイベントに参加させていただきました。</p>

<h3>市民祭りでのパフォーマンス</h3>
<p>6月18日に開催された市民祭りでは、野外ステージで20分間のパフォーマンスを披露。天候にも恵まれ、多くの方々に楽しんでいただけました。</p>

<h3>子ども向けワークショップ</h3>
<p>7月2日、地域の児童館で小学生向けのカラーガード体験ワークショップを開催しました。30名の子どもたちが参加し、簡単なフラッグの扱い方を学びました。</p>

<h2>メンバーインタビュー：山田花子</h2>
<p><strong>Q: カラーガードを始めたきっかけは？</strong><br>
A: 高校の文化祭で先輩の演技を見て感動し、自分もやってみたいと思いました。</p>

<p><strong>Q: IK ALUMNI CGTの魅力は？</strong><br>
A: メンバー同士の仲が良く、お互いを高め合える環境があることです。技術面だけでなく、人間的にも成長できる場所だと思います。</p>

<h2>今後の予定</h2>
<ul>
  <li>8月：夏季強化合宿</li>
  <li>9月：秋の地域イベント参加</li>
  <li>10月：ハロウィン特別公演準備開始</li>
</ul>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第4号',
    issueNumber: 4,
    excerpt: '秋の活動報告と冬季公演「Winter Magic」の見どころをご紹介。新メンバーも加入！',
    content: `<h2>新メンバー加入のお知らせ</h2>
<p>この秋、3名の新メンバーがIK ALUMNI CGTに加わりました。フレッシュな風を吹き込んでくれる彼らの活躍にご期待ください。</p>

<h2>秋のイベント参加報告</h2>
<p>9月から10月にかけて、文化祭や地域の秋祭りなど、様々なイベントに参加しました。特に10月のハロウィンイベントでは、仮装を取り入れた特別パフォーマンスが大好評でした。</p>

<h2>冬季公演「Winter Magic」予告</h2>
<p>12月23日、24日に開催予定の冬季公演「Winter Magic」の準備が着々と進んでいます。</p>

<h3>公演概要</h3>
<ul>
  <li>日時：12月23日（土）14:00/18:00、24日（日）13:00/17:00</li>
  <li>会場：市民文化ホール</li>
  <li>チケット：会員優先予約受付中</li>
</ul>

<h3>見どころ</h3>
<p>今回は「冬の魔法」をテーマに、雪と氷の世界を表現します。LED付きの特殊な道具を使用し、幻想的な演出を予定しています。</p>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第5号',
    issueNumber: 5,
    excerpt: '2024年を振り返って。年間活動報告と来年度の展望をお伝えします。',
    content: `<h2>2024年活動総括</h2>
<p>本年も皆様の温かいご支援により、充実した活動を行うことができました。</p>

<h3>年間実績</h3>
<ul>
  <li>公演回数：8回（春季2回、冬季4回、特別公演2回）</li>
  <li>イベント参加：15回</li>
  <li>ワークショップ開催：12回</li>
  <li>総観客動員数：約2,000名</li>
</ul>

<h2>冬季公演「Winter Magic」大成功</h2>
<p>12月の冬季公演は、4回公演すべて満席という快挙を達成しました。特に、フィナーレの雪の演出は多くの観客から感動の声をいただきました。</p>

<h2>2025年の展望</h2>
<p>来年は団体設立5周年を迎えます。記念公演の開催や、海外チームとの交流など、新しい挑戦を計画しています。</p>

<h3>主な予定</h3>
<ul>
  <li>3月：5周年記念公演</li>
  <li>5月：海外チーム招聘公演</li>
  <li>7月：サマーフェスティバル開催</li>
  <li>11月：全国大会出場</li>
</ul>

<h2>会員の皆様へ</h2>
<p>本年も変わらぬご支援をいただき、心より感謝申し上げます。来年も、より質の高いパフォーマンスをお届けできるよう、メンバー一同精進してまいります。</p>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第6号',
    issueNumber: 6,
    excerpt: '5周年記念特別号！チームの歴史と未来への展望を特集。特別インタビューも掲載。',
    content: `<h2>祝・設立5周年</h2>
<p>IK ALUMNI CGTは、おかげさまで設立5周年を迎えることができました。これもひとえに、サポーターズクラブ会員の皆様のご支援の賜物です。</p>

<h2>5年間の軌跡</h2>
<h3>2020年 - 創設期</h3>
<p>大学サークルのOB・OG 5名で活動開始。練習場所の確保から始まった挑戦の日々。</p>

<h3>2021年 - 成長期</h3>
<p>メンバーが10名に増加。初めての自主公演を開催し、200名の観客を動員。</p>

<h3>2022年 - 発展期</h3>
<p>地域イベントへの参加が増え、知名度が向上。サポーターズクラブ設立。</p>

<h3>2023年 - 充実期</h3>
<p>年間公演回数が10回を超える。ワークショップ事業も本格化。</p>

<h3>2024年 - 飛躍期</h3>
<p>メンバー20名体制に。全国大会出場権獲得。</p>

<h2>記念公演情報</h2>
<p>3月20日、21日に開催する5周年記念公演「Journey」の詳細が決定しました。これまでの5年間の集大成となる特別な公演をお届けします。</p>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第7号',
    issueNumber: 7,
    excerpt: '春の新体制スタート！新リーダー就任と今年度の活動方針について。',
    content: `<h2>新体制発表</h2>
<p>4月より新しい体制でスタートしました。</p>

<h3>新リーダーメッセージ</h3>
<p>この度、リーダーに就任しました佐藤です。先代が築いてきた伝統を大切にしながら、新しいことにも挑戦していきたいと思います。</p>

<h2>今年度の活動方針</h2>
<ol>
  <li>技術力の更なる向上</li>
  <li>地域貢献活動の拡充</li>
  <li>若手育成プログラムの強化</li>
  <li>国際交流の推進</li>
</ol>

<h2>新メンバー募集</h2>
<p>現在、2025年度の新メンバーを募集しています。経験は問いません。カラーガードに興味がある方、一緒に活動してみませんか？</p>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第8号',
    issueNumber: 8,
    excerpt: '夏季強化合宿レポート。3日間の密着取材で見えたチームの絆。',
    content: `<h2>夏季強化合宿2025</h2>
<p>7月15日から17日までの3日間、恒例の夏季強化合宿を実施しました。</p>

<h3>Day 1 - 基礎強化</h3>
<p>初日は基礎トレーニングに重点を置き、フラッグワークの基本動作を徹底的に練習しました。</p>

<h3>Day 2 - 新演目練習</h3>
<p>秋公演に向けた新演目の振り付けを開始。複雑な隊形変化を何度も繰り返し練習しました。</p>

<h3>Day 3 - 通し稽古</h3>
<p>最終日は本番を想定した通し稽古。3日間の成果が表れ、見違えるような完成度になりました。</p>

<h2>メンバーの声</h2>
<p>「きつかったけど、チーム全体のレベルが確実に上がったと感じます」</p>
<p>「合宿を通じて、メンバー同士の絆がさらに深まりました」</p>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第9号',
    issueNumber: 9,
    excerpt: '全国大会出場決定！予選突破の軌跡と本戦への意気込み。',
    content: `<h2>祝！全国大会出場決定</h2>
<p>9月10日に行われた地区予選において、見事1位通過を果たし、11月の全国大会への出場が決定しました！</p>

<h2>予選レポート</h2>
<p>今回の予選には8チームが参加。私たちは「Infinity」という演目で挑みました。無限の可能性を表現した構成が評価され、技術点・芸術点ともに高得点を獲得しました。</p>

<h2>本戦への準備</h2>
<p>全国大会まで残り2ヶ月。さらなるブラッシュアップを図るため、特別練習を増やしています。</p>

<h2>応援のお願い</h2>
<p>11月25日、26日に東京で開催される全国大会。会員の皆様の応援が私たちの力になります。ぜひ会場でご声援をお願いします。</p>`,
    published: true,
  },
  {
    title: 'IK ALUMNI CGT 会報 第10号（記念号）',
    issueNumber: 10,
    excerpt: '会報10号記念特大号！全国大会結果報告と今後の展望。読者プレゼントも！',
    content: `<h2>全国大会 銅賞受賞！</h2>
<p>11月25日、26日に開催された全国大会において、IK ALUMNI CGTは見事銅賞を受賞しました！</p>

<h2>大会を振り返って</h2>
<p>全国から集まった20チームの中で、私たちは持てる力を全て出し切ることができました。結果は3位でしたが、全国レベルの舞台で評価されたことは大きな自信になりました。</p>

<h2>審査員講評</h2>
<blockquote>「チーム全体の一体感が素晴らしく、特に後半の盛り上がりは観客を引き込む力がありました」</blockquote>

<h2>会報10号記念企画</h2>
<p>会報が10号を迎えたことを記念して、読者プレゼントをご用意しました！</p>
<ul>
  <li>特製ピンバッジ（10名様）</li>
  <li>練習見学券（5組10名様）</li>
  <li>サイン入りポスター（3名様）</li>
</ul>

<h2>次なる目標</h2>
<p>来年は全国大会での金賞獲得を目指します。また、海外遠征も視野に入れ、世界レベルでの活動を展開していく予定です。</p>

<h2>会員の皆様へ感謝</h2>
<p>会報も10号を数え、チームも大きく成長しました。これからも変わらぬご支援をよろしくお願いいたします。</p>`,
    published: true,
  },
  // 下書き
  {
    title: 'IK ALUMNI CGT 会報 第11号（準備中）',
    issueNumber: 11,
    excerpt: '新年のご挨拶と春季公演の情報をお届け予定です。',
    content: '<p>現在準備中...</p>',
    published: false,
  },
  {
    title: 'IK ALUMNI CGT 会報 第12号（準備中）',
    issueNumber: 12,
    excerpt: '年度総括号として準備中です。',
    content: '<p>現在準備中...</p>',
    published: false,
  },
];

// データ投入実行
async function seedNewsletters() {
  console.log('📰 会報シードデータ投入開始...');
  
  try {
    // 既存データをクリア
    const existingDocs = await db.collection('newsletters').get();
    const deletePromises = existingDocs.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`🗑️  既存の${existingDocs.size}件のデータを削除しました`);

    // 新規データを投入
    for (const newsletter of newsletterSeeds) {
      const now = admin.firestore.Timestamp.now();
      const docData = {
        ...newsletter,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('newsletters').add(docData);
      console.log(`✅ Created newsletter: 第${newsletter.issueNumber}号 - ${newsletter.title} (${docRef.id})`);
    }

    console.log(`\n✨ Successfully seeded ${newsletterSeeds.length} newsletters!`);
    console.log('\n📊 Summary:');
    console.log(`  - Published: ${newsletterSeeds.filter(n => n.published).length}`);
    console.log(`  - Draft: ${newsletterSeeds.filter(n => !n.published).length}`);
    console.log(`  - With PDF: ${newsletterSeeds.filter(n => n.pdfUrl).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding newsletters:', error);
    process.exit(1);
  }
}

// 実行
seedNewsletters()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });