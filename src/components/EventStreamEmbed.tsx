import React, { useState } from 'react';
import {
  Copy, Check, Code, Eye, Settings, Palette, Layout,
  Monitor, Smartphone, Tablet, ChevronRight, Download, Share2
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';

export function EventStreamEmbed({ streamId, streamName, streamColor }: { 
  streamId: string; 
  streamName: string;
  streamColor: string;
}) {
  const [embedType, setEmbedType] = useState<'timeline' | 'card' | 'banner' | 'widget'>('timeline');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    showAuthor: true,
    showStats: true,
    showThumbnail: true,
    maxArticles: 5,
    theme: 'light',
    primaryColor: streamColor,
    borderRadius: 12,
    showHeader: true,
  });

  const generateEmbedCode = () => {
    const configJson = JSON.stringify(config, null, 2);
    
    if (embedType === 'timeline') {
      return `<!-- EventStream Timeline Widget -->
<div id="eventstream-${streamId}" class="eventstream-widget"></div>
<script src="https://cdn.eventstream.com/widget.js"></script>
<script>
  EventStream.init({
    streamId: '${streamId}',
    type: 'timeline',
    config: ${configJson}
  });
</script>`;
    } else if (embedType === 'card') {
      return `<!-- EventStream Card Widget -->
<div id="eventstream-card-${streamId}"></div>
<script src="https://cdn.eventstream.com/widget.js"></script>
<script>
  EventStream.init({
    streamId: '${streamId}',
    type: 'card',
    config: ${configJson}
  });
</script>`;
    } else if (embedType === 'banner') {
      return `<!-- EventStream Banner Widget -->
<div id="eventstream-banner-${streamId}" style="width: 100%; height: 400px;"></div>
<script src="https://cdn.eventstream.com/widget.js"></script>
<script>
  EventStream.init({
    streamId: '${streamId}',
    type: 'banner',
    config: ${configJson}
  });
</script>`;
    } else {
      return `<!-- EventStream Floating Widget -->
<script src="https://cdn.eventstream.com/widget.js"></script>
<script>
  EventStream.init({
    streamId: '${streamId}',
    type: 'floating',
    position: 'bottom-right',
    config: ${configJson}
  });
</script>`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedTypes = [
    {
      key: 'timeline',
      label: 'Timeline',
      description: 'Hiển thị timeline đầy đủ với các bài viết',
      icon: Layout,
    },
    {
      key: 'card',
      label: 'Card',
      description: 'Card compact hiển thị bài viết mới nhất',
      icon: Layout,
    },
    {
      key: 'banner',
      label: 'Banner',
      description: 'Banner ngang với featured articles',
      icon: Layout,
    },
    {
      key: 'widget',
      label: 'Floating Widget',
      description: 'Widget floating ở góc màn hình',
      icon: Layout,
    },
  ];

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Embed & Share"
        description="Nhúng dòng sự kiện vào website của bạn"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Embed Type */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" style={{ color: streamColor }} />
              Kiểu embed
            </h3>
            <div className="space-y-2">
              {embedTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.key}
                    onClick={() => setEmbedType(type.key as any)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      embedType === type.key
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                        : 'bg-secondary hover:bg-muted border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-0.5" style={{ color: embedType === type.key ? streamColor : undefined }} />
                      <div>
                        <p className="font-medium mb-1">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Customization */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: streamColor }} />
              Tùy chỉnh
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Hiển thị tác giả</span>
                <input
                  type="checkbox"
                  checked={config.showAuthor}
                  onChange={(e) => setConfig({ ...config, showAuthor: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Hiển thị thống kê</span>
                <input
                  type="checkbox"
                  checked={config.showStats}
                  onChange={(e) => setConfig({ ...config, showStats: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Hiển thị thumbnail</span>
                <input
                  type="checkbox"
                  checked={config.showThumbnail}
                  onChange={(e) => setConfig({ ...config, showThumbnail: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Hiển thị header</span>
                <input
                  type="checkbox"
                  checked={config.showHeader}
                  onChange={(e) => setConfig({ ...config, showHeader: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Số bài viết tối đa</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={config.maxArticles}
                  onChange={(e) => setConfig({ ...config, maxArticles: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Theme</label>
                <select
                  value={config.theme}
                  onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Màu chính</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Border radius</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={config.borderRadius}
                  onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground text-center mt-1">{config.borderRadius}px</p>
              </div>
            </div>
          </Card>

          {/* Embed Code */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" style={{ color: streamColor }} />
              Mã nhúng
            </h3>
            <div className="relative">
              <pre className="p-4 bg-gray-900 text-green-400 rounded-xl text-xs overflow-x-auto max-h-64">
                <code>{generateEmbedCode()}</code>
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đã copy
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Selector */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { key: 'desktop', icon: Monitor, label: 'Desktop' },
                  { key: 'tablet', icon: Tablet, label: 'Tablet' },
                  { key: 'mobile', icon: Smartphone, label: 'Mobile' },
                ].map((device) => {
                  const Icon = device.icon;
                  return (
                    <button
                      key={device.key}
                      onClick={() => setPreviewDevice(device.key as any)}
                      className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                        previewDevice === device.key
                          ? 'text-white shadow-lg'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      style={previewDevice === device.key ? { backgroundColor: streamColor } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {device.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>

          {/* Preview Area */}
          <Card className="p-6 min-h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div 
              className="transition-all duration-300"
              style={{ width: getDeviceWidth() }}
            >
              {/* Timeline Preview */}
              {embedType === 'timeline' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  {config.showHeader && (
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold mb-2">{streamName}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chuỗi tin tức và sự kiện công nghệ
                      </p>
                    </div>
                  )}
                  <div className="p-6 space-y-6">
                    {[1, 2, 3].slice(0, config.maxArticles).map((i) => (
                      <div key={i} className="flex gap-4">
                        {config.showThumbnail && (
                          <div 
                            className="w-24 h-24 bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                            style={{ borderRadius: `${config.borderRadius}px` }}
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Article Title {i}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Excerpt text goes here...
                          </p>
                          {config.showAuthor && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="w-6 h-6 rounded-full bg-gray-300" />
                              <span>Author Name</span>
                            </div>
                          )}
                          {config.showStats && (
                            <div className="flex gap-4 text-xs text-gray-500 mt-2">
                              <span>👁 1.2K</span>
                              <span>❤️ 234</span>
                              <span>💬 45</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button 
                      className="text-white px-6 py-2"
                      style={{ 
                        backgroundColor: config.primaryColor,
                        borderRadius: `${config.borderRadius}px`
                      }}
                    >
                      Xem tất cả
                    </button>
                  </div>
                </div>
              )}

              {/* Card Preview */}
              {embedType === 'card' && (
                <div 
                  className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden p-6"
                  style={{ borderRadius: `${config.borderRadius}px` }}
                >
                  {config.showHeader && (
                    <h3 className="font-bold mb-4">{streamName}</h3>
                  )}
                  {config.showThumbnail && (
                    <div 
                      className="w-full h-48 bg-gray-200 dark:bg-gray-700 mb-4"
                      style={{ borderRadius: `${config.borderRadius}px` }}
                    />
                  )}
                  <h4 className="font-semibold mb-2">Latest Article Title</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Article excerpt text...
                  </p>
                  {config.showStats && (
                    <div className="flex gap-4 text-sm text-gray-500 mb-4">
                      <span>👁 1.2K</span>
                      <span>❤️ 234</span>
                    </div>
                  )}
                  <button 
                    className="w-full text-white py-2"
                    style={{ 
                      backgroundColor: config.primaryColor,
                      borderRadius: `${config.borderRadius}px`
                    }}
                  >
                    Đọc thêm
                  </button>
                </div>
              )}

              {/* Banner Preview */}
              {embedType === 'banner' && (
                <div 
                  className="relative h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden"
                  style={{ borderRadius: `${config.borderRadius}px` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-8 flex flex-col justify-center">
                    {config.showHeader && (
                      <h2 className="text-3xl font-bold text-white mb-2">{streamName}</h2>
                    )}
                    <p className="text-white/80 mb-4">Featured article title</p>
                    <button 
                      className="text-white px-6 py-3 w-fit"
                      style={{ 
                        backgroundColor: config.primaryColor,
                        borderRadius: `${config.borderRadius}px`
                      }}
                    >
                      Khám phá
                    </button>
                  </div>
                </div>
              )}

              {/* Widget Preview */}
              {embedType === 'widget' && (
                <div className="fixed bottom-6 right-6 z-50">
                  <div 
                    className="w-80 bg-white dark:bg-gray-800 shadow-2xl"
                    style={{ borderRadius: `${config.borderRadius}px` }}
                  >
                    <div 
                      className="p-4 text-white"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <h3 className="font-bold">{streamName}</h3>
                      <p className="text-sm text-white/80">3 bài viết mới</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg">
                          {config.showThumbnail && (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Article {i}</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Hướng dẫn sử dụng</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-xs">
                  1
                </span>
                <span>Chọn kiểu embed phù hợp với website của bạn</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-xs">
                  2
                </span>
                <span>Tùy chỉnh giao diện và chức năng theo ý muốn</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-xs">
                  3
                </span>
                <span>Copy mã nhúng và paste vào HTML của website</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-xs">
                  4
                </span>
                <span>Widget sẽ tự động cập nhật khi có bài viết mới</span>
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
