/**
 * ArticleTypeBadge Component
 * Reusable article type badge with icon
 */

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getArticleTypeConfig, type ArticleType } from '../constants/article-types';

interface ArticleTypeBadgeProps {
  type: ArticleType;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  className?: string;
}

export function ArticleTypeBadge({
  type,
  showIcon = true,
  showLabel = true,
  size = 'md',
  variant = 'default',
  className = '',
}: ArticleTypeBadgeProps) {
  const { t } = useLanguage();
  const config = getArticleTypeConfig(type);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantClasses = {
    default: `${config.color} ${config.bgColor}`,
    outline: `${config.color} border ${config.color.replace('text-', 'border-')} bg-transparent`,
    minimal: `${config.color} bg-transparent`,
  };

  if (!showLabel && showIcon) {
    return (
      <span className={`inline-flex ${className}`} title={t(config.labelKey)}>
        <Icon className={`${iconSizes[size]} ${config.color}`} />
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showLabel && <span>{t(config.labelKey)}</span>}
    </span>
  );
}
