import * as admin from 'firebase-admin';
import { Content, MemberPlan } from '../src/types';

// Firebaseアプリの初期化
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'demo-project',
  });
}

// Firestoreエミュレーターに接続
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8081';

const db = admin.firestore();

// サンプルコンテンツデータ（日本語）
const sampleContents: Omit<Content, 'id'>[] = [
  // Individual Plan Contents（基本プラン）
  {
    title: 'IK Alumni Clubへようこそ',
    description: '卒業生コミュニティプラットフォームの使い方ガイド',
    type: 'article',
    requiredPlan: 'individual',
    author: 'IK Alumni 運営チーム',
    tags: ['ようこそ', '入門', 'ガイド'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'コミュニティガイドライン',
    description: 'コミュニティのルールとベストプラクティスについて',
    type: 'document',
    requiredPlan: 'individual',
    author: 'IK Alumni 運営チーム',
    tags: ['ルール', 'コミュニティ', 'ガイドライン'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '卒業生ネットワークディレクトリ',
    description: '同窓生を検索して繋がる方法',
    type: 'article',
    requiredPlan: 'individual',
    author: 'IK Alumni 運営チーム',
    tags: ['ネットワーキング', 'ディレクトリ', '同窓生'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Business Plan Contents（ビジネスプラン）
  {
    title: 'ビジネスネットワーキング戦略',
    description: 'ビジネスプロフェッショナル向けの高度なネットワーキング技術',
    type: 'article',
    requiredPlan: 'business',
    author: 'ビジネスエキスパート',
    tags: ['ビジネス', 'ネットワーキング', '戦略'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '限定ビジネスウェビナー録画',
    description: '最新のビジネス開発ウェビナーをご視聴ください',
    type: 'video',
    requiredPlan: 'business',
    author: 'IKビジネスチーム',
    tags: ['ウェビナー', 'ビジネス', '動画'],
    fileUrl: 'https://example.com/webinar.mp4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'ビジネスプランテンプレート集',
    description: 'プロフェッショナルなビジネスプランテンプレートをダウンロード',
    type: 'document',
    requiredPlan: 'business',
    author: 'IKビジネスチーム',
    tags: ['テンプレート', 'ビジネスプラン', 'リソース'],
    fileUrl: 'https://example.com/templates.pdf',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Platinum Plan Contents（プラチナプラン）
  {
    title: 'エグゼクティブリーダーシップマスタークラス',
    description: 'プラチナメンバー限定のリーダーシップトレーニング',
    type: 'video',
    requiredPlan: 'platinum',
    author: 'エグゼクティブコーチ',
    tags: ['リーダーシップ', 'エグゼクティブ', 'マスタークラス'],
    fileUrl: 'https://example.com/masterclass.mp4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'VIPネットワーキングイベントアクセス',
    description: 'VIPネットワーキングイベントへの限定アクセス権',
    type: 'article',
    requiredPlan: 'platinum',
    author: 'IKイベントチーム',
    tags: ['VIP', 'イベント', 'ネットワーキング'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'プラチナメンバー特典ガイド',
    description: 'プラチナメンバー限定特典の完全ガイド',
    type: 'document',
    requiredPlan: 'platinum',
    author: 'IKプラチナチーム',
    tags: ['特典', 'プラチナ', '限定'],
    fileUrl: 'https://example.com/platinum-guide.pdf',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '1対1メンターシッププログラム',
    description: '業界リーダーとの個人メンターシップで成長を加速',
    type: 'article',
    requiredPlan: 'platinum',
    author: 'メンターシップチーム',
    tags: ['メンターシップ', 'コーチング', '限定'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedContents() {
  console.log('🌱 Starting to seed contents...');

  try {
    // 既存のコンテンツを削除
    const existingContents = await db.collection('contents').get();
    const deletePromises = existingContents.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`🗑️  Deleted ${existingContents.size} existing contents`);

    // 新しいコンテンツを追加
    const addPromises = sampleContents.map(content => 
      db.collection('contents').add(content)
    );
    
    await Promise.all(addPromises);
    console.log(`✅ Successfully added ${sampleContents.length} contents`);

    // 追加されたコンテンツの確認
    const contents = await db.collection('contents').get();
    console.log('\n📚 Current contents in Firestore:');
    contents.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - [${data.requiredPlan.toUpperCase()}] ${data.title} (${data.type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding contents:', error);
    process.exit(1);
  }

  console.log('\n✨ Content seeding completed!');
  process.exit(0);
}

// スクリプトを実行
seedContents();