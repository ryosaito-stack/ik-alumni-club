// 共通データアクセスロジック
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * 基本的なFirestoreデータアクセスを提供する抽象クラス
 * 各コレクションのbase.tsで継承して使用する
 * 
 * @template T データモデルの型
 */
export class BaseRepository<T> {
  constructor(
    private collectionName: string,
    private converter: (id: string, data: DocumentData) => T
  ) {}

  /**
   * 全件取得（フィルタリングなし）
   * 権限チェックやフィルタリングは上位層で実施
   */
  async getAll(): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      
      const items: T[] = [];
      querySnapshot.forEach((doc) => {
        items.push(this.converter(doc.id, doc.data()));
      });

      return items;
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * ID指定で1件取得（権限チェックなし）
   * 権限チェックは上位層で実施
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.converter(docSnap.id, docSnap.data());
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by id:`, error);
      throw error;
    }
  }
}