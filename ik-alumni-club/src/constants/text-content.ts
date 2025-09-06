/**
 * テキストコンテンツ定数
 * アプリケーション内で使用される定型文やテンプレート
 */

// =====================================
// 汎用テキストテンプレート
// =====================================
export const textTemplates = {
  // 挨拶
  greeting: {
    morning: 'おはようございます',
    afternoon: 'こんにちは',
    evening: 'こんばんは',
    welcome: (name: string) => `ようこそ、${name}さん`,
    welcomeBack: (name: string) => `おかえりなさい、${name}さん`,
  },
  
  // 確認メッセージ
  confirmation: {
    delete: (item: string) => `${item}を削除してもよろしいですか？`,
    save: '変更を保存しますか？',
    cancel: 'キャンセルしてもよろしいですか？未保存の変更は失われます。',
    logout: 'ログアウトしてもよろしいですか？',
    submit: (form: string) => `${form}を送信してもよろしいですか？`,
  },
  
  // 成功メッセージ
  success: {
    created: (item: string) => `${item}を作成しました`,
    updated: (item: string) => `${item}を更新しました`,
    deleted: (item: string) => `${item}を削除しました`,
    saved: '保存しました',
    sent: '送信しました',
    copied: 'クリップボードにコピーしました',
    uploaded: (file: string) => `${file}をアップロードしました`,
  },
  
  // エラーメッセージ
  error: {
    general: 'エラーが発生しました。もう一度お試しください。',
    network: 'ネットワークエラーが発生しました。接続を確認してください。',
    notFound: (item: string) => `${item}が見つかりません`,
    unauthorized: 'この操作を実行する権限がありません',
    validation: (field: string) => `${field}の入力内容に誤りがあります`,
    required: (field: string) => `${field}は必須項目です`,
    minLength: (field: string, min: number) => `${field}は${min}文字以上で入力してください`,
    maxLength: (field: string, max: number) => `${field}は${max}文字以内で入力してください`,
    format: (field: string, format: string) => `${field}は${format}形式で入力してください`,
  },
  
  // 通知メッセージ
  notification: {
    newMessage: (count: number) => `新着メッセージが${count}件あります`,
    reminder: (event: string, time: string) => `${time}に${event}の予定があります`,
    update: (feature: string) => `${feature}が更新されました`,
    maintenance: (time: string) => `${time}にメンテナンスを実施します`,
  },
  
  // ステータス
  status: {
    loading: '読み込み中...',
    processing: '処理中...',
    saving: '保存中...',
    uploading: 'アップロード中...',
    downloading: 'ダウンロード中...',
    sending: '送信中...',
    connecting: '接続中...',
    syncing: '同期中...',
  },
  
  // 空状態
  emptyState: {
    noData: 'データがありません',
    noResults: '検索結果がありません',
    noItems: (item: string) => `${item}がまだありません`,
    getStarted: (action: string) => `${action}してみましょう`,
  },
  
  // ページネーション
  pagination: {
    showing: (start: number, end: number, total: number) => 
      `${total}件中 ${start}〜${end}件を表示`,
    page: (current: number, total: number) => `${current} / ${total} ページ`,
    noMoreItems: 'これ以上の項目はありません',
  },
  
  // 日時フォーマット
  datetime: {
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日',
    daysAgo: (days: number) => `${days}日前`,
    hoursAgo: (hours: number) => `${hours}時間前`,
    minutesAgo: (minutes: number) => `${minutes}分前`,
    justNow: 'たった今',
    at: (time: string) => `${time}に`,
    on: (date: string) => `${date}に`,
  },
};

// =====================================
// メールテンプレート
// =====================================
export const emailTemplates = {
  // 件名
  subject: {
    welcome: 'IK Alumni Clubへようこそ',
    passwordReset: 'パスワードリセットのご案内',
    verification: 'メールアドレスの確認',
    notification: (type: string) => `【お知らせ】${type}`,
    reminder: (event: string) => `【リマインダー】${event}`,
  },
  
  // 本文
  body: {
    header: (name: string) => `${name}様`,
    footer: `
ご不明な点がございましたら、お気軽にお問い合わせください。

IK Alumni Club サポートチーム
support@ik-alumni.com
    `,
    signature: `
何卒よろしくお願いいたします。

IK Alumni Club
    `,
  },
};

// =====================================
// フォーム用テキスト
// =====================================
export const formText = {
  // ラベル
  label: {
    required: '必須',
    optional: '任意',
    example: '例：',
    hint: 'ヒント：',
  },
  
  // プレースホルダー
  placeholder: {
    search: '検索...',
    email: 'example@email.com',
    password: '6文字以上のパスワード',
    name: '山田 太郎',
    company: '株式会社○○',
    message: 'メッセージを入力...',
    date: 'YYYY/MM/DD',
    time: 'HH:MM',
    url: 'https://example.com',
    phone: '090-1234-5678',
  },
  
  // ヘルプテキスト
  help: {
    password: 'パスワードは英数字を含む6文字以上で設定してください',
    email: '有効なメールアドレスを入力してください',
    phone: 'ハイフンありで入力してください',
    url: 'https://から始まるURLを入力してください',
    fileSize: (size: string) => `最大ファイルサイズ: ${size}`,
    fileType: (types: string[]) => `対応形式: ${types.join(', ')}`,
  },
  
  // バリデーションメッセージ
  validation: {
    email: {
      invalid: '有効なメールアドレスを入力してください',
      duplicate: 'このメールアドレスは既に登録されています',
    },
    password: {
      weak: 'パスワードが弱すぎます',
      mismatch: 'パスワードが一致しません',
      incorrect: 'パスワードが正しくありません',
    },
    phone: {
      invalid: '有効な電話番号を入力してください',
    },
    url: {
      invalid: '有効なURLを入力してください',
    },
    date: {
      invalid: '有効な日付を入力してください',
      past: '過去の日付は選択できません',
      future: '未来の日付は選択できません',
    },
  },
};

// =====================================
// ボタンテキスト
// =====================================
export const buttonText = {
  // 基本アクション
  action: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    create: '作成',
    update: '更新',
    submit: '送信',
    confirm: '確認',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    finish: '完了',
    start: '開始',
    stop: '停止',
    pause: '一時停止',
    resume: '再開',
    retry: '再試行',
    refresh: '更新',
    reset: 'リセット',
  },
  
  // 認証関連
  auth: {
    login: 'ログイン',
    logout: 'ログアウト',
    signup: '新規登録',
    forgotPassword: 'パスワードを忘れた方',
    resetPassword: 'パスワードをリセット',
    changePassword: 'パスワードを変更',
  },
  
  // ファイル操作
  file: {
    upload: 'アップロード',
    download: 'ダウンロード',
    browse: 'ファイルを選択',
    dragDrop: 'ドラッグ&ドロップ',
    remove: '削除',
  },
  
  // その他
  other: {
    learnMore: '詳しく見る',
    viewAll: 'すべて表示',
    showMore: 'もっと見る',
    showLess: '折りたたむ',
    selectAll: 'すべて選択',
    deselectAll: '選択を解除',
    copy: 'コピー',
    paste: '貼り付け',
    share: '共有',
    export: 'エクスポート',
    import: 'インポート',
    print: '印刷',
  },
};

// =====================================
// ナビゲーションテキスト
// =====================================
export const navigationText = {
  breadcrumb: {
    home: 'ホーム',
    separator: ' / ',
  },
  
  menu: {
    mainMenu: 'メインメニュー',
    subMenu: 'サブメニュー',
    userMenu: 'ユーザーメニュー',
    settings: '設定',
    help: 'ヘルプ',
    about: 'このサイトについて',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    contact: 'お問い合わせ',
  },
  
  tabs: {
    all: 'すべて',
    active: 'アクティブ',
    inactive: '非アクティブ',
    archived: 'アーカイブ',
    draft: '下書き',
    published: '公開済み',
  },
};

// =====================================
// 定型文
// =====================================
export const standardText = {
  // 利用規約の一部
  terms: {
    agreement: '利用規約に同意する',
    readMore: '利用規約を読む',
    lastUpdated: (date: string) => `最終更新日: ${date}`,
  },
  
  // プライバシー
  privacy: {
    consent: '個人情報の取り扱いに同意する',
    readMore: 'プライバシーポリシーを読む',
  },
  
  // クッキー
  cookie: {
    message: 'このサイトではクッキーを使用しています',
    accept: 'クッキーを受け入れる',
    decline: '拒否する',
    learnMore: '詳細を見る',
  },
  
  // コピーライト
  copyright: {
    text: (year: number, company: string) => 
      `© ${year} ${company}. All rights reserved.`,
  },
};

// =====================================
// アクセシビリティ用テキスト
// =====================================
export const a11yText = {
  // スクリーンリーダー用
  screenReader: {
    loading: '読み込み中です',
    menuOpen: 'メニューを開く',
    menuClose: 'メニューを閉じる',
    modalOpen: 'ダイアログを開く',
    modalClose: 'ダイアログを閉じる',
    expandMore: '詳細を表示',
    expandLess: '詳細を非表示',
    sortAscending: '昇順で並び替え',
    sortDescending: '降順で並び替え',
    filterBy: (criteria: string) => `${criteria}で絞り込み`,
    page: (current: number, total: number) => 
      `${total}ページ中${current}ページ目`,
  },
  
  // アリアラベル
  ariaLabels: {
    navigation: 'ナビゲーション',
    search: '検索',
    userMenu: 'ユーザーメニュー',
    mainContent: 'メインコンテンツ',
    sidebar: 'サイドバー',
    footer: 'フッター',
    breadcrumb: 'パンくずリスト',
    pagination: 'ページネーション',
  },
};

// =====================================
// ユーティリティ関数
// =====================================

/**
 * 時間帯に応じた挨拶を返す
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 10) return textTemplates.greeting.morning;
  if (hour < 18) return textTemplates.greeting.afternoon;
  return textTemplates.greeting.evening;
}

/**
 * 相対時間を返す
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return textTemplates.datetime.justNow;
  if (minutes < 60) return textTemplates.datetime.minutesAgo(minutes);
  if (hours < 24) return textTemplates.datetime.hoursAgo(hours);
  if (days === 1) return textTemplates.datetime.yesterday;
  if (days < 7) return textTemplates.datetime.daysAgo(days);
  
  return date.toLocaleDateString('ja-JP');
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}