'use client';

import { useState, useEffect } from 'react';
import { Content, MemberPlan } from '@/types';
import { messages } from '@/constants/messages';

interface ContentFormProps {
  content?: Content;
  onSubmit: (data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ContentForm({ content, onSubmit, onCancel, isLoading }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    category: content?.category || '',
    type: content?.type || 'article' as Content['type'],
    requiredPlan: content?.requiredPlan || 'individual' as MemberPlan,
    imageUrl: content?.imageUrl || '',
    videoUrl: content?.videoUrl || '',
    documentUrl: content?.documentUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = messages.errors.required;
    }
    if (!formData.description.trim()) {
      newErrors.description = messages.errors.required;
    }
    if (!formData.category.trim()) {
      newErrors.category = messages.errors.required;
    }

    // タイプ別の検証
    if (formData.type === 'video' && !formData.videoUrl?.trim()) {
      newErrors.videoUrl = messages.errors.required;
    }
    if (formData.type === 'document' && !formData.documentUrl?.trim()) {
      newErrors.documentUrl = messages.errors.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: Omit<Content, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      type: formData.type,
      requiredPlan: formData.requiredPlan,
      imageUrl: formData.imageUrl?.trim() || undefined,
      videoUrl: formData.type === 'video' ? formData.videoUrl?.trim() : undefined,
      documentUrl: formData.type === 'document' ? formData.documentUrl?.trim() : undefined,
    };

    await onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          {messages.contents.contentTitle}
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          placeholder={messages.placeholder.title}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* 説明 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          {messages.contents.contentDescription}
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          placeholder={messages.placeholder.description}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* カテゴリー */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          {messages.contents.contentCategory}
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.category ? 'border-red-300' : 'border-gray-300'
          } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          placeholder="例: キャリア、技術、イベント"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* コンテンツタイプ */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          {messages.contents.contentType}
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="article">{messages.contents.articleContent}</option>
          <option value="video">{messages.contents.videoContent}</option>
          <option value="document">{messages.contents.documentContent}</option>
        </select>
      </div>

      {/* 必要プラン */}
      <div>
        <label htmlFor="requiredPlan" className="block text-sm font-medium text-gray-700">
          {messages.contents.requiredPlanLabel}
        </label>
        <select
          id="requiredPlan"
          name="requiredPlan"
          value={formData.requiredPlan}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="individual">{messages.membership.individual}</option>
          <option value="business">{messages.membership.business}</option>
          <option value="platinum">{messages.membership.platinum}</option>
        </select>
      </div>

      {/* 画像URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          画像URL（オプション）
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={messages.placeholder.url}
        />
      </div>

      {/* ビデオURL（ビデオタイプの場合） */}
      {formData.type === 'video' && (
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
            動画URL
          </label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.videoUrl ? 'border-red-300' : 'border-gray-300'
            } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="https://youtube.com/..."
          />
          {errors.videoUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.videoUrl}</p>
          )}
        </div>
      )}

      {/* ドキュメントURL（ドキュメントタイプの場合） */}
      {formData.type === 'document' && (
        <div>
          <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700">
            ドキュメントURL
          </label>
          <input
            type="url"
            id="documentUrl"
            name="documentUrl"
            value={formData.documentUrl}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.documentUrl ? 'border-red-300' : 'border-gray-300'
            } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="https://drive.google.com/..."
          />
          {errors.documentUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.documentUrl}</p>
          )}
        </div>
      )}

      {/* ボタン */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {messages.common.cancel}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? (content ? messages.admin.updating : messages.admin.creating)
            : (content ? messages.common.save : messages.contents.createContent)
          }
        </button>
      </div>
    </form>
  );
}