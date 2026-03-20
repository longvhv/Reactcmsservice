// Extended types and data for Canva-style Infographic Builder

export interface BackgroundTemplate {
  id: string;
  name: string;
  category: 'solid' | 'gradient' | 'pattern';
  value: string;
  preview: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  theme: 'vibrant' | 'pastel' | 'dark' | 'monochrome' | 'nature' | 'warm' | 'cool';
}

export interface TextStylePreset {
  id: string;
  name: string;
  category: 'heading' | 'body' | 'quote' | 'caption' | 'title';
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  color: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface PhotoCategory {
  id: string;
  name: string;
  keywords: string[];
}

export interface CanvaTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements?: any[];
  canvasWidth?: number;
  canvasHeight?: number;
}

// Background Templates Library
export const backgroundTemplates: BackgroundTemplate[] = [
  // Solid Colors
  { id: 'bg-solid-white', name: 'White', category: 'solid', value: '#ffffff', preview: '#ffffff' },
  { id: 'bg-solid-black', name: 'Black', category: 'solid', value: '#000000', preview: '#000000' },
  { id: 'bg-solid-gray', name: 'Gray', category: 'solid', value: '#f3f4f6', preview: '#f3f4f6' },
  { id: 'bg-solid-blue', name: 'Blue', category: 'solid', value: '#3b82f6', preview: '#3b82f6' },
  { id: 'bg-solid-purple', name: 'Purple', category: 'solid', value: '#8b5cf6', preview: '#8b5cf6' },
  { id: 'bg-solid-pink', name: 'Pink', category: 'solid', value: '#ec4899', preview: '#ec4899' },
  { id: 'bg-solid-green', name: 'Green', category: 'solid', value: '#10b981', preview: '#10b981' },
  { id: 'bg-solid-yellow', name: 'Yellow', category: 'solid', value: '#fbbf24', preview: '#fbbf24' },
  { id: 'bg-solid-red', name: 'Red', category: 'solid', value: '#ef4444', preview: '#ef4444' },
  { id: 'bg-solid-indigo', name: 'Indigo', category: 'solid', value: '#6366f1', preview: '#6366f1' },
  { id: 'bg-solid-teal', name: 'Teal', category: 'solid', value: '#14b8a6', preview: '#14b8a6' },
  { id: 'bg-solid-orange', name: 'Orange', category: 'solid', value: '#f97316', preview: '#f97316' },
  
  // Gradients
  { id: 'bg-grad-sunset', name: 'Sunset', category: 'gradient', 
    value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', 
    preview: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
  { id: 'bg-grad-ocean', name: 'Ocean Blue', category: 'gradient', 
    value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
    preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'bg-grad-forest', name: 'Forest', category: 'gradient', 
    value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
    preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'bg-grad-purple', name: 'Purple Haze', category: 'gradient', 
    value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', 
    preview: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
  { id: 'bg-grad-fire', name: 'Fire', category: 'gradient', 
    value: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)', 
    preview: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)' },
  { id: 'bg-grad-ice', name: 'Ice', category: 'gradient', 
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'bg-grad-peach', name: 'Peach', category: 'gradient', 
    value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 'bg-grad-mint', name: 'Mint', category: 'gradient', 
    value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'bg-grad-aurora', name: 'Aurora', category: 'gradient', 
    value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', 
    preview: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
  { id: 'bg-grad-rose', name: 'Rose', category: 'gradient', 
    value: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)', 
    preview: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' },
  
  // Patterns would require SVG patterns - simplified for now
  { id: 'bg-pattern-dots', name: 'Dots', category: 'pattern', 
    value: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', 
    preview: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)' },
  { id: 'bg-pattern-grid', name: 'Grid', category: 'pattern', 
    value: 'linear-gradient(90deg, #e5e7eb 1px, transparent 1px), linear-gradient(#e5e7eb 1px, transparent 1px)', 
    preview: '#f9fafb' },
];

// Color Palettes
export const colorPalettes: ColorPalette[] = [
  { id: 'pal-vibrant', name: 'Vibrant Pop', theme: 'vibrant', 
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'] },
  { id: 'pal-pastel', name: 'Pastel Dream', theme: 'pastel', 
    colors: ['#bfdbfe', '#ddd6fe', '#fbcfe8', '#fde68a', '#a7f3d0'] },
  { id: 'pal-dark', name: 'Dark Mode', theme: 'dark', 
    colors: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'] },
  { id: 'pal-mono', name: 'Monochrome', theme: 'monochrome', 
    colors: ['#000000', '#404040', '#808080', '#c0c0c0', '#ffffff'] },
  { id: 'pal-nature', name: 'Nature', theme: 'nature', 
    colors: ['#065f46', '#047857', '#10b981', '#34d399', '#6ee7b7'] },
  { id: 'pal-warm', name: 'Warm Sunset', theme: 'warm', 
    colors: ['#dc2626', '#ea580c', '#f59e0b', '#fbbf24', '#fef08a'] },
  { id: 'pal-cool', name: 'Cool Breeze', theme: 'cool', 
    colors: ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'] },
  { id: 'pal-corporate', name: 'Corporate', theme: 'monochrome', 
    colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'] },
  { id: 'pal-autumn', name: 'Autumn', theme: 'warm', 
    colors: ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b'] },
  { id: 'pal-ocean', name: 'Ocean Deep', theme: 'cool', 
    colors: ['#164e63', '#0e7490', '#0891b2', '#06b6d4', '#22d3ee'] },
  { id: 'pal-sunset', name: 'Sunset Glow', theme: 'warm', 
    colors: ['#991b1b', '#dc2626', '#f87171', '#fca5a5', '#fecaca'] },
  { id: 'pal-spring', name: 'Spring Bloom', theme: 'nature', 
    colors: ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80'] },
];

// Text Style Presets
export const textStylePresets: TextStylePreset[] = [
  // Headings
  { id: 'text-h1', name: 'Heading 1', category: 'heading', 
    fontSize: 64, fontWeight: 'bold', fontFamily: 'Inter', color: '#1e293b', lineHeight: 1.2, textAlign: 'center' },
  { id: 'text-h2', name: 'Heading 2', category: 'heading', 
    fontSize: 48, fontWeight: 'bold', fontFamily: 'Inter', color: '#1e293b', lineHeight: 1.3, textAlign: 'center' },
  { id: 'text-h3', name: 'Heading 3', category: 'heading', 
    fontSize: 36, fontWeight: '600', fontFamily: 'Inter', color: '#334155', lineHeight: 1.4 },
  { id: 'text-h4', name: 'Heading 4', category: 'heading', 
    fontSize: 28, fontWeight: '600', fontFamily: 'Inter', color: '#334155', lineHeight: 1.4 },
  
  // Titles
  { id: 'text-title-hero', name: 'Hero Title', category: 'title', 
    fontSize: 72, fontWeight: 'bold', fontFamily: 'Inter', color: '#000000', lineHeight: 1.1, letterSpacing: -1, textAlign: 'center' },
  { id: 'text-title-display', name: 'Display Title', category: 'title', 
    fontSize: 56, fontWeight: 'bold', fontFamily: 'Inter', color: '#1e293b', lineHeight: 1.2, textAlign: 'center' },
  
  // Body
  { id: 'text-body-large', name: 'Body Large', category: 'body', 
    fontSize: 20, fontWeight: 'normal', fontFamily: 'Inter', color: '#475569', lineHeight: 1.6 },
  { id: 'text-body-regular', name: 'Body Regular', category: 'body', 
    fontSize: 16, fontWeight: 'normal', fontFamily: 'Inter', color: '#475569', lineHeight: 1.6 },
  { id: 'text-body-small', name: 'Body Small', category: 'body', 
    fontSize: 14, fontWeight: 'normal', fontFamily: 'Inter', color: '#64748b', lineHeight: 1.5 },
  
  // Quotes
  { id: 'text-quote-large', name: 'Quote Large', category: 'quote', 
    fontSize: 32, fontWeight: '500', fontFamily: 'Inter', color: '#334155', lineHeight: 1.5, textAlign: 'center' },
  { id: 'text-quote-regular', name: 'Quote', category: 'quote', 
    fontSize: 24, fontWeight: '500', fontFamily: 'Inter', color: '#475569', lineHeight: 1.6 },
  
  // Captions
  { id: 'text-caption', name: 'Caption', category: 'caption', 
    fontSize: 12, fontWeight: 'normal', fontFamily: 'Inter', color: '#64748b', lineHeight: 1.4 },
  { id: 'text-label', name: 'Label', category: 'caption', 
    fontSize: 14, fontWeight: '600', fontFamily: 'Inter', color: '#1e293b', lineHeight: 1.3, letterSpacing: 0.5 },
];

// Photo Categories for search
export const photoCategories: PhotoCategory[] = [
  { id: 'cat-business', name: 'Business', keywords: ['office', 'meeting', 'workplace', 'professional'] },
  { id: 'cat-nature', name: 'Nature', keywords: ['landscape', 'forest', 'mountain', 'ocean', 'sky'] },
  { id: 'cat-tech', name: 'Technology', keywords: ['computer', 'phone', 'digital', 'tech', 'code'] },
  { id: 'cat-people', name: 'People', keywords: ['person', 'team', 'group', 'portrait', 'community'] },
  { id: 'cat-abstract', name: 'Abstract', keywords: ['pattern', 'texture', 'geometric', 'colorful'] },
  { id: 'cat-food', name: 'Food', keywords: ['food', 'meal', 'cooking', 'restaurant'] },
  { id: 'cat-travel', name: 'Travel', keywords: ['travel', 'city', 'destination', 'adventure'] },
  { id: 'cat-health', name: 'Health', keywords: ['fitness', 'wellness', 'health', 'exercise'] },
];

// Template categories
export const templateCategories = [
  { id: 'all', name: 'All Templates', icon: 'Layout' },
  { id: 'business', name: 'Business', icon: 'Briefcase' },
  { id: 'social', name: 'Social Media', icon: 'Share2' },
  { id: 'presentation', name: 'Presentation', icon: 'Monitor' },
  { id: 'infographic', name: 'Infographic', icon: 'BarChart3' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp' },
  { id: 'education', name: 'Education', icon: 'BookOpen' },
];

// Canva Templates
export const canvaTemplates: CanvaTemplate[] = [
  {
    id: 'tpl-social-1',
    name: 'Instagram Post - Vibrant',
    category: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    canvasWidth: 1080,
    canvasHeight: 1080,
  },
  {
    id: 'tpl-social-2',
    name: 'Instagram Story - Minimal',
    category: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop',
    canvasWidth: 1080,
    canvasHeight: 1920,
  },
  {
    id: 'tpl-business-1',
    name: 'Business Card',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop',
    canvasWidth: 1050,
    canvasHeight: 600,
  },
  {
    id: 'tpl-presentation-1',
    name: 'Presentation Slide - Modern',
    category: 'presentation',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    canvasWidth: 1920,
    canvasHeight: 1080,
  },
  {
    id: 'tpl-marketing-1',
    name: 'Email Header',
    category: 'marketing',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
    canvasWidth: 600,
    canvasHeight: 300,
  },
  {
    id: 'tpl-infographic-1',
    name: 'Data Infographic',
    category: 'infographic',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=800&fit=crop',
    canvasWidth: 800,
    canvasHeight: 1600,
  },
  {
    id: 'tpl-social-3',
    name: 'Facebook Cover',
    category: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=300&fit=crop',
    canvasWidth: 820,
    canvasHeight: 312,
  },
  {
    id: 'tpl-social-4',
    name: 'Twitter Header',
    category: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=200&fit=crop',
    canvasWidth: 1500,
    canvasHeight: 500,
  },
  {
    id: 'tpl-document-1',
    name: 'A4 Flyer',
    category: 'all',
    thumbnail: 'https://images.unsplash.com/photo-1586281380426-f644b93ab23e?w=400&h=560&fit=crop',
    canvasWidth: 2480,
    canvasHeight: 3508,
  },
  {
    id: 'tpl-video-1',
    name: 'YouTube Thumbnail',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=350&fit=crop',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  {
    id: 'tpl-marketing-2',
    name: 'Banner Ad',
    category: 'marketing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=200&fit=crop',
    canvasWidth: 728,
    canvasHeight: 90,
  },
  {
    id: 'tpl-presentation-2',
    name: 'Slide Deck Cover',
    category: 'presentation',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
    canvasWidth: 1920,
    canvasHeight: 1080,
  },
];