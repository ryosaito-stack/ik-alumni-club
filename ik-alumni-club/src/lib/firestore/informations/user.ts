import {
    type Information,
    type InformationQueryOptions
} from './constants';

import { filterPublished } from '../utils';
import { getInformations, getInformationById } from './base'

// お知らせを1件取得（公開済みのみ）
export const getInformation = async (id: string): Promise<Information | null> => {
  try {
    const information = await getInformationById(id);
    
    if (!information) {
      return null;
    }

    // 公開済みチェック
    if (!information.published) {
      console.log('Information is not published');
      return null;
    }

    return information;
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