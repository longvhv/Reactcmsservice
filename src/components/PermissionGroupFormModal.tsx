import { useState, useEffect } from 'react';
import { X, Save, Plus, AlertCircle, Shield, Lock, Users, Tag, CheckCircle } from 'lucide-react';
import { Card } from './Card';

interface PermissionGroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: PermissionGroupFormData, saveAndContinue?: boolean) => void;
  editingGroup?: PermissionGroup | null;
}

interface PermissionGroupFormData {
  name: string;
  description: string;
  categories: string[];
  permissions: string[];
  active: boolean;
}

interface PermissionGroup {
  id: number;
  name: string;
  description: string;
  categories: string[];
  permissions: string[];
  members: number;
  active: boolean;
}

interface Permission {
  id: string;
  label: string;
  description: string;
  category: 'content' | 'moderation' | 'admin';
}

const allPermissions: Permission[] = [
  { id: 'read', label: 'Xem', description: 'Xem nội dung và bài viết', category: 'content' },
  { id: 'write', label: 'Viết', description: 'Tạo nội dung và bài viết mới', category: 'content' },
  { id: 'edit', label: 'Sửa', description: 'Chỉnh sửa nội dung hiện có', category: 'content' },
  { id: 'delete', label: 'Xóa', description: 'Xóa nội dung và bài viết', category: 'content' },
  { id: 'review', label: 'Duyệt', description: 'Duyệt và review nội dung', category: 'moderation' },
  { id: 'approve', label: 'Phê duyệt', description: 'Phê duyệt cuối cùng trước xuất bản', category: 'moderation' },
  { id: 'publish', label: 'Xuất bản', description: 'Xuất bản nội dung lên website', category: 'content' },
  { id: 'manage_users', label: 'Quản lý người dùng', description: 'Thêm/xóa người dùng khỏi nhóm', category: 'admin' },
  { id: 'manage_settings', label: 'Quản lý cài đặt', description: 'Thay đổi cài đặt nhóm quyền', category: 'admin' },
];

const availableCategories = [
  'Tất cả',
  'Tin tức',
  'Công nghệ',
  'Kinh tế',
  'Xã hội',
  'Văn hóa',
  'Thể thao',
  'Giải trí',
  'Khoa học',
  'Giáo dục',
];

export function PermissionGroupFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingGroup 
}: PermissionGroupFormModalProps) {
  const [formData, setFormData] = useState<PermissionGroupFormData>({
    name: '',
    description: '',
    categories: [],
    permissions: [],
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editingGroup) {
      setFormData({
        name: editingGroup.name,
        description: editingGroup.description,
        categories: editingGroup.categories,
        permissions: editingGroup.permissions,
        active: editingGroup.active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categories: [],
        permissions: [],
        active: true,
      });
    }
    setErrors({});
    setTouched({});
  }, [editingGroup, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên nhóm quyền';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Tên nhóm quyền phải có ít nhất 3 ký tự';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'Vui lòng chọn ít nhất 1 danh mục';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Vui lòng chọn ít nhất 1 quyền hạn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndContinue: boolean = false) => {
    setTouched({
      name: true,
      categories: true,
      permissions: true,
    });

    if (validateForm()) {
      onSave(formData, saveAndContinue);
      if (!saveAndContinue) {
        onClose();
      } else {
        // Reset form for new entry
        setFormData({
          name: '',
          description: '',
          categories: [],
          permissions: [],
          active: true,
        });
        setTouched({});
      }
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => {
      // If "Tất cả" is selected, clear other categories
      if (category === 'Tất cả') {
        return {
          ...prev,
          categories: prev.categories.includes('Tất cả') ? [] : ['Tất cả'],
        };
      }
      
      // If selecting other category, remove "Tất cả"
      const newCategories = prev.categories.filter(c => c !== 'Tất cả');
      
      return {
        ...prev,
        categories: newCategories.includes(category)
          ? newCategories.filter(c => c !== category)
          : [...newCategories, category],
      };
    });
    setTouched(prev => ({ ...prev, categories: true }));
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId],
    }));
    setTouched(prev => ({ ...prev, permissions: true }));
  };

  const selectAllPermissions = (category: 'content' | 'moderation' | 'admin') => {
    const categoryPerms = allPermissions.filter(p => p.category === category).map(p => p.id);
    const hasAll = categoryPerms.every(p => formData.permissions.includes(p));
    
    setFormData(prev => ({
      ...prev,
      permissions: hasAll
        ? prev.permissions.filter(p => !categoryPerms.includes(p))
        : [...new Set([...prev.permissions, ...categoryPerms])],
    }));
  };

  if (!isOpen) return null;

  const permissionsByCategory = {
    content: allPermissions.filter(p => p.category === 'content'),
    moderation: allPermissions.filter(p => p.category === 'moderation'),
    admin: allPermissions.filter(p => p.category === 'admin'),
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {editingGroup ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {editingGroup ? 'Cập nhật thông tin và quyền hạn' : 'Tạo nhóm quyền mới để quản lý truy cập'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Thông tin cơ bản
            </h3>
            
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm mb-2">
                Tên nhóm quyền <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                placeholder="Ví dụ: Editor Công nghệ, Reviewer Tin tức..."
                className={`w-full px-4 py-2.5 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  touched.name && errors.name ? 'border-red-500' : 'border-border'
                }`}
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả vai trò và trách nhiệm của nhóm quyền này..."
                rows={3}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${formData.active ? 'text-green-600' : 'text-gray-600'}`} />
                  Kích hoạt ngay
                </h4>
                <p className="text-sm text-muted-foreground">
                  Nhóm quyền sẽ có hiệu lực ngay sau khi tạo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              Danh mục áp dụng <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chọn các danh mục mà nhóm quyền này có quyền truy cập
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-3 bg-muted/20 rounded-xl border border-border/60">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.categories.includes(cat)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                      : 'border-border hover:border-purple-300 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      formData.categories.includes(cat)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.categories.includes(cat) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{cat}</span>
                  </div>
                </button>
              ))}
            </div>

            {touched.categories && errors.categories && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.categories}
              </p>
            )}
          </div>

          {/* Permissions Section */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600" />
              Quyền hạn <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chọn các quyền hạn được cấp cho nhóm này
            </p>

            {/* Content Permissions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Quản lý nội dung</h4>
                <button
                  type="button"
                  onClick={() => selectAllPermissions('content')}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {permissionsByCategory.content.every(p => formData.permissions.includes(p.id))
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionsByCategory.content.map((perm) => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => togglePermission(perm.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.permissions.includes(perm.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border hover:bg-muted/40 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        formData.permissions.includes(perm.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.permissions.includes(perm.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{perm.label}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {perm.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Moderation Permissions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Kiểm duyệt</h4>
                <button
                  type="button"
                  onClick={() => selectAllPermissions('moderation')}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {permissionsByCategory.moderation.every(p => formData.permissions.includes(p.id))
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionsByCategory.moderation.map((perm) => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => togglePermission(perm.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.permissions.includes(perm.id)
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-border hover:bg-muted/40 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        formData.permissions.includes(perm.id)
                          ? 'border-yellow-500 bg-yellow-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.permissions.includes(perm.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{perm.label}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {perm.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Permissions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Quản trị</h4>
                <button
                  type="button"
                  onClick={() => selectAllPermissions('admin')}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {permissionsByCategory.admin.every(p => formData.permissions.includes(p.id))
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionsByCategory.admin.map((perm) => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => togglePermission(perm.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.permissions.includes(perm.id)
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-border hover:bg-muted/40 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        formData.permissions.includes(perm.id)
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.permissions.includes(perm.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{perm.label}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {perm.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {touched.permissions && errors.permissions && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.permissions}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-secondary border border-border rounded-xl hover:bg-muted transition-all"
          >
            Hủy
          </button>
          <div className="flex items-center gap-3">
            {!editingGroup && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Lưu và thêm tiếp
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingGroup ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
