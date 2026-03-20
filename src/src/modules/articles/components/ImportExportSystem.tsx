import React, { useState } from 'react';
import { useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  Upload, 
  Download,
  FileText,
  File,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  FileJson,
  FileSpreadsheet,
  FileCode,
  Loader
} from 'lucide-react';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export const ImportExportSystem: React.FC = () => {
  const notifications = useNotifications();
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'xml'>('json');
  const [exportOptions, setExportOptions] = useState({
    includeContent: true,
    includeMeta: true,
    includeImages: false,
    dateRange: 'all' as 'all' | 'last7' | 'last30' | 'last90' | 'custom',
    status: 'all' as 'all' | 'published' | 'draft' | 'archived',
  });

  // Import mutation
  const { mutate: importArticles, isPending: isImporting } = useMutate(
    async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock import result
      const result: ImportResult = {
        total: 50,
        success: 47,
        failed: 3,
        errors: [
          { row: 12, message: 'Missing required field: title' },
          { row: 28, message: 'Invalid date format' },
          { row: 35, message: 'Category not found: InvalidCategory' },
        ],
      };
      
      return result;
    },
    {
      onSuccess: (result) => {
        setImportResult(result);
        if (result.success > 0) {
          notifications.success(`Đã nhập thành công ${result.success} bài viết`);
        }
        if (result.failed > 0) {
          notifications.error(`Nhập thất bại ${result.failed} bài viết`);
        }
      },
      onError: () => {
        notifications.error('Nhập dữ liệu thất bại');
      },
    }
  );

  // Export mutation
  const { mutate: exportArticles, isPending: isExporting } = useMutate(
    async ({ format, options }: { format: string; options: typeof exportOptions }) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock export data
      const data = {
        articles: Array.from({ length: 50 }, (_, i) => ({
          id: `article-${i + 1}`,
          title: `Sample Article ${i + 1}`,
          content: options.includeContent ? `<p>Content for article ${i + 1}</p>` : undefined,
          status: 'published',
          createdAt: new Date().toISOString(),
        })),
        meta: options.includeMeta ? {
          exportedAt: new Date().toISOString(),
          totalArticles: 50,
          format: format,
        } : undefined,
      };

      // Create blob based on format
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'json':
          blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          filename = `articles-export-${Date.now()}.json`;
          break;
        case 'csv':
          // Convert to CSV
          const csv = 'id,title,status,createdAt\n' + 
            data.articles.map(a => `${a.id},"${a.title}",${a.status},${a.createdAt}`).join('\n');
          blob = new Blob([csv], { type: 'text/csv' });
          filename = `articles-export-${Date.now()}.csv`;
          break;
        case 'xml':
          // Convert to XML
          const xml = `<?xml version="1.0" encoding="UTF-8"?>
<articles>
${data.articles.map(a => `  <article id="${a.id}">
    <title>${a.title}</title>
    <status>${a.status}</status>
    <createdAt>${a.createdAt}</createdAt>
  </article>`).join('\n')}
</articles>`;
          blob = new Blob([xml], { type: 'application/xml' });
          filename = `articles-export-${Date.now()}.xml`;
          break;
        default:
          throw new Error('Invalid format');
      }

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      return { success: true, count: data.articles.length };
    },
    {
      onSuccess: (result) => {
        notifications.success(`Đã xuất ${result.count} bài viết thành công`);
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (importFile) {
      importArticles(importFile);
    }
  };

  const handleExport = () => {
    exportArticles({ format: exportFormat, options: exportOptions });
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json': return <FileJson className="w-5 h-5" />;
      case 'csv': return <FileSpreadsheet className="w-5 h-5" />;
      case 'xml': return <FileCode className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Nhập & Xuất dữ liệu
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Nhập hoặc xuất hàng loạt bài viết
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Upload className="w-5 h-5" />
            Nhập bài viết
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Download className="w-5 h-5" />
            Xuất bài viết
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'import' ? (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Hướng dẫn nhập dữ liệu
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Định dạng hỗ trợ: JSON, CSV, XML</li>
                  <li>Dung lượng tối đa: 10MB</li>
                  <li>Trường bắt buộc: title, content, status</li>
                  <li>Trường tùy chọn: category, tags, author, publishedAt</li>
                  <li>Hình ảnh nên là URL hoặc mã hóa base64</li>
                </ul>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Chọn tệp để nhập
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".json,.csv,.xml"
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    {importFile ? (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {importFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {(importFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nhấp để tải lên hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          JSON, CSV, hoặc XML (tối đa 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Import Button */}
              <button
                onClick={handleImport}
                disabled={!importFile || isImporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang nhập...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Nhập bài viết
                  </>
                )}
              </button>

              {/* Import Result */}
              {importResult && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng cộng</p>
                      <p className="text-2xl font-bold">{importResult.total}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">Thành công</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {importResult.success}
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                      <p className="text-sm text-red-600 dark:text-red-400 mb-1">Thất bại</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {importResult.failed}
                      </p>
                    </div>
                  </div>

                  {/* Errors */}
                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Lỗi nhập dữ liệu ({importResult.errors.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {importResult.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-800 dark:text-red-200">
                            <span className="font-medium">Dòng {error.row}:</span> {error.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Định dạng xuất
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'json', label: 'JSON', description: 'Tốt nhất cho sao lưu dữ liệu' },
                    { value: 'csv', label: 'CSV', description: 'Tương thích Excel' },
                    { value: 'xml', label: 'XML', description: 'Định dạng chuẩn' },
                  ].map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setExportFormat(format.value as any)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        exportFormat === format.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {getFormatIcon(format.value)}
                        <span className="font-semibold">{format.label}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {format.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Tùy chọn xuất
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeContent}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeContent: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <div className="font-medium">Bao gồm nội dung đầy đủ</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Xuất toàn bộ nội dung bài viết (kích thước tệp lớn hơn)
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeMeta}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeMeta: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <div className="font-medium">Bao gồm Metadata</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Xuất ngày tháng, tác giả, danh mục, thẻ, v.v.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeImages}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeImages: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <div className="font-medium">Bao gồm hình ảnh (Base64)</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Nhúng hình ảnh dạng base64 (kích thước tệp rất lớn)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Khoảng thời gian
                  </label>
                  <select
                    value={exportOptions.dateRange}
                    onChange={(e) => setExportOptions({ ...exportOptions, dateRange: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <option value="all">-- Thời gian --</option>
                    <option value="last7">7 ngày qua</option>
                    <option value="last30">30 ngày qua</option>
                    <option value="last90">90 ngày qua</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trạng thái bài viết
                  </label>
                  <select
                    value={exportOptions.status}
                    onChange={(e) => setExportOptions({ ...exportOptions, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <option value="all">-- Trạng thái --</option>
                    <option value="published">Chỉ đã xuất bản</option>
                    <option value="draft">Chỉ nháp</option>
                    <option value="archived">Chỉ lưu trữ</option>
                  </select>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Xuất bài viết
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};