import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Minus, BarChart3, Activity, Clock, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserActivity {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  totalEvents: number;
  eventsByType: { [key: string]: number };
  activeHours: number[];
  peakHour: number;
  avgEventsPerDay: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface ActivityComparisonProps {
  users: UserActivity[];
  onClose: () => void;
}

export function ActivityComparison({ users: initialUsers, onClose }: ActivityComparisonProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    initialUsers.slice(0, 2).map(u => u.userId)
  );

  // Mock data for comparison
  const mockUsers: UserActivity[] = [
    {
      userId: 'u1',
      userName: 'Nguyễn Văn A',
      userEmail: 'nguyenvana@example.com',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      totalEvents: 234,
      eventsByType: { create: 45, update: 123, delete: 12, view: 54 },
      activeHours: [0, 0, 0, 0, 0, 5, 23, 45, 67, 89, 76, 54, 43, 67, 78, 65, 43, 32, 21, 12, 8, 3, 0, 0],
      peakHour: 9,
      avgEventsPerDay: 33.4,
      trend: 'up',
      trendPercentage: 12.5,
    },
    {
      userId: 'u2',
      userName: 'Trần Thị B',
      userEmail: 'tranthib@example.com',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      totalEvents: 189,
      eventsByType: { create: 34, update: 98, delete: 8, view: 49 },
      activeHours: [0, 0, 0, 0, 0, 3, 12, 34, 56, 67, 54, 43, 32, 54, 65, 56, 43, 32, 23, 15, 9, 4, 0, 0],
      peakHour: 10,
      avgEventsPerDay: 27.0,
      trend: 'down',
      trendPercentage: -5.2,
    },
    {
      userId: 'u3',
      userName: 'Lê Văn C',
      userEmail: 'levanc@example.com',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      totalEvents: 156,
      eventsByType: { create: 28, update: 87, delete: 6, view: 35 },
      activeHours: [0, 0, 0, 0, 0, 2, 15, 28, 45, 56, 48, 38, 29, 45, 54, 48, 36, 28, 18, 11, 6, 2, 0, 0],
      peakHour: 10,
      avgEventsPerDay: 22.3,
      trend: 'stable',
      trendPercentage: 0.8,
    },
    {
      userId: 'u4',
      userName: 'Phạm Thị D',
      userEmail: 'phamthid@example.com',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      totalEvents: 201,
      eventsByType: { create: 38, update: 105, delete: 10, view: 48 },
      activeHours: [0, 0, 0, 0, 0, 4, 18, 38, 58, 72, 62, 48, 36, 58, 68, 59, 45, 34, 24, 14, 8, 3, 0, 0],
      peakHour: 9,
      avgEventsPerDay: 28.7,
      trend: 'up',
      trendPercentage: 8.3,
    },
  ];

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      if (selectedUsers.length > 1) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      }
    } else {
      if (selectedUsers.length < 4) {
        setSelectedUsers([...selectedUsers, userId]);
      }
    }
  };

  const comparedUsers = mockUsers.filter(u => selectedUsers.includes(u.userId));
  const maxEvents = Math.max(...comparedUsers.map(u => u.totalEvents));

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (trend === 'down') return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
  };

  const userColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-card rounded-2xl border border-border/60 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold">So sánh hoạt động người dùng</h3>
            <p className="text-sm text-muted-foreground mt-1">Phân tích và so sánh hoạt động của nhiều người dùng</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Chọn người dùng để so sánh (tối đa 4)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockUsers.map((user, idx) => (
              <button
                key={user.userId}
                onClick={() => toggleUser(user.userId)}
                disabled={!selectedUsers.includes(user.userId) && selectedUsers.length >= 4}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedUsers.includes(user.userId)
                    ? `border-[${userColors[idx]}] bg-opacity-10`
                    : 'border-border hover:border-border/80'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                style={selectedUsers.includes(user.userId) ? {
                  borderColor: userColors[selectedUsers.indexOf(user.userId)],
                  backgroundColor: userColors[selectedUsers.indexOf(user.userId)] + '20'
                } : {}}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={user.userAvatar} alt={user.userName} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm truncate">{user.userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.totalEvents} events</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {comparedUsers.map((user, idx) => (
            <div 
              key={user.userId}
              className="p-4 rounded-xl border-2"
              style={{ borderColor: userColors[idx] }}
            >
              <div className="flex items-center gap-2 mb-3">
                <img src={user.userAvatar} alt={user.userName} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.userEmail}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Tổng events</span>
                    {getTrendIcon(user.trend)}
                  </div>
                  <p className="text-2xl font-bold">{user.totalEvents}</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 ${getTrendColor(user.trend)}`}>
                    {user.trend === 'up' ? '+' : user.trend === 'down' ? '' : '±'}{user.trendPercentage}%
                  </div>
                </div>

                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(user.totalEvents / maxEvents) * 100}%`,
                      backgroundColor: userColors[idx]
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-muted-foreground mb-1">Avg/ngày</p>
                    <p className="font-semibold">{user.avgEventsPerDay}</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-muted-foreground mb-1">Peak hour</p>
                    <p className="font-semibold">{user.peakHour}:00</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity by Type Comparison */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            So sánh theo loại hoạt động
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(comparedUsers[0]?.eventsByType || {}).map((type) => {
              const maxTypeEvents = Math.max(...comparedUsers.map(u => u.eventsByType[type] || 0));
              return (
                <div key={type}>
                  <p className="text-sm font-medium mb-2 capitalize">{type}</p>
                  <div className="space-y-2">
                    {comparedUsers.map((user, idx) => (
                      <div key={user.userId} className="flex items-center gap-3">
                        <div className="w-32 text-sm truncate">{user.userName}</div>
                        <div className="flex-1 bg-secondary rounded-full h-6 overflow-hidden">
                          <div
                            className="h-full flex items-center px-3 text-white text-xs font-semibold transition-all duration-500"
                            style={{
                              width: `${(user.eventsByType[type] / maxTypeEvents) * 100}%`,
                              backgroundColor: userColors[idx],
                              minWidth: '40px'
                            }}
                          >
                            {user.eventsByType[type]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hoạt động theo giờ trong ngày
          </h4>
          <div className="bg-secondary rounded-xl p-4">
            <div className="flex items-end justify-between gap-1 h-32">
              {Array.from({ length: 24 }, (_, hour) => {
                const maxHourActivity = Math.max(...comparedUsers.map(u => u.activeHours[hour] || 0));
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex flex-col gap-0.5 items-center justify-end h-full">
                      {comparedUsers.map((user, idx) => {
                        const activity = user.activeHours[hour] || 0;
                        const height = maxHourActivity > 0 ? (activity / maxHourActivity) * 100 : 0;
                        return (
                          <div
                            key={user.userId}
                            className="w-full rounded-t transition-all duration-300 hover:opacity-80 relative group"
                            style={{
                              height: `${height}%`,
                              backgroundColor: userColors[idx],
                              opacity: 0.8
                            }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                              {user.userName.split(' ')[0]}: {activity}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {hour % 3 === 0 && (
                      <span className="text-xs text-muted-foreground">{hour}h</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-secondary rounded-xl">
          <span className="text-sm font-medium">Chú thích:</span>
          {comparedUsers.map((user, idx) => (
            <div key={user.userId} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: userColors[idx] }}
              />
              <span className="text-sm">{user.userName}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => alert('Xuất báo cáo so sánh')}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Xuất báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}