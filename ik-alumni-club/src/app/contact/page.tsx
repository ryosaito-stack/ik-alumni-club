'use client';

import { useState } from 'react';
import FormLayout from '@/components/FormLayout';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import FormInfoBox from '@/components/FormInfoBox';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    contactKind: '',
    name: '',
    email: '',
    emailConfirm: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム送信処理
    console.log('Form submitted:', formData);
  };

  return (
    <FormLayout
      title="お問い合わせ"
      description="ヘルプをご覧になっても問題が解決しない場合は、下記をご記入の上お問い合わせください。会員の方はログイン後にお問い合わせください。"
    >
      <div className="max-w-md mx-auto">
      <FormInfoBox variant="warning">
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>お問い合わせに対する返信メールのドメイン「ikalumni.com」を受信できるようになっているか、お問い合わせの前に必ず設定をご確認ください。</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>ご回答には数日～1週間程お時間をいただく場合がございます。</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>お客様のご連絡先やお問い合わせ内容に正確な情報が入力されていない場合、ご回答が遅れたり、ご回答ができないことがございます。</span>
          </li>
        </ul>
      </FormInfoBox>

      {/* お問い合わせフォーム */}
      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        {/* お問い合わせ種別 */}
        <div>
          <select
            name="contactKind"
            value={formData.contactKind}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
            required
          >
            <option value="">お問い合わせ種別選択</option>
            <option value="5">入会方法について</option>
            <option value="6">ログインについて</option>
            <option value="7">会員番号・パスワードを忘れました</option>
            <option value="8">その他</option>
          </select>
        </div>

        {/* お名前 */}
        <FormInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="お名前"
          required
        />

        {/* メールアドレス */}
        <FormInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="メールアドレス"
          required
        />

        {/* メールアドレス（確認） */}
        <FormInput
          type="email"
          name="emailConfirm"
          value={formData.emailConfirm}
          onChange={handleInputChange}
          placeholder="メールアドレス（確認）"
          required
        />

        {/* お問い合わせ内容 */}
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="お問い合わせ内容"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700 resize-vertical"
            required
          />
        </div>

        {/* 送信ボタン */}
        <div className="text-center">
          <FormButton type="submit">
            確認画面へ
          </FormButton>
        </div>
      </form>
      </div>
    </FormLayout>
  );
}