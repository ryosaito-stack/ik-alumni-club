// エミュレーターへの接続設定（初期化前に設定する必要がある）
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8081';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Firebase Admin SDK初期化（エミュレーター用）
const app = initializeApp({
  projectId: 'demo-ik-alumni-club',
});

const auth = getAuth(app);
const db = getFirestore(app);

// テストユーザーのデータ
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    displayName: '管理者太郎',
    plan: 'platinum',
    role: 'admin',
    bio: 'システム管理者です。全機能にアクセス可能です。',
    company: 'IK Alumni Club運営',
    position: 'システム管理者',
    graduationYear: '2015',
    major: 'コンピュータサイエンス',
  },
  {
    email: 'platinum@example.com',
    password: 'password123',
    displayName: 'プラチナ花子',
    plan: 'platinum',
    role: 'member',
    bio: 'プラチナ会員として活動しています。最高レベルのコンテンツにアクセス可能です。',
    company: '株式会社プレミアム',
    position: 'CEO',
    graduationYear: '2010',
    major: '経営学',
  },
  {
    email: 'business@example.com',
    password: 'password123',
    displayName: 'ビジネス次郎',
    plan: 'business',
    role: 'member',
    bio: 'ビジネス会員です。ビジネス向けコンテンツを活用しています。',
    company: '合同会社ビジネス',
    position: 'マネージャー',
    graduationYear: '2018',
    major: 'ビジネス管理',
  },
  {
    email: 'individual@example.com',
    password: 'password123',
    displayName: '個人三郎',
    plan: 'individual',
    role: 'member',
    bio: '個人会員として参加しています。基本的なコンテンツにアクセスできます。',
    company: 'フリーランス',
    position: 'エンジニア',
    graduationYear: '2020',
    major: '情報工学',
  },
  {
    email: 'test1@example.com',
    password: 'password123',
    displayName: 'テスト一郎',
    plan: 'individual',
    role: 'member',
    bio: 'テストユーザー1です。',
    company: 'テスト株式会社',
    position: '一般社員',
    graduationYear: '2021',
    major: '文学',
  },
  {
    email: 'test2@example.com',
    password: 'password123',
    displayName: 'テスト二郎',
    plan: 'business',
    role: 'member',
    bio: 'テストユーザー2です。',
    company: 'サンプル会社',
    position: 'リーダー',
    graduationYear: '2019',
    major: '法学',
  },
  {
    email: 'test3@example.com',
    password: 'password123',
    displayName: 'テスト三子',
    plan: 'platinum',
    role: 'member',
    bio: 'テストユーザー3です。女性のプラチナ会員です。',
    company: 'エリート企業',
    position: 'ディレクター',
    graduationYear: '2012',
    major: '医学',
  },
];

async function seedUsers() {
  console.log('🌱 テストユーザーの作成を開始します...\n');

  for (const userData of testUsers) {
    try {
      // Authentication にユーザーを作成
      let userRecord;
      try {
        // 既存ユーザーの確認
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`⚠️  ユーザー ${userData.email} は既に存在します`);
      } catch (error) {
        // ユーザーが存在しない場合は新規作成
        userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
        });
        console.log(`✅ ユーザー作成: ${userData.email}`);
      }

      // Firestore にメンバー情報を保存
      const memberData = {
        uid: userRecord.uid,
        email: userData.email,
        displayName: userData.displayName,
        plan: userData.plan,
        role: userData.role,
        bio: userData.bio,
        company: userData.company,
        position: userData.position,
        graduationYear: userData.graduationYear,
        major: userData.major,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await db.collection('members').doc(userRecord.uid).set(memberData);
      console.log(`   📝 メンバー情報保存: ${userData.displayName} (${userData.plan}プラン, ${userData.role})`);
      
    } catch (error) {
      console.error(`❌ エラー (${userData.email}):`, error);
    }
  }

  console.log('\n✨ テストユーザーの作成が完了しました！');
  console.log('\n📋 ログイン情報:');
  console.log('================================');
  testUsers.forEach(user => {
    console.log(`${user.displayName} (${user.plan}/${user.role})`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log('--------------------------------');
  });
  
  process.exit(0);
}

// エラーハンドリング
seedUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});