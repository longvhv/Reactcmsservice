import { DollarSign, Calculator, TrendingUp, CheckCircle, Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface UserRoyaltyConfigProps {
  userId: number;
  userName: string;
}

export function UserRoyaltyConfig({ userId, userName }: UserRoyaltyConfigProps) {
  // Mock data - Royalty configs for this user
  const userRoyaltyConfigs = [
    {
      id: 1,
      name: 'VIP - Nhuận bút cá nhân',
      type: '⚡ Kết hợp',
      formula: 'Base (500k) + Views (200đ/view) + Words (100đ/từ) + Quality Bonus',
      scope: 'user',
      priority: 10,
      active: true,
      effectiveFrom: '01/01/2024',
      stats: {
        thisMonth: 18500000,
        lastMonth: 16200000,
        articles: 24
      }
    }
  ];

  // Mock data - Earnings history
  const earningsHistory = [
    {
      month: 'Tháng 12/2024',
      earnings: 18500000,
      articles: 24,
      views: 125000,
      breakdown: {
        base: 12000000,
        viewBonus: 4500000,
        wordBonus: 1200000,
        qualityBonus: 800000
      }
    },
    {
      month: 'Tháng 11/2024',
      earnings: 16200000,
      articles: 21,
      views: 98000,
      breakdown: {
        base: 10500000,
        viewBonus: 3800000,
        wordBonus: 1100000,
        qualityBonus: 800000
      }
    },
    {
      month: 'Tháng 10/2024',
      earnings: 15800000,
      articles: 23,
      views: 105000,
      breakdown: {
        base: 11500000,
        viewBonus: 3200000,
        wordBonus: 900000,
        qualityBonus: 200000
      }
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalEarnings = earningsHistory.reduce((sum, item) => sum + item.earnings, 0);
  const avgMonthly = totalEarnings / earningsHistory.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">Tổng thu nhập</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(totalEarnings)}</div>
          <div className="text-xs text-green-600 mt-1">3 tháng gần đây</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700">TB/tháng</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(avgMonthly)}</div>
          <div className="text-xs text-blue-600 mt-1">Trung bình</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700">Tháng này</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{formatCurrency(earningsHistory[0].earnings)}</div>
          <div className="text-xs text-purple-600 mt-1">
            {earningsHistory[0].earnings > earningsHistory[1].earnings ? '↑' : '↓'} 
            {' '}
            {Math.abs(((earningsHistory[0].earnings - earningsHistory[1].earnings) / earningsHistory[1].earnings) * 100).toFixed(1)}% so với tháng trước
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-700">TB/bài</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {formatCurrency(earningsHistory[0].earnings / earningsHistory[0].articles)}
          </div>
          <div className="text-xs text-orange-600 mt-1">{earningsHistory[0].articles} bài tháng này</div>
        </div>
      </div>

      {/* Active Royalty Config */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Cấu hình nhuận bút đang áp dụng
            </h3>
            <p className="text-sm text-slate-600 mt-1">Cấu hình riêng cho tác giả này</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>

        {userRoyaltyConfigs.length > 0 ? (
          <div className="space-y-4">
            {userRoyaltyConfigs.map((config) => (
              <div key={config.id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-900">{config.name}</h4>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        ⭐ Cá nhân
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        P{config.priority}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mb-3">{config.type}</div>
                    <div className="p-4 bg-white/70 rounded-lg mb-4">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Công thức tính:</div>
                      <div className="font-mono text-sm text-slate-900">{config.formula}</div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/70 rounded-lg p-4">
                    <div className="text-xs text-slate-500 mb-1">Tháng này</div>
                    <div className="text-xl font-bold text-green-600">{formatCurrency(config.stats.thisMonth)}</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4">
                    <div className="text-xs text-slate-500 mb-1">Tháng trước</div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(config.stats.lastMonth)}</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4">
                    <div className="text-xs text-slate-500 mb-1">Số bài viết</div>
                    <div className="text-xl font-bold text-purple-600">{config.stats.articles} bài</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-200 flex items-center justify-between text-sm text-slate-600">
                  <span>Hiệu lực từ: <strong>{config.effectiveFrom}</strong></span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Xem lịch sử chi tiết →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Chưa có cấu hình nhuận bút riêng</h4>
            <p className="text-slate-600 mb-6">Tác giả này đang sử dụng cấu hình mặc định từ nhóm hoặc toàn cục</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Tạo cấu hình riêng
            </button>
          </div>
        )}
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Lịch sử thu nhập
        </h3>

        <div className="space-y-4">
          {earningsHistory.map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-bold text-slate-900">{item.month}</div>
                  <div className="text-sm text-slate-600">{item.articles} bài viết • {item.views.toLocaleString()} lượt xem</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(item.earnings)}</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">📝 Cơ bản</div>
                  <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.breakdown.base)}</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">👁️ Thưởng views</div>
                  <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.breakdown.viewBonus)}</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">✍️ Thưởng độ dài</div>
                  <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.breakdown.wordBonus)}</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">⭐ Chất lượng</div>
                  <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.breakdown.qualityBonus)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium text-slate-700">
          Xem tất cả lịch sử →
        </button>
      </div>

      {/* Calculator Preview */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500 text-white rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-purple-900 mb-2">💡 Mô phỏng nhuận bút</h3>
            <p className="text-sm text-purple-800 mb-4">
              Sử dụng máy tính để xem trước nhuận bút dự kiến cho bài viết mới của tác giả này
            </p>
            <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all shadow-lg">
              Mở máy tính →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
