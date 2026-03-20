import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Type, Square, Circle, Image as ImageIcon, BarChart3, PieChart, TrendingUp,
  Sparkles, Layers, Download, Upload, Trash2, Copy, ZoomIn, ZoomOut,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Palette, Move,
  Lock, Unlock, Eye, EyeOff, ChevronRight, ChevronDown, Wand2, 
  AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Group, Ungroup,
  Undo2, Redo2, Grid, Star, Triangle, Hexagon, ArrowRight, Minus, Plus,
  Settings, FileImage, Search, X, ChevronUp, ChevronLeft, RotateCw, Send,
  Smile, Heart, Zap, Target, TrendingDown, Globe, MessageCircle, Mail,
  Phone, MapPin, Calendar, Clock, Users, ShoppingCart, DollarSign, Award,
  Bookmark, Flag, Tag, Filter, Layout, GripVertical, ArrowUp, ArrowDown,
  Droplet, Sliders, Maximize2, FlipHorizontal, FlipVertical,
  Clipboard, Save, FolderOpen, Diamond, Pentagon, Octagon, Pencil, Edit3,
  Columns, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, Type as TypeIcon,
  Ruler, Crop, Monitor, MoreHorizontal, Keyboard, HelpCircle,
  Table, Check, Gauge, Cog, Shield, Wind, Zap as Lightning, Fuel,
  Car, Weight, Sofa, Volume2, Navigation, Radio, Wifi, Usb, Battery
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  PieChart as RechartsPie, Pie, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { AdvancedColorPicker } from './AdvancedColorPicker';
import { CanvasSizePresets, canvasPresets } from './CanvasSizePresets';
import { TransformPanel } from './TransformPanel';
import { TextStylePresets, textStylePresets } from './TextStylePresets';
import { TableElement } from './TableElement';
import { LayersPanel } from './LayersPanel';
import { HistoryPanel } from './HistoryPanel';
import { SmartGuidesWithDistances } from './SmartGuides';
import { EffectsPanel } from './EffectsPanel';
import { ElementLibrary, ElementLibraryItem } from './ElementLibrary';

interface GradientStop {
  color: string;
  position: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
}

interface TableCell {
  content: string;
  type?: 'text' | 'icon' | 'checkmark' | 'image';
  iconName?: string;
  iconColor?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string;
  fontSize?: number;
  color?: string;
  colspan?: number;
  rowspan?: number;
  merged?: boolean; // Cell is merged into another cell (skip rendering)
}

interface InfographicElement {
  id: string;
  type: 'text' | 'shape' | 'chart' | 'image' | 'icon' | 'line' | 'custom-shape' | 'table' | 'connector' | 'badge' | 'progress-bar';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  groupId?: string;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  // Type-specific properties
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  backgroundGradient?: { 
    enabled: boolean;
    type: 'linear' | 'radial' | 'conic';
    angle: number;
    stops: GradientStop[];
  };
  opacity?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  shadow?: {
    enabled: boolean;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
  };
  textShadow?: {
    enabled: boolean;
    x: number;
    y: number;
    blur: number;
    color: string;
  };
  textStroke?: {
    enabled: boolean;
    width: number;
    color: string;
  };
  blur?: number;
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon' | 'polygon' | 'rounded-rect' | 'diamond' | 'pentagon' | 'octagon' | 'arrow' | 'cloud' | 'burst';
  chartType?: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'radar' | 'scatter' | 'composed';
  chartData?: ChartDataItem[];
  chartColors?: string[];
  imageUrl?: string;
  iconName?: string;
  iconColor?: string;
  lineType?: 'straight' | 'arrow' | 'dashed' | 'dotted' | 'curved';
  lineWidth?: number;
  points?: { x: number; y: number }[];
  // Custom shape properties
  customPoints?: { x: number; y: number }[];
  fillRule?: 'nonzero' | 'evenodd';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeLinecap?: 'butt' | 'round' | 'square';
  // Table properties
  tableData?: TableCell[][];
  tableColumns?: number;
  tableRows?: number;
  tableHeaderRow?: boolean;
  tableHeaderColumn?: boolean;
  tableCellPadding?: number;
  tableShowBorders?: boolean;
  tableBorderColor?: string;
  tableBorderWidth?: number;
  tableAlternateRowColors?: boolean;
  tableAlternateRowColor?: string;
  // Connector properties
  connectorType?: 'straight' | 'elbow' | 'curved';
  connectorStartX?: number;
  connectorStartY?: number;
  connectorEndX?: number;
  connectorEndY?: number;
  connectorArrowStart?: boolean;
  connectorArrowEnd?: boolean;
  // Badge properties
  badgeNumber?: number;
  badgeText?: string;
  badgeShape?: 'circle' | 'square' | 'pill';
  badgeStyle?: 'filled' | 'outlined';
  // Progress bar properties
  progressValue?: number;
  progressMax?: number;
  progressLabel?: string;
  progressShowValue?: boolean;
  progressBarColor?: string;
  progressTrackColor?: string;
}

interface InfographicBuilderProps {
  onChange?: (elements: InfographicElement[]) => void;
  initialElements?: InfographicElement[];
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: InfographicElement[];
}

const shapeLibrary = [
  { id: 'rectangle', name: 'Hình chữ nhật', icon: Square },
  { id: 'rounded-rect', name: 'HCN bo góc', icon: Square },
  { id: 'circle', name: 'Hình tròn', icon: Circle },
  { id: 'triangle', name: 'Tam giác', icon: Triangle },
  { id: 'diamond', name: 'Hình thoi', icon: Diamond },
  { id: 'pentagon', name: 'Ngũ giác', icon: Pentagon },
  { id: 'hexagon', name: 'Lục giác', icon: Hexagon },
  { id: 'octagon', name: 'Bát giác', icon: Octagon },
  { id: 'star', name: 'Ngôi sao', icon: Star },
  { id: 'arrow', name: 'Mũi tên', icon: ArrowRight },
];

const gradientPresets = [
  { name: 'Hoàng hôn', stops: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 100 }] },
  { name: 'Đại dương', stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }] },
  { name: 'Rừng xanh', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
  { name: 'Tím mờ', stops: [{ color: '#8e2de2', position: 0 }, { color: '#4a00e0', position: 100 }] },
  { name: 'Lửa', stops: [{ color: '#ee0979', position: 0 }, { color: '#ff6a00', position: 100 }] },
  { name: 'Băng giá', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
];

// Infographic Templates - Professional & Suitable for Information Graphics
const templates: Template[] = [
  // Template 1: Statistical Highlights
  {
    id: 'statistical-highlights',
    name: 'Thống Kê Nổi Bật',
    category: 'statistics',
    thumbnail: '📊',
    elements: [
      {
        id: 'ms-title',
        type: 'text',
        x: 50,
        y: 40,
        width: 700,
        height: 80,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'Bảng hiệu suất 2024',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        opacity: 1,
        backgroundGradient: {
          enabled: true,
          type: 'linear',
          angle: 45,
          stops: [
            { color: '#667eea', position: 0 },
            { color: '#764ba2', position: 100 }
          ]
        },
        borderRadius: 16,
        shadow: {
          enabled: true,
          x: 0,
          y: 4,
          blur: 20,
          spread: 0,
          color: 'rgba(102, 126, 234, 0.3)'
        }
      },
      // Stat cards with gradients and shadows
      ...Array.from({ length: 4 }, (_, i) => [
        {
          id: `ms-card-${i}`,
          type: 'shape' as const,
          x: 50 + (i % 2) * 380,
          y: 160 + Math.floor(i / 2) * 220,
          width: 340,
          height: 180,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 1,
          shapeType: 'rounded-rect' as const,
          backgroundColor: '#ffffff',
          borderRadius: 20,
          opacity: 1,
          shadow: {
            enabled: true,
            x: 0,
            y: 8,
            blur: 24,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderStyle: 'solid' as const
        },
        {
          id: `ms-value-${i}`,
          type: 'text' as const,
          x: 70 + (i % 2) * 380,
          y: 190 + Math.floor(i / 2) * 220,
          width: 300,
          height: 70,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: `${(i + 1) * 125}K`,
          fontSize: 56,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: '#1e293b',
          backgroundColor: 'transparent',
          opacity: 1,
          backgroundGradient: {
            enabled: true,
            type: 'linear',
            angle: 135,
            stops: [
              { color: ['#667eea', '#10b981', '#f59e0b', '#ef4444'][i], position: 0 },
              { color: ['#764ba2', '#059669', '#d97706', '#dc2626'][i], position: 100 }
            ]
          }
        },
        {
          id: `ms-label-${i}`,
          type: 'text' as const,
          x: 70 + (i % 2) * 380,
          y: 270 + Math.floor(i / 2) * 220,
          width: 300,
          height: 40,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['Tổng người dùng', 'Doanh thu', 'Lượt tải', 'Người dùng hoạt động'][i],
          fontSize: 16,
          fontWeight: 'medium',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: '#64748b',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat()
    ]
  },
  {
    id: 'timeline-elegant',
    name: 'Dòng thời gian trang nhã',
    category: 'timeline',
    thumbnail: '📅',
    elements: [
      {
        id: 'tl-title',
        type: 'text',
        x: 50,
        y: 30,
        width: 700,
        height: 70,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'Hành trình của chúng tôi',
        fontSize: 52,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#0f172a',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Vertical line
      {
        id: 'tl-line',
        type: 'shape',
        x: 390,
        y: 130,
        width: 4,
        height: 450,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        shapeType: 'rectangle',
        backgroundColor: '#e2e8f0',
        opacity: 1
      },
      // Timeline items
      ...Array.from({ length: 4 }, (_, i) => [
        {
          id: `tl-dot-${i}`,
          type: 'shape' as const,
          x: 370,
          y: 140 + i * 120,
          width: 44,
          height: 44,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          shapeType: 'circle' as const,
          backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i],
          opacity: 1,
          shadow: {
            enabled: true,
            x: 0,
            y: 4,
            blur: 16,
            spread: 0,
            color: `rgba(${[59, 139, 236, 16][i]}, ${[130, 92, 72, 185][i]}, ${[246, 246, 153, 129][i]}, 0.4)`
          }
        },
        {
          id: `tl-card-${i}`,
          type: 'shape' as const,
          x: i % 2 === 0 ? 450 : 80,
          y: 130 + i * 120,
          width: 280,
          height: 90,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 1,
          shapeType: 'rounded-rect' as const,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          opacity: 1,
          shadow: {
            enabled: true,
            x: 0,
            y: 4,
            blur: 20,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.08)'
          },
          borderWidth: 1,
          borderColor: '#f1f5f9',
          borderStyle: 'solid' as const
        },
        {
          id: `tl-year-${i}`,
          type: 'text' as const,
          x: (i % 2 === 0 ? 450 : 80) + 20,
          y: 140 + i * 120,
          width: 240,
          height: 30,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: `${2021 + i}`,
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i],
          backgroundColor: 'transparent',
          opacity: 1
        },
        {
          id: `tl-desc-${i}`,
          type: 'text' as const,
          x: (i % 2 === 0 ? 450 : 80) + 20,
          y: 168 + i * 120,
          width: 240,
          height: 40,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['Thành lập công ty', 'Ra mắt lớn đầu tiên', 'Mở rộng toàn cầu', 'Dẫn đầu thị trường'][i],
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: '#64748b',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat()
    ]
  },
  {
    id: 'process-flow',
    name: 'Quy trình',
    category: 'process',
    thumbnail: '🔄',
    elements: [
      {
        id: 'pf-title',
        type: 'text',
        x: 50,
        y: 30,
        width: 700,
        height: 70,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'Cách hoạt động',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        opacity: 1,
        backgroundGradient: {
          enabled: true,
          type: 'linear',
          angle: 90,
          stops: [
            { color: '#6366f1', position: 0 },
            { color: '#8b5cf6', position: 100 }
          ]
        }
      },
      // Process steps
      ...Array.from({ length: 4 }, (_, i) => [
        {
          id: `pf-step-${i}`,
          type: 'shape' as const,
          x: 60 + i * 180,
          y: 140,
          width: 140,
          height: 180,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 1,
          shapeType: 'rounded-rect' as const,
          backgroundColor: '#ffffff',
          borderRadius: 20,
          opacity: 1,
          backgroundGradient: {
            enabled: true,
            type: 'linear',
            angle: 135,
            stops: [
              { color: '#f8fafc', position: 0 },
              { color: '#f1f5f9', position: 100 }
            ]
          },
          shadow: {
            enabled: true,
            x: 0,
            y: 8,
            blur: 30,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid' as const
        },
        {
          id: `pf-number-${i}`,
          type: 'shape' as const,
          x: 90 + i * 180,
          y: 165,
          width: 60,
          height: 60,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          shapeType: 'circle' as const,
          backgroundColor: 'transparent',
          opacity: 1,
          backgroundGradient: {
            enabled: true,
            type: 'linear',
            angle: 135,
            stops: [
              { color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i], position: 0 },
              { color: ['#1d4ed8', '#6d28d9', '#be185d', '#059669'][i], position: 100 }
            ]
          }
        },
        {
          id: `pf-num-text-${i}`,
          type: 'text' as const,
          x: 90 + i * 180,
          y: 175,
          width: 60,
          height: 40,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 3,
          content: `${i + 1}`,
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: '#ffffff',
          backgroundColor: 'transparent',
          opacity: 1
        },
        {
          id: `pf-label-${i}`,
          type: 'text' as const,
          x: 70 + i * 180,
          y: 245,
          width: 120,
          height: 60,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['Nghiên cứu', 'Thiết kế', 'Xây dựng', 'Ra mắt'][i],
          fontSize: 18,
          fontWeight: 'semibold',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: '#1e293b',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat(),
      // Arrows between steps
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `pf-arrow-${i}`,
        type: 'line' as const,
        x: 205 + i * 180,
        y: 218,
        width: 40,
        height: 4,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        lineType: 'arrow' as const,
        lineWidth: 3,
        color: '#cbd5e1',
        opacity: 1
      }))
    ]
  },
  {
    id: 'comparison-table',
    name: 'So sánh tính năng',
    category: 'comparison',
    thumbnail: '⚖️',
    elements: [
      {
        id: 'ct-title',
        type: 'text',
        x: 50,
        y: 30,
        width: 700,
        height: 60,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'So sánh gói dịch vụ',
        fontSize: 44,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#0f172a',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Three columns
      ...Array.from({ length: 3 }, (_, i) => [
        {
          id: `ct-column-${i}`,
          type: 'shape' as const,
          x: 60 + i * 230,
          y: 120,
          width: 210,
          height: 420,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 1,
          shapeType: 'rounded-rect' as const,
          backgroundColor: i === 1 ? '#ffffff' : '#f8fafc',
          borderRadius: 20,
          opacity: 1,
          shadow: {
            enabled: true,
            x: 0,
            y: i === 1 ? 12 : 4,
            blur: i === 1 ? 40 : 20,
            spread: 0,
            color: i === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.08)'
          },
          borderWidth: i === 1 ? 2 : 1,
          borderColor: i === 1 ? '#6366f1' : '#e2e8f0',
          borderStyle: 'solid' as const
        },
        {
          id: `ct-plan-${i}`,
          type: 'text' as const,
          x: 70 + i * 230,
          y: 145,
          width: 190,
          height: 40,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['Cơ bản', 'Chuyên nghiệp', 'Doanh nghiệp'][i],
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: i === 1 ? '#6366f1' : '#1e293b',
          backgroundColor: 'transparent',
          opacity: 1
        },
        {
          id: `ct-price-${i}`,
          type: 'text' as const,
          x: 70 + i * 230,
          y: 185,
          width: 190,
          height: 60,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['$9', '$29', '$99'][i],
          fontSize: 48,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: '#0f172a',
          backgroundColor: 'transparent',
          opacity: 1,
          backgroundGradient: i === 1 ? {
            enabled: true,
            type: 'linear',
            angle: 135,
            stops: [
              { color: '#6366f1', position: 0 },
              { color: '#8b5cf6', position: 100 }
            ]
          } : undefined
        },
        {
          id: `ct-period-${i}`,
          type: 'text' as const,
          x: 70 + i * 230,
          y: 245,
          width: 190,
          height: 25,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: '/month',
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: '#64748b',
          backgroundColor: 'transparent',
          opacity: 1
        },
        {
          id: `ct-features-${i}`,
          type: 'text' as const,
          x: 80 + i * 230,
          y: 290,
          width: 170,
          height: 200,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: `✓ ${['5', '50', 'Không giới hạn'][i]} Dự án\n✓ ${['5GB', '100GB', '1TB'][i]} Lưu trữ\n✓ Hỗ trợ ${['Email', 'Ưu tiên', '24/7'][i]}\n${i >= 1 ? '✓ Phân tích nâng cao' : '✗ Phân tích nâng cao'}\n${i >= 2 ? '✓ Tên miền riêng' : '✗ Tên miền riêng'}`,
          fontSize: 13,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: '#475569',
          backgroundColor: 'transparent',
          opacity: 1,
          lineHeight: 2
        },
        {
          id: `ct-btn-${i}`,
          type: 'shape' as const,
          x: 90 + i * 230,
          y: 490,
          width: 150,
          height: 40,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          shapeType: 'rounded-rect' as const,
          backgroundColor: i === 1 ? '#6366f1' : 'transparent',
          borderRadius: 10,
          opacity: 1,
          borderWidth: i === 1 ? 0 : 2,
          borderColor: i === 1 ? 'transparent' : '#cbd5e1',
          borderStyle: 'solid' as const
        },
        {
          id: `ct-btn-text-${i}`,
          type: 'text' as const,
          x: 90 + i * 230,
          y: 497,
          width: 150,
          height: 26,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 3,
          content: 'Bắt đầu',
          fontSize: 14,
          fontWeight: 'semibold',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: i === 1 ? '#ffffff' : '#475569',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat()
    ]
  },
  {
    id: 'social-proof',
    name: 'Thống kê xã hội',
    category: 'social',
    thumbnail: '⭐',
    elements: [
      {
        id: 'sp-bg',
        type: 'shape',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: 'transparent',
        opacity: 1,
        backgroundGradient: {
          enabled: true,
          type: 'linear',
          angle: 135,
          stops: [
            { color: '#667eea', position: 0 },
            { color: '#764ba2', position: 100 }
          ]
        }
      },
      {
        id: 'sp-title',
        type: 'text',
        x: 50,
        y: 60,
        width: 700,
        height: 80,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: 'Được hàng ngàn người tin dùng',
        fontSize: 52,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        opacity: 1
      },
      {
        id: 'sp-subtitle',
        type: 'text',
        x: 100,
        y: 140,
        width: 600,
        height: 40,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: 'Tham gia cộng đồng khách hàng hài lòng đang ngày càng phát triển',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Stats grid
      ...Array.from({ length: 4 }, (_, i) => [
        {
          id: `sp-stat-card-${i}`,
          type: 'shape' as const,
          x: 80 + (i % 2) * 340,
          y: 220 + Math.floor(i / 2) * 160,
          width: 300,
          height: 120,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 1,
          shapeType: 'rounded-rect' as const,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 20,
          opacity: 1,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderStyle: 'solid' as const,
          shadow: {
            enabled: true,
            x: 0,
            y: 8,
            blur: 32,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        {
          id: `sp-stat-value-${i}`,
          type: 'text' as const,
          x: 100 + (i % 2) * 340,
          y: 245 + Math.floor(i / 2) * 160,
          width: 260,
          height: 50,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['50K+', '4.9/5', '99.9%', '24/7'][i],
          fontSize: 44,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: '#ffffff',
          backgroundColor: 'transparent',
          opacity: 1
        },
        {
          id: `sp-stat-label-${i}`,
          type: 'text' as const,
          x: 100 + (i % 2) * 340,
          y: 295 + Math.floor(i / 2) * 160,
          width: 260,
          height: 30,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['Người dùng hoạt động', 'Đánh giá khách hàng', 'Thời gian hoạt động', 'Hỗ trợ'][i],
          fontSize: 15,
          fontWeight: 'medium',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: 'rgba(255, 255, 255, 0.85)',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat()
    ]
  },
  {
    id: 'product-features',
    name: 'Lưới tính năng sản phẩm',
    category: 'product',
    thumbnail: '✨',
    elements: [
      {
        id: 'pf-bg',
        type: 'shape',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#f8fafc',
        opacity: 1
      },
      {
        id: 'pf-title',
        type: 'text',
        x: 50,
        y: 40,
        width: 700,
        height: 70,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: 'Tính năng cao cấp',
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#0f172a',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Feature grid 2x3
      ...Array.from({ length: 6 }, (_, i) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
        const icons = ['⚡', '🔒', '🚀', '📊', '🎨', '🔧'];
        const titles = ['Siêu nhanh', 'Bảo mật', 'Mở rộng', 'Phân tích', 'Tùy chỉnh', 'Dễ cài đặt'];
        const descs = ['Hiệu suất vượt trội', 'Bảo mật cấp ngân hàng', 'Mở rộng theo bạn', 'Phân tích sâu', 'Thương hiệu riêng', 'Khởi động nhanh chóng'];
        
        return [
          {
            id: `pf-card-${i}`,
            type: 'shape' as const,
            x: 60 + (i % 3) * 240,
            y: 140 + Math.floor(i / 3) * 220,
            width: 220,
            height: 190,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 1,
            shapeType: 'rounded-rect' as const,
            backgroundColor: '#ffffff',
            borderRadius: 20,
            opacity: 1,
            shadow: {
              enabled: true,
              x: 0,
              y: 4,
              blur: 24,
              spread: 0,
              color: 'rgba(0, 0, 0, 0.08)'
            },
            borderWidth: 1,
            borderColor: '#f1f5f9',
            borderStyle: 'solid' as const
          },
          {
            id: `pf-icon-bg-${i}`,
            type: 'shape' as const,
            x: 140 + (i % 3) * 240,
            y: 165,
            width: 60,
            height: 60,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            shapeType: 'circle' as const,
            backgroundColor: `${colors[i]}15`,
            opacity: 1
          },
          {
            id: `pf-icon-${i}`,
            type: 'text' as const,
            x: 140 + (i % 3) * 240,
            y: 175,
            width: 60,
            height: 40,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 3,
            content: icons[i],
            fontSize: 32,
            fontWeight: 'normal',
            fontFamily: 'Inter',
            textAlign: 'center' as const,
            color: colors[i],
            backgroundColor: 'transparent',
            opacity: 1
          },
          {
            id: `pf-feat-title-${i}`,
            type: 'text' as const,
            x: 70 + (i % 3) * 240,
            y: 245,
            width: 200,
            height: 30,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            content: titles[i],
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Inter',
            textAlign: 'center' as const,
            color: '#1e293b',
            backgroundColor: 'transparent',
            opacity: 1
          },
          {
            id: `pf-feat-desc-${i}`,
            type: 'text' as const,
            x: 75 + (i % 3) * 240,
            y: 280,
            width: 190,
            height: 40,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            content: descs[i],
            fontSize: 14,
            fontWeight: 'normal',
            fontFamily: 'Inter',
            textAlign: 'center' as const,
            color: '#64748b',
            backgroundColor: 'transparent',
            opacity: 1
          }
        ];
      }).flat()
    ]
  },
  {
    id: 'data-visualization',
    name: 'Trực quan hóa dữ liệu',
    category: 'analytics',
    thumbnail: '📈',
    elements: [
      {
        id: 'dv-title',
        type: 'text',
        x: 50,
        y: 30,
        width: 700,
        height: 70,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'Hiệu suất hàng năm',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#0f172a',
        backgroundColor: 'transparent',
        opacity: 1
      },
      {
        id: 'dv-subtitle',
        type: 'text',
        x: 100,
        y: 100,
        width: 600,
        height: 35,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'Các chỉ số và xu hướng tăng trưởng chính năm 2024',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#64748b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Large chart
      {
        id: 'dv-main-chart',
        type: 'chart',
        x: 50,
        y: 160,
        width: 700,
        height: 280,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        chartType: 'area',
        chartData: [
          { name: 'Th1', value: 4000 },
          { name: 'Th2', value: 5200 },
          { name: 'Th3', value: 4800 },
          { name: 'Th4', value: 6400 },
          { name: 'Th5', value: 7800 },
          { name: 'Th6', value: 9200 },
        ],
        chartColors: ['#3b82f6', '#8b5cf6', '#ec4899'],
        opacity: 1,
        backgroundGradient: {
          enabled: false,
          type: 'linear',
          angle: 0,
          stops: []
        },
        shadow: {
          enabled: true,
          x: 0,
          y: 8,
          blur: 32,
          spread: 0,
          color: 'rgba(0, 0, 0, 0.08)'
        }
      },
      // Metric cards
      ...Array.from({ length: 3 }, (_, i) => [
        {
          id: `dv-metric-${i}`,
          type: 'shape' as const,
          x: 50 + i * 233,
          y: 470,
          width: 218,
          height: 100,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 1,
          shapeType: 'rounded-rect' as const,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          opacity: 1,
          backgroundGradient: {
            enabled: true,
            type: 'linear',
            angle: 135,
            stops: [
              { color: ['#eff6ff', '#f5f3ff', '#fdf2f8'][i], position: 0 },
              { color: ['#dbeafe', '#ede9fe', '#fce7f3'][i], position: 100 }
            ]
          },
          borderWidth: 1,
          borderColor: ['#bfdbfe', '#c4b5fd', '#f9a8d4'][i],
          borderStyle: 'solid' as const
        },
        {
          id: `dv-metric-value-${i}`,
          type: 'text' as const,
          x: 65 + i * 233,
          y: 490,
          width: 188,
          height: 36,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['+45%', '12.5K', '$890K'][i],
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: ['#1e40af', '#6d28d9', '#be185d'][i],
          backgroundColor: 'transparent',
          opacity: 1
        },
        {
          id: `dv-metric-label-${i}`,
          type: 'text' as const,
          x: 65 + i * 233,
          y: 530,
          width: 188,
          height: 25,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          content: ['Tốc độ tăng trưởng', 'Người dùng mới', 'Doanh thu'][i],
          fontSize: 14,
          fontWeight: 'medium',
          fontFamily: 'Inter',
          textAlign: 'left' as const,
          color: '#64748b',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat()
    ]
  },
  {
    id: 'hero-banner',
    name: 'Banner nổi bật',
    category: 'marketing',
    thumbnail: '🎯',
    elements: [
      {
        id: 'hb-bg',
        type: 'shape',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: 'transparent',
        opacity: 1,
        backgroundGradient: {
          enabled: true,
          type: 'linear',
          angle: 135,
          stops: [
            { color: '#0f172a', position: 0 },
            { color: '#1e293b', position: 50 },
            { color: '#334155', position: 100 }
          ]
        }
      },
      // Decorative shapes
      {
        id: 'hb-circle-1',
        type: 'shape',
        x: 600,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        shapeType: 'circle',
        backgroundColor: 'transparent',
        opacity: 0.1,
        backgroundGradient: {
          enabled: true,
          type: 'radial',
          angle: 0,
          stops: [
            { color: '#3b82f6', position: 0 },
            { color: '#8b5cf6', position: 100 }
          ]
        }
      },
      {
        id: 'hb-circle-2',
        type: 'shape',
        x: -50,
        y: 350,
        width: 250,
        height: 250,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        shapeType: 'circle',
        backgroundColor: 'transparent',
        opacity: 0.08,
        backgroundGradient: {
          enabled: true,
          type: 'radial',
          angle: 0,
          stops: [
            { color: '#ec4899', position: 0 },
            { color: '#f59e0b', position: 100 }
          ]
        }
      },
      // Main content
      {
        id: 'hb-eyebrow',
        type: 'text',
        x: 100,
        y: 180,
        width: 600,
        height: 30,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 2,
        content: 'GIỚI THIỆU',
        fontSize: 14,
        fontWeight: 'semibold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#3b82f6',
        backgroundColor: 'transparent',
        opacity: 1,
        letterSpacing: 2
      },
      {
        id: 'hb-heading',
        type: 'text',
        x: 80,
        y: 220,
        width: 640,
        height: 140,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 2,
        content: 'Tạo Infographic\nẤn tượng',
        fontSize: 64,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        opacity: 1,
        lineHeight: 1.1
      },
      {
        id: 'hb-subheading',
        type: 'text',
        x: 150,
        y: 380,
        width: 500,
        height: 50,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 2,
        content: 'Tạo nội dung trực quan ấn tượng với công cụ thiết kế và mẫu mạnh mẽ',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        opacity: 1,
        lineHeight: 1.6
      },
      // CTA Button
      {
        id: 'hb-cta-bg',
        type: 'shape',
        x: 275,
        y: 460,
        width: 250,
        height: 56,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 2,
        shapeType: 'rounded-rect',
        backgroundColor: 'transparent',
        borderRadius: 12,
        opacity: 1,
        backgroundGradient: {
          enabled: true,
          type: 'linear',
          angle: 135,
          stops: [
            { color: '#3b82f6', position: 0 },
            { color: '#8b5cf6', position: 100 }
          ]
        },
        shadow: {
          enabled: true,
          x: 0,
          y: 8,
          blur: 24,
          spread: 0,
          color: 'rgba(59, 130, 246, 0.4)'
        }
      },
      {
        id: 'hb-cta-text',
        type: 'text',
        x: 275,
        y: 475,
        width: 250,
        height: 26,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 3,
        content: 'Bắt đầu miễn phí',
        fontSize: 16,
        fontWeight: 'semibold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Feature badges
      ...Array.from({ length: 3 }, (_, i) => [
        {
          id: `hb-badge-${i}`,
          type: 'shape' as const,
          x: 200 + i * 140,
          y: 540,
          width: 120,
          height: 40,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 2,
          shapeType: 'rounded-rect' as const,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          opacity: 1,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderStyle: 'solid' as const
        },
        {
          id: `hb-badge-text-${i}`,
          type: 'text' as const,
          x: 205 + i * 140,
          y: 549,
          width: 110,
          height: 22,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 3,
          content: ['Dễ sử dụng', 'Không cần code', 'Xuất nhanh'][i],
          fontSize: 13,
          fontWeight: 'medium',
          fontFamily: 'Inter',
          textAlign: 'center' as const,
          color: 'rgba(255, 255, 255, 0.9)',
          backgroundColor: 'transparent',
          opacity: 1
        }
      ]).flat()
    ]
  },
  // Product Comparison Table Template (like car comparison infographic)
  {
    id: 'product-comparison',
    name: 'So Sánh Sản Phẩm',
    category: 'comparison',
    thumbnail: '⚖️',
    elements: [
      // Header/Title
      {
        id: 'comp-title',
        type: 'text',
        x: 50,
        y: 30,
        width: 700,
        height: 50,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'SO SÁNH SẢN PHẨM',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#1e293b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Hình ảnh sản phẩm (placeholder cho 3 sản phẩm)
      ...['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'].map((name, i) => ({
        id: `comp-product-${i}`,
        type: 'shape' as const,
        x: 50 + i * 233,
        y: 100,
        width: 200,
        height: 150,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        shapeType: 'rounded-rect' as const,
        backgroundColor: i === 0 ? '#dbeafe' : i === 1 ? '#f3f4f6' : '#fef2f2',
        borderRadius: 12,
        opacity: 1
      })),
      // Tên sản phẩm
      ...['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'].map((name, i) => ({
        id: `comp-name-${i}`,
        type: 'text' as const,
        x: 50 + i * 233,
        y: 260,
        width: 200,
        height: 40,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 2,
        content: name,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#1e293b',
        backgroundColor: 'transparent',
        opacity: 1
      })),
      // Comparison Table
      {
        id: 'comp-table',
        type: 'table',
        x: 50,
        y: 320,
        width: 700,
        height: 600,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 3,
        tableData: [
          // Header Row
          [
            { content: 'Đặc điểm', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'left' },
            { content: 'Sản phẩm A', fontWeight: 'bold', backgroundColor: '#dbeafe', textAlign: 'center' },
            { content: 'Sản phẩm B', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'center' },
            { content: 'Sản phẩm C', fontWeight: 'bold', backgroundColor: '#fef2f2', textAlign: 'center' }
          ],
          // Feature Rows
          [
            { content: 'Giá bán', textAlign: 'left', fontWeight: 'bold' },
            { content: '$499', textAlign: 'center' },
            { content: '$599', textAlign: 'center' },
            { content: '$699', textAlign: 'center' }
          ],
          [
            { content: 'Bảo hành', textAlign: 'left' },
            { content: '2 năm', textAlign: 'center' },
            { content: '3 năm', textAlign: 'center' },
            { content: '3 năm', textAlign: 'center' }
          ],
          [
            { content: 'Màu sắc', textAlign: 'left' },
            { content: '5', textAlign: 'center' },
            { content: '7', textAlign: 'center' },
            { content: '8', textAlign: 'center' }
          ],
          [
            { content: 'Kết nối Bluetooth', textAlign: 'left' },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'GPS tích hợp', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444' },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'Camera sau', textAlign: 'left' },
            { content: '12MP', textAlign: 'center' },
            { content: '48MP', textAlign: 'center' },
            { content: '64MP', textAlign: 'center' }
          ],
          [
            { content: 'Pin', textAlign: 'left' },
            { content: '3000mAh', textAlign: 'center' },
            { content: '4000mAh', textAlign: 'center' },
            { content: '5000mAh', textAlign: 'center' }
          ],
          [
            { content: 'Sạc nhanh', textAlign: 'left' },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'Chống nước', textAlign: 'left' },
            { content: 'IP67', textAlign: 'center' },
            { content: 'IP68', textAlign: 'center' },
            { content: 'IP68', textAlign: 'center' }
          ],
          [
            { content: 'Trọng lượng', textAlign: 'left' },
            { content: '185g', textAlign: 'center' },
            { content: '195g', textAlign: 'center' },
            { content: '205g', textAlign: 'center' }
          ]
        ],
        tableColumns: 4,
        tableRows: 11,
        tableHeaderRow: true,
        tableCellPadding: 12,
        tableShowBorders: true,
        tableBorderColor: '#e5e7eb',
        tableBorderWidth: 1,
        tableAlternateRowColors: false,
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#1e293b',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        opacity: 1
      }
    ]
  },
  // Sports/Team Comparison Template
  {
    id: 'sports-comparison',
    name: 'So Sánh Đội Thể Thao',
    category: 'sports',
    thumbnail: '⚽',
    elements: [
      {
        id: 'sports-title',
        type: 'text',
        x: 50,
        y: 20,
        width: 700,
        height: 60,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'ĐỘI A VS ĐỘI B',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#1e293b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      {
        id: 'sports-table',
        type: 'table',
        x: 50,
        y: 100,
        width: 700,
        height: 800,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        tableData: [
          [
            { content: 'THỐNG KÊ', fontWeight: 'bold', backgroundColor: '#1e293b', color: '#ffffff', textAlign: 'center', colspan: 3 }
          ],
          [
            { content: 'Đội A', fontWeight: 'bold', backgroundColor: '#3b82f6', color: '#ffffff', textAlign: 'center' },
            { content: '', backgroundColor: '#f3f4f6', textAlign: 'center' },
            { content: 'Đội B', fontWeight: 'bold', backgroundColor: '#ef4444', color: '#ffffff', textAlign: 'center' }
          ],
          [
            { content: '85', textAlign: 'center', fontSize: 32, fontWeight: 'bold', color: '#3b82f6' },
            { content: 'Bàn thắng', textAlign: 'center', fontWeight: 'bold' },
            { content: '92', textAlign: 'center', fontSize: 32, fontWeight: 'bold', color: '#ef4444' }
          ],
          [
            { content: '67%', textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#3b82f6' },
            { content: 'Tỷ lệ thắng', textAlign: 'center', fontWeight: 'bold' },
            { content: '71%', textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#ef4444' }
          ],
          [
            { content: '12', textAlign: 'center', fontSize: 24, color: '#3b82f6' },
            { content: 'Vô địch', textAlign: 'center', fontWeight: 'bold' },
            { content: '15', textAlign: 'center', fontSize: 24, color: '#ef4444' }
          ],
          [
            { content: '23', textAlign: 'center', fontSize: 24, color: '#3b82f6' },
            { content: 'Cầu thủ', textAlign: 'center', fontWeight: 'bold' },
            { content: '25', textAlign: 'center', fontSize: 24, color: '#ef4444' }
          ],
          [
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: 'Lợi thế sân nhà', textAlign: 'center' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 }
          ],
          [
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: 'Giải vua phá lưới', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ]
        ],
        tableColumns: 3,
        tableRows: 8,
        tableHeaderRow: false,
        tableCellPadding: 16,
        tableShowBorders: true,
        tableBorderColor: '#e5e7eb',
        tableBorderWidth: 2,
        tableAlternateRowColors: true,
        tableAlternateRowColor: '#fafafa',
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#1e293b',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        opacity: 1
      }
    ]
  },
  // Restaurant Menu Template
  {
    id: 'restaurant-menu',
    name: 'Menu Nhà Hàng',
    category: 'food',
    thumbnail: '🍽️',
    elements: [
      {
        id: 'menu-title',
        type: 'text',
        x: 50,
        y: 20,
        width: 700,
        height: 70,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'MENU NHÀ HÀNG',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#1e293b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      {
        id: 'menu-table',
        type: 'table',
        x: 50,
        y: 110,
        width: 700,
        height: 800,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        tableData: [
          [
            { content: 'MÓN ĂN', fontWeight: 'bold', backgroundColor: '#f97316', color: '#ffffff', textAlign: 'left' },
            { content: 'MÔ TẢ', fontWeight: 'bold', backgroundColor: '#f97316', color: '#ffffff', textAlign: 'left' },
            { content: 'GIÁ', fontWeight: 'bold', backgroundColor: '#f97316', color: '#ffffff', textAlign: 'center' }
          ],
          [
            { content: '🍕 Pizza Margherita', textAlign: 'left', fontWeight: 'bold', fontSize: 16 },
            { content: 'Sốt cà chua tươi, phô mai Mozzarella, húng quế', textAlign: 'left', fontSize: 14 },
            { content: '150.000₫', textAlign: 'center', fontWeight: 'bold', color: '#f97316', fontSize: 16 }
          ],
          [
            { content: '🍝 Spaghetti Carbonara', textAlign: 'left', fontWeight: 'bold', fontSize: 16 },
            { content: 'Mì Ý với sốt kem, thịt xông khói, phô mai Parmesan', textAlign: 'left', fontSize: 14 },
            { content: '180.000₫', textAlign: 'center', fontWeight: 'bold', color: '#f97316', fontSize: 16 }
          ],
          [
            { content: '🍔 Burger Bò Úc', textAlign: 'left', fontWeight: 'bold', fontSize: 16 },
            { content: 'Thịt bò Úc 200g, phô mai cheddar, rau tươi', textAlign: 'left', fontSize: 14 },
            { content: '220.000₫', textAlign: 'center', fontWeight: 'bold', color: '#f97316', fontSize: 16 }
          ],
          [
            { content: '🥗 Salad Caesar', textAlign: 'left', fontWeight: 'bold', fontSize: 16 },
            { content: 'Rau xanh tươi, thịt gà nướng, sốt Caesar đặc biệt', textAlign: 'left', fontSize: 14 },
            { content: '120.000₫', textAlign: 'center', fontWeight: 'bold', color: '#f97316', fontSize: 16 }
          ],
          [
            { content: '🍰 Tiramisu', textAlign: 'left', fontWeight: 'bold', fontSize: 16 },
            { content: 'Bánh ngọt Ý truyền thống với cà phê Espresso', textAlign: 'left', fontSize: 14 },
            { content: '95.000₫', textAlign: 'center', fontWeight: 'bold', color: '#f97316', fontSize: 16 }
          ],
          [
            { content: '☕ Cappuccino', textAlign: 'left', fontWeight: 'bold', fontSize: 16 },
            { content: 'Cà phê Espresso với sữa bọt mịn', textAlign: 'left', fontSize: 14 },
            { content: '65.000₫', textAlign: 'center', fontWeight: 'bold', color: '#f97316', fontSize: 16 }
          ]
        ],
        tableColumns: 3,
        tableRows: 7,
        tableHeaderRow: true,
        tableCellPadding: 12,
        tableShowBorders: true,
        tableBorderColor: '#fed7aa',
        tableBorderWidth: 1,
        tableAlternateRowColors: true,
        tableAlternateRowColor: '#fffbeb',
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#1e293b',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        opacity: 1
      }
    ]
  },
  // Pricing Table Template
  {
    id: 'pricing-table',
    name: 'Bảng Giá Dịch Vụ',
    category: 'pricing',
    thumbnail: '💰',
    elements: [
      {
        id: 'price-title',
        type: 'text',
        x: 50,
        y: 20,
        width: 700,
        height: 60,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'GÓI DỊCH VỤ CỦA CHÚNG TÔI',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#1e293b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      {
        id: 'price-table',
        type: 'table',
        x: 50,
        y: 100,
        width: 700,
        height: 750,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        tableData: [
          [
            { content: 'TÍNH NĂNG', fontWeight: 'bold', backgroundColor: '#6366f1', color: '#ffffff', textAlign: 'left' },
            { content: 'GÓI CƠ BẢN', fontWeight: 'bold', backgroundColor: '#dbeafe', textAlign: 'center' },
            { content: 'GÓI PRO', fontWeight: 'bold', backgroundColor: '#818cf8', color: '#ffffff', textAlign: 'center' },
            { content: 'GÓI ENTERPRISE', fontWeight: 'bold', backgroundColor: '#6366f1', color: '#ffffff', textAlign: 'center' }
          ],
          [
            { content: 'Giá / tháng', fontWeight: 'bold', textAlign: 'left' },
            { content: '99.000₫', textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#3b82f6' },
            { content: '299.000₫', textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#6366f1' },
            { content: '999.000₫', textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#4f46e5' }
          ],
          [
            { content: 'Số lượng users', textAlign: 'left' },
            { content: '5', textAlign: 'center' },
            { content: '25', textAlign: 'center' },
            { content: 'Không giới hạn', textAlign: 'center', fontWeight: 'bold' }
          ],
          [
            { content: 'Dung lượng lưu trữ', textAlign: 'left' },
            { content: '10 GB', textAlign: 'center' },
            { content: '100 GB', textAlign: 'center' },
            { content: '1 TB', textAlign: 'center', fontWeight: 'bold' }
          ],
          [
            { content: 'Hỗ trợ 24/7', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'API Access', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'Tên miền riêng', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'Hỗ trợ ưu tiên', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'Phân tích nâng cao', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ],
          [
            { content: 'Cộng tác nhóm', textAlign: 'left' },
            { content: '✗', textAlign: 'center', color: '#ef4444', fontSize: 20 },
            { content: '✓', type: 'checkmark', textAlign: 'center' },
            { content: '✓', type: 'checkmark', textAlign: 'center' }
          ]
        ],
        tableColumns: 4,
        tableRows: 10,
        tableHeaderRow: true,
        tableCellPadding: 14,
        tableShowBorders: true,
        tableBorderColor: '#c7d2fe',
        tableBorderWidth: 1,
        tableAlternateRowColors: true,
        tableAlternateRowColor: '#f5f7ff',
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#1e293b',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        opacity: 1
      }
    ]
  }
];

const iconsList = [
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Check', icon: Check },
  { name: 'Zap', icon: Zap },
  { name: 'Target', icon: Target },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'TrendingDown', icon: TrendingDown },
  { name: 'Globe', icon: Globe },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Mail', icon: Mail },
  { name: 'Phone', icon: Phone },
  { name: 'MapPin', icon: MapPin },
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  { name: 'Users', icon: Users },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Award', icon: Award },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Flag', icon: Flag },
  { name: 'Tag', icon: Tag },
  { name: 'Smile', icon: Smile },
  { name: 'Droplet', icon: Droplet },
  { name: 'Layers', icon: Layers },
  { name: 'Filter', icon: Filter },
  // Automotive & Technical Icons
  { name: 'Car', icon: Car },
  { name: 'Gauge', icon: Gauge },
  { name: 'Cog', icon: Cog },
  { name: 'Shield', icon: Shield },
  { name: 'Wind', icon: Wind },
  { name: 'Lightning', icon: Lightning },
  { name: 'Fuel', icon: Fuel },
  { name: 'Weight', icon: Weight },
  { name: 'Sofa', icon: Sofa },
  { name: 'Volume2', icon: Volume2 },
  { name: 'Navigation', icon: Navigation },
  { name: 'Radio', icon: Radio },
  { name: 'Wifi', icon: Wifi },
  { name: 'Usb', icon: Usb },
  { name: 'Battery', icon: Battery },
];

export function InfographicBuilder({ onChange, initialElements = [] }: InfographicBuilderProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [elements, setElements] = useState<InfographicElement[]>(initialElements);
  const [history, setHistory] = useState<InfographicElement[][]>([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showShapeLibrary, setShowShapeLibrary] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [canvasBackground, setCanvasBackground] = useState<string>('#ffffff');
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(1000);
  const [showCanvasSizeDialog, setShowCanvasSizeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'effects' | 'templates' | 'background' | 'styles' | 'layers' | 'history' | 'elements'>('properties');
  const [clipboard, setClipboard] = useState<InfographicElement[]>([]);
  const [alignmentGuides, setAlignmentGuides] = useState<{x?: number, y?: number}>({});
  const [showRulers, setShowRulers] = useState(true);
  const [showSmartGuides, setShowSmartGuides] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [activeElementForGuides, setActiveElementForGuides] = useState<InfographicElement | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Drawing Tool State
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [currentDrawingElement, setCurrentDrawingElement] = useState<string | null>(null);
  
  // Inline Text Editing State
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextContent, setEditingTextContent] = useState<string>('');
  
  // Table Editing State
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingCellPosition, setEditingCellPosition] = useState<{ row: number; col: number } | null>(null);
  const [editingCellContent, setEditingCellContent] = useState<string>('');
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  
  // Selection Box State
  const [isSelecting, setIsSelecting] = useState(false);
  const isSelectingRef = useRef(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  
  // Preview selection during drag - show which elements will be selected
  const [previewSelectedIds, setPreviewSelectedIds] = useState<string[]>([]);
  
  // Use ref to store the latest preview selection for use in handleMouseUp
  const previewSelectedIdsRef = useRef<string[]>([]);
  
  // Track if we just finished a selection (to prevent onClick from clearing it immediately)
  const justFinishedSelectionRef = useRef(false);
  
  // Store latest state values in refs for use in callbacks to avoid stale closures
  const elementsRef = useRef<InfographicElement[]>(elements);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef<string | null>(null);
  const selectedElementIdsRef = useRef<string[]>(selectedElementIds);
  const dragOffsetRef = useRef(dragOffset);
  const selectedElementRef = useRef<InfographicElement | null>(null);
  const resizeHandleRef = useRef('');
  
  // Store handler refs for global listeners
  const handleMouseMoveRef = useRef<(e: React.MouseEvent) => void>();
  const handleMouseUpRef = useRef<() => void>();
  
  // Keep refs in sync with state
  useEffect(() => {
    isSelectingRef.current = isSelecting;
    isDraggingRef.current = isDragging;
    isResizingRef.current = isResizing;
    selectedElementIdsRef.current = selectedElementIds;
    dragOffsetRef.current = dragOffset;
    resizeHandleRef.current = resizeHandle;
    
    // Find selected element for resize
    if (isResizing && elements.length > 0) {
      selectedElementRef.current = elements.find(el => el.id === isResizing) || null;
    } else {
      selectedElementRef.current = null;
    }
  }, [isSelecting, isDragging, isResizing, selectedElementIds, dragOffset, resizeHandle, elements]);
  
  // Floating Menu State
  const [floatingMenuPosition, setFloatingMenuPosition] = useState<{ x: number; y: number; isBelow?: boolean } | null>(null);
  
  // Default chart colors
  const defaultChartColors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#06b6d4', '#f43f5e', '#8b5cf6'
  ];

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(elements);
    }
    // Update elements ref whenever elements change
    elementsRef.current = elements;
  }, [elements, onChange]);

  // Add global mouse event listeners when selecting/dragging/resizing
  // This ensures we capture mouseup events even when mouse is outside the canvas
  useEffect(() => {
    // Update refs with latest handlers
    handleMouseMoveRef.current = handleMouseMove;
    handleMouseUpRef.current = handleMouseUp;
  });

  // Register global event listeners once on mount
  // Use refs to access latest handlers without re-registering listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Only handle if we're in an interactive state
      if (!isSelectingRef.current && !isDraggingRef.current && !isResizingRef.current) return;
      if (!canvasRef.current || !handleMouseMoveRef.current) return;
      
      // Create a synthetic React.MouseEvent to reuse existing handler
      const syntheticEvent = {
        clientX: e.clientX,
        clientY: e.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
        target: e.target,
      } as unknown as React.MouseEvent;
      
      handleMouseMoveRef.current(syntheticEvent);
    };

    const handleGlobalMouseUp = () => {
      // Only handle if we're in an interactive state
      if (!isSelectingRef.current && !isDraggingRef.current && !isResizingRef.current) return;
      
      if (handleMouseUpRef.current) {
        handleMouseUpRef.current();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []); // Empty deps - only register once on mount

  // Add to history
  const addToHistory = useCallback((newElements: InfographicElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setElements(newElements);
  }, [history, historyIndex]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Finish text editing on Escape or Enter
      if (e.key === 'Escape' && editingTextId) {
        e.preventDefault();
        finishTextEditing();
        return;
      }
      
      // Cancel drawing mode on Escape
      if (e.key === 'Escape' && drawingMode) {
        e.preventDefault();
        cancelDrawing();
        return;
      }
      
      // Finish drawing on Enter
      if (e.key === 'Enter' && drawingMode && drawingPoints.length >= 3) {
        e.preventDefault();
        finishDrawing();
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0 && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          deleteSelectedElements();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedElementIds.length > 0 && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          copyElements();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboard.length > 0 && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          pasteElements();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        if (selectedElementIds.length > 0 && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          duplicateSelectedElements();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setSelectedElementIds(elements.map(el => el.id));
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          ungroupElements();
        } else {
          groupElements();
        }
      }
      // Layer ordering shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === ']') {
        e.preventDefault();
        if (e.shiftKey) {
          bringToFront();
        } else {
          bringForward();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault();
        if (e.shiftKey) {
          sendToBack();
        } else {
          sendBackward();
        }
      }
      // Show keyboard shortcuts help
      if (e.key === '?' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, elements, clipboard, drawingMode, drawingPoints, editingTextId, editingTextContent, undo, redo]);

  const selectedElement = selectedElementIds.length === 1 
    ? elements.find(el => el.id === selectedElementIds[0]) 
    : null;

  // Update floating menu position when selection changes
  useEffect(() => {
    if (selectedElementIds.length > 0 && !isDragging && !isResizing && !editingTextId) {
      // Get all selected elements
      const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
      if (selectedElements.length === 0) {
        setFloatingMenuPosition(null);
        return;
      }

      // Calculate bounding box of all selected elements
      const minX = Math.min(...selectedElements.map(el => el.x));
      const minY = Math.min(...selectedElements.map(el => el.y));
      const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
      const maxY = Math.max(...selectedElements.map(el => el.y + el.height));

      // Position menu above the selection, centered
      const centerX = (minX + maxX) / 2;
      let menuX = centerX * (zoom / 100);
      
      // Constrain menu X position to stay within canvas (with padding)
      const menuWidth = 400; // Approximate menu width
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const minMenuX = menuWidth / 2 + 10;
        const maxMenuX = canvasRect.width - menuWidth / 2 - 10;
        menuX = Math.max(minMenuX, Math.min(maxMenuX, menuX));
      }
      
      // Smart positioning: if too close to top, show below; otherwise above
      const menuHeight = 60; // Approximate menu height in pixels
      const aboveY = (minY - 10) * (zoom / 100);
      const belowY = (maxY + 10) * (zoom / 100);
      const isBelow = aboveY < menuHeight;
      const menuY = isBelow ? belowY : aboveY;

      setFloatingMenuPosition({ x: menuX, y: menuY, isBelow });
    } else {
      setFloatingMenuPosition(null);
    }
  }, [selectedElementIds, elements, zoom, isDragging, isResizing, editingTextId]);

  // Snap to grid
  const snapValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Handle element selection from Element Library
  const handleSelectLibraryElement = (item: ElementLibraryItem) => {
    const newElement: InfographicElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type: item.data.type,
      x: snapValue(100 + elements.length * 20), // Offset each new element
      y: snapValue(100 + elements.length * 20),
      width: item.data.width || 120,
      height: item.data.height || 120,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      backgroundColor: item.data.backgroundColor || item.data.color || '#3b82f6',
      color: item.data.color || '#000000',
      opacity: 1,
      borderRadius: item.data.borderRadius || 0,
      borderWidth: item.data.borderWidth || 0,
      borderColor: item.data.borderColor || '#000000',
      borderStyle: 'solid',
      shapeType: item.data.shapeType as any,
      iconName: item.data.iconName,
      customPoints: item.data.customPoints,
      shadow: {
        enabled: false,
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.1)'
      },
      backgroundGradient: {
        enabled: false,
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#3b82f6', position: 0 },
          { color: '#8b5cf6', position: 100 }
        ]
      }
    };

    const newElements = [...elements, newElement];
    addToHistory(newElements);
    setSelectedElementIds([newElement.id]);
  };

  // Add new element with enhanced defaults
  const addElement = (type: InfographicElement['type'], shapeType?: string) => {
    const newElement: InfographicElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type,
      x: snapValue(100),
      y: snapValue(100),
      width: type === 'text' ? 200 : type === 'line' ? 150 : type === 'chart' ? 400 : type === 'table' ? 500 : type === 'connector' ? 200 : type === 'badge' ? 50 : type === 'progress-bar' ? 300 : 120,
      height: type === 'text' ? 50 : type === 'line' ? 2 : type === 'chart' ? 300 : type === 'table' ? 300 : type === 'connector' ? 100 : type === 'badge' ? 50 : type === 'progress-bar' ? 40 : 120,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      content: type === 'text' ? 'Nhập văn bản...' : undefined,
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'Inter',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      color: '#000000',
      backgroundColor: type === 'shape' ? '#3b82f6' : 'transparent',
      opacity: 1,
      borderRadius: type === 'shape' ? 8 : 0,
      borderStyle: 'solid',
      shapeType: type === 'shape' ? (shapeType as any || 'rectangle') : undefined,
      chartType: type === 'chart' ? 'bar' : undefined,
      chartData: type === 'chart' ? [
        { name: 'Jan', value: 65 },
        { name: 'Feb', value: 75 },
        { name: 'Mar', value: 85 },
        { name: 'Apr', value: 70 },
        { name: 'May', value: 90 },
      ] : undefined,
      chartColors: type === 'chart' ? defaultChartColors : undefined,
      lineType: type === 'line' ? 'straight' : undefined,
      lineWidth: type === 'line' ? 2 : undefined,
      customPoints: type === 'custom-shape' ? [] : undefined,
      tableData: type === 'table' ? [
        [
          { content: 'Tiêu đề 1', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'center' },
          { content: 'Tiêu đề 2', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'center' },
          { content: 'Tiêu đề 3', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'center' }
        ],
        [
          { content: 'Hàng 1, Cột 1', textAlign: 'left' },
          { content: 'Hàng 1, Cột 2', textAlign: 'center' },
          { content: 'Hàng 1, Cột 3', textAlign: 'center' }
        ],
        [
          { content: 'Hàng 2, Cột 1', textAlign: 'left' },
          { content: 'Hàng 2, Cột 2', textAlign: 'center' },
          { content: 'Hàng 2, Cột 3', textAlign: 'center' }
        ]
      ] : undefined,
      tableColumns: type === 'table' ? 3 : undefined,
      tableRows: type === 'table' ? 3 : undefined,
      tableHeaderRow: type === 'table' ? true : undefined,
      tableCellPadding: type === 'table' ? 8 : undefined,
      tableShowBorders: type === 'table' ? true : undefined,
      tableBorderColor: type === 'table' ? '#e5e7eb' : undefined,
      tableBorderWidth: type === 'table' ? 1 : undefined,
      tableAlternateRowColors: type === 'table' ? true : undefined,
      tableAlternateRowColor: type === 'table' ? '#f9fafb' : undefined,
      // Connector properties
      connectorType: type === 'connector' ? 'elbow' : undefined,
      connectorStartX: type === 'connector' ? 0 : undefined,
      connectorStartY: type === 'connector' ? 0 : undefined,
      connectorEndX: type === 'connector' ? 150 : undefined,
      connectorEndY: type === 'connector' ? 100 : undefined,
      connectorArrowStart: type === 'connector' ? false : undefined,
      connectorArrowEnd: type === 'connector' ? true : undefined,
      // Badge properties
      badgeNumber: type === 'badge' ? 1 : undefined,
      badgeText: type === 'badge' ? '1' : undefined,
      badgeShape: type === 'badge' ? 'circle' : undefined,
      badgeStyle: type === 'badge' ? 'filled' : undefined,
      // Progress bar properties
      progressValue: type === 'progress-bar' ? 75 : undefined,
      progressMax: type === 'progress-bar' ? 100 : undefined,
      progressLabel: type === 'progress-bar' ? 'Progress' : undefined,
      progressShowValue: type === 'progress-bar' ? true : undefined,
      progressBarColor: type === 'progress-bar' ? '#22c55e' : undefined,
      progressTrackColor: type === 'progress-bar' ? '#e5e7eb' : undefined,
      shadow: {
        enabled: false,
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.1)'
      },
      backgroundGradient: {
        enabled: false,
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#3b82f6', position: 0 },
          { color: '#8b5cf6', position: 100 }
        ]
      }
    };

    const newElements = [...elements, newElement];
    addToHistory(newElements);
    setSelectedElementIds([newElement.id]);
  };

  // Table Manipulation Functions
  const addTableRow = (tableId: string, position: 'top' | 'bottom') => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData) return;

    const newRow = Array(element.tableColumns || 3).fill(null).map(() => ({ 
      content: '', 
      textAlign: 'center' as const 
    }));
    
    const newTableData = [...element.tableData];
    if (position === 'top') {
      newTableData.unshift(newRow);
    } else {
      newTableData.push(newRow);
    }

    updateElement(tableId, { 
      tableData: newTableData,
      tableRows: (element.tableRows || 0) + 1
    });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData, tableRows: (el.tableRows || 0) + 1 } : el
    ));
  };

  const addTableColumn = (tableId: string, position: 'left' | 'right') => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData) return;

    const newTableData = element.tableData.map(row => {
      const newRow = [...row];
      const newCell = { content: '', textAlign: 'center' as const };
      if (position === 'left') {
        newRow.unshift(newCell);
      } else {
        newRow.push(newCell);
      }
      return newRow;
    });

    updateElement(tableId, { 
      tableData: newTableData,
      tableColumns: (element.tableColumns || 0) + 1
    });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData, tableColumns: (el.tableColumns || 0) + 1 } : el
    ));
  };

  const removeTableRow = (tableId: string, rowIndex: number) => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData || element.tableData.length <= 1) return;

    const newTableData = element.tableData.filter((_, idx) => idx !== rowIndex);

    updateElement(tableId, { 
      tableData: newTableData,
      tableRows: (element.tableRows || 0) - 1
    });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData, tableRows: (el.tableRows || 0) - 1 } : el
    ));
  };

  const removeTableColumn = (tableId: string, colIndex: number) => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData || (element.tableData[0]?.length || 0) <= 1) return;

    const newTableData = element.tableData.map(row => row.filter((_, idx) => idx !== colIndex));

    updateElement(tableId, { 
      tableData: newTableData,
      tableColumns: (element.tableColumns || 0) - 1
    });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData, tableColumns: (el.tableColumns || 0) - 1 } : el
    ));
  };

  const mergeCells = (tableId: string, cells: { row: number; col: number }[]) => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData || cells.length < 2) return;

    // Find bounds
    const rows = cells.map(c => c.row);
    const cols = cells.map(c => c.col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    const rowspan = maxRow - minRow + 1;
    const colspan = maxCol - minCol + 1;

    const newTableData = element.tableData.map((row, rIdx) => 
      row.map((cell, cIdx) => {
        if (rIdx === minRow && cIdx === minCol) {
          // Main cell - set colspan/rowspan
          return { ...cell, colspan, rowspan };
        } else if (rIdx >= minRow && rIdx <= maxRow && cIdx >= minCol && cIdx <= maxCol) {
          // Mark as merged
          return { ...cell, merged: true };
        }
        return cell;
      })
    );

    updateElement(tableId, { tableData: newTableData });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData } : el
    ));
  };

  const updateTableCell = (tableId: string, row: number, col: number, updates: Partial<TableCell>) => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData) return;

    const newTableData = element.tableData.map((r, rIdx) =>
      r.map((cell, cIdx) => 
        rIdx === row && cIdx === col ? { ...cell, ...updates } : cell
      )
    );

    updateElement(tableId, { tableData: newTableData });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData } : el
    ));
  };

  const unmergeCells = (tableId: string, row: number, col: number) => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData) return;

    const cell = element.tableData[row]?.[col];
    if (!cell || (!cell.colspan && !cell.rowspan)) return;

    const rowspan = cell.rowspan || 1;
    const colspan = cell.colspan || 1;

    const newTableData = element.tableData.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === row && cIdx === col) {
          // Remove colspan/rowspan from main cell
          const { colspan, rowspan, ...rest } = c;
          return rest;
        } else if (
          rIdx >= row && rIdx < row + rowspan &&
          cIdx >= col && cIdx < col + colspan
        ) {
          // Unmark merged cells
          const { merged, ...rest } = c;
          return rest;
        }
        return c;
      })
    );

    updateElement(tableId, { tableData: newTableData });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData } : el
    ));
  };

  const formatSelectedCells = (tableId: string, cells: { row: number; col: number }[], updates: Partial<TableCell>) => {
    const element = elements.find(el => el.id === tableId);
    if (!element || element.type !== 'table' || !element.tableData) return;

    const newTableData = element.tableData.map((r, rIdx) =>
      r.map((cell, cIdx) => {
        const isSelected = cells.some(sc => sc.row === rIdx && sc.col === cIdx);
        return isSelected ? { ...cell, ...updates } : cell;
      })
    );

    updateElement(tableId, { tableData: newTableData });
    addToHistory(elements.map(el => 
      el.id === tableId ? { ...el, tableData: newTableData } : el
    ));
  };

  const importTableFromClipboard = async (tableId: string) => {
    try {
      const text = await navigator.clipboard.readText();
      
      // Parse CSV/TSV format
      const rows = text.trim().split('\n');
      const tableData = rows.map(row => {
        // Support both tab and comma separators
        const cells = row.includes('\t') 
          ? row.split('\t') 
          : row.split(',');
        
        return cells.map(content => ({
          content: content.trim(),
          textAlign: 'left' as const
        }));
      });

      if (tableData.length === 0) {
        alert('Không thể phân tích dữ liệu bộ nhớ tạm');
        return;
      }

      const element = elements.find(el => el.id === tableId);
      if (!element || element.type !== 'table') return;

      updateElement(tableId, {
        tableData,
        tableRows: tableData.length,
        tableColumns: tableData[0]?.length || 0
      });
      addToHistory(elements.map(el =>
        el.id === tableId 
          ? { 
              ...el, 
              tableData, 
              tableRows: tableData.length,
              tableColumns: tableData[0]?.length || 0
            } 
          : el
      ));

      alert(`Đã nhập ${tableData.length} hàng × ${tableData[0]?.length || 0} cột`);
    } catch (error) {
      alert('Không thể đọc clipboard. Vui lòng copy data từ Excel/Google Sheets trước.');
    }
  };

  // Drawing Tool Functions
  const startDrawing = () => {
    setDrawingMode(true);
    setDrawingPoints([]);
    setSelectedElementIds([]);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!drawingMode || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);
    
    const newPoints = [...drawingPoints, { x: snapValue(x), y: snapValue(y) }];
    setDrawingPoints(newPoints);
  };

  const finishDrawing = () => {
    if (drawingPoints.length < 3) {
      setDrawingMode(false);
      setDrawingPoints([]);
      return;
    }

    // Calculate bounding box
    const minX = Math.min(...drawingPoints.map(p => p.x));
    const minY = Math.min(...drawingPoints.map(p => p.y));
    const maxX = Math.max(...drawingPoints.map(p => p.x));
    const maxY = Math.max(...drawingPoints.map(p => p.y));

    // Convert to relative coordinates
    const relativePoints = drawingPoints.map(p => ({
      x: p.x - minX,
      y: p.y - minY
    }));

    const newElement: InfographicElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type: 'custom-shape',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      customPoints: relativePoints,
      backgroundColor: '#3b82f6',
      color: '#3b82f6',
      opacity: 1,
      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'solid',
      fillRule: 'nonzero',
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
      shadow: {
        enabled: false,
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.1)'
      },
      backgroundGradient: {
        enabled: false,
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#3b82f6', position: 0 },
          { color: '#8b5cf6', position: 100 }
        ]
      }
    };

    const newElements = [...elements, newElement];
    addToHistory(newElements);
    setSelectedElementIds([newElement.id]);
    setDrawingMode(false);
    setDrawingPoints([]);
  };

  const cancelDrawing = () => {
    setDrawingMode(false);
    setDrawingPoints([]);
  };

  // Copy/Paste functions
  const copyElements = () => {
    const elementsToCopy = elements.filter(el => selectedElementIds.includes(el.id));
    setClipboard(elementsToCopy);
  };

  const pasteElements = () => {
    if (clipboard.length === 0) return;
    
    const newElements = clipboard.map(el => ({
      ...el,
      id: `el-${Date.now()}-${Math.random()}-${el.id}`,
      x: snapValue(el.x + 20),
      y: snapValue(el.y + 20),
      zIndex: elements.length + clipboard.indexOf(el),
    }));

    const allElements = [...elements, ...newElements];
    addToHistory(allElements);
    setSelectedElementIds(newElements.map(el => el.id));
  };

  // Add icon
  const addIcon = (iconName: string) => {
    const newElement: InfographicElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type: 'icon',
      x: snapValue(100),
      y: snapValue(100),
      width: 64,
      height: 64,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      iconName,
      iconColor: '#3b82f6',
      opacity: 1,
    };

    const newElements = [...elements, newElement];
    addToHistory(newElements);
    setSelectedElementIds([newElement.id]);
    setShowIconPicker(false);
  };

  // Update element
  const updateElement = (id: string, updates: Partial<InfographicElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
  };

  // Update selected elements
  const updateSelectedElements = (updates: Partial<InfographicElement>) => {
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, ...updates } : el
    );
    addToHistory(newElements);
  };

  // Delete elements
  const deleteSelectedElements = () => {
    const newElements = elements.filter(el => !selectedElementIds.includes(el.id));
    addToHistory(newElements);
    setSelectedElementIds([]);
  };

  // Duplicate elements
  const duplicateSelectedElements = () => {
    const elementsToDuplicate = elements.filter(el => selectedElementIds.includes(el.id));
    const newElements = elementsToDuplicate.map(el => ({
      ...el,
      id: `el-${Date.now()}-${Math.random()}-${el.id}`,
      x: snapValue(el.x + 20),
      y: snapValue(el.y + 20),
      zIndex: elements.length + elementsToDuplicate.indexOf(el),
    }));

    const allElements = [...elements, ...newElements];
    addToHistory(allElements);
    setSelectedElementIds(newElements.map(el => el.id));
  };

  // Group/Ungroup elements
  const groupElements = () => {
    if (selectedElementIds.length < 2) return;
    
    const groupId = `group-${Date.now()}`;
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, groupId } : el
    );
    addToHistory(newElements);
  };

  const ungroupElements = () => {
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, groupId: undefined } : el
    );
    addToHistory(newElements);
  };

  // Reorder elements (for drag-to-reorder in layers panel)
  const reorderElements = (draggedId: string, targetId: string, position: 'before' | 'after') => {
    const draggedElement = elements.find(el => el.id === draggedId);
    const targetElement = elements.find(el => el.id === targetId);
    
    if (!draggedElement || !targetElement) return;
    
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const targetIndex = sorted.findIndex(el => el.id === targetId);
    const newIndex = position === 'before' ? targetIndex : targetIndex + 1;
    
    // Remove dragged element and insert at new position
    const filtered = sorted.filter(el => el.id !== draggedId);
    filtered.splice(newIndex, 0, draggedElement);
    
    // Reassign zIndex
    const newElements = filtered.map((el, idx) => ({ ...el, zIndex: idx }));
    addToHistory(newElements);
  };

  // Delete specific elements by ids
  const deleteElements = (ids: string[]) => {
    const newElements = elements.filter(el => !ids.includes(el.id));
    addToHistory(newElements);
    setSelectedElementIds(selectedElementIds.filter(id => !ids.includes(id)));
  };

  // Duplicate specific elements by ids
  const duplicateElements = (ids: string[]) => {
    const elementsToDuplicate = elements.filter(el => ids.includes(el.id));
    const newElements = elementsToDuplicate.map(el => ({
      ...el,
      id: `el-${Date.now()}-${Math.random()}-${el.id}`,
      x: snapValue(el.x + 20),
      y: snapValue(el.y + 20),
      zIndex: elements.length + elementsToDuplicate.indexOf(el),
    }));

    const allElements = [...elements, ...newElements];
    addToHistory(allElements);
    setSelectedElementIds(newElements.map(el => el.id));
  };

  // Alignment functions
  const alignElements = (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElementIds.length < 2) return;

    const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
    
    switch (direction) {
      case 'left':
        const minLeft = Math.min(...selectedElements.map(el => el.x));
        updateSelectedElements({ x: minLeft });
        break;
      case 'center':
        const centerX = selectedElements.reduce((sum, el) => sum + el.x + el.width / 2, 0) / selectedElements.length;
        selectedElements.forEach(el => {
          updateElement(el.id, { x: snapValue(centerX - el.width / 2) });
        });
        break;
      case 'right':
        const maxRight = Math.max(...selectedElements.map(el => el.x + el.width));
        selectedElements.forEach(el => {
          updateElement(el.id, { x: snapValue(maxRight - el.width) });
        });
        break;
      case 'top':
        const minTop = Math.min(...selectedElements.map(el => el.y));
        updateSelectedElements({ y: minTop });
        break;
      case 'middle':
        const centerY = selectedElements.reduce((sum, el) => sum + el.y + el.height / 2, 0) / selectedElements.length;
        selectedElements.forEach(el => {
          updateElement(el.id, { y: snapValue(centerY - el.height / 2) });
        });
        break;
      case 'bottom':
        const maxBottom = Math.max(...selectedElements.map(el => el.y + el.height));
        selectedElements.forEach(el => {
          updateElement(el.id, { y: snapValue(maxBottom - el.height) });
        });
        break;
    }
  };

  // Distribution functions
  const distributeElements = (direction: 'horizontal' | 'vertical') => {
    if (selectedElementIds.length < 3) return;

    const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
    
    if (direction === 'horizontal') {
      // Sort by x position
      const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
      const minX = sorted[0].x;
      const maxX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
      const totalGap = maxX - minX - sorted.reduce((sum, el) => sum + el.width, 0);
      const gap = totalGap / (sorted.length - 1);
      
      let currentX = minX;
      sorted.forEach((el, idx) => {
        if (idx > 0) {
          updateElement(el.id, { x: snapValue(currentX) });
        }
        currentX += el.width + gap;
      });
    } else {
      // Sort by y position
      const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
      const minY = sorted[0].y;
      const maxY = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
      const totalGap = maxY - minY - sorted.reduce((sum, el) => sum + el.height, 0);
      const gap = totalGap / (sorted.length - 1);
      
      let currentY = minY;
      sorted.forEach((el, idx) => {
        if (idx > 0) {
          updateElement(el.id, { y: snapValue(currentY) });
        }
        currentY += el.height + gap;
      });
    }
    
    addToHistory(elements);
  };

  // Layer management
  const bringToFront = () => {
    if (selectedElementIds.length === 0) return;
    const maxZ = Math.max(...elements.map(el => el.zIndex));
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, zIndex: maxZ + 1 } : el
    );
    addToHistory(newElements);
  };

  const sendToBack = () => {
    if (selectedElementIds.length === 0) return;
    const minZ = Math.min(...elements.map(el => el.zIndex));
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, zIndex: minZ - 1 } : el
    );
    addToHistory(newElements);
  };

  const bringForward = () => {
    if (selectedElementIds.length === 0) return;
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, zIndex: el.zIndex + 1 } : el
    );
    addToHistory(newElements);
  };

  const sendBackward = () => {
    if (selectedElementIds.length === 0) return;
    const newElements = elements.map(el =>
      selectedElementIds.includes(el.id) ? { ...el, zIndex: el.zIndex - 1 } : el
    );
    addToHistory(newElements);
  };

  // Transform functions
  const flipHorizontal = () => {
    updateSelectedElements({ flipHorizontal: !selectedElement?.flipHorizontal });
  };

  const flipVertical = () => {
    updateSelectedElements({ flipVertical: !selectedElement?.flipVertical });
  };

  // Alignment wrapper functions for floating menu
  const alignLeft = () => alignElements('left');
  const alignCenter = () => alignElements('center');
  const alignRight = () => alignElements('right');
  const alignTop = () => alignElements('top');
  const alignMiddle = () => alignElements('middle');
  const alignBottom = () => alignElements('bottom');

  // Handle double-click for inline text editing
  const handleElementDoubleClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked || element.type !== 'text') return;
    
    setEditingTextId(elementId);
    setEditingTextContent(element.content || '');
  };
  
  // Finish inline text editing
  const finishTextEditing = () => {
    if (editingTextId) {
      updateElement(editingTextId, { content: editingTextContent });
      addToHistory(elements.map(el => 
        el.id === editingTextId ? { ...el, content: editingTextContent } : el
      ));
      setEditingTextId(null);
      setEditingTextContent('');
    }
  };

  // Handle element dragging
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    // Don't start dragging if editing text
    if (editingTextId) return;
    
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;

    // Clear preview selection when directly clicking on element
    setPreviewSelectedIds([]);
    previewSelectedIdsRef.current = [];

    // Shift+Click or Ctrl/Cmd+Click to toggle selection
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (selectedElementIds.includes(elementId)) {
        setSelectedElementIds(selectedElementIds.filter(id => id !== elementId));
      } else {
        setSelectedElementIds([...selectedElementIds, elementId]);
      }
      return;
    }

    if (!selectedElementIds.includes(elementId)) {
      setSelectedElementIds([elementId]);
    }
    
    setIsDragging(true);
    isDraggingRef.current = true;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = (e.clientX - rect.left) / (zoom / 100) - element.x;
    const offsetY = (e.clientY - rect.top) / (zoom / 100) - element.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent, elementId: string, handle: string) => {
    e.stopPropagation();
    setIsResizing(elementId);
    isResizingRef.current = elementId;
    setResizeHandle(handle);
  };

  // Handle canvas mouse down for selection box
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Don't start selection if clicking on an element or in drawing mode
    if (drawingMode || editingTextId) return;
    
    const target = e.target as HTMLElement;
    
    if (target !== canvasRef.current && !target.closest('[data-canvas-background]')) {
      return;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);
    
    setIsSelecting(true);
    isSelectingRef.current = true;
    setSelectionBox({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
    setSelectedElementIds([]);
    setPreviewSelectedIds([]);
    previewSelectedIdsRef.current = [];
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    // Handle selection box - use ref to avoid stale closure
    if (isSelectingRef.current) {
      setSelectionBox(prevBox => {
        if (!prevBox) return null;
        
        const x = (e.clientX - rect.left) / (zoom / 100);
        const y = (e.clientY - rect.top) / (zoom / 100);
        
        const updatedBox = {
          ...prevBox,
          endX: x,
          endY: y,
        };
        
        // Calculate real-time preview of selected elements
        const minX = Math.min(prevBox.startX, x);
        const maxX = Math.max(prevBox.startX, x);
        const minY = Math.min(prevBox.startY, y);
        const maxY = Math.max(prevBox.startY, y);
        
        // Use elementsRef to get current elements without triggering unnecessary updates
        const currentElements = elementsRef.current;
        
        const previewIds = currentElements
          .filter(el => {
            if (el.locked) return false;
            
            // Check if element overlaps with selection box (any part of the element)
            const elementLeft = el.x;
            const elementRight = el.x + el.width;
            const elementTop = el.y;
            const elementBottom = el.y + el.height;
            
            // Check for overlap using AABB (Axis-Aligned Bounding Box) collision detection
            const overlapsX = elementLeft < maxX && elementRight > minX;
            const overlapsY = elementTop < maxY && elementBottom > minY;
            
            return overlapsX && overlapsY;
          })
          .map(el => el.id);
        
        // Store in both state (for rendering) and ref (for mouseUp handler)
        setPreviewSelectedIds(previewIds);
        previewSelectedIdsRef.current = previewIds;
        
        return updatedBox;
      });
      return;
    }

    if (isResizingRef.current && selectedElementRef.current) {
      const mouseX = (e.clientX - rect.left) / (zoom / 100);
      const mouseY = (e.clientY - rect.top) / (zoom / 100);
      const selectedElement = selectedElementRef.current;
      const currentResizeHandle = resizeHandleRef.current;

      let newX = selectedElement.x;
      let newY = selectedElement.y;
      let newWidth = selectedElement.width;
      let newHeight = selectedElement.height;

      if (currentResizeHandle.includes('e')) {
        newWidth = Math.max(20, mouseX - selectedElement.x);
      }
      if (currentResizeHandle.includes('w')) {
        const delta = mouseX - selectedElement.x;
        newX = mouseX;
        newWidth = Math.max(20, selectedElement.width - delta);
      }
      if (currentResizeHandle.includes('s')) {
        newHeight = Math.max(20, mouseY - selectedElement.y);
      }
      if (currentResizeHandle.includes('n')) {
        const delta = mouseY - selectedElement.y;
        newY = mouseY;
        newHeight = Math.max(20, selectedElement.height - delta);
      }

      // Ensure minimum size after snapping
      const snappedWidth = Math.max(10, snapValue(newWidth));
      const snappedHeight = Math.max(10, snapValue(newHeight));

      updateElement(selectedElement.id, {
        x: snapValue(newX),
        y: snapValue(newY),
        width: snappedWidth,
        height: snappedHeight
      });
    } else if (isDraggingRef.current && selectedElementIdsRef.current.length > 0) {
      const currentDragOffset = dragOffsetRef.current;
      const currentSelectedIds = selectedElementIdsRef.current;
      const rawX = (e.clientX - rect.left) / (zoom / 100) - currentDragOffset.x;
      const rawY = (e.clientY - rect.top) / (zoom / 100) - currentDragOffset.y;
      
      const x = Math.max(0, snapValue(rawX));
      const y = Math.max(0, snapValue(rawY));

      const currentElements = elementsRef.current;
      const firstElement = currentElements.find(el => el.id === currentSelectedIds[0]);
      if (!firstElement) return;
      
      const deltaX = x - firstElement.x;
      const deltaY = y - firstElement.y;

      // Show alignment guides
      const guides: {x?: number, y?: number} = {};
      const threshold = 5;
      
      currentElements.forEach(el => {
        if (!currentSelectedIds.includes(el.id)) {
          if (Math.abs(el.x - x) < threshold) guides.x = el.x;
          if (Math.abs(el.x + el.width - (x + firstElement.width)) < threshold) guides.x = el.x + el.width - firstElement.width;
          if (Math.abs(el.y - y) < threshold) guides.y = el.y;
          if (Math.abs(el.y + el.height - (y + firstElement.height)) < threshold) guides.y = el.y + el.height - firstElement.height;
        }
      });
      
      setAlignmentGuides(guides);

      const newElements = currentElements.map(el => {
        if (currentSelectedIds.includes(el.id) && !el.locked) {
          return {
            ...el,
            x: snapValue(Math.max(0, el.x + deltaX)),
            y: snapValue(Math.max(0, el.y + deltaY)),
          };
        }
        return el;
      });
      
      setElements(newElements);
    }
  }, [zoom, snapToGrid, gridSize, snapValue, updateElement, setAlignmentGuides]);

  const handleMouseUp = useCallback(() => {
    // Handle selection box finish - use refs to avoid stale closure
    if (isSelectingRef.current) {
      const finalSelectedIds = previewSelectedIdsRef.current;
      
      // Always update selectedElementIds, even if empty (to clear previous selection)
      setSelectedElementIds(finalSelectedIds);
      
      setPreviewSelectedIds([]);
      previewSelectedIdsRef.current = [];
      setSelectionBox(null);
      setIsSelecting(false);
      isSelectingRef.current = false;
      
      // Set flag to prevent onClick from immediately clearing the selection
      justFinishedSelectionRef.current = true;
      // Reset flag after a short delay (longer than click event timing)
      setTimeout(() => {
        justFinishedSelectionRef.current = false;
      }, 100);
    }
    
    // Handle drag/resize history
    if (isDraggingRef.current || isResizingRef.current) {
      setElements(currentElements => {
        addToHistory(currentElements);
        return currentElements;
      });
    }
    
    setIsDragging(false);
    isDraggingRef.current = false;
    setIsResizing(null);
    isResizingRef.current = null;
    setAlignmentGuides({});
  }, [addToHistory]);

  // Load template
  const loadTemplate = (template: Template) => {
    addToHistory(template.elements);
    setShowTemplates(false);
    setSelectedElementIds([]);
  };

  // Handle AI generation (mock for now)
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      // Mock AI generation - could integrate with real AI later
      const generatedElements: InfographicElement[] = [
        {
          id: `el-${Date.now()}-1`,
          type: 'text',
          x: 50,
          y: 30,
          width: 700,
          height: 60,
          rotation: 0,
          locked: false,
          visible: true,
          zIndex: 0,
          content: aiPrompt.substring(0, 50) || 'AI Generated Title',
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#1e293b',
          backgroundColor: 'transparent',
          opacity: 1,
          backgroundGradient: {
            enabled: true,
            type: 'linear',
            angle: 135,
            stops: [
              { color: '#667eea', position: 0 },
              { color: '#764ba2', position: 100 }
            ]
          }
        },
      ];

      addToHistory(generatedElements);
      setIsGenerating(false);
      setShowAiPanel(false);
      setAiPrompt('');
    }, 2000);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newElement: InfographicElement = {
        id: `el-${Date.now()}-${Math.random()}`,
        type: 'image',
        x: snapValue(100),
        y: snapValue(100),
        width: 200,
        height: 200,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: elements.length,
        imageUrl,
        opacity: 1,
        borderRadius: 8,
        shadow: {
          enabled: true,
          x: 0,
          y: 4,
          blur: 12,
          spread: 0,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      };

      const newElements = [...elements, newElement];
      addToHistory(newElements);
      setSelectedElementIds([newElement.id]);
    };
    reader.readAsDataURL(file);
  };

  // Export functions
  const exportToPNG = async () => {
    if (!canvasRef.current) return;
    
    try {
      // Dynamic import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: canvasBackground,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `infographic-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Không thể xuất PNG. Vui lòng thử lại.');
    }
  };

  const exportToSVG = () => {
    alert('Xuất SVG - Chức năng đang phát triển');
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify({ elements, background: canvasBackground }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infographic-${Date.now()}.json`;
    link.click();
  };

  // Import JSON
  const importFromJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.elements) {
            addToHistory(data.elements);
            if (data.background) {
              setCanvasBackground(data.background);
            }
          }
        } catch (error) {
          alert('File JSON không hợp lệ');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Render icon
  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = iconsList.find(i => i.name === iconName)?.icon;
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  // Get clip path for shapes
  const getShapeClipPath = (shapeType: string) => {
    const paths: Record<string, string> = {
      triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      arrow: 'polygon(0% 30%, 70% 30%, 70% 0%, 100% 50%, 70% 100%, 70% 70%, 0% 70%)',
    };
    return paths[shapeType] || 'none';
  };

  // Get gradient CSS
  const getGradientCSS = (gradient?: InfographicElement['backgroundGradient']) => {
    if (!gradient?.enabled || !gradient.stops || gradient.stops.length < 2) return undefined;
    
    const stops = gradient.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    if (gradient.type === 'radial') {
      return `radial-gradient(circle, ${stops})`;
    } else if (gradient.type === 'conic') {
      return `conic-gradient(from ${gradient.angle}deg, ${stops})`;
    } else {
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
    }
  };

  // Get box shadow CSS
  const getBoxShadowCSS = (shadow?: InfographicElement['shadow']) => {
    if (!shadow?.enabled) return undefined;
    return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
  };

  // Get text shadow CSS
  const getTextShadowCSS = (shadow?: InfographicElement['textShadow']) => {
    if (!shadow?.enabled) return undefined;
    return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}`;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Compact Top Toolbar - Canva Style */}
      <div className="border-b border-border/60 bg-card/50 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          {/* Left Section - Main Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
                title="Làm lại (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-border/60" />

            {/* View Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm text-muted-foreground min-w-[50px] text-center font-medium">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-border/60" />

            {/* Canvas Tools */}
            <button
              onClick={() => setShowGridLines(!showGridLines)}
              className={`p-2 rounded-lg transition-colors ${
                showGridLines ? 'bg-blue-100 text-blue-600' : 'hover:bg-muted'
              }`}
              title="Bật/tắt lưới"
            >
              <Grid className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowRulers(!showRulers)}
              className={`p-2 rounded-lg transition-colors ${
                showRulers ? 'bg-blue-100 text-blue-600' : 'hover:bg-muted'
              }`}
              title="Bật/tắt thước"
            >
              <Ruler className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSmartGuides(!showSmartGuides)}
              className={`p-2 rounded-lg transition-colors ${
                showSmartGuides ? 'bg-blue-100 text-blue-600' : 'hover:bg-muted'
              }`}
              title="Đường dẫn thông minh"
            >
              <Target className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowCanvasSizeDialog(!showCanvasSizeDialog)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Kích thước canvas"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Phím tắt (Nhấn ?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            
            {/* Drawing Mode & Text Editing Instructions */}
            {drawingMode && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-xs text-blue-900 ml-2">
                <Pencil className="w-3.5 h-3.5" />
                <span>Nhấp để thêm điểm (tối thiểu 3)</span>
                <button
                  onClick={finishDrawing}
                  disabled={drawingPoints.length < 3}
                  className="ml-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finish ({drawingPoints.length})
                </button>
                <button
                  onClick={cancelDrawing}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {editingTextId && (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg text-xs text-green-900 ml-2">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Đang sửa văn bản. Nhấn Esc để hoàn tất.</span>
              </div>
            )}
            
            {/* Selection Count */}
            {selectedElementIds.length > 0 && (
              <div className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg text-xs font-medium ml-2">
                {selectedElementIds.length} selected
              </div>
            )}
          </div>

          {/* Right Section - Export & AI */}
          <div className="flex items-center gap-2">
            {/* Templates */}
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Layout className="w-4 h-4" />
              <span className="hidden lg:inline">Mẫu</span>
            </button>

            {/* AI Assistant */}
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm ${
                showAiPanel
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden lg:inline">AI</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button 
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Xuất</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/60 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={exportToPNG}
                  className="w-full px-4 py-2.5 text-left hover:bg-muted/50 rounded-t-xl transition-colors text-sm flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  Export as PNG
                </button>
                <button
                  onClick={exportToSVG}
                  className="w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors text-sm flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  Export as SVG
                </button>
                <button
                  onClick={exportToJSON}
                  className="w-full px-4 py-2.5 text-left hover:bg-muted/50 rounded-b-xl transition-colors text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout (Canva Style) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Elements (Canva Style) */}
        <div className="w-20 border-r border-border/60 bg-card/30 backdrop-blur-sm flex flex-col">
          {/* Tools */}
          <div className="flex-1 overflow-y-auto py-2">
            {/* Text Tool */}
            <button
              onClick={() => addElement('text')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Văn bản"
            >
              <Type className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Văn bản</span>
            </button>

            {/* Shapes */}
            <button
              onClick={() => setShowShapeLibrary(true)}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Hình dạng"
            >
              <Square className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Hình</span>
            </button>

            {/* Elements/Stickers */}
            <button
              onClick={() => setActiveTab('elements')}
              className={`w-full flex flex-col items-center gap-1.5 py-3 px-2 transition-colors group ${
                activeTab === 'elements' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-muted/50'
              }`}
              title="Phần tử"
            >
              <Star className={`w-5 h-5 transition-colors ${
                activeTab === 'elements' ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className={`text-[10px] transition-colors ${
                activeTab === 'elements' ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
              }`}>Phần tử</span>
            </button>

            {/* Icons */}
            <button
              onClick={() => setShowIconPicker(true)}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Biểu tượng"
            >
              <Smile className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Biểu tượng</span>
            </button>

            {/* Charts */}
            <button
              onClick={() => addElement('chart')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Biểu đồ"
            >
              <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Biểu đồ</span>
            </button>

            {/* Table */}
            <button
              onClick={() => addElement('table')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Bảng"
            >
              <Table className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Bảng</span>
            </button>

            {/* Connector */}
            <button
              onClick={() => addElement('connector')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Đường nối"
            >
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Kết nối</span>
            </button>

            {/* Badge */}
            <button
              onClick={() => addElement('badge')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Huy hiệu số"
            >
              <Award className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Huy hiệu</span>
            </button>

            {/* Progress Bar */}
            <button
              onClick={() => addElement('progress-bar')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Thanh tiến trình"
            >
              <Gauge className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Tiến trình</span>
            </button>

            {/* Upload Image */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Tải lên"
            >
              <Upload className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Tải lên</span>
            </button>

            {/* Line */}
            <button
              onClick={() => addElement('line')}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Đường kẻ"
            >
              <Minus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Đường</span>
            </button>

            {/* Draw */}
            <button
              onClick={startDrawing}
              className={`w-full flex flex-col items-center gap-1.5 py-3 px-2 transition-colors group ${
                drawingMode ? 'bg-blue-50 text-blue-600' : 'hover:bg-muted/50'
              }`}
              title="Vẽ"
            >
              <Pencil className={`w-5 h-5 transition-colors ${
                drawingMode ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className={`text-[10px] transition-colors ${
                drawingMode ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
              }`}>Vẽ</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-border/60 py-2">
            {/* Import */}
            <button
              onClick={importFromJSON}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-muted/50 transition-colors group"
              title="Nhập"
            >
              <FolderOpen className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Nhập</span>
            </button>

            {/* History */}
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className={`w-full flex flex-col items-center gap-1.5 py-3 px-2 transition-colors group relative ${
                showHistoryPanel ? 'bg-blue-50 text-blue-600' : 'hover:bg-muted/50'
              }`}
              title="Lịch sử"
            >
              <Clock className={`w-5 h-5 transition-colors ${
                showHistoryPanel ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className={`text-[10px] transition-colors ${
                showHistoryPanel ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
              }`}>Lịch sử</span>
              {history.length > 1 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        {/* Canvas Area */}
        <div className="flex-1 bg-muted/20 overflow-auto p-8 relative">
          {/* Alignment Guides */}
          {alignmentGuides.x !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-px bg-blue-500 z-10 pointer-events-none"
              style={{ left: `${alignmentGuides.x * (zoom / 100) + 32}px` }}
            />
          )}
          {alignmentGuides.y !== undefined && (
            <div
              className="absolute left-0 right-0 h-px bg-blue-500 z-10 pointer-events-none"
              style={{ top: `${alignmentGuides.y * (zoom / 100) + 32}px` }}
            />
          )}

          <div 
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => {
              if (drawingMode) {
                handleCanvasClick(e);
              } else if ((e.target === canvasRef.current || e.target === e.currentTarget) && !justFinishedSelectionRef.current) {
                // Only clear selection if we didn't just finish a selection drag
                setSelectedElementIds([]);
              }
            }}
            className="relative mx-auto rounded-xl shadow-2xl select-none"
            data-canvas-background="true"
            style={{
              width: `${canvasWidth * (zoom / 100)}px`,
              height: `${canvasHeight * (zoom / 100)}px`,
              backgroundColor: canvasBackground,
              backgroundImage: showGridLines 
                ? `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `
                : 'none',
              backgroundSize: showGridLines 
                ? `${gridSize * (zoom / 100)}px ${gridSize * (zoom / 100)}px`
                : 'auto',
              cursor: drawingMode ? 'crosshair' : isSelecting ? 'crosshair' : 'default',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {/* Render Elements */}
            {elements
              .filter(el => el.visible)
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(element => (
                <div
                  key={element.id}
                  onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                  onDoubleClick={(e) => handleElementDoubleClick(e, element.id)}
                  className={`absolute cursor-move transition-shadow select-none ${
                    selectedElementIds.includes(element.id) 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : previewSelectedIds.includes(element.id) 
                        ? 'ring-2 ring-blue-400/60 ring-offset-2' 
                        : ''
                  } ${element.locked ? 'pointer-events-none opacity-50' : ''} ${isSelecting ? 'pointer-events-none' : ''}`}
                  style={{
                    left: `${element.x * (zoom / 100)}px`,
                    top: `${element.y * (zoom / 100)}px`,
                    width: `${element.width * (zoom / 100)}px`,
                    height: `${element.height * (zoom / 100)}px`,
                    transform: `
                      rotate(${element.rotation}deg) 
                      scaleX(${element.flipHorizontal ? -1 : 1}) 
                      scaleY(${element.flipVertical ? -1 : 1})
                    `,
                    opacity: element.opacity,
                    filter: element.blur ? `blur(${element.blur}px)` : undefined,
                  }}
                >
                  {/* Text Element */}
                  {element.type === 'text' && (
                    <>
                      {editingTextId === element.id ? (
                        <textarea
                          value={editingTextContent}
                          onChange={(e) => setEditingTextContent(e.target.value)}
                          onBlur={finishTextEditing}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              finishTextEditing();
                            }
                            e.stopPropagation();
                          }}
                          autoFocus
                          className="w-full h-full p-2 outline-none resize-none bg-transparent relative z-50"
                          style={{
                            fontSize: `${(element.fontSize || 16) * (zoom / 100)}px`,
                            fontWeight: element.fontWeight,
                            fontFamily: element.fontFamily || 'Inter',
                            lineHeight: element.lineHeight || 1.5,
                            letterSpacing: `${(element.letterSpacing || 0) * (zoom / 100)}px`,
                            textAlign: element.textAlign,
                            color: element.color,
                            whiteSpace: 'pre-wrap',
                            border: '2px solid #3b82f6',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full p-2 outline-none overflow-hidden pointer-events-none"
                          style={{
                            fontSize: `${(element.fontSize || 16) * (zoom / 100)}px`,
                            fontWeight: element.fontWeight,
                            fontFamily: element.fontFamily || 'Inter',
                            lineHeight: element.lineHeight || 1.5,
                            letterSpacing: `${(element.letterSpacing || 0) * (zoom / 100)}px`,
                            textAlign: element.textAlign,
                            color: element.color,
                            background: getGradientCSS(element.backgroundGradient) || element.backgroundColor,
                            backgroundClip: element.backgroundGradient?.enabled ? 'text' : undefined,
                            WebkitBackgroundClip: element.backgroundGradient?.enabled ? 'text' : undefined,
                            WebkitTextFillColor: element.backgroundGradient?.enabled ? 'transparent' : undefined,
                            borderRadius: `${(element.borderRadius || 0) * (zoom / 100)}px`,
                            borderWidth: element.borderWidth ? `${element.borderWidth * (zoom / 100)}px` : 0,
                            borderColor: element.borderColor,
                            borderStyle: element.borderStyle || 'solid',
                            whiteSpace: 'pre-wrap',
                            textShadow: getTextShadowCSS(element.textShadow),
                            boxShadow: getBoxShadowCSS(element.shadow),
                            WebkitTextStroke: element.textStroke?.enabled 
                              ? `${element.textStroke.width}px ${element.textStroke.color}` 
                              : undefined,
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                    </>
                  )}

                  {/* Shape Element */}
                  {element.type === 'shape' && (
                    <div
                      className="w-full h-full pointer-events-none"
                      style={{
                        background: getGradientCSS(element.backgroundGradient) || element.backgroundColor,
                        borderRadius: element.shapeType === 'circle' 
                          ? '50%' 
                          : element.shapeType === 'rounded-rect'
                          ? `${(element.borderRadius || 16) * (zoom / 100)}px`
                          : `${(element.borderRadius || 0) * (zoom / 100)}px`,
                        clipPath: getShapeClipPath(element.shapeType || ''),
                        borderWidth: element.borderWidth ? `${element.borderWidth * (zoom / 100)}px` : 0,
                        borderColor: element.borderColor,
                        borderStyle: element.borderStyle || 'solid',
                        boxShadow: getBoxShadowCSS(element.shadow),
                      }}
                    />
                  )}

                  {/* Line Element */}
                  {element.type === 'line' && (
                    <div
                      className="w-full pointer-events-none"
                      style={{
                        height: `${(element.lineWidth || 2) * (zoom / 100)}px`,
                        backgroundColor: element.color || '#000000',
                        borderStyle: element.lineType === 'dashed' ? 'dashed' : element.lineType === 'dotted' ? 'dotted' : 'solid',
                        position: 'relative',
                      }}
                    >
                      {element.lineType === 'arrow' && (
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2"
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: `${10 * (zoom / 100)}px solid ${element.color || '#000000'}`,
                            borderTop: `${6 * (zoom / 100)}px solid transparent`,
                            borderBottom: `${6 * (zoom / 100)}px solid transparent`,
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Chart Element */}
                  {element.type === 'chart' && element.chartData && element.width > 0 && element.height > 0 && (
                    <div 
                      className="w-full h-full rounded-lg overflow-hidden pointer-events-none"
                      style={{
                        background: getGradientCSS(element.backgroundGradient) || '#ffffff',
                        boxShadow: getBoxShadowCSS(element.shadow),
                      }}
                    >
                      <ResponsiveContainer 
                        width={Math.max(element.width * (zoom / 100), 50)} 
                        height={Math.max(element.height * (zoom / 100), 50)} 
                        minWidth={0} 
                        minHeight={0}
                      >
                        {element.chartType === 'bar' && (
                          <BarChart data={element.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill={element.chartColors?.[0] || '#3b82f6'} radius={[8, 8, 0, 0]} />
                            {element.chartData[0]?.value2 && <Bar dataKey="value2" fill={element.chartColors?.[1] || '#8b5cf6'} radius={[8, 8, 0, 0]} />}
                            {element.chartData[0]?.value3 && <Bar dataKey="value3" fill={element.chartColors?.[2] || '#ec4899'} radius={[8, 8, 0, 0]} />}
                          </BarChart>
                        )}
                        {element.chartType === 'line' && (
                          <LineChart data={element.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke={element.chartColors?.[0] || '#3b82f6'} strokeWidth={2} dot={{ r: 4 }} />
                            {element.chartData[0]?.value2 && <Line type="monotone" dataKey="value2" stroke={element.chartColors?.[1] || '#8b5cf6'} strokeWidth={2} dot={{ r: 4 }} />}
                            {element.chartData[0]?.value3 && <Line type="monotone" dataKey="value3" stroke={element.chartColors?.[2] || '#ec4899'} strokeWidth={2} dot={{ r: 4 }} />}
                          </LineChart>
                        )}
                        {element.chartType === 'area' && (
                          <AreaChart data={element.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="value" fill={element.chartColors?.[0] || '#3b82f6'} stroke={element.chartColors?.[0] || '#3b82f6'} fillOpacity={0.6} />
                            {element.chartData[0]?.value2 && <Area type="monotone" dataKey="value2" fill={element.chartColors?.[1] || '#8b5cf6'} stroke={element.chartColors?.[1] || '#8b5cf6'} fillOpacity={0.6} />}
                            {element.chartData[0]?.value3 && <Area type="monotone" dataKey="value3" fill={element.chartColors?.[2] || '#ec4899'} stroke={element.chartColors?.[2] || '#ec4899'} fillOpacity={0.6} />}
                          </AreaChart>
                        )}
                        {(element.chartType === 'pie' || element.chartType === 'donut') && (
                          <RechartsPie>
                            <Pie 
                              data={element.chartData} 
                              dataKey="value" 
                              nameKey="name" 
                              cx="50%" 
                              cy="50%" 
                              innerRadius={element.chartType === 'donut' ? '50%' : 0}
                              outerRadius="70%"
                              label={(entry) => entry.name}
                            >
                              {element.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={element.chartColors?.[index % (element.chartColors?.length || defaultChartColors.length)] || defaultChartColors[index % defaultChartColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPie>
                        )}
                        {element.chartType === 'radar' && (
                          <RadarChart data={element.chartData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <PolarRadiusAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Radar name="Value" dataKey="value" stroke={element.chartColors?.[0] || '#3b82f6'} fill={element.chartColors?.[0] || '#3b82f6'} fillOpacity={0.6} />
                            {element.chartData[0]?.value2 && <Radar name="Value 2" dataKey="value2" stroke={element.chartColors?.[1] || '#8b5cf6'} fill={element.chartColors?.[1] || '#8b5cf6'} fillOpacity={0.6} />}
                          </RadarChart>
                        )}
                        {element.chartType === 'scatter' && (
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="value" name="X" tick={{ fontSize: 12 }} />
                            <YAxis dataKey="value2" name="Y" tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Data" data={element.chartData} fill={element.chartColors?.[0] || '#3b82f6'} />
                          </ScatterChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Image Element */}
                  {element.type === 'image' && (
                    <div className="w-full h-full rounded-lg overflow-hidden pointer-events-none" style={{ boxShadow: getBoxShadowCSS(element.shadow) }}>
                      {element.imageUrl ? (
                        <img 
                          src={element.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover"
                          style={{
                            borderRadius: `${(element.borderRadius || 0) * (zoom / 100)}px`,
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Icon Element */}
                  {element.type === 'icon' && (
                    <div 
                      className="w-full h-full flex items-center justify-center pointer-events-none"
                      style={{ 
                        color: element.iconColor,
                        filter: element.shadow?.enabled 
                          ? `drop-shadow(${element.shadow.x}px ${element.shadow.y}px ${element.shadow.blur}px ${element.shadow.color})`
                          : undefined
                      }}
                    >
                      {renderIcon(element.iconName || 'Heart', 'w-full h-full')}
                    </div>
                  )}

                  {/* Table Element */}
                  {element.type === 'table' && element.tableData && (
                    <TableElement
                      tableData={element.tableData}
                      tableHeaderRow={element.tableHeaderRow}
                      tableCellPadding={element.tableCellPadding}
                      tableShowBorders={element.tableShowBorders}
                      tableBorderColor={element.tableBorderColor}
                      tableBorderWidth={element.tableBorderWidth}
                      tableAlternateRowColors={element.tableAlternateRowColors}
                      tableAlternateRowColor={element.tableAlternateRowColor}
                      fontSize={element.fontSize}
                      fontFamily={element.fontFamily}
                      color={element.color}
                      backgroundColor={element.backgroundColor}
                      borderRadius={element.borderRadius}
                      zoom={zoom}
                      boxShadow={getBoxShadowCSS(element.shadow)}
                      isEditing={editingTableId === element.id}
                      selectedCells={selectedCells}
                      onCellClick={(row, col, shiftKey) => {
                        if (editingTableId === element.id) {
                          if (shiftKey) {
                            setSelectedCells(prev => {
                              const exists = prev.some(sc => sc.row === row && sc.col === col);
                              if (exists) {
                                return prev.filter(sc => !(sc.row === row && sc.col === col));
                              } else {
                                return [...prev, { row, col }];
                              }
                            });
                          } else {
                            setSelectedCells([{ row, col }]);
                          }
                        }
                      }}
                      renderIcon={renderIcon}
                    />
                  )}

                  {/* Custom Shape Element */}
                  {element.type === 'custom-shape' && element.customPoints && element.customPoints.length > 0 && (
                    <svg 
                      className="w-full h-full pointer-events-none"
                      viewBox={`0 0 ${element.width} ${element.height}`}
                      preserveAspectRatio="none"
                      style={{
                        filter: element.shadow?.enabled 
                          ? `drop-shadow(${element.shadow.x}px ${element.shadow.y}px ${element.shadow.blur}px ${element.shadow.color})`
                          : undefined
                      }}
                    >
                      <defs>
                        {element.backgroundGradient?.enabled && (
                          <linearGradient id={`gradient-${element.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            {element.backgroundGradient.stops.map((stop, idx) => (
                              <stop key={idx} offset={`${stop.position}%`} stopColor={stop.color} />
                            ))}
                          </linearGradient>
                        )}
                      </defs>
                      <polygon
                        points={element.customPoints.map(p => `${p.x},${p.y}`).join(' ')}
                        fill={element.backgroundGradient?.enabled ? `url(#gradient-${element.id})` : element.backgroundColor || element.color}
                        stroke={element.borderWidth && element.borderWidth > 0 ? element.borderColor : 'none'}
                        strokeWidth={element.borderWidth || 0}
                        strokeLinejoin={element.strokeLinejoin || 'round'}
                        strokeLinecap={element.strokeLinecap || 'round'}
                        fillRule={element.fillRule || 'nonzero'}
                        opacity={element.opacity}
                      />
                    </svg>
                  )}

                  {/* Connector Element */}
                  {element.type === 'connector' && (
                    <svg 
                      className="w-full h-full pointer-events-none overflow-visible"
                      viewBox={`0 0 ${element.width} ${element.height}`}
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <marker
                          id={`arrow-end-${element.id}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path d="M0,0 L0,6 L9,3 z" fill={element.color || '#000000'} />
                        </marker>
                        <marker
                          id={`arrow-start-${element.id}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="1"
                          refY="3"
                          orient="auto-start-reverse"
                          markerUnits="strokeWidth"
                        >
                          <path d="M9,0 L9,6 L0,3 z" fill={element.color || '#000000'} />
                        </marker>
                      </defs>
                      {element.connectorType === 'straight' ? (
                        <line
                          x1={element.connectorStartX || 0}
                          y1={element.connectorStartY || 0}
                          x2={element.connectorEndX || element.width}
                          y2={element.connectorEndY || element.height}
                          stroke={element.color || '#000000'}
                          strokeWidth={element.lineWidth || 2}
                          strokeDasharray={element.lineType === 'dashed' ? '5,5' : element.lineType === 'dotted' ? '2,2' : 'none'}
                          markerStart={element.connectorArrowStart ? `url(#arrow-start-${element.id})` : undefined}
                          markerEnd={element.connectorArrowEnd ? `url(#arrow-end-${element.id})` : undefined}
                        />
                      ) : element.connectorType === 'curved' ? (
                        <path
                          d={`M ${element.connectorStartX || 0} ${element.connectorStartY || 0} Q ${(element.connectorStartX || 0 + element.connectorEndX || element.width) / 2} ${element.connectorStartY || 0}, ${element.connectorEndX || element.width} ${element.connectorEndY || element.height}`}
                          fill="none"
                          stroke={element.color || '#000000'}
                          strokeWidth={element.lineWidth || 2}
                          strokeDasharray={element.lineType === 'dashed' ? '5,5' : element.lineType === 'dotted' ? '2,2' : 'none'}
                          markerStart={element.connectorArrowStart ? `url(#arrow-start-${element.id})` : undefined}
                          markerEnd={element.connectorArrowEnd ? `url(#arrow-end-${element.id})` : undefined}
                        />
                      ) : (
                        // Elbow connector
                        <path
                          d={`M ${element.connectorStartX || 0} ${element.connectorStartY || 0} L ${element.connectorEndX || element.width} ${element.connectorStartY || 0} L ${element.connectorEndX || element.width} ${element.connectorEndY || element.height}`}
                          fill="none"
                          stroke={element.color || '#000000'}
                          strokeWidth={element.lineWidth || 2}
                          strokeDasharray={element.lineType === 'dashed' ? '5,5' : element.lineType === 'dotted' ? '2,2' : 'none'}
                          markerStart={element.connectorArrowStart ? `url(#arrow-start-${element.id})` : undefined}
                          markerEnd={element.connectorArrowEnd ? `url(#arrow-end-${element.id})` : undefined}
                        />
                      )}
                    </svg>
                  )}

                  {/* Badge Element */}
                  {element.type === 'badge' && (
                    <div
                      className="w-full h-full flex items-center justify-center pointer-events-none"
                      style={{
                        borderRadius: element.badgeShape === 'circle' ? '50%' : element.badgeShape === 'pill' ? '9999px' : `${(element.borderRadius || 4) * (zoom / 100)}px`,
                        backgroundColor: element.badgeStyle === 'filled' ? element.backgroundColor || '#3b82f6' : 'transparent',
                        border: element.badgeStyle === 'outlined' ? `${2 * (zoom / 100)}px solid ${element.backgroundColor || '#3b82f6'}` : 'none',
                        boxShadow: getBoxShadowCSS(element.shadow),
                      }}
                    >
                      <span
                        style={{
                          color: element.badgeStyle === 'filled' ? '#ffffff' : element.backgroundColor || '#3b82f6',
                          fontSize: `${(element.fontSize || 20) * (zoom / 100)}px`,
                          fontWeight: element.fontWeight || 'bold',
                          fontFamily: element.fontFamily || 'Inter',
                        }}
                      >
                        {element.badgeText || element.badgeNumber || '1'}
                      </span>
                    </div>
                  )}

                  {/* Progress Bar Element */}
                  {element.type === 'progress-bar' && (
                    <div className="w-full h-full flex flex-col justify-center pointer-events-none p-2">
                      {element.progressLabel && (
                        <div className="flex justify-between items-center mb-1">
                          <span
                            style={{
                              fontSize: `${(element.fontSize || 12) * (zoom / 100)}px`,
                              fontFamily: element.fontFamily || 'Inter',
                              color: element.color || '#000000',
                              fontWeight: element.fontWeight || 'normal',
                            }}
                          >
                            {element.progressLabel}
                          </span>
                          {element.progressShowValue && (
                            <span
                              style={{
                                fontSize: `${(element.fontSize || 12) * (zoom / 100)}px`,
                                fontFamily: element.fontFamily || 'Inter',
                                color: element.color || '#000000',
                                fontWeight: 'bold',
                              }}
                            >
                              {element.progressValue || 0}/{element.progressMax || 100}
                            </span>
                          )}
                        </div>
                      )}
                      <div
                        className="w-full rounded-full overflow-hidden"
                        style={{
                          height: `${12 * (zoom / 100)}px`,
                          backgroundColor: element.progressTrackColor || '#e5e7eb',
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${((element.progressValue || 0) / (element.progressMax || 100)) * 100}%`,
                            backgroundColor: element.progressBarColor || '#22c55e',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Resize Handles - Only for selected single element and not editing */}
                  {selectedElementIds.length === 1 && selectedElementIds.includes(element.id) && !element.locked && editingTextId !== element.id && (
                    <>
                      {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((handle) => (
                        <div
                          key={handle}
                          onMouseDown={(e) => handleResizeStart(e, element.id, handle)}
                          className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-pointer hover:scale-125 transition-transform z-10"
                          style={{
                            ...(handle.includes('n') && { top: '-6px' }),
                            ...(handle.includes('s') && { bottom: '-6px' }),
                            ...(handle.includes('w') && { left: '-6px' }),
                            ...(handle.includes('e') && { right: '-6px' }),
                            ...(handle === 'n' && { left: '50%', transform: 'translateX(-50%)' }),
                            ...(handle === 's' && { left: '50%', transform: 'translateX(-50%)' }),
                            ...(handle === 'w' && { top: '50%', transform: 'translateY(-50%)' }),
                            ...(handle === 'e' && { top: '50%', transform: 'translateY(-50%)' }),
                            cursor: handle === 'n' || handle === 's' ? 'ns-resize' 
                                  : handle === 'e' || handle === 'w' ? 'ew-resize'
                                  : handle === 'nw' || handle === 'se' ? 'nwse-resize'
                                  : 'nesw-resize',
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              ))}

            {/* Drawing Points Preview */}
            {drawingMode && drawingPoints.length > 0 && (
              <>
                {/* Draw lines between points */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                  <polyline
                    points={drawingPoints.map(p => `${p.x * (zoom / 100)},${p.y * (zoom / 100)}`).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  {drawingPoints.length >= 3 && (
                    <line
                      x1={drawingPoints[drawingPoints.length - 1].x * (zoom / 100)}
                      y1={drawingPoints[drawingPoints.length - 1].y * (zoom / 100)}
                      x2={drawingPoints[0].x * (zoom / 100)}
                      y2={drawingPoints[0].y * (zoom / 100)}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />
                  )}
                </svg>
                
                {/* Draw points */}
                {drawingPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full pointer-events-none shadow-lg"
                    style={{
                      left: `${point.x * (zoom / 100) - 6}px`,
                      top: `${point.y * (zoom / 100) - 6}px`,
                    }}
                  />
                ))}
              </>
            )}

            {/* Selection Box */}
            {isSelecting && selectionBox && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none rounded"
                style={{
                  left: `${Math.min(selectionBox.startX, selectionBox.endX) * (zoom / 100)}px`,
                  top: `${Math.min(selectionBox.startY, selectionBox.endY) * (zoom / 100)}px`,
                  width: `${Math.abs(selectionBox.endX - selectionBox.startX) * (zoom / 100)}px`,
                  height: `${Math.abs(selectionBox.endY - selectionBox.startY) * (zoom / 100)}px`,
                }}
              />
            )}

            {/* Smart Guides - Show during drag/resize */}
            {showSmartGuides && (isDragging || isResizing) && selectedElementIds.length === 1 && (
              <SmartGuidesWithDistances
                activeElement={elements.find(el => el.id === selectedElementIds[0]) || null}
                allElements={elements.filter(el => !selectedElementIds.includes(el.id))}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                zoom={zoom}
                snapThreshold={5}
                showDistances={true}
              />
            )}

            {/* Floating Context Menu */}
            {floatingMenuPosition && selectedElementIds.length > 0 && !editingTextId && (
              <div
                className="absolute z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  left: `${floatingMenuPosition.x}px`,
                  top: `${floatingMenuPosition.y}px`,
                  transform: floatingMenuPosition.isBelow 
                    ? 'translate(-50%, 0%)' 
                    : 'translate(-50%, -100%)',
                }}
              >
                <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/10 p-1.5 flex items-center gap-1 relative">
                  {/* Arrow pointing to selected element */}
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent ${
                      floatingMenuPosition.isBelow 
                        ? '-top-2 border-b-8 border-b-white/95' 
                        : '-bottom-2 border-t-8 border-t-white/95'
                    }`}
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                  />
                  {/* Quick Actions */}
                  <button
                    onClick={copyElements}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                    title="Sao chép (Ctrl+C)"
                  >
                    <Clipboard className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  <button
                    onClick={duplicateSelectedElements}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                    title="Nhân bản (Ctrl+D)"
                  >
                    <Copy className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  <button
                    onClick={deleteSelectedElements}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Xóa (Del)"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                  </button>

                  {/* Divider */}
                  <div className="h-6 w-px bg-border/60" />

                  {/* Single Element Actions */}
                  {selectedElementIds.length === 1 && selectedElement && (
                    <>
                      <button
                        onClick={() => updateSelectedElements({ locked: !selectedElement.locked })}
                        className={`p-2 rounded-lg transition-colors group ${
                          selectedElement.locked ? 'bg-amber-50' : 'hover:bg-blue-50'
                        }`}
                        title={selectedElement.locked ? "Mở khóa" : "Khóa"}
                      >
                        {selectedElement.locked ? (
                          <Lock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Unlock className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        )}
                      </button>

                      {/* Divider */}
                      <div className="h-6 w-px bg-border/60" />

                      <button
                        onClick={flipHorizontal}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Lật ngang"
                      >
                        <FlipHorizontal className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={flipVertical}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Lật dọc"
                      >
                        <FlipVertical className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>

                      {/* Divider */}
                      <div className="h-6 w-px bg-border/60" />

                      <button
                        onClick={sendBackward}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Đưa ra sau (Ctrl+[)"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={sendToBack}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Đưa xuống dưới cùng (Ctrl+Shift+[)"
                      >
                        <ArrowDown className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={bringForward}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Đưa lên trước (Ctrl+])"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={bringToFront}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Đưa lên trên cùng (Ctrl+Shift+])"
                      >
                        <ArrowUp className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                    </>
                  )}

                  {/* Multiple Selection Actions */}
                  {selectedElementIds.length > 1 && (
                    <>
                      {/* Divider */}
                      <div className="h-6 w-px bg-border/60" />

                      <button
                        onClick={alignLeft}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Căn trái"
                      >
                        <AlignLeft className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={alignCenter}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Căn giữa"
                      >
                        <AlignHorizontalJustifyCenter className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={alignRight}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Căn phải"
                      >
                        <AlignRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={alignTop}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Căn trên"
                      >
                        <AlignHorizontalJustifyCenter className="w-4 h-4 text-gray-600 group-hover:text-blue-600 rotate-90" />
                      </button>
                      <button
                        onClick={alignMiddle}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Căn giữa dọc"
                      >
                        <AlignVerticalJustifyCenter className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={alignBottom}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Căn dưới"
                      >
                        <AlignHorizontalJustifyCenter className="w-4 h-4 text-gray-600 group-hover:text-blue-600 -rotate-90" />
                      </button>

                      {/* Divider */}
                      <div className="h-6 w-px bg-border/60" />

                      <button
                        onClick={() => distributeElements('horizontal')}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Phân bố ngang"
                      >
                        <AlignHorizontalSpaceAround className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => distributeElements('vertical')}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Phân bố dọc"
                      >
                        <AlignVerticalSpaceAround className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>

                      {/* Divider */}
                      <div className="h-6 w-px bg-border/60" />

                      <button
                        onClick={groupElements}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Nhóm (Ctrl+G)"
                      >
                        <Group className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                    </>
                  )}

                  {/* Selection Count Badge */}
                  <div className="ml-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                    {selectedElementIds.length}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {elements.length === 0 && !drawingMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Bắt đầu tạo infographic</h3>
                  <p className="text-sm text-muted-foreground mb-4">Thêm phần tử, sử dụng mẫu, hoặc Trợ lý AI</p>
                  <div className="flex items-center gap-2 justify-center mb-4">
                    <button
                      onClick={() => addElement('text')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      Thêm văn bản
                    </button>
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
                    >
                      Chọn mẫu
                    </button>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
                    <p className="text-xs font-semibold text-blue-900 mb-2">✨ Tính năng và phím tắt:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• <strong>Ctrl+C / Ctrl+V</strong> - Sao chép/Dán phần tử</li>
                      <li>• <strong>Ctrl+D</strong> - Nhân bản lựa chọn</li>
                      <li>• <strong>Ctrl+A</strong> - Chọn tất cả</li>
                      <li>• <strong>Ctrl+[/]</strong> - Di chuyển lớp ra sau/lên trước</li>
                      <li>• <strong>Shift+Click</strong> - Bật/tắt lựa chọn</li>
                      <li>• <strong>Kéo chuột</strong> - Chọn nhiều với vùng chọn</li>
                      <li>• <strong>Nhấp đúp</strong> văn bản để sửa trực tiếp</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties & Effects */}
        <div className="w-96 border-l border-border/60 bg-card/50 overflow-y-auto flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-border/60 bg-muted/20 overflow-x-auto">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'properties' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="w-4 h-4 mx-auto mb-1" />
              Properties
            </button>
            <button
              onClick={() => setActiveTab('effects')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'effects' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4 mx-auto mb-1" />
              Effects
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'layers' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4 mx-auto mb-1" />
              Layers
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'templates' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layout className="w-4 h-4 mx-auto mb-1" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab('background')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'background' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Palette className="w-4 h-4 mx-auto mb-1" />
              Canvas
            </button>
            <button
              onClick={() => setActiveTab('styles')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'styles' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TypeIcon className="w-4 h-4 mx-auto mb-1" />
              Styles
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 ${
                activeTab === 'elements' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className="w-4 h-4 mx-auto mb-1" />
              Elements
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-3 py-3 text-xs transition-colors flex-shrink-0 relative ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-card/50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-4 h-4 mx-auto mb-1" />
              History
              {history.length > 1 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* AI Panel */}
            {showAiPanel && (
              <div className="p-4 border-b border-border/60 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Trợ lý AI</h3>
                  </div>
                  <button
                    onClick={() => setShowAiPanel(false)}
                    className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Mô tả infographic bạn muốn tạo... Ví dụ: 'Tạo timeline 5 năm phát triển công ty với gradient màu xanh'"
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 mb-3"
                  rows={4}
                />

                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Tạo với AI</span>
                    </>
                  )}
                </button>

                <div className="mt-3 space-y-2">
                  <p className="text-xs text-purple-700">💡 Gợi ý:</p>
                  <div className="space-y-1">
                    {[
                      'Timeline 5 năm với gradient',
                      'So sánh 3 sản phẩm hiện đại',
                      'Thống kê với bóng đổ đẹp',
                      'Quy trình có hiệu ứng động',
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAiPrompt(suggestion)}
                        className="w-full text-left px-3 py-2 text-xs bg-white/50 hover:bg-white rounded-lg transition-colors text-purple-800"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Properties Panel */}
            {activeTab === 'properties' && selectedElement && (
              <div className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Element Properties
                </h3>
                
                {/* Text Properties */}
                {selectedElement.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Nội dung</label>
                      <textarea
                        value={selectedElement.content}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Cỡ chữ</label>
                        <input
                          type="number"
                          value={selectedElement.fontSize}
                          onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Độ đậm</label>
                        <select
                          value={selectedElement.fontWeight}
                          onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value })}
                          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                        >
                          <option value="normal">Thường</option>
                          <option value="medium">Vừa</option>
                          <option value="semibold">Hơi đậm</option>
                          <option value="bold">Đậm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Phông chữ</label>
                      <select
                        value={selectedElement.fontFamily || 'Inter'}
                        onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Căn chỉnh</label>
                      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        <button
                          onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                          className={`flex-1 p-2 rounded transition-colors ${
                            selectedElement.textAlign === 'left' ? 'bg-card shadow-sm' : ''
                          }`}
                        >
                          <AlignLeft className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                          className={`flex-1 p-2 rounded transition-colors ${
                            selectedElement.textAlign === 'center' ? 'bg-card shadow-sm' : ''
                          }`}
                        >
                          <AlignCenter className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                          className={`flex-1 p-2 rounded transition-colors ${
                            selectedElement.textAlign === 'right' ? 'bg-card shadow-sm' : ''
                          }`}
                        >
                          <AlignRight className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-3 mt-3">
                      <AdvancedColorPicker
                        color={selectedElement.color || '#000000'}
                        gradient={selectedElement.backgroundGradient}
                        onChange={(color) => updateElement(selectedElement.id, { color })}
                        onGradientChange={(gradient) => updateElement(selectedElement.id, { backgroundGradient: gradient })}
                        showGradient={true}
                        label="Text Color / Gradient"
                      />
                    </div>

                    <div className="border-t border-border/60 pt-3 mt-3">
                      <TransformPanel
                        x={selectedElement.x}
                        y={selectedElement.y}
                        width={selectedElement.width}
                        height={selectedElement.height}
                        rotation={selectedElement.rotation}
                        locked={selectedElement.locked}
                        onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                      />
                    </div>
                  </div>
                )}

                {/* Shape Properties */}
                {selectedElement.type === 'shape' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Loại hình</label>
                      <button
                        onClick={() => setShowShapeLibrary(true)}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                      >
                        <span>{selectedElement.shapeType || 'rectangle'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Màu nền</label>
                      <input
                        type="color"
                        value={selectedElement.backgroundColor}
                        onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                        className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                      />
                    </div>

                    {(selectedElement.shapeType === 'rectangle' || selectedElement.shapeType === 'rounded-rect') && (
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Border Radius ({selectedElement.borderRadius || 0}px)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedElement.borderRadius || 0}
                          onChange={(e) => updateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Border Width ({selectedElement.borderWidth || 0}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={selectedElement.borderWidth || 0}
                        onChange={(e) => updateElement(selectedElement.id, { borderWidth: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {(selectedElement.borderWidth || 0) > 0 && (
                      <>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Màu viền</label>
                          <input
                            type="color"
                            value={selectedElement.borderColor || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, { borderColor: e.target.value })}
                            className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Kiểu viền</label>
                          <select
                            value={selectedElement.borderStyle || 'solid'}
                            onChange={(e) => updateElement(selectedElement.id, { borderStyle: e.target.value as any })}
                            className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                          >
                            <option value="solid">Liền</option>
                            <option value="dashed">Nét đứt</option>
                            <option value="dotted">Chấm</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Chart Properties */}
                {selectedElement.type === 'chart' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Loại biểu đồ</label>
                      <select
                        value={selectedElement.chartType || 'bar'}
                        onChange={(e) => updateElement(selectedElement.id, { chartType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="bar">Biểu đồ cột</option>
                        <option value="line">Biểu đồ đường</option>
                        <option value="area">Biểu đồ vùng</option>
                        <option value="pie">Biểu đồ tròn</option>
                        <option value="donut">Biểu đồ donut</option>
                        <option value="radar">Biểu đồ radar</option>
                        <option value="scatter">Biểu đồ phân tán</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Dữ liệu biểu đồ</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedElement.chartData?.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-2 p-2 bg-muted/30 rounded-lg">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newData = [...(selectedElement.chartData || [])];
                                newData[idx] = { ...newData[idx], name: e.target.value };
                                updateElement(selectedElement.id, { chartData: newData });
                              }}
                              placeholder="Nhãn"
                              className="px-2 py-1 border border-border/60 rounded text-xs"
                            />
                            <input
                              type="number"
                              value={item.value}
                              onChange={(e) => {
                                const newData = [...(selectedElement.chartData || [])];
                                newData[idx] = { ...newData[idx], value: parseInt(e.target.value) || 0 };
                                updateElement(selectedElement.id, { chartData: newData });
                              }}
                              placeholder="Giá trị"
                              className="px-2 py-1 border border-border/60 rounded text-xs"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newData = [...(selectedElement.chartData || []), { name: 'New', value: 50 }];
                          updateElement(selectedElement.id, { chartData: newData });
                        }}
                        className="w-full mt-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                      >
                        + Add Data Point
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Màu biểu đồ</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(selectedElement.chartColors || defaultChartColors).slice(0, 4).map((color, idx) => (
                          <input
                            key={idx}
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(selectedElement.chartColors || defaultChartColors)];
                              newColors[idx] = e.target.value;
                              updateElement(selectedElement.id, { chartColors: newColors });
                            }}
                            className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Table Properties */}
                {selectedElement.type === 'table' && selectedElement.tableData && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Trình chỉnh sửa bảng</h4>
                      <span className="text-xs text-muted-foreground">
                        {selectedElement.tableRows || 0} × {selectedElement.tableColumns || 0}
                      </span>
                    </div>

                    {/* Add/Remove Rows & Columns */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground">Hàng</label>
                        <div className="flex gap-1">
                          <button
                            onClick={() => addTableRow(selectedElement.id, 'top')}
                            className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            title="Thêm hàng trên"
                          >
                            + Trên
                          </button>
                          <button
                            onClick={() => addTableRow(selectedElement.id, 'bottom')}
                            className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            title="Thêm hàng dưới"
                          >
                            + Dưới
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground">Cột</label>
                        <div className="flex gap-1">
                          <button
                            onClick={() => addTableColumn(selectedElement.id, 'left')}
                            className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            title="Thêm cột trái"
                          >
                            + Trái
                          </button>
                          <button
                            onClick={() => addTableColumn(selectedElement.id, 'right')}
                            className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            title="Thêm cột phải"
                          >
                            + Phải
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cell Editing */}
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Sửa ô</label>
                      <div className="max-h-64 overflow-y-auto border border-border/60 rounded-lg">
                        <table className="w-full text-xs">
                          <tbody>
                            {selectedElement.tableData.map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b border-border/30 last:border-0">
                                <td className="p-1 text-center text-muted-foreground font-mono w-6 bg-muted/30">
                                  {rowIdx}
                                </td>
                                {row.map((cell, colIdx) => (
                                  <td key={colIdx} className="p-1">
                                    <input
                                      type="text"
                                      value={cell.content}
                                      onChange={(e) => updateTableCell(selectedElement.id, rowIdx, colIdx, { content: e.target.value })}
                                      className="w-full px-1 py-0.5 border border-border/40 rounded text-xs"
                                      placeholder={`${rowIdx},${colIdx}`}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Kiểu bảng */}
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <label className="block text-xs font-semibold text-muted-foreground">Kiểu bảng</label>
                      
                      <div>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedElement.tableShowBorders || false}
                            onChange={(e) => updateElement(selectedElement.id, { tableShowBorders: e.target.checked })}
                            className="rounded"
                          />
                          Show Borders
                        </label>
                      </div>

                      {selectedElement.tableShowBorders && (
                        <>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Màu viền</label>
                            <input
                              type="color"
                              value={selectedElement.tableBorderColor || '#e5e7eb'}
                              onChange={(e) => updateElement(selectedElement.id, { tableBorderColor: e.target.value })}
                              className="w-full h-8 border border-border/60 rounded cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              Border Width ({selectedElement.tableBorderWidth || 1}px)
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={selectedElement.tableBorderWidth || 1}
                              onChange={(e) => updateElement(selectedElement.id, { tableBorderWidth: parseInt(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Cell Padding ({selectedElement.tableCellPadding || 8}px)
                        </label>
                        <input
                          type="range"
                          min="4"
                          max="24"
                          value={selectedElement.tableCellPadding || 8}
                          onChange={(e) => updateElement(selectedElement.id, { tableCellPadding: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedElement.tableAlternateRowColors || false}
                            onChange={(e) => updateElement(selectedElement.id, { tableAlternateRowColors: e.target.checked })}
                            className="rounded"
                          />
                          Alternate Row Colors
                        </label>
                      </div>

                      {selectedElement.tableAlternateRowColors && (
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Màu xen kẽ</label>
                          <input
                            type="color"
                            value={selectedElement.tableAlternateRowColor || '#f9fafb'}
                            onChange={(e) => updateElement(selectedElement.id, { tableAlternateRowColor: e.target.value })}
                            className="w-full h-8 border border-border/60 rounded cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cell Selection Actions */}
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <label className="block text-xs font-semibold text-muted-foreground">Thao tác ô</label>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (editingTableId === selectedElement.id) {
                              setEditingTableId(null);
                              setSelectedCells([]);
                            } else {
                              setEditingTableId(selectedElement.id);
                            }
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            editingTableId === selectedElement.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {editingTableId === selectedElement.id ? '✓ Đang sửa ô' : 'Sửa ô'}
                        </button>
                        
                        <button
                          onClick={() => importTableFromClipboard(selectedElement.id)}
                          className="px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
                          title="Dán từ Excel/Sheets"
                        >
                          📋 Import
                        </button>
                      </div>

                      {editingTableId === selectedElement.id && selectedCells.length > 0 && (
                        <>
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">
                              {selectedCells.length} cell{selectedCells.length > 1 ? 's' : ''} selected
                            </p>
                          </div>

                          {/* Merge/Unmerge Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                mergeCells(selectedElement.id, selectedCells);
                                setSelectedCells([]);
                              }}
                              disabled={selectedCells.length < 2}
                              className="px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg text-xs font-medium transition-colors"
                            >
                              🔗 Merge
                            </button>
                            <button
                              onClick={() => {
                                if (selectedCells.length === 1) {
                                  unmergeCells(selectedElement.id, selectedCells[0].row, selectedCells[0].col);
                                  setSelectedCells([]);
                                }
                              }}
                              disabled={selectedCells.length !== 1}
                              className="px-3 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg text-xs font-medium transition-colors"
                            >
                              ⛓️‍💥 Unmerge
                            </button>
                          </div>

                          {/* Cell Formatting Toolbar */}
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-muted-foreground">Định dạng ô đã chọn</label>
                            
                            {/* Text Alignment */}
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">Căn chỉnh</label>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => formatSelectedCells(selectedElement.id, selectedCells, { textAlign: 'left' })}
                                  className="flex-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                                  title="Căn trái"
                                >
                                  <AlignLeft className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                  onClick={() => formatSelectedCells(selectedElement.id, selectedCells, { textAlign: 'center' })}
                                  className="flex-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                                  title="Căn giữa"
                                >
                                  <AlignCenter className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                  onClick={() => formatSelectedCells(selectedElement.id, selectedCells, { textAlign: 'right' })}
                                  className="flex-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                                  title="Căn phải"
                                >
                                  <AlignRight className="w-3 h-3 mx-auto" />
                                </button>
                              </div>
                            </div>

                            {/* Font Weight */}
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">Độ đậm</label>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => formatSelectedCells(selectedElement.id, selectedCells, { fontWeight: 'normal' })}
                                  className="flex-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                                >
                                  Normal
                                </button>
                                <button
                                  onClick={() => formatSelectedCells(selectedElement.id, selectedCells, { fontWeight: 'bold' })}
                                  className="flex-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs font-bold"
                                >
                                  Bold
                                </button>
                              </div>
                            </div>

                            {/* Cell Colors */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Màu chữ</label>
                                <input
                                  type="color"
                                  onChange={(e) => formatSelectedCells(selectedElement.id, selectedCells, { color: e.target.value })}
                                  className="w-full h-8 border border-border/60 rounded cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Màu nền</label>
                                <input
                                  type="color"
                                  onChange={(e) => formatSelectedCells(selectedElement.id, selectedCells, { backgroundColor: e.target.value })}
                                  className="w-full h-8 border border-border/60 rounded cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {!editingTableId && (
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <p className="text-xs text-amber-700">
                            <strong>💡 Tip:</strong> Click "Edit Cells" to select and format cells
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Custom Shape Properties */}
                {selectedElement.type === 'custom-shape' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Màu nền</label>
                      <input
                        type="color"
                        value={selectedElement.backgroundColor || selectedElement.color}
                        onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value, color: e.target.value })}
                        className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Border Width ({selectedElement.borderWidth || 0}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={selectedElement.borderWidth || 0}
                        onChange={(e) => updateElement(selectedElement.id, { borderWidth: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {(selectedElement.borderWidth || 0) > 0 && (
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Màu viền</label>
                        <input
                          type="color"
                          value={selectedElement.borderColor || '#000000'}
                          onChange={(e) => updateElement(selectedElement.id, { borderColor: e.target.value })}
                          className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Points: {selectedElement.customPoints?.length || 0}</label>
                      <p className="text-xs text-muted-foreground">Hình vẽ tùy chỉnh</p>
                    </div>
                  </div>
                )}

                {/* Connector Properties */}
                {selectedElement.type === 'connector' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Loại kết nối</label>
                      <select
                        value={selectedElement.connectorType || 'elbow'}
                        onChange={(e) => updateElement(selectedElement.id, { connectorType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="straight">Thẳng</option>
                        <option value="elbow">Gấp khúc (hình L)</option>
                        <option value="curved">Cong</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedElement.connectorArrowStart || false}
                            onChange={(e) => updateElement(selectedElement.id, { connectorArrowStart: e.target.checked })}
                            className="rounded"
                          />
                          Mũi tên đầu
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedElement.connectorArrowEnd || false}
                            onChange={(e) => updateElement(selectedElement.id, { connectorArrowEnd: e.target.checked })}
                            className="rounded"
                          />
                          Mũi tên cuối
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Độ dày đường ({selectedElement.lineWidth || 2}px)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedElement.lineWidth || 2}
                        onChange={(e) => updateElement(selectedElement.id, { lineWidth: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Kiểu đường</label>
                      <select
                        value={selectedElement.lineType || 'straight'}
                        onChange={(e) => updateElement(selectedElement.id, { lineType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="straight">Liền</option>
                        <option value="dashed">Nét đứt</option>
                        <option value="dotted">Chấm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Màu sắc</label>
                      <input
                        type="color"
                        value={selectedElement.color || '#000000'}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Badge Properties */}
                {selectedElement.type === 'badge' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Văn bản/Số huy hiệu</label>
                      <input
                        type="text"
                        value={selectedElement.badgeText || selectedElement.badgeNumber || '1'}
                        onChange={(e) => updateElement(selectedElement.id, { badgeText: e.target.value, badgeNumber: parseInt(e.target.value) || undefined })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Hình dạng</label>
                      <select
                        value={selectedElement.badgeShape || 'circle'}
                        onChange={(e) => updateElement(selectedElement.id, { badgeShape: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="circle">Tròn</option>
                        <option value="square">Vuông</option>
                        <option value="pill">Viên thuốc</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Kiểu</label>
                      <select
                        value={selectedElement.badgeStyle || 'filled'}
                        onChange={(e) => updateElement(selectedElement.id, { badgeStyle: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="filled">Đặc</option>
                        <option value="outlined">Viền</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Cỡ chữ</label>
                        <input
                          type="number"
                          value={selectedElement.fontSize || 20}
                          onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Độ đậm</label>
                        <select
                          value={selectedElement.fontWeight || 'bold'}
                          onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value })}
                          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                        >
                          <option value="normal">Thường</option>
                          <option value="bold">Đậm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Màu nền</label>
                      <input
                        type="color"
                        value={selectedElement.backgroundColor || '#3b82f6'}
                        onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                        className="w-full h-10 border border-border/60 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Thuộc tính thanh tiến trình */}
                {selectedElement.type === 'progress-bar' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Nhãn</label>
                      <input
                        type="text"
                        value={selectedElement.progressLabel || ''}
                        onChange={(e) => updateElement(selectedElement.id, { progressLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                        placeholder="Nhãn tiến trình"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Giá trị</label>
                        <input
                          type="number"
                          value={selectedElement.progressValue || 0}
                          onChange={(e) => updateElement(selectedElement.id, { progressValue: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Tối đa</label>
                        <input
                          type="number"
                          value={selectedElement.progressMax || 100}
                          onChange={(e) => updateElement(selectedElement.id, { progressMax: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedElement.progressShowValue || false}
                          onChange={(e) => updateElement(selectedElement.id, { progressShowValue: e.target.checked })}
                          className="rounded"
                        />
                        Hiện giá trị
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Màu thanh</label>
                        <input
                          type="color"
                          value={selectedElement.progressBarColor || '#22c55e'}
                          onChange={(e) => updateElement(selectedElement.id, { progressBarColor: e.target.value })}
                          className="w-full h-8 border border-border/60 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Màu nền thanh</label>
                        <input
                          type="color"
                          value={selectedElement.progressTrackColor || '#e5e7eb'}
                          onChange={(e) => updateElement(selectedElement.id, { progressTrackColor: e.target.value })}
                          className="w-full h-8 border border-border/60 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Cỡ chữ</label>
                      <input
                        type="number"
                        value={selectedElement.fontSize || 12}
                        onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Thuộc tính chung */}
                <div className="pt-4 mt-4 border-t border-border/60 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground">Vị trí & Kích thước</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">X</label>
                      <input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Y</label>
                      <input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Rộng</label>
                      <input
                        type="number"
                        min="1"
                        value={selectedElement.width}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateElement(selectedElement.id, { width: val });
                          }
                        }}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Cao</label>
                      <input
                        type="number"
                        min="1"
                        value={selectedElement.height}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateElement(selectedElement.id, { height: val });
                          }
                        }}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Xoay ({selectedElement.rotation}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedElement.rotation}
                      onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Độ mờ ({Math.round((selectedElement.opacity || 1) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(selectedElement.opacity || 1) * 100}
                      onChange={(e) => updateElement(selectedElement.id, { opacity: parseInt(e.target.value) / 100 })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Effects Panel - Using EffectsPanel Component */}
            {activeTab === 'effects' && (
              <EffectsPanel
                selectedElement={selectedElement}
                onUpdateElement={(updates) => {
                  if (selectedElement) {
                    updateElement(selectedElement.id, updates);
                  }
                }}
              />
            )}

            {/* Layers Panel - Using LayersPanel Component */}
            {activeTab === 'layers' && (
              <LayersPanel
                elements={elements}
                selectedElementIds={selectedElementIds}
                onSelectElements={setSelectedElementIds}
                onUpdateElement={updateElement}
                onReorderElements={reorderElements}
                onDeleteElements={deleteElements}
                onDuplicateElements={duplicateElements}
                onGroupElements={groupElements}
                onUngroupElements={ungroupElements}
              />
            )}

            {/* Element Library Panel */}
            {activeTab === 'elements' && (
              <ElementLibrary
                onSelectElement={handleSelectLibraryElement}
                className="h-full"
              />
            )}

            {/* History Panel */}
            {activeTab === 'history' && (
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    Lịch sử chỉnh sửa
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Theo dõi và điều hướng qua các thay đổi thiết kế
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                        historyIndex > 0
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-40'
                      }`}
                    >
                      <Undo2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Hoàn tác</span>
                    </button>
                    
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                        historyIndex < history.length - 1
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20'
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-40'
                      }`}
                    >
                      <Redo2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Làm lại</span>
                    </button>
                  </div>

                  {/* History Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Bước hiện tại</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {historyIndex + 1}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                      <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Tổng bước</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {history.length}
                      </div>
                    </div>
                  </div>

                  {/* History Timeline */}
                  <div className="bg-muted/30 rounded-xl border border-border/60 p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Dòng thời gian
                    </h4>
                    
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {history.map((state, index) => {
                        const isCurrent = index === historyIndex;
                        const isPast = index < historyIndex;
                        
                        let description = 'Trạng thái ban đầu';
                        if (index > 0) {
                          const prevState = history[index - 1];
                          const added = state.length - prevState.length;
                          const removed = prevState.length - state.length;
                          
                          if (added > 0) {
                            description = `Đã thêm ${added} phần tử`;
                          } else if (removed > 0) {
                            description = `Đã xóa ${removed} phần tử`;
                          } else {
                            description = `Đã sửa ${state.length} phần tử`;
                          }
                        }
                        
                        return (
                          <button
                            key={`history-${index}`}
                            onClick={() => {
                              setHistoryIndex(index);
                              setElements(state);
                            }}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                              isCurrent
                                ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                                : isPast
                                  ? 'bg-card hover:bg-muted'
                                  : 'bg-card hover:bg-muted opacity-50'
                            }`}
                          >
                            <div className={`relative mt-1 w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                              isCurrent
                                ? 'bg-blue-500 border-blue-500 ring-2 ring-blue-500/20'
                                : isPast
                                  ? 'bg-card border-foreground'
                                  : 'bg-card border-muted-foreground'
                            }`}>
                              {isCurrent && (
                                <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={`text-sm font-medium truncate ${
                                  isCurrent ? 'text-blue-600 dark:text-blue-400' : ''
                                }`}>
                                  {description}
                                </span>
                                {isCurrent && (
                                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">
                                    Hiện tại
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                Bước {index + 1} • {state.length} phần tử
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 rounded-xl p-4 border border-border/60">
                    <h4 className="text-sm font-medium mb-3">⌨️ Phím tắt</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Hoàn tác</span>
                        <kbd className="px-2 py-1 bg-background border border-border/60 rounded font-mono">
                          Ctrl+Z
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Làm lại</span>
                        <kbd className="px-2 py-1 bg-background border border-border/60 rounded font-mono">
                          Ctrl+Y
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Templates Panel */}
            {activeTab === 'templates' && (
              <div className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Mẫu chuyên nghiệp
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className="group relative aspect-[4/5] bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/60 hover:border-blue-500 hover:shadow-lg transition-all duration-200 overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {template.thumbnail}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-sm text-white font-medium">{template.name}</p>
                        <p className="text-xs text-white/70">{template.elements.length} phần tử • {template.category}</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    💡 <strong>Mẹo:</strong> Tất cả mẫu đều bao gồm gradient, bóng đổ và hiệu ứng hiện đại!
                  </p>
                </div>
              </div>
            )}

            {/* Canvas/Background Panel */}
            {activeTab === 'background' && (
              <div className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Cài đặt canvas
                </h3>
                
                <div className="space-y-4">
                  {/* Canvas Size */}
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Kích thước canvas</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-xs text-slate-500">Rộng</label>
                        <input
                          type="number"
                          value={canvasWidth}
                          onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 800)}
                          className="w-full px-2 py-1.5 border border-border/60 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Cao</label>
                        <input
                          type="number"
                          value={canvasHeight}
                          onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 1000)}
                          className="w-full px-2 py-1.5 border border-border/60 rounded text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCanvasSizeDialog(!showCanvasSizeDialog)}
                      className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                    >
                      Chọn kích thước có sẵn
                    </button>
                  </div>

                  <AdvancedColorPicker
                    color={canvasBackground}
                    onChange={setCanvasBackground}
                    label="Màu nền"
                  />

                  <div className="pt-3 border-t border-border/60 space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground">Cài đặt lưới</h4>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Hiện lưới</label>
                      <button
                        onClick={() => setShowGridLines(!showGridLines)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          showGridLines ? 'bg-blue-500' : 'bg-muted'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          showGridLines ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm">Bám lưới</label>
                      <button
                        onClick={() => setSnapToGrid(!snapToGrid)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          snapToGrid ? 'bg-blue-500' : 'bg-muted'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          snapToGrid ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Kích thước lưới ({gridSize}px)</label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={gridSize}
                        onChange={(e) => setGridSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Text Styles Panel */}
            {activeTab === 'styles' && (
              <div className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TypeIcon className="w-4 h-4" />
                  Mẫu kiểu chữ
                </h3>
                
                <TextStylePresets
                  onSelect={(style) => {
                    if (selectedElementIds.length > 0) {
                      selectedElementIds.forEach(id => {
                        const element = elements.find(el => el.id === id);
                        if (element && element.type === 'text') {
                          updateElement(id, {
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            lineHeight: style.lineHeight,
                            letterSpacing: style.letterSpacing,
                          });
                        }
                      });
                    } else {
                      // Create new text with this style
                      const newElement: InfographicElement = {
                        id: `el-${Date.now()}-${Math.random()}`,
                        type: 'text',
                        x: snapValue(100),
                        y: snapValue(100),
                        width: 300,
                        height: style.fontSize * style.lineHeight * 2,
                        rotation: 0,
                        locked: false,
                        visible: true,
                        zIndex: elements.length,
                        content: style.name,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight,
                        fontFamily: 'Inter',
                        lineHeight: style.lineHeight,
                        letterSpacing: style.letterSpacing,
                        textAlign: 'left',
                        color: '#000000',
                        backgroundColor: 'transparent',
                        opacity: 1,
                      };
                      addToHistory([...elements, newElement]);
                      setSelectedElementIds([newElement.id]);
                    }
                  }}
                  currentStyle={selectedElement?.type === 'text' ? {
                    fontSize: selectedElement.fontSize,
                    fontWeight: selectedElement.fontWeight,
                    lineHeight: selectedElement.lineHeight,
                    letterSpacing: selectedElement.letterSpacing,
                  } : undefined}
                />
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="font-semibold">Chọn biểu tượng</h3>
              <button
                onClick={() => setShowIconPicker(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-6 gap-3">
                {iconsList.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => {
                      if (selectedElement && selectedElement.type === 'icon') {
                        updateElement(selectedElement.id, { iconName: name });
                        setShowIconPicker(false);
                      } else {
                        addIcon(name);
                      }
                    }}
                    className="aspect-square p-4 rounded-xl border-2 border-border/60 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-200 flex items-center justify-center group"
                    title={name}
                  >
                    <Icon className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shape Library Modal */}
      {showShapeLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="font-semibold">Thư viện hình dạng</h3>
              <button
                onClick={() => setShowShapeLibrary(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-4 gap-3">
                {shapeLibrary.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (selectedElement && selectedElement.type === 'shape') {
                        updateElement(selectedElement.id, { shapeType: id as any });
                        setShowShapeLibrary(false);
                      } else {
                        addElement('shape', id);
                        setShowShapeLibrary(false);
                      }
                    }}
                    className="aspect-square p-4 rounded-xl border-2 border-border/60 hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                  >
                    <Icon className="w-10 h-10 text-muted-foreground group-hover:text-green-500 group-hover:scale-110 transition-all" />
                    <span className="text-xs text-muted-foreground group-hover:text-green-600">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-semibold">Mẫu chuyên nghiệp</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="group relative aspect-[4/5] bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-border/60 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {template.thumbnail}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-sm text-white font-medium mb-1">{template.name}</p>
                      <p className="text-xs text-white/70">{template.elements.length} phần tử • {template.category}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-blue-600">
                        Sử dụng mẫu
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Size Presets Dialog */}
      {showCanvasSizeDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50">
              <div>
                <h3 className="font-semibold">Kích thước canvas có sẵn</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hiện tại: {canvasWidth} × {canvasHeight}px
                </p>
              </div>
              <button
                onClick={() => setShowCanvasSizeDialog(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <CanvasSizePresets
                onSelect={(size) => {
                  setCanvasWidth(size.width);
                  setCanvasHeight(size.height);
                  setShowCanvasSizeDialog(false);
                }}
                currentWidth={canvasWidth}
                currentHeight={canvasHeight}
              />

              {/* Custom Size */}
              <div className="mt-6 pt-6 border-t border-border/60">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Kích thước tùy chỉnh</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-1.5 block">Rộng (px)</label>
                    <input
                      type="number"
                      value={canvasWidth}
                      onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 800)}
                      min="100"
                      max="5000"
                      className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1.5 block">Cao (px)</label>
                    <input
                      type="number"
                      value={canvasHeight}
                      onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 1000)}
                      min="100"
                      max="5000"
                      className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowCanvasSizeDialog(false)}
                  className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Áp dụng kích thước tùy chỉnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Dialog */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Phím tắt</h3>
              </div>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Chung
                  </h4>
                  <div className="space-y-2">
                    <ShortcutItem keys={['?']} description="Hiển thị trợ giúp này" />
                    <ShortcutItem keys={['Ctrl', 'Z']} description="Hoàn tác" />
                    <ShortcutItem keys={['Ctrl', 'Y']} description="Làm lại" />
                    <ShortcutItem keys={['Ctrl', 'S']} description="Lưu (Xuất)" />
                    <ShortcutItem keys={['Delete']} description="Xóa đã chọn" />
                  </div>
                </div>

                {/* Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Chọn
                  </h4>
                  <div className="space-y-2">
                    <ShortcutItem keys={['Ctrl', 'A']} description="Chọn tất cả" />
                    <ShortcutItem keys={['Shift', 'Click']} description="Bật/tắt chọn" />
                    <ShortcutItem keys={['Drag']} description="Khung chọn nhiều" />
                    <ShortcutItem keys={['Esc']} description="Bỏ chọn" />
                  </div>
                </div>

                {/* Edit */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa
                  </h4>
                  <div className="space-y-2">
                    <ShortcutItem keys={['Ctrl', 'C']} description="Sao chép" />
                    <ShortcutItem keys={['Ctrl', 'V']} description="Dán" />
                    <ShortcutItem keys={['Ctrl', 'D']} description="Nhân bản" />
                    <ShortcutItem keys={['Ctrl', 'G']} description="Nhóm phần tử" />
                    <ShortcutItem keys={['Ctrl', 'Shift', 'G']} description="Bỏ nhóm" />
                  </div>
                </div>

                {/* Layers */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Lớp
                  </h4>
                  <div className="space-y-2">
                    <ShortcutItem keys={['Ctrl', ']']} description="Đưa lên trước" />
                    <ShortcutItem keys={['Ctrl', '[']} description="Đưa ra sau" />
                    <ShortcutItem keys={['Ctrl', 'Shift', ']']} description="Đưa lên trên cùng" />
                    <ShortcutItem keys={['Ctrl', 'Shift', '[']} description="Đưa xuống dưới cùng" />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>Mẹo:</strong> Nhấp đúp vào phần tử văn bản để chỉnh sửa trực tiếp, và dùng khung chọn để chọn nhanh nhiều đối tượng!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shortcut Item Component
function ShortcutItem({ keys, description }: { keys: string[], description: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-600">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono shadow-sm">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="mx-1 text-slate-400">+</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
