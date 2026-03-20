import { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2, UserPlus, X, Crown, Mail, Shield, Star, DollarSign, Calculator, TrendingUp, CheckCircle } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

interface UserGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  color: string;
  leader?: {
    name: string;
    avatar: string;
  };
  members: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  }>;
  createdDate: string;
}

interface UserGroupsProps {
  onNavigate?: (page: any) => void;
}

export function UserGroups({ onNavigate }: UserGroupsProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<UserGroup | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'royalty'>('info');
  const [groups, setGroups] = useState<UserGroup[]>([
    {
      id: 1,
      name: 'Biên tập viên Công nghệ',
      description: 'Nhóm biên tập viên chuyên về nội dung công nghệ và AI',
      memberCount: 8,
      color: 'blue',
      leader: {
        name: 'Trần Thị B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      members: [
        { id: 2, name: 'Trần Thị B', email: 'tranthib@cms.com', role: 'editor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 7, name: 'Vũ Văn G', email: 'vuvang@cms.com', role: 'author', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@cms.com', role: 'author' },
        { id: 8, name: 'Bùi Thị H', email: 'buithih@cms.com', role: 'contributor' },
      ],
      createdDate: '15/01/2024',
    },
    {
      id: 2,
      name: 'Quản trị hệ thống',
      description: 'Nhóm quản trị viên hệ thống CMS',
      memberCount: 3,
      color: 'red',
      leader: {
        name: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      },
      members: [
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@cms.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      ],
      createdDate: '01/01/2024',
    },
    {
      id: 3,
      name: 'Tác giả Tin tức',
      description: 'Nhóm tác giả viết nội dung tin tức thời sự',
      memberCount: 12,
      color: 'green',
      leader: {
        name: 'Đỗ Thị F',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
      members: [
        { id: 6, name: 'Đỗ Thị F', email: 'dothif@cms.com', role: 'editor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
      ],
      createdDate: '10/02/2024',
    },
    {
      id: 4,
      name: 'Cộng tác viên Multimedia',
      description: 'Nhóm cộng tác viên phụ trách nội dung video và podcast',
      memberCount: 6,
      color: 'purple',
      members: [
        { id: 4, name: 'Phạm Thị D', email: 'phamthid@cms.com', role: 'contributor' },
      ],
      createdDate: '20/03/2024',
    },
    {
      id: 5,
      name: 'SEO & Marketing',
      description: 'Nhóm chuyên về tối ưu SEO và marketing nội dung',
      memberCount: 5,
      color: 'orange',
      members: [],
      createdDate: '05/04/2024',
    },
  ]);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    leaderId: ''
  });

  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      color: group.color,
      leaderId: group.leader ? '1' : ''
    });
    setShowAddGroup(true);
  };

  const handleDeleteGroup = (group: UserGroup) => {
    setShowDeleteConfirm(group);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      setGroups(groups.filter(g => g.id !== showDeleteConfirm.id));
      setShowDeleteConfirm(null);
    }
  };

  const handleSaveGroup = () => {
    if (editingGroup) {
      // Update existing group
      setGroups(groups.map(g => 
        g.id === editingGroup.id 
          ? { ...g, name: formData.name, description: formData.description, color: formData.color }
          : g
      ));
    } else {
      // Add new group
      const newGroup: UserGroup = {
        id: Math.max(...groups.map(g => g.id)) + 1,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        memberCount: 0,
        members: [],
        createdDate: new Date().toLocaleDateString('vi-VN')
      };
      setGroups([...groups, newGroup]);
    }
    
    // Reset form
    setShowAddGroup(false);
    setEditingGroup(null);
    setFormData({ name: '', description: '', color: 'blue', leaderId: '' });
    setModalTab('info');
  };

  const handleCloseForm = () => {
    setShowAddGroup(false);
    setEditingGroup(null);
    setFormData({ name: '', description: '', color: 'blue', leaderId: '' });
    setModalTab('info');
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'red', icon: Crown };
      case 'editor':
        return { label: 'Editor', color: 'blue', icon: Shield };
      case 'author':
        return { label: 'Author', color: 'green', icon: Star };
      case 'contributor':
        return { label: 'Contributor', color: 'orange', icon: Users };
      default:
        return { label: 'User', color: 'gray', icon: Users };
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title={t('users.groups.title')}
          description={t('users.groups.description')}
          action={
            <button
              onClick={() => setShowAddGroup(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>{t('users.groups.createGroup')}</span>
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{groups.length}</div>
                <div className="text-sm text-muted-foreground">{t('users.groups.totalGroups')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{groups.reduce((sum, g) => sum + g.memberCount, 0)}</div>
                <div className="text-sm text-muted-foreground">{t('users.groups.totalMembers')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{groups.filter(g => g.leader).length}</div>
                <div className="text-sm text-muted-foreground">{t('users.groups.groupsWithLeader')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(groups.reduce((sum, g) => sum + g.memberCount, 0) / groups.length)}
                </div>
                <div className="text-sm text-muted-foreground">{t('users.groups.averageSize')}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Groups List */}
        <Card>
          <div className="p-4 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('users.groups.searchGroups')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`bg-gradient-to-br from-${group.color}-50 to-${group.color}-100 border border-${group.color}-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200`}
                onClick={() => setSelectedGroup(group)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-${group.color}-900 mb-2`}>{group.name}</h3>
                    <p className={`text-sm text-${group.color}-700`}>{group.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGroup(group);
                      }}
                      className={`p-2 hover:bg-${group.color}-200 rounded-lg transition-colors`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group);
                      }}
                      className={`p-2 hover:bg-${group.color}-200 rounded-lg transition-colors`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {group.leader && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-white/50 rounded-xl">
                    <img
                      src={group.leader.avatar}
                      alt={group.leader.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs text-muted-foreground">{t('users.groups.leader')}</div>
                      <div className="text-sm font-medium">{group.leader.name}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{group.memberCount} {t('users.groups.members')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('users.groups.createdOn')}: {group.createdDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Group Detail Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className={`p-6 border-b border-border/60 bg-gradient-to-br from-${selectedGroup.color}-50 to-${selectedGroup.color}-100`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-${selectedGroup.color}-900 mb-2`}>{selectedGroup.name}</h2>
                    <p className={`text-${selectedGroup.color}-700`}>{selectedGroup.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className={`p-2 hover:bg-${selectedGroup.color}-200 rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground">{t('users.groups.groupMembers')} ({selectedGroup.memberCount})</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>{t('users.groups.addMember')}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedGroup.members.map((member) => {
                    const roleInfo = getRoleInfo(member.role);
                    const RoleIcon = roleInfo.icon;
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">{member.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-${roleInfo.color}-100 text-${roleInfo.color}-700 border-${roleInfo.color}-200 flex items-center gap-1`}>
                            <RoleIcon className="w-3 h-3" />
                            {roleInfo.label}
                          </span>
                          <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Group Modal */}
        {showAddGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border/60">
                <h2 className="text-foreground">
                  {editingGroup ? t('users.groups.editGroup') : t('users.groups.createGroup')}
                </h2>
              </div>

              {/* Tabs */}
              <div className="border-b border-border/60 px-6">
                <div className="flex gap-1">
                  <button
                    onClick={() => setModalTab('info')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-200 ${
                      modalTab === 'info'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Thông tin nhóm</span>
                  </button>
                  <button
                    onClick={() => setModalTab('royalty')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-200 ${
                      modalTab === 'royalty'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Cấu hình nhuận bút</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {modalTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t('users.groups.groupNameRequired')}</label>
                      <input
                        type="text"
                        placeholder={t('users.groups.groupNamePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t('users.groups.groupDescriptionLabel')}</label>
                      <textarea
                        placeholder={t('users.groups.groupDescriptionPlaceholder')}
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t('users.groups.groupColor')}</label>
                      <div className="flex gap-2">
                        {['blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'yellow'].map((color) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-full bg-${color}-500 hover:ring-2 ring-${color}-500 ring-offset-2 transition-all ${formData.color === color ? 'ring-2 ring-offset-2' : ''}`}
                            onClick={() => setFormData({ ...formData, color })}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t('users.groups.selectLeader')}</label>
                      <select
                        value={formData.leaderId}
                        onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        <option value="">{t('users.groups.selectLeaderOptional')}</option>
                        <option value="1">Nguyễn Văn A</option>
                        <option value="2">Trần Thị B</option>
                        <option value="3">Lê Văn C</option>
                      </select>
                    </div>
                  </div>
                )}

                {modalTab === 'royalty' && (
                  <div className="space-y-6">
                    {/* Royalty Config Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-slate-900">Cấu hình nhuận bút nhóm</h4>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              ⭐ Đang áp dụng
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">Cấu hình này sẽ áp dụng cho tất cả thành viên trong nhóm</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm">
                          Chọn template
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/70 rounded-lg p-4">
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Loại cấu hình</label>
                          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                            <option>⚡ Kết hợp (Base + Views + Words)</option>
                            <option>💰 Cố định theo bài</option>
                            <option>👁️ Theo lượt xem</option>
                            <option>✍️ Theo số từ</option>
                          </select>
                        </div>

                        <div className="bg-white/70 rounded-lg p-4">
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Độ ưu tiên</label>
                          <input
                            type="number"
                            defaultValue={5}
                            min={1}
                            max={10}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <p className="text-xs text-slate-500 mt-1">P5: Group config (override global)</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white/70 rounded-lg p-4">
                          <label className="block text-xs font-semibold text-slate-700 mb-2">💵 Nhuận bút cơ bản / bài</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue={500000}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <span className="text-sm text-slate-600">VNĐ</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-white/70 rounded-lg p-4">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">👁️ Thưởng views</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                defaultValue={200}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <span className="text-xs text-slate-600">đ/view</span>
                            </div>
                          </div>

                          <div className="bg-white/70 rounded-lg p-4">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">✍️ Thưởng số từ</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                defaultValue={100}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <span className="text-xs text-slate-600">đ/từ</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/70 rounded-lg p-4">
                          <label className="block text-xs font-semibold text-slate-700 mb-2">⭐ Thưởng chất lượng (Quality Score ≥ 8)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue={1000000}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <span className="text-sm text-slate-600">VNĐ</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <Calculator className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-semibold text-purple-900 mb-1">Công thức tính</h5>
                            <p className="text-xs font-mono text-purple-800">
                              Royalty = Base (500k) + (Views × 200đ) + (Words × 100đ) + Quality Bonus (1M nếu QS ≥ 8)
                            </p>
                            <p className="text-xs text-purple-700 mt-2">
                              <strong>Ví dụ:</strong> Bài 1000 từ, 5000 views, QS=9 → 500k + 1M + 100k + 1M = <strong className="text-purple-900">2.6M VNĐ</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-slate-600">TB/bài dự kiến</span>
                        </div>
                        <div className="text-xl font-bold text-slate-900">2.2M VNĐ</div>
                        <div className="text-xs text-slate-500 mt-1">Dựa trên dữ liệu nhóm</div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-slate-600">Thành viên</span>
                        </div>
                        <div className="text-xl font-bold text-slate-900">{editingGroup?.memberCount || 0}</div>
                        <div className="text-xs text-slate-500 mt-1">Sẽ áp dụng config này</div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-slate-600">Trạng thái</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">Đang hoạt động</div>
                        <div className="text-xs text-slate-500 mt-1">Áp dụng ngay khi lưu</div>
                      </div>
                    </div>

                    {/* Help Text */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold text-amber-900 mb-1">Lưu ý về cấu hình nhóm</h5>
                          <ul className="text-xs text-amber-800 space-y-1">
                            <li>• Config nhóm sẽ override config toàn cục (priority 5 &gt; 1)</li>
                            <li>• Nếu thành viên có config riêng (priority 10), config đó sẽ được ưu tiên hơn</li>
                            <li>• Thay đổi sẽ áp dụng cho tất cả bài viết mới của thành viên nhóm</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={handleCloseForm}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  {t('users.groups.cancel')}
                </button>
                <button
                  onClick={handleSaveGroup}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  {t('users.groups.save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-2xl w-full">
              <div className="p-6 border-b border-border/60">
                <h2 className="text-foreground">{t('users.groups.deleteGroup')}</h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">{t('users.groups.deleteGroupConfirm', { name: showDeleteConfirm.name })}</p>
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  {t('users.groups.cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  {t('users.groups.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}