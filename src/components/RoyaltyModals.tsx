import React from 'react';
import {
  X, Eye, DollarSign, Users, TrendingUp, Calendar, BarChart3,
  CheckCircle, AlertCircle, Edit, Copy, Trash2, Clock, FileText
} from 'lucide-react';

// Config Detail Modal
export function ConfigDetailModal({ config, onClose }: { config: any; onClose: () => void }) {
  if (!config) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{config.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                {config.scope === 'global' ? '🌍 Toàn cục' : config.scope === 'group' ? '👥 Nhóm' : '⭐ Cá nhân'}
              </span>
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                Priority: {config.priority}
              </span>
              {config.active && (
                <span className="px-2 py-1 bg-green-500 rounded text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Đang hoạt động
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview Stats */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">📊 Tổng quan</h4>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">Người dùng</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{config.stats.users}</div>
                <div className="text-xs text-blue-600 mt-1">Đang áp dụng</div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">Tháng này</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{config.stats.thisMonth}</div>
                <div className="text-xs text-green-600 mt-1">Tổng chi trả</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-700">Trung bình</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {Math.floor(parseInt(config.stats.thisMonth.replace(/[^\d]/g, '')) / config.stats.users).toLocaleString('vi-VN')}đ
                </div>
                <div className="text-xs text-purple-600 mt-1">Mỗi người</div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-orange-700">Tăng trưởng</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">+15.3%</div>
                <div className="text-xs text-orange-600 mt-1">So với tháng trước</div>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">⚙️ Chi tiết cấu hình</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Kiểu tính toán</span>
                <span className="text-sm font-semibold text-slate-900">{config.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Mức thưởng</span>
                <span className="text-sm font-semibold text-green-600">{config.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Áp dụng cho</span>
                <span className="text-sm font-semibold text-slate-900">{config.appliedTo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Ngày tạo</span>
                <span className="text-sm font-semibold text-slate-900">2 tháng trước</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Cập nhật lần cuối</span>
                <span className="text-sm font-semibold text-slate-900">5 ngày trước</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">📋 Hoạt động gần đây</h4>
            <div className="space-y-2">
              {[
                { action: 'Chi trả', user: 'Nguyễn Văn A', amount: '2,500,000đ', time: '2 giờ trước' },
                { action: 'Chi trả', user: 'Trần Thị B', amount: '1,800,000đ', time: '4 giờ trước' },
                { action: 'Chi trả', user: 'Lê Văn C', amount: '3,200,000đ', time: '1 ngày trước' },
                { action: 'Cập nhật config', user: 'Admin', amount: '-', time: '5 ngày trước' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.action === 'Chi trả' ? (
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Edit className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{activity.action} - {activity.user}</div>
                      <div className="text-xs text-slate-500">{activity.time}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">{activity.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-white rounded-xl font-medium transition-colors"
          >
            Đóng
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Config Modal
export function EditConfigModal({ config, onClose, onSave }: { config: any; onClose: () => void; onSave: (data: any) => void }) {
  if (!config) return null;

  const [formData, setFormData] = React.useState({
    name: config.name,
    amount: config.amount,
    active: config.active
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên cấu hình không được để trống';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Tên cấu hình phải có ít nhất 3 ký tự';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Tên cấu hình không được quá 100 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5" />
            <h3 className="text-xl font-bold">Chỉnh sửa cấu hình</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên cấu hình *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (e.target.value.trim().length >= 3 && e.target.value.trim().length <= 100) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
            />
            {errors.name ? (
              <p className="text-xs text-red-600 mt-1">⚠️ {errors.name}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                {formData.name.length}/100 ký tự
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mức thưởng</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
              Kích hoạt cấu hình
            </label>
            {formData.active && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                Đang hoạt động
              </span>
            )}
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm text-blue-800">
                Thay đổi sẽ áp dụng cho các bài viết mới được xuất bản. Các khoản thanh toán đã thực hiện sẽ không bị ảnh hưởng.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-slate-200 hover:bg-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
export function DeleteConfirmModal({ config, onClose, onConfirm }: { config: any; onClose: () => void; onConfirm: () => void }) {
  if (!config) return null;

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState('');
  const requiredText = 'XÓA';
  const isConfirmed = confirmText.toUpperCase() === requiredText;

  const handleDelete = async () => {
    if (!isConfirmed) {
      return;
    }
    
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting config:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Xác nhận xóa</h3>
          <p className="text-slate-600 text-center mb-4">
            Bạn có chắc chắn muốn xóa cấu hình <strong>"{config.name}"</strong>?
          </p>

          <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm text-red-800">
                <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Cấu hình sẽ bị xóa vĩnh viễn và không thể áp dụng cho người dùng nữa.
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nhập "<strong>{requiredText}</strong>" để xác nhận:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                confirmText && !isConfirmed
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-slate-400'
              }`}
              placeholder={`Nhập ${requiredText}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isConfirmed && !isDeleting) {
                  handleDelete();
                }
              }}
            />
            {confirmText && !isConfirmed && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Vui lòng nhập chính xác "{requiredText}"
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa cấu hình'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Clone Config Modal
export function CloneConfigModal({ config, onClose, onConfirm }: { config: any; onClose: () => void; onConfirm: (name: string) => void }) {
  if (!config) return null;
  
  const [newName, setNewName] = React.useState(`${config.name} (Bản sao)`);
  const [error, setError] = React.useState('');
  const [isCloning, setIsCloning] = React.useState(false);

  const handleConfirm = async () => {
    if (!newName.trim()) {
      setError('Tên cấu hình không được để trống');
      return;
    }
    if (newName.trim().length < 3) {
      setError('Tên cấu hình phải có ít nhất 3 ký tự');
      return;
    }
    if (newName.trim().length > 100) {
      setError('Tên cấu hình không được quá 100 ký tự');
      return;
    }
    
    setIsCloning(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onConfirm(newName);
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo bản sao');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Copy className="w-6 h-6 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Nhân bản cấu hình</h3>
          <p className="text-slate-600 text-center mb-4">
            Tạo bản sao của <strong>"{config.name}"</strong>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên cấu hình mới *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (e.target.value.trim().length >= 3 && e.target.value.trim().length <= 100) {
                  setError('');
                }
              }}
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-green-500'
              }`}
              placeholder="Nhập tên cho cấu hình mới"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isCloning) {
                  handleConfirm();
                }
              }}
            />
            {error ? (
              <p className="text-xs text-red-600 mt-1">⚠️ {error}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                {newName.length}/100 ký tự
              </p>
            )}
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm text-green-800">
                Cấu hình mới sẽ có tất cả thiết lập giống như bản gốc. Bạn có thể chỉnh sửa sau khi tạo.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isCloning}
              className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={isCloning}
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCloning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo bản sao'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template Preview Modal
export function TemplatePreviewModal({ template, onClose, onUse }: { template: any; onClose: () => void; onUse: () => void }) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{template.icon}</div>
            <div>
              <h3 className="text-xl font-bold">{template.name}</h3>
              <p className="text-sm opacity-90">{template.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Examples */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">💡 Ví dụ thực tế</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {template.examples.map((example: string, idx: number) => (
                <div key={idx} className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm font-medium text-green-900">{example}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">✅ Phù hợp cho</h4>
            <div className="flex flex-wrap gap-2">
              {template.useCases.map((useCase: string, idx: number) => (
                <span key={idx} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">⚙️ Thông tin</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Độ khó</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  template.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {template.difficulty === 'beginner' ? '🟢 Dễ' : 
                   template.difficulty === 'intermediate' ? '🔵 Trung bình' : 
                   '🟣 Nâng cao'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Phạm vi</span>
                <span className="text-sm font-medium text-slate-900">
                  {template.scope === 'global' ? '🌍 Toàn cục' : 
                   template.scope === 'group' ? '👥 Nhóm' : 
                   '⭐ Cá nhân'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Kiểu tính</span>
                <span className="text-sm font-medium text-slate-900">{template.calculationType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-white rounded-xl font-medium transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onUse();
              onClose();
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg"
          >
            Sử dụng mẫu này
          </button>
        </div>
      </div>
    </div>
  );
}
