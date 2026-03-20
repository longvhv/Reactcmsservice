import { Plus, Trash2, Download, File, FileText, Image as ImageIcon, Film, Music, Archive, LayoutGrid, List, AlignJustify } from 'lucide-react';
import type { FileDownloadSectionData, DownloadFile } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: FileDownloadSectionData; onChange: (u: Partial<FileDownloadSectionData>) => void; }

const fileTypeIcons: Record<string, React.ElementType> = {
  pdf: FileText, doc: FileText, docx: FileText, xls: FileText, xlsx: FileText,
  jpg: ImageIcon, png: ImageIcon, gif: ImageIcon, svg: ImageIcon,
  mp4: Film, avi: Film, mov: Film,
  mp3: Music, wav: Music,
  zip: Archive, rar: Archive, '7z': Archive,
};

export function FileDownloadSectionEditor({ section, onChange }: Props) {
  const addFile = () => {
    const newFile: DownloadFile = {
      id: generateSectionId(),
      name: '',
      url: '',
      size: '',
      fileType: 'pdf',
      description: '',
    };
    onChange({ files: [...section.files, newFile] });
  };

  const updateFile = (id: string, updates: Partial<DownloadFile>) => {
    onChange({ files: section.files.map(f => f.id === id ? { ...f, ...updates } : f) });
  };

  const removeFile = (id: string) => {
    onChange({ files: section.files.filter(f => f.id !== id) });
  };

  const layouts = [
    { value: 'list' as const, label: 'Danh sách', icon: List },
    { value: 'grid' as const, label: 'Lưới', icon: LayoutGrid },
    { value: 'compact' as const, label: 'Thu gọn', icon: AlignJustify },
  ];

  return (
    <div className="space-y-4">
      {/* Layout */}
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">Bố cục</label>
        <div className="flex gap-1">
          {layouts.map(l => {
            const Icon = l.icon;
            return (
              <button
                key={l.value}
                onClick={() => onChange({ downloadLayout: l.value })}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  section.downloadLayout === l.value
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Files */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{section.files.length} tệp</span>
          <button onClick={addFile} className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-700 transition-colors">
            <Plus className="w-3 h-3" /> Thêm tệp
          </button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {section.files.map((file, idx) => {
            const FileIcon = fileTypeIcons[file.fileType] || File;
            return (
              <div key={file.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-4 h-4 text-amber-700" />
                  </div>
                  <input
                    type="text"
                    value={file.name}
                    onChange={e => updateFile(file.id, { name: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Tên tệp..."
                  />
                  <button onClick={() => removeFile(file.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={file.url}
                    onChange={e => updateFile(file.id, { url: e.target.value })}
                    className="col-span-2 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="URL tải xuống..."
                  />
                  <div className="flex gap-1">
                    <select
                      value={file.fileType}
                      onChange={e => updateFile(file.id, { fileType: e.target.value })}
                      className="flex-1 px-1 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">DOC</option>
                      <option value="docx">DOCX</option>
                      <option value="xls">XLS</option>
                      <option value="xlsx">XLSX</option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="mp4">MP4</option>
                      <option value="mp3">MP3</option>
                      <option value="zip">ZIP</option>
                      <option value="rar">RAR</option>
                    </select>
                    <input
                      type="text"
                      value={file.size}
                      onChange={e => updateFile(file.id, { size: e.target.value })}
                      className="w-16 px-1 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                      placeholder="2.5MB"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={file.description || ''}
                  onChange={e => updateFile(file.id, { description: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Mô tả tệp (tùy chọn)..."
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
