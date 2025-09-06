/**
 * 命名規則定数
 * プロジェクト全体で統一された命名規則を定義
 */

// =====================================
// ファイル・ディレクトリ命名規則
// =====================================
export const fileNaming = {
  // ファイル拡張子
  extensions: {
    typescript: '.ts',
    typescriptReact: '.tsx',
    javascript: '.js',
    javascriptReact: '.jsx',
    style: '.css',
    module: '.module.css',
    test: '.test.ts',
    spec: '.spec.ts',
    story: '.stories.tsx',
    types: '.types.ts',
    constants: '.constants.ts',
    utils: '.utils.ts',
    config: '.config.ts',
  },
  
  // ファイル命名パターン
  patterns: {
    component: 'PascalCase',        // Button.tsx
    page: 'kebab-case',             // user-profile.tsx
    hook: 'camelCase',              // useAuth.ts
    utility: 'camelCase',           // formatDate.ts
    constant: 'UPPER_SNAKE_CASE',   // API_ENDPOINTS.ts
    type: 'PascalCase',             // UserType.ts
    test: '[name].test',            // Button.test.tsx
    story: '[name].stories',        // Button.stories.tsx
    style: '[name].module',         // Button.module.css
  },
  
  // ディレクトリ構造
  directories: {
    components: 'components/',
    pages: 'app/',
    hooks: 'hooks/',
    utils: 'utils/',
    constants: 'constants/',
    types: 'types/',
    styles: 'styles/',
    lib: 'lib/',
    api: 'api/',
    public: 'public/',
    tests: '__tests__/',
    mocks: '__mocks__/',
  },
};

// =====================================
// 変数・関数命名規則
// =====================================
export const codeNaming = {
  // 変数命名
  variables: {
    // ケース別
    constants: 'UPPER_SNAKE_CASE',    // MAX_RETRY_COUNT
    regular: 'camelCase',              // userName
    private: '_camelCase',             // _privateVar
    global: 'UPPER_SNAKE_CASE',       // GLOBAL_CONFIG
    
    // プレフィックス
    boolean: {
      prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
      examples: ['isActive', 'hasError', 'canEdit', 'shouldUpdate'],
    },
    
    // サフィックス
    collections: {
      suffix: ['List', 'Array', 'Set', 'Map', 'Collection'],
      examples: ['userList', 'itemArray', 'tagSet', 'configMap'],
    },
    
    // 一時変数
    temporary: {
      patterns: ['temp', 'tmp', '_', 'dummy'],
      avoid: true, // 使用を避ける
    },
  },
  
  // 関数命名
  functions: {
    // 通常の関数
    regular: 'camelCase',              // getUserData()
    
    // アクション関数
    actions: {
      prefix: ['get', 'set', 'update', 'delete', 'create', 'fetch', 'save', 'load', 'handle', 'process'],
      examples: ['getUserById', 'setUserName', 'updateProfile', 'deleteAccount'],
    },
    
    // イベントハンドラー
    eventHandlers: {
      prefix: ['on', 'handle'],
      examples: ['onClick', 'onChange', 'handleSubmit', 'handleError'],
    },
    
    // バリデーション関数
    validation: {
      prefix: ['validate', 'check', 'is', 'has'],
      examples: ['validateEmail', 'checkPassword', 'isValid', 'hasPermission'],
    },
    
    // 変換関数
    transformation: {
      prefix: ['to', 'from', 'convert', 'parse', 'format', 'transform'],
      examples: ['toString', 'fromJSON', 'convertToDate', 'parseHTML', 'formatCurrency'],
    },
    
    // 計算関数
    calculation: {
      prefix: ['calculate', 'compute', 'get'],
      examples: ['calculateTotal', 'computeAverage', 'getPercentage'],
    },
  },
  
  // クラス・インターフェース命名
  types: {
    // クラス
    class: 'PascalCase',               // UserManager
    
    // インターフェース
    interface: {
      case: 'PascalCase',
      prefix: 'I',                     // IUserData (オプション)
      suffix: 'Interface',             // UserInterface (オプション)
    },
    
    // 型エイリアス
    typeAlias: 'PascalCase',          // UserType
    
    // 列挙型
    enum: {
      name: 'PascalCase',              // UserRole
      values: 'UPPER_SNAKE_CASE',     // USER_ROLE_ADMIN
    },
    
    // ジェネリック型パラメータ
    generic: {
      single: 'T',                     // <T>
      multiple: ['T', 'U', 'V', 'K', 'V'], // <T, U>
      descriptive: ['TData', 'TError', 'TResult'], // <TData, TError>
    },
  },
};

// =====================================
// React/Next.js固有の命名規則
// =====================================
export const reactNaming = {
  // コンポーネント
  components: {
    // 基本コンポーネント
    regular: 'PascalCase',             // Button, UserCard
    
    // HOC (Higher Order Component)
    hoc: {
      prefix: 'with',
      examples: ['withAuth', 'withLayout', 'withError'],
    },
    
    // プロバイダー
    provider: {
      suffix: 'Provider',
      examples: ['AuthProvider', 'ThemeProvider', 'DataProvider'],
    },
    
    // コンテキスト
    context: {
      suffix: 'Context',
      examples: ['AuthContext', 'ThemeContext', 'AppContext'],
    },
    
    // レイアウト
    layout: {
      suffix: 'Layout',
      examples: ['DashboardLayout', 'AuthLayout', 'MainLayout'],
    },
    
    // ページコンポーネント
    page: {
      suffix: 'Page',
      examples: ['HomePage', 'LoginPage', 'ProfilePage'],
    },
  },
  
  // Props
  props: {
    // Props型定義
    interface: {
      suffix: 'Props',
      examples: ['ButtonProps', 'UserCardProps', 'ModalProps'],
    },
    
    // Props変数
    destructuring: true,               // { onClick, disabled } = props
    spreading: 'restProps',            // ...restProps
    
    // イベントProps
    events: {
      prefix: 'on',
      examples: ['onClick', 'onChange', 'onSubmit', 'onClose'],
    },
  },
  
  // Hooks
  hooks: {
    // カスタムフック
    custom: {
      prefix: 'use',
      examples: ['useAuth', 'useModal', 'useFetch', 'useLocalStorage'],
    },
    
    // 戻り値
    returns: {
      array: '[value, setValue]',     // const [user, setUser] = useUser()
      object: '{ data, error, loading }', // const { data, error } = useFetch()
    },
  },
  
  // State
  state: {
    // useState
    naming: '[value, setValue]',
    examples: [
      '[isOpen, setIsOpen]',
      '[user, setUser]',
      '[count, setCount]',
      '[formData, setFormData]',
    ],
    
    // useReducer
    reducer: {
      actions: 'UPPER_SNAKE_CASE',    // USER_LOGIN_SUCCESS
      types: 'ActionType',             // UserActionType
      reducer: 'Reducer',              // userReducer
    },
  },
};

// =====================================
// API・バックエンド命名規則
// =====================================
export const apiNaming = {
  // エンドポイント
  endpoints: {
    // RESTful
    rest: {
      case: 'kebab-case',
      plural: true,                    // /users, /posts
      examples: [
        'GET /users',
        'GET /users/:id',
        'POST /users',
        'PUT /users/:id',
        'DELETE /users/:id',
      ],
    },
    
    // アクション
    actions: {
      pattern: '/resource/action',
      examples: [
        '/users/login',
        '/posts/publish',
        '/cart/checkout',
      ],
    },
  },
  
  // リクエスト・レスポンス
  data: {
    // JSONキー
    json: {
      case: 'camelCase',               // { userId, userName }
      alternatives: 'snake_case',      // { user_id, user_name }
    },
    
    // HTTPヘッダー
    headers: {
      case: 'Pascal-Kebab-Case',      // Content-Type, X-Api-Key
      custom: 'X-',                   // X-Custom-Header
    },
    
    // クエリパラメータ
    query: {
      case: 'camelCase',               // ?userId=123&sortBy=name
      alternatives: 'snake_case',      // ?user_id=123&sort_by=name
    },
  },
  
  // エラーコード
  errorCodes: {
    format: 'UPPER_SNAKE_CASE',
    prefix: 'ERR_',
    examples: [
      'ERR_USER_NOT_FOUND',
      'ERR_INVALID_TOKEN',
      'ERR_PERMISSION_DENIED',
      'ERR_VALIDATION_FAILED',
    ],
  },
};

// =====================================
// データベース命名規則
// =====================================
export const databaseNaming = {
  // テーブル・コレクション
  tables: {
    case: 'snake_case',                // user_profiles
    plural: true,                      // users, posts
    prefix: {
      junction: 'jct_',                // jct_user_roles
      view: 'view_',                   // view_active_users
      temp: 'tmp_',                    // tmp_import_data
    },
  },
  
  // カラム・フィールド
  columns: {
    case: 'snake_case',                // user_name, created_at
    
    // 共通カラム
    common: {
      id: 'id',
      uuid: 'uuid',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      isActive: 'is_active',
      sortOrder: 'sort_order',
    },
    
    // 外部キー
    foreignKey: {
      suffix: '_id',
      examples: ['user_id', 'post_id', 'category_id'],
    },
    
    // フラグ
    boolean: {
      prefix: 'is_' || 'has_',
      examples: ['is_active', 'is_deleted', 'has_avatar'],
    },
  },
  
  // インデックス
  indexes: {
    pattern: 'idx_table_column',
    examples: [
      'idx_users_email',
      'idx_posts_user_id',
      'idx_orders_created_at',
    ],
  },
};

// =====================================
// CSS・スタイル命名規則
// =====================================
export const styleNaming = {
  // CSSクラス
  classes: {
    // BEM記法
    bem: {
      block: 'block',
      element: 'block__element',
      modifier: 'block--modifier',
      examples: [
        'card',
        'card__header',
        'card--large',
        'card__header--highlighted',
      ],
    },
    
    // ケバブケース
    kebab: {
      case: 'kebab-case',
      examples: [
        'user-profile',
        'nav-menu',
        'btn-primary',
        'text-center',
      ],
    },
    
    // ユーティリティクラス
    utility: {
      pattern: 'property-value',
      examples: [
        'mt-4',     // margin-top: 1rem
        'text-lg',  // font-size: large
        'flex',     // display: flex
        'hidden',   // display: none
      ],
    },
  },
  
  // CSS変数
  variables: {
    prefix: '--',
    case: 'kebab-case',
    examples: [
      '--color-primary',
      '--font-size-base',
      '--spacing-unit',
      '--border-radius',
    ],
  },
  
  // CSS Modules
  modules: {
    file: '[name].module.css',
    import: 'styles',
    usage: 'styles.className',
  },
};

// =====================================
// テスト命名規則
// =====================================
export const testNaming = {
  // テストファイル
  files: {
    unit: '[name].test.ts',
    integration: '[name].integration.test.ts',
    e2e: '[name].e2e.test.ts',
    snapshot: '[name].snap',
  },
  
  // テストケース
  testCases: {
    // describe
    describe: {
      pattern: 'ComponentName or FunctionName',
      examples: [
        'UserProfile',
        'formatDate',
        'API /users endpoints',
      ],
    },
    
    // it/test
    it: {
      pattern: 'should [expected behavior] when [condition]',
      examples: [
        'should render user name when data is provided',
        'should return error when input is invalid',
        'should call onClick handler when button is clicked',
      ],
    },
    
    // テストID
    testId: {
      case: 'kebab-case',
      prefix: 'test-',
      examples: [
        'test-submit-button',
        'test-user-input',
        'test-error-message',
      ],
    },
  },
  
  // モック
  mocks: {
    prefix: 'mock',
    examples: [
      'mockUser',
      'mockApiResponse',
      'mockRouter',
      'mockAuthService',
    ],
  },
};

// =====================================
// 環境変数命名規則
// =====================================
export const envNaming = {
  // 基本ルール
  case: 'UPPER_SNAKE_CASE',
  
  // プレフィックス
  prefixes: {
    public: 'NEXT_PUBLIC_',            // NEXT_PUBLIC_API_URL
    private: '',                       // DATABASE_URL
    custom: 'APP_',                    // APP_ENV
  },
  
  // カテゴリ別
  categories: {
    database: 'DATABASE_',             // DATABASE_URL, DATABASE_HOST
    api: 'API_',                       // API_KEY, API_URL
    auth: 'AUTH_',                     // AUTH_SECRET, AUTH_DOMAIN
    aws: 'AWS_',                       // AWS_ACCESS_KEY_ID
    firebase: 'FIREBASE_',             // FIREBASE_API_KEY
    stripe: 'STRIPE_',                 // STRIPE_PUBLIC_KEY
  },
  
  // 例
  examples: [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'NEXT_PUBLIC_API_URL',
    'JWT_SECRET',
    'REDIS_URL',
    'SMTP_HOST',
  ],
};

// =====================================
// Git命名規則
// =====================================
export const gitNaming = {
  // ブランチ
  branches: {
    // プレフィックス
    prefixes: {
      feature: 'feature/',             // feature/user-authentication
      bugfix: 'bugfix/',               // bugfix/login-error
      hotfix: 'hotfix/',               // hotfix/critical-security-issue
      release: 'release/',             // release/v1.2.0
      chore: 'chore/',                 // chore/update-dependencies
    },
    
    // フォーマット
    format: 'type/ticket-description',
    examples: [
      'feature/JIRA-123-add-user-profile',
      'bugfix/fix-navigation-menu',
      'release/v2.0.0',
    ],
  },
  
  // コミットメッセージ
  commits: {
    // Conventional Commits
    types: [
      'feat',     // 新機能
      'fix',      // バグ修正
      'docs',     // ドキュメント
      'style',    // フォーマット
      'refactor', // リファクタリング
      'test',     // テスト
      'chore',    // ビルド、補助ツール
    ],
    
    format: 'type(scope): description',
    examples: [
      'feat(auth): add social login',
      'fix(ui): correct button alignment',
      'docs(readme): update installation guide',
    ],
  },
  
  // タグ
  tags: {
    format: 'v[major].[minor].[patch]',
    examples: [
      'v1.0.0',
      'v2.1.3',
      'v1.0.0-beta.1',
      'v2.0.0-rc.2',
    ],
  },
};

// =====================================
// ユーティリティ関数
// =====================================

/**
 * 文字列をキャメルケースに変換
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^./, char => char.toLowerCase());
}

/**
 * 文字列をパスカルケースに変換
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * 文字列をケバブケースに変換
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 文字列をスネークケースに変換
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * 文字列を大文字スネークケースに変換
 */
export function toUpperSnakeCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

/**
 * ファイル名が命名規則に準拠しているかチェック
 */
export function validateFileName(fileName: string, type: string): boolean {
  const patterns: Record<string, RegExp> = {
    component: /^[A-Z][a-zA-Z]*\.tsx$/,
    page: /^[a-z]+(-[a-z]+)*\.tsx$/,
    hook: /^use[A-Z][a-zA-Z]*\.ts$/,
    util: /^[a-z][a-zA-Z]*\.ts$/,
    constant: /^[A-Z_]+\.ts$/,
  };
  
  return patterns[type]?.test(fileName) || false;
}