import { useState } from 'react';
import { Shield, Users, Edit2, Trash2, Plus, Search, Crown, Star, CheckCircle, X, Save, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import toast from './Toast';
import { ConfirmDialog } from './ConfirmDialog';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'articles' | 'categories' | 'media' | 'users' | 'settings' | 'advanced';
}

interface Role {
  id: number;
  name: string;
  key: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
  icon: any;
  isSystem: boolean;
}

interface UserRolesProps {
  onNavigate?: (page: any) => void;
}

export function UserRoles({ onNavigate }: UserRolesProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

  // All available permissions
  const allPermissions: Permission[] = [
    // Articles
    { id: 'articles.view', name: t('users.roles.viewArticles'), description: t('users.roles.viewArticlesDesc'), category: 'articles' },
    { id: 'articles.create', name: t('users.roles.createArticles'), description: t('users.roles.createArticlesDesc'), category: 'articles' },
    { id: 'articles.edit.own', name: t('users.roles.editOwnArticles'), description: t('users.roles.editOwnArticlesDesc'), category: 'articles' },
    { id: 'articles.edit.all', name: t('users.roles.editAllArticles'), description: t('users.roles.editAllArticlesDesc'), category: 'articles' },
    { id: 'articles.delete.own', name: t('users.roles.deleteOwnArticles'), description: t('users.roles.deleteOwnArticlesDesc'), category: 'articles' },
    { id: 'articles.delete.all', name: t('users.roles.deleteAllArticles'), description: t('users.roles.deleteAllArticlesDesc'), category: 'articles' },
    { id: 'articles.publish', name: t('users.roles.publishArticles'), description: t('users.roles.publishArticlesDesc'), category: 'articles' },
    { id: 'articles.approve', name: t('users.roles.approveArticles'), description: t('users.roles.approveArticlesDesc'), category: 'articles' },
    
    // Categories
    { id: 'categories.view', name: t('users.roles.viewCategories'), description: t('users.roles.viewCategoriesDesc'), category: 'categories' },
    { id: 'categories.create', name: t('users.roles.createCategories'), description: t('users.roles.createCategoriesDesc'), category: 'categories' },
    { id: 'categories.edit', name: t('users.roles.editCategories'), description: t('users.roles.editCategoriesDesc'), category: 'categories' },
    { id: 'categories.delete', name: t('users.roles.deleteCategories'), description: t('users.roles.deleteCategoriesDesc'), category: 'categories' },
    
    // Media
    { id: 'media.view', name: t('users.roles.viewMedia'), description: t('users.roles.viewMediaDesc'), category: 'media' },
    { id: 'media.upload', name: t('users.roles.uploadMedia'), description: t('users.roles.uploadMediaDesc'), category: 'media' },
    { id: 'media.edit', name: t('users.roles.editMedia'), description: t('users.roles.editMediaDesc'), category: 'media' },
    { id: 'media.delete', name: t('users.roles.deleteMedia'), description: t('users.roles.deleteMediaDesc'), category: 'media' },
    
    // Users
    { id: 'users.view', name: t('users.roles.viewUsers'), description: t('users.roles.viewUsersDesc'), category: 'users' },
    { id: 'users.create', name: t('users.roles.createUsers'), description: t('users.roles.createUsersDesc'), category: 'users' },
    { id: 'users.edit', name: t('users.roles.editUsers'), description: t('users.roles.editUsersDesc'), category: 'users' },
    { id: 'users.delete', name: t('users.roles.deleteUsers'), description: t('users.roles.deleteUsersDesc'), category: 'users' },
    { id: 'users.permissions', name: t('users.roles.managePermissions'), description: t('users.roles.managePermissionsDesc'), category: 'users' },
    
    // Settings
    { id: 'settings.view', name: t('users.roles.viewSettings'), description: t('users.roles.viewSettingsDesc'), category: 'settings' },
    { id: 'settings.edit', name: t('users.roles.editSettings'), description: t('users.roles.editSettingsDesc'), category: 'settings' },
    
    // Advanced
    { id: 'system.logs', name: t('users.roles.viewLogs'), description: t('users.roles.viewLogsDesc'), category: 'advanced' },
    { id: 'system.backup', name: t('users.roles.systemBackup'), description: t('users.roles.systemBackupDesc'), category: 'advanced' },
    { id: 'system.api', name: t('users.roles.apiAccess'), description: t('users.roles.apiAccessDesc'), category: 'advanced' },
  ];

  // Roles data
  const roles: Role[] = [
    {
      id: 1,
      name: 'Super Admin',
      key: 'super_admin',
      description: t('users.roles.superAdminDesc'),
      userCount: 2,
      permissions: allPermissions.map(p => p.id),
      color: 'red',
      icon: Crown,
      isSystem: true,
    },
    {
      id: 2,
      name: 'Admin',
      key: 'admin',
      description: t('users.roles.adminDesc'),
      userCount: 3,
      permissions: [
        'articles.view', 'articles.create', 'articles.edit.all', 'articles.delete.all', 'articles.publish', 'articles.approve',
        'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
        'media.view', 'media.upload', 'media.edit', 'media.delete',
        'users.view', 'users.create', 'users.edit',
        'settings.view',
      ],
      color: 'blue',
      icon: Shield,
      isSystem: true,
    },
    {
      id: 3,
      name: 'Editor',
      key: 'editor',
      description: t('users.roles.editorDesc'),
      userCount: 5,
      permissions: [
        'articles.view', 'articles.create', 'articles.edit.all', 'articles.publish', 'articles.approve',
        'categories.view', 'categories.create', 'categories.edit',
        'media.view', 'media.upload', 'media.edit',
      ],
      color: 'purple',
      icon: Shield,
      isSystem: true,
    },
    {
      id: 4,
      name: 'Author',
      key: 'author',
      description: t('users.roles.authorDesc'),
      userCount: 12,
      permissions: [
        'articles.view', 'articles.create', 'articles.edit.own', 'articles.delete.own',
        'categories.view',
        'media.view', 'media.upload',
      ],
      color: 'green',
      icon: Star,
      isSystem: true,
    },
    {
      id: 5,
      name: 'Contributor',
      key: 'contributor',
      description: t('users.roles.contributorDesc'),
      userCount: 8,
      permissions: [
        'articles.view', 'articles.create', 'articles.edit.own',
        'categories.view',
        'media.view',
      ],
      color: 'orange',
      icon: Users,
      isSystem: false,
    },
    {
      id: 6,
      name: 'SEO Specialist',
      key: 'seo_specialist',
      description: t('users.roles.seoSpecialistDesc'),
      userCount: 3,
      permissions: [
        'articles.view', 'articles.edit.all',
        'categories.view', 'categories.edit',
        'media.view',
      ],
      color: 'indigo',
      icon: Star,
      isSystem: false,
    },
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'articles': return t('users.roles.articlesCategory');
      case 'categories': return t('users.roles.categoriesCategory');
      case 'media': return t('users.roles.mediaCategory');
      case 'users': return t('users.roles.usersCategory');
      case 'settings': return t('users.roles.settingsCategory');
      case 'advanced': return t('users.roles.advancedCategory');
      default: return category;
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return allPermissions.filter(p => p.category === category);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title={t('users.roles.title')}
          description={t('users.roles.description')}
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPermissions(!showPermissions)}
                className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
              >
                {showPermissions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPermissions ? t('users.roles.hidePermissions') : t('users.roles.showAllPermissions')}</span>
              </button>
              <button
                onClick={() => setShowAddRole(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>{t('users.roles.createRole')}</span>
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{roles.length}</div>
                <div className="text-sm text-muted-foreground">{t('users.roles.totalRoles')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{roles.reduce((sum, r) => sum + r.userCount, 0)}</div>
                <div className="text-sm text-muted-foreground">{t('users.roles.totalUsers')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{allPermissions.length}</div>
                <div className="text-sm text-muted-foreground">{t('users.roles.totalPermissions')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{roles.filter(r => !r.isSystem).length}</div>
                <div className="text-sm text-muted-foreground">{t('users.roles.customRoles')}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* All Permissions Panel */}
        {showPermissions && (
          <Card>
            <h3 className="text-foreground mb-4">{t('users.roles.allSystemPermissions')}</h3>
            <div className="space-y-4">
              {['articles', 'categories', 'media', 'users', 'settings', 'advanced'].map((category) => (
                <div key={category}>
                  <h4 className="font-medium text-foreground mb-3">{getCategoryLabel(category)}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {getPermissionsByCategory(category).map((permission) => (
                      <div key={permission.id} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Roles List */}
        <Card>
          <div className="p-4 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('users.roles.searchRoles')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.id} className={`bg-gradient-to-br from-${role.color}-50 to-${role.color}-100 border border-${role.color}-200 rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-${role.color}-500 rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold text-${role.color}-900`}>{role.name}</h4>
                          {role.isSystem && (
                            <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
                              System
                            </span>
                          )}
                        </div>
                        <p className={`text-sm text-${role.color}-700 mt-1`}>{role.description}</p>
                      </div>
                    </div>
                    
                    {!role.isSystem && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingRole(role)}
                          className={`p-2 hover:bg-${role.color}-200 rounded-lg transition-colors`}
                          aria-label={t('users.roles.editRole')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setRoleToDelete(role)}
                          className={`p-2 hover:bg-${role.color}-200 rounded-lg transition-colors`}
                          aria-label={t('tooltips.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {role.userCount} {t('users.roles.usersCount')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {role.permissions.length} quyền
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2">{t('users.roles.mainPermissionsLabel')}</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 5).map((permId) => {
                        const perm = allPermissions.find(p => p.id === permId);
                        return perm ? (
                          <span key={permId} className={`px-2 py-1 bg-${role.color}-200 text-${role.color}-800 text-xs rounded-full`}>
                            {perm.name}
                          </span>
                        ) : null;
                      })}
                      {role.permissions.length > 5 && (
                        <span className={`px-2 py-1 bg-${role.color}-200 text-${role.color}-800 text-xs rounded-full`}>
                          +{role.permissions.length - 5} {t('users.roles.morePermissions')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Add/Edit Role Modal */}
        {(showAddRole || editingRole) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border/60 sticky top-0 bg-card z-10">
                <h2 className="text-foreground">
                  {editingRole ? t('users.roles.editRoleTitle') : t('users.roles.createRoleTitle')}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.roles.roleNameRequired')}</label>
                    <input
                      type="text"
                      placeholder={t('users.roles.roleNamePlaceholder')}
                      defaultValue={editingRole?.name}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.roles.roleKeyRequired')}</label>
                    <input
                      type="text"
                      placeholder={t('users.roles.roleKeyPlaceholder')}
                      defaultValue={editingRole?.key}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">{t('users.roles.roleDescriptionLabel')}</label>
                  <textarea
                    placeholder={t('users.roles.roleDescriptionPlaceholder')}
                    defaultValue={editingRole?.description}
                    rows={3}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <h3 className="text-foreground mb-4">{t('users.roles.selectPermissions')}</h3>
                  <div className="space-y-4">
                    {['articles', 'categories', 'media', 'users', 'settings', 'advanced'].map((category) => (
                      <div key={category} className="border border-border/60 rounded-xl p-4">
                        <h4 className="font-medium text-foreground mb-3">{getCategoryLabel(category)}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {getPermissionsByCategory(category).map((permission) => (
                            <label key={permission.id} className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                defaultChecked={editingRole?.permissions.includes(permission.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-foreground">{permission.name}</div>
                                <div className="text-xs text-muted-foreground">{permission.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3 sticky bottom-0 bg-card">
                <button
                  onClick={() => {
                    setShowAddRole(false);
                    setEditingRole(null);
                  }}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                  disabled={saving}
                >
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleSaveRole}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  {saving ? t('users.roles.saving') : (editingRole ? t('common.save') : t('users.roles.save'))}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!roleToDelete}
          onClose={() => setRoleToDelete(null)}
          onConfirm={handleDeleteRole}
          title={t('users.roles.deleteRoleTitle')}
          message={`${t('users.roles.deleteRoleMessage').replace('{{name}}', roleToDelete?.name || '')}`}
          confirmText={t('users.roles.confirmDelete')}
          cancelText={t('common.cancel')}
          variant="danger"
        />
      </div>
    </PageWrapper>
  );

  function handleSaveRole() {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      if (editingRole) {
        toast.success(t('users.roles.roleUpdated'));
        setEditingRole(null);
      } else {
        toast.success(t('users.roles.roleCreated'));
        setShowAddRole(false);
      }
    }, 1000);
  }

  function handleDeleteRole() {
    if (!roleToDelete) return;
    // Simulate API call
    toast.success(t('users.roles.roleDeleted'));
    setRoleToDelete(null);
  }
}