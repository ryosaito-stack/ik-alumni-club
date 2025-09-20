// フィルタリングロジック
import { 
  query,
  where,
  orderBy,
  limit,
  collection,
  getDocs,
  QueryConstraint,
  db,
  Timestamp,
  Video,
  VideoQueryOptions,
  COLLECTION_NAME
} from './constants';
import { convertToVideo } from './converter';
import { filterPublished } from '../utils';

// クエリ制約を構築
export const applyVideoFilters = (
  options: VideoQueryOptions
): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [];

  // 日付範囲でフィルタリング
  if (options.startDate) {
    constraints.push(where('date', '>=', Timestamp.fromDate(options.startDate)));
  }
  if (options.endDate) {
    constraints.push(where('date', '<=', Timestamp.fromDate(options.endDate)));
  }

  // Firestoreの制約: whereとorderByの組み合わせを避ける
  // 日付範囲フィルタがない場合のみorderByを追加
  if (!options.startDate && !options.endDate) {
    const orderField = options.orderBy || 'date';
    const direction = options.orderDirection || 'desc';
    constraints.push(orderBy(orderField, direction));
    
    // 取得件数の制限（orderByと一緒に使用）
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
  }

  return constraints;
};

// フィルタリングされた動画を取得
export const getFilteredVideos = async (
  options: VideoQueryOptions = {}
): Promise<Video[]> => {
  try {
    const constraints = applyVideoFilters(options);
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    let videos = querySnapshot.docs.map(doc => 
      convertToVideo(doc.id, doc.data())
    );

    // 公開状態でフィルタリング（クライアント側）
    if (options.published === true) {
      videos = filterPublished(videos);
    } else if (options.published === false) {
      videos = videos.filter(video => !video.published);
    }

    // クライアント側でソート（日付範囲フィルタがある場合）
    if (options.startDate || options.endDate || options.orderBy) {
      const orderField = options.orderBy || 'date';
      const orderDirection = options.orderDirection || 'desc';
      
      videos.sort((a, b) => {
        if (orderField === 'date') {
          const aTime = a.date.getTime();
          const bTime = b.date.getTime();
          return orderDirection === 'asc' ? aTime - bTime : bTime - aTime;
        } else if (orderField === 'createdAt' || orderField === 'updatedAt') {
          const aTime = a[orderField].getTime();
          const bTime = b[orderField].getTime();
          return orderDirection === 'asc' ? aTime - bTime : bTime - aTime;
        }
        return 0;
      });
    }
    
    // 制限（クライアント側）
    if (options.limit && videos.length > options.limit) {
      videos = videos.slice(0, options.limit);
    }

    return videos;
  } catch (error) {
    console.error('Error getting filtered videos:', error);
    throw error;
  }
};