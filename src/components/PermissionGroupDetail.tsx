import { useState } from 'react';
import { 
  ArrowLeft, Edit2, Trash2, Shield, Users, Lock, Settings, Save, X, Plus,
  UserPlus, CheckCircle, XCircle, Calendar, Clock, BarChart3, Tag, Mail,
  FileText, Eye, AlertCircle
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

interface PermissionGroupDetailProps {
  groupId?: number;
  onBack: () => void;
  onNavigate: (page: any) => void;
  onEdit?: (groupId: number) => void;
  onDelete?: (groupId: number) => void;
}

interface PermissionGroup {
  id: number;
  name: string;
  description: string;
  categories: string[];
  permissions: string[];
  members: Member[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  active: boolean;
}

interface Member {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

interface Permission {
  id: string;
  label: string;
  description: string;
  category: 'content' | 'moderation' | 'admin';
}

export function PermissionGroupDetail({ 
  groupId = 1, 
  onBack, 
  onNavigate,
  onEdit,
  onDelete 
}: PermissionGroupDetailProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'permissions' | 'settings'>('overview');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  // Mock data
  const group: PermissionGroup = {
    id: groupId,
    name: 'Editor Công nghệ',
    description: 'Quản lý nội dung chuyên mục Công nghệ, AI, và Khoa học. Có quyền tạo, chỉnh sửa và xóa bài viết.',
    categories: ['Công nghệ', 'Khoa học', 'AI & Machine Learning', 'Phần mềm'],
    permissions: ['read', 'write', 'edit', 'delete', 'publish'],
    members: [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Editor',
        joinedAt: '2024-01-15',
        status: 'active',
      },
      {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Writer',
        joinedAt: '2024-02-20',
        status: 'active',
      },
      {
        id: 3,
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Contributor',
        joinedAt: '2024-03-10',
        status: 'inactive',
      },
    ],
    createdAt: '2024-01-10 10:00',
    updatedAt: '2024-12-26 14:30',
    createdBy: 'Admin',
    active: true,
  };

  const allPermissions: Permission[] = [
    { id: 'read', label: 'Xem', description: 'Xem nội dung và bài viết', category: 'content' },
    { id: 'write', label: 'Viết', description: 'Tạo nội dung và bài viết mới', category: 'content' },
    { id: 'edit', label: 'Sửa', description: 'Chỉnh sửa nội dung hiện có', category: 'content' },
    { id: 'delete', label: 'Xóa', description: 'Xóa nội dung và bài viết', category: 'content' },
    { id: 'review', label: 'Duyệt', description: 'Duyệt và review nội dung', category: 'moderation' },
    { id: 'approve', label: 'Phê duyệt', description: 'Phê duyệt cuối cùng trước xuất bản', category: 'moderation' },
    { id: 'publish', label: 'Xuất bản', description: 'Xuất bản nội dung lên website', category: 'content' },
    { id: 'manage_users', label: 'Quản lý người dùng', description: 'Thêm/xóa người dùng', category: 'admin' },
    { id: 'manage_settings', label: 'Quản lý cài đặt', description: 'Thay đổi cài đặt hệ thống', category: 'admin' },
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

  const getPermissionLabel = (permId: string) => {
    const perm = allPermissions.find(p => p.id === permId);
    return perm?.label || permId;
  };

  const handleDelete = () => {
    if (confirm(t('confirmations.deletePermissionGroupWithMembers', { name: group.name }))) {
      onDelete?.(groupId);
      onBack();
    }
  };

  const handleRemoveMember = (memberId: number) => {
    if (confirm(t('confirmations.removeMember'))) {
      console.log('Remove member:', memberId);
    }
  };

  const stats = [
    { label: 'Tổng thành viên', value: group.members.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Đang hoạt động', value: group.members.filter(m => m.status === 'active').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Danh mục', value: group.categories.length, icon: Tag, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Quyền hạn', value: group.permissions.length, icon: Lock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        title={group.name}
        description={group.description}
        breadcrumbs={[
          { label: 'Nhóm quyền', onClick: onBack },
          { label: group.name },
        ]}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-card border border-border/60 text-foreground rounded-xl hover:bg-muted transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              onClick={() => onEdit?.(groupId)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl">{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-border">
          <div className="flex gap-6 px-6">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'members', label: 'Thành viên', icon: Users },
              { id: 'permissions', label: 'Quyền hạn', icon: Lock },
              { id: 'settings', label: 'Cài đặt', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Thông tin nhóm quyền
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Tên nhóm</label>
                    <p className="mt-1">{group.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Trạng thái</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        group.active 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {group.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {group.active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Mô tả</label>
                    <p className="mt-1 text-sm">{group.description}</p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  Danh mục áp dụng ({group.categories.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.categories.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Permissions Overview */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-600" />
                  Quyền hạn ({group.permissions.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.permissions.map((perm) => (
                    <span
                      key={perm}
                      className={`px-3 py-1.5 rounded-lg text-sm ${getPermissionColor(perm)}`}
                    >
                      {getPermissionLabel(perm)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Members */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Thành viên gần đây
                </h3>
                <div className="space-y-3">
                  {group.members.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Thông tin khác
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Ngày tạo</label>
                    <p className="mt-1">{group.createdAt} bởi {group.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Cập nhật lần cuối</label>
                    <p className="mt-1">{group.updatedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg">Danh sách thành viên</h3>
                  <p className="text-sm text-muted-foreground">
                    Tổng cộng {group.members.length} thành viên
                  </p>
                </div>
                <button
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Thêm thành viên
                </button>
              </div>

              <div className="space-y-3">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([...selectedMembers, member.id]);
                        } else {
                          setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {member.joinedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Xóa khỏi nhóm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Quyền hạn của nhóm</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Danh sách các quyền được cấp cho nhóm này
                </p>

                {/* Group by category */}
                {['content', 'moderation', 'admin'].map(category => {
                  const categoryPerms = allPermissions.filter(p => p.category === category);
                  const categoryLabel = {
                    content: 'Quản lý nội dung',
                    moderation: 'Kiểm duyệt',
                    admin: 'Quản trị',
                  }[category];

                  return (
                    <div key={category} className="mb-6">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        {categoryLabel}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryPerms.map((perm) => {
                          const hasPermission = group.permissions.includes(perm.id);
                          return (
                            <div
                              key={perm.id}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                hasPermission
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-border bg-muted/40'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {hasPermission ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-medium">{perm.label}</h5>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {perm.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Cài đặt nhóm quyền</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
                    <div>
                      <h4 className="font-medium">Kích hoạt nhóm quyền</h4>
                      <p className="text-sm text-muted-foreground">
                        Cho phép thành viên sử dụng quyền trong nhóm này
                      </p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        group.active ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          group.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
                    <div>
                      <h4 className="font-medium">Tự động duyệt thành viên mới</h4>
                      <p className="text-sm text-muted-foreground">
                        Tự động thêm thành viên vào nhóm khi được mời
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
                    <div>
                      <h4 className="font-medium">Thông báo email</h4>
                      <p className="text-sm text-muted-foreground">
                        Gửi email thông báo khi có thay đổi về quyền
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Xóa nhóm quyền
                </h4>
                <p className="text-sm text-red-600 mb-4">
                  Hành động này không thể hoàn tác. Tất cả thành viên sẽ mất quyền truy cập này.
                </p>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Xóa nhóm quyền này
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}