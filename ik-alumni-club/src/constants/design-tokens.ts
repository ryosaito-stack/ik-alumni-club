/**
 * デザイントークン定数
 * UIの一貫性を保つためのデザインシステム定義
 */

// =====================================
// カラーパレット
// =====================================
export const colors = {
  // プライマリカラー（Indigo）
  primary: {
    50: 'bg-indigo-50',
    100: 'bg-indigo-100',
    200: 'bg-indigo-200',
    300: 'bg-indigo-300',
    400: 'bg-indigo-400',
    500: 'bg-indigo-500',
    600: 'bg-indigo-600',
    700: 'bg-indigo-700',
    800: 'bg-indigo-800',
    900: 'bg-indigo-900',
  },
  
  // テキストカラー
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    tertiary: 'text-gray-600',
    muted: 'text-gray-500',
    light: 'text-gray-400',
    white: 'text-white',
    error: 'text-red-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
    red: 'text-red-600',
  },
  
  // 背景カラー
  bg: {
    primary: 'bg-indigo-600',
    white: 'bg-white',
    gray: 'bg-gray-100',
    secondary: 'bg-gray-50',
    tertiary: 'bg-gray-100',
    dark: 'bg-gray-900',
    error: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
    red: 'bg-red-50',
  },
  
  // backgroundエイリアス（後方互換性のため）
  background: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    tertiary: 'bg-gray-100',
    dark: 'bg-gray-900',
    error: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  },
  
  // ボーダーカラー
  border: {
    default: 'border-gray-300',
    light: 'border-gray-200',
    dark: 'border-gray-400',
    transparent: 'border-transparent',
    error: 'border-red-300',
    success: 'border-green-300',
    primary: 'border-indigo-500',
  },
  
  // メンバープランカラー
  memberPlan: {
    individual: 'bg-green-100 text-green-800',
    business: 'bg-blue-100 text-blue-800',
    platinum: 'bg-purple-100 text-purple-800',
    admin: 'bg-yellow-400 text-gray-900',
  },
};

// =====================================
// スペーシング
// =====================================
export const spacing = {
  // パディング
  padding: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-10',
    
    // 水平パディング
    x: {
      xs: 'px-1',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
      xl: 'px-8',
    },
    
    // 垂直パディング
    y: {
      xs: 'py-1',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
      xl: 'py-8',
    },
  },
  
  // マージン
  margin: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-10',
    
    // 下マージン
    bottom: {
      xs: 'mb-1',
      sm: 'mb-2',
      md: 'mb-4',
      lg: 'mb-6',
      xl: 'mb-8',
    },
    
    // 上マージン
    top: {
      xs: 'mt-1',
      sm: 'mt-2',
      md: 'mt-4',
      lg: 'mt-6',
      xl: 'mt-8',
    },
    
    // 左マージン
    left: {
      xs: 'ml-1',
      sm: 'ml-2',
      md: 'ml-3',
      lg: 'ml-4',
      xl: 'ml-6',
    },
  },
  
  // ギャップ
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
  
  // スペース
  space: {
    x: {
      xs: 'space-x-1',
      sm: 'space-x-2',
      md: 'space-x-4',
      lg: 'space-x-6',
      xl: 'space-x-8',
    },
    y: {
      xs: 'space-y-1',
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8',
    },
  },
};

// =====================================
// タイポグラフィ
// =====================================
export const typography = {
  // フォントサイズ
  fontSize: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  },
  
  // フォントウェイト
  fontWeight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  },
  
  // 行の高さ
  lineHeight: {
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  },
  
  // テキスト装飾
  textDecoration: {
    underline: 'underline',
    noUnderline: 'no-underline',
    lineThrough: 'line-through',
  },
  
  // テキスト配置
  textAlign: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },
};

// =====================================
// レイアウト
// =====================================
export const layout = {
  // 表示
  display: {
    block: 'block',
    inlineBlock: 'inline-block',
    inline: 'inline',
    flex: 'flex',
    inlineFlex: 'inline-flex',
    grid: 'grid',
    hidden: 'hidden',
  },
  
  // フレックスボックス
  flex: {
    direction: {
      row: 'flex-row',
      col: 'flex-col',
      rowReverse: 'flex-row-reverse',
      colReverse: 'flex-col-reverse',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    wrap: {
      wrap: 'flex-wrap',
      noWrap: 'flex-nowrap',
      wrapReverse: 'flex-wrap-reverse',
    },
    grow: {
      grow: 'flex-grow',
      noGrow: 'flex-grow-0',
    },
    shrink: {
      shrink: 'flex-shrink',
      noShrink: 'flex-shrink-0',
    },
  },
  
  // グリッド
  grid: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    },
    span: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      6: 'col-span-6',
      full: 'col-span-full',
    },
  },
  
  // 幅と高さ
  size: {
    width: {
      full: 'w-full',
      screen: 'w-screen',
      auto: 'w-auto',
      '1/2': 'w-1/2',
      '1/3': 'w-1/3',
      '2/3': 'w-2/3',
      '1/4': 'w-1/4',
      '3/4': 'w-3/4',
      64: 'w-64',
    },
    height: {
      full: 'h-full',
      screen: 'h-screen',
      auto: 'h-auto',
      8: 'h-8',
      10: 'h-10',
      12: 'h-12',
      16: 'h-16',
      64: 'h-64',
    },
    minHeight: {
      screen: 'min-h-screen',
      full: 'min-h-full',
      0: 'min-h-0',
    },
    maxWidth: {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      full: 'max-w-full',
    },
  },
  
  // ポジション
  position: {
    static: 'static',
    fixed: 'fixed',
    absolute: 'absolute',
    relative: 'relative',
    sticky: 'sticky',
  },
  
  // インセット
  inset: {
    0: 'inset-0',
    x0: 'inset-x-0',
    y0: 'inset-y-0',
    auto: 'inset-auto',
    left0: 'left-0',
    right0: 'right-0',
    top0: 'top-0',
    bottom0: 'bottom-0',
  },
};

// =====================================
// エフェクト
// =====================================
export const effects = {
  // シャドウ
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    default: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },
  
  // 角丸
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    
    // 部分的な角丸
    top: {
      none: 'rounded-t-none',
      sm: 'rounded-t-sm',
      default: 'rounded-t',
      md: 'rounded-t-md',
      lg: 'rounded-t-lg',
    },
    bottom: {
      none: 'rounded-b-none',
      sm: 'rounded-b-sm',
      default: 'rounded-b',
      md: 'rounded-b-md',
      lg: 'rounded-b-lg',
    },
  },
  
  // 透明度
  opacity: {
    0: 'opacity-0',
    25: 'opacity-25',
    50: 'opacity-50',
    75: 'opacity-75',
    100: 'opacity-100',
    disabled: 'disabled:opacity-50',
  },
  
  // トランジション
  transition: {
    none: 'transition-none',
    all: 'transition-all',
    colors: 'transition-colors',
    shadow: 'transition-shadow',
    opacity: 'transition-opacity',
    transform: 'transition-transform',
  },
  
  // カーソル
  cursor: {
    default: 'cursor-default',
    pointer: 'cursor-pointer',
    notAllowed: 'cursor-not-allowed',
    wait: 'cursor-wait',
    text: 'cursor-text',
  },
};

// =====================================
// インタラクション
// =====================================
export const interaction = {
  // ホバー状態
  hover: {
    textColor: {
      primary: 'hover:text-gray-900',
      secondary: 'hover:text-gray-700',
      indigo: 'hover:text-indigo-500',
      white: 'hover:text-white',
    },
    bgColor: {
      gray50: 'hover:bg-gray-50',
      gray100: 'hover:bg-gray-100',
      indigo600: 'hover:bg-indigo-600',
      indigo700: 'hover:bg-indigo-700',
      red700: 'hover:bg-red-700',
    },
    borderColor: {
      gray300: 'hover:border-gray-300',
      indigo500: 'hover:border-indigo-500',
    },
    shadow: {
      md: 'hover:shadow-md',
      lg: 'hover:shadow-lg',
    },
  },
  
  // フォーカス状態
  focus: {
    outline: {
      none: 'focus:outline-none',
    },
    ring: {
      indigo: 'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      red: 'focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
      none: 'focus:ring-0',
    },
    border: {
      indigo: 'focus:border-indigo-500',
    },
    zIndex: {
      10: 'focus:z-10',
    },
  },
  
  // アクティブ状態
  active: {
    bgColor: {
      indigo100: 'bg-indigo-100',
      gray100: 'bg-gray-100',
    },
    textColor: {
      indigo700: 'text-indigo-700',
      gray900: 'text-gray-900',
    },
  },
};

// =====================================
// コンポーネントスタイル
// =====================================
export const components = {
  // ボタン
  button: {
    base: 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    
    variants: {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
    },
    
    sizes: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    },
    
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth: 'w-full',
  },
  
  // インプット
  input: {
    base: 'block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
    error: 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-gray-100 cursor-not-allowed',
  },
  
  // カード
  card: {
    base: 'bg-white overflow-hidden shadow rounded-lg',
    hover: 'hover:shadow-md transition-shadow cursor-pointer',
    padding: 'px-4 py-5 sm:p-6',
    border: 'border border-gray-200',
  },
  
  // ナビゲーション
  nav: {
    item: {
      base: 'flex items-center px-4 py-2 text-sm font-medium rounded-md',
      active: 'bg-indigo-100 text-indigo-700',
      inactive: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
    },
    tab: {
      base: 'py-2 px-1 border-b-2 font-medium text-sm',
      active: 'border-indigo-500 text-indigo-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
  },
  
  // バッジ
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    variants: {
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      purple: 'bg-purple-100 text-purple-800',
    },
  },
  
  // アラート
  alert: {
    base: 'rounded-md p-4',
    variants: {
      error: 'bg-red-50 text-red-800',
      warning: 'bg-yellow-50 text-yellow-800',
      success: 'bg-green-50 text-green-800',
      info: 'bg-blue-50 text-blue-800',
    },
  },
  
  // モーダル
  modal: {
    overlay: 'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
    container: 'fixed inset-0 z-10 overflow-y-auto',
    content: 'bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6',
  },
  
  // テーブル
  table: {
    container: 'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
    table: 'min-w-full divide-y divide-gray-300',
    header: 'bg-gray-50',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    body: 'bg-white divide-y divide-gray-200',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
  },
  
  // フォーム
  form: {
    group: 'space-y-6',
    label: 'block text-sm font-medium text-gray-700',
    error: 'mt-1 text-xs text-red-600',
    help: 'mt-1 text-xs text-gray-500',
  },
  
  // サイドバー
  sidebar: {
    container: 'fixed inset-y-0 left-0 w-64 bg-white shadow-lg',
    content: 'flex flex-col h-full',
    header: 'px-4 py-6 bg-indigo-600',
    nav: 'flex-1 px-4 py-4 space-y-1',
    footer: 'px-4 py-4 border-t border-gray-200',
  },
  
  // ページレイアウト
  page: {
    container: 'min-h-screen bg-gray-100',
    main: 'px-4 sm:px-6 lg:px-8 py-6',
    header: 'flex justify-between items-center mb-6',
    title: 'text-3xl font-bold text-gray-900',
  },
};

// =====================================
// レスポンシブ
// =====================================
export const responsive = {
  // ブレークポイント接頭辞
  breakpoints: {
    sm: 'sm:', // 640px
    md: 'md:', // 768px
    lg: 'lg:', // 1024px
    xl: 'xl:', // 1280px
    '2xl': '2xl:', // 1536px
  },
  
  // よく使うレスポンシブパターン
  patterns: {
    gridCols: {
      mobile1Desktop3: 'grid-cols-1 lg:grid-cols-3',
      mobile1Desktop2: 'grid-cols-1 sm:grid-cols-2',
      mobile1Tablet2Desktop3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    },
    padding: {
      responsive: 'px-4 sm:px-6 lg:px-8',
    },
    text: {
      responsive: 'text-sm sm:text-base lg:text-lg',
    },
  },
};

// =====================================
// ユーティリティ関数
// =====================================

/**
 * 複数のクラス名を結合する
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * ボタンのクラス名を生成する
 */
export function getButtonClasses(
  variant: keyof typeof components.button.variants = 'primary',
  size: keyof typeof components.button.sizes = 'md',
  fullWidth: boolean = false,
  disabled: boolean = false
): string {
  return cn(
    components.button.base,
    components.button.variants[variant],
    components.button.sizes[size],
    fullWidth && components.button.fullWidth,
    disabled && components.button.disabled
  );
}

/**
 * カードのクラス名を生成する
 */
export function getCardClasses(
  hoverable: boolean = false,
  bordered: boolean = false
): string {
  return cn(
    components.card.base,
    hoverable && components.card.hover,
    bordered && components.card.border
  );
}

/**
 * バッジのクラス名を生成する
 */
export function getBadgeClasses(
  variant: keyof typeof components.badge.variants = 'gray'
): string {
  return cn(
    components.badge.base,
    components.badge.variants[variant]
  );
}

/**
 * メンバープランのバッジカラーを取得する
 */
export function getMemberPlanBadgeClass(plan: string): string {
  switch (plan) {
    case 'platinum':
      return colors.memberPlan.platinum;
    case 'business':
      return colors.memberPlan.business;
    case 'individual':
      return colors.memberPlan.individual;
    default:
      return colors.memberPlan.individual;
  }
}