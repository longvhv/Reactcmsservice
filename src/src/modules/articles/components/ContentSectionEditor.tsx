/**
 * ContentSectionEditor - Main component managing multi-section content
 * Replaces the single HTML RichTextEditor
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Plus, GripVertical, Trash2, Copy, Eye, EyeOff, ChevronUp, ChevronDown,
  Settings, Undo2, Redo2, Layers, Type, Image as ImageIcon, Quote, Info,
  AlertTriangle, Minus, Presentation, LayoutGrid, Play, Music,
  ExternalLink, BarChart3, Clock, Table, BarChart2, ChevronDown as ChevDown,
  ListOrdered, Columns, Hash, MousePointerClick, Code, Download,
  ListChecks, Sparkles, Search, X, ChevronsUpDown, List
} from 'lucide-react';
import type { ContentSection, ContentSectionType, SectionCategory } from '@/src/types/content-section';
import { SECTION_TYPE_CONFIGS, SECTION_CATEGORIES } from '@/src/types/content-section';
import { useSections } from '../hooks/useSections';
import { getSectionLabel, getSectionColor } from '../sections/index';

// Section Editor imports
import { HtmlSectionEditor } from './sections/editors/HtmlSectionEditor';
import { ImageSectionEditor } from './sections/editors/ImageSectionEditor';
import { QuoteSectionEditor } from './sections/editors/QuoteSectionEditor';
import { CalloutSectionEditor } from './sections/editors/CalloutSectionEditor';
import { DividerSectionEditor } from './sections/editors/DividerSectionEditor';
import { ChartSectionEditor } from './sections/editors/ChartSectionEditor';
import { TimelineSectionEditor } from './sections/editors/TimelineSectionEditor';
import { PollSectionEditor } from './sections/editors/PollSectionEditor';
import { SlideshowSectionEditor } from './sections/editors/SlideshowSectionEditor';
import { VideoSectionEditor } from './sections/editors/VideoSectionEditor';
import { CodeSectionEditor } from './sections/editors/CodeSectionEditor';
import { TableSectionEditor } from './sections/editors/TableSectionEditor';
import { AccordionSectionEditor } from './sections/editors/AccordionSectionEditor';
import { TabsSectionEditor } from './sections/editors/TabsSectionEditor';
import { StepsSectionEditor } from './sections/editors/StepsSectionEditor';
import { NumbersSectionEditor } from './sections/editors/NumbersSectionEditor';
import { CTASectionEditor } from './sections/editors/CTASectionEditor';
import { AlertSectionEditor } from './sections/editors/AlertSectionEditor';
import { ToggleListSectionEditor } from './sections/editors/ToggleListSectionEditor';
import { GallerySectionEditor } from './sections/editors/GallerySectionEditor';
import { AudioSectionEditor } from './sections/editors/AudioSectionEditor';
import { EmbedSectionEditor } from './sections/editors/EmbedSectionEditor';
import { ComparisonSectionEditor } from './sections/editors/ComparisonSectionEditor';
import { FileDownloadSectionEditor } from './sections/editors/FileDownloadSectionEditor';
import { SectionTemplatePicker } from './SectionTemplates';

interface ContentSectionEditorProps {
  initialSections?: ContentSection[];
  onChange?: (sections: ContentSection[]) => void;
}

// Icon map for section types
const sectionIcons: Record<ContentSectionType, React.ElementType> = {
  'html': Type, 'image': ImageIcon, 'divider': Minus, 'quote': Quote,
  'callout': Info, 'alert': AlertTriangle, 'slideshow': Presentation,
  'gallery': LayoutGrid, 'video': Play, 'audio': Music,
  'embed': ExternalLink, 'chart': BarChart3, 'timeline': Clock,
  'table': Table, 'poll': BarChart2, 'accordion': ChevDown,
  'tabs': Layers, 'steps': ListOrdered, 'comparison': Columns,
  'numbers': Hash, 'cta': MousePointerClick, 'toggle-list': ListChecks,
  'code': Code, 'file-download': Download,
};

export function ContentSectionEditor({ initialSections, onChange }: ContentSectionEditorProps) {
  const {
    sections, setSections, activeSectionId, setActiveSectionId,
    addSection, removeSection, updateSection, moveUp, moveDown,
    duplicate, reorder, toggleVisibility, undo, redo, canUndo, canRedo,
    resetSections, sectionCount,
  } = useSections({ initialSections, onChange });

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [insertAfterId, setInsertAfterId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showOutline, setShowOutline] = useState(false);

  // Load initial sections
  useEffect(() => {
    if (initialSections && initialSections.length > 0) {
      setSections(initialSections);
    }
  }, []);

  const handleAddSection = useCallback((type: ContentSectionType) => {
    addSection(type, insertAfterId);
    setShowTypePicker(false);
    setInsertAfterId(null);
  }, [addSection, insertAfterId]);

  const openTypePicker = useCallback((afterId: string | null = null) => {
    setInsertAfterId(afterId);
    setShowTypePicker(true);
  }, []);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleCollapseAll = useCallback(() => {
    if (collapsedSections.size === sections.length) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(sections.map(s => s.id)));
    }
  }, [sections, collapsedSections]);

  const handleInsertTemplate = useCallback((templateSections: ContentSection[]) => {
    const currentMaxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 0;
    const newSections = templateSections.map((s, i) => ({ ...s, order: currentMaxOrder + i }));
    const merged = [...sections, ...newSections];
    setSections(merged);
    onChange?.(merged);
    if (newSections.length > 0) {
      setActiveSectionId(newSections[0].id);
    }
  }, [sections, setSections, onChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Drag handlers - only allow drag from handle
  const dragHandleActive = React.useRef(false);
  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    if (!dragHandleActive.current) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragHandleActive.current = false;
  };

  const renderSectionEditor = (section: ContentSection) => {
    const props = {
      section,
      onChange: (updates: Partial<ContentSection>) => updateSection(section.id, updates),
    };

    switch (section.type) {
      case 'html': return <HtmlSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'image': return <ImageSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'quote': return <QuoteSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'callout': return <CalloutSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'divider': return <DividerSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'chart': return <ChartSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'timeline': return <TimelineSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'poll': return <PollSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'slideshow': return <SlideshowSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'video': return <VideoSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'code': return <CodeSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'table': return <TableSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'accordion': return <AccordionSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'tabs': return <TabsSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'steps': return <StepsSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'numbers': return <NumbersSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'cta': return <CTASectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'alert': return <AlertSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'toggle-list': return <ToggleListSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'gallery': return <GallerySectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'audio': return <AudioSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'embed': return <EmbedSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'comparison': return <ComparisonSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      case 'file-download': return <FileDownloadSectionEditor {...props} section={section} onChange={(u) => updateSection(section.id, u)} />;
      default: return <div className="p-4 text-gray-500">Editor not available for type: {section.type}</div>;
    }
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {sectionCount} section{sectionCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
          {sections.length > 0 && (
            <div className="contents">
              <button
                onClick={toggleCollapseAll}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
                title={collapsedSections.size === sections.length ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}
              >
                <ChevronsUpDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowOutline(!showOutline)}
                className={`p-1.5 rounded-lg transition-colors ${showOutline ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'}`}
                title="Section Outline"
              >
                <List className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
            </div>
          )}
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Templates
          </button>
          <button
            onClick={() => openTypePicker(sections.length > 0 ? sections[sections.length - 1].id : null)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm section
          </button>
        </div>
      </div>

      {/* Section Outline */}
      {showOutline && sections.length > 0 && (
        <SectionOutline
          sections={sections}
          activeSectionId={activeSectionId}
          onSelect={(id) => {
            setActiveSectionId(id);
            const el = document.getElementById(`section-${id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          sectionIcons={sectionIcons}
        />
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <EmptyState onAdd={() => openTypePicker(null)} />
      ) : (
        <div className="space-y-1">
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.type] || Type;
            const color = getSectionColor(section.type);
            const isActive = activeSectionId === section.id;
            const isCollapsed = collapsedSections.has(section.id);
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div key={section.id} className="space-y-0">
                {/* Section Card */}
                <div
                  className={`group rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'border-blue-400/60 dark:border-blue-500/40 shadow-lg shadow-blue-500/5 ring-1 ring-blue-400/20'
                      : 'border-gray-200/80 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${isDragging ? 'opacity-50 scale-[0.98]' : ''} ${
                    isDragOver ? 'border-blue-400 border-dashed' : ''
                  } ${!section.isVisible ? 'opacity-60' : ''} bg-white dark:bg-gray-800`}
                  id={`section-${section.id}`}
                  draggable
                  onDragStart={handleDragStart(index)}
                  onDragOver={handleDragOver(index)}
                  onDrop={handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-700/50">
                    {/* Drag Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onMouseDown={() => dragHandleActive.current = true}
                      onMouseUp={() => dragHandleActive.current = false}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Collapse Toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCollapse(section.id); }}
                      className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                      title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                    </button>

                    {/* Type Badge */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{getSectionLabel(section.type)}</span>
                    </div>

                    {/* Section Title */}
                    {section.title && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {section.title}
                      </span>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); moveUp(section.id); }} disabled={index === 0}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" title="Di chuyển lên">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); moveDown(section.id); }} disabled={index === sections.length - 1}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" title="Di chuyển xuống">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); duplicate(section.id); }}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Nhân bản">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title={section.isVisible ? 'Ẩn' : 'Hiện'}>
                        {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); if (confirm('Xóa section này?')) removeSection(section.id); }}
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors" title="Xóa">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Body */}
                  {!isCollapsed && (
                    <div className="p-4">
                      {renderSectionEditor(section)}
                    </div>
                  )}
                </div>

                {/* Add Section Button Between Sections */}
                <div className="flex justify-center py-0.5 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openTypePicker(section.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                  >
                    <Plus className="w-3 h-3" /> Thêm section
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section Type Picker Modal */}
      {showTypePicker && (
        <SectionTypePicker
          onSelect={handleAddSection}
          onClose={() => setShowTypePicker(false)}
        />
      )}

      {/* Section Template Picker Modal */}
      {showTemplates && (
        <SectionTemplatePicker
          onInsert={handleInsertTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

// ==================== EMPTY STATE ====================

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const quickTypes: { type: ContentSectionType; icon: React.ElementType; label: string }[] = [
    { type: 'html', icon: Type, label: 'Văn bản' },
    { type: 'image', icon: ImageIcon, label: 'Hình ảnh' },
    { type: 'video', icon: Play, label: 'Video' },
    { type: 'chart', icon: BarChart3, label: 'Biểu đồ' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
        <Layers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-gray-900 dark:text-gray-100 mb-1">Nội dung trống</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
        Thêm section để bắt đầu xây dựng nội dung bài viết
      </p>
      <div className="flex items-center gap-2 mb-4">
        {quickTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onAdd()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-sm"
          >
            <Icon className="w-4 h-4" style={{ color: getSectionColor(type) }} />
            {label}
          </button>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 text-sm"
      >
        <Plus className="w-4 h-4" /> Thêm section
      </button>
    </div>
  );
}

// ==================== SECTION TYPE PICKER ====================

function SectionTypePicker({ onSelect, onClose }: { onSelect: (type: ContentSectionType) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SectionCategory | 'all'>('all');

  const filtered = SECTION_TYPE_CONFIGS.filter(c => {
    if (activeCategory !== 'all' && c.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.label.toLowerCase().includes(q) || c.labelVi.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 max-h-[80vh] flex flex-col animate-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-gray-900 dark:text-gray-100">Thêm Section</h3>
            <p className="text-xs text-gray-500 mt-0.5">Chọn loại nội dung muốn thêm</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm loại section..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              activeCategory === 'all' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Tất cả
          </button>
          {SECTION_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.labelVi}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filtered.map(config => {
              const Icon = sectionIcons[config.type] || Type;
              return (
                <button
                  key={config.type}
                  onClick={() => onSelect(config.type)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-left group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${getSectionColor(config.type)}15`, color: getSectionColor(config.type) }}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{config.labelVi}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{config.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">Không tìm thấy loại section phù hợp</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== SECTION OUTLINE ====================

function SectionOutline({
  sections,
  activeSectionId,
  onSelect,
  sectionIcons,
}: {
  sections: ContentSection[];
  activeSectionId: string | null;
  onSelect: (id: string) => void;
  sectionIcons: Record<ContentSectionType, React.ElementType>;
}) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-3">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700/50">
        <List className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-xs text-gray-500">Section Outline</span>
      </div>
      <div className="space-y-0.5 max-h-48 overflow-y-auto">
        {sections.map((section, index) => {
          const Icon = sectionIcons[section.type] || Type;
          const color = getSectionColor(section.type);
          const isActive = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${!section.isVisible ? 'opacity-40' : ''}`}
            >
              <span className="w-5 text-[10px] text-gray-400 text-right flex-shrink-0">{index + 1}</span>
              <Icon className="w-3 h-3 flex-shrink-0" style={{ color }} />
              <span className="text-xs truncate flex-1">
                {section.title || getSectionLabel(section.type)}
              </span>
              {!section.isVisible && <EyeOff className="w-3 h-3 text-orange-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ContentSectionEditor;