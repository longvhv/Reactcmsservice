import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Users, FileText, Calendar, Download,
  Settings, Plus, Edit, Trash2, Eye, Filter, Search, ChevronDown,
  Award, BarChart3, PieChart, Clock, CheckCircle, AlertCircle, X,
  User, UserCheck, Globe, Copy, Calculator, Percent, Layers, Target,
  TrendingDown, Zap, ChevronRight, Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Enhanced Types
interface RoyaltyTier {
  min: number;
  max: number;
  rate: number;
}

interface RoyaltyFormula {
  baseAmount: number;
  viewMultiplier?: number;
  wordMultiplier?: number;
  qualityBonus?: number;
  categoryBonus?: { [key: string]: number };
}

interface RoyaltyConfig {
  id: string;
  name: string;
  description?: string;
  
  // Assignment scope
  scope: 'global' | 'group' | 'user';
  assignedTo?: string[]; // User IDs or Group IDs
  assignedNames?: string[]; // Display names
  priority: number; // Higher = override lower priority configs
  
  // Calculation type
  calculationType: 
    | 'fixed_per_article'        // Fixed amount per article
    | 'fixed_per_view'            // Fixed amount per view
    | 'tiered_views'              // Tiered based on view count
    | 'tiered_words'              // Tiered based on word count
    | 'percentage_revenue'        // Percentage of ad revenue
    | 'formula_based'             // Custom formula
    | 'fixed_monthly'             // Monthly salary
    | 'hybrid';                   // Combination of multiple types
  
  // Type-specific config
  articleType?: string;
  category?: string;
  
  // Amounts
  fixedAmount?: number;
  percentageRate?: number;
  tiers?: RoyaltyTier[];
  formula?: RoyaltyFormula;
  
  // Hybrid config (combine multiple)
  hybridComponents?: {
    articleBase?: number;
    viewRate?: number;
    wordRate?: number;
    qualityBonus?: number;
  };
  
  unit: 'VND' | 'USD';
  
  // Conditions
  conditions?: {
    minViews?: number;
    maxViews?: number;
    minWords?: number;
    maxWords?: number;
    quality?: ('draft' | 'published' | 'featured')[];
    articleTypes?: string[];
    categories?: string[];
    publishedAfter?: string;
    publishedBefore?: string;
  };
  
  // Caps & Limits
  limits?: {
    maxPerArticle?: number;
    maxPerMonth?: number;
    maxPerYear?: number;
  };
  
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

interface UserGroup {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  color?: string;
}

interface AuthorRoyalty {
  authorId: string;
  authorName: string;
  authorEmail: string;
  avatar?: string;
  groupIds: string[];
  groupNames: string[];
  activeConfigs: {
    configId: string;
    configName: string;
    scope: 'global' | 'group' | 'user';
    priority: number;
  }[];
  articles: {
    total: number;
    published: number;
    draft: number;
  };
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  royalty: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    pending: number;
    paid: number;
  };
  breakdown: {
    fixed: number;
    perArticle: number;
    perView: number;
    tiered: number;
    bonus: number;
  };
}

export function RoyaltyManagementEnhanced() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'authors' | 'groups' | 'simulator' | 'transactions'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<RoyaltyConfig | null>(null);
  const [selectedScope, setSelectedScope] = useState<'global' | 'group' | 'user'>('global');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showSimulator, setShowSimulator] = useState(false);

  // Mock data - User Groups
  const [userGroups, setUserGroups] = useState<UserGroup[]>([
    { id: 'g1', name: 'Biên tập viên chính', description: 'Full-time editors', memberCount: 8, color: '#3b82f6' },
    { id: 'g2', name: 'Cộng tác viên', description: 'Freelance writers', memberCount: 25, color: '#10b981' },
    { id: 'g3', name: 'Phóng viên ảnh', description: 'Photo journalists', memberCount: 12, color: '#f59e0b' },
    { id: 'g4', name: 'Video Creator', description: 'Video content producers', memberCount: 6, color: '#8b5cf6' },
    { id: 'g5', name: 'Intern', description: 'Trainees', memberCount: 15, color: '#6b7280' }
  ]);

  // Mock data - Enhanced Configs with different scopes
  const [configs, setConfigs] = useState<RoyaltyConfig[]>([
    {
      id: 'c1',
      name: 'Nhuận bút tin tức cơ bản (Global)',
      description: 'Áp dụng cho tất cả tác giả',
      scope: 'global',
      priority: 1,
      calculationType: 'fixed_per_article',
      fixedAmount: 200000,
      unit: 'VND',
      conditions: { minWords: 500, quality: ['published'] },
      active: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'c2',
      name: 'Lương cố định - Biên tập viên chính',
      description: 'Lương hàng tháng cho BTV chính thức',
      scope: 'group',
      assignedTo: ['g1'],
      assignedNames: ['Biên tập viên chính'],
      priority: 5,
      calculationType: 'fixed_monthly',
      fixedAmount: 15000000,
      unit: 'VND',
      active: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'c3',
      name: 'Nhuận bút bậc thang - Video Creator',
      description: 'Tăng dần theo lượt xem',
      scope: 'group',
      assignedTo: ['g4'],
      assignedNames: ['Video Creator'],
      priority: 5,
      calculationType: 'tiered_views',
      tiers: [
        { min: 0, max: 10000, rate: 50 },
        { min: 10001, max: 50000, rate: 75 },
        { min: 50001, max: 100000, rate: 100 },
        { min: 100001, max: 999999999, rate: 150 }
      ],
      unit: 'VND',
      active: true,
      createdAt: '2024-01-20'
    },
    {
      id: 'c4',
      name: 'Công thức kết hợp - Nguyễn Văn A (VIP)',
      description: 'Tùy chỉnh riêng cho tác giả xuất sắc',
      scope: 'user',
      assignedTo: ['1'],
      assignedNames: ['Nguyễn Văn A'],
      priority: 10,
      calculationType: 'hybrid',
      hybridComponents: {
        articleBase: 500000,
        viewRate: 200,
        wordRate: 100,
        qualityBonus: 300000
      },
      unit: 'VND',
      limits: { maxPerMonth: 20000000 },
      active: true,
      createdAt: '2024-02-01'
    },
    {
      id: 'c5',
      name: 'Phần trăm doanh thu - Cộng tác viên',
      description: '15% doanh thu quảng cáo từ bài viết',
      scope: 'group',
      assignedTo: ['g2'],
      assignedNames: ['Cộng tác viên'],
      priority: 5,
      calculationType: 'percentage_revenue',
      percentageRate: 15,
      unit: 'VND',
      conditions: { minViews: 5000 },
      active: true,
      createdAt: '2024-01-25'
    },
    {
      id: 'c6',
      name: 'Thưởng bậc thang - Intern',
      description: 'Theo số từ viết được',
      scope: 'group',
      assignedTo: ['g5'],
      assignedNames: ['Intern'],
      priority: 5,
      calculationType: 'tiered_words',
      tiers: [
        { min: 0, max: 500, rate: 50 },
        { min: 501, max: 1000, rate: 80 },
        { min: 1001, max: 2000, rate: 100 },
        { min: 2001, max: 999999, rate: 120 }
      ],
      unit: 'VND',
      active: true,
      createdAt: '2024-01-18'
    }
  ]);

  // Mock authors with group memberships
  const [authors, setAuthors] = useState<AuthorRoyalty[]>([
    {
      authorId: '1',
      authorName: 'Nguyễn Văn A',
      authorEmail: 'nguyenvana@example.com',
      groupIds: ['g1'],
      groupNames: ['Biên tập viên chính'],
      activeConfigs: [
        { configId: 'c4', configName: 'Công thức kết hợp - VIP', scope: 'user', priority: 10 },
        { configId: 'c2', configName: 'Lương cố định - BTV', scope: 'group', priority: 5 },
        { configId: 'c1', configName: 'Nhuận bút cơ bản', scope: 'global', priority: 1 }
      ],
      articles: { total: 45, published: 42, draft: 3 },
      views: { total: 125000, thisMonth: 15000, lastMonth: 12000 },
      royalty: {
        total: 28500000,
        thisMonth: 18500000, // Higher due to user-specific config
        lastMonth: 16200000,
        pending: 1500000,
        paid: 27000000
      },
      breakdown: { fixed: 15000000, perArticle: 2000000, perView: 500000, tiered: 800000, bonus: 200000 }
    },
    {
      authorId: '2',
      authorName: 'Trần Thị B',
      authorEmail: 'tranthib@example.com',
      groupIds: ['g2'],
      groupNames: ['Cộng tác viên'],
      activeConfigs: [
        { configId: 'c5', configName: 'Phần trăm doanh thu', scope: 'group', priority: 5 },
        { configId: 'c1', configName: 'Nhuận bút cơ bản', scope: 'global', priority: 1 }
      ],
      articles: { total: 32, published: 30, draft: 2 },
      views: { total: 98000, thisMonth: 11000, lastMonth: 9500 },
      royalty: {
        total: 12800000,
        thisMonth: 3200000, // Percentage-based
        lastMonth: 2900000,
        pending: 400000,
        paid: 12400000
      },
      breakdown: { fixed: 0, perArticle: 1200000, perView: 0, tiered: 0, bonus: 2000000 }
    },
    {
      authorId: '3',
      authorName: 'Lê Văn C',
      authorEmail: 'levanc@example.com',
      groupIds: ['g4'],
      groupNames: ['Video Creator'],
      activeConfigs: [
        { configId: 'c3', configName: 'Nhuận bút bậc thang', scope: 'group', priority: 5 },
        { configId: 'c1', configName: 'Nhuận bút cơ bản', scope: 'global', priority: 1 }
      ],
      articles: { total: 18, published: 16, draft: 2 },
      views: { total: 156000, thisMonth: 28000, lastMonth: 25000 },
      royalty: {
        total: 15600000,
        thisMonth: 4200000, // Tiered views
        lastMonth: 3750000,
        pending: 600000,
        paid: 15000000
      },
      breakdown: { fixed: 0, perArticle: 800000, perView: 0, tiered: 3400000, bonus: 0 }
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getCalculationTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'fixed_per_article': '💰 Cố định/bài',
      'fixed_per_view': '👁️ Cố định/view',
      'tiered_views': '📊 Bậc thang theo view',
      'tiered_words': '📝 Bậc thang theo từ',
      'percentage_revenue': '📈 % Doanh thu',
      'formula_based': '🧮 Công thức',
      'fixed_monthly': '💼 Lương tháng',
      'hybrid': '⚡ Kết hợp'
    };
    return labels[type] || type;
  };

  const getScopeColor = (scope: 'global' | 'group' | 'user') => {
    return scope === 'global' ? 'blue' : scope === 'group' ? 'green' : 'purple';
  };

  const getScopeIcon = (scope: 'global' | 'group' | 'user') => {
    return scope === 'global' ? Globe : scope === 'group' ? Users : User;
  };

  const calculateTieredAmount = (value: number, tiers: RoyaltyTier[]) => {
    let total = 0;
    for (const tier of tiers) {
      if (value >= tier.min) {
        const applicable = Math.min(value, tier.max) - tier.min;
        total += applicable * tier.rate;
      }
    }
    return total;
  };

  const simulateRoyalty = (author: AuthorRoyalty, article: { views: number; words: number; type: string; quality: string }) => {
    // Get applicable configs sorted by priority (highest first)
    const applicableConfigs = configs
      .filter(c => {
        if (!c.active) return false;
        if (c.scope === 'global') return true;
        if (c.scope === 'group') return author.groupIds.some(gId => c.assignedTo?.includes(gId));
        if (c.scope === 'user') return c.assignedTo?.includes(author.authorId);
        return false;
      })
      .sort((a, b) => b.priority - a.priority);

    let breakdown = {
      configs: [] as any[],
      total: 0
    };

    // Apply highest priority config per calculation type
    const appliedTypes = new Set();

    for (const config of applicableConfigs) {
      if (appliedTypes.has(config.calculationType)) continue;
      appliedTypes.add(config.calculationType);

      let amount = 0;
      let details = '';

      switch (config.calculationType) {
        case 'fixed_per_article':
          amount = config.fixedAmount || 0;
          details = `${formatCurrency(amount)} cố định`;
          break;
        case 'fixed_per_view':
          amount = article.views * (config.fixedAmount || 0);
          details = `${article.views} views × ${formatCurrency(config.fixedAmount || 0)}`;
          break;
        case 'tiered_views':
          if (config.tiers) {
            amount = calculateTieredAmount(article.views, config.tiers);
            details = `${article.views} views (bậc thang)`;
          }
          break;
        case 'tiered_words':
          if (config.tiers) {
            amount = calculateTieredAmount(article.words, config.tiers);
            details = `${article.words} từ (bậc thang)`;
          }
          break;
        case 'percentage_revenue':
          const estimatedRevenue = article.views * 500; // Mock: 500 VND per view
          amount = estimatedRevenue * ((config.percentageRate || 0) / 100);
          details = `${config.percentageRate}% × ${formatCurrency(estimatedRevenue)}`;
          break;
        case 'hybrid':
          if (config.hybridComponents) {
            const base = config.hybridComponents.articleBase || 0;
            const viewBonus = article.views * (config.hybridComponents.viewRate || 0);
            const wordBonus = article.words * (config.hybridComponents.wordRate || 0);
            const qualityBonus = article.quality === 'featured' ? (config.hybridComponents.qualityBonus || 0) : 0;
            amount = base + viewBonus + wordBonus + qualityBonus;
            details = `Base: ${formatCurrency(base)} + Views: ${formatCurrency(viewBonus)} + Words: ${formatCurrency(wordBonus)} + Quality: ${formatCurrency(qualityBonus)}`;
          }
          break;
        case 'fixed_monthly':
          amount = config.fixedAmount || 0;
          details = `${formatCurrency(amount)} lương tháng (không tính theo bài)`;
          break;
      }

      // Apply limits
      if (config.limits?.maxPerArticle && amount > config.limits.maxPerArticle) {
        amount = config.limits.maxPerArticle;
        details += ` (giới hạn ${formatCurrency(config.limits.maxPerArticle)}/bài)`;
      }

      breakdown.configs.push({
        configName: config.name,
        scope: config.scope,
        type: config.calculationType,
        amount,
        details
      });

      breakdown.total += amount;
    }

    return breakdown;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
                Quản Lý Nhuận Bút Nâng Cao
              </h1>
              <p className="text-slate-600 mt-1">Hệ thống tính toán linh hoạt với cấu hình theo người dùng/nhóm</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSimulator(true)}
                className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30"
              >
                <Calculator className="w-4 h-4" />
                Mô phỏng
              </button>
              <button
                onClick={() => setShowConfigModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                Cấu hình mới
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'configs', label: 'Cấu hình', icon: Settings },
              { id: 'groups', label: 'Nhóm người dùng', icon: Users },
              { id: 'authors', label: 'Tác giả', icon: User },
              { id: 'simulator', label: 'Mô phỏng', icon: Calculator },
              { id: 'transactions', label: 'Giao dịch', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats showing config distribution */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{configs.filter(c => c.scope === 'global').length}</div>
                <div className="text-sm text-slate-600 mt-1">Cấu hình toàn cục</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{configs.filter(c => c.scope === 'group').length}</div>
                <div className="text-sm text-slate-600 mt-1">Cấu hình theo nhóm</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{configs.filter(c => c.scope === 'user').length}</div>
                <div className="text-sm text-slate-600 mt-1">Cấu hình cá nhân</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Layers className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">8</div>
                <div className="text-sm text-slate-600 mt-1">Loại tính toán</div>
              </div>
            </div>

            {/* Calculation Types Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Các Loại Tính Toán
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { type: 'fixed_per_article', desc: 'Số tiền cố định cho mỗi bài viết', example: '200,000 VND/bài' },
                  { type: 'fixed_per_view', desc: 'Số tiền cố định cho mỗi lượt xem', example: '50 VND/view' },
                  { type: 'tiered_views', desc: 'Tăng dần theo bậc lượt xem', example: '0-10k: 50đ, 10k-50k: 75đ' },
                  { type: 'tiered_words', desc: 'Tăng dần theo số từ viết', example: '0-500: 50đ, 500-1k: 80đ' },
                  { type: 'percentage_revenue', desc: 'Phần trăm doanh thu quảng cáo', example: '15% revenue' },
                  { type: 'formula_based', desc: 'Công thức tùy chỉnh phức tạp', example: 'Base + Views×rate + Words×rate' },
                  { type: 'fixed_monthly', desc: 'Lương cố định hàng tháng', example: '15,000,000 VND/tháng' },
                  { type: 'hybrid', desc: 'Kết hợp nhiều kiểu tính', example: 'Base + View bonus + Quality bonus' }
                ].map((item) => (
                  <div key={item.type} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="font-semibold text-slate-900 mb-1">{getCalculationTypeLabel(item.type)}</div>
                    <div className="text-sm text-slate-600 mb-2">{item.desc}</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                      VD: {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority System Explanation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 text-white rounded-xl">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Hệ Thống Ưu Tiên (Priority Override)</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>• <strong>User-specific config (Priority 10)</strong> → Cấu hình riêng cho người dùng - Ưu tiên cao nhất</p>
                    <p>• <strong>Group-specific config (Priority 5)</strong> → Cấu hình theo nhóm - Ưu tiên trung bình</p>
                    <p>• <strong>Global config (Priority 1)</strong> → Cấu hình mặc định - Ưu tiên thấp nhất</p>
                    <p className="text-blue-700 font-medium mt-3">
                      ℹ️ Nếu người dùng có nhiều config, hệ thống sẽ áp dụng config có priority cao nhất cho mỗi loại tính toán.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configs Tab */}
        {activeTab === 'configs' && (
          <div className="space-y-6">
            {/* Filter by scope */}
            <div className="flex gap-3">
              {(['global', 'group', 'user'] as const).map((scope) => {
                const Icon = getScopeIcon(scope);
                const color = getScopeColor(scope);
                const count = configs.filter(c => c.scope === scope).length;
                return (
                  <button
                    key={scope}
                    onClick={() => setSelectedScope(scope)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      selectedScope === scope
                        ? `bg-${color}-500 text-white shadow-lg`
                        : `bg-white text-${color}-600 border border-${color}-200 hover:bg-${color}-50`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {scope === 'global' ? 'Toàn cục' : scope === 'group' ? 'Theo nhóm' : 'Cá nhân'} ({count})
                  </button>
                );
              })}
            </div>

            {/* Configs List */}
            <div className="space-y-4">
              {configs
                .filter(c => selectedScope === 'global' || c.scope === selectedScope)
                .map((config) => {
                  const ScopeIcon = getScopeIcon(config.scope);
                  const scopeColor = getScopeColor(config.scope);
                  
                  return (
                    <div key={config.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{config.name}</h3>
                            <span className={`px-3 py-1 bg-${scopeColor}-100 text-${scopeColor}-700 rounded-full text-xs font-medium flex items-center gap-1`}>
                              <ScopeIcon className="w-3 h-3" />
                              {config.scope === 'global' ? 'Toàn cục' : config.scope === 'group' ? 'Nhóm' : 'Cá nhân'}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                              Priority: {config.priority}
                            </span>
                            {config.active ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          {config.description && (
                            <p className="text-sm text-slate-600 mb-3">{config.description}</p>
                          )}
                          
                          {/* Assigned to */}
                          {(config.scope === 'group' || config.scope === 'user') && config.assignedNames && (
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-600">
                                Áp dụng cho: <strong>{config.assignedNames.join(', ')}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingConfig(config);
                              setShowConfigModal(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </div>

                      {/* Config Details */}
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Kiểu tính toán</div>
                          <div className="font-semibold text-slate-900">{getCalculationTypeLabel(config.calculationType)}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Chi tiết</div>
                          {config.calculationType === 'fixed_per_article' && (
                            <div className="font-semibold text-green-600">{formatCurrency(config.fixedAmount || 0)}/bài</div>
                          )}
                          {config.calculationType === 'fixed_per_view' && (
                            <div className="font-semibold text-green-600">{formatCurrency(config.fixedAmount || 0)}/view</div>
                          )}
                          {config.calculationType === 'fixed_monthly' && (
                            <div className="font-semibold text-green-600">{formatCurrency(config.fixedAmount || 0)}/tháng</div>
                          )}
                          {config.calculationType === 'percentage_revenue' && (
                            <div className="font-semibold text-green-600">{config.percentageRate}% doanh thu</div>
                          )}
                          {(config.calculationType === 'tiered_views' || config.calculationType === 'tiered_words') && config.tiers && (
                            <div className="text-sm">
                              {config.tiers.length} bậc thang
                            </div>
                          )}
                          {config.calculationType === 'hybrid' && (
                            <div className="text-sm">Kết hợp {Object.keys(config.hybridComponents || {}).length} yếu tố</div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-slate-500 mb-1">Giới hạn</div>
                          {config.limits?.maxPerArticle && (
                            <div className="text-sm text-orange-600">Max {formatCurrency(config.limits.maxPerArticle)}/bài</div>
                          )}
                          {config.limits?.maxPerMonth && (
                            <div className="text-sm text-orange-600">Max {formatCurrency(config.limits.maxPerMonth)}/tháng</div>
                          )}
                          {!config.limits && (
                            <div className="text-sm text-slate-400">Không giới hạn</div>
                          )}
                        </div>
                      </div>

                      {/* Tiers Detail */}
                      {config.tiers && config.tiers.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs font-semibold text-slate-700 mb-2">Bậc thang chi tiết:</div>
                          <div className="grid md:grid-cols-4 gap-2">
                            {config.tiers.map((tier, idx) => (
                              <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-xs text-blue-600 mb-1">Bậc {idx + 1}</div>
                                <div className="text-sm font-semibold text-slate-900">
                                  {tier.min.toLocaleString()} - {tier.max === 999999999 ? '∞' : tier.max.toLocaleString()}
                                </div>
                                <div className="text-xs text-green-600 font-medium mt-1">
                                  {formatCurrency(tier.rate)}/{config.calculationType === 'tiered_views' ? 'view' : 'từ'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hybrid Components */}
                      {config.hybridComponents && (
                        <div className="mt-4">
                          <div className="text-xs font-semibold text-slate-700 mb-2">Công thức kết hợp:</div>
                          <div className="flex items-center gap-2 flex-wrap text-sm">
                            {config.hybridComponents.articleBase && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                Base: {formatCurrency(config.hybridComponents.articleBase)}
                              </span>
                            )}
                            {config.hybridComponents.viewRate && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                + Views × {formatCurrency(config.hybridComponents.viewRate)}
                              </span>
                            )}
                            {config.hybridComponents.wordRate && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                                + Words × {formatCurrency(config.hybridComponents.wordRate)}
                              </span>
                            )}
                            {config.hybridComponents.qualityBonus && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                                + Quality: {formatCurrency(config.hybridComponents.qualityBonus)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group) => {
                const groupConfigs = configs.filter(c => c.assignedTo?.includes(group.id));
                return (
                  <div key={group.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: group.color }}
                        >
                          {group.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{group.name}</h3>
                          <p className="text-xs text-slate-600">{group.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Thành viên</span>
                        <span className="font-semibold text-slate-900">{group.memberCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-700">Cấu hình riêng</span>
                        <span className="font-semibold text-blue-900">{groupConfigs.length}</span>
                      </div>
                    </div>

                    {groupConfigs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="text-xs font-semibold text-slate-700 mb-2">Các cấu hình:</div>
                        <div className="space-y-1">
                          {groupConfigs.map(config => (
                            <div key={config.id} className="text-xs text-slate-600 flex items-center gap-2">
                              <ChevronRight className="w-3 h-3" />
                              {config.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button className="w-full mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                      Quản lý nhóm
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Authors Tab - Enhanced with config info */}
        {activeTab === 'authors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200/60">
              <input
                type="text"
                placeholder="Tìm kiếm tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {authors
              .filter(a => a.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((author) => (
                <div key={author.authorId} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {author.authorName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{author.authorName}</h3>
                        <p className="text-sm text-slate-600">{author.authorEmail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {author.groupNames.map((groupName, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {groupName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Configs */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      Cấu hình đang áp dụng (theo thứ tự ưu tiên):
                    </div>
                    <div className="space-y-1">
                      {author.activeConfigs.map((ac, idx) => {
                        const ScopeIcon = getScopeIcon(ac.scope);
                        const scopeColor = getScopeColor(ac.scope);
                        return (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500">{idx + 1}.</span>
                            <ScopeIcon className={`w-3 h-3 text-${scopeColor}-600`} />
                            <span className={`px-2 py-0.5 bg-${scopeColor}-100 text-${scopeColor}-700 rounded text-xs font-medium`}>
                              Priority {ac.priority}
                            </span>
                            <span className="text-slate-700">{ac.configName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Bài viết</div>
                      <div className="text-2xl font-bold text-slate-900">{author.articles.published}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Lượt xem</div>
                      <div className="text-2xl font-bold text-slate-900">{author.views.thisMonth.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Nhuận bút tháng</div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(author.royalty.thisMonth)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Đang chờ</div>
                      <div className="text-2xl font-bold text-orange-600">{formatCurrency(author.royalty.pending)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Đã thanh toán</div>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(author.royalty.paid)}</div>
                    </div>
                  </div>

                  {/* Breakdown by type */}
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm font-semibold text-slate-700 mb-3">Chi tiết nhuận bút tháng này:</div>
                    <div className="grid md:grid-cols-5 gap-3">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">💼 Cố định</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(author.breakdown.fixed)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">📝 Theo bài</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(author.breakdown.perArticle)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">👁️ Theo view</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(author.breakdown.perView)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">📊 Bậc thang</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(author.breakdown.tiered)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">🎁 Thưởng</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(author.breakdown.bonus)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                Mô Phỏng Tính Nhuận Bút
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Chọn tác giả</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                      {authors.map(a => (
                        <option key={a.authorId} value={a.authorId}>{a.authorName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Lượt xem</label>
                      <input
                        type="number"
                        defaultValue="15000"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Số từ</label>
                      <input
                        type="number"
                        defaultValue="1200"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Loại bài viết</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                      <option value="news">Tin tức</option>
                      <option value="video">Video</option>
                      <option value="gallery">Gallery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Chất lượng</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                      <option value="published">Đã xuất bản</option>
                      <option value="featured">Nổi bật</option>
                    </select>
                  </div>

                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
                    <Calculator className="w-4 h-4 inline mr-2" />
                    Tính toán
                  </button>
                </div>

                {/* Result */}
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="text-sm text-green-700 mb-1">Tổng nhuận bút dự kiến</div>
                    <div className="text-4xl font-bold text-green-600">{formatCurrency(5650000)}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-700">Chi tiết tính toán:</div>
                    {[
                      { name: 'Base amount (Hybrid config)', amount: 500000, details: 'Cố định' },
                      { name: 'View bonus', amount: 3000000, details: '15,000 views × 200 VND' },
                      { name: 'Word bonus', amount: 120000, details: '1,200 từ × 100 VND' },
                      { name: 'Quality bonus (Featured)', amount: 300000, details: 'Bài nổi bật' },
                      { name: 'Monthly salary', amount: 15000000, details: 'Lương cố định (không tính vào bài)' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.details}</div>
                        </div>
                        <div className="text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingConfig ? 'Chỉnh sửa cấu hình' : 'Tạo cấu hình nhuận bút mới'}
              </h3>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setEditingConfig(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên cấu hình *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Nhuận bút tin tức cao cấp"
                    defaultValue={editingConfig?.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                  <textarea
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Mô tả chi tiết về cấu hình này..."
                    defaultValue={editingConfig?.description}
                  />
                </div>
              </div>

              {/* Scope Selection */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <label className="block text-sm font-semibold text-slate-900">Phạm vi áp dụng *</label>
                
                <div className="grid md:grid-cols-3 gap-3">
                  {(['global', 'group', 'user'] as const).map((scope) => {
                    const Icon = getScopeIcon(scope);
                    const color = getScopeColor(scope);
                    return (
                      <button
                        key={scope}
                        onClick={() => setSelectedScope(scope)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedScope === scope
                            ? `border-${color}-500 bg-${color}-50`
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${selectedScope === scope ? `text-${color}-600` : 'text-slate-400'}`} />
                        <div className={`text-sm font-semibold ${selectedScope === scope ? `text-${color}-700` : 'text-slate-600'}`}>
                          {scope === 'global' ? 'Toàn cục' : scope === 'group' ? 'Theo nhóm' : 'Cá nhân'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {scope === 'global' ? 'Tất cả người dùng' : scope === 'group' ? 'Chọn nhóm' : 'Chọn user'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Group/User Selection */}
                {selectedScope === 'group' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Chọn nhóm người dùng</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-white rounded-lg border border-slate-200">
                      {userGroups.map(group => (
                        <label key={group.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedGroups.includes(group.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGroups([...selectedGroups, group.id]);
                              } else {
                                setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                              }
                            }}
                          />
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: group.color }}
                          >
                            {group.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900">{group.name}</div>
                            <div className="text-xs text-slate-500">{group.memberCount} thành viên</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {selectedScope === 'user' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Chọn người dùng</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-white rounded-lg border border-slate-200">
                      {authors.map(author => (
                        <label key={author.authorId} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedUsers.includes(author.authorId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, author.authorId]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== author.authorId));
                              }
                            }}
                          />
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {author.authorName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900">{author.authorName}</div>
                            <div className="text-xs text-slate-500">{author.authorEmail}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Độ ưu tiên (1-10, cao hơn = ghi đè thấp hơn)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={selectedScope === 'user' ? 10 : selectedScope === 'group' ? 5 : 1}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Calculation Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kiểu tính toán *</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="fixed_per_article">💰 Cố định theo bài viết</option>
                  <option value="fixed_per_view">👁️ Cố định theo lượt xem</option>
                  <option value="tiered_views">📊 Bậc thang theo lượt xem</option>
                  <option value="tiered_words">📝 Bậc thang theo số từ</option>
                  <option value="percentage_revenue">📈 Phần trăm doanh thu</option>
                  <option value="formula_based">🧮 Công thức tùy chỉnh</option>
                  <option value="fixed_monthly">💼 Lương cố định tháng</option>
                  <option value="hybrid">⚡ Kết hợp nhiều kiểu</option>
                </select>
              </div>

              {/* Amount/Rate Config (simplified - would expand based on calculation type) */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền / Tỷ lệ</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="200000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Đơn vị</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              {/* Limits */}
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <label className="block text-sm font-semibold text-orange-900 mb-3">Giới hạn (tùy chọn)</label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-orange-700 mb-1">Max/bài</label>
                    <input
                      type="number"
                      placeholder="1000000"
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-orange-700 mb-1">Max/tháng</label>
                    <input
                      type="number"
                      placeholder="20000000"
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-orange-700 mb-1">Max/năm</label>
                    <input
                      type="number"
                      placeholder="200000000"
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <input type="checkbox" className="rounded w-5 h-5" defaultChecked />
                <div>
                  <div className="text-sm font-semibold text-green-900">Kích hoạt ngay</div>
                  <div className="text-xs text-green-700">Cấu hình sẽ có hiệu lực ngay lập tức</div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setEditingConfig(null);
                }}
                className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Save logic
                  setShowConfigModal(false);
                  setEditingConfig(null);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                {editingConfig ? 'Cập nhật' : 'Tạo cấu hình'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
