import { useState } from 'react';
import { 
  ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, MapPin, Briefcase, 
  Shield, Lock, Activity, FileText, Clock, TrendingUp, Award, Star,
  Eye, MessageCircle, Heart, MoreVertical, Ban, Check, X, Save,
  Crown, Users, BookOpen, CheckCircle, XCircle, AlertCircle,
  BarChart3, PieChart, Settings, Key, Bell, Globe, DollarSign, Calculator
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRoyaltyConfig } from './UserRoyaltyConfig';

interface UserDetailProps {
  userId: number;
  onBack: () => void;
  onNavigate: (page: any) => void;
}

interface UserActivity {
  id: number;
  type: 'create' | 'edit' | 'publish' | 'delete' | 'comment';
  title: string;
  articleTitle?: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

interface UserArticle {
  id: number;
  title: string;
  type: string;
  status: 'draft' | 'pending' | 'published';
  views: number;
  comments: number;
  likes: number;
  publishedDate?: string;
  thumbnail: string;
}

export function UserDetail({ userId, onBack, onNavigate }: UserDetailProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Mock user data với dữ liệu thật
  const getUserData = (id: number) => {
    const users: any = {
      1: {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@cms.com',
        role: 'admin',
        status: 'active',
        phone: '+84 123 456 789',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        bio: 'Quản trị viên hệ thống với 5 năm kinh nghiệm trong lĩnh vực quản lý nội dung và phát triển CMS.',
        location: 'Hà Nội, Việt Nam',
        department: 'IT Department',
        position: 'System Administrator',
        joinedDate: '01/01/2023',
        lastActive: '5 phút trước',
        articlesCount: 247,
        totalViews: 156789,
        totalComments: 1234,
        totalLikes: 5678,
        publishedArticles: 198,
        draftArticles: 32,
        pendingArticles: 17,
        permissions: [
          'Toàn quyền hệ thống',
          'Quản lý người dùng',
          'Cấu hình hệ thống',
          'Truy cập logs',
          'Duyệt bài viết',
          'Xóa nội dung'
        ],
      },
      2: {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@cms.com',
        role: 'editor',
        status: 'active',
        phone: '+84 987 654 321',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        bio: 'Biên tập viên chính chuyên về nội dung công nghệ và AI.',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        department: 'Editorial Team',
        position: 'Senior Editor',
        joinedDate: '15/02/2023',
        lastActive: '1 giờ trước',
        articlesCount: 189,
        totalViews: 98234,
        totalComments: 876,
        totalLikes: 3421,
        publishedArticles: 156,
        draftArticles: 21,
        pendingArticles: 12,
        permissions: [
          'Duyệt bài viết',
          'Chỉnh sửa tất cả bài viết',
          'Quản lý danh mục',
          'Quản lý thẻ',
        ],
      },
      3: {
        id: 3,
        name: 'Lê Văn C',
        email: 'levanc@cms.com',
        role: 'author',
        status: 'active',
        phone: '+84 456 789 123',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        bio: 'Tác giả content marketing với đam mê về công nghệ và đổi mới sáng tạo.',
        location: 'Đà Nẵng, Việt Nam',
        department: 'Content Team',
        position: 'Content Writer',
        joinedDate: '20/03/2023',
        lastActive: '3 giờ trước',
        articlesCount: 156,
        totalViews: 67890,
        totalComments: 543,
        totalLikes: 2134,
        publishedArticles: 124,
        draftArticles: 18,
        pendingArticles: 14,
        permissions: [
          'Tạo bài viết',
          'Chỉnh sửa bài của mình',
          'Xóa bài nháp của mình',
        ],
      },
    };
    return users[id] || users[1];
  };

  const user = getUserData(userId);

  // Hoạt động gần đây
  const recentActivities: UserActivity[] = [
    {
      id: 1,
      type: 'publish',
      title: 'Xuất bản bài viết',
      articleTitle: 'Hướng dẫn sử dụng CMS Platform mới',
      timestamp: '5 phút trước',
      status: 'success',
    },
    {
      id: 2,
      type: 'edit',
      title: 'Chỉnh sửa bài viết',
      articleTitle: 'AI Translation - Tương lai của dịch thuật',
      timestamp: '2 giờ trước',
      status: 'success',
    },
    {
      id: 3,
      type: 'create',
      title: 'Tạo bài viết mới',
      articleTitle: 'Tech Trends 2025',
      timestamp: '1 ngày trước',
      status: 'pending',
    },
    {
      id: 4,
      type: 'comment',
      title: 'Bình luận trên bài viết',
      articleTitle: 'Machine Learning cơ bản',
      timestamp: '2 ngày trước',
      status: 'success',
    },
    {
      id: 5,
      type: 'publish',
      title: 'Xuất bản bài viết',
      articleTitle: 'Blockchain và ứng dụng thực tế',
      timestamp: '3 ngày trước',
      status: 'success',
    },
  ];

  // Bài viết của người dùng
  const userArticles: UserArticle[] = [
    {
      id: 1,
      title: 'Hướng dẫn sử dụng CMS Platform mới - Nền tảng quản lý nội dung hiện đại',
      type: 'news',
      status: 'published',
      views: 1234,
      comments: 45,
      likes: 234,
      publishedDate: '2024-12-26',
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    },
    {
      id: 2,
      title: 'AI Translation - Tương lai của dịch thuật tự động',
      type: 'news',
      status: 'published',
      views: 892,
      comments: 32,
      likes: 178,
      publishedDate: '2024-12-25',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    },
    {
      id: 3,
      title: 'Tech Trends 2025 - Xu hướng công nghệ năm tới',
      type: 'news',
      status: 'pending',
      views: 0,
      comments: 0,
      likes: 0,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    },
    {
      id: 4,
      title: 'Cloud Computing: Hướng dẫn cho người mới bắt đầu',
      type: 'news',
      status: 'draft',
      views: 0,
      comments: 0,
      likes: 0,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'inactive':
        return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'suspended':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return FileText;
      case 'edit': return Edit;
      case 'publish': return CheckCircle;
      case 'delete': return Trash2;
      case 'comment': return MessageCircle;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-blue-100 text-blue-600';
      case 'edit': return 'bg-purple-100 text-purple-600';
      case 'publish': return 'bg-green-100 text-green-600';
      case 'delete': return 'bg-red-100 text-red-600';
      case 'comment': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 hover:bg-muted/50 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-foreground">Chi tiết người dùng</h1>
              <p className="text-muted-foreground mt-1">
                Xem và quản lý thông tin người dùng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              <Lock className="w-4 h-4" />
              <span>Đổi mật khẩu</span>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
            >
              <Edit className="w-5 h-5" />
              <span>Chỉnh sửa</span>
            </button>
            <button className="p-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-2xl border-4 border-card object-cover"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${getStatusColor(user.status).split(' ')[1]} rounded-full border-4 border-card flex items-center justify-center`}>
                    {user.status === 'active' && <Check className="w-4 h-4 text-green-700" />}
                    {user.status === 'suspended' && <Ban className="w-4 h-4 text-red-700" />}
                  </div>
                </div>
                
                <div className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-foreground">{user.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-${roleInfo.color}-100 text-${roleInfo.color}-700 border-${roleInfo.color}-200 flex items-center gap-1`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Không hoạt động' : 'Tạm khóa'}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2">{user.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {user.position}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Tham gia {user.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right pb-2">
                <div className="text-sm text-muted-foreground mb-1">
                  Hoạt động cuối
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Activity className="w-4 h-4 text-green-600" />
                  {user.lastActive}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700">Tổng bài viết</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{user.articlesCount}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Đã xuất bản</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{user.publishedArticles}</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-700">Chờ duyệt</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">{user.pendingArticles}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-700">Lượt xem</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{user.totalViews.toLocaleString()}</div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span className="text-sm text-pink-700">Lượt thích</span>
                </div>
                <div className="text-2xl font-bold text-pink-900">{user.totalLikes.toLocaleString()}</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-orange-700">Bình luận</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">{user.totalComments.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Info */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Số điện thoại</div>
                  <div className="text-sm font-medium">{user.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Địa chỉ</div>
                  <div className="text-sm font-medium">{user.location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Thông tin công việc
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Chức vụ</div>
                  <div className="text-sm font-medium">{user.position}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Phòng ban</div>
                  <div className="text-sm font-medium">{user.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Ngày tham gia</div>
                  <div className="text-sm font-medium">{user.joinedDate}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Quyền hạn
            </h3>
            <div className="space-y-2">
              {user.permissions.map((permission: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border/60 rounded-2xl">
          <div className="border-b border-border/60 px-6">
            <div className="flex gap-1">
              {[
                { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
                { id: 'articles', label: 'Bài viết', icon: FileText },
                { id: 'activity', label: 'Hoạt động', icon: Activity },
                { id: 'royalty', label: 'Nhuận bút', icon: DollarSign },
                { id: 'settings', label: 'Cài đặt', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Performance Chart */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Hiệu suất 30 ngày qua
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bài viết đã xuất bản</span>
                        <span className="font-medium text-green-600">+24</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tổng lượt xem</span>
                        <span className="font-medium text-blue-600">+12.5K</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tương tác</span>
                        <span className="font-medium text-purple-600">+892</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                    <h4 className="text-foreground mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Thành tựu
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Top Author</div>
                          <div className="text-sm text-muted-foreground">200+ bài viết đã xuất bản</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Trending Creator</div>
                          <div className="text-sm text-muted-foreground">100K+ lượt xem tháng này</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    Tất cả ({userArticles.length})
                  </button>
                  <button className="px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors">
                    Đã xuất bản ({userArticles.filter(a => a.status === 'published').length})
                  </button>
                  <button className="px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors">
                    Chờ duyệt ({userArticles.filter(a => a.status === 'pending').length})
                  </button>
                  <button className="px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors">
                    Nháp ({userArticles.filter(a => a.status === 'draft').length})
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {userArticles.map((article) => (
                    <div
                      key={article.id}
                      className="group bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                    >
                      <div className="relative overflow-hidden aspect-[16/9]">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {article.status === 'published' && (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                              Đã xuất bản
                            </span>
                          )}
                          {article.status === 'pending' && (
                            <span className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full">
                              Chờ duyệt
                            </span>
                          )}
                          {article.status === 'draft' && (
                            <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded-full">
                              Nháp
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-foreground mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h4>
                        {article.status === 'published' && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {article.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {article.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {article.likes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{activity.title}</div>
                        {activity.articleTitle && (
                          <div className="text-sm text-muted-foreground">{activity.articleTitle}</div>
                        )}
                        <div className="text-sm text-muted-foreground mt-1">{activity.timestamp}</div>
                      </div>
                      <div>
                        {activity.status === 'success' && (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                        {activity.status === 'pending' && (
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-yellow-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'royalty' && (
              <UserRoyaltyConfig userId={userId} />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="text-foreground mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Cài đặt thông báo
                  </h4>
                  <div className="space-y-3">
                    {[
                      'Nhận thông báo khi có bình luận mới',
                      'Nhận thông báo khi bài viết được duyệt',
                      'Nhận email báo cáo hàng tuần',
                      'Nhận thông báo từ hệ thống',
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <span className="text-sm">{setting}</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="text-red-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Vùng nguy hiểm
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                      <Ban className="w-4 h-4" />
                      Tạm khóa tài khoản
                    </button>
                    <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Xóa tài khoản vĩnh viễn
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card p-6 border-b border-border/60 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">Chỉnh sửa thông tin người dùng</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors mb-2">
                      Tải ảnh lên
                    </button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG hoặc GIF. Tối đa 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Họ và tên *</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email *</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      defaultValue={user.phone}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Vai trò *</label>
                    <select
                      defaultValue={user.role}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    >
                      <option value="contributor">Contributor</option>
                      <option value="author">Author</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Chức vụ</label>
                    <input
                      type="text"
                      defaultValue={user.position}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Phòng ban</label>
                    <input
                      type="text"
                      defaultValue={user.department}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    defaultValue={user.location}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Bio</label>
                  <textarea
                    defaultValue={user.bio}
                    rows={3}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Trạng thái</label>
                  <select
                    defaultValue={user.status}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div className="sticky bottom-0 bg-card p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  Hủy
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-md w-full">
              <div className="p-6 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">Đổi mật khẩu</h2>
                  <button
                    onClick={() => setShowChangePasswordModal(false)}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Mật khẩu mới *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <input type="checkbox" id="sendPasswordEmail" className="rounded" />
                  <label htmlFor="sendPasswordEmail" className="text-sm text-blue-800">
                    Gửi email thông báo đổi mật khẩu
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  Hủy
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                  <Key className="w-4 h-4" />
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}