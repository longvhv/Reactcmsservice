import { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Search, Users, Lock, Eye, Tag, Info } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { PermissionGroupFormModal } from './PermissionGroupFormModal';
import { PermissionGroupDetail } from './PermissionGroupDetail';
import { useLanguage } from '../contexts/LanguageContext';

interface PermissionGroupsProps {
  onNavigate?: (page: any) => void;
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

export function PermissionGroups({ onNavigate }: PermissionGroupsProps) {
  const { t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDetailId, setViewingDetailId] = useState<number | null>(null);

  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([
    {
      id: 1,
      name: 'Editor Công nghệ',
      description: 'Quản lý nội dung chuyên mục Công nghệ',
      categories: ['Công nghệ', 'Khoa học'],
      permissions: ['read', 'write', 'edit', 'delete'],
      members: 12,
      active: true,
    },
    {
      id: 2,
      name: 'Contributor Tin tức',
      description: 'Đóng góp nội dung tin tức',
      categories: ['Tin tức', 'Thời sự'],
      permissions: ['read', 'write'],
      members: 24,
      active: true,
    },
    {
      id: 3,
      name: 'Reviewer',
      description: 'Duyệt bài viết',
      categories: ['Tất cả'],
      permissions: ['read', 'review', 'approve'],
      members: 8,
      active: true,
    },
    {
      id: 4,
      name: 'Publisher',
      description: 'Xuất bản nội dung',
      categories: ['Tất cả'],
      permissions: ['read', 'approve', 'publish'],
      members: 6,
      active: true,
    },
    {
      id: 5,
      name: 'Content Writer',
      description: 'Viết nội dung',
      categories: ['Tin tức', 'Thời sự', 'Văn hóa'],
      permissions: ['read', 'write'],
      members: 18,
      active: false,
    },
  ]);

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
      case 'read': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'write': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'edit': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'delete': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'approve': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'publish': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getPermissionLabel = (perm: string) => {
    const permission = allPermissions.find(p => p.id === perm);
    return permission?.label || perm;
  };

  const handleEditGroup = (id: number) => {
    const group = permissionGroups.find(g => g.id === id);
    if (group) {
      setEditingGroup(group);
      setShowCreateModal(true);
    }
  };

  const handleDeleteGroup = (id: number) => {
    const group = permissionGroups.find(g => g.id === id);
    if (group && confirm(t('confirmations.deletePermissionGroup', { name: group.name }))) {
      setPermissionGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveGroup = (formData: any, saveAndContinue?: boolean) => {
    if (editingGroup) {
      // Update existing group
      setPermissionGroups(prev =>
        prev.map(g => (g.id === editingGroup.id ? { ...g, ...formData } : g))
      );
      setEditingGroup(null);
    } else {
      // Create new group
      const newGroup: PermissionGroup = {
        id: Date.now(),
        ...formData,
        members: 0,
      };
      setPermissionGroups(prev => [...prev, newGroup]);
    }

    if (!saveAndContinue) {
      setShowCreateModal(false);
    }
  };

  // Filter groups by search term
  const filteredGroups = permissionGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show detail view
  if (viewingDetailId !== null) {
    return (
      <PermissionGroupDetail
        groupId={viewingDetailId}
        onBack={() => setViewingDetailId(null)}
        onNavigate={onNavigate || (() => {})}
        onEdit={(id) => {
          setViewingDetailId(null);
          handleEditGroup(id);
        }}
        onDelete={(id) => {
          setViewingDetailId(null);
          handleDeleteGroup(id);
        }}
      />
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Nhóm quyền"
        description="Quản lý quyền truy cập theo nhóm người dùng"
        action={
          <button
            onClick={() => {
              setEditingGroup(null);
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo nhóm quyền
          </button>
        }
      />

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('permissions.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{permissionGroups.length}</p>
            <p className="text-sm text-muted-foreground">Nhóm quyền</p>
          </div>
        </Card>
      </div>

      {/* Permission Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card key={group.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    group.active ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-900/30'
                  }`}>
                    <Shield className={`w-6 h-6 ${
                      group.active ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => setViewingDetailId(group.id)}
                        className="font-medium hover:text-blue-600 transition-colors text-left"
                      >
                        {group.name}
                      </button>
                      {!group.active && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          Tạm dừng
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setViewingDetailId(group.id)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditGroup(group.id)}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 rounded-lg transition-colors"
                    title="Chỉnh sa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                    title={t('tooltips.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Categories */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Danh mục áp dụng:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Quyền hạn:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.permissions.map((perm, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${getPermissionColor(perm)}`}
                      >
                        {getPermissionLabel(perm)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Members */}
                <div className="pt-3 border-t border-border">
                  <button
                    onClick={() => setViewingDetailId(group.id)}
                    className="text-sm text-muted-foreground hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    {group.members} thành viên
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Không tìm thấy nhóm quyền nào' : 'Chưa có nhóm quyền nào'}
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <PermissionGroupFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
      />
    </PageWrapper>
  );
}