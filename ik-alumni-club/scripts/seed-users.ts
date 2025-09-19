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
    lastName: '管理者',
    firstName: '太郎',
    lastNameKana: 'カンリシャ',
    firstNameKana: 'タロウ',
    postalCode: '100-0001',
    prefecture: '東京都',
    city: '千代田区',
    address: '千代田1-1-1',
    building: '管理ビル5F',
    phoneNumber: '03-0000-0001',
    plan: 'platinum_business',
    role: 'admin',
    isActive: true, // 管理者はアクティブ
  },
  {
    email: 'platinum-individual@example.com',
    password: 'password123',
    lastName: 'プラチナ',
    firstName: '花子',
    lastNameKana: 'プラチナ',
    firstNameKana: 'ハナコ',
    postalCode: '106-0032',
    prefecture: '東京都',
    city: '港区',
    address: '六本木7-1-1',
    phoneNumber: '03-0000-0002',
    plan: 'platinum_individual',
    role: 'member',
    isActive: true, // テスト用にアクティブ
  },
  {
    email: 'platinum-business@example.com',
    password: 'password123',
    lastName: 'プラチナ',
    firstName: '法人',
    lastNameKana: 'プラチナ',
    firstNameKana: 'ホウジン',
    postalCode: '150-0002',
    prefecture: '東京都',
    city: '渋谷区',
    address: '渋谷2-15-1',
    building: 'クロスタワー21F',
    phoneNumber: '03-0000-0003',
    plan: 'platinum_business',
    role: 'member',
    isActive: true, // テスト用にアクティブ
  },
  {
    email: 'business@example.com',
    password: 'password123',
    lastName: 'ビジネス',
    firstName: '次郎',
    lastNameKana: 'ビジネス',
    firstNameKana: 'ジロウ',
    postalCode: '541-0041',
    prefecture: '大阪府',
    city: '大阪市中央区',
    address: '北浜1-1-1',
    phoneNumber: '06-0000-0001',
    plan: 'business',
    role: 'member',
    isActive: true, // テスト用にアクティブ
  },
  {
    email: 'individual@example.com',
    password: 'password123',
    lastName: '個人',
    firstName: '三郎',
    lastNameKana: 'コジン',
    firstNameKana: 'サブロウ',
    postalCode: '460-0008',
    prefecture: '愛知県',
    city: '名古屋市中区',
    address: '栄3-1-1',
    phoneNumber: '052-0000-0001',
    plan: 'individual',
    role: 'member',
    isActive: false, // 未承認状態のテスト用
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
          displayName: `${userData.lastName} ${userData.firstName}`,
        });
        console.log(`✅ ユーザー作成: ${userData.email}`);
      }

      // Firestore にメンバー情報を保存
      const memberData = {
        uid: userRecord.uid,
        email: userData.email,
        
        // 名前情報
        lastName: userData.lastName,
        firstName: userData.firstName,
        lastNameKana: userData.lastNameKana,
        firstNameKana: userData.firstNameKana,
        
        // 住所情報
        postalCode: userData.postalCode,
        prefecture: userData.prefecture,
        city: userData.city,
        address: userData.address,
        building: userData.building,
        
        // 連絡先
        phoneNumber: userData.phoneNumber,
        
        // 会員情報
        plan: userData.plan,
        role: userData.role || 'member',
        isActive: userData.isActive !== undefined ? userData.isActive : false,
        
        // システム情報
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await db.collection('users').doc(userRecord.uid).set(memberData);
      const displayName = `${userData.lastName} ${userData.firstName}`;
      console.log(`   📝 メンバー情報保存: ${displayName} (${userData.plan}プラン, ${userData.role || 'member'})`);
      
    } catch (error) {
      console.error(`❌ エラー (${userData.email}):`, error);
    }
  }

  console.log('\n✨ テストユーザーの作成が完了しました！');
  console.log('\n📋 ログイン情報:');
  console.log('================================');
  testUsers.forEach(user => {
    const displayName = `${user.lastName} ${user.firstName}`;
    console.log(`${displayName} (${user.plan}/${user.role || 'member'})`);
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