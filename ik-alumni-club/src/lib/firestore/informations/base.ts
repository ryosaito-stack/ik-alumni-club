import { 
    COLLECTION_NAME, 
    collection,
    orderBy,
    limit,
    query,
    db,
    getDocs,
    QueryConstraint,
    type Information,
    type InformationQueryOptions

} from './constants';
import { convertToInformation } from '@/lib/firestore/informations/converter'

// お知らせ一覧を取得（基本実装）
  export const getInformations = async (
    options: InformationQueryOptions = {}
  ): Promise<Information[]> => {
    try {
      const constraints: QueryConstraint[] = [];

      // ソート
      const orderField = options.orderBy || 'date';
      const orderDirection = options.orderDirection || 'desc';
      constraints.push(orderBy(orderField, orderDirection));

      // リミット
      if (options.limit) {
        constraints.push(limit(options.limit));
      }

      const q = query(collection(db, COLLECTION_NAME), ...constraints);
      const querySnapshot = await getDocs(q);

      const informations: Information[] = [];
      querySnapshot.forEach((doc) => {
        informations.push(convertToInformation(doc.id, doc.data()));
      });

      return informations;
    } catch (error) {
      console.error('Error getting informations:', error);
      throw error;
    }
  };