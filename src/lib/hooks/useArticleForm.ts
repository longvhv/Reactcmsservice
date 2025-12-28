/**
 * useArticleForm Hook
 * Reusable form logic for article creation/editing
 */

import { useState, useCallback } from 'react';
import type { Article, ArticleFormData } from '../types/article';
import type { ArticleType } from '../constants/article-types';
import type { StatusType } from '../constants/status-types';

interface UseArticleFormOptions {
  initialData?: Partial<Article>;
  onSave?: (data: ArticleFormData) => void | Promise<void>;
  onSaveAndContinue?: (data: ArticleFormData) => void | Promise<void>;
}

export function useArticleForm(options: UseArticleFormOptions = {}) {
  const { initialData, onSave, onSaveAndContinue } = options;

  const [formData, setFormData] = useState<Partial<ArticleFormData>>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    type: initialData?.type || 'news',
    status: initialData?.status || 'draft',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    categoryId: initialData?.categoryId,
    tags: initialData?.tags || [],
    author: initialData?.author || '',
    scheduledAt: initialData?.scheduledAt || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(<K extends keyof ArticleFormData>(
    field: K,
    value: ArticleFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateFields = useCallback((updates: Partial<ArticleFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.content?.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    }

    if (!formData.type) {
      newErrors.type = 'Vui lòng chọn loại bài viết';
    }

    // Type-specific validation
    if (formData.type === 'video' && !formData.videoData?.url) {
      newErrors.videoUrl = 'URL video không được để trống';
    }

    if (formData.type === 'podcast' && !formData.podcastData?.audioUrl) {
      newErrors.audioUrl = 'URL audio không được để trống';
    }

    if (formData.type === 'event') {
      if (!formData.eventData?.startDate) {
        newErrors.eventStartDate = 'Ngày bắt đầu không được để trống';
      }
      if (!formData.eventData?.location) {
        newErrors.eventLocation = 'Địa điểm không được để trống';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validate()) {
      return false;
    }

    setIsSaving(true);
    try {
      await onSave?.(formData as ArticleFormData);
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, validate, onSave]);

  const handleSaveAndContinue = useCallback(async () => {
    if (!validate()) {
      return false;
    }

    setIsSaving(true);
    try {
      await onSaveAndContinue?.(formData as ArticleFormData);
      // Reset form but keep type
      const currentType = formData.type;
      setFormData({
        title: '',
        content: '',
        type: currentType,
        status: 'draft',
        tags: [],
      });
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Save and continue error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, validate, onSaveAndContinue]);

  const reset = useCallback(() => {
    setFormData({
      title: initialData?.title || '',
      content: initialData?.content || '',
      type: initialData?.type || 'news',
      status: initialData?.status || 'draft',
      excerpt: initialData?.excerpt || '',
      tags: initialData?.tags || [],
    });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSaving,
    isDirty,
    updateField,
    updateFields,
    validate,
    handleSave,
    handleSaveAndContinue,
    reset,
  };
}
