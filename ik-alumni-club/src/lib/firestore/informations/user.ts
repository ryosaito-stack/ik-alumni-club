import {
    COLLECTION_NAME,
    doc,
    getDoc,
    db,
    type Information,
    type InformationQueryOptions
} from './constants';

import { convertToInformation } from './converter';
import { filterPublished } from '../utils';
import { getInformations } from './base'

// お知らせを1件取得（公開済みのみ）
  export const getInformation = async (id: string): Promise<Information | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const information = convertToInformation(docSnap.id, docSnap.data());

        // 公開済みチェックを追加
        if (!information.published) {
          console.log('Information is not published');
          return null;
        }

        return information;
      } else {
        console.log('No such information!');
        return null;
      }
    } catch (error) {
      console.error('Error getting information:', error);
      throw error;
    }
  };

export const getPublishedInformations = async (
    options: Omit<InformationQueryOptions, 'published'> = {}
  ): Promise<Information[]> => {
    const allInformations = await getInformations(options);
    return filterPublished(allInformations);
  };