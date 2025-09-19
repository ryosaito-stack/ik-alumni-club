import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.localファイルを読み込み
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../src/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function checkInformations() {
  try {
    console.log('Informationsコレクションを確認中...\n');
    
    // すべてのinformationsを取得
    const allQuery = query(collection(db, 'informations'));
    const allSnapshot = await getDocs(allQuery);
    console.log(`全informations数: ${allSnapshot.size}件`);
    
    // 公開されたinformationsを取得
    const publishedQuery = query(
      collection(db, 'informations'),
      where('published', '==', true)
    );
    const publishedSnapshot = await getDocs(publishedQuery);
    console.log(`公開中のinformations数: ${publishedSnapshot.size}件\n`);
    
    // 詳細を表示
    console.log('=== 全informations ===');
    allSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`  タイトル: ${data.title}`);
      console.log(`  公開状態: ${data.published ? '公開' : '非公開'}`);
      console.log(`  日付: ${data.date?.toDate ? data.date.toDate().toLocaleDateString() : data.date}`);
      console.log(`  内容: ${data.content?.substring(0, 50)}...`);
      console.log('---');
    });
    
    if (publishedSnapshot.size === 0) {
      console.log('\n⚠️ 公開されたinformationsがありません！');
      console.log('管理画面から新規作成時に「すぐに公開する」にチェックを入れるか、');
      console.log('既存のinformationsを編集して「公開する」にチェックを入れてください。');
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
  
  process.exit(0);
}

// 実行
checkInformations();