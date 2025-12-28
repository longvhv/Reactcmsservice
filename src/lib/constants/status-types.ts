/**
 * Status Type Constants
 * Centralized configuration for all status types in the CMS
 */

import type { LucideIcon } from 'lucide-react';
import {
  FileEdit,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Eye,
  AlertCircle,
  Send,
} from 'lucide-react';

export type StatusType =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'scheduled'
  | 'archived'
  | 'review';

export interface StatusConfig {
  value: StatusType;
  label: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor?: string;
  dotColor?: string;
}

export const STATUS_CONFIGS: Record<StatusType, StatusConfig> = {
  draft: {
    value: 'draft',
    label: 'Nháp',
    labelKey: 'status.draft',
    icon: FileEdit,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    borderColor: 'border-gray-300',
    dotColor: 'bg-gray-500',
  },
  pending: {
    value: 'pending',
    label: 'Chờ duyệt',
    labelKey: 'status.pending',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-300',
    dotColor: 'bg-yellow-500',
  },
  approved: {
    value: 'approved',
    label: 'Đã duyệt',
    labelKey: 'status.approved',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-300',
    dotColor: 'bg-green-500',
  },
  rejected: {
    value: 'rejected',
    label: 'Từ chối',
    labelKey: 'status.rejected',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300',
    dotColor: 'bg-red-500',
  },
  published: {
    value: 'published',
    label: 'Đã xuất bản',
    labelKey: 'status.published',
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-500',
  },
  scheduled: {
    value: 'scheduled',
    label: 'Đã lên lịch',
    labelKey: 'status.scheduled',
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-500',
  },
  archived: {
    value: 'archived',
    label: 'Lưu trữ',
    labelKey: 'status.archived',
    icon: Archive,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    borderColor: 'border-gray-300',
    dotColor: 'bg-gray-400',
  },
  review: {
    value: 'review',
    label: 'Đang xem xét',
    labelKey: 'status.review',
    icon: Eye,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    borderColor: 'border-orange-300',
    dotColor: 'bg-orange-500',
  },
};

export const STATUS_OPTIONS = Object.values(STATUS_CONFIGS);

export const getStatusConfig = (status: StatusType): StatusConfig => {
  return STATUS_CONFIGS[status] || STATUS_CONFIGS.draft;
};
