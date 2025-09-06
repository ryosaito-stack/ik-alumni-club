#!/usr/bin/env ts-node

/**
 * 動画シードデータ投入スクリプト
 * 実行方法: npm run seed:videos
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

// 動画シードデータ
const videoSeeds = [
  // CONFERENCE カテゴリー
  {
    title: 'IK ALUMNI サマーカンファレンス 2025',
    description: 'IK ALUMNI CGTが主催する年次カンファレンス。今年のテーマは「ダンスとテクノロジーの融合」。業界のトップダンサーやテクノロジストが集結し、パフォーマンスアートの未来について議論しました。基調講演、パネルディスカッション、ワークショップなど、充実したプログラムが展開されました。',
    category: 'CONFERENCE',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/conf1/1280/720',
    published: true,
    featuredInCarousel: true,
    sortOrder: 1,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: 'グローバルダンスカンファレンス 2025 Tokyo',
    description: '世界各国から集まったダンサーによる国際カンファレンス。異文化交流を通じた新しいダンススタイルの創造、グローバルなダンスコミュニティの形成について活発な議論が行われました。',
    category: 'CONFERENCE',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnail: 'https://picsum.photos/seed/conf2/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },

  // SEMINAR カテゴリー
  {
    title: 'ダンステクニック向上セミナー Vol.1',
    description: 'プロダンサーによる技術向上セミナー。基礎的な身体の使い方から、高度なテクニックまで幅広くカバー。初心者から上級者まで、レベルに応じた指導を受けることができます。',
    category: 'SEMINAR',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnail: 'https://picsum.photos/seed/sem1/1280/720',
    published: true,
    featuredInCarousel: true,
    sortOrder: 2,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: 'カラーガード基礎技術セミナー',
    description: 'カラーガードの基本的な技術を学ぶセミナー。フラッグ、ライフル、セイバーの扱い方から、基本的な振り付けまで、初心者にもわかりやすく解説します。',
    category: 'SEMINAR',
    videoUrl: 'https://www.youtube.com/watch?v=WPPPFqsECz0',
    thumbnail: 'https://picsum.photos/seed/sem2/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },

  // WORKSHOP カテゴリー
  {
    title: '振付創作ワークショップ 2025',
    description: '振付師による創作ワークショップ。音楽の解釈から動きの構成まで、振付創作のプロセスを実践的に学びます。参加者同士のグループワークも含まれます。',
    category: 'WORKSHOP',
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    thumbnail: 'https://picsum.photos/seed/work1/1280/720',
    published: true,
    featuredInCarousel: true,
    sortOrder: 3,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: 'パフォーマンス演出ワークショップ',
    description: '舞台演出の基礎から応用まで学ぶワークショップ。照明、音響、衣装などの総合的な演出について、実際の舞台を想定しながら学習します。',
    category: 'WORKSHOP',
    videoUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    thumbnail: 'https://picsum.photos/seed/work2/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },

  // INTERVIEW カテゴリー
  {
    title: 'メンバーインタビュー：山田花子',
    description: 'IK ALUMNI CGTの中心メンバーである山田花子さんへのインタビュー。ダンスを始めたきっかけ、チームでの活動、今後の目標などについて語っていただきました。',
    category: 'INTERVIEW',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnail: 'https://picsum.photos/seed/int1/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: '特別インタビュー：ゲスト振付師 佐藤太郎',
    description: '国際的に活躍する振付師、佐藤太郎氏へのスペシャルインタビュー。世界のダンスシーンの現状、日本のダンス文化の特徴、若手ダンサーへのメッセージなどを伺いました。',
    category: 'INTERVIEW',
    videoUrl: 'https://www.youtube.com/watch?v=QfW6PN-LV5Y',
    thumbnail: 'https://picsum.photos/seed/int2/1280/720',
    published: true,
    featuredInCarousel: true,
    sortOrder: 4,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },

  // EVENT カテゴリー
  {
    title: 'アニュアルショー2025 ハイライト',
    description: '年に一度の大規模公演「アニュアルショー2025」のハイライト映像。圧巻のパフォーマンスと感動的なフィナーレまで、公演の見どころを凝縮してお届けします。',
    category: 'EVENT',
    videoUrl: 'https://www.youtube.com/watch?v=hhJ40m6cAMw',
    thumbnail: 'https://picsum.photos/seed/event1/1280/720',
    published: true,
    featuredInCarousel: true,
    sortOrder: 5,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: 'チャリティーイベント 2025',
    description: '地域貢献活動の一環として開催されたチャリティーイベント。収益は全額、地域の芸術教育支援に寄付されました。温かい雰囲気の中で行われた素晴らしいパフォーマンスをご覧ください。',
    category: 'EVENT',
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    thumbnail: 'https://picsum.photos/seed/event2/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },

  // FEATURE カテゴリー
  {
    title: 'IK ALUMNI CGT ドキュメンタリー',
    description: 'チームの歴史と現在を追ったドキュメンタリー作品。創設から現在に至るまでの軌跡、メンバーの想い、そして未来への展望を描いた感動作です。',
    category: 'FEATURE',
    videoUrl: 'https://www.youtube.com/watch?v=fLexgOxsZu0',
    thumbnail: 'https://picsum.photos/seed/feat1/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: '特集：カラーガードの魅力',
    description: 'カラーガードの魅力を多角的に紹介する特集番組。技術的な側面だけでなく、芸術性、チームワーク、そして観客を魅了する秘密に迫ります。',
    category: 'FEATURE',
    videoUrl: 'https://www.youtube.com/watch?v=nCkpzqqog4k',
    thumbnail: 'https://picsum.photos/seed/feat2/1280/720',
    published: true,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },

  // 非公開コンテンツ（管理画面でのみ表示）
  {
    title: '【準備中】新作パフォーマンス練習風景',
    description: '次回公演に向けた新作の練習風景。メンバー限定公開予定。',
    category: 'EVENT',
    videoUrl: '',
    thumbnail: 'https://picsum.photos/seed/draft1/1280/720',
    published: false,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
  {
    title: '【編集中】メンバー座談会',
    description: 'メンバーによる座談会の収録映像。編集完了後に公開予定。',
    category: 'INTERVIEW',
    videoUrl: '',
    thumbnail: 'https://picsum.photos/seed/draft2/1280/720',
    published: false,
    featuredInCarousel: false,
    author: {
      id: 'admin',
      name: 'IK ALUMNI CGT 運営事務局',
      email: 'admin@ikalumni.com'
    },
  },
];

// データ投入実行
async function seedVideos() {
  console.log('🎬 動画シードデータ投入開始...');
  
  try {
    // 既存データをクリア
    const existingDocs = await db.collection('videos').get();
    const deletePromises = existingDocs.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`🗑️  既存の${existingDocs.size}件のデータを削除しました`);

    // 新規データを投入
    const batch = db.batch();
    const now = new Date();

    videoSeeds.forEach((video, index) => {
      const docRef = db.collection('videos').doc();
      
      // 作成日時を少しずつずらす（最新のものが上に来るように）
      const createdAt = new Date(now.getTime() - (index * 24 * 60 * 60 * 1000)); // 1日ずつ前に
      
      batch.set(docRef, {
        ...video,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      });
    });

    await batch.commit();
    console.log(`✅ ${videoSeeds.length}件の動画データを投入しました`);

    // 投入したデータの確認
    const videos = await db.collection('videos').get();
    console.log('\n📊 投入データサマリー:');
    console.log(`  - 総数: ${videos.size}件`);
    console.log(`  - 公開: ${videos.docs.filter(d => d.data().published).length}件`);
    console.log(`  - 非公開: ${videos.docs.filter(d => !d.data().published).length}件`);
    console.log(`  - カルーセル表示: ${videos.docs.filter(d => d.data().featuredInCarousel).length}件`);
    
    // カテゴリー別集計
    const categoryCounts: { [key: string]: number } = {};
    videos.docs.forEach(doc => {
      const category = doc.data().category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    console.log('\n📂 カテゴリー別:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count}件`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }

  console.log('\n✨ 動画シードデータ投入完了！');
  process.exit(0);
}

// 実行
seedVideos();