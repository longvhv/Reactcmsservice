import { useState } from 'react';
import { 
  Search, X, Star, Heart, Zap, Target, Award, Bookmark, Flag, Tag,
  Circle, Square, Triangle, Hexagon, Diamond, Pentagon, Octagon,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, TrendingUp, TrendingDown,
  MessageCircle, Mail, Phone, MapPin, Calendar, Clock, Users, ShoppingCart,
  DollarSign, Globe, Send, Smile, ThumbsUp, Check, AlertCircle, Info,
  Upload, Download, Share2, Bell, Settings, Menu, Grid, Filter,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Plus, Minus,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Github,
  Home, Briefcase, GraduationCap, Coffee, Music, Camera, Film, Palette,
  Book, FileText, Image, Video, Headphones, Mic, Radio, Tv,
  Wifi, Bluetooth, Battery, Cloud, Sun, Moon, CloudRain, CloudSnow,
  Umbrella, Wind, Thermometer, Droplet, Leaf, Flower, Tree, Sprout,
  Gift, ShoppingBag, CreditCard, Wallet, TrendingUpIcon, BarChart3, PieChart,
  Activity, Cpu, HardDrive, Smartphone, Tablet, Monitor, Laptop, Watch
} from 'lucide-react';

export interface ElementLibraryItem {
  id: string;
  category: string;
  name: string;
  type: 'icon' | 'shape' | 'decorative' | 'frame' | 'sticker';
  preview: React.ReactNode;
  data: {
    type: 'icon' | 'shape' | 'custom-shape';
    iconName?: string;
    shapeType?: string;
    customPoints?: { x: number; y: number }[];
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    width?: number;
    height?: number;
  };
}

// Pre-made decorative shapes using custom SVG paths
const decorativeShapes: ElementLibraryItem[] = [
  {
    id: 'ribbon-1',
    category: 'Decorative',
    name: 'Ribbon Banner',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path 
          d="M 10,20 L 0,10 L 0,30 L 10,20 L 90,20 L 100,10 L 100,30 L 90,20" 
          fill="currentColor" 
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.1, y: 0.5 }, { x: 0, y: 0.25 }, { x: 0, y: 0.75 },
        { x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }, { x: 1, y: 0.25 },
        { x: 1, y: 0.75 }, { x: 0.9, y: 0.5 }
      ],
      color: '#667eea',
      width: 300,
      height: 80
    }
  },
  {
    id: 'badge-circle',
    category: 'Decorative',
    name: 'Badge Circle',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.2" />
        <circle cx="50" cy="50" r="35" fill="currentColor" />
        <path 
          d="M 50,15 L 55,30 L 70,30 L 58,40 L 63,55 L 50,45 L 37,55 L 42,40 L 30,30 L 45,30 Z" 
          fill="white" 
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.5, y: 0 }, { x: 0.6, y: 0.3 }, { x: 0.9, y: 0.3 },
        { x: 0.68, y: 0.5 }, { x: 0.78, y: 0.8 }, { x: 0.5, y: 0.62 },
        { x: 0.22, y: 0.8 }, { x: 0.32, y: 0.5 }, { x: 0.1, y: 0.3 },
        { x: 0.4, y: 0.3 }
      ],
      color: '#fbbf24',
      width: 120,
      height: 120
    }
  },
  {
    id: 'corner-ribbon',
    category: 'Decorative',
    name: 'Corner Ribbon',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path 
          d="M 0,0 L 100,0 L 100,25 L 50,50 L 0,25 Z" 
          fill="currentColor" 
        />
        <path 
          d="M 100,0 L 100,100 L 75,100 L 50,50 L 100,25 Z" 
          fill="currentColor" 
          opacity="0.7"
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0.25 },
        { x: 0.5, y: 0.5 }, { x: 0, y: 0.25 }
      ],
      color: '#ef4444',
      width: 150,
      height: 150
    }
  },
  {
    id: 'speech-bubble',
    category: 'Decorative',
    name: 'Speech Bubble',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <rect x="10" y="10" width="80" height="50" rx="10" fill="currentColor" />
        <path d="M 30,60 L 35,75 L 45,60 Z" fill="currentColor" />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.1, y: 0.125 }, { x: 0.9, y: 0.125 }, { x: 0.9, y: 0.75 },
        { x: 0.45, y: 0.75 }, { x: 0.35, y: 0.9375 }, { x: 0.3, y: 0.75 },
        { x: 0.1, y: 0.75 }
      ],
      color: '#10b981',
      borderRadius: 12,
      width: 200,
      height: 120
    }
  },
  {
    id: 'burst-star',
    category: 'Decorative',
    name: 'Burst Star',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const x1 = 50 + Math.cos(angle) * 20;
          const y1 = 50 + Math.sin(angle) * 20;
          const x2 = 50 + Math.cos(angle) * 45;
          const y2 = 50 + Math.sin(angle) * 45;
          return (
            <line 
              key={i} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="currentColor" 
              strokeWidth="8"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI) / 8;
        const radius = i % 2 === 0 ? 0.2 : 0.45;
        return {
          x: 0.5 + Math.cos(angle) * radius,
          y: 0.5 + Math.sin(angle) * radius
        };
      }),
      color: '#f59e0b',
      width: 100,
      height: 100
    }
  },
  {
    id: 'arrow-callout',
    category: 'Decorative',
    name: 'Arrow Callout',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 120 60" className="w-full h-full">
        <rect x="10" y="10" width="80" height="40" rx="8" fill="currentColor" />
        <path d="M 90,30 L 110,20 L 110,40 Z" fill="currentColor" />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.083, y: 0.167 }, { x: 0.75, y: 0.167 }, { x: 0.75, y: 0.333 },
        { x: 0.917, y: 0.333 }, { x: 0.917, y: 0.667 }, { x: 0.75, y: 0.667 },
        { x: 0.75, y: 0.833 }, { x: 0.083, y: 0.833 }
      ],
      color: '#8b5cf6',
      borderRadius: 8,
      width: 240,
      height: 100
    }
  },
  {
    id: 'price-tag',
    category: 'Decorative',
    name: 'Price Tag',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path 
          d="M 10,10 L 60,10 L 90,50 L 60,90 L 10,90 Z" 
          fill="currentColor" 
        />
        <circle cx="30" cy="50" r="8" fill="white" />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.1, y: 0.1 }, { x: 0.6, y: 0.1 }, { x: 0.9, y: 0.5 },
        { x: 0.6, y: 0.9 }, { x: 0.1, y: 0.9 }
      ],
      color: '#ec4899',
      width: 120,
      height: 120
    }
  },
  {
    id: 'shield-badge',
    category: 'Decorative',
    name: 'Shield Badge',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <path 
          d="M 50,10 L 90,30 L 90,60 C 90,90 50,110 50,110 C 50,110 10,90 10,60 L 10,30 Z" 
          fill="currentColor" 
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.5, y: 0.083 }, { x: 0.9, y: 0.25 }, { x: 0.9, y: 0.5 },
        { x: 0.9, y: 0.75 }, { x: 0.5, y: 0.917 }, { x: 0.1, y: 0.75 },
        { x: 0.1, y: 0.5 }, { x: 0.1, y: 0.25 }
      ],
      color: '#3b82f6',
      width: 100,
      height: 120
    }
  },
  {
    id: 'bookmark-ribbon',
    category: 'Decorative',
    name: 'Bookmark',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 80 120" className="w-full h-full">
        <path 
          d="M 10,10 L 70,10 L 70,110 L 40,90 L 10,110 Z" 
          fill="currentColor" 
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.125, y: 0.083 }, { x: 0.875, y: 0.083 }, { x: 0.875, y: 0.917 },
        { x: 0.5, y: 0.75 }, { x: 0.125, y: 0.917 }
      ],
      color: '#14b8a6',
      width: 80,
      height: 140
    }
  },
  {
    id: 'wave-divider',
    category: 'Decorative',
    name: 'Wave Divider',
    type: 'decorative',
    preview: (
      <svg viewBox="0 0 200 40" className="w-full h-full">
        <path 
          d="M 0,20 Q 50,5 100,20 T 200,20 L 200,40 L 0,40 Z" 
          fill="currentColor" 
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0, y: 0.5 }, { x: 0.25, y: 0.125 }, { x: 0.5, y: 0.5 },
        { x: 0.75, y: 0.875 }, { x: 1, y: 0.5 }, { x: 1, y: 1 },
        { x: 0, y: 1 }
      ],
      color: '#06b6d4',
      width: 400,
      height: 80
    }
  }
];

// Icon library with categories
const iconLibrary: ElementLibraryItem[] = [
  // Social Media Icons
  { id: 'icon-facebook', category: 'Social', name: 'Facebook', type: 'icon', preview: <Facebook className="w-full h-full" />, data: { type: 'icon', iconName: 'Facebook', color: '#1877f2', width: 48, height: 48 } },
  { id: 'icon-twitter', category: 'Social', name: 'Twitter', type: 'icon', preview: <Twitter className="w-full h-full" />, data: { type: 'icon', iconName: 'Twitter', color: '#1da1f2', width: 48, height: 48 } },
  { id: 'icon-instagram', category: 'Social', name: 'Instagram', type: 'icon', preview: <Instagram className="w-full h-full" />, data: { type: 'icon', iconName: 'Instagram', color: '#e4405f', width: 48, height: 48 } },
  { id: 'icon-linkedin', category: 'Social', name: 'LinkedIn', type: 'icon', preview: <Linkedin className="w-full h-full" />, data: { type: 'icon', iconName: 'Linkedin', color: '#0a66c2', width: 48, height: 48 } },
  { id: 'icon-youtube', category: 'Social', name: 'YouTube', type: 'icon', preview: <Youtube className="w-full h-full" />, data: { type: 'icon', iconName: 'Youtube', color: '#ff0000', width: 48, height: 48 } },
  { id: 'icon-github', category: 'Social', name: 'GitHub', type: 'icon', preview: <Github className="w-full h-full" />, data: { type: 'icon', iconName: 'Github', color: '#181717', width: 48, height: 48 } },
  
  // Business Icons
  { id: 'icon-briefcase', category: 'Business', name: 'Briefcase', type: 'icon', preview: <Briefcase className="w-full h-full" />, data: { type: 'icon', iconName: 'Briefcase', color: '#4f46e5', width: 48, height: 48 } },
  { id: 'icon-dollar', category: 'Business', name: 'Dollar', type: 'icon', preview: <DollarSign className="w-full h-full" />, data: { type: 'icon', iconName: 'DollarSign', color: '#10b981', width: 48, height: 48 } },
  { id: 'icon-chart', category: 'Business', name: 'Chart', type: 'icon', preview: <BarChart3 className="w-full h-full" />, data: { type: 'icon', iconName: 'BarChart3', color: '#8b5cf6', width: 48, height: 48 } },
  { id: 'icon-trending', category: 'Business', name: 'Xu hướng tăng', type: 'icon', preview: <TrendingUp className="w-full h-full" />, data: { type: 'icon', iconName: 'TrendingUp', color: '#059669', width: 48, height: 48 } },
  { id: 'icon-target', category: 'Business', name: 'Target', type: 'icon', preview: <Target className="w-full h-full" />, data: { type: 'icon', iconName: 'Target', color: '#ef4444', width: 48, height: 48 } },
  { id: 'icon-award', category: 'Business', name: 'Award', type: 'icon', preview: <Award className="w-full h-full" />, data: { type: 'icon', iconName: 'Award', color: '#f59e0b', width: 48, height: 48 } },
  
  // Communication Icons
  { id: 'icon-mail', category: 'Communication', name: 'Mail', type: 'icon', preview: <Mail className="w-full h-full" />, data: { type: 'icon', iconName: 'Mail', color: '#3b82f6', width: 48, height: 48 } },
  { id: 'icon-phone', category: 'Communication', name: 'Phone', type: 'icon', preview: <Phone className="w-full h-full" />, data: { type: 'icon', iconName: 'Phone', color: '#10b981', width: 48, height: 48 } },
  { id: 'icon-message', category: 'Communication', name: 'Message', type: 'icon', preview: <MessageCircle className="w-full h-full" />, data: { type: 'icon', iconName: 'MessageCircle', color: '#8b5cf6', width: 48, height: 48 } },
  { id: 'icon-send', category: 'Communication', name: 'Send', type: 'icon', preview: <Send className="w-full h-full" />, data: { type: 'icon', iconName: 'Send', color: '#06b6d4', width: 48, height: 48 } },
  
  // UI/UX Icons
  { id: 'icon-check', category: 'UI', name: 'Check', type: 'icon', preview: <Check className="w-full h-full" />, data: { type: 'icon', iconName: 'Check', color: '#10b981', width: 48, height: 48 } },
  { id: 'icon-alert', category: 'UI', name: 'Alert', type: 'icon', preview: <AlertCircle className="w-full h-full" />, data: { type: 'icon', iconName: 'AlertCircle', color: '#f59e0b', width: 48, height: 48 } },
  { id: 'icon-info', category: 'UI', name: 'Info', type: 'icon', preview: <Info className="w-full h-full" />, data: { type: 'icon', iconName: 'Info', color: '#3b82f6', width: 48, height: 48 } },
  { id: 'icon-star', category: 'UI', name: 'Star', type: 'icon', preview: <Star className="w-full h-full" />, data: { type: 'icon', iconName: 'Star', color: '#fbbf24', width: 48, height: 48 } },
  { id: 'icon-heart', category: 'UI', name: 'Heart', type: 'icon', preview: <Heart className="w-full h-full" />, data: { type: 'icon', iconName: 'Heart', color: '#ef4444', width: 48, height: 48 } },
  { id: 'icon-zap', category: 'UI', name: 'Zap', type: 'icon', preview: <Zap className="w-full h-full" />, data: { type: 'icon', iconName: 'Zap', color: '#eab308', width: 48, height: 48 } },
  
  // Location & Time
  { id: 'icon-map-pin', category: 'Location', name: 'Ghim bản đồ', type: 'icon', preview: <MapPin className="w-full h-full" />, data: { type: 'icon', iconName: 'MapPin', color: '#ef4444', width: 48, height: 48 } },
  { id: 'icon-calendar', category: 'Time', name: 'Calendar', type: 'icon', preview: <Calendar className="w-full h-full" />, data: { type: 'icon', iconName: 'Calendar', color: '#3b82f6', width: 48, height: 48 } },
  { id: 'icon-clock', category: 'Time', name: 'Clock', type: 'icon', preview: <Clock className="w-full h-full" />, data: { type: 'icon', iconName: 'Clock', color: '#8b5cf6', width: 48, height: 48 } },
  
  // People & Shopping
  { id: 'icon-users', category: 'People', name: 'Users', type: 'icon', preview: <Users className="w-full h-full" />, data: { type: 'icon', iconName: 'Users', color: '#6366f1', width: 48, height: 48 } },
  { id: 'icon-cart', category: 'Shopping', name: 'Cart', type: 'icon', preview: <ShoppingCart className="w-full h-full" />, data: { type: 'icon', iconName: 'ShoppingCart', color: '#ec4899', width: 48, height: 48 } },
  { id: 'icon-bag', category: 'Shopping', name: 'Túi mua sắm', type: 'icon', preview: <ShoppingBag className="w-full h-full" />, data: { type: 'icon', iconName: 'ShoppingBag', color: '#f97316', width: 48, height: 48 } },
  
  // Education & Creative
  { id: 'icon-graduation', category: 'Education', name: 'Graduation', type: 'icon', preview: <GraduationCap className="w-full h-full" />, data: { type: 'icon', iconName: 'GraduationCap', color: '#7c3aed', width: 48, height: 48 } },
  { id: 'icon-book', category: 'Education', name: 'Book', type: 'icon', preview: <Book className="w-full h-full" />, data: { type: 'icon', iconName: 'Book', color: '#0891b2', width: 48, height: 48 } },
  { id: 'icon-palette', category: 'Creative', name: 'Palette', type: 'icon', preview: <Palette className="w-full h-full" />, data: { type: 'icon', iconName: 'Palette', color: '#ec4899', width: 48, height: 48 } },
  { id: 'icon-camera', category: 'Creative', name: 'Camera', type: 'icon', preview: <Camera className="w-full h-full" />, data: { type: 'icon', iconName: 'Camera', color: '#6366f1', width: 48, height: 48 } },
];

// Sticker elements (fun decorative items)
const stickerLibrary: ElementLibraryItem[] = [
  {
    id: 'sticker-arrow-1',
    category: 'Arrows',
    name: 'Mũi tên cong',
    type: 'sticker',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path 
          d="M 20,80 Q 50,20 80,80" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M 80,80 L 70,70 L 90,75 Z" fill="currentColor" />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.2, y: 0.8 }, { x: 0.5, y: 0.2 }, { x: 0.8, y: 0.8 }
      ],
      color: '#ef4444',
      width: 150,
      height: 150
    }
  },
  {
    id: 'sticker-doodle-circle',
    category: 'Doodles',
    name: 'Vòng tròn nguệch ngoạc',
    type: 'sticker',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="4"
          strokeDasharray="5,3"
        />
      </svg>
    ),
    data: {
      type: 'shape',
      shapeType: 'circle',
      color: 'transparent',
      borderWidth: 4,
      borderColor: '#8b5cf6',
      width: 100,
      height: 100
    }
  },
  {
    id: 'sticker-underline',
    category: 'Doodles',
    name: 'Hand-drawn Underline',
    type: 'sticker',
    preview: (
      <svg viewBox="0 0 200 20" className="w-full h-full">
        <path 
          d="M 10,10 Q 50,5 100,10 T 190,10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    data: {
      type: 'custom-shape',
      customPoints: [
        { x: 0.05, y: 0.5 }, { x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 },
        { x: 0.75, y: 0.75 }, { x: 0.95, y: 0.5 }
      ],
      color: '#f59e0b',
      width: 300,
      height: 30
    }
  }
];

// Frame elements
const frameLibrary: ElementLibraryItem[] = [
  {
    id: 'frame-classic',
    category: 'Frames',
    name: 'Khung cổ điển',
    type: 'frame',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke="currentColor" strokeWidth="8" />
        <rect x="5" y="5" width="90" height="90" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    data: {
      type: 'shape',
      shapeType: 'rounded-rect',
      color: 'transparent',
      borderWidth: 8,
      borderColor: '#1f2937',
      borderRadius: 8,
      width: 300,
      height: 300
    }
  },
  {
    id: 'frame-polaroid',
    category: 'Frames',
    name: 'Khung Polaroid',
    type: 'frame',
    preview: (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <rect x="10" y="10" width="80" height="100" fill="white" stroke="currentColor" strokeWidth="2" />
        <rect x="15" y="15" width="70" height="70" fill="#f3f4f6" />
      </svg>
    ),
    data: {
      type: 'shape',
      shapeType: 'rectangle',
      color: '#ffffff',
      borderWidth: 12,
      borderColor: '#e5e7eb',
      width: 250,
      height: 300
    }
  },
  {
    id: 'frame-rounded',
    category: 'Frames',
    name: 'Khung bo tròn',
    type: 'frame',
    preview: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="10" width="80" height="80" rx="20" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>
    ),
    data: {
      type: 'shape',
      shapeType: 'rounded-rect',
      color: 'transparent',
      borderWidth: 6,
      borderColor: '#6366f1',
      borderRadius: 40,
      width: 300,
      height: 300
    }
  }
];

interface ElementLibraryProps {
  onSelectElement: (item: ElementLibraryItem) => void;
  className?: string;
}

export function ElementLibrary({ onSelectElement, className = '' }: ElementLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Combine all libraries
  const allElements = [
    ...decorativeShapes,
    ...iconLibrary,
    ...stickerLibrary,
    ...frameLibrary
  ];

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(allElements.map(el => el.category)))];

  // Filter elements
  const filteredElements = allElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || element.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold mb-3">Thư viện phần tử</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm phần tử..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredElements.map(element => (
            <button
              key={element.id}
              onClick={() => onSelectElement(element)}
              className="group relative aspect-square border border-border/50 rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all overflow-hidden"
              title={element.name}
            >
              <div className="absolute inset-2 flex items-center justify-center text-foreground/70 group-hover:text-primary transition-colors">
                {element.preview}
              </div>
              
              {/* Hover overlay with name */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs text-center px-2">
                  {element.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredElements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">Không tìm thấy phần tử</p>
            <p className="text-xs">Thử tìm kiếm hoặc danh mục khác</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border/50 text-xs text-muted-foreground text-center">
        {filteredElements.length} phần tử có sẵn
      </div>
    </div>
  );
}

export { decorativeShapes, iconLibrary, stickerLibrary, frameLibrary };