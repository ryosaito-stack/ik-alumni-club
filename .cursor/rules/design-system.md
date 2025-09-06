# デザインシステムガイド

## 📐 概要
このプロジェクトでは、デザインの一貫性と保守性を確保するため、デザイントークンシステムを採用しています。

## 🎨 デザイントークンファイル
- **場所**: `/src/constants/design-tokens.ts`
- **目的**: UIの一貫性を保つためのデザインシステム定義

## 📦 主要カテゴリ

### 1. カラーパレット (`colors`)
```typescript
// 使用例
import { colors } from '@/constants/design-tokens';

// プライマリカラー
<div className={colors.primary[600]}> // bg-indigo-600

// テキストカラー
<p className={colors.text.primary}> // text-gray-900

// メンバープランカラー
<span className={colors.memberPlan.platinum}> // bg-purple-100 text-purple-800
```

### 2. スペーシング (`spacing`)
```typescript
// パディング
<div className={spacing.padding.md}> // p-4

// マージン
<h1 className={spacing.margin.bottom.lg}> // mb-6

// ギャップ
<div className={spacing.gap.md}> // gap-4
```

### 3. タイポグラフィ (`typography`)
```typescript
// フォントサイズ
<h1 className={typography.fontSize['3xl']}> // text-3xl

// フォントウェイト
<span className={typography.fontWeight.bold}> // font-bold

// テキスト配置
<div className={typography.textAlign.center}> // text-center
```

### 4. レイアウト (`layout`)
```typescript
// フレックスボックス
<div className={`${layout.display.flex} ${layout.flex.justify.between}`}>

// グリッド
<div className={`${layout.display.grid} ${layout.grid.cols[3]}`}>

// サイズ
<div className={layout.size.width.full}> // w-full
```

### 5. エフェクト (`effects`)
```typescript
// シャドウ
<div className={effects.shadow.lg}> // shadow-lg

// 角丸
<button className={effects.borderRadius.md}> // rounded-md

// トランジション
<a className={effects.transition.colors}> // transition-colors
```

### 6. インタラクション (`interaction`)
```typescript
// ホバー状態
<button className={`${interaction.hover.bgColor.indigo700}`}>

// フォーカス状態
<input className={interaction.focus.ring.indigo}>
```

### 7. コンポーネントスタイル (`components`)
```typescript
// ボタン
<button className={components.button.variants.primary}>

// カード
<div className={components.card.base}>

// ナビゲーション
<a className={components.nav.item.active}>
```

### 8. レスポンシブ (`responsive`)
```typescript
// ブレークポイント
<div className={`text-sm ${responsive.breakpoints.md}text-lg`}>

// パターン
<div className={responsive.patterns.gridCols.mobile1Desktop3}>
```

## 🛠 ユーティリティ関数

### `cn(...classes)`
複数のクラス名を結合
```typescript
import { cn } from '@/constants/design-tokens';

const className = cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class'
);
```

### `getButtonClasses(variant, size, fullWidth?, disabled?)`
ボタンのクラス名を生成
```typescript
import { getButtonClasses } from '@/constants/design-tokens';

<button className={getButtonClasses('primary', 'md')}>
  クリック
</button>
```

### `getCardClasses(hoverable?, bordered?)`
カードのクラス名を生成
```typescript
import { getCardClasses } from '@/constants/design-tokens';

<div className={getCardClasses(true, false)}>
  ホバー可能なカード
</div>
```

### `getBadgeClasses(variant)`
バッジのクラス名を生成
```typescript
import { getBadgeClasses } from '@/constants/design-tokens';

<span className={getBadgeClasses('success')}>
  成功
</span>
```

### `getMemberPlanBadgeClass(plan)`
メンバープランのバッジカラーを取得
```typescript
import { getMemberPlanBadgeClass } from '@/constants/design-tokens';

<span className={getMemberPlanBadgeClass('platinum')}>
  プラチナ会員
</span>
```

## 📋 使用ガイドライン

### ✅ DO（推奨事項）
1. **必ずデザイントークンを使用する**
   - ハードコーディングされたスタイルは避ける
   - 一貫性のあるUIを維持

2. **適切なセマンティックトークンを選択**
   ```typescript
   // 良い例
   className={colors.text.primary}
   
   // 悪い例
   className="text-gray-900"
   ```

3. **ユーティリティ関数を活用**
   ```typescript
   // 良い例
   className={getButtonClasses('primary', 'lg')}
   
   // 悪い例
   className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
   ```

4. **レスポンシブパターンを使用**
   ```typescript
   // 良い例
   className={responsive.patterns.gridCols.mobile1Desktop3}
   
   // 悪い例
   className="grid-cols-1 lg:grid-cols-3"
   ```

### ❌ DON'T（避けるべき事項）
1. **インラインスタイルの使用を避ける**
   ```typescript
   // 悪い例
   style={{ color: 'red', margin: '10px' }}
   ```

2. **任意の値の使用を避ける**
   ```typescript
   // 悪い例
   className="mt-[13px]" // 任意の値
   
   // 良い例
   className={spacing.margin.top.md} // 定義された値
   ```

3. **同じスタイルの重複定義を避ける**
   - コンポーネント間で共通のスタイルは定数として定義

## 🔄 更新手順

### 新しいトークンの追加
1. `/src/constants/design-tokens.ts`を開く
2. 適切なカテゴリに新しいトークンを追加
3. 必要に応じてユーティリティ関数を作成
4. このドキュメントを更新

### 既存トークンの変更
1. 影響範囲を確認（グローバル検索）
2. トークンを更新
3. 全ての使用箇所をテスト
4. 変更履歴を記録

## 📊 カラーパレット一覧

### プライマリカラー（Indigo）
- `primary.50` - `primary.900`

### セマンティックカラー
- **エラー**: Red系
- **成功**: Green系
- **警告**: Yellow系
- **情報**: Blue系

### グレースケール
- `gray.50` - `gray.900`

## 🎯 ベストプラクティス

1. **一貫性を保つ**
   - 同じ目的には同じトークンを使用
   - チーム全体で規約を共有

2. **セマンティックな命名**
   - 色の名前ではなく、用途で命名
   - 例: `colors.text.primary` > `colors.gray900`

3. **段階的な移行**
   - 新規コンポーネントから適用
   - 既存コンポーネントは段階的に更新

4. **ドキュメントの維持**
   - 変更時は必ずドキュメントも更新
   - 使用例を追加

## 📝 更新履歴
- **2025-01-15**: 初回作成
  - デザイントークンシステム導入
  - 基本カテゴリ定義
  - ユーティリティ関数追加