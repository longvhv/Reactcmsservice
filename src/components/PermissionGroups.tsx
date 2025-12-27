import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Search, X, Save } from 'lucide-react';

export function PermissionGroups() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<number | null>(null);

  const permissionGroups = [
    {
      id: 1,
      name: 'Editor Công nghệ',
      description: 'Quản lý nội dung chuyên mục Công nghệ',
      categories: ['Công nghệ', 'Khoa học'],
      permissions: ['read', 'write', 'edit', 'delete'],
      members: 12,
    },
    {
      id: 2,
      name: 'Contributor Tin tức',
      description: 'Đóng góp nội dung tin tức',
      categories: ['Tin tức', 'Thời sự'],
      permissions: ['read', 'write'],
      members: 24,
    },
    {
      id: 3,
      name: 'Reviewer',
      description: 'Duyệt bài viết',
      categories: ['Tất cả'],
      permissions: ['read', 'review', 'approve'],
      members: 8,
    },
  ];

  const allPermissions = [
    { id: 'read', label: 'Xem', description: 'Xem nội dung' },
    { id: 'write', label: 'Viết', description: 'Tạo nội dung mới' },
    { id: 'edit', label: 'Sửa', description: 'Chỉnh sửa nội dung' },
    { id: 'delete', label: 'Xóa', description: 'Xóa nội dung' },
    { id: 'review', label: 'Duyệt', description: 'Duyệt nội dung' },
    { id: 'approve', label: 'Phê duyệt', description: 'Phê duyệt cuối cùng' },
    { id: 'publish', label: 'Xuất bản', description: 'Xuất bản nội dung' },
  ];

  const getPermissionColor = (perm: string) => {
    switch (perm) {
      case 'read': return 'bg-green-100 text-green-800';
      case 'write': return 'bg-blue-100 text-blue-800';
      case 'edit': return 'bg-purple-100 text-purple-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approve': return 'bg-orange-100 text-orange-800';
      case 'publish': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionLabel = (perm: string) => {
    const permission = allPermissions.find(p => p.id === perm);
    return permission?.label || perm;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Nhóm quyền</h2>
          <p className="text-gray-600">Quản lý quyền truy cập theo nhóm</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo nhóm quyền</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm quyền..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Permission Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {permissionGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{group.name}</h3>
                    <p className="text-gray-600 text-sm">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingGroup(group.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-700 mb-2">Danh mục áp dụng:</div>
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map((cat, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-700 mb-2">Quyền:</div>
                  <div className="flex flex-wrap gap-2">
                    {group.permissions.map((perm, index) => (
                      <span key={index} className={`px-2 py-1 rounded text-xs ${getPermissionColor(perm)}`}>
                        {getPermissionLabel(perm)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {group.members} thành viên
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingGroup) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-gray-900">
                {editingGroup ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingGroup(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Tên nhóm quyền *</label>
                <input
                  type="text"
                  placeholder="VD: Editor Công nghệ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mô tả</label>
                <textarea
                  placeholder="Mô tả vai trò và trách nhiệm của nhóm quyền này"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Danh mục áp dụng *</label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {['Tất cả', 'Công nghệ', 'Kinh tế', 'Xã hội', 'Văn hóa', 'Thể thao', 'Giải trí'].map((cat) => (
                    <div key={cat} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`cat-${cat}`}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`cat-${cat}`} className="text-gray-700">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-3">Quyền hạn *</label>
                <div className="grid grid-cols-2 gap-4">
                  {allPermissions.map((perm) => (
                    <div key={perm.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={`perm-${perm.id}`}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={`perm-${perm.id}`} className="text-gray-900 cursor-pointer">
                            {perm.label}
                          </label>
                          <div className="text-xs text-gray-600 mt-1">{perm.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Thành viên</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm và thêm thành viên..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingGroup(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4" />
                <span>Lưu nhóm quyền</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
