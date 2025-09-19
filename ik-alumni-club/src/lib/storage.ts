import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * 画像をFirebase Storageにアップロード
 * @param file アップロードするファイル
 * @param path 保存先のパス（例: 'informations/xxx'）
 * @returns アップロードした画像のURL
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // ファイル名にタイムスタンプを追加してユニークにする
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const fullPath = `${path}/${fileName}`;
    
    // Storage参照を作成
    const storageRef = ref(storage, fullPath);
    
    // ファイルをアップロード
    const snapshot = await uploadBytes(storageRef, file);
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Firebase Storageから画像を削除
 * @param imageUrl 削除する画像のURL
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // URLからStorage参照を作成
    const storageRef = ref(storage, imageUrl);
    
    // 画像を削除
    await deleteObject(storageRef);
    
    console.log('Image deleted successfully');
  } catch (error) {
    // 画像が存在しない場合のエラーは無視
    if ((error as any).code === 'storage/object-not-found') {
      console.log('Image not found, skipping deletion');
      return;
    }
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * 画像ファイルのバリデーション
 * @param file 検証するファイル
 * @param maxSize 最大サイズ（バイト単位、デフォルト: 15MB）
 * @returns エラーメッセージ（問題ない場合はnull）
 */
export const validateImageFile = (file: File, maxSize: number = 15 * 1024 * 1024): string | null => {
  // ファイルタイプの確認
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return '画像ファイル（JPEG, PNG, GIF, WebP）のみアップロード可能です';
  }
  
  // ファイルサイズの確認
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `ファイルサイズは${maxSizeMB}MB以下にしてください`;
  }
  
  return null;
};

/**
 * 画像のプレビューURLを生成
 * @param file プレビューするファイル
 * @returns プレビューURL
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * プレビューURLをクリーンアップ
 * @param previewUrl クリーンアップするURL
 */
export const revokeImagePreview = (previewUrl: string): void => {
  URL.revokeObjectURL(previewUrl);
};