/**
 * StatusBadge Component
 * Reusable status badge with consistent styling
 */

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getStatusConfig, type StatusType } from '../constants/status-types';

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ 
  status, 
  showIcon = true, 
  size = 'md',
  className = '' 
}: StatusBadgeProps) {
  const { t } = useLanguage();
  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${config.color} ${config.bgColor}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{t(config.labelKey)}</span>
    </span>
  );
}

interface StatusDotProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusDot({ status, size = 'md', className = '' }: StatusDotProps) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span
      className={`
        inline-block rounded-full
        ${config.dotColor}
        ${sizeClasses[size]}
        ${className}
      `}
      title={config.label}
    />
  );
}
