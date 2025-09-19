'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getMemberById, updateMemberProfile } from '@/lib/firestore';
import { Member } from '@/types';
import FormLayout from '@/components/FormLayout';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import { 
  UserIcon, 
  IdentificationIcon,
  ArrowLeftOnRectangleIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  EnvelopeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [showMemberCard, setShowMemberCard] = useState(false);
  
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadMemberData() {
      if (user?.uid) {
        const memberData = await getMemberById(user.uid);
        if (memberData) {
          setCurrentMember(memberData);
          setFormData({
            lastName: memberData.lastName || '',
            firstName: memberData.firstName || '',
            lastNameKana: memberData.lastNameKana || '',
            firstNameKana: memberData.firstNameKana || '',
            postalCode: memberData.postalCode || '',
            prefecture: memberData.prefecture || '',
            city: memberData.city || '',
            address: memberData.address || '',
            building: memberData.building || '',
            phoneNumber: memberData.phoneNumber || '',
          });
        }
      }
    }
    loadMemberData();
  }, [user, updateSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updateData: Partial<Member> = {
        ...formData,
        building: formData.building || undefined,
      };
      
      await updateMemberProfile(user.uid, updateData);
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentMember) {
      setFormData({
        lastName: currentMember.lastName || '',
        firstName: currentMember.firstName || '',
        lastNameKana: currentMember.lastNameKana || '',
        firstNameKana: currentMember.firstNameKana || '',
        postalCode: currentMember.postalCode || '',
        prefecture: currentMember.prefecture || '',
        city: currentMember.city || '',
        address: currentMember.address || '',
        building: currentMember.building || '',
        phoneNumber: currentMember.phoneNumber || '',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'platinum_individual':
        return 'PLATINUM個人会員';
      case 'platinum_business':
        return 'PLATINUM法人会員';
      case 'business':
        return '法人会員';
      default:
        return '個人会員';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'platinum_individual':
      case 'platinum_business':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white';
      case 'business':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white';
      default:
        return 'bg-gradient-to-r from-green-600 to-teal-600 text-white';
    }
  };

  return (
    <FormLayout
      title="マイページ"
      description="会員情報の確認・編集ができます"
      showBackButton={true}
      backButtonHref="/"
      backButtonText="ホームページに戻る"
    >
      <div className="max-w-md mx-auto">
        {/* アラートメッセージ */}
        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-800">プロフィールを更新しました</p>
            </div>
          </div>
        )}
        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
            <p className="text-sm text-red-800">{updateError}</p>
          </div>
        )}

        {/* 会員情報セクション */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">会員情報</h2>
          </div>
          <div className="p-6">
            <dl className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">会員種別</dt>
                <dd className="text-sm text-gray-900 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(currentMember?.plan || 'individual')}`}>
                    {getPlanDisplayName(currentMember?.plan || 'individual')}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">お名前</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {currentMember ? `${currentMember.lastName} ${currentMember.firstName}` : '未設定'}
                </dd>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">お名前（カナ）</dt>
                <dd className="text-sm text-gray-900">
                  {currentMember ? `${currentMember.lastNameKana} ${currentMember.firstNameKana}` : '未設定'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* デジタル会員証ボタン */}
        <button
          onClick={() => setShowMemberCard(true)}
          className="w-full mb-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
        > 
          <IdentificationIcon className="h-5 w-5 mr-2" />
          デジタル会員証
        </button>

        {/* 設定セクション */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">設定</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center">
                    <PencilIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-gray-700">登録情報の編集</span>
                  </span>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
              <li>
                <Link
                  href="/settings/email"
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group block"
                >
                  <span className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-gray-700">メール配信設定</span>
                  </span>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/settings/account"
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group block"
                >
                  <span className="flex items-center">
                    <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-gray-700">アカウント設定</span>
                  </span>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
              <li className="pt-3 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
                    <span className="text-red-600">ログアウト</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* デジタル会員証モーダル - シンプルな画像表示 */}
      {showMemberCard && currentMember && (
        <>
          {/* ブラー効果のある背景オーバーレイ */}
          <div 
            className="fixed inset-0 backdrop-blur-sm bg-gray-900/20 z-40"
            onClick={() => setShowMemberCard(false)}
          />
          
          {/* 会員証画像 */}
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative max-w-md w-full pointer-events-auto">
              <button
                onClick={() => setShowMemberCard(false)}
                className="absolute -top-10 right-0 text-white drop-shadow-lg hover:text-gray-200 z-10"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              
              <Image
                src={
                  currentMember.plan?.includes('platinum')
                    ? '/images/card/platinum_membership_card.jpg'
                    : currentMember.plan === 'business'
                    ? '/images/card/business_membership_card.jpg'
                    : '/images/card/individual_membership_card.jpg'
                }
                alt="Member Card"
                width={400}
                height={250}
                className="w-full rounded-lg shadow-2xl"
              />
              
              {/* ユーザー名表示 */}
              <div className="mt-4 text-center">
                <p className="text-white text-lg font-semibold drop-shadow-lg">
                  {currentMember.lastName} {currentMember.firstName}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 編集モーダル */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="inline-block align-middle min-h-screen" aria-hidden="true">&#8203;</div>
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">登録情報の編集</h3>
                </div>
                
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* 名前 */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="姓 *"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                      <FormInput
                        label="名 *"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* カナ */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="セイ *"
                        name="lastNameKana"
                        value={formData.lastNameKana}
                        onChange={handleChange}
                        required
                      />
                      <FormInput
                        label="メイ *"
                        name="firstNameKana"
                        value={formData.firstNameKana}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* 電話番号 */}
                    <FormInput
                      label="電話番号 *"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="090-1234-5678"
                      required
                    />

                    {/* 郵便番号 */}
                    <FormInput
                      label="郵便番号 *"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="123-4567"
                      required
                    />

                    {/* 都道府県・市区町村 */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="都道府県 *"
                        name="prefecture"
                        value={formData.prefecture}
                        onChange={handleChange}
                        required
                      />
                      <FormInput
                        label="市区町村 *"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* 番地 */}
                    <FormInput
                      label="番地 *"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />

                    {/* 建物名 */}
                    <FormInput
                      label="建物名・部屋番号"
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <FormButton
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    className="!w-auto px-6"
                  >
                    キャンセル
                  </FormButton>
                  <FormButton
                    type="submit"
                    variant="primary"
                    loading={updating}
                    loadingText="保存中..."
                    className="!w-auto px-6"
                  >
                    保存する
                  </FormButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </FormLayout>
  );
}