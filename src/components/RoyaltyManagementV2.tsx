import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Users, FileText, Calendar, Download,
  Settings, Plus, Edit, Trash2, Eye, Filter, Search, ChevronDown,
  Award, BarChart3, PieChart, Clock, CheckCircle, AlertCircle, X,
  User, UserCheck, Globe, Copy, Calculator, Percent, Layers, Target,
  TrendingDown, Zap, ChevronRight, Info, HelpCircle, Sparkles, 
  BookOpen, PlayCircle, ArrowRight, ArrowLeft, Check, Lightbulb,
  Rocket, Box, Wand2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ConfigDetailModal,
  EditConfigModal,
  DeleteConfirmModal,
  CloneConfigModal,
  TemplatePreviewModal
} from './RoyaltyModals';
import { useToast, Toast } from './Toast';

// Types
interface RoyaltyTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scope: 'global' | 'group' | 'user';
  calculationType: string;
  presetValues: any;
  examples: string[];
  useCases: string[];
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: any;
}

export function RoyaltyManagementV2() {
  const { t } = useLanguage();
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'create' | 'calculator' | 'help'>('overview');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState<any>(null);
  const [showConfigDetail, setShowConfigDetail] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [showCloneModal, setShowCloneModal] = useState<any>(null);
  const [configFilter, setConfigFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority-desc');
  const [templateFilter, setTemplateFilter] = useState('Tất cả');
  const [isCreating, setIsCreating] = useState(false);
  
  // Calculator state
  const [calcData, setCalcData] = useState({
    views: 15000,
    words: 1200,
    quality: 'published',
    revenue: 5000000,
    calculationType: 'fixed_per_article'
  });

  // Wizard state
  const [wizardData, setWizardData] = useState({
    name: '',
    scope: 'global' as 'global' | 'group' | 'user',
    calculationType: '',
    amount: 0,
    baseAmount: 500000,
    viewRate: 200,
    wordRate: 100,
    qualityBonus: 1000000,
    revenuePercentage: 15,
    selectedGroup: null as string | null,
    selectedUser: null as string | null,
    // Specific values for each calculation type
    fixedAmount: 200000,
    monthlyAmount: 15000000
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validate wizard data
  const validateWizardData = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 2) {
      if (wizardData.scope === 'group' && !wizardData.selectedGroup) {
        errors.selectedGroup = 'Vui lòng chọn nhóm người dùng';
      }
      if (wizardData.scope === 'user' && !wizardData.selectedUser) {
        errors.selectedUser = 'Vui lòng chọn người dùng cụ thể';
      }
    }

    if (step === 3) {
      if (!wizardData.calculationType) {
        errors.calculationType = 'Vui lòng chọn kiểu tính toán';
      }

      // Validate amounts based on calculation type
      if (wizardData.calculationType === 'fixed_per_article') {
        if (wizardData.fixedAmount <= 0) {
          errors.fixedAmount = 'Số tiền phải lớn hơn 0';
        }
      }
      if (wizardData.calculationType === 'fixed_monthly') {
        if (wizardData.monthlyAmount <= 0) {
          errors.monthlyAmount = 'Lương tháng phải lớn hơn 0';
        }
      }
      if (wizardData.calculationType === 'tiered_views') {
        if (wizardData.viewRate <= 0) {
          errors.viewRate = 'Đơn giá view phải lớn hơn 0';
        }
      }
      if (wizardData.calculationType === 'percentage_revenue') {
        if (wizardData.revenuePercentage <= 0 || wizardData.revenuePercentage > 100) {
          errors.revenuePercentage = 'Phần trăm phải từ 1-100';
        }
      }
      if (wizardData.calculationType === 'hybrid') {
        if (wizardData.baseAmount < 0) {
          errors.baseAmount = 'Nhuận bút cơ bản không được âm';
        }
        if (wizardData.viewRate < 0) {
          errors.viewRate = 'Đơn giá view không được âm';
        }
        if (wizardData.wordRate < 0) {
          errors.wordRate = 'Đơn giá từ không được âm';
        }
        if (wizardData.qualityBonus < 0) {
          errors.qualityBonus = 'Thưởng chất lượng không được âm';
        }
      }
    }

    if (step === 4) {
      if (!wizardData.name.trim()) {
        errors.name = 'Vui lòng nhập tên cấu hình';
      } else if (wizardData.name.trim().length < 3) {
        errors.name = 'Tên cấu hình phải có ít nhất 3 ký tự';
      } else if (wizardData.name.trim().length > 100) {
        errors.name = 'Tên cấu hình không được quá 100 ký tự';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const wizardSteps: WizardStep[] = [
    { id: 1, title: 'Chọn mẫu', description: 'Bắt đầu với template có sẵn', icon: Box },
    { id: 2, title: 'Phạm vi', description: 'Ai được áp dụng?', icon: Target },
    { id: 3, title: 'Tính toán', description: 'Cách tính nhuận bút', icon: Calculator },
    { id: 4, title: 'Xem trước', description: 'Kiểm tra & xác nhận', icon: Eye }
  ];

  // Helper functions to get names
  const getGroupName = (groupId: string | null) => {
    if (!groupId) return '(Chưa chọn)';
    const groups: Record<string, string> = {
      editors: 'Biên tập viên chính thức',
      contributors: 'Cộng tác viên',
      freelancers: 'Freelancers',
      interns: 'Thực tập sinh',
      senior_writers: 'Tác giả senior',
      junior_writers: 'Tác giả junior'
    };
    return groups[groupId] || groupId;
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return '(Chưa chọn)';
    const users: Record<string, string> = {
      user_1: 'Nguyễn Văn A',
      user_2: 'Trần Thị B',
      user_3: 'Lê Văn C',
      user_4: 'Phạm Thị D',
      user_5: 'Hoàng Văn E',
      user_6: 'Đặng Thị F'
    };
    return users[userId] || userId;
  };

  const resetWizard = () => {
    setWizardStep(1);
    setSelectedTemplate(null);
    setValidationErrors({});
    setWizardData({
      name: '',
      scope: 'global',
      calculationType: '',
      amount: 0,
      baseAmount: 500000,
      viewRate: 200,
      wordRate: 100,
      qualityBonus: 1000000,
      revenuePercentage: 15,
      selectedGroup: null,
      selectedUser: null,
      fixedAmount: 200000,
      monthlyAmount: 15000000
    });
  };

  // Templates Library - Synced với royalty types thật
  const templates: RoyaltyTemplate[] = [
    {
      id: 'news-tiered',
      name: '📰 Tin tức - Theo từ (Tiered)',
      description: 'Trả theo số từ với 4 mức tăng dần, phù hợp cho tin tức',
      icon: '📝',
      difficulty: 'intermediate',
      scope: 'global',
      calculationType: 'tiered_words',
      presetValues: { 
        tiers: [
          { min: 0, max: 500, rate: 500 },
          { min: 501, max: 1000, rate: 600 },
          { min: 1001, max: 2000, rate: 700 },
          { min: 2001, max: 999999, rate: 800 }
        ],
        viewBonus: 50
      },
      examples: ['500 từ = 250k', '1500 từ = 950k', '2500 từ = 2M'],
      useCases: ['Bài tin tức', 'Bài phân tích', 'Long-form content']
    },
    {
      id: 'video-hybrid',
      name: '🎥 Video - Hybrid Formula',
      description: 'Base + Duration + Views - công thức toàn diện cho video',
      icon: '🎬',
      difficulty: 'intermediate',
      scope: 'global',
      calculationType: 'hybrid',
      presetValues: { 
        base: 50000,
        durationBonus: 5000,
        viewRate: 100
      },
      examples: ['5 phút + 10k views = 1.075M', '30 phút + 25k views = 2.7M'],
      useCases: ['Video tutorial', 'Review sản phẩm', 'Workshop recording']
    },
    {
      id: 'gallery-simple',
      name: '🖼️ Gallery - Theo ảnh',
      description: 'Trả theo số ảnh + bonus views, phù hợp cho photographer',
      icon: '📸',
      difficulty: 'beginner',
      scope: 'global',
      calculationType: 'fixed_per_article',
      presetValues: {
        imageRate: 20000,
        viewBonus: 30
      },
      examples: ['30 ảnh = 600k', '50 ảnh + 10k views = 1.3M'],
      useCases: ['Photo gallery', 'Event coverage', 'Portfolio showcase']
    },
    {
      id: 'podcast-base',
      name: '🎙️ Podcast - Base + Listens',
      description: 'Base rate cao + bonus theo số lượt nghe',
      icon: '🎧',
      difficulty: 'beginner',
      scope: 'global',
      calculationType: 'fixed_per_article',
      presetValues: {
        base: 80000,
        listenBonus: 80
      },
      examples: ['Base 80k + 5k listens = 480k', '10k listens = 880k'],
      useCases: ['Podcast episode', 'Audio content', 'Interview']
    },
    {
      id: 'infographic-premium',
      name: '📊 Infographic - Premium',
      description: 'Rate cao nhất cho infographic chất lượng',
      icon: '🎨',
      difficulty: 'intermediate',
      scope: 'global',
      calculationType: 'fixed_per_article',
      presetValues: {
        base: 150000,
        viewBonus: 120
      },
      examples: ['Base 150k + 15k views = 1.95M', '30k views = 3.75M'],
      useCases: ['Data visualization', 'Infographic design', 'Chart & graphs']
    },
    {
      id: 'vip-percentage',
      name: '⭐ VIP - Custom Percentage',
      description: 'Hệ số % tùy chỉnh cho tác giả xuất sắc',
      icon: '🏆',
      difficulty: 'advanced',
      scope: 'user',
      calculationType: 'percentage_revenue',
      presetValues: {
        percentage: 120
      },
      examples: ['120% của rate chuẩn', '110% boost'],
      useCases: ['Top performer', 'Star creator', 'Premium author']
    }
  ];

  // Mock configs data - Synced with /utils/royaltyCalculations.ts
  const mockConfigs = [
    {
      id: 1,
      name: '📰 Tin tức - Theo từ (Tiered)',
      type: 'Theo số từ (Tiered)',
      amount: '500-800đ/từ',
      scope: 'global',
      appliedTo: 'Loại: News',
      priority: 8,
      active: true,
      stats: { users: 5, thisMonth: '15,000,000đ' },
      detail: 'Tiers: 0-500 từ (500đ), 501-1000 từ (600đ), 1001-2000 từ (700đ), 2000+ từ (800đ) + Bonus 50đ/view'
    },
    {
      id: 2,
      name: '🎥 Video - Base + Duration + Views',
      type: 'Kết hợp (Hybrid)',
      amount: '50K base + bonus',
      scope: 'global',
      appliedTo: 'Loại: Video',
      priority: 9,
      active: true,
      stats: { users: 3, thisMonth: '12,000,000đ' },
      detail: 'Base: 50,000đ + Duration: 5,000đ/phút + Views: 100đ/view'
    },
    {
      id: 3,
      name: '🖼️ Gallery - Theo ảnh + Views',
      type: 'Theo số lượng + Bonus',
      amount: '20K/ảnh + views',
      scope: 'global',
      appliedTo: 'Loại: Gallery',
      priority: 6,
      active: true,
      stats: { users: 3, thisMonth: '4,500,000đ' },
      detail: 'Base: 20,000đ/ảnh + Views: 30đ/view'
    },
    {
      id: 4,
      name: '🎙️ Podcast - Base + Listens',
      type: 'Cố định + Bonus',
      amount: '80K base + listens',
      scope: 'global',
      appliedTo: 'Loại: Podcast',
      priority: 7,
      active: true,
      stats: { users: 2, thisMonth: '3,200,000đ' },
      detail: 'Base: 80,000đ + Listens: 80đ/listen'
    },
    {
      id: 5,
      name: '📊 Infographic - Premium Rate',
      type: 'Cao cấp',
      amount: '150K base + views',
      scope: 'global',
      appliedTo: 'Loại: Infographic',
      priority: 10,
      active: true,
      stats: { users: 2, thisMonth: '5,000,000đ' },
      detail: 'Base: 150,000đ + Views: 120đ/view'
    },
    {
      id: 6,
      name: '📄 Document - Theo trang + Downloads',
      type: 'Theo trang + Bonus',
      amount: '1K/trang + downloads',
      scope: 'global',
      appliedTo: 'Loại: Document',
      priority: 5,
      active: true,
      stats: { users: 2, thisMonth: '1,800,000đ' },
      detail: 'Base: 1,000đ/trang + Downloads: 500đ/download'
    },
    {
      id: 7,
      name: '📅 Event - Base + Attendees',
      type: 'Cố định + Bonus',
      amount: '100K + attendees',
      scope: 'global',
      appliedTo: 'Loại: Event',
      priority: 7,
      active: true,
      stats: { users: 2, thisMonth: '2,500,000đ' },
      detail: 'Base: 100,000đ + Attendees: 1,000đ/người tham dự'
    },
    {
      id: 8,
      name: '💼 Job - Base + Applications',
      type: 'Cố định + Bonus',
      amount: '50K + applications',
      scope: 'global',
      appliedTo: 'Loại: Job',
      priority: 4,
      active: true,
      stats: { users: 2, thisMonth: '1,200,000đ' },
      detail: 'Base: 50,000đ + Applications: 2,000đ/ứng tuyển'
    },
    {
      id: 9,
      name: '👤 Person Profile - Base + Views',
      type: 'Cố định + Bonus',
      amount: '30K + views',
      scope: 'global',
      appliedTo: 'Loại: Person',
      priority: 5,
      active: true,
      stats: { users: 1, thisMonth: '800,000đ' },
      detail: 'Base: 30,000đ + Views: 40đ/view'
    },
    {
      id: 10,
      name: '📦 Download Resource - Base + Downloads',
      type: 'Cố định + Bonus',
      amount: '40K + downloads',
      scope: 'global',
      appliedTo: 'Loại: Download',
      priority: 6,
      active: true,
      stats: { users: 2, thisMonth: '1,500,000đ' },
      detail: 'Base: 40,000đ + Downloads: 800đ/download'
    },
    {
      id: 11,
      name: '⭐ VIP - Lê Văn Cường (Video Creator)',
      type: 'Tùy chỉnh cá nhân',
      amount: 'Custom 120%',
      scope: 'user',
      appliedTo: 'User: Lê Văn Cường',
      priority: 15,
      active: true,
      stats: { users: 1, thisMonth: '14,000,000đ' },
      detail: 'Hệ số nhuận bút: 120% (Premium creator)'
    },
    {
      id: 12,
      name: '⭐ VIP - Hoàng Minh Em (Podcast Host)',
      type: 'Tùy chỉnh cá nhân',
      amount: 'Custom 110%',
      scope: 'user',
      appliedTo: 'User: Hoàng Minh Em',
      priority: 12,
      active: true,
      stats: { users: 1, thisMonth: '4,500,000đ' },
      detail: 'Hệ số nhuận bút: 110%'
    }
  ];

  // Quick stats - calculated from real configs
  const quickStats = {
    totalConfigs: mockConfigs.length,
    activeConfigs: mockConfigs.filter(c => c.active).length,
    activeAuthors: 8, // From mockUsers in /utils/mockData.ts
    thisMonthTotal: mockConfigs.reduce((sum, c) => {
      const amount = c.stats.thisMonth.replace(/[,đ]/g, '');
      return sum + parseInt(amount);
    }, 0),
    totalUsers: mockConfigs.reduce((sum, c) => sum + c.stats.users, 0),
    avgPerAuthor: 0 // Will be calculated
  };
  quickStats.avgPerAuthor = Math.round(quickStats.thisMonthTotal / quickStats.activeAuthors);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getDifficultyColor = (difficulty: string) => {
    return difficulty === 'beginner' ? 'green' : difficulty === 'intermediate' ? 'blue' : 'purple';
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty === 'beginner' ? '🟢 Dễ' : difficulty === 'intermediate' ? '🔵 Trung bình' : '🟣 Nâng cao';
  };

  const startWizardWithTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Apply template preset values
      const updatedData: any = {
        ...wizardData,
        scope: template.scope,
        calculationType: template.calculationType
      };
      
      // Apply preset values based on calculation type
      if (template.calculationType === 'fixed_per_article' && template.presetValues.amount) {
        updatedData.fixedAmount = template.presetValues.amount;
      }
      if (template.calculationType === 'fixed_monthly' && template.presetValues.amount) {
        updatedData.monthlyAmount = template.presetValues.amount;
      }
      if (template.calculationType === 'percentage_revenue' && template.presetValues.percentage) {
        updatedData.revenuePercentage = template.presetValues.percentage;
      }
      if (template.calculationType === 'hybrid' && template.presetValues) {
        updatedData.baseAmount = template.presetValues.base || 500000;
        updatedData.viewRate = template.presetValues.viewRate || 200;
        updatedData.wordRate = template.presetValues.wordRate || 100;
        updatedData.qualityBonus = template.presetValues.qualityBonus || 300000;
      }
      
      setWizardData(updatedData);
    }
    setShowWizard(true);
    setWizardStep(2); // Skip template selection
  };

  // Filter templates based on difficulty
  const filteredTemplates = templates.filter(template => {
    if (templateFilter === 'Tất cả') return true;
    if (templateFilter === 'Dễ') return template.difficulty === 'beginner';
    if (templateFilter === 'Trung bình') return template.difficulty === 'intermediate';
    if (templateFilter === 'Nâng cao') return template.difficulty === 'advanced';
    return true;
  });

  // Filter configs
  const filteredConfigs = mockConfigs.filter(config => {
    if (configFilter !== 'all' && config.scope !== configFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        config.name.toLowerCase().includes(query) ||
        config.type.toLowerCase().includes(query) ||
        config.appliedTo.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Sort configs
  const sortedConfigs = [...filteredConfigs].sort((a, b) => {
    switch (sortBy) {
      case 'priority-desc':
        return b.priority - a.priority;
      case 'priority-asc':
        return a.priority - b.priority;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Calculate royalty based on type
  const calculateRoyalty = () => {
    const { views, words, quality, revenue, calculationType } = calcData;
    let result = 0;
    let breakdown = '';

    switch (calculationType) {
      case 'fixed_per_article':
        result = 200000;
        breakdown = '200,000đ cố định/bài';
        break;
      
      case 'views_based':
        const viewRate = views < 10000 ? 50 : views < 50000 ? 100 : 150;
        result = views * viewRate;
        breakdown = `${views.toLocaleString()} views × ${viewRate}đ = ${result.toLocaleString()}đ`;
        break;
      
      case 'word_count':
        const wordRate = 100;
        result = words * wordRate;
        breakdown = `${words.toLocaleString()} từ × ${wordRate}đ = ${result.toLocaleString()}đ`;
        break;
      
      case 'percentage_revenue':
        const percentage = 15;
        result = revenue * (percentage / 100);
        breakdown = `${revenue.toLocaleString()}đ × ${percentage}% = ${result.toLocaleString()}đ`;
        break;
      
      case 'hybrid':
        const base = 500000;
        const viewBonus = views * 100;
        const wordBonus = words * 50;
        const qualityBonus = quality === 'featured' ? 1000000 : 0;
        result = base + viewBonus + wordBonus + qualityBonus;
        breakdown = `Base: ${base.toLocaleString()}đ + Views: ${viewBonus.toLocaleString()}đ + Words: ${wordBonus.toLocaleString()}đ + Quality: ${qualityBonus.toLocaleString()}đ`;
        break;
      
      default:
        result = 0;
    }

    return { total: result, breakdown };
  };

  const renderCalculatorExample = () => {
    return (
      <div className="space-y-6">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Máy Tính Nhuận Bút</h3>
              <p className="text-sm text-slate-600">Thử nghiệm các công thức tính toán</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Inputs */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-sm font-semibold text-blue-900 mb-3">Thông tin bài viết</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Số lượt xem</label>
                    <input
                      type="number"
                      value={calcData.views}
                      onChange={(e) => setCalcData({ ...calcData, views: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Số từ</label>
                    <input
                      type="number"
                      value={calcData.words}
                      onChange={(e) => setCalcData({ ...calcData, words: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Chất lượng</label>
                    <select 
                      value={calcData.quality}
                      onChange={(e) => setCalcData({ ...calcData, quality: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
                    >
                      <option value="published">✅ Xuất bản</option>
                      <option value="featured">⭐ Nổi bật</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-sm font-semibold text-green-900 mb-3">Chọn công thức</div>
                <select 
                  value={calcData.calculationType}
                  onChange={(e) => setCalcData({ ...calcData, calculationType: e.target.value })}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm"
                >
                  <option value="fixed_per_article">💰 Cơ bản - 200k/bài</option>
                  <option value="views_based">🔥 Thưởng viral - Theo views</option>
                  <option value="word_count">📝 Theo số từ - 100đ/từ</option>
                  <option value="percentage_revenue">📊 Phần trăm doanh thu - 15%</option>
                  <option value="hybrid">⭐ Kết hợp - Base + Bonus</option>
                </select>
              </div>

              {calcData.calculationType === 'percentage_revenue' && (
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-sm font-semibold text-orange-900 mb-3">Doanh thu bài viết</div>
                  <input
                    type="number"
                    value={calcData.revenue}
                    onChange={(e) => setCalcData({ ...calcData, revenue: parseInt(e.target.value) || 0 })}
                    placeholder="Nhập doanh thu..."
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                  />
                  <div className="text-xs text-orange-600 mt-1">Doanh thu quảng cáo/affiliate từ bài viết</div>
                </div>
              )}
            </div>

            {/* Right: Results */}
            <div className="space-y-4">
              {(() => {
                const result = calculateRoyalty();
                return (
                  <>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                      <div className="text-sm text-green-700 mb-2">💰 Tổng nhuận bút dự kiến</div>
                      <div className="text-4xl font-bold text-green-600 mb-4">
                        {formatCurrency(result.total)}
                      </div>
                      
                      <div className="p-3 bg-white/60 rounded-lg border border-green-200">
                        <div className="text-xs text-green-700 font-semibold mb-1">Chi tiết tính toán:</div>
                        <div className="text-sm text-green-900">{result.breakdown}</div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Comparison */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-700 mb-2">So sánh với các công thức khác:</div>
                <div className="space-y-1.5">
                  {[
                    { type: 'fixed_per_article', label: '💰 Cố định', calc: () => formatCurrency(200000) },
                    { type: 'views_based', label: '🔥 Theo views', calc: () => {
                      const viewRate = calcData.views < 10000 ? 50 : calcData.views < 50000 ? 100 : 150;
                      return formatCurrency(calcData.views * viewRate);
                    }},
                    { type: 'word_count', label: '📝 Theo từ', calc: () => formatCurrency(calcData.words * 100) },
                    { type: 'percentage_revenue', label: '📊 % doanh thu', calc: () => formatCurrency(calcData.revenue * 0.15) },
                    { type: 'hybrid', label: '⭐ Kết hợp', calc: () => {
                      const base = 500000;
                      const viewBonus = calcData.views * 100;
                      const wordBonus = calcData.words * 50;
                      const qualityBonus = calcData.quality === 'featured' ? 1000000 : 0;
                      return formatCurrency(base + viewBonus + wordBonus + qualityBonus);
                    }}
                  ].map((formula) => (
                    <div 
                      key={formula.type}
                      className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                        calcData.calculationType === formula.type 
                          ? 'bg-green-100 font-semibold' 
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <span className={calcData.calculationType === formula.type ? 'text-green-700' : 'text-slate-600'}>
                        {formula.label} {calcData.calculationType === formula.type && '(Đang chọn)'}
                      </span>
                      <span className={calcData.calculationType === formula.type ? 'font-bold text-green-900' : 'font-medium text-slate-900'}>
                        {formula.calc()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                Quản Lý Nhuận Bút
              </h1>
              <p className="text-slate-600 mt-1">Dễ dàng thiết lập và quản lý thù lao tác giả</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('help')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Hướng dẫn
              </button>
              <button
                onClick={() => {
                  setShowWizard(true);
                  setWizardStep(1);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <Sparkles className="w-4 h-4" />
                Tạo cấu hình mới
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Cấu hình đang hoạt động</div>
              <div className="text-2xl font-bold text-blue-900">{quickStats.totalConfigs}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-1">Tác giả đang nhận</div>
              <div className="text-2xl font-bold text-green-900">{quickStats.activeAuthors}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Tổng tháng này</div>
              <div className="text-2xl font-bold text-purple-900">{formatCurrency(quickStats.thisMonthTotal)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <div className="text-sm text-orange-700 mb-1">TB/tác giả</div>
              <div className="text-2xl font-bold text-orange-900">{formatCurrency(quickStats.avgPerAuthor)}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'configs', label: 'Cấu hình', icon: Settings },
              { id: 'calculator', label: 'Máy tính', icon: Calculator },
              { id: 'help', label: 'Trợ giúp', icon: BookOpen }
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
        {/* Overview - Template Gallery */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2 opacity-90">✨ Bắt đầu nhanh chóng</div>
                  <h2 className="text-3xl font-bold mb-3">Chọn mẫu phù hợp với bạn</h2>
                  <p className="text-blue-100 mb-6 text-lg">
                    Chúng tôi đã chuẩn bị sẵn các mẫu phổ biến. Chỉ cần chọn và điều chỉnh!
                  </p>
                  <button 
                    onClick={() => {
                      setShowWizard(true);
                      setWizardStep(1);
                    }}
                    className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
                  >
                    <Rocket className="w-4 h-4 inline mr-2" />
                    Bắt đầu ngay
                  </button>
                </div>
                <div className="text-8xl opacity-20">💰</div>
              </div>
            </div>

            {/* Templates Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">📚 Thư viện mẫu</h3>
                <div className="flex gap-2">
                  {['Tất cả', 'Dễ', 'Trung bình', 'Nâng cao'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTemplateFilter(filter)}
                      className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                        templateFilter === filter
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
                    onClick={() => setShowTemplatePreview(template)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{template.icon}</div>
                      <span className={`px-2 py-1 bg-${getDifficultyColor(template.difficulty)}-100 text-${getDifficultyColor(template.difficulty)}-700 rounded-full text-xs font-medium`}>
                        {getDifficultyLabel(template.difficulty)}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">{template.description}</p>

                    {/* Examples */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Ví dụ:</div>
                      <div className="space-y-1">
                        {template.examples.slice(0, 2).map((example, idx) => (
                          <div key={idx} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            ✓ {example}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Phù hợp cho:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.useCases.slice(0, 2).map((useCase, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startWizardWithTemplate(template.id);
                      }}
                      className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      Sử dụng mẫu này
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500 text-white rounded-xl">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">💡 Mẹo chọn mẫu phù hợp</h3>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>• <strong>Mới bắt đầu?</strong> Chọn mẫu "Cơ bản" - đơn giản và dễ hiểu</li>
                    <li>• <strong>Muốn khuyến khích chất lượng?</strong> Dùng "Thưởng viral" theo lượt xem</li>
                    <li>• <strong>Có đội ngũ full-time?</strong> Kết hợp "Lương cố định" + "Thưởng thêm"</li>
                    <li>• <strong>Làm việc với freelancer?</strong> "Chia sẻ doanh thu" là lựa chọn công bằng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && renderCalculatorExample()}

        {/* Configs Tab - Active Configurations Management */}
        {activeTab === 'configs' && (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Cấu hình đang hoạt động</h2>
                <p className="text-slate-600 mt-1">Quản lý tất cả các thiết lập nhuận bút</p>
              </div>
              <button
                onClick={() => {
                  setShowWizard(true);
                  setWizardStep(1);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm cấu hình
              </button>
            </div>

            {/* Search & Sort Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cấu hình theo tên, nhóm, hoặc người dùng..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="priority-desc">Sắp xếp: Priority cao → thấp</option>
                <option value="priority-asc">Sắp xếp: Priority thấp → cao</option>
                <option value="name-asc">Sắp xếp: Tên A-Z</option>
                <option value="name-desc">Sắp xếp: Tên Z-A</option>
                <option value="created-desc">Sắp xếp: Mới nhất</option>
                <option value="created-asc">Sắp xếp: Cũ nhất</option>
              </select>
              <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
                <Filter className="w-4 h-4 inline mr-2" />
                Lọc
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">Tổng cấu hình</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{mockConfigs.length}</div>
                <div className="text-xs text-slate-500 mt-1">{mockConfigs.filter(c => c.active).length} đang hoạt động</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-slate-600">Người dùng</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {mockConfigs.reduce((sum, c) => sum + c.stats.users, 0)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Đã áp dụng config</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-slate-600">Tổng chi tháng này</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(quickStats.thisMonthTotal)}</div>
                <div className="text-xs text-green-600 mt-1">↑ 12.5% so với tháng trước</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-slate-600">TB/người</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">2.43M</div>
                <div className="text-xs text-slate-500 mt-1">Tháng này</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tất cả', count: mockConfigs.length },
                { id: 'global', label: '🌍 Toàn cục', count: mockConfigs.filter(c => c.scope === 'global').length },
                { id: 'group', label: '👥 Theo nhóm', count: mockConfigs.filter(c => c.scope === 'group').length },
                { id: 'user', label: '⭐ Cá nhân', count: mockConfigs.filter(c => c.scope === 'user').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setConfigFilter(tab.id)}
                  className={`px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${
                    configFilter === tab.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:bg-blue-50 border-slate-200'
                  }`}
                >
                  {tab.label} <span className={configFilter === tab.id ? 'text-blue-100' : 'text-slate-400'}>({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Configs List */}
            <div className="space-y-4">
              {sortedConfigs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200/60 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-slate-600 mb-4">
                    {searchQuery ? `Không có cấu hình nào phù hợp với "${searchQuery}"` : 'Không có cấu hình nào trong bộ lọc này'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setConfigFilter('all');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                sortedConfigs.map(config => (
                <div
                  key={config.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border transition-all ${
                    config.active 
                      ? 'border-slate-200/60 hover:border-blue-300' 
                      : 'border-slate-200/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{config.name}</h3>
                        
                        {/* Scope Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          config.scope === 'global' 
                            ? 'bg-blue-100 text-blue-700' 
                            : config.scope === 'group'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {config.scope === 'global' ? '🌍 Toàn cục' : config.scope === 'group' ? '👥 Nhóm' : '⭐ Cá nhân'}
                        </span>

                        {/* Priority Badge */}
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          P{config.priority}
                        </span>

                        {/* Status Badge */}
                        {config.active ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Tạm dừng
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-slate-600 mb-3">
                        Áp dụng cho: <strong>{config.appliedTo}</strong>
                      </div>

                      {/* Config Details Grid */}
                      <div className="grid md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Kiểu tính</div>
                          <div className="font-semibold text-slate-900">{config.type}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Mức thưởng</div>
                          <div className="font-semibold text-green-600">{config.amount}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Đang áp dụng</div>
                          <div className="font-semibold text-blue-600">{config.stats.users} người</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Tháng này</div>
                          <div className="font-semibold text-purple-600">{config.stats.thisMonth}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => setShowConfigDetail(config)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => setShowEditModal(config)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors" 
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={() => setShowCloneModal(config)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors" 
                        title="Nhân bản"
                      >
                        <Copy className="w-4 h-4 text-green-600" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(config)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions Footer */}
                  {config.active && (
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>✓ Được tạo 2 tháng trước</span>
                        <span>•</span>
                        <span>Cập nhật lần cuối: 5 ngày trước</span>
                      </div>
                      <button 
                        onClick={() => setShowConfigDetail(config)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Xem báo cáo chi tiết →
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
            </div>
          </div>
        )}

        {/* Help Tab */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            {/* Getting Started Video */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <div className="flex items-center gap-3 mb-4">
                <PlayCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">🎥 Video hướng dẫn</h3>
              </div>
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                  <div className="text-slate-600 font-medium">Hướng dẫn thiết lập nhuận bút</div>
                  <div className="text-sm text-slate-500">5 phút • Tiếng Việt</div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: 'Tôi nên chọn kiểu tính toán nào?',
                    a: 'Phụ thuộc vào mục tiêu của bạn. Nếu muốn đơn giản, chọn "Cố định/bài". Nếu muốn khuyến khích chất lượng, chọn "Theo lượt xem" hoặc "Kết hợp".'
                  },
                  {
                    q: 'Cấu hình "Global" và "Group" khác nhau như thế nào?',
                    a: 'Global áp dụng cho tất cả người dùng. Group chỉ áp dụng cho nhóm cụ thể (ví dụ: Biên tập viên). User áp dụng cho cá nhân.'
                  },
                  {
                    q: 'Có thể có nhiều cấu hình cùng lúc không?',
                    a: 'Có! Hệ thống sẽ áp dụng config có độ ưu tiên cao nhất. User config > Group config > Global config.'
                  },
                  {
                    q: 'Làm sao để test công thức trước khi áp dụng?',
                    a: 'Sử dụng tab "Máy tính" để mô phỏng và xem kết quả trước khi tạo cấu hình chính thức.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-900 mb-2">❓ {faq.q}</div>
                    <div className="text-sm text-slate-600">💡 {faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation Links */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: '📖 Tài liệu đầy đủ', desc: 'Hướng dẫn chi tiết', icon: BookOpen },
                { title: '🎓 Tutorials', desc: 'Học qua ví dụ', icon: PlayCircle },
                { title: '💬 Hỗ trợ', desc: 'Liên hệ team', icon: HelpCircle }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <item.icon className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-sm text-slate-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Wizard Header with Steps */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Tạo cấu hình nhuận bút mới</h3>
                <button
                  onClick={() => {
                    // Confirm if user has entered data
                    const hasData = wizardData.name || wizardData.calculationType || wizardStep > 1;
                    if (hasData) {
                      if (confirm('Bạn có chắc muốn đóng? Dữ liệu đã nhập sẽ bị mất.')) {
                        setShowWizard(false);
                        resetWizard();
                      }
                    } else {
                      setShowWizard(false);
                      resetWizard();
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between">
                {wizardSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        wizardStep > step.id
                          ? 'bg-green-500 text-white'
                          : wizardStep === step.id
                          ? 'bg-white text-blue-600'
                          : 'bg-white/30 text-white/70'
                      }`}>
                        {wizardStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                      </div>
                      <div className={`${wizardStep === step.id ? 'opacity-100' : 'opacity-70'}`}>
                        <div className="text-sm font-semibold">{step.title}</div>
                        <div className="text-xs opacity-80">{step.description}</div>
                      </div>
                    </div>
                    {idx < wizardSteps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 rounded-full ${
                        wizardStep > step.id ? 'bg-green-500' : 'bg-white/30'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Wizard Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Template Selection */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Chọn mẫu để bắt đầu</h4>
                    <p className="text-slate-600">Hoặc tạo từ đầu nếu bạn muốn tùy chỉnh hoàn toàn</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {templates.slice(0, 4).map((template) => (
                      <div
                        key={template.id}
                        onClick={() => {
                          startWizardWithTemplate(template.id);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-3xl">{template.icon}</div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 mb-1">{template.name}</div>
                            <div className="text-sm text-slate-600">{template.description}</div>
                          </div>
                          {selectedTemplate === template.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          {template.examples[0]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <button 
                      onClick={() => {
                        setSelectedTemplate(null);
                        setWizardStep(2);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-all"
                    >
                      Hoặc tạo từ đầu →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Scope Selection */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  {selectedTemplate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-900">
                        Đang sử dụng mẫu: <span className="font-semibold">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Cấu hình này áp dụng cho ai?</h4>
                    <p className="text-slate-600">Chọn phạm vi áp dụng</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        scope: 'global',
                        title: '🌍 Tất cả mọi người',
                        desc: 'Áp dụng cho toàn bộ tác giả',
                        example: 'Mặc định cho tất cả'
                      },
                      {
                        scope: 'group',
                        title: '👥 Theo nhóm',
                        desc: 'Chỉ áp dụng cho nhóm cụ thể',
                        example: 'VD: Biên tập viên, Cộng tác viên'
                      },
                      {
                        scope: 'user',
                        title: '⭐ Cá nhân',
                        desc: 'Riêng cho người dùng',
                        example: 'VD: Tác giả xuất sắc'
                      }
                    ].map((item) => (
                      <div
                        key={item.scope}
                        onClick={() => setWizardData({ ...wizardData, scope: item.scope as any, selectedGroup: null, selectedUser: null })}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all text-center ${
                          wizardData.scope === item.scope
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="text-4xl mb-3">{item.title.split(' ')[0]}</div>
                        <div className="font-bold text-slate-900 mb-2">{item.title.substring(2)}</div>
                        <div className="text-sm text-slate-600 mb-3">{item.desc}</div>
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Group Selection */}
                  {wizardData.scope === 'group' && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                      <label className="block text-sm font-semibold text-green-900 mb-3">
                        👥 Chọn nhóm người dùng *
                      </label>
                      <select
                        value={wizardData.selectedGroup || ''}
                        onChange={(e) => {
                          setWizardData({ ...wizardData, selectedGroup: e.target.value });
                          setValidationErrors({ ...validationErrors, selectedGroup: '' });
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white ${
                          validationErrors.selectedGroup 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-green-300 focus:ring-green-500'
                        }`}
                      >
                        <option value="">-- Chọn nhóm --</option>
                        <option value="editors">👔 Biên tập viên chính thức</option>
                        <option value="contributors">✍️ Cộng tác viên</option>
                        <option value="freelancers">🎨 Freelancers</option>
                        <option value="interns">🎓 Thực tập sinh</option>
                        <option value="senior_writers">⭐ Tác giả senior</option>
                        <option value="junior_writers">🌱 Tác giả junior</option>
                      </select>
                      {validationErrors.selectedGroup ? (
                        <p className="text-xs text-red-600 mt-2">⚠️ {validationErrors.selectedGroup}</p>
                      ) : (
                        <p className="text-xs text-green-700 mt-2">
                          Cấu hình sẽ chỉ áp dụng cho các thành viên trong nhóm này
                        </p>
                      )}
                      
                      {wizardData.selectedGroup && !validationErrors.selectedGroup && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-sm text-green-900">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium">
                              Đã chọn: {getGroupName(wizardData.selectedGroup)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Selection */}
                  {wizardData.scope === 'user' && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                      <label className="block text-sm font-semibold text-purple-900 mb-3">
                        ⭐ Chọn người dùng cụ thể *
                      </label>
                      <select
                        value={wizardData.selectedUser || ''}
                        onChange={(e) => {
                          setWizardData({ ...wizardData, selectedUser: e.target.value });
                          setValidationErrors({ ...validationErrors, selectedUser: '' });
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white ${
                          validationErrors.selectedUser 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-purple-300 focus:ring-purple-500'
                        }`}
                      >
                        <option value="">-- Chọn người dùng --</option>
                        <option value="user_1">Nguyễn Văn A (Editor)</option>
                        <option value="user_2">Trần Thị B (Senior Writer)</option>
                        <option value="user_3">Lê Văn C (Freelancer)</option>
                        <option value="user_4">Phạm Thị D (Contributor)</option>
                        <option value="user_5">Hoàng Văn E (Editor in Chief)</option>
                        <option value="user_6">Đặng Thị F (Junior Writer)</option>
                      </select>
                      {validationErrors.selectedUser ? (
                        <p className="text-xs text-red-600 mt-2">⚠️ {validationErrors.selectedUser}</p>
                      ) : (
                        <p className="text-xs text-purple-700 mt-2">
                          Cấu hình sẽ chỉ áp dụng riêng cho người dùng này
                        </p>
                      )}
                      
                      {wizardData.selectedUser && !validationErrors.selectedUser && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 text-sm text-purple-900">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">
                              Đã chọn: {getUserName(wizardData.selectedUser)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Calculation Type */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Cách tính nhuận bút</h4>
                    <p className="text-slate-600">Chọn công thức phù hợp và thiết lập giá trị</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { type: 'fixed_per_article', icon: '💰', label: 'Cố định mỗi bài', desc: 'Trả một số tiền nhất định cho mỗi bài viết' },
                      { type: 'tiered_views', icon: '🔥', label: 'Thưởng theo lượt xem', desc: 'Tăng dần theo số lượt xem (khuyến khích viral)' },
                      { type: 'fixed_monthly', icon: '💼', label: 'Lương cố định tháng', desc: 'Trả lương hàng tháng cho nhân viên chính thức' },
                      { type: 'percentage_revenue', icon: '📊', label: 'Phần trăm doanh thu', desc: 'Chia sẻ % doanh thu quảng cáo' },
                      { type: 'hybrid', icon: '⚡', label: 'Kết hợp nhiều kiểu', desc: 'Linh hoạt nhất - kết hợp nhiều yếu tố' }
                    ].map((item) => (
                      <div
                        key={item.type}
                        onClick={() => setWizardData({ ...wizardData, calculationType: item.type })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                          wizardData.calculationType === item.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="text-3xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">{item.label}</div>
                          <div className="text-sm text-slate-600">{item.desc}</div>
                        </div>
                        {wizardData.calculationType === item.type && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input fields based on calculation type */}
                  {wizardData.calculationType === 'fixed_per_article' && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                      <label className="block text-sm font-semibold text-green-900 mb-3">
                        💰 Số tiền cố định cho mỗi bài viết *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={wizardData.fixedAmount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setWizardData({ ...wizardData, fixedAmount: value });
                          if (value > 0) {
                            setValidationErrors({ ...validationErrors, fixedAmount: '' });
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-lg font-semibold ${
                          validationErrors.fixedAmount
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-green-300 focus:ring-green-500'
                        }`}
                        placeholder="200000"
                      />
                      {validationErrors.fixedAmount ? (
                        <p className="text-xs text-red-600 mt-2">⚠️ {validationErrors.fixedAmount}</p>
                      ) : (
                        <p className="text-xs text-green-700 mt-2">
                          Ví dụ: 200,000đ = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wizardData.fixedAmount)}
                        </p>
                      )}
                    </div>
                  )}

                  {wizardData.calculationType === 'fixed_monthly' && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
                      <label className="block text-sm font-semibold text-blue-900 mb-3">
                        💼 Lương tháng cố định *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={wizardData.monthlyAmount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setWizardData({ ...wizardData, monthlyAmount: value });
                          if (value > 0) {
                            setValidationErrors({ ...validationErrors, monthlyAmount: '' });
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-lg font-semibold ${
                          validationErrors.monthlyAmount
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-blue-300 focus:ring-blue-500'
                        }`}
                        placeholder="15000000"
                      />
                      {validationErrors.monthlyAmount ? (
                        <p className="text-xs text-red-600 mt-2">⚠️ {validationErrors.monthlyAmount}</p>
                      ) : (
                        <p className="text-xs text-blue-700 mt-2">
                          Lương tháng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wizardData.monthlyAmount)}
                        </p>
                      )}
                    </div>
                  )}

                  {wizardData.calculationType === 'tiered_views' && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
                      <label className="block text-sm font-semibold text-orange-900 mb-3">
                        🔥 Thưởng theo lượt xem (tăng dần) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={wizardData.viewRate}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setWizardData({ ...wizardData, viewRate: value });
                          if (value > 0) {
                            setValidationErrors({ ...validationErrors, viewRate: '' });
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-lg font-semibold ${
                          validationErrors.viewRate
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-orange-300 focus:ring-orange-500'
                        }`}
                        placeholder="200"
                      />
                      {validationErrors.viewRate ? (
                        <p className="text-xs text-red-600 mt-2">⚠️ {validationErrors.viewRate}</p>
                      ) : (
                        <p className="text-xs text-orange-700 mt-2">
                          Ví dụ: 10,000 views = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(10000 * wizardData.viewRate)}
                        </p>
                      )}
                    </div>
                  )}

                  {wizardData.calculationType === 'percentage_revenue' && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                      <label className="block text-sm font-semibold text-purple-900 mb-3">
                        📊 Phần trăm doanh thu *
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={wizardData.revenuePercentage}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setWizardData({ ...wizardData, revenuePercentage: value });
                            if (value > 0 && value <= 100) {
                              setValidationErrors({ ...validationErrors, revenuePercentage: '' });
                            }
                          }}
                          className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-lg font-semibold ${
                            validationErrors.revenuePercentage
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-purple-300 focus:ring-purple-500'
                          }`}
                          placeholder="15"
                        />
                        <span className="text-2xl font-bold text-purple-900">%</span>
                      </div>
                      {validationErrors.revenuePercentage ? (
                        <p className="text-xs text-red-600 mt-2">⚠️ {validationErrors.revenuePercentage}</p>
                      ) : (
                        <p className="text-xs text-purple-700 mt-2">
                          Ví dụ: Doanh thu 5,000,000đ × {wizardData.revenuePercentage}% = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(5000000 * wizardData.revenuePercentage / 100)}
                        </p>
                      )}
                    </div>
                  )}

                  {wizardData.calculationType === 'hybrid' && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300 space-y-4">
                      <div className="text-sm font-semibold text-yellow-900 mb-3">
                        ⚡ Kết hợp nhiều yếu tố
                      </div>
                      
                      <div>
                        <label className="block text-xs text-yellow-800 mb-1">Nhuận bút cơ bản</label>
                        <input
                          type="number"
                          min="0"
                          value={wizardData.baseAmount}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setWizardData({ ...wizardData, baseAmount: value });
                            if (value >= 0) {
                              setValidationErrors({ ...validationErrors, baseAmount: '' });
                            }
                          }}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 bg-white ${
                            validationErrors.baseAmount
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-yellow-300 focus:ring-yellow-500'
                          }`}
                          placeholder="500000"
                        />
                        {validationErrors.baseAmount && (
                          <p className="text-xs text-red-600 mt-1">⚠️ {validationErrors.baseAmount}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-yellow-800 mb-1">Thưởng views (đ/view)</label>
                          <input
                            type="number"
                            min="0"
                            value={wizardData.viewRate}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setWizardData({ ...wizardData, viewRate: value });
                              if (value >= 0) {
                                setValidationErrors({ ...validationErrors, viewRate: '' });
                              }
                            }}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 bg-white ${
                              validationErrors.viewRate
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-yellow-300 focus:ring-yellow-500'
                            }`}
                            placeholder="200"
                          />
                          {validationErrors.viewRate && (
                            <p className="text-xs text-red-600 mt-1">⚠️ {validationErrors.viewRate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs text-yellow-800 mb-1">Thưởng từ (đ/từ)</label>
                          <input
                            type="number"
                            min="0"
                            value={wizardData.wordRate}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setWizardData({ ...wizardData, wordRate: value });
                              if (value >= 0) {
                                setValidationErrors({ ...validationErrors, wordRate: '' });
                              }
                            }}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 bg-white ${
                              validationErrors.wordRate
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-yellow-300 focus:ring-yellow-500'
                            }`}
                            placeholder="100"
                          />
                          {validationErrors.wordRate && (
                            <p className="text-xs text-red-600 mt-1">⚠️ {validationErrors.wordRate}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-yellow-800 mb-1">Thưởng chất lượng</label>
                        <input
                          type="number"
                          min="0"
                          value={wizardData.qualityBonus}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setWizardData({ ...wizardData, qualityBonus: value });
                            if (value >= 0) {
                              setValidationErrors({ ...validationErrors, qualityBonus: '' });
                            }
                          }}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 bg-white ${
                            validationErrors.qualityBonus
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-yellow-300 focus:ring-yellow-500'
                          }`}
                          placeholder="1000000"
                        />
                        {validationErrors.qualityBonus && (
                          <p className="text-xs text-red-600 mt-1">⚠️ {validationErrors.qualityBonus}</p>
                        )}
                      </div>

                      <p className="text-xs text-yellow-700 mt-2">
                        💡 Ví dụ tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wizardData.baseAmount + (10000 * wizardData.viewRate) + (1000 * wizardData.wordRate) + wizardData.qualityBonus)}
                        <br />
                        (Base + 10k views + 1k từ + Quality bonus)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Preview & Confirm */}
              {wizardStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">🎉</div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Xem trước cấu hình</h4>
                    <p className="text-slate-600">Kiểm tra lại trước khi tạo</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-blue-700 mb-2">Tên cấu hình *</label>
                        <input
                          type="text"
                          value={wizardData.name}
                          onChange={(e) => {
                            setWizardData({ ...wizardData, name: e.target.value });
                            if (e.target.value.trim().length >= 3 && e.target.value.trim().length <= 100) {
                              setValidationErrors({ ...validationErrors, name: '' });
                            }
                          }}
                          maxLength={100}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-lg font-semibold text-blue-900 ${
                            validationErrors.name
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-blue-300 focus:ring-blue-500'
                          }`}
                          placeholder="VD: Nhuận bút biên tập viên, Thưởng viral Q4..."
                        />
                        {validationErrors.name ? (
                          <p className="text-xs text-red-600 mt-1">⚠️ {validationErrors.name}</p>
                        ) : (
                          <p className="text-xs text-blue-600 mt-1">
                            {wizardData.name.length}/100 ký tự
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-blue-700 mb-1">Phạm vi áp dụng</div>
                        <div className="text-lg font-bold text-blue-900">
                          {wizardData.scope === 'global' && '🌍 Toàn bộ tác giả'}
                          {wizardData.scope === 'group' && `👥 Nhóm: ${getGroupName(wizardData.selectedGroup)}`}
                          {wizardData.scope === 'user' && `⭐ Người dùng: ${getUserName(wizardData.selectedUser)}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-700 mb-1">Kiểu tính toán</div>
                        <div className="text-lg font-bold text-blue-900">
                          {wizardData.calculationType === 'fixed_per_article' && '💰 Cố định mỗi bài'}
                          {wizardData.calculationType === 'tiered_views' && '🔥 Thưởng theo lượt xem'}
                          {wizardData.calculationType === 'fixed_monthly' && '💼 Lương cố định tháng'}
                          {wizardData.calculationType === 'percentage_revenue' && '📊 Phần trăm doanh thu'}
                          {wizardData.calculationType === 'hybrid' && '⚡ Kết hợp nhiều kiểu'}
                          {!wizardData.calculationType && 'Chưa chọn'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Values Preview */}
                  {wizardData.calculationType && (
                    <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                      <h5 className="font-semibold text-slate-900 mb-3">💵 Giá trị cấu hình</h5>
                      <div className="space-y-2 text-sm">
                        {wizardData.calculationType === 'fixed_per_article' && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Số tiền cố định/bài:</span>
                            <span className="font-semibold text-green-600 text-lg">{formatCurrency(wizardData.fixedAmount)}</span>
                          </div>
                        )}
                        
                        {wizardData.calculationType === 'fixed_monthly' && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Lương tháng:</span>
                            <span className="font-semibold text-blue-600 text-lg">{formatCurrency(wizardData.monthlyAmount)}</span>
                          </div>
                        )}

                        {wizardData.calculationType === 'tiered_views' && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Thưởng theo views:</span>
                            <span className="font-semibold text-orange-600 text-lg">{wizardData.viewRate}đ/view</span>
                          </div>
                        )}

                        {wizardData.calculationType === 'percentage_revenue' && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Phần trăm doanh thu:</span>
                            <span className="font-semibold text-purple-600 text-lg">{wizardData.revenuePercentage}%</span>
                          </div>
                        )}

                        {wizardData.calculationType === 'hybrid' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Nhuận bút cơ bản:</span>
                              <span className="font-semibold text-slate-900">{formatCurrency(wizardData.baseAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Thưởng theo views:</span>
                              <span className="font-semibold text-slate-900">{wizardData.viewRate}đ/view</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Thưởng theo từ:</span>
                              <span className="font-semibold text-slate-900">{wizardData.wordRate}đ/từ</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Thưởng chất lượng:</span>
                              <span className="font-semibold text-slate-900">{formatCurrency(wizardData.qualityBonus)}</span>
                            </div>
                            <div className="border-t border-slate-200 mt-2 pt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-700 font-medium">Ví dụ tổng (10k views, 1k từ, quality):</span>
                                <span className="font-bold text-yellow-600 text-lg">
                                  {formatCurrency(wizardData.baseAmount + (10000 * wizardData.viewRate) + (1000 * wizardData.wordRate) + wizardData.qualityBonus)}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1 text-sm text-green-800">
                        Cấu hình sẽ được kích hoạt ngay lập tức sau khi tạo. Bạn có thể chỉnh sửa hoặc tạm dừng bất cứ lúc nào.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
              <button
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                disabled={wizardStep === 1}
                className="px-4 py-2 border border-slate-200 hover:bg-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>

              <div className="text-sm text-slate-600">
                Bước {wizardStep} / {wizardSteps.length}
              </div>

              {wizardStep < wizardSteps.length ? (
                <button
                  onClick={() => {
                    // Clear previous errors
                    setValidationErrors({});
                    
                    // Validate current step
                    if (!validateWizardData(wizardStep)) {
                      return;
                    }
                    
                    setWizardStep(wizardStep + 1);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2"
                >
                  Tiếp tục
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={async () => {
                    // Validate step 4
                    if (!validateWizardData(4)) {
                      return;
                    }
                    
                    // Create config with loading state
                    setIsCreating(true);
                    try {
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 800));
                      console.log('Creating config with data:', wizardData);
                      showSuccess(`Đã tạo cấu hình \"${wizardData.name}\" thành công! 🎉`);
                      setShowWizard(false);
                      resetWizard();
                      setActiveTab('configs');
                    } catch (error) {
                      showError('Có lỗi xảy ra khi tạo cấu hình');
                    } finally {
                      setIsCreating(false);
                    }
                  }}
                  disabled={isCreating}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Tạo cấu hình
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showTemplatePreview && (
        <TemplatePreviewModal
          template={showTemplatePreview}
          onClose={() => setShowTemplatePreview(null)}
          onUse={() => {
            if (showTemplatePreview && showTemplatePreview.id) {
              startWizardWithTemplate(showTemplatePreview.id);
            }
          }}
        />
      )}
      {showConfigDetail && (
        <ConfigDetailModal
          config={showConfigDetail}
          onClose={() => setShowConfigDetail(null)}
        />
      )}
      {showEditModal && (
        <EditConfigModal
          config={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={(data) => {
            console.log('Save config:', data);
            showSuccess('Đã lưu cấu hình thành công!');
          }}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          config={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            console.log('Delete config:', showDeleteConfirm.name);
            showSuccess(`Đã xóa cấu hình: ${showDeleteConfirm.name}`);
          }}
        />
      )}
      {showCloneModal && (
        <CloneConfigModal
          config={showCloneModal}
          onClose={() => setShowCloneModal(null)}
          onConfirm={(newName) => {
            console.log('Clone config:', newName);
            showSuccess(`Đã tạo bản sao: ${newName}`);
          }}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}