import { Calculator, Info } from 'lucide-react';

interface RoyaltyWizardStep3Props {
  wizardData: any;
  setWizardData: (data: any) => void;
}

export function RoyaltyWizardStep3({ wizardData, setWizardData }: RoyaltyWizardStep3Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const calculateExample = () => {
    const { calculationType, baseAmount, viewRate, wordRate, qualityBonus } = wizardData;
    
    // Example calculation với 1 bài: 1500 views, 1200 từ, QS = 9
    const views = 1500;
    const words = 1200;
    
    let total = 0;
    const breakdown = [];

    if (calculationType === 'hybrid') {
      total = baseAmount + (views * viewRate) + (words * wordRate) + qualityBonus;
      breakdown.push({ label: 'Cơ bản', value: baseAmount });
      breakdown.push({ label: `Views (${views} × ${viewRate}đ)`, value: views * viewRate });
      breakdown.push({ label: `Số từ (${words} × ${wordRate}đ)`, value: words * wordRate });
      breakdown.push({ label: 'Quality Bonus', value: qualityBonus });
    } else if (calculationType === 'fixed_per_article') {
      total = baseAmount;
      breakdown.push({ label: 'Cố định/bài', value: baseAmount });
    } else if (calculationType === 'tiered_views') {
      total = views * 150; // Simplified
      breakdown.push({ label: `Views (${views} × 150đ)`, value: total });
    } else if (calculationType === 'fixed_monthly') {
      total = baseAmount;
      breakdown.push({ label: 'Lương tháng', value: baseAmount });
    } else if (calculationType === 'percentage_revenue') {
      const revenue = 10000000; // Example revenue
      total = revenue * 0.15;
      breakdown.push({ label: '15% doanh thu', value: total });
    }

    return { total, breakdown };
  };

  const example = calculateExample();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold text-slate-900 mb-2">Thiết lập công thức tính</h4>
        <p className="text-slate-600">Nhập các thông số cho công thức đã chọn</p>
      </div>

      {/* Configuration Form based on type */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h5 className="text-lg font-bold text-blue-900">
            {wizardData.calculationType === 'hybrid' && '⚡ Kết hợp nhiều kiểu'}
            {wizardData.calculationType === 'fixed_per_article' && '💰 Cố định mỗi bài'}
            {wizardData.calculationType === 'tiered_views' && '🔥 Theo lượt xem'}
            {wizardData.calculationType === 'fixed_monthly' && '💼 Lương cố định tháng'}
            {wizardData.calculationType === 'percentage_revenue' && '📊 Phần trăm doanh thu'}
          </h5>
        </div>

        {/* Hybrid Config */}
        {wizardData.calculationType === 'hybrid' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                💵 Nhuận bút cơ bản (Base) / bài
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={wizardData.baseAmount}
                  onChange={(e) => setWizardData({ ...wizardData, baseAmount: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-700 font-medium">VNĐ</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">Số tiền cố định cho mỗi bài viết</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  👁️ Thưởng theo lượt xem
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={wizardData.viewRate}
                    onChange={(e) => setWizardData({ ...wizardData, viewRate: parseInt(e.target.value) || 0 })}
                    className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-blue-700 font-medium">đ/view</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  ✍️ Thưởng theo số từ
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={wizardData.wordRate}
                    onChange={(e) => setWizardData({ ...wizardData, wordRate: parseInt(e.target.value) || 0 })}
                    className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-blue-700 font-medium">đ/từ</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                ⭐ Thưởng chất lượng (Quality Score ≥ 8)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={wizardData.qualityBonus}
                  onChange={(e) => setWizardData({ ...wizardData, qualityBonus: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-700 font-medium">VNĐ</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">Thưởng thêm nếu bài viết đạt chất lượng cao</p>
            </div>
          </div>
        )}

        {/* Fixed Per Article */}
        {wizardData.calculationType === 'fixed_per_article' && (
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              💰 Số tiền cố định / bài viết
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={wizardData.baseAmount}
                onChange={(e) => setWizardData({ ...wizardData, baseAmount: parseInt(e.target.value) || 0 })}
                className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-700 font-medium">VNĐ</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">Tác giả sẽ nhận số tiền này cho mỗi bài xuất bản</p>
          </div>
        )}

        {/* Fixed Monthly */}
        {wizardData.calculationType === 'fixed_monthly' && (
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              💼 Lương tháng
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={wizardData.baseAmount}
                onChange={(e) => setWizardData({ ...wizardData, baseAmount: parseInt(e.target.value) || 0 })}
                className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-700 font-medium">VNĐ/tháng</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">Lương cố định không phụ thuộc vào số bài viết</p>
          </div>
        )}

        {/* Tiered Views */}
        {wizardData.calculationType === 'tiered_views' && (
          <div className="space-y-3">
            <p className="text-sm text-blue-900 font-semibold">Bậc thang thưởng theo lượt xem:</p>
            {[
              { min: 0, max: 10000, rate: 50, label: '0 - 10k views' },
              { min: 10001, max: 50000, rate: 100, label: '10k - 50k views' },
              { min: 50001, max: 100000, rate: 150, label: '50k - 100k views' },
              { min: 100001, max: 999999, rate: 200, label: '100k+ views' }
            ].map((tier, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{tier.label}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={tier.rate}
                    className="w-24 px-3 py-2 border border-blue-200 rounded-lg text-sm"
                  />
                  <span className="text-xs text-blue-700">đ/view</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Percentage Revenue */}
        {wizardData.calculationType === 'percentage_revenue' && (
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              📊 Phần trăm doanh thu
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={wizardData.revenuePercentage || 15}
                onChange={(e) => setWizardData({ ...wizardData, revenuePercentage: parseInt(e.target.value) || 15 })}
                min={1}
                max={100}
                className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-700 font-medium">%</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">Tác giả nhận % doanh thu quảng cáo từ bài viết</p>
          </div>
        )}
      </div>

      {/* Live Example Calculation */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">💡</div>
          <h5 className="text-lg font-bold text-green-900">Ví dụ tính toán</h5>
        </div>

        <div className="p-4 bg-white/70 rounded-lg mb-4">
          <div className="text-sm text-green-700 mb-2">
            Một bài viết với: <strong>1,500 views</strong>, <strong>1,200 từ</strong>, <strong>QS = 9</strong>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {example.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm p-3 bg-white/70 rounded-lg">
              <span className="text-green-700">{item.label}</span>
              <span className="font-semibold text-green-900">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t-2 border-green-300 flex items-center justify-between">
          <span className="text-lg font-bold text-green-900">Tổng nhuận bút:</span>
          <span className="text-3xl font-bold text-green-600">{formatCurrency(example.total)}</span>
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1 text-sm text-blue-800">
            <strong>Lưu ý:</strong> Bạn có thể điều chỉnh các thông số này sau khi tạo cấu hình. 
            Thay đổi sẽ chỉ áp dụng cho các bài viết mới được xuất bản.
          </div>
        </div>
      </div>
    </div>
  );
}