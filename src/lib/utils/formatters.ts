/**
 * Formatting Utilities
 * Common formatting functions for display
 */

export const formatters = {
  /**
   * Format date to locale string
   */
  date: (date: string | Date, locale: string = 'vi-VN'): string => {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Format date with time
   */
  datetime: (date: string | Date, locale: string = 'vi-VN'): string => {
    return new Date(date).toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  relativeTime: (date: string | Date, locale: string = 'vi-VN'): string => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} tuần trước`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)} tháng trước`;
    return `${Math.floor(diffDay / 365)} năm trước`;
  },

  /**
   * Format number with thousand separators
   */
  number: (num: number, locale: string = 'vi-VN'): string => {
    return num.toLocaleString(locale);
  },

  /**
   * Format file size (bytes to human readable)
   */
  fileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Format duration (seconds to human readable)
   */
  duration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  },

  /**
   * Format currency
   */
  currency: (amount: number, currency: string = 'VND', locale: string = 'vi-VN'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  },

  /**
   * Truncate text with ellipsis
   */
  truncate: (text: string, maxLength: number = 100, ellipsis: string = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - ellipsis.length) + ellipsis;
  },

  /**
   * Generate slug from text
   */
  slug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Capitalize first letter
   */
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * Format percentage
   */
  percentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },
};
