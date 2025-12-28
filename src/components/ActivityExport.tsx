import React, { useState } from 'react';
import { Download, FileDown, FileText, Calendar, Check } from 'lucide-react';

interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'excel';
  dateRange: 'today' | 'week' | 'month' | 'custom' | 'all';
  includeMetadata: boolean;
  includeUserDetails: boolean;
  groupBy?: 'date' | 'type' | 'entity' | 'user';
  customDateFrom?: string;
  customDateTo?: string;
}

interface ActivityExportProps {
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export function ActivityExport({ onClose, onExport }: ActivityExportProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'json',
    dateRange: 'all',
    includeMetadata: true,
    includeUserDetails: true,
  });

  const formats = [
    { value: 'json', label: 'JSON', icon: FileText, description: 'Định dạng JavaScript Object Notation' },
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-Separated Values cho Excel' },
    { value: 'pdf', label: 'PDF', icon: FileDown, description: 'Portable Document Format' },
    { value: 'excel', label: 'Excel', icon: FileDown, description: 'Microsoft Excel Workbook (.xlsx)' },
  ];

  const dateRanges = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: 'all', label: 'Tất cả' },
    { value: 'custom', label: 'Tùy chỉnh' },
  ];

  const groupByOptions = [
    { value: 'none', label: 'Không nhóm' },
    { value: 'date', label: 'Theo ngày' },
    { value: 'type', label: 'Theo loại hành động' },
    { value: 'entity', label: 'Theo đối tượng' },
    { value: 'user', label: 'Theo người dùng' },
  ];

  const handleExport = () => {
    onExport(options);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card rounded-2xl border border-border/60 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold">Xuất dữ liệu hoạt động</h3>
            <p className="text-sm text-muted-foreground mt-1">Chọn định dạng và tùy chọn xuất dữ liệu</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Định dạng file</label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setOptions({ ...options, format: format.value as any })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      options.format === format.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        options.format === format.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-secondary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">{format.label}</span>
                      {options.format === format.value && (
                        <Check className="w-4 h-4 text-blue-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-3">Khoảng thời gian</label>
            <div className="grid grid-cols-5 gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setOptions({ ...options, dateRange: range.value as any })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    options.dateRange === range.value
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            {options.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-secondary rounded-xl">
                <div>
                  <label className="block text-xs font-medium mb-2">Từ ngày</label>
                  <input
                    type="date"
                    value={options.customDateFrom || ''}
                    onChange={(e) => setOptions({ ...options, customDateFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2">Đến ngày</label>
                  <input
                    type="date"
                    value={options.customDateTo || ''}
                    onChange={(e) => setOptions({ ...options, customDateTo: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Group By */}
          <div>
            <label className="block text-sm font-medium mb-3">Nhóm dữ liệu theo</label>
            <select
              value={options.groupBy || 'none'}
              onChange={(e) => setOptions({ ...options, groupBy: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {groupByOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-sm font-medium mb-3">Tùy chọn bổ sung</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-colors">
                <input
                  type="checkbox"
                  checked={options.includeMetadata}
                  onChange={(e) => setOptions({ ...options, includeMetadata: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">Bao gồm metadata</p>
                  <p className="text-xs text-muted-foreground">Xuất chi tiết thay đổi, IP, User Agent...</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-colors">
                <input
                  type="checkbox"
                  checked={options.includeUserDetails}
                  onChange={(e) => setOptions({ ...options, includeUserDetails: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">Bao gồm thông tin người dùng</p>
                  <p className="text-xs text-muted-foreground">Xuất tên, email, vai trò người dùng</p>
                </div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-300">Tóm tắt xuất dữ liệu</h4>
            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
              <p>• Định dạng: <strong>{formats.find(f => f.value === options.format)?.label}</strong></p>
              <p>• Thời gian: <strong>{dateRanges.find(r => r.value === options.dateRange)?.label}</strong></p>
              <p>• Nhóm theo: <strong>{groupByOptions.find(g => g.value === (options.groupBy || 'none'))?.label}</strong></p>
              <p>• Metadata: <strong>{options.includeMetadata ? 'Có' : 'Không'}</strong></p>
              <p>• Thông tin user: <strong>{options.includeUserDetails ? 'Có' : 'Không'}</strong></p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
        </div>
      </div>
    </div>
  );
}
