#!/usr/bin/env ts-node

/**
 * ブログ記事シードデータ投入スクリプト
 * 実行方法: npm run seed:blogs
 */

import { db } from '../src/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// サンプル作者データ
const sampleAuthor = {
  id: 'admin-user-001',
  name: 'IK ALUMNI CGT 運営チーム',
  role: 'admin' as const
};

// ブログ記事シードデータ
const blogSeeds = [
  // メンバー関連記事
  {
    title: 'メンバー紹介：田中美咲',
    excerpt: 'チームの中心メンバーである田中美咲さんのダンスへの情熱と、IK ALUMNI CGTでの活動について語っていただきました。',
    content: `<h2>ダンスとの出会い</h2>
<p>田中美咲さんがカラーガードを始めたのは高校生の時。「最初は友達に誘われて軽い気持ちで始めたんです」と当時を振り返ります。しかし、初めて舞台に立った瞬間、観客の拍手と歓声に包まれた感動が忘れられず、本格的にダンスの道を歩み始めました。</p>

<h2>IK ALUMNI CGTでの活動</h2>
<p>現在、田中さんはチームの振付けを担当。「メンバー一人ひとりの個性を活かしながら、全体としての統一感を出すことを心がけています」と語ります。週3回の練習では、技術指導だけでなく、メンタル面でのサポートも欠かしません。</p>

<h2>今後の目標</h2>
<p>「もっと多くの人にカラーガードの魅力を知ってもらいたい」という田中さん。地域のイベントへの積極的な参加や、ワークショップの開催を通じて、カラーガードの普及に努めています。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog1/800/450',
    published: true,
    author: sampleAuthor,
  },
  {
    title: '新メンバー加入！佐藤健太郎',
    excerpt: '元プロダンサーの佐藤健太郎さんがIK ALUMNI CGTに加入。豊富な経験と新しい視点でチームに新風を吹き込みます。',
    content: `<h2>プロフィール</h2>
<p>佐藤健太郎さんは、10年以上のプロダンサーとしての経験を持つベテラン。国内外の数々のコンペティションで入賞経験があり、その技術力は折り紙付きです。</p>

<h2>加入のきっかけ</h2>
<p>「IK ALUMNI CGTのパフォーマンスを見て、チームの温かい雰囲気と高い技術力に魅力を感じました」と佐藤さん。プロとして培った経験を、次世代のダンサーたちに伝えたいという思いから加入を決意しました。</p>

<h2>メッセージ</h2>
<p>「新しい仲間と一緒に、観客の心に残るパフォーマンスを創り上げていきたい」と意気込みを語る佐藤さん。その情熱がチーム全体を盛り上げています。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog2/800/450',
    published: true,
    author: sampleAuthor,
  },
  
  // 舞台裏記事
  {
    title: '舞台裏レポート：春公演の準備風景',
    excerpt: '3ヶ月にわたる春公演の準備期間。メンバーたちの努力と苦労、そして喜びに満ちた舞台裏をお届けします。',
    content: `<h2>構想から形へ</h2>
<p>春公演のテーマが決まったのは昨年12月。「COLORS」というテーマには、メンバー一人ひとりの個性を色で表現し、それが混ざり合って美しいハーモニーを作り出すという意味が込められています。</p>

<h2>厳しい練習の日々</h2>
<p>1月から本格的な練習がスタート。週3回の通常練習に加え、土日は特別練習を実施。特に難しい箇所は何度も繰り返し練習し、全員が完璧に踊れるまで妥協しません。</p>

<h2>衣装とセット</h2>
<p>今回の衣装は、各メンバーのイメージカラーを基調としたオリジナルデザイン。制作には2ヶ月を要し、細部にまでこだわり抜きました。舞台セットも「色の世界」を表現するため、照明との相乗効果を計算して設計されています。</p>

<h2>本番直前</h2>
<p>リハーサルでは、本番さながらの緊張感。「ここまで来たら、あとは楽しむだけ」とリーダーが声をかけ、メンバー全員が笑顔で本番を迎えました。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog3/800/450',
    published: true,
    author: sampleAuthor,
  },
  {
    title: '練習場探訪：私たちの聖地',
    excerpt: 'IK ALUMNI CGTが日々練習を重ねる場所。汗と涙、そして笑顔が詰まった練習場の魅力を紹介します。',
    content: `<h2>理想的な環境</h2>
<p>東京都内にある練習場は、天井高6メートル、床面積200平方メートルの広々とした空間。大きな鏡と最新の音響設備を完備し、プロフェッショナルな練習環境が整っています。</p>

<h2>メンバーの声</h2>
<p>「ここは第二の家のような場所」と語るメンバーたち。早朝から深夜まで、常に誰かが練習している活気ある空間です。</p>

<h2>思い出の詰まった場所</h2>
<p>壁には過去の公演ポスターや写真が飾られ、チームの歴史を物語っています。新メンバーも先輩たちの軌跡を見て、モチベーションを高めています。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog4/800/450',
    published: true,
    author: sampleAuthor,
  },
  
  // インタビュー記事
  {
    title: '特別インタビュー：振付師 山田太郎氏',
    excerpt: '国際的に活躍する振付師、山田太郎氏にカラーガードの魅力と未来について語っていただきました。',
    content: `<h2>カラーガードとの出会い</h2>
<p><strong>Q: カラーガードを始めたきっかけは？</strong><br>
A: 大学時代にマーチングバンドの演技を見て衝撃を受けました。旗やライフルを使った表現の可能性に魅了され、自分でも挑戦したいと思ったのがきっかけです。</p>

<h2>振付けのこだわり</h2>
<p><strong>Q: 振付けを作る際に大切にしていることは？</strong><br>
A: 音楽との一体感です。単に音に合わせて動くのではなく、音楽の持つ感情やストーリーを身体で表現することを心がけています。また、観客の視点を常に意識し、どの角度から見ても美しい動きになるよう工夫しています。</p>

<h2>日本のカラーガード界について</h2>
<p><strong>Q: 日本のカラーガードの現状をどう見ていますか？</strong><br>
A: 技術レベルは世界トップクラスです。特に細やかな表現力と正確性は素晴らしい。ただ、もっと自由で創造的な表現があってもいいと思います。IK ALUMNI CGTのような若いチームが新しい風を吹き込んでくれることを期待しています。</p>

<h2>若手へのメッセージ</h2>
<p><strong>Q: これからカラーガードを始める人へのアドバイスは？</strong><br>
A: 基礎を大切にしてください。華やかな技術も大切ですが、基本的な身体の使い方や表現力が土台になります。そして何より、楽しむことを忘れずに。楽しさが観客にも伝わり、感動を生み出すのです。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog5/800/450',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'OGインタビュー：5年間の軌跡',
    excerpt: '創設メンバーの一人、鈴木花さんに5年間の活動を振り返っていただきました。',
    content: `<h2>創設当時の思い出</h2>
<p><strong>Q: チーム創設時のことを教えてください</strong><br>
A: 最初はたった5人でのスタートでした。練習場所もなく、公園で練習したこともあります。でも、みんな同じ夢を持っていたので、困難も楽しく乗り越えられました。</p>

<h2>成長の軌跡</h2>
<p><strong>Q: 5年間で一番印象に残っていることは？</strong><br>
A: 初めて100人以上の観客の前で演技した時です。拍手をもらった瞬間、これまでの努力が報われた気がして、メンバー全員で泣きました。</p>

<h2>後輩たちへ</h2>
<p><strong>Q: 現役メンバーへのメッセージを</strong><br>
A: チームの伝統を大切にしながら、新しいことにもどんどん挑戦してください。IK ALUMNI CGTらしさを失わず、さらに進化していってほしいです。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog6/800/450',
    published: true,
    author: sampleAuthor,
  },
  
  // 追加記事
  {
    title: 'メンバー日記：合宿の思い出',
    excerpt: '春の強化合宿での3日間。厳しい練習と楽しい思い出が詰まった濃密な時間をメンバーが綴ります。',
    content: `<h2>Day 1 - 基礎の見直し</h2>
<p>朝6時起床、7時から練習開始。基礎トレーニングから始まり、午後は個人技術の向上に集中。夜はミーティングで各自の課題を共有しました。</p>

<h2>Day 2 - チームワークの強化</h2>
<p>全体練習がメイン。新しい振付けに挑戦し、何度も繰り返し練習。夕食後はレクリエーションで親睦を深めました。</p>

<h2>Day 3 - 成果発表</h2>
<p>3日間の成果を発表。見違えるような上達に、指導陣も驚いていました。最後は全員で記念撮影。最高の思い出になりました。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog7/800/450',
    published: true,
    author: sampleAuthor,
  },
  {
    title: '衣装製作の裏側',
    excerpt: '華やかな衣装はどのように作られるのか。デザインから完成まで、衣装製作の全工程を公開します。',
    content: `<h2>デザインコンセプト</h2>
<p>今回のテーマ「COLORS」に合わせ、虹をイメージした7色の衣装を製作。各色が個性を表現しながら、全体で調和するデザインを目指しました。</p>

<h2>素材選び</h2>
<p>動きやすさと見栄えを両立させるため、軽量で光沢のある特殊素材を採用。汗をかいても快適に踊れるよう、通気性も考慮しました。</p>

<h2>製作過程</h2>
<p>プロの衣装デザイナーと協力し、2ヶ月かけて製作。細部の装飾は手作業で、一着一着丁寧に仕上げました。</p>`,
    thumbnail: 'https://picsum.photos/seed/blog8/800/450',
    published: true,
    author: sampleAuthor,
  },
  
  // 非公開記事
  {
    title: '【下書き】夏公演に向けて',
    excerpt: '夏公演の企画が進行中。新しい挑戦と期待に満ちた内容をお届け予定です。',
    content: '<p>準備中...</p>',
    thumbnail: 'https://picsum.photos/seed/draft1/800/450',
    published: false,
    author: sampleAuthor,
  },
  {
    title: '【下書き】新メンバー募集について',
    excerpt: '2025年度の新メンバー募集要項をまとめています。',
    content: '<p>準備中...</p>',
    thumbnail: 'https://picsum.photos/seed/draft2/800/450',
    published: false,
    author: sampleAuthor,
  },
];

// データ投入実行
async function seedBlogs() {
  console.log('📝 ブログ記事シードデータ投入開始...');
  
  try {
    // 既存データをクリア
    const existingDocs = await db.collection('blogs').get();
    const deletePromises = existingDocs.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`🗑️  既存の${existingDocs.size}件のデータを削除しました`);

    // 新規データを投入
    for (const blog of blogSeeds) {
      const now = Timestamp.now();
      const docData = {
        ...blog,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('blogs').add(docData);
      console.log(`✅ Created blog: ${blog.title} (${docRef.id})`);
    }

    console.log(`\n✨ Successfully seeded ${blogSeeds.length} blogs!`);
    console.log('\n📊 Summary:');
    console.log(`  - Published: ${blogSeeds.filter(b => b.published).length}`);
    console.log(`  - Draft: ${blogSeeds.filter(b => !b.published).length}`);
    console.log('\n📂 記事数:');
    console.log(`  - Total: ${blogSeeds.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  }
}

// 実行
seedBlogs()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });