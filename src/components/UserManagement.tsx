import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, Mail, Phone, Calendar, Lock, CheckCircle, XCircle, Filter, Download, MoreVertical, User as UserIcon, Crown, Star, X, Save, DollarSign, Coins, TrendingUp } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { formatCurrency, formatCurrencyCompact } from '../utils/royaltyHelpers';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'contributor';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  phone?: string;
  articlesCount: number;
  joinedDate: string;
  lastActive: string;
  // Royalty Integration
  totalRoyalty?: number;
  paidRoyalty?: number;
  pendingRoyalty?: number;
  royaltyConfig?: string;
}

interface UserManagementProps {
  onNavigate?: (page: any) => void;
}

export function UserManagement({ onNavigate }: UserManagementProps) {
  const { t } = useLanguage();
  const { isRoyaltyEnabled } = useSystemSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [saveAndAddMore, setSaveAndAddMore] = useState(false);

  // Mở rộng danh sách người dùng demo
  const users: User[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@cms.com',
      role: 'admin',
      status: 'active',
      phone: '0123456789',
      articlesCount: 247,
      joinedDate: '01/01/2023',
      lastActive: '5 phút trước',
      // Royalty Integration
      totalRoyalty: 1500000,
      paidRoyalty: 1000000,
      pendingRoyalty: 500000,
      royaltyConfig: '10%',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@cms.com',
      role: 'editor',
      status: 'active',
      phone: '0987654321',
      articlesCount: 189,
      joinedDate: '15/02/2023',
      lastActive: '1 giờ trước',
      // Royalty Integration
      totalRoyalty: 1200000,
      paidRoyalty: 800000,
      pendingRoyalty: 400000,
      royaltyConfig: '8%',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@cms.com',
      role: 'author',
      status: 'active',
      articlesCount: 156,
      joinedDate: '20/03/2023',
      lastActive: '3 giờ trước',
      // Royalty Integration
      totalRoyalty: 1000000,
      paidRoyalty: 600000,
      pendingRoyalty: 400000,
      royaltyConfig: '6%',
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      email: 'phamthid@cms.com',
      role: 'contributor',
      status: 'inactive',
      articlesCount: 34,
      joinedDate: '10/05/2023',
      lastActive: '2 ngày trước',
      // Royalty Integration
      totalRoyalty: 500000,
      paidRoyalty: 300000,
      pendingRoyalty: 200000,
      royaltyConfig: '4%',
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      email: 'hoangvane@cms.com',
      role: 'author',
      status: 'suspended',
      articlesCount: 78,
      joinedDate: '05/06/2023',
      lastActive: '1 tuần trước',
      // Royalty Integration
      totalRoyalty: 800000,
      paidRoyalty: 500000,
      pendingRoyalty: 300000,
      royaltyConfig: '5%',
    },
    {
      id: 6,
      name: 'Đỗ Thị F',
      email: 'dothif@cms.com',
      role: 'editor',
      status: 'active',
      phone: '0345678901',
      articlesCount: 203,
      joinedDate: '10/01/2023',
      lastActive: '30 phút trước',
      // Royalty Integration
      totalRoyalty: 1300000,
      paidRoyalty: 900000,
      pendingRoyalty: 400000,
      royaltyConfig: '9%',
    },
    {
      id: 7,
      name: 'Vũ Văn G',
      email: 'vuvang@cms.com',
      role: 'author',
      status: 'active',
      phone: '0234567890',
      articlesCount: 134,
      joinedDate: '25/02/2023',
      lastActive: '2 giờ trước',
      // Royalty Integration
      totalRoyalty: 1100000,
      paidRoyalty: 700000,
      pendingRoyalty: 400000,
      royaltyConfig: '7%',
    },
    {
      id: 8,
      name: 'Bùi Thị H',
      email: 'buithih@cms.com',
      role: 'contributor',
      status: 'active',
      phone: '0567890123',
      articlesCount: 67,
      joinedDate: '15/03/2023',
      lastActive: '5 giờ trước',
      // Royalty Integration
      totalRoyalty: 600000,
      paidRoyalty: 400000,
      pendingRoyalty: 200000,
      royaltyConfig: '3%',
    },
  ];

  const roles = [
    { id: 'admin', label: 'Admin', color: 'red', icon: Crown, permissions: [t('users.management.fullSystemAccess')] },
    { id: 'editor', label: 'Editor', color: 'blue', icon: Shield, permissions: [t('users.management.approveArticles'), t('users.management.editAllArticles')] },
    { id: 'author', label: 'Author', color: 'green', icon: Star, permissions: [t('users.management.createEditOwn')] },
    { id: 'contributor', label: 'Contributor', color: 'orange', icon: UserIcon, permissions: [t('users.management.createDrafts')] },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'editor': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'author': return 'bg-green-100 text-green-700 border-green-200';
      case 'contributor': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title={t('users.management.title')}
          description={t('users.management.description')}
          action={
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <Download className="w-4 h-4" />
                <span>{t('users.management.exportList')}</span>
              </button>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>{t('users.management.addUser')}</span>
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const count = users.filter(u => u.role === role.id).length;
            return (
              <div key={role.id} className={`bg-gradient-to-br from-${role.color}-50 to-${role.color}-100 border border-${role.color}-200 rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${role.color}-500 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`text-3xl font-bold text-${role.color}-700 mb-1`}>{count}</div>
                <div className={`text-sm text-${role.color}-600`}>{role.label}</div>
              </div>
            );
          })}
        </div>

        {/* Roles & Permissions */}
        <Card>
          <h3 className="text-foreground mb-4">{t('users.management.rolesPermissions')}</h3>
          <div className="grid grid-cols-4 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.id} className={`bg-gradient-to-br from-${role.color}-50 to-${role.color}-100 border border-${role.color}-200 rounded-xl p-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${role.color}-500 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={`text-${role.color}-900 font-medium`}>{role.label}</div>
                  </div>
                  <ul className={`space-y-1 text-xs text-${role.color}-700`}>
                    {role.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          {/* Filters */}
          <div className="p-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('placeholders.searchArticles')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="all">-- Vai trò --</option>
                <option value="admin">{t('users.management.admin')}</option>
                <option value="editor">{t('users.management.editor')}</option>
                <option value="author">{t('users.management.author')}</option>
                <option value="contributor">{t('users.management.contributor')}</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <Filter className="w-4 h-4" />
                <span>{t('users.management.filter')}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.management.user')}</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.management.role')}</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.management.status')}</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.management.articles')}</th>
                {isRoyaltyEnabled && (
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Nhuận bút</th>
                )}
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.management.joined')}</th>
                <th className="text-right px-6 py-4 text-sm text-muted-foreground">{t('users.management.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => onNavigate?.({ page: 'user-detail', id: user.id })}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-blue-600 transition-colors">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {roles.find(r => r.id === user.role)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? t('users.management.active') : user.status === 'inactive' ? t('users.management.inactive') : t('users.management.suspended')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{user.articlesCount}</td>
                  {isRoyaltyEnabled && (
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.totalRoyalty ? formatCurrencyCompact(user.totalRoyalty) : 'N/A'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.joinedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors" title={t('tooltips.changePassword')}>
                        <Lock className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title={t('tooltips.delete')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-2xl w-full">
              <div className="p-6 border-b border-border/60">
                <h2 className="text-foreground">{t('users.management.addUserTitle')}</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.management.fullNameRequired')}</label>
                    <input
                      type="text"
                      placeholder={t('placeholders.fullName')}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.management.emailRequired')}</label>
                    <input
                      type="email"
                      placeholder={t('placeholders.email')}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.management.phone')}</label>
                    <input
                      type="tel"
                      placeholder={t('placeholders.phone')}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.management.roleRequired')}</label>
                    <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                      <option value="contributor">{t('users.management.contributor')}</option>
                      <option value="author">{t('users.management.author')}</option>
                      <option value="editor">{t('users.management.editor')}</option>
                      <option value="admin">{t('users.management.admin')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.management.passwordRequired')}</label>
                    <input
                      type="password"
                      placeholder={t('placeholders.password')}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('users.management.confirmPasswordRequired')}</label>
                    <input
                      type="password"
                      placeholder={t('placeholders.confirmPassword')}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <input type="checkbox" id="sendEmail" className="rounded" />
                  <label htmlFor="sendEmail" className="text-sm text-blue-800">
                    {t('users.management.sendEmailNotification')}
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  {t('users.management.cancel')}
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                  {t('users.management.createAccount')}
                </button>
                <button
                  onClick={() => setSaveAndAddMore(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  {t('users.management.saveAndAddAnother')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}