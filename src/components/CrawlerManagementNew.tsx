import React, { useState } from 'react';
import {
  Search,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit2,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Eye,
  Filter,
  ArrowRight,
  TrendingUp,
  Archive,
  Activity,
  Target
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'scheduled';
  sourcesCount: number;
  articlesCollected: number;
  targetArticles: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

interface CrawlerManagementProps {
  onNavigate: (page: any) => void;
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function CrawlerManagement({ onNavigate }: CrawlerManagementProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Technology News Q4 2024',
      description: 'Collect technology news from major tech blogs and news sites',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      sourcesCount: 8,
      articlesCollected: 2456,
      targetArticles: 5000,
      successRate: 94.5,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Business News 2024',
      description: 'Aggregate business and financial news from trusted sources',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      sourcesCount: 12,
      articlesCollected: 4821,
      targetArticles: 10000,
      successRate: 96.8,
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Sports Coverage',
      description: 'Real-time sports news and match updates',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'paused',
      sourcesCount: 5,
      articlesCollected: 1234,
      targetArticles: 3000,
      successRate: 89.2,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: 'Entertainment Weekly',
      description: 'Entertainment news, movies, music, and celebrity updates',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      sourcesCount: 6,
      articlesCollected: 0,
      targetArticles: 4000,
      successRate: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign>>({});
  const [saveAndContinue, setSaveAndContinue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingCampaign.name || !editingCampaign.startDate || !editingCampaign.endDate) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isCreatingNew = !editingCampaign.id;

    if (isCreatingNew) {
      const newCampaign: Campaign = {
        id: String(Date.now()),
        name: editingCampaign.name!,
        description: editingCampaign.description || '',
        startDate: editingCampaign.startDate!,
        endDate: editingCampaign.endDate!,
        status: new Date(editingCampaign.startDate!) > new Date() ? 'scheduled' : 'active',
        sourcesCount: 0,
        articlesCollected: 0,
        targetArticles: editingCampaign.targetArticles || 1000,
        successRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCampaigns(prev => [...prev, newCampaign]);
      showNotification('Campaign created successfully!', 'success');

      if (saveAndContinue) {
        setEditingCampaign({});
        showNotification('Ready to add another campaign', 'info');
      } else {
        setShowCreateModal(false);
        setEditingCampaign({});
      }
    } else {
      setCampaigns(prev =>
        prev.map(c => (c.id === editingCampaign.id ? { ...c, ...editingCampaign as Campaign } : c))
      );
      showNotification('Campaign updated successfully!', 'success');
      setShowCreateModal(false);
      setEditingCampaign({});
    }

    setIsSaving(false);
    setSaveAndContinue(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    setCampaigns(prev => prev.filter(c => c.id !== id));
    showNotification('Campaign deleted successfully!', 'success');
  };

  const toggleStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' as any }
          : c
      )
    );
    showNotification('Campaign status updated!', 'success');
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchTerm && !campaign.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && campaign.status !== filterStatus) {
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
      case 'completed':
        return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle, label: 'Completed' };
      case 'scheduled':
        return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: Clock, label: 'Scheduled' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30', icon: AlertCircle, label: 'Unknown' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const totalArticles = campaigns.reduce((sum, c) => sum + c.articlesCollected, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const avgSuccessRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + c.successRate, 0) / campaigns.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Crawler Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage data collection campaigns and sources
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCampaign({});
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Campaigns</p>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{campaigns.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {activeCampaigns} active
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Articles Collected</p>
            <Archive className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{totalArticles.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +234 today
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Sources</p>
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">
            {campaigns.reduce((sum, c) => sum + c.sourcesCount, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Across all campaigns
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Success Rate</p>
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Overall performance
          </p>
        </div>
      </div>

      {/* Search & Filters */}
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
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Filter by Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No campaigns found</p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => {
            const statusConfig = getStatusConfig(campaign.status);
            const StatusIcon = statusConfig.icon;
            const progress = (campaign.articlesCollected / campaign.targetArticles) * 100;

            return (
              <div
                key={campaign.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{campaign.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {campaign.status !== 'scheduled' && (
                      <button
                        onClick={() => toggleStatus(campaign.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {campaign.status === 'active' ? (
                          <Pause className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <Play className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingCampaign(campaign);
                        setShowCreateModal(true);
                      }}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() =>
                        onNavigate({
                          page: 'campaign-detail',
                          campaignId: campaign.id,
                        })
                      }
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-purple-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p className="font-semibold text-sm">{formatDate(campaign.startDate)}</p>
                  </div>

                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">End Date</p>
                    <p className="font-semibold text-sm">{formatDate(campaign.endDate)}</p>
                  </div>

                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Sources</p>
                    <p className="font-semibold text-sm">{campaign.sourcesCount} sources</p>
                  </div>

                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Articles</p>
                    <p className="font-semibold text-sm">
                      {campaign.articlesCollected.toLocaleString()} / {campaign.targetArticles.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                    <p className="font-semibold text-sm">{campaign.successRate.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">
                  {editingCampaign.id ? 'Edit Campaign' : 'Create Campaign'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingCampaign.id ? 'Update campaign information' : 'Create a new data collection campaign'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCampaign({});
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
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingCampaign.name || ''}
                  onChange={(e) => setEditingCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Technology News Q4 2024"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editingCampaign.description || ''}
                  onChange={(e) => setEditingCampaign(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Campaign description..."
                  rows={3}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingCampaign.startDate ? editingCampaign.startDate.split('T')[0] : ''}
                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingCampaign.endDate ? editingCampaign.endDate.split('T')[0] : ''}
                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, endDate: new Date(e.target.value).toISOString() }))}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Target Articles */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Articles
                </label>
                <input
                  type="number"
                  value={editingCampaign.targetArticles || 1000}
                  onChange={(e) => setEditingCampaign(prev => ({ ...prev, targetArticles: parseInt(e.target.value) || 1000 }))}
                  placeholder="1000"
                  min="1"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCampaign({});
                  setSaveAndContinue(false);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>

              <div className="flex-1 flex gap-3">
                {/* Save & Add Another */}
                {!editingCampaign.id && (
                  <button
                    onClick={() => {
                      setSaveAndContinue(true);
                      handleSave();
                    }}
                    disabled={isSaving || !editingCampaign.name || !editingCampaign.startDate || !editingCampaign.endDate}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && saveAndContinue ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Save & Add Another
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    setSaveAndContinue(false);
                    handleSave();
                  }}
                  disabled={isSaving || !editingCampaign.name || !editingCampaign.startDate || !editingCampaign.endDate}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && !saveAndContinue ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {editingCampaign.id ? 'Update' : 'Save'}
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
