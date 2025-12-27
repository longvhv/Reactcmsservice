// SEO Tools Component
import { useState } from 'react';
import { Search, TrendingUp, Target, BarChart3, Globe, Link as LinkIcon, Hash, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export function SEOTools() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const seoScore = 87;

  const seoMetrics = [
    { label: 'Tiêu đề SEO', score: 95, status: 'good', message: 'Độ dài tối ưu (60 ký tự)' },
    { label: 'Meta Description', score: 85, status: 'good', message: 'Hấp dẫn và đầy đủ keywords' },
    { label: 'URL Structure', score: 90, status: 'good', message: 'URL thân thiện và ngắn gọn' },
    { label: 'Keywords Density', score: 75, status: 'warning', message: 'Nên tăng mật độ từ khóa' },
    { label: 'Image Alt Text', score: 80, status: 'good', message: '8/10 ảnh có alt text' },
    { label: 'Internal Links', score: 70, status: 'warning', message: 'Nên thêm 2-3 liên kết nội bộ' },
  ];

  const keywords = [
    { keyword: 'React Hooks', volume: 12500, difficulty: 'Medium', position: 3 },
    { keyword: 'useState tutorial', volume: 8900, difficulty: 'Easy', position: 1 },
    { keyword: 'useEffect guide', volume: 6700, difficulty: 'Easy', position: 2 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-foreground mb-2">SEO Tools</h1>
        <p className="text-muted-foreground">Tối ưu hóa công cụ tìm kiếm</p>
      </div>

      {/* SEO Score Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">SEO Score</h2>
            <p className="text-green-100">Điểm tổng quan về SEO của trang</p>
          </div>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(seoScore / 100) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{seoScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* URL Analyzer */}
      <div className="bg-card rounded-2xl border border-border/60 p-6">
        <h3 className="text-foreground mb-4">Phân tích URL</h3>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button 
            onClick={() => setAnalyzing(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Phân tích
          </button>
        </div>
      </div>

      {/* SEO Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Các chỉ số SEO
          </h3>
          <div className="space-y-4">
            {seoMetrics.map((metric, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.score}/100</span>
                    {metric.status === 'good' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      metric.status === 'good' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-500" />
            Keywords Performance
          </h3>
          <div className="space-y-3">
            {keywords.map((kw, idx) => (
              <div key={idx} className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{kw.keyword}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    #{kw.position}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Volume: {kw.volume.toLocaleString()}</span>
                  <span>•</span>
                  <span className={kw.difficulty === 'Easy' ? 'text-green-600' : 'text-orange-600'}>
                    {kw.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-2xl border border-border/60 p-6">
        <h3 className="text-foreground mb-4">Đề xuất cải thiện</h3>
        <div className="space-y-3">
          {[
            { priority: 'high', text: 'Thêm 2-3 internal links để tăng liên kết nội bộ' },
            { priority: 'medium', text: 'Tối ưu mật độ từ khóa "React Hooks" lên 2-3%' },
            { priority: 'low', text: 'Thêm alt text cho 2 hình ảnh còn thiếu' },
          ].map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
              <div className={`p-2 rounded-lg ${
                rec.priority === 'high' ? 'bg-red-100' :
                rec.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
                <AlertCircle className={`w-4 h-4 ${
                  rec.priority === 'high' ? 'text-red-600' :
                  rec.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.priority === 'high' ? 'Ưu tiên cao' : rec.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
                <p className="text-sm text-foreground">{rec.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
