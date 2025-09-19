'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormLayout from '@/components/FormLayout';
import StepIndicator from '@/components/register/StepIndicator';
import { useRegistration } from '@/contexts/RegistrationContext';

// 都道府県リスト
const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export default function ProfilePage() {
  const router = useRouter();
  const { state, updateState, nextStep, prevStep, setError: setContextError } = useRegistration();
  
  // フォームの状態（初期値はContextから取得）
  const [formData, setFormData] = useState({
    lastName: state.profile?.lastName || '',
    firstName: state.profile?.firstName || '',
    lastNameKana: state.profile?.lastNameKana || '',
    firstNameKana: state.profile?.firstNameKana || '',
    postalCode: state.profile?.postalCode || '',
    prefecture: state.profile?.prefecture || '',
    city: state.profile?.city || '',
    address: state.profile?.address || '',
    building: state.profile?.building || '',
    phoneNumber: state.profile?.phoneNumber || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 認証チェック
  useEffect(() => {
    console.log('Profile page - Current state:', {
      uid: state.uid,
      email: state.email,
      hasProfile: !!state.profile,
      currentStep: state.currentStep
    });
    
    if (!state.uid) {
      console.log('Profile page - No uid found, redirecting to auth');
      // Firebase Auth登録が完了していない場合は前のステップへ
      router.push('/register/auth');
    }
  }, [state.uid, router]);

  // フォーム入力変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 電話番号の自動フォーマット
    if (name === 'phoneNumber') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } 
    // 郵便番号の自動フォーマット
    else if (name === 'postalCode') {
      const formatted = formatPostalCode(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // カナのバリデーション（ひらがな・漢字入力も一時的に許可し、変換可能にする）
    else if (name === 'lastNameKana' || name === 'firstNameKana') {
      // 全角カタカナに自動変換
      const katakana = value.replace(/[\u3041-\u3096]/g, (match) => {
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
      });
      setFormData(prev => ({ ...prev, [name]: katakana }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 電話番号フォーマット
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 11) return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 郵便番号フォーマット
  const formatPostalCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}`;
  };

  // バリデーション
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName) newErrors.lastName = '姓を入力してください';
    if (!formData.firstName) newErrors.firstName = '名を入力してください';
    
    if (!formData.lastNameKana) {
      newErrors.lastNameKana = 'セイを入力してください';
    } else if (!/^[ァ-ヶー\s]+$/.test(formData.lastNameKana)) {
      newErrors.lastNameKana = 'カタカナで入力してください';
    }
    
    if (!formData.firstNameKana) {
      newErrors.firstNameKana = 'メイを入力してください';
    } else if (!/^[ァ-ヶー\s]+$/.test(formData.firstNameKana)) {
      newErrors.firstNameKana = 'カタカナで入力してください';
    }
    
    if (!formData.postalCode) {
      newErrors.postalCode = '郵便番号を入力してください';
    } else if (!/^\d{3}-?\d{4}$/.test(formData.postalCode)) {
      newErrors.postalCode = '正しい郵便番号を入力してください';
    }

    if (!formData.prefecture) newErrors.prefecture = '都道府県を選択してください';
    if (!formData.city) newErrors.city = '市区町村を入力してください';
    if (!formData.address) newErrors.address = '町名以降を入力してください';
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = '電話番号を入力してください';
    } else if (!/^0\d{1,4}-?\d{1,4}-?\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '正しい電話番号を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    console.log('Profile page - Saving profile data:', formData);

    // Contextに保存
    updateState({
      profile: formData
    });

    console.log('Profile data saved to context, moving to plan selection');

    // 次のステップへ
    nextStep();
    router.push('/register/plan');
  };

  // 前のステップに戻る
  const handleBack = () => {
    // 入力内容を保存
    updateState({
      profile: formData
    });
    prevStep();
    router.push('/register/auth');
  };

  return (
    <FormLayout
      title="基本情報の入力"
      description="お客様の基本情報を入力してください"
    >
      <div className="max-w-2xl mx-auto">
        {/* ステップインジケーター */}
        <StepIndicator currentStep={state.currentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 名前 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                姓 <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
                placeholder="山田"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                名 <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
                placeholder="太郎"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
          </div>

          {/* カナ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastNameKana" className="block text-sm font-medium text-gray-700 mb-1">
                セイ（カナ） <span className="text-red-500">*</span>
              </label>
              <input
                id="lastNameKana"
                name="lastNameKana"
                type="text"
                value={formData.lastNameKana}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.lastNameKana ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
                placeholder="ヤマダ"
              />
              {errors.lastNameKana && (
                <p className="mt-1 text-xs text-red-500">{errors.lastNameKana}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="firstNameKana" className="block text-sm font-medium text-gray-700 mb-1">
                メイ（カナ） <span className="text-red-500">*</span>
              </label>
              <input
                id="firstNameKana"
                name="firstNameKana"
                type="text"
                value={formData.firstNameKana}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.firstNameKana ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
                placeholder="タロウ"
              />
              {errors.firstNameKana && (
                <p className="mt-1 text-xs text-red-500">{errors.firstNameKana}</p>
              )}
            </div>
          </div>

          {/* 郵便番号 */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              郵便番号 <span className="text-red-500">*</span>
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full max-w-xs px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
              placeholder="123-4567"
            />
            {errors.postalCode && (
              <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
            )}
          </div>

          {/* 都道府県 */}
          <div>
            <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
              都道府県 <span className="text-red-500">*</span>
            </label>
            <select
              id="prefecture"
              name="prefecture"
              value={formData.prefecture}
              onChange={handleChange}
              className={`w-full max-w-xs px-3 py-2 border ${errors.prefecture ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
            {errors.prefecture && (
              <p className="mt-1 text-xs text-red-500">{errors.prefecture}</p>
            )}
          </div>

          {/* 市区町村 */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              市区町村 <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
              placeholder="千代田区"
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          {/* 町名以降 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              町名以降 <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
              placeholder="丸の内1-1-1"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          {/* 建物名 */}
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
              建物名・部屋番号（任意）
            </label>
            <input
              id="building"
              name="building"
              type="text"
              value={formData.building}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="○○ビル 5階"
            />
          </div>

          {/* 電話番号 */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full max-w-xs px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}
              placeholder="090-1234-5678"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* ボタン */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              戻る
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '処理中...' : '次へ進む'}
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}