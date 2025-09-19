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

// サンプル作者データ
const sampleAuthor = {
  id: 'admin-user-001',
  name: 'IK ALUMNI CGT 運営チーム',
  role: 'Admin'
};

// 動画シードデータ（簡素化版）
const videoSeeds = [
  {
    title: 'IK ALUMNI サマーカンファレンス 2025',
    date: new Date('2025-08-20'),
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/video1/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'グローバルダンスカンファレンス 2025 Tokyo',
    date: new Date('2025-08-15'),
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnail: 'https://picsum.photos/seed/video2/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'ダンステクニック向上セミナー Vol.1',
    date: new Date('2025-08-10'),
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnail: 'https://picsum.photos/seed/video3/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'カラーガード基礎技術セミナー',
    date: new Date('2025-08-05'),
    videoUrl: 'https://www.youtube.com/watch?v=WPPPFqsECz0',
    thumbnail: 'https://picsum.photos/seed/video4/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: '振付創作ワークショップ 2025',
    date: new Date('2025-07-30'),
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    thumbnail: 'https://picsum.photos/seed/video5/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'パフォーマンス演出ワークショップ',
    date: new Date('2025-07-25'),
    videoUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    thumbnail: 'https://picsum.photos/seed/video6/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'メンバーインタビュー：山田花子',
    date: new Date('2025-07-20'),
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnail: 'https://picsum.photos/seed/video7/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: '特別インタビュー：ゲスト振付師 佐藤太郎',
    date: new Date('2025-07-15'),
    videoUrl: 'https://www.youtube.com/watch?v=QfW6PN-LV5Y',
    thumbnail: 'https://picsum.photos/seed/video8/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'アニュアルショー2025 ハイライト',
    date: new Date('2025-07-10'),
    videoUrl: 'https://www.youtube.com/watch?v=hhJ40m6cAMw',
    thumbnail: 'https://picsum.photos/seed/video9/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'チャリティーイベント 2025',
    date: new Date('2025-07-05'),
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    thumbnail: 'https://picsum.photos/seed/video10/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: 'IK ALUMNI CGT ドキュメンタリー',
    date: new Date('2025-06-30'),
    videoUrl: 'https://www.youtube.com/watch?v=fLexgOxsZu0',
    thumbnail: 'https://picsum.photos/seed/video11/1280/720',
    published: true,
    author: sampleAuthor,
  },
  {
    title: '特集：カラーガードの魅力',
    date: new Date('2025-06-25'),
    videoUrl: 'https://www.youtube.com/watch?v=nCkpzqqog4k',
    thumbnail: 'https://picsum.photos/seed/video12/1280/720',
    published: true,
    author: sampleAuthor,
  },
  // 非公開コンテンツ（管理画面でのみ表示）
  {
    title: '【準備中】新作パフォーマンス練習風景',
    date: new Date('2025-09-01'),
    videoUrl: 'https://www.youtube.com/watch?v=placeholder1',
    thumbnail: 'https://picsum.photos/seed/draft1/1280/720',
    published: false,
    author: sampleAuthor,
  },
  {
    title: '【編集中】メンバー座談会',
    date: new Date('2025-09-15'),
    videoUrl: 'https://www.youtube.com/watch?v=placeholder2',
    thumbnail: 'https://picsum.photos/seed/draft2/1280/720',
    published: false,
    author: sampleAuthor,
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
    for (const video of videoSeeds) {
      const now = admin.firestore.Timestamp.now();
      const docData = {
        ...video,
        date: admin.firestore.Timestamp.fromDate(video.date),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('videos').add(docData);
      console.log(`✅ Created video: ${video.title} (${docRef.id})`);
    }

    console.log(`\n✨ Successfully seeded ${videoSeeds.length} videos!`);
    console.log('\n📊 Summary:');
    console.log(`  - Published: ${videoSeeds.filter(v => v.published).length}`);
    console.log(`  - Draft: ${videoSeeds.filter(v => !v.published).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding videos:', error);
    process.exit(1);
  }
}

// 実行
seedVideos()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });