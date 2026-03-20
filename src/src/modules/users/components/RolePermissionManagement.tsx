import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Lock,
  Unlock,
  Check,
  X,
  Search,
  AlertCircle
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  key: string;
  description: string;
  category: 'articles' | 'media' | 'users' | 'settings' | 'analytics' | 'system';
}

interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  color: string;
  isSystem: boolean;
  isActive: boolean;
  userCount: number;
  permissions: string[]; // Permission IDs
  createdAt: string;
  updatedAt: string;
}

const PERMISSION_CATEGORIES = [
  { key: 'articles', label: 'Articles', icon: '📝', color: '#3B82F6' },
  { key: 'media', label: 'Media', icon: '🖼️', color: '#8B5CF6' },
  { key: 'users', label: 'Users', icon: '👥', color: '#10B981' },
  { key: 'settings', label: 'Settings', icon: '⚙️', color: '#F59E0B' },
  { key: 'analytics', label: 'Analytics', icon: '📊', color: '#EF4444' },
  { key: 'system', label: 'System', icon: '🔧', color: '#06B6D4' },
];

export const RolePermissionManagement: React.FC = () => {
  const notifications = useNotifications();
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<Role>>({});

  // Fetch permissions
  const { data: permissions } = useFetch<Permission[]>(
    ['permissions'],
    async () => {
      return [
        // Articles
        { id: 'p1', name: 'View Articles', key: 'articles.view', description: 'Can view articles', category: 'articles' },
        { id: 'p2', name: 'Create Articles', key: 'articles.create', description: 'Can create new articles', category: 'articles' },
        { id: 'p3', name: 'Edit Articles', key: 'articles.edit', description: 'Can edit existing articles', category: 'articles' },
        { id: 'p4', name: 'Delete Articles', key: 'articles.delete', description: 'Can delete articles', category: 'articles' },
        { id: 'p5', name: 'Publish Articles', key: 'articles.publish', description: 'Can publish articles', category: 'articles' },
        { id: 'p6', name: 'Manage Categories', key: 'articles.categories', description: 'Can manage categories', category: 'articles' },
        
        // Media
        { id: 'p7', name: 'View Media', key: 'media.view', description: 'Can view media library', category: 'media' },
        { id: 'p8', name: 'Upload Media', key: 'media.upload', description: 'Can upload files', category: 'media' },
        { id: 'p9', name: 'Delete Media', key: 'media.delete', description: 'Can delete files', category: 'media' },
        
        // Users
        { id: 'p10', name: 'View Users', key: 'users.view', description: 'Can view user list', category: 'users' },
        { id: 'p11', name: 'Create Users', key: 'users.create', description: 'Can create new users', category: 'users' },
        { id: 'p12', name: 'Edit Users', key: 'users.edit', description: 'Can edit user details', category: 'users' },
        { id: 'p13', name: 'Delete Users', key: 'users.delete', description: 'Can delete users', category: 'users' },
        { id: 'p14', name: 'Manage Roles', key: 'users.roles', description: 'Can manage user roles', category: 'users' },
        
        // Settings
        { id: 'p15', name: 'View Settings', key: 'settings.view', description: 'Can view settings', category: 'settings' },
        { id: 'p16', name: 'Edit Settings', key: 'settings.edit', description: 'Can edit settings', category: 'settings' },
        
        // Analytics
        { id: 'p17', name: 'View Analytics', key: 'analytics.view', description: 'Can view analytics', category: 'analytics' },
        { id: 'p18', name: 'Export Analytics', key: 'analytics.export', description: 'Can export analytics data', category: 'analytics' },
        
        // System
        { id: 'p19', name: 'System Admin', key: 'system.admin', description: 'Full system access', category: 'system' },
        { id: 'p20', name: 'View Logs', key: 'system.logs', description: 'Can view system logs', category: 'system' },
      ];
    }
  );

  // Fetch roles
  const { data: roles, isLoading, refetch } = useFetch<Role[]>(
    ['roles'],
    async () => {
      return [
        {
          id: '1',
          name: 'Super Admin',
          key: 'super_admin',
          description: 'Full system access with all permissions',
          color: '#EF4444',
          isSystem: true,
          isActive: true,
          userCount: 2,
          permissions: permissions?.map(p => p.id) || [],
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Editor',
          key: 'editor',
          description: 'Can manage articles and media',
          color: '#3B82F6',
          isSystem: true,
          isActive: true,
          userCount: 15,
          permissions: ['p1', 'p2', 'p3', 'p5', 'p6', 'p7', 'p8'],
          createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Author',
          key: 'author',
          description: 'Can create and edit own articles',
          color: '#10B981',
          isSystem: true,
          isActive: true,
          userCount: 45,
          permissions: ['p1', 'p2', 'p3', 'p7', 'p8'],
          createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          name: 'Viewer',
          key: 'viewer',
          description: 'Read-only access to content',
          color: '#6B7280',
          isSystem: false,
          isActive: true,
          userCount: 120,
          permissions: ['p1', 'p7', 'p10', 'p15', 'p17'],
          createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          name: 'Content Manager',
          key: 'content_manager',
          description: 'Manage all content but not users',
          color: '#8B5CF6',
          isSystem: false,
          isActive: true,
          userCount: 8,
          permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p17'],
          createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  );

  // Create/Update role mutation
  const { mutate: saveRole, isPending: isSaving } = useMutate(
    async (data: Partial<Role>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã lưu vai trò thành công');
        setShowEditModal(false);
        setEditingRole({});
        refetch();
      },
    }
  );

  // Delete role mutation
  const { mutate: deleteRole } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã xóa vai trò');
        refetch();
      },
    }
  );

  // Duplicate role mutation
  const { mutate: duplicateRole } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã nhân bản vai trò');
        refetch();
      },
    }
  );

  // Toggle active mutation
  const { mutate: toggleActive } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const togglePermission = (permissionId: string) => {
    const currentPermissions = editingRole.permissions || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(p => p !== permissionId)
      : [...currentPermissions, permissionId];
    
    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions?.filter(p => p.category === category) || [];
  };

  const filteredRoles = roles?.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Vai trò & Quyền hạn
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý vai trò người dùng và kiểm soát truy cập
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRole({ permissions: [] });
            setShowEditModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Tạo Vai Trò
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Roles', value: roles?.length || 0, icon: '🎭' },
          { label: 'Active Roles', value: roles?.filter(r => r.isActive).length || 0, icon: '✅' },
          { label: 'Total Users', value: roles?.reduce((sum, r) => sum + r.userCount, 0) || 0, icon: '👥' },
          { label: 'Permissions', value: permissions?.length || 0, icon: '🔐' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'roles'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <Shield className="w-5 h-5 inline mr-2" />
          Roles ({roles?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'permissions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <Lock className="w-5 h-5 inline mr-2" />
          All Permissions ({permissions?.length || 0})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'roles' ? (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Roles List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles?.map((role) => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: role.color + '20' }}
                    >
                      <Shield className="w-6 h-6" style={{ color: role.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      {role.isSystem && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                          System Role
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {role.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {role.userCount} users
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    {role.permissions.length} perms
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => toggleActive(role.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      role.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {role.isActive ? (
                      <>
                        <Check className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setShowEditModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => duplicateRole(role.id)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete role "${role.name}"?`)) {
                          deleteRole(role.id);
                        }
                      }}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Permissions by Category */}
          {PERMISSION_CATEGORIES.map((category) => {
            const categoryPermissions = getPermissionsByCategory(category.key);
            if (categoryPermissions.length === 0) return null;

            return (
              <div key={category.key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categoryPermissions.length} permissions
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{permission.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {permission.key}
                          </p>
                        </div>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {permission.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Role Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingRole.id ? 'Sửa vai trò' : 'Tạo vai trò'}
            </h3>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingRole.name || ''}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    placeholder="e.g., Content Manager"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Role Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingRole.key || ''}
                    onChange={(e) => setEditingRole({ ...editingRole, key: e.target.value })}
                    placeholder="e.g., content_manager"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editingRole.description || ''}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this role..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={editingRole.color || '#3B82F6'}
                  onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                  className="w-32 h-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer"
                />
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-semibold mb-3">Permissions</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {PERMISSION_CATEGORIES.map((category) => {
                    const categoryPermissions = getPermissionsByCategory(category.key);
                    if (categoryPermissions.length === 0) return null;

                    const selectedCount = categoryPermissions.filter(p => 
                      editingRole.permissions?.includes(p.id)
                    ).length;

                    return (
                      <div key={category.key} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.label}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({selectedCount}/{categoryPermissions.length})
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const allCategoryIds = categoryPermissions.map(p => p.id);
                              const allSelected = allCategoryIds.every(id => 
                                editingRole.permissions?.includes(id)
                              );
                              
                              if (allSelected) {
                                // Deselect all in category
                                setEditingRole({
                                  ...editingRole,
                                  permissions: editingRole.permissions?.filter(
                                    id => !allCategoryIds.includes(id)
                                  ) || []
                                });
                              } else {
                                // Select all in category
                                const newPermissions = new Set([
                                  ...(editingRole.permissions || []),
                                  ...allCategoryIds
                                ]);
                                setEditingRole({
                                  ...editingRole,
                                  permissions: Array.from(newPermissions)
                                });
                              }
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedCount === categoryPermissions.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryPermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={editingRole.permissions?.includes(permission.id) || false}
                                onChange={() => togglePermission(permission.id)}
                                className="w-4 h-4 text-blue-600 rounded mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{permission.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingRole.isActive !== false}
                  onChange={(e) => setEditingRole({ ...editingRole, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">Active (role can be assigned to users)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRole({});
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => saveRole(editingRole)}
                disabled={isSaving || !editingRole.name || !editingRole.key}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Đang lưu...' : editingRole.id ? 'Cập nhật' : 'Tạo vai trò'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};