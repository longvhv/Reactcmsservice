import React from 'react';
import { 
  Sparkles, TrendingUp, AlertTriangle, CheckCircle, Info, 
  Brain, Target, Clock, Users, Zap, Shield, Activity
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'anomaly';
  category: 'performance' | 'security' | 'usage' | 'trend';
  title: string;
  description: string;
  metrics?: {
    label: string;
    value: string | number;
    change?: number;
  }[];
  recommendation?: string;
  confidence: number; // 0-100
  timestamp: string;
}

interface ActivityInsightsProps {
  onClose: () => void;
}

export function ActivityInsights({ onClose }: ActivityInsightsProps) {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'success',
      category: 'performance',
      title: 'Hiệu suất hệ thống tốt',
      description: 'Thời gian phản hồi trung bình giảm 23% so với tuần trước. Hệ thống đang hoạt động rất ổn định.',
      metrics: [
        { label: 'Avg response time', value: '145ms', change: -23 },
        { label: 'Success rate', value: '99.2%', change: 1.2 },
      ],
      recommendation: 'Tiếp tục duy trì cấu hình hiện tại và monitoring định kỳ.',
      confidence: 95,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'anomaly',
      category: 'security',
      title: 'Phát hiện hoạt động bất thường',
      description: 'Có 5 lần đăng nhập thất bại liên tiếp từ IP 192.168.1.100 trong vòng 10 phút. Nguy cơ tấn công brute force.',
      metrics: [
        { label: 'Failed logins', value: 5, change: 400 },
        { label: 'Source IP', value: '192.168.1.100' },
        { label: 'Time window', value: '10 min' },
      ],
      recommendation: 'Khóa tạm thời IP này và kích hoạt xác thực 2 yếu tố cho tài khoản bị ảnh hưởng.',
      confidence: 87,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'warning',
      category: 'usage',
      title: 'Lưu lượng truy cập cao bất thường',
      description: 'Số lượng requests tăng 156% vào khung giờ 14:00-16:00 so với mức trung bình. Có thể cần scale resources.',
      metrics: [
        { label: 'Peak requests', value: '2,847/min', change: 156 },
        { label: 'Usual average', value: '1,112/min' },
        { label: 'Time period', value: '14:00-16:00' },
      ],
      recommendation: 'Cân nhắc tăng server capacity hoặc bật auto-scaling trong khung giờ cao điểm.',
      confidence: 78,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      type: 'info',
      category: 'trend',
      title: 'Xu hướng tăng trưởng tích cực',
      description: 'Số người dùng hoạt động hàng ngày tăng đều đặn 8-12% mỗi tuần trong tháng qua.',
      metrics: [
        { label: 'Daily active users', value: 324, change: 11.2 },
        { label: 'Weekly growth', value: '9.4%' },
        { label: 'Monthly trend', value: 'Tăng' },
      ],
      recommendation: 'Chuẩn bị infrastructure để đáp ứng growth trajectory dự kiến trong 3-6 tháng tới.',
      confidence: 91,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      type: 'warning',
      category: 'security',
      title: 'Quyền admin được cấp thường xuyên',
      description: 'Có 3 tài khoản mới được cấp quyền admin trong 24h qua. Cao hơn 200% so với mức bình thường.',
      metrics: [
        { label: 'New admins', value: 3, change: 200 },
        { label: 'Usual rate', value: '0.8/day' },
      ],
      recommendation: 'Review lại các quyền admin vừa cấp và đảm bảo tuân thủ security policy.',
      confidence: 82,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      type: 'success',
      category: 'performance',
      title: 'Tối ưu hóa database thành công',
      description: 'Query performance cải thiện đáng kể sau khi optimize indexes. Avg query time giảm 41%.',
      metrics: [
        { label: 'Avg query time', value: '89ms', change: -41 },
        { label: 'Slow queries', value: 2, change: -78 },
      ],
      recommendation: 'Apply optimization pattern tương tự cho các collections khác.',
      confidence: 94,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'anomaly': return <Shield className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        icon: 'bg-green-500',
      };
      case 'warning': return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        icon: 'bg-yellow-500',
      };
      case 'anomaly': return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        icon: 'bg-red-500',
      };
      default: return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'bg-blue-500',
      };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'usage': return <Users className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return 'hôm qua';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-5xl bg-card rounded-2xl border border-border/60 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                AI Insights
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                  Beta
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Phân tích thông minh và phát hiện bất thường bằng AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Tích cực</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {insights.filter(i => i.type === 'success').length}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Cảnh báo</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {insights.filter(i => i.type === 'warning').length}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Bất thường</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {insights.filter(i => i.type === 'anomaly').length}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Thông tin</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {insights.filter(i => i.type === 'info').length}
            </p>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight) => {
            const colors = getInsightColor(insight.type);
            return (
              <div
                key={insight.id}
                className={`p-5 rounded-xl border-2 ${colors.bg} ${colors.border} transition-all hover:shadow-md`}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`p-2.5 ${colors.icon} rounded-xl text-white flex-shrink-0`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{insight.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.text} bg-white dark:bg-gray-900 flex items-center gap-1`}>
                        {getCategoryIcon(insight.category)}
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    
                    {/* Metrics */}
                    {insight.metrics && insight.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {insight.metrics.map((metric, idx) => (
                          <div key={idx} className="p-2.5 bg-white dark:bg-gray-900 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-0.5">{metric.label}</p>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{metric.value}</p>
                              {metric.change !== undefined && (
                                <span className={`text-xs font-medium ${
                                  metric.change > 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {metric.change > 0 ? '+' : ''}{metric.change}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendation */}
                    {insight.recommendation && (
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border-l-4 border-blue-500">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Khuyến nghị
                        </p>
                        <p className="text-sm">{insight.recommendation}</p>
                      </div>
                    )}
                  </div>

                  {/* Confidence & Time */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confidence</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        <span className="font-semibold text-sm">{insight.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(insight.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI insights được cập nhật mỗi 15 phút
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => alert('Xuất báo cáo AI Insights')}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors text-sm"
              >
                Xuất báo cáo
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
