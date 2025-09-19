import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.localファイルを読み込み
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../src/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

async function testConnection() {
  try {
    console.log('Firestore接続テスト開始...');
    
    // テストコレクションに書き込み
    const testCollection = collection(db, 'test');
    const docRef = await addDoc(testCollection, {
      message: '接続テスト',
      timestamp: serverTimestamp(),
      environment: process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' ? 'emulator' : 'production'
    });
    
    console.log('✅ 書き込み成功:', docRef.id);
    
    // データを読み取り
    const snapshot = await getDocs(testCollection);
    console.log('✅ 読み取り成功: ', snapshot.size, '件のドキュメント');
    
    snapshot.forEach(doc => {
      console.log('  - ID:', doc.id, 'データ:', doc.data());
    });
    
    console.log('\n接続環境:', process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' ? 'エミュレーター' : '本番環境');
    console.log('プロジェクトID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
  
  process.exit(0);
}

// 実行
testConnection();