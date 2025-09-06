/**
 * Firebase Auth EmulatorのREST APIを使用してユーザーを作成するスクリプト
 * エミュレーターが起動している状態で実行してください
 */

const AUTH_EMULATOR_HOST = 'http://localhost:9099';
const FIRESTORE_EMULATOR_HOST = 'http://localhost:8081';
const PROJECT_ID = 'demo-ik-alumni-club';

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
];

// Auth Emulator APIでユーザーを作成
async function createAuthUser(email: string, password: string, displayName: string) {
  try {
    const response = await fetch(
      `${AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();
    if (data.localId) {
      console.log(`✅ Auth User created: ${email} (UID: ${data.localId})`);
      return data.localId;
    } else {
      console.error(`❌ Failed to create auth user ${email}:`, data);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error creating auth user ${email}:`, error);
    return null;
  }
}

// Firestore Emulator APIでメンバードキュメントを作成
async function createFirestoreDocument(uid: string, userData: any) {
  try {
    const memberData = {
      fields: {
        uid: { stringValue: uid },
        email: { stringValue: userData.email },
        displayName: { stringValue: userData.displayName },
        plan: { stringValue: userData.plan },
        role: { stringValue: userData.role || 'member' },
        bio: { stringValue: userData.bio },
        company: { stringValue: userData.company },
        position: { stringValue: userData.position },
        graduationYear: { stringValue: userData.graduationYear },
        major: { stringValue: userData.major },
        createdAt: { timestampValue: new Date().toISOString() },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    };

    const response = await fetch(
      `${FIRESTORE_EMULATOR_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/members/${uid}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      }
    );

    if (response.ok) {
      console.log(`   📝 Firestore document created for ${userData.displayName}`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`   ❌ Failed to create Firestore document:`, errorText);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Error creating Firestore document:`, error);
    return false;
  }
}

// メイン処理
async function seedUsers() {
  console.log('🌱 テストユーザーの作成を開始します...\n');
  
  // エミュレーターの起動確認
  try {
    const authCheck = await fetch(`${AUTH_EMULATOR_HOST}/`);
    if (!authCheck.ok) {
      throw new Error('Auth Emulator is not running');
    }
  } catch (error) {
    console.error('❌ Firebase Auth Emulatorが起動していません。');
    console.error('   先に npm run emu でエミュレーターを起動してください。');
    process.exit(1);
  }

  // ユーザー作成
  for (const userData of testUsers) {
    console.log(`\n処理中: ${userData.email}`);
    
    // Authにユーザー作成
    const uid = await createAuthUser(userData.email, userData.password, userData.displayName);
    
    if (uid) {
      // Firestoreにメンバー情報を保存
      await createFirestoreDocument(uid, userData);
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
}

// 実行
seedUsers().catch(console.error);