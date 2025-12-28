import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Globe,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Settings,
  Download,
  Activity
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Source {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'html' | 'api';
  status: 'active' | 'paused' | 'error';
  schedule: string;
  lastRun: string;
  nextRun: string;
  articlesCollected: number;
  successRate: number;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function CrawlerSources() {
  const { t } = useLanguage();
  const [sources, setSources] = useState<Source[]>([
    {
      id: '1',
      name: 'VnExpress Tin mới nhất',
      url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
      type: 'rss',
      status: 'active',
      schedule: 'Every 15 minutes',
      lastRun: '5 minutes ago',
      nextRun: 'in 10 minutes',
      articlesCollected: 1247,
      successRate: 98.5,
      errorCount: 18,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Tuổi Trẻ Online RSS',
      url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss',
      type: 'rss',
      status: 'active',
      schedule: 'Every 20 minutes',
      lastRun: '8 minutes ago',
      nextRun: 'in 12 minutes',
      articlesCollected: 892,
      successRate: 96.2,
      errorCount: 34,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Dân Trí - Tin tức',
      url: 'https://dantri.com.vn/rss/tin-tuc.rss',
      type: 'rss',
      status: 'active',
      schedule: 'Every 30 minutes',
      lastRun: '15 minutes ago',
      nextRun: 'in 15 minutes',
      articlesCollected: 654,
      successRate: 94.8,
      errorCount: 36,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: 'Báo Mới - Tin nóng',
      url: 'https://baomoi.com/rss/hot.rss',
      type: 'rss',
      status: 'paused',
      schedule: 'Every 10 minutes',
      lastRun: '2 hours ago',
      nextRun: 'Paused',
      articlesCollected: 423,
      successRate: 89.3,
      errorCount: 52,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      name: 'Thanh Niên Online',
      url: 'https://thanhnien.vn/rss/home.rss',
      type: 'rss',
      status: 'active',
      schedule: 'Every 25 minutes',
      lastRun: '12 minutes ago',
      nextRun: 'in 13 minutes',
      articlesCollected: 765,
      successRate: 97.1,
      errorCount: 23,
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      name: 'Zing News RSS',
      url: 'https://zingnews.vn/rss/news.rss',
      type: 'rss',
      status: 'error',
      schedule: 'Every 20 minutes',
      lastRun: '45 minutes ago',
      nextRun: 'Error - retry in 5m',
      articlesCollected: 287,
      successRate: 82.4,
      errorCount: 89,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSource, setEditingSource] = useState<Partial<Source>>({});
  const [saveAndContinue, setSaveAndContinue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingSource.name || !editingSource.url || !editingSource.type || !editingSource.schedule) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isCreatingNew = !editingSource.id;

    if (isCreatingNew) {
      const newSource: Source = {
        id: String(Date.now()),
        name: editingSource.name!,
        url: editingSource.url!,
        type: editingSource.type!,
        status: 'active',
        schedule: editingSource.schedule!,
        lastRun: 'Never',
        nextRun: 'Pending',
        articlesCollected: 0,
        successRate: 0,
        errorCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSources(prev => [...prev, newSource]);
      showNotification('Source created successfully!', 'success');

      if (saveAndContinue) {
        setEditingSource({});
        showNotification('Ready to add another source', 'info');
      } else {
        setShowCreateModal(false);
        setEditingSource({});
      }
    } else {
      setSources(prev =>
        prev.map(s => (s.id === editingSource.id ? { ...s, ...editingSource as Source } : s))
      );
      showNotification('Source updated successfully!', 'success');
      setShowCreateModal(false);
      setEditingSource({});
    }

    setIsSaving(false);
    setSaveAndContinue(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    setSources(prev => prev.filter(s => s.id !== id));
    showNotification('Source deleted successfully!', 'success');
  };

  const toggleStatus = (id: string) => {
    setSources(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'paused' : 'active' as any }
          : s
      )
    );
    showNotification('Source status updated!', 'success');
  };

  const handleStartCrawl = async (id: string) => {
    const source = sources.find(s => s.id === id);
    if (!source) return;

    showNotification(`Starting crawl for ${source.name}...`, 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    showNotification('Crawl completed successfully!', 'success');
  };

  const toggleSelectSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSources.length === filteredSources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(filteredSources.map(s => s.id));
    }
  };

  const filteredSources = sources.filter(source => {
    if (searchTerm && !source.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && source.status !== filterStatus) {
      return false;
    }
    if (filterType !== 'all' && source.type !== filterType) {
      return false;
    }
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: Activity, label: 'Active' };
      case 'paused':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Pause, label: 'Paused' };
      case 'error':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle, label: 'Error' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30', icon: AlertCircle, label: 'Unknown' };
    }
  };

  const totalArticles = sources.reduce((sum, s) => sum + s.articlesCollected, 0);
  const activeSources = sources.filter(s => s.status === 'active').length;
  const avgSuccessRate = sources.length > 0
    ? sources.reduce((sum, s) => sum + s.successRate, 0) / sources.length
    : 0;
  const totalErrors = sources.reduce((sum, s) => sum + s.errorCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Nguồn Thu Thập
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các nguồn tin tức tự động
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSource({});
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg shadow-green-500/30"
        >
          <Plus className="w-5 h-5" />
          Thêm nguồn
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Tổng nguồn</p>
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{sources.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {activeSources} đang hoạt động
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Bài viết thu thập</p>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{totalArticles.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            +127 hôm nay
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Tỷ lệ thành công</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Trung bình
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Lỗi</p>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold">{totalErrors}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Tổng số lỗi
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('placeholders.searchCrawler')}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="paused">Tạm dừng</option>
            <option value="error">Lỗi</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">Tất cả loại</option>
            <option value="rss">RSS</option>
            <option value="html">HTML</option>
            <option value="api">API</option>
          </select>

          {/* Bulk Actions */}
          {selectedSources.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedSources.length} đã chọn
              </span>
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSources.length === filteredSources.length && filteredSources.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold">Tên nguồn</th>
                <th className="px-4 py-3 text-left font-semibold">Loại</th>
                <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-left font-semibold">Lịch chạy</th>
                <th className="px-4 py-3 text-left font-semibold">Bài viết</th>
                <th className="px-4 py-3 text-left font-semibold">Thành công</th>
                <th className="px-4 py-3 text-left font-semibold">Lần chạy cuối</th>
                <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    Không tìm thấy nguồn nào
                  </td>
                </tr>
              ) : (
                filteredSources.map(source => {
                  const statusConfig = getStatusConfig(source.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={source.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSources.includes(source.id)}
                          onChange={() => toggleSelectSource(source.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold">{source.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {source.url}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full font-medium uppercase">
                          {source.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p>{source.schedule}</p>
                          <p className="text-xs text-muted-foreground">
                            Next: {source.nextRun}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">{source.articlesCollected.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2 max-w-[60px]">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${source.successRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{source.successRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm">{source.lastRun}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {source.status === 'active' && (
                            <button
                              onClick={() => handleStartCrawl(source.id)}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              title="Run Now"
                            >
                              <RefreshCw className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => toggleStatus(source.id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title={source.status === 'active' ? 'Pause' : 'Resume'}
                          >
                            {source.status === 'active' ? (
                              <Pause className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <Play className="w-4 h-4 text-green-600" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setEditingSource(source);
                              setShowCreateModal(true);
                            }}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>

                          <button
                            onClick={() => handleDelete(source.id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">
                  {editingSource.id ? 'Sửa nguồn' : 'Thêm nguồn'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingSource.id ? 'Cập nhật thông tin nguồn' : 'Thêm nguồn thu thập tin tức mới'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSource({});
                  setSaveAndContinue(false);
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên nguồn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingSource.name || ''}
                  onChange={(e) => setEditingSource(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: VnExpress Tin mới nhất"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editingSource.url || ''}
                  onChange={(e) => setEditingSource(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/rss/feed.xml"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              {/* Type & Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Loại <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingSource.type || 'rss'}
                    onChange={(e) => setEditingSource(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="rss">RSS</option>
                    <option value="html">HTML</option>
                    <option value="api">API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lịch chạy <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingSource.schedule || 'Every 15 minutes'}
                    onChange={(e) => setEditingSource(prev => ({ ...prev, schedule: e.target.value }))}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="Every 5 minutes">Mỗi 5 phút</option>
                    <option value="Every 10 minutes">Mỗi 10 phút</option>
                    <option value="Every 15 minutes">Mỗi 15 phút</option>
                    <option value="Every 20 minutes">Mỗi 20 phút</option>
                    <option value="Every 30 minutes">Mỗi 30 phút</option>
                    <option value="Every 1 hour">Mỗi giờ</option>
                    <option value="Every 2 hours">Mỗi 2 giờ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSource({});
                  setSaveAndContinue(false);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>

              <div className="flex-1 flex gap-3">
                {!editingSource.id && (
                  <button
                    onClick={() => {
                      setSaveAndContinue(true);
                      handleSave();
                    }}
                    disabled={isSaving || !editingSource.name || !editingSource.url || !editingSource.type || !editingSource.schedule}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && saveAndContinue ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Lưu & Thêm tiếp
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    setSaveAndContinue(false);
                    handleSave();
                  }}
                  disabled={isSaving || !editingSource.name || !editingSource.url || !editingSource.type || !editingSource.schedule}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && !saveAndContinue ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {editingSource.id ? 'Cập nhật' : 'Lưu'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}