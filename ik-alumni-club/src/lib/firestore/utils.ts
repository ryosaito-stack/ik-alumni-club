// FIreStore固有の日付変換の共通化
export const timestampToDate = (timestamp: any): Date => {
    return timestamp?.toDate() || new Date();
}

// 公開済みフィルター共通関数
  export function filterPublished<T extends { published: boolean }>(
    items: T[]
  ): T[] {
    return items.filter(item => item.published);
  }

  // 単一アイテムの公開チェック
  export function isPublished<T extends { published: boolean }>(
    item: T | null
  ): T | null {
    return item?.published ? item : null;
  }