// FIreStore固有の日付変換の共通化
export const timestampToDate = (timestamp: any): Date => {
    return timestamp?.toDate() || new Date();
}