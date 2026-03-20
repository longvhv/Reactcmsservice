import { useState, useRef, useEffect } from 'react';
import { X, Save, Eye, Sparkles, Languages, CheckCircle, ImagePlus, Video, FileText, Briefcase, Mic, Calendar, FolderTree, Tag, Upload, Link, Bold, Italic, List, Code, Heading, Quote, Image as ImageIcon, Maximize2, Minimize2, Clock, Globe, ChevronDown, Plus, Search, Wand2, AlignLeft, GripVertical, Trash2, Edit2, User, BarChart3, MapPin, ExternalLink, Users, Download, FileCheck, Scale, Megaphone, MoreHorizontal, FileType, HelpCircle, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { InfographicBuilder } from './InfographicBuilderV2';
import { GalleryImageEditor } from './GalleryImageEditor';
import { mockArticles } from '../utils/mockData';
import { newsTemplates, getTemplatesByCategory, getCategories, getTemplateById } from '../utils/newsTemplates';
import { RelatedArticlesPicker } from './RelatedArticlesPicker';
import { getArticle, createArticle, updateArticle } from '../services/api';
import { ContentSectionEditor } from '../src/modules/articles/components/ContentSectionEditor';
import { SectionPreviewRenderer } from '../src/modules/articles/components/sections/renderers/SectionPreviewRenderer';
import type { ContentSection } from '../src/types/content-section';
import { htmlToSections, sectionsToHtml } from '../src/modules/articles/sections/index';

interface ArticleEditorProps {
  articleId?: number;
  onClose: () => void;
  onSave: (data: any, saveAndContinue?: boolean) => void;
}

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  file?: File;
  // 🆕 Professional Gallery Metadata
  alt?: string;
  photographer?: string;
  location?: string;
  dateTaken?: string;
  tags?: string[];
  isCover?: boolean;
  dimensions?: { width: number; height: number };
  fileSize?: number;
  exifData?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
  };
}

// 🆕 Gallery Layout Options
interface GallerySettings {
  layout: 'grid' | 'masonry' | 'carousel' | 'justified';
  columns: 2 | 3 | 4;
  spacing: 'compact' | 'normal' | 'relaxed';
  enableLightbox: boolean;
  showCaptions: boolean;
  showExif: boolean;
  enableWatermark: boolean;
  watermarkText?: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

interface VideoData {
  sourceType: 'upload' | 'youtube' | 'vimeo' | 'url';
  url: string;
  file?: File;
  duration: { hours: number; minutes: number; seconds: number };
  thumbnail: string;
  thumbnailFile?: File;
  quality: '720p' | '1080p' | '4k';
  // 🆕 Summary thay vì transcript
  summary: string;
  // 🆕 Auto-generated thumbnails
  autoThumbnails?: string[]; // Array of thumbnail URLs at different timestamps
  selectedThumbnailIndex?: number;
  // 🆕 Compression settings
  compression?: {
    enabled: boolean;
    targetQuality: 'low' | 'medium' | 'high' | 'original';
    targetFormat: 'mp4' | 'webm' | 'original';
    targetSize?: number; // in MB
    estimatedSize?: number;
  };
}

export function ArticleEditor({ articleId, onClose, onSave }: ArticleEditorProps) {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [articleType, setArticleType] = useState('news');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [overflowMenuPos, setOverflowMenuPos] = useState({ top: 0, right: 0 });
  const [visibleTypesCount, setVisibleTypesCount] = useState(6);
  const typesSelectorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Công nghệ']);
  const [tags, setTags] = useState<string[]>(['CMS', 'Tutorial']);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAiTools, setShowAiTools] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState('Nguyễn Văn A');
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  
  // 🆕 Multi-section content (Block Editor only)
  const [contentMode] = useState<'sections'>('sections');
  const [sections, setSections] = useState<ContentSection[]>([{
    id: crypto.randomUUID(),
    type: 'html',
    order: 0,
    isVisible: true,
    spacing: 'medium',
    content: '',
  } as ContentSection]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 🆕 Slug (Đường dẫn đẹp)
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  
  // 🆕 News specific
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [newsSource, setNewsSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isBreakingNews, setIsBreakingNews] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<number[]>([]);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  
  // 🆕 Advanced News Features
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [coAuthors, setCoAuthors] = useState<string[]>([]);
  const [publishSchedule, setPublishSchedule] = useState<Date | null>(null);
  const [showSEOPanel, setShowSEOPanel] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  // 🆕 Ultra Advanced Features
  const [showContentQuality, setShowContentQuality] = useState(false);
  const [showRelatedArticles, setShowRelatedArticles] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedRelatedArticles, setSelectedRelatedArticles] = useState<number[]>([]);
  const [contentQualityScore, setContentQualityScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [showQuickInsert, setShowQuickInsert] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [templateSearch, setTemplateSearch] = useState('');
  
  // Gallery specific
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [editingCaptionId, setEditingCaptionId] = useState<number | null>(null);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<number | null>(null);
  const [showGallerySettings, setShowGallerySettings] = useState(false);
  const [showBulkCaptionEditor, setShowBulkCaptionEditor] = useState(false);
  const [bulkCaptionTemplate, setBulkCaptionTemplate] = useState('');
  
  // 🆕 Image Editor States
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageFilters, setImageFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
  });
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspectRatio: 'free' as 'free' | '16:9' | '4:3' | '1:1' | '9:16',
  });
  const [showCropTool, setShowCropTool] = useState(false);
  const [generatingAICaption, setGeneratingAICaption] = useState(false);
  
  const [gallerySettings, setGallerySettings] = useState<GallerySettings>({
    layout: 'grid',
    columns: 3,
    spacing: 'normal',
    enableLightbox: true,
    showCaptions: true,
    showExif: false,
    enableWatermark: false,
    watermarkText: '',
    watermarkPosition: 'bottom-right',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryPickerRef = useRef<HTMLDivElement>(null);

  // Infographic specific
  const [infographicElements, setInfographicElements] = useState<any[]>([]);
  const [showInfographicEditor, setShowInfographicEditor] = useState(false);

  // Video specific
  const [videoData, setVideoData] = useState<VideoData>({
    sourceType: 'youtube',
    url: '',
    duration: { hours: 0, minutes: 0, seconds: 0 },
    thumbnail: '',
    quality: '1080p',
    summary: '',
    autoThumbnails: [],
    selectedThumbnailIndex: 0,
    compression: {
      enabled: false,
      targetQuality: 'high',
      targetFormat: 'mp4',
    },
  });
  const [showCompressionSettings, setShowCompressionSettings] = useState(false);
  const [generatingThumbnails, setGeneratingThumbnails] = useState(false);
  const [fetchingYouTubeThumbnail, setFetchingYouTubeThumbnail] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // 🆕 Event specific fields
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventOnlineLink, setEventOnlineLink] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [eventCapacity, setEventCapacity] = useState<number | ''>('');
  const [eventRegistrationLink, setEventRegistrationLink] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');
  const [eventType, setEventType] = useState<'online' | 'offline' | 'hybrid'>('offline');
  const [eventSpeakers, setEventSpeakers] = useState<Array<{ name: string; title: string; avatar?: string }>>([]);
  const [eventAgenda, setEventAgenda] = useState<Array<{ time: string; title: string; description: string }>>([]);

  // 🆕 Personnel/HR specific fields
  const [personnelName, setPersonnelName] = useState('');
  const [personnelPosition, setPersonnelPosition] = useState('');
  const [personnelDepartment, setPersonnelDepartment] = useState('');
  const [personnelEmail, setPersonnelEmail] = useState('');
  const [personnelPhone, setPersonnelPhone] = useState('');
  const [personnelPhoto, setPersonnelPhoto] = useState('');
  const [personnelPhotoFile, setPersonnelPhotoFile] = useState<File | null>(null);
  const [personnelStartDate, setPersonnelStartDate] = useState('');
  const [personnelType, setPersonnelType] = useState<'new-hire' | 'promotion' | 'resignation' | 'transfer' | 'achievement'>('new-hire');
  const [personnelEducation, setPersonnelEducation] = useState('');
  const [personnelExperience, setPersonnelExperience] = useState('');
  const [personnelSkills, setPersonnelSkills] = useState<string[]>([]);
  const [personnelAchievements, setPersonnelAchievements] = useState<Array<{ title: string; date: string; description: string }>>([]);
  const [personnelBio, setPersonnelBio] = useState('');
  const personnelPhotoInputRef = useRef<HTMLInputElement>(null);

  // 🆕 FAQ specific fields
  const [faqItems, setFaqItems] = useState<Array<{ id: number; question: string; answer: string; category: string }>>([
    { id: 1, question: '', answer: '', category: '' }
  ]);

  // 🆕 PDF specific fields
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [pdfPages, setPdfPages] = useState<number>(0);
  const [pdfFileSize, setPdfFileSize] = useState<number>(0);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  // 🆕 Download specific fields
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadTitle, setDownloadTitle] = useState('');
  const [downloadDescription, setDownloadDescription] = useState('');
  const [downloadVersion, setDownloadVersion] = useState('');
  const [downloadFileType, setDownloadFileType] = useState<'software' | 'document' | 'template' | 'media' | 'other'>('document');
  const [downloadFileSize, setDownloadFileSize] = useState<number>(0);
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [systemRequirements, setSystemRequirements] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const downloadFileInputRef = useRef<HTMLInputElement>(null);

  // Load article data when editing
  useEffect(() => {
    const loadArticle = async () => {
      if (articleId) {
        console.log('Loading article with ID:', articleId);
        try {
          // Fetch from API service
          const article = await getArticle(articleId);
          
          if (article) {
            console.log('Loaded article from API:', article);
            
            setTitle(article.title || '');
            setArticleType(article.type || 'news');
            setSelectedCategories(Array.isArray(article.category) ? article.category : [article.category || 'Chưa phân loại']);
            setSelectedAuthor(article.author || 'Không xác định');
            setContent(article.content || '');
            setTags(article.tags || []);
            setSlug(article.slug || generateSlugFromTitle(article.title || ''));
            setIsSlugManuallyEdited(!!article.slug);
            
            // Load multi-section content (always Block Editor)
            if (article.contentMode === 'sections' && article.sections) {
              setSections(article.sections);
            } else if (article.content) {
              setSections(htmlToSections(article.content));
            }
            
            // Load news-specific fields
            if (article.type === 'news') {
              setFeaturedImage(article.featuredImage || '');
              setImageCaption(article.imageCaption || '');
              setImageCredit(article.imageCredit || '');
              setExcerpt(article.excerpt || '');
              setReadingTime(article.readingTime || 5);
              setNewsSource(article.newsSource || '');
              setSourceUrl(article.sourceUrl || '');
              setIsBreakingNews(article.isBreakingNews || false);
              setMetaTitle(article.metaTitle || '');
              setMetaDescription(article.metaDescription || '');
              setFocusKeyword(article.focusKeyword || '');
              setLocation(article.location || '');
              setIsFeatured(article.isFeatured || false);
              setIsSticky(article.isSticky || false);
              setAllowComments(article.allowComments !== undefined ? article.allowComments : true);
              setSelectedRelatedArticles(article.relatedArticles || []);
              setContentQualityScore(article.contentQualityScore || 0);
              setReadabilityScore(article.readabilityScore || 0);
            }
            
            // Load type-specific data
            if (article.type === 'video' && article.videoData) {
              setVideoData({
                sourceType: article.videoData.sourceType || 'youtube',
                url: article.videoData.url || '',
                duration: article.videoData.duration || { hours: 0, minutes: 0, seconds: 0 },
                thumbnail: article.videoData.thumbnail || '',
                quality: article.videoData.quality || '1080p',
                summary: article.videoData.summary || '',
                autoThumbnails: article.videoData.autoThumbnails || [],
                selectedThumbnailIndex: article.videoData.selectedThumbnailIndex || 0,
                compression: article.videoData.compression || {
                  enabled: false,
                  targetQuality: 'high',
                  targetFormat: 'mp4',
                },
              });
            }
            
            if (article.type === 'gallery' && article.galleryImages) {
              setGalleryImages(article.galleryImages);
              if (article.gallerySettings) {
                setGallerySettings({
                  layout: article.gallerySettings.layout || 'grid',
                  columns: article.gallerySettings.columns || 3,
                  spacing: article.gallerySettings.spacing || 'normal',
                  enableLightbox: article.gallerySettings.enableLightbox !== undefined ? article.gallerySettings.enableLightbox : true,
                  showCaptions: article.gallerySettings.showCaptions !== undefined ? article.gallerySettings.showCaptions : true,
                  showExif: article.gallerySettings.showExif || false,
                  enableWatermark: article.gallerySettings.enableWatermark || false,
                  watermarkText: article.gallerySettings.watermarkText || '',
                  watermarkPosition: article.gallerySettings.watermarkPosition || 'bottom-right',
                });
              }
            }
            
            if (article.type === 'infographic' && article.infographicElements) {
              setInfographicElements(article.infographicElements);
            }
            
            // Load Event data
            if (article.type === 'event' && article.eventData) {
              setEventStartDate(article.eventData.startDate || '');
              setEventStartTime(article.eventData.startTime || '');
              setEventEndDate(article.eventData.endDate || '');
              setEventEndTime(article.eventData.endTime || '');
              setEventLocation(article.eventData.location || '');
              setEventOnlineLink(article.eventData.onlineLink || '');
              setEventOrganizer(article.eventData.organizer || '');
              setEventCapacity(article.eventData.capacity || '');
              setEventRegistrationLink(article.eventData.registrationLink || '');
              setEventPrice(article.eventData.price || '');
              setEventStatus(article.eventData.status || 'upcoming');
              setEventType(article.eventData.type || 'offline');
              setEventSpeakers(article.eventData.speakers || []);
              setEventAgenda(article.eventData.agenda || []);
            }
            
            // Load Personnel data
            if (article.type === 'personnel' && article.personnelData) {
              setPersonnelName(article.personnelData.name || '');
              setPersonnelPosition(article.personnelData.position || '');
              setPersonnelDepartment(article.personnelData.department || '');
              setPersonnelEmail(article.personnelData.email || '');
              setPersonnelPhone(article.personnelData.phone || '');
              setPersonnelPhoto(article.personnelData.photo || '');
              setPersonnelStartDate(article.personnelData.startDate || '');
              setPersonnelType(article.personnelData.type || 'new-hire');
              setPersonnelEducation(article.personnelData.education || '');
              setPersonnelExperience(article.personnelData.experience || '');
              setPersonnelSkills(article.personnelData.skills || []);
              setPersonnelAchievements(article.personnelData.achievements || []);
              setPersonnelBio(article.personnelData.bio || '');
            }
            
            // Load FAQ data
            if (article.type === 'faq' && article.faqData) {
              setFaqItems(
                (article.faqData.items || []).map((item: any) => ({
                  id: item.id,
                  question: item.question || '',
                  answer: item.answer || '',
                  category: item.category || ''
                }))
              );
              if (!article.faqData.items || article.faqData.items.length === 0) {
                setFaqItems([{ id: 1, question: '', answer: '', category: '' }]);
              }
            }
            
            // Load PDF data
            if (article.type === 'pdf' && article.pdfData) {
              setPdfUrl(article.pdfData.url || '');
              setPdfTitle(article.pdfData.title || '');
              setPdfDescription(article.pdfData.description || '');
              setPdfPages(article.pdfData.pages || 0);
              setPdfFileSize(article.pdfData.fileSize || 0);
            }
            
            // Load Download data
            if (article.type === 'download' && article.downloadData) {
              setDownloadUrl(article.downloadData.url || '');
              setDownloadTitle(article.downloadData.title || '');
              setDownloadDescription(article.downloadData.description || '');
              setDownloadVersion(article.downloadData.version || '');
              setDownloadFileType(article.downloadData.fileType || 'document');
              setDownloadFileSize(article.downloadData.fileSize || 0);
              setDownloadCount(article.downloadData.downloadCount || 0);
              setSystemRequirements(article.downloadData.systemRequirements || '');
              setReleaseNotes(article.downloadData.releaseNotes || '');
            }
          } else {
            console.error('Article not found:', result.error);
          }
        } catch (error) {
          console.error('Error loading article:', error);
        }
      }
    };
    
    if (articleId) {
      loadArticle();
    } else {
      // Reset ALL form fields when creating new article
      console.log('Creating new article - resetting ALL form fields');
      setTitle('');
      setArticleType('news'); // Reset article type
      setContent('');
      setSelectedCategories([]);
      setTags([]);
      setSelectedAuthor('');
      setSlug('');
      setIsSlugManuallyEdited(false);
      
      // Reset news fields
      setFeaturedImage('');
      setFeaturedImageFile(null);
      setImageCaption('');
      setImageCredit('');
      setExcerpt('');
      setReadingTime(5);
      setNewsSource('');
      setSourceUrl('');
      setIsBreakingNews(false);
      setRelatedArticles([]);
      
      // Reset advanced news fields
      setMetaTitle('');
      setMetaDescription('');
      setFocusKeyword('');
      setLocation('');
      setIsFeatured(false);
      setIsSticky(false);
      setAllowComments(true);
      setSelectedRelatedArticles([]);
      setContentQualityScore(0);
      setReadabilityScore(0);
      
      // Reset gallery fields
      setGalleryImages([]);
      setGallerySettings({
        layout: 'grid',
        columns: 3,
        spacing: 'normal',
        enableLightbox: true,
        showCaptions: true,
        showExif: false,
        enableWatermark: false,
        watermarkText: '',
        watermarkPosition: 'bottom-right',
      });
      
      // Reset infographic fields
      setInfographicElements([]);
      
      // Reset video fields
      setVideoData({
        sourceType: 'youtube',
        url: '',
        duration: { hours: 0, minutes: 0, seconds: 0 },
        thumbnail: '',
        quality: '1080p',
        summary: '',
        autoThumbnails: [],
        selectedThumbnailIndex: 0,
        compression: {
          enabled: false,
          targetQuality: 'high',
          targetFormat: 'mp4',
        },
      });
      
      // Reset event fields
      setEventStartDate('');
      setEventStartTime('');
      setEventEndDate('');
      setEventEndTime('');
      setEventLocation('');
      setEventOnlineLink('');
      setEventOrganizer('');
      setEventCapacity('');
      setEventRegistrationLink('');
      setEventPrice('');
      setEventStatus('upcoming');
      setEventType('offline');
      setEventSpeakers([]);
      setEventAgenda([]);
      
      // Reset personnel fields
      setPersonnelName('');
      setPersonnelPosition('');
      setPersonnelDepartment('');
      setPersonnelEmail('');
      setPersonnelPhone('');
      setPersonnelPhoto('');
      setPersonnelPhotoFile(null);
      setPersonnelStartDate('');
      setPersonnelType('new-hire');
      setPersonnelEducation('');
      setPersonnelExperience('');
      setPersonnelSkills([]);
      setPersonnelAchievements([]);
      setPersonnelBio('');
      
      // Reset FAQ fields
      setFaqItems([{ id: 1, question: '', answer: '', category: '' }]);
      
      // Reset PDF fields
      setPdfFile(null);
      setPdfUrl('');
      setPdfTitle('');
      setPdfDescription('');
      setPdfPages(0);
      setPdfFileSize(0);
    }
  }, [articleId]);

  // Auto-calculate reading time for news articles
  useEffect(() => {
    if (articleType === 'news' && content) {
      calculateReadingTime(content);
    }
  }, [content, articleType]);

  // Auto-calculate content quality and readability
  useEffect(() => {
    if (articleType === 'news' && content) {
      calculateContentQuality();
      calculateReadability();
    }
  }, [content, excerpt, featuredImage, articleType]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (articleType === 'news') {
        autoSaveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [title, content, articleType]);

  // Close category picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryPickerRef.current && !categoryPickerRef.current.contains(event.target as Node)) {
        setShowCategoryPicker(false);
      }
    };

    if (showCategoryPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryPicker]);

  // Close editor with ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // If category picker is open, close it first
        if (showCategoryPicker) {
          setShowCategoryPicker(false);
        } else if (showAiTools) {
          setShowAiTools(false);
        } else {
          // Otherwise close the entire editor
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCategoryPicker, showAiTools, onClose]);

  // 🆕 Auto-generate slug from title (only when adding new and not manually edited)
  useEffect(() => {
    if (!articleId && !isSlugManuallyEdited && title) {
      const autoSlug = generateSlugFromTitle(title);
      setSlug(autoSlug);
    }
  }, [title, selectedCategories, articleId, isSlugManuallyEdited]);

  const articleTypes = [
    { id: 'news', label: t('articleTypes.news'), icon: FileText, color: 'blue' },
    { id: 'video', label: t('articleTypes.video'), icon: Video, color: 'red' },
    { id: 'gallery', label: t('articleTypes.gallery'), icon: ImageIcon, color: 'purple' },
    { id: 'legal', label: t('articleTypes.legalShort'), icon: Scale, color: 'indigo' },
    { id: 'recruitment', label: t('articleTypes.recruitment'), icon: Briefcase, color: 'green' },
    { id: 'podcast', label: t('articleTypes.podcast'), icon: Mic, color: 'pink' },
    { id: 'event', label: t('articleTypes.event'), icon: Calendar, color: 'orange' },
    { id: 'personnel', label: 'Nhân sự', icon: Users, color: 'teal' },
    { id: 'download', label: 'Tải xuống', icon: Download, color: 'amber' },
    { id: 'infographic', label: t('articleTypes.infographic'), icon: BarChart3, color: 'sky' },
    { id: 'pdf', label: 'PDF', icon: FileType, color: 'rose' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'cyan' },
  ];

  // 🆕 Calculate visible article types based on container width (responsive)
  useEffect(() => {
    const calculateVisibleTypes = () => {
      if (typesSelectorRef.current) {
        const containerWidth = typesSelectorRef.current.offsetWidth;
        // Average button width: ~120px, gap: 8px, "Khác" button: ~90px
        const buttonWidth = 120;
        const gap = 8;
        const moreButtonWidth = 90;
        
        // Calculate how many buttons can fit
        const availableWidth = containerWidth - moreButtonWidth - gap;
        const maxButtons = Math.floor(availableWidth / (buttonWidth + gap));
        
        // Show at least 3, at most all-1 (to always have overflow menu if > maxButtons)
        const count = Math.max(3, Math.min(maxButtons, articleTypes.length - 1));
        setVisibleTypesCount(count);
      }
    };

    // Calculate on mount and window resize
    calculateVisibleTypes();
    window.addEventListener('resize', calculateVisibleTypes);
    
    // Use ResizeObserver for more accurate detection
    const resizeObserver = new ResizeObserver(calculateVisibleTypes);
    if (typesSelectorRef.current) {
      resizeObserver.observe(typesSelectorRef.current);
    }

    return () => {
      window.removeEventListener('resize', calculateVisibleTypes);
      resizeObserver.disconnect();
    };
  }, [articleTypes.length]);

  const availableCategories = [
    { id: 1, name: 'Công nghệ', parent: null },
    { id: 2, name: 'AI & Machine Learning', parent: 1 },
    { id: 3, name: 'Web Development', parent: 1 },
    { id: 4, name: 'Sự kiện', parent: null },
    { id: 5, name: 'Tuyển dụng', parent: null },
    { id: 6, name: 'Hướng dẫn', parent: null },
  ];

  const authors = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D',
  ];

  const aiTools = [
    { id: 'translate', label: 'Dịch tự động', icon: Languages, color: 'blue' },
    { id: 'grammar', label: 'Kiểm tra chính tả', icon: CheckCircle, color: 'green' },
    { id: 'optimize', label: 'Tối ưu SEO', icon: Sparkles, color: 'purple' },
    { id: 'suggest', label: 'Gợi ý nội dung', icon: Wand2, color: 'pink' },
  ];

  // 🆕 Slug Generation Helpers
  const vietnameseToSlug = (str: string): string => {
    // Vietnamese to non-accented mapping
    const map: { [key: string]: string } = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd',
      'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
      'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
      'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
      'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
      'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
      'Đ': 'D',
    };

    // Replace Vietnamese characters
    let slug = str.split('').map(char => map[char] || char).join('');
    
    // Convert to lowercase
    slug = slug.toLowerCase();
    
    // Remove special characters, keep only letters, numbers, and spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, '');
    
    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, '-');
    
    // Remove consecutive hyphens
    slug = slug.replace(/-+/g, '-');
    
    // Trim hyphens from start and end
    slug = slug.replace(/^-+|-+$/g, '');
    
    // Truncate if too long (max 80 chars for good SEO)
    if (slug.length > 80) {
      slug = slug.substring(0, 80);
      // Remove partial word at the end
      const lastHyphen = slug.lastIndexOf('-');
      if (lastHyphen > 60) {
        slug = slug.substring(0, lastHyphen);
      }
    }
    
    return slug;
  };

  const getCategoryPath = (): string => {
    if (selectedCategories.length === 0) return '';
    
    // For now, use first selected category
    // In real app, you'd traverse the category tree to get full path
    const category = selectedCategories[0];
    const categorySlug = vietnameseToSlug(category);
    
    // Example: "Công nghệ" -> "cong-nghe"
    // In production, you'd have parent categories too:
    // "Công nghệ/Phần mềm" -> "cong-nghe/phan-mem"
    return categorySlug;
  };

  const generateSlugFromTitle = (titleText: string): string => {
    const categoryPath = getCategoryPath();
    const titleSlug = vietnameseToSlug(titleText);
    
    if (!titleSlug) return '';
    
    // Format: category-path/title-slug.html
    return categoryPath 
      ? `${categoryPath}/${titleSlug}.html`
      : `${titleSlug}.html`;
  };

  const handleSave = async (saveAndContinue = false) => {
    setIsSaving(true);
    
    try {
      const articleData = {
        title,
        content: sectionsToHtml(sections),
        contentMode: 'sections' as const,
        sections,
        type: articleType,
        category: selectedCategories[0] || 'Chưa phân loại',
        categories: selectedCategories,
        tags,
        author: selectedAuthor,
        slug: slug || generateSlugFromTitle(title),
        status: 'draft',
        infographicElements: articleType === 'infographic' ? infographicElements : undefined,
        galleryImages: articleType === 'gallery' ? galleryImages : undefined,
        gallerySettings: articleType === 'gallery' ? gallerySettings : undefined,
        videoData: articleType === 'video' ? videoData : undefined,
        // News specific fields
        featuredImage: articleType === 'news' ? featuredImage : undefined,
        imageCaption: articleType === 'news' ? imageCaption : undefined,
        imageCredit: articleType === 'news' ? imageCredit : undefined,
        excerpt: articleType === 'news' ? excerpt : undefined,
        readingTime: articleType === 'news' ? readingTime : undefined,
        newsSource: articleType === 'news' ? newsSource : undefined,
        sourceUrl: articleType === 'news' ? sourceUrl : undefined,
        isBreakingNews: articleType === 'news' ? isBreakingNews : undefined,
        // Advanced news fields
        metaTitle: articleType === 'news' ? metaTitle : undefined,
        metaDescription: articleType === 'news' ? metaDescription : undefined,
        focusKeyword: articleType === 'news' ? focusKeyword : undefined,
        location: articleType === 'news' ? location : undefined,
        isFeatured: articleType === 'news' ? isFeatured : undefined,
        isSticky: articleType === 'news' ? isSticky : undefined,
        allowComments: articleType === 'news' ? allowComments : undefined,
        publishSchedule: articleType === 'news' ? publishSchedule : undefined,
        relatedArticles: articleType === 'news' ? selectedRelatedArticles : undefined,
        contentQualityScore: articleType === 'news' ? contentQualityScore : undefined,
        readabilityScore: articleType === 'news' ? readabilityScore : undefined,
        // Event specific fields
        eventData: articleType === 'event' ? {
          startDate: eventStartDate,
          startTime: eventStartTime,
          endDate: eventEndDate,
          endTime: eventEndTime,
          location: eventLocation,
          onlineLink: eventOnlineLink,
          organizer: eventOrganizer,
          capacity: eventCapacity,
          registrationLink: eventRegistrationLink,
          price: eventPrice,
          status: eventStatus,
          type: eventType,
          speakers: eventSpeakers,
          agenda: eventAgenda,
        } : undefined,
        // Personnel specific fields
        personnelData: articleType === 'personnel' ? {
          name: personnelName,
          position: personnelPosition,
          department: personnelDepartment,
          email: personnelEmail,
          phone: personnelPhone,
          photo: personnelPhoto,
          startDate: personnelStartDate,
          type: personnelType,
          education: personnelEducation,
          experience: personnelExperience,
          skills: personnelSkills,
          achievements: personnelAchievements,
          bio: personnelBio,
        } : undefined,
        // FAQ specific fields
        faqData: articleType === 'faq' ? {
          items: faqItems,
        } : undefined,
        // PDF specific fields
        pdfData: articleType === 'pdf' ? {
          file: pdfFile,
          url: pdfUrl,
          title: pdfTitle,
          description: pdfDescription,
          pages: pdfPages,
          fileSize: pdfFileSize,
        } : undefined,
        // Download specific fields
        downloadData: articleType === 'download' ? {
          file: downloadFile,
          url: downloadUrl,
          title: downloadTitle,
          description: downloadDescription,
          version: downloadVersion,
          fileType: downloadFileType,
          fileSize: downloadFileSize,
          downloadCount: downloadCount,
          systemRequirements: systemRequirements,
          releaseNotes: releaseNotes,
        } : undefined,
      };
      
      // Call API service
      let savedArticle;
      if (articleId) {
        savedArticle = await updateArticle(articleId, articleData);
      } else {
        savedArticle = await createArticle(articleData);
      }
      
      if (savedArticle) {
        console.log('Article saved successfully:', savedArticle);
        setLastSaved(new Date());
        setIsSaving(false);
        
        onSave(savedArticle, saveAndContinue);
      } else {
        throw new Error('Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setIsSaving(false);
      alert(`Lỗi khi lưu bài viết: ${error}`);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleAddAuthor = () => {
    if (newAuthorName.trim()) {
      setSelectedAuthor(newAuthorName);
      setNewAuthorName('');
      setShowAddAuthor(false);
    }
  };

  // Gallery functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          const newImage: GalleryImage = {
            id: Date.now() + Math.random(),
            url: event.target?.result as string,
            caption: '',
            file,
            alt: '',
            photographer: '',
            location: '',
            dateTaken: '',
            tags: [],
            isCover: galleryImages.length === 0, // First image is cover by default
            dimensions: { width: img.width, height: img.height },
            fileSize: file.size,
            exifData: {
              camera: '',
              lens: '',
              focalLength: '',
              aperture: '',
              shutterSpeed: '',
              iso: '',
            },
          };
          setGalleryImages(prev => [...prev, newImage]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const updateImageCaption = (id: number, caption: string) => {
    setGalleryImages(prev =>
      prev.map(img => img.id === id ? { ...img, caption } : img)
    );
  };

  const updateImageMetadata = (id: number, metadata: Partial<GalleryImage>) => {
    setGalleryImages(prev =>
      prev.map(img => img.id === id ? { ...img, ...metadata } : img)
    );
  };

  const setCoverImage = (id: number) => {
    setGalleryImages(prev =>
      prev.map(img => ({ ...img, isCover: img.id === id }))
    );
  };

  const deleteImage = (id: number) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const deleteSelectedImages = (ids: number[]) => {
    setGalleryImages(prev => prev.filter(img => !ids.includes(img.id)));
  };

  const applyBulkCaption = () => {
    if (!bulkCaptionTemplate.trim()) return;
    
    setGalleryImages(prev =>
      prev.map((img, index) => ({
        ...img,
        caption: bulkCaptionTemplate
          .replace('{index}', (index + 1).toString())
          .replace('{total}', prev.length.toString())
          .replace('{photographer}', img.photographer || '')
          .replace('{location}', img.location || ''),
      }))
    );
    setShowBulkCaptionEditor(false);
    setBulkCaptionTemplate('');
  };

  const generateAICaptionForImage = async (imageId: number) => {
    setGeneratingAICaption(true);
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const image = galleryImages.find(img => img.id === imageId);
    if (image) {
      const aiCaption = `Hình ảnh chất lượng cao được chụp tại ${image.location || 'địa điểm đặc biệt'}, thể hiện vẻ đẹp độc đáo và ấn tượng.`;
      updateImageCaption(imageId, aiCaption);
    }
    setGeneratingAICaption(false);
  };

  const applyImageFilters = (imageId: number) => {
    // Apply filters to image
    setGalleryImages(prev =>
      prev.map(img => img.id === imageId ? { 
        ...img, 
        filters: imageFilters 
      } : img)
    );
  };

  const applyCrop = (imageId: number) => {
    // Apply crop to image
    setGalleryImages(prev =>
      prev.map(img => img.id === imageId ? { 
        ...img, 
        crop: cropData 
      } : img)
    );
    setShowCropTool(false);
  };

  const optimizeImage = async (imageId: number) => {
    // Simulate image optimization
    setGalleryImages(prev =>
      prev.map(img => img.id === imageId ? { 
        ...img, 
        optimized: true,
        fileSize: img.fileSize ? Math.floor(img.fileSize * 0.6) : undefined // Simulate 40% reduction
      } : img)
    );
  };

  const openImageEditor = (imageId: number) => {
    const image = galleryImages.find(img => img.id === imageId);
    if (image) {
      setEditingImage(image);
      setSelectedImageForEdit(imageId);
      setShowImageEditor(true);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedImageId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedImageId === null || draggedImageId === targetId) return;

    const draggedIndex = galleryImages.findIndex(img => img.id === draggedImageId);
    const targetIndex = galleryImages.findIndex(img => img.id === targetId);

    const newImages = [...galleryImages];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    setGalleryImages(newImages);
    setDraggedImageId(null);
  };

  // News functions
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeaturedImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFeaturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePersonnelPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPersonnelPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPersonnelPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time > 0 ? time : 1);
  };

  const generateExcerpt = () => {
    const plainText = content.replace(/<[^>]*>/g, '').substring(0, 300);
    setExcerpt(plainText + (content.length > 300 ? '...' : ''));
  };

  // AI Functions
  const generateAIHeadlines = async () => {
    setGeneratingAI(true);
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = [
      `${title} - Những Điều Bạn Cần Biết`,
      `Phân Tích: ${title}`,
      `${title}: Tác Động và Ý Nghĩa`,
      `Cập Nhật Mới Nhất Về ${title}`,
      `${title} - Góc Nhìn Chuyên Sâu`,
    ];
    
    setAiSuggestions(suggestions);
    setGeneratingAI(false);
  };

  const generateSEOMeta = () => {
    // Auto-generate meta if empty
    if (!metaTitle) {
      setMetaTitle(title);
    }
    if (!metaDescription) {
      const plainText = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160);
      setMetaDescription(plainText);
    }
  };

  const calculateSEOScore = () => {
    let score = 0;
    if (metaTitle && metaTitle.length >= 30 && metaTitle.length <= 60) score += 20;
    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 20;
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 20;
    if (focusKeyword && content.toLowerCase().includes(focusKeyword.toLowerCase())) score += 20;
    if (featuredImage) score += 20;
    return score;
  };

  // Content Quality Functions
  const calculateContentQuality = () => {
    let score = 0;
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length;
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Word count (25 points)
    if (wordCount >= 300) score += 25;
    else if (wordCount >= 150) score += 15;
    else if (wordCount >= 50) score += 5;
    
    // Has images (25 points)
    if (featuredImage) score += 25;
    
    // Has excerpt (20 points)
    if (excerpt && excerpt.length >= 100) score += 20;
    else if (excerpt) score += 10;
    
    // Proper structure (15 points)
    if (content.includes('<h2>') || content.includes('<h3>')) score += 15;
    
    // Has links (15 points)
    if (content.includes('<a ')) score += 15;
    
    setContentQualityScore(score);
    return score;
  };

  const calculateReadability = () => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).length;
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const syllables = plainText.split(/\s+/).reduce((count, word) => {
      return count + Math.max(1, word.match(/[aeiouy]+/gi)?.length || 1);
    }, 0);
    
    if (words === 0 || sentences === 0) return 0;
    
    // Flesch Reading Ease approximation
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    const normalized = Math.max(0, Math.min(100, score));
    
    setReadabilityScore(Math.round(normalized));
    return Math.round(normalized);
  };

  const applyTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setTitle(template.title);
      setExcerpt(template.excerpt);
      setContent(template.content);
      setSelectedTemplate(templateId);
      setShowTemplates(false);
    }
  };

  // Auto-save functionality
  const autoSaveDraft = async () => {
    if (!title && !content) return;
    
    setAutoSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setLastAutoSave(new Date());
    setAutoSaving(false);
  };

  // Video functions
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const videoUrl = event.target?.result as string;
      setVideoData(prev => ({
        ...prev,
        file,
        url: videoUrl,
        sourceType: 'upload',
      }));
      
      // 🆕 Auto-generate thumbnails after video loads
      generateAutoThumbnails(videoUrl);
    };
    reader.readAsDataURL(file);
  };

  // 🆕 Auto-generate thumbnails at different timestamps
  const generateAutoThumbnails = async (videoUrl: string) => {
    setGeneratingThumbnails(true);
    
    try {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.currentTime = 0.1; // Start slightly after beginning to avoid black frames
          resolve(true);
        };
      });

      const duration = video.duration;
      const thumbnails: string[] = [];
      
      // Generate 6 thumbnails at different timestamps
      const timestamps = [
        0.1, // Beginning
        duration * 0.2,
        duration * 0.4,
        duration * 0.5,
        duration * 0.7,
        duration * 0.9,
      ];

      for (const timestamp of timestamps) {
        const thumbnailUrl = await captureThumbnailAtTime(video, timestamp);
        if (thumbnailUrl) thumbnails.push(thumbnailUrl);
      }

      setVideoData(prev => ({
        ...prev,
        autoThumbnails: thumbnails,
        thumbnail: thumbnails[0] || prev.thumbnail, // Set first thumbnail as default
        selectedThumbnailIndex: 0,
        duration: {
          hours: Math.floor(duration / 3600),
          minutes: Math.floor((duration % 3600) / 60),
          seconds: Math.floor(duration % 60),
        },
      }));
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    } finally {
      setGeneratingThumbnails(false);
    }
  };

  const captureThumbnailAtTime = (video: HTMLVideoElement, time: number): Promise<string | null> => {
    return new Promise((resolve) => {
      video.currentTime = time;
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } else {
          resolve(null);
        }
      };
    });
  };

  const selectThumbnail = (index: number) => {
    if (!videoData.autoThumbnails || index >= videoData.autoThumbnails.length) return;
    
    setVideoData(prev => ({
      ...prev,
      thumbnail: prev.autoThumbnails![index],
      selectedThumbnailIndex: index,
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setVideoData(prev => ({
        ...prev,
        thumbnailFile: file,
        thumbnail: event.target?.result as string,
        selectedThumbnailIndex: undefined, // Clear auto-thumbnail selection
      }));
    };
    reader.readAsDataURL(file);
  };

  // 🆕 YouTube/Vimeo URL normalization và auto-fetch thumbnail
  const normalizeYouTubeUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
  };

  const normalizeVimeoUrl = (url: string): string => {
    const regExp = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    return videoId ? `https://vimeo.com/${videoId}` : url;
  };

  const fetchYouTubeThumbnail = async (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) return;

    setFetchingYouTubeThumbnail(true);
    try {
      // YouTube thumbnail formats:
      // maxresdefault.jpg (1920x1080) - best quality
      // hqdefault.jpg (480x360) - high quality
      // mqdefault.jpg (320x180) - medium quality
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Test if maxresdefault exists, otherwise fallback to hqdefault
      const img = new Image();
      img.onload = () => {
        setVideoData(prev => ({
          ...prev,
          thumbnail: thumbnailUrl,
        }));
      };
      img.onerror = () => {
        // Fallback to hqdefault
        setVideoData(prev => ({
          ...prev,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        }));
      };
      img.src = thumbnailUrl;
    } catch (error) {
      console.error('Error fetching YouTube thumbnail:', error);
    } finally {
      setFetchingYouTubeThumbnail(false);
    }
  };

  const fetchVimeoThumbnail = async (url: string) => {
    const regExp = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    
    if (!videoId) return;

    setFetchingYouTubeThumbnail(true);
    try {
      // Vimeo oEmbed API
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`);
      const data = await response.json();
      
      if (data.thumbnail_url) {
        // Get largest thumbnail by removing size parameters
        const largeThumbnail = data.thumbnail_url.replace(/_\d+x\d+/, '_1280x720');
        setVideoData(prev => ({
          ...prev,
          thumbnail: largeThumbnail,
        }));
      }
    } catch (error) {
      console.error('Error fetching Vimeo thumbnail:', error);
    } finally {
      setFetchingYouTubeThumbnail(false);
    }
  };

  // Handle URL change and auto-fetch thumbnail
  const handleVideoUrlChange = (url: string) => {
    let normalizedUrl = url;
    
    // Normalize URL based on source type
    if (videoData.sourceType === 'youtube') {
      normalizedUrl = normalizeYouTubeUrl(url);
      setVideoData(prev => ({ ...prev, url: normalizedUrl }));
      if (normalizedUrl) {
        fetchYouTubeThumbnail(normalizedUrl);
      }
    } else if (videoData.sourceType === 'vimeo') {
      normalizedUrl = normalizeVimeoUrl(url);
      setVideoData(prev => ({ ...prev, url: normalizedUrl }));
      if (normalizedUrl) {
        fetchVimeoThumbnail(normalizedUrl);
      }
    } else {
      setVideoData(prev => ({ ...prev, url: normalizedUrl }));
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const extractVimeoId = (url: string): string | null => {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Render form fields based on article type
  const renderTypeSpecificFields = () => {
    switch (articleType) {
      case 'news':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Ảnh đại diện *</label>
              <div className="border-2 border-dashed border-border/60 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                    <ImagePlus className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-foreground mb-1">Click để tải ảnh lên</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG hoặc WebP (max. 5MB)</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Mô tả ngắn</label>
              <textarea
                rows={3}
                placeholder={t('placeholders.shortDescription')}
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Thời gian đọc (phút)</label>
              <input
                type="number"
                placeholder={t('placeholders.readingTime')}
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
          </>
        );

      case 'video':
        return (
          <div className="space-y-6">
            {/* 🎬 Video Settings Info */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-900 font-medium">
                🎥 Video chính đã được cấu hình ở vùng giữa. Thêm giới thiệu tóm tắt bên dưới.
              </p>
            </div>

            {/* 🆕 Giới thiệu tóm tắt (thay vì Transcript) */}
            <div>
              <label className="block text-foreground mb-2">Giới thiệu tóm tắt *</label>
              <textarea
                rows={6}
                value={videoData.summary}
                onChange={(e) => setVideoData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Nhập giới thiệu ngắn gọn về nội dung video, giúp người xem hiểu tổng quan trước khi xem..."
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-200 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Giới thiệu tóm tắt giúp cải thiện SEO và thu hút người xem
              </p>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Mô tả gallery</label>
              <textarea
                rows={3}
                placeholder={t('placeholders.galleryDescription')}
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>
          </>
        );

      case 'legal':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Số hiệu văn bản *</label>
                <input
                  type="text"
                  placeholder={t('placeholders.documentNumber')}
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Loại văn bản</label>
                <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200">
                  <option>Nghị định</option>
                  <option>Thông tư</option>
                  <option>Quyết định</option>
                  <option>Luật</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Ngày ban hành</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Ngày hiệu lực</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Cơ quan ban hành</label>
              <input
                type="text"
                placeholder={t('placeholders.issuingAuthority')}
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">File đính kèm</label>
              <button className="w-full px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/30 transition-all duration-200 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Tải lên file PDF</span>
              </button>
            </div>
          </>
        );

      case 'job':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Vị trí tuyển dụng *</label>
              <input
                type="text"
                placeholder={t('placeholders.jobPosition')}
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Cấp bậc</label>
                <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200">
                  <option>Intern</option>
                  <option>Junior</option>
                  <option>Middle</option>
                  <option>Senior</option>
                  <option>Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-foreground mb-2">Số lượng</label>
                <input
                  type="number"
                  placeholder="2"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Mức lương</label>
                <input
                  type="text"
                  placeholder="25-35 triệu"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Hạn nộp</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Địa điểm làm việc</label>
              <input
                type="text"
                placeholder="Hà Nội"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Email liên hệ</label>
                <input
                  type="email"
                  placeholder="hr@company.com"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="024 1234 5678"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </>
        );

      case 'podcast':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Season</label>
                <input
                  type="number"
                  placeholder="2"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Episode</label>
                <input
                  type="number"
                  placeholder="12"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Tệp âm thanh *</label>
              <button className="w-full px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/30 transition-all duration-200 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Tải lên file MP3/WAV</span>
              </button>
            </div>

            <div>
              <label className="block text-foreground mb-2">Thời lượng</label>
              <input
                type="text"
                placeholder="45:30"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Khách mời</label>
              <textarea
                rows={3}
                placeholder="Dr. Nguyễn Văn X - AI Researcher&#10;Ms. Trần Thị Y - Content Strategist"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Ảnh bìa album</label>
              <div className="border-2 border-dashed border-border/60 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-200 cursor-pointer">
                <div className="text-center">
                  <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Tải lên ảnh album (tỷ lệ 1:1)</p>
                </div>
              </div>
            </div>
          </>
        );

      case 'infographic':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Mô tả ngắn</label>
              <textarea
                rows={3}
                placeholder="Mô tả về infographic này..."
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Kích thước</label>
              <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200">
                <option>800x1000 (Chuẩn)</option>
                <option>1080x1080 (Instagram)</option>
                <option>1200x628 (Facebook)</option>
                <option>1024x512 (LinkedIn)</option>
              </select>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <p className="text-sm text-sky-800">
                💡 <strong>Mẹo:</strong> Sử dụng AI Assistant để tự động tạo layout infographic từ ý tưởng của bạn.
              </p>
            </div>
          </>
        );

      case 'event':
        return (
          <div className="space-y-6">
            {/* Event Quick Info */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-900 font-medium">
                📅 Thông tin sự kiện đã được cấu hình ở vùng chính bên trái.
              </p>
            </div>

            {/* Event Summary */}
            {eventStartDate && (
              <div className="bg-white border border-border/60 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm text-foreground">Tóm tắt sự kiện</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{eventStartDate} {eventStartTime && `- ${eventStartTime}`}</span>
                  </div>
                  {eventLocation && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{eventLocation}</span>
                    </div>
                  )}
                  {eventOrganizer && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{eventOrganizer}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'personnel':
        return (
          <div className="space-y-6">
            {/* Personnel Quick Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 font-medium">
                👤 Thông tin nhân sự đã được cấu hình ở vùng chính bên trái.
              </p>
            </div>

            {/* Personnel Preview */}
            {personnelPhoto && personnelName && (
              <div className="bg-white border border-border/60 rounded-xl p-4">
                <h4 className="font-medium text-sm text-foreground mb-3">Xem trước</h4>
                <div className="flex items-center gap-3">
                  <img 
                    src={personnelPhoto} 
                    alt={personnelName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">{personnelName}</h5>
                    {personnelPosition && (
                      <p className="text-sm text-muted-foreground">{personnelPosition}</p>
                    )}
                    {personnelDepartment && (
                      <p className="text-xs text-muted-foreground">{personnelDepartment}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-in">
      {/* Top Bar - Single Row Compact */}
      <div className="glass-strong border-b border-border/40 px-4 py-2 relative z-50">
        <div className="flex items-center gap-3 h-10">
          {/* Left: Close + Title */}
          <button
            onClick={() => {
              console.log('Close button clicked!');
              onClose();
            }}
            className="p-1.5 hover:bg-muted/50 rounded-lg transition-all duration-200 relative z-50 pointer-events-auto flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="h-5 w-px bg-border/60 flex-shrink-0" />

          <h2 className="text-foreground text-sm whitespace-nowrap flex-shrink-0">
            {articleId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>

          {lastSaved && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              {lastSaved.toLocaleTimeString()}
            </span>
          )}

          <div className="h-5 w-px bg-border/60 flex-shrink-0" />

          {/* Center: Article Type Selector - Scrollable */}
          <div className="flex-1 min-w-0 relative" ref={typesSelectorRef}>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {articleTypes.slice(0, visibleTypesCount).map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setArticleType(type.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap flex-shrink-0 text-xs ${
                      articleType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${
                      articleType === type.id ? 'text-blue-600' : ''
                    }`} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
              
              {/* Overflow Menu */}
              {articleTypes.length > visibleTypesCount && (
                <div className="relative flex-shrink-0" ref={(el) => { if (el) el.dataset.overflowTrigger = 'true'; }}>
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setOverflowMenuPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
                      setShowOverflowMenu(!showOverflowMenu);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap text-xs ${
                      articleTypes.slice(visibleTypesCount).some(t => t.id === articleType)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                    <span>+{articleTypes.length - visibleTypesCount}</span>
                  </button>
                  
                  {showOverflowMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowOverflowMenu(false)}
                      />
                      <div className="fixed w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                        style={{ top: overflowMenuPos.top, right: overflowMenuPos.right }}
                      >
                        {articleTypes.slice(visibleTypesCount).map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.id}
                              onClick={() => {
                                setArticleType(type.id);
                                setShowOverflowMenu(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 transition-all duration-200 text-sm ${
                                articleType === type.id
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-slate-50 text-foreground'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${
                                articleType === type.id ? 'text-blue-600' : 'text-muted-foreground'
                              }`} />
                              <span className={articleType === type.id ? 'font-medium' : ''}>
                                {type.label}
                              </span>
                              {articleType === type.id && (
                                <CheckCircle className="w-3.5 h-3.5 ml-auto text-blue-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: View Toggle + Fullscreen */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center bg-muted/50 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-xs ${
                  activeTab === 'edit'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-xs ${
                  activeTab === 'preview'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Xem trước
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Conditional Layout based on activeTab */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'edit' ? (
          <>
            {/* Edit Mode - 2 Column */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Scrollable Content Area - includes Title, Slug & Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Title Input */}
                <div className="px-5 pt-5 pb-3">
                  <input
                    type="text"
                    placeholder={t('editor.titlePlaceholder')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-3xl border-none focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Đường dẫn đẹp (Slug/Permalink) */}
                <div className="px-5 pb-4">
                  <div className="flex items-stretch gap-0 relative">
                    {/* Domain Prefix */}
                    <div className="flex items-center px-3 bg-muted/50 border border-r-0 border-border/60 rounded-l-lg">
                      <span className="text-sm text-muted-foreground font-mono whitespace-nowrap">
                        URL: https://example.com/
                      </span>
                    </div>
                    
                    {/* Slug Input */}
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setIsSlugManuallyEdited(true);
                      }}
                      placeholder="duong-dan-dep.html"
                      className="flex-1 pl-3 pr-10 py-2 border border-border/60 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all bg-background font-mono text-sm"
                    />
                    
                    {/* Auto Badge or Open Link Icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {!isSlugManuallyEdited ? (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          Auto
                        </span>
                      ) : slug ? (
                        <a
                          href={`https://example.com/${slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-blue-600 transition-colors"
                          title="Mở link trong tab mới"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Content Area - Different for Gallery and Infographic */}
                <div className="px-5 py-4">
                {articleType === 'gallery' ? (
                  /* 🎨 Professional Gallery Manager */
                  <div className="space-y-6">
                    {/* Gallery Header with Actions */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Quản lý thư viện ảnh</h3>
                        <p className="text-sm text-muted-foreground">
                          {galleryImages.length} ảnh • {galleryImages.filter(img => img.isCover).length > 0 && '✓ Đã chọn ảnh bìa'}
                        </p>
                      </div>
                      
                      {galleryImages.length > 0 && (
                        <button
                          onClick={() => setShowGallerySettings(true)}
                          className="px-4 py-2 border border-border/60 rounded-lg hover:bg-muted transition-colors"
                        >
                          Settings
                        </button>
                      )}
                    </div>

                    {/* Upload Area */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-border/60 rounded-xl p-12 hover:border-purple-500/50 transition-all duration-200 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative text-center">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-purple-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <h3 className="text-foreground mb-2">Tải lên hình ảnh</h3>
                          <p className="text-sm text-muted-foreground">
                            Kéo thả nhiều ảnh hoặc click để chọn • PNG, JPG, WebP (max 10MB)
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Gallery Images Grid */}
                    {galleryImages.length > 0 && (
                      <div className={`grid gap-4 ${
                        gallerySettings.columns === 2 ? 'grid-cols-2' :
                        gallerySettings.columns === 3 ? 'grid-cols-3' :
                        'grid-cols-4'
                      }`}>
                        {galleryImages.map((image, index) => (
                          <div
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, image.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, image.id)}
                            className={`group relative bg-card border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                              draggedImageId === image.id ? 'opacity-50 scale-95 border-purple-500' : 
                              image.isCover ? 'border-yellow-500 ring-2 ring-yellow-500/20' :
                              'border-border/60 hover:border-purple-500/50 hover:shadow-lg'
                            }`}
                          >
                            {/* Cover Badge */}
                            {image.isCover && (
                              <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Ảnh bìa
                              </div>
                            )}

                            {/* Drag Handle */}
                            <div className="absolute top-2 left-2 z-10 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                              <GripVertical className="w-4 h-4 text-white" />
                            </div>

                            {/* Image Number */}
                            <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                              #{index + 1}
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute top-10 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!image.isCover && (
                                <button
                                  onClick={() => setCoverImage(image.id)}
                                  className="p-2 bg-yellow-500/90 hover:bg-yellow-500 backdrop-blur-sm rounded-lg transition-colors"
                                  title="Đặt làm ảnh bìa"
                                >
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteImage(image.id)}
                                className="p-2 bg-red-500/90 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>

                            {/* Image Preview - Click to edit */}
                            <div 
                              className="aspect-video bg-muted relative cursor-pointer"
                              onClick={() => openImageEditor(image.id)}
                            >
                              <img src={image.url} alt={image.alt || ''} className="w-full h-full object-cover" />
                              
                              {/* Image Info Overlay */}
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs">
                                  {image.dimensions && `${image.dimensions.width} × ${image.dimensions.height}`}
                                  {image.fileSize && ` • ${(image.fileSize / 1024).toFixed(0)} KB`}
                                </p>
                              </div>
                            </div>

                            {/* Caption - Click to edit */}
                            <div className="p-3 border-t border-border/60">
                              {editingCaptionId === image.id ? (
                                <input
                                  type="text"
                                  value={image.caption}
                                  onChange={(e) => updateImageCaption(image.id, e.target.value)}
                                  placeholder="Nhập tiêu đề ảnh..."
                                  className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                  autoFocus
                                  onBlur={() => setEditingCaptionId(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') setEditingCaptionId(null);
                                  }}
                                />
                              ) : (
                                <p 
                                  className="text-sm text-foreground line-clamp-2 min-h-[2.5rem] cursor-text hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCaptionId(image.id);
                                  }}
                                >
                                  {image.caption || <span className="text-muted-foreground italic">Click để thêm tiêu đề...</span>}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Gallery Tips */}
                    {galleryImages.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <p className="text-sm text-purple-900">
                          💡 <strong>Mẹo:</strong> Kéo thả để sắp xếp • Click ảnh để chỉnh sửa với Crop tool, Filters & Optimization • Click tiêu đề để sửa mô tả
                        </p>
                      </div>
                    )}
                  </div>
                ) : articleType === 'video' ? (
                  /* 🎥 Professional Video Manager */
                  <div className="space-y-6">
                    {/* Video Source Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Nguồn Video *</label>
                      <div className="grid grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => setVideoData(prev => ({ ...prev, sourceType: 'youtube' }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            videoData.sourceType === 'youtube'
                              ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20'
                              : 'border-border/60 hover:border-red-300 bg-card'
                          }`}
                        >
                          <Video className={`w-6 h-6 mx-auto mb-2 ${
                            videoData.sourceType === 'youtube' ? 'text-red-600' : 'text-muted-foreground'
                          }`} />
                          <p className={`text-sm font-medium ${
                            videoData.sourceType === 'youtube' ? 'text-red-700' : 'text-foreground'
                          }`}>YouTube</p>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setVideoData(prev => ({ ...prev, sourceType: 'vimeo' }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            videoData.sourceType === 'vimeo'
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                              : 'border-border/60 hover:border-blue-300 bg-card'
                          }`}
                        >
                          <Video className={`w-6 h-6 mx-auto mb-2 ${
                            videoData.sourceType === 'vimeo' ? 'text-blue-600' : 'text-muted-foreground'
                          }`} />
                          <p className={`text-sm font-medium ${
                            videoData.sourceType === 'vimeo' ? 'text-blue-700' : 'text-foreground'
                          }`}>Vimeo</p>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setVideoData(prev => ({ ...prev, sourceType: 'upload' }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            videoData.sourceType === 'upload'
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/20'
                              : 'border-border/60 hover:border-purple-300 bg-card'
                          }`}
                        >
                          <Upload className={`w-6 h-6 mx-auto mb-2 ${
                            videoData.sourceType === 'upload' ? 'text-purple-600' : 'text-muted-foreground'
                          }`} />
                          <p className={`text-sm font-medium ${
                            videoData.sourceType === 'upload' ? 'text-purple-700' : 'text-foreground'
                          }`}>Upload</p>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setVideoData(prev => ({ ...prev, sourceType: 'url' }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            videoData.sourceType === 'url'
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-500/20'
                              : 'border-border/60 hover:border-green-300 bg-card'
                          }`}
                        >
                          <Link className={`w-6 h-6 mx-auto mb-2 ${
                            videoData.sourceType === 'url' ? 'text-green-600' : 'text-muted-foreground'
                          }`} />
                          <p className={`text-sm font-medium ${
                            videoData.sourceType === 'url' ? 'text-green-700' : 'text-foreground'
                          }`}>URL</p>
                        </button>
                      </div>
                    </div>

                    {/* Video Input based on Source Type */}
                    {videoData.sourceType === 'upload' ? (
                      <div>
                        <label className="block text-sm font-medium mb-3">Tải lên tệp video</label>
                        <input
                          ref={videoFileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                        <div
                          onClick={() => videoFileInputRef.current?.click()}
                          className="relative border-2 border-dashed border-border/60 rounded-xl p-12 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group overflow-hidden"
                        >
                          {videoData.url && videoData.file ? (
                            <div className="text-center">
                              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                              <p className="text-foreground font-medium mb-1">{videoData.file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(videoData.file.size / 1024 / 1024).toFixed(2)} MB
                                {generatingThumbnails && ' • Đang tạo thumbnails...'}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVideoData(prev => ({ ...prev, url: '', file: undefined, autoThumbnails: [] }));
                                }}
                                className="mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Chọn video khác
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="relative text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                                  <Upload className="w-10 h-10 text-purple-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-foreground font-medium mb-2">Tải lên video</h3>
                                <p className="text-sm text-muted-foreground">
                                  Click để chọn file • MP4, WebM, MOV (max 500MB)
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium mb-3">
                          {videoData.sourceType === 'youtube' && 'YouTube URL'}
                          {videoData.sourceType === 'vimeo' && 'Vimeo URL'}
                          {videoData.sourceType === 'url' && 'Video URL'}
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={videoData.url}
                            onChange={(e) => handleVideoUrlChange(e.target.value)}
                            onBlur={(e) => handleVideoUrlChange(e.target.value)}
                            placeholder={
                              videoData.sourceType === 'youtube' ? 'https://www.youtube.com/watch?v=... hoặc https://youtu.be/...' :
                              videoData.sourceType === 'vimeo' ? 'https://vimeo.com/...' :
                              'https://example.com/video.mp4'
                            }
                            className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                          {fetchingYouTubeThumbnail && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        {videoData.sourceType === 'youtube' && (
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 URL sẽ được chuẩn hóa tự động. Thumbnail được lấy từ YouTube.
                          </p>
                        )}
                        {videoData.sourceType === 'vimeo' && (
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 URL sẽ được chuẩn hóa tự động. Thumbnail được lấy từ Vimeo.
                          </p>
                        )}
                      </div>
                    )}

                    {/* 🆕 Auto-Generated Thumbnails Selector */}
                    {videoData.autoThumbnails && videoData.autoThumbnails.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-3">
                          Chọn Thumbnail từ Video
                          {generatingThumbnails && <span className="text-purple-500 ml-2">⏳ Đang tạo...</span>}
                        </label>
                        <div className="grid grid-cols-6 gap-3">
                          {videoData.autoThumbnails.map((thumb, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectThumbnail(index)}
                              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                videoData.selectedThumbnailIndex === index
                                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                                  : 'border-border/60 hover:border-purple-300'
                              }`}
                            >
                              <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                              {videoData.selectedThumbnailIndex === index && (
                                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                  <CheckCircle className="w-6 h-6 text-purple-600" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Hoặc upload thumbnail tùy chỉnh bên dưới
                        </p>
                      </div>
                    )}

                    {/* 🆕 Thumbnail, Duration & Quality - ALL ON ONE ROW */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Custom Thumbnail */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Ảnh thu nhỏ tùy chỉnh</label>
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                        />
                        {videoData.thumbnail ? (
                          <div className="relative group">
                            <div className="aspect-video rounded-xl overflow-hidden border-2 border-purple-500">
                              <img src={videoData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => thumbnailInputRef.current?.click()}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <span className="text-white text-sm">Thay đổi</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="aspect-video w-full border-2 border-dashed border-border/60 rounded-xl hover:border-purple-500/50 transition-all group flex flex-col items-center justify-center"
                          >
                            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-purple-500 transition-colors" />
                            <p className="text-xs text-foreground">Tải lên</p>
                            <p className="text-xs text-muted-foreground">16:9</p>
                          </button>
                        )}
                      </div>

                      {/* Video Duration */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Thời lượng video</label>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">H</label>
                              <input
                                type="number"
                                min="0"
                                value={videoData.duration.hours}
                                onChange={(e) => setVideoData(prev => ({
                                  ...prev,
                                  duration: { ...prev.duration, hours: Number(e.target.value) }
                                }))}
                                className="w-full px-2 py-2 border border-border/60 rounded-lg text-sm text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">M</label>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={videoData.duration.minutes}
                                onChange={(e) => setVideoData(prev => ({
                                  ...prev,
                                  duration: { ...prev.duration, minutes: Number(e.target.value) }
                                }))}
                                className="w-full px-2 py-2 border border-border/60 rounded-lg text-sm text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">S</label>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={videoData.duration.seconds}
                                onChange={(e) => setVideoData(prev => ({
                                  ...prev,
                                  duration: { ...prev.duration, seconds: Number(e.target.value) }
                                }))}
                                className="w-full px-2 py-2 border border-border/60 rounded-lg text-sm text-center"
                              />
                            </div>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <span className="text-sm font-mono text-foreground">
                              {String(videoData.duration.hours).padStart(2, '0')}:
                              {String(videoData.duration.minutes).padStart(2, '0')}:
                              {String(videoData.duration.seconds).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Video Quality */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Chất lượng video</label>
                        <div className="space-y-2">
                          {(['720p', '1080p', '4k'] as const).map((quality) => (
                            <button
                              key={quality}
                              type="button"
                              onClick={() => setVideoData(prev => ({ ...prev, quality }))}
                              className={`w-full py-2.5 px-4 border-2 rounded-lg transition-all text-sm ${
                                videoData.quality === quality
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-border/60 hover:border-purple-300'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Compression Info (if enabled) */}
                    {videoData.compression?.enabled && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-900 font-medium mb-1">🗜️ Compression Enabled</p>
                        <p className="text-xs text-blue-700">
                          Quality: {videoData.compression?.targetQuality || 'high'} • Format: {videoData.compression?.targetFormat || 'mp4'}
                          {videoData.compression?.estimatedSize && ` • Estimated: ${videoData.compression.estimatedSize}MB`}
                        </p>
                      </div>
                    )}

                    {/* Tips */}
                    {videoData.url && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <p className="text-sm text-purple-900">
                          💡 <strong>Tip:</strong> Video đã được cấu hình! Thêm giới thiệu tóm tắt ở sidebar bên phải để hoàn thiện.
                        </p>
                      </div>
                    )}
                  </div>
                ) : articleType === 'infographic' ? (
                  /* Infographic Builder Trigger */
                  <div className="h-full flex items-center justify-center p-12">
                    <div className="max-w-2xl w-full text-center space-y-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-sky-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl mb-2">Trình chỉnh sửa Infographic</h3>
                        <p className="text-muted-foreground mb-6">
                          Tạo và chỉnh sửa infographic với công cụ thiết kế trực quan. 
                          {infographicElements.length > 0 && ` Hiện có ${infographicElements.length} phần tử.`}
                        </p>
                        <button
                          onClick={() => setShowInfographicEditor(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-200"
                        >
                          <BarChart3 className="w-5 h-5" />
                          {infographicElements.length > 0 ? 'Mở Infographic Editor' : 'Tạo Infographic'}
                        </button>
                      </div>
                      {infographicElements.length > 0 && (
                        <div className="pt-4 text-sm text-muted-foreground">
                          💡 Click vào nút để mở editor fullscreen và tiếp tục chỉnh sửa
                        </div>
                      )}
                    </div>
                  </div>
                ) : articleType === 'event' ? (
                  /* 📅 Event Form Fields */
                  <div className="space-y-6">
                    {/* Event Type Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Loại sự kiện *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['offline', 'online', 'hybrid'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setEventType(type)}
                            className={`py-3 px-4 border-2 rounded-xl transition-all text-sm font-medium ${
                              eventType === type
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-border/60 hover:border-orange-300'
                            }`}
                          >
                            {type === 'offline' && '📍 Offline'}
                            {type === 'online' && '💻 Online'}
                            {type === 'hybrid' && '🔄 Hybrid'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ngày bắt đầu *</label>
                        <input
                          type="date"
                          value={eventStartDate}
                          onChange={(e) => setEventStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Giờ bắt đầu *</label>
                        <input
                          type="time"
                          value={eventStartTime}
                          onChange={(e) => setEventStartTime(e.target.value)}
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
                        <input
                          type="date"
                          value={eventEndDate}
                          onChange={(e) => setEventEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Giờ kết thúc</label>
                        <input
                          type="time"
                          value={eventEndTime}
                          onChange={(e) => setEventEndTime(e.target.value)}
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Location (conditional based on event type) */}
                    {(eventType === 'offline' || eventType === 'hybrid') && (
                      <div>
                        <label className="block text-sm font-medium mb-2">📍 Địa điểm *</label>
                        <input
                          type="text"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="Ví dụ: Trung tâm Hội nghị Quốc gia, Hà Nội"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                    )}

                    {/* Online Link (conditional) */}
                    {(eventType === 'online' || eventType === 'hybrid') && (
                      <div>
                        <label className="block text-sm font-medium mb-2">💻 Link tham gia Online</label>
                        <input
                          type="url"
                          value={eventOnlineLink}
                          onChange={(e) => setEventOnlineLink(e.target.value)}
                          placeholder="https://zoom.us/j/xxxxx hoặc https://meet.google.com/xxx"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                    )}

                    {/* Organizer */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Đơn vị tổ chức *</label>
                      <input
                        type="text"
                        value={eventOrganizer}
                        onChange={(e) => setEventOrganizer(e.target.value)}
                        placeholder="Tên công ty, tổ chức"
                        className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* Capacity and Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Sức chứa</label>
                        <input
                          type="number"
                          value={eventCapacity}
                          onChange={(e) => setEventCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="100"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Giá vé</label>
                        <input
                          type="text"
                          value={eventPrice}
                          onChange={(e) => setEventPrice(e.target.value)}
                          placeholder="Miễn phí / 500,000 VNĐ"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Registration Link */}
                    <div>
                      <label className="block text-sm font-medium mb-2">🎟️ Link đăng ký</label>
                      <input
                        type="url"
                        value={eventRegistrationLink}
                        onChange={(e) => setEventRegistrationLink(e.target.value)}
                        placeholder="https://example.com/register"
                        className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* Event Status */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Trạng thái</label>
                      <div className="grid grid-cols-4 gap-3">
                        {(['upcoming', 'ongoing', 'completed', 'cancelled'] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setEventStatus(status)}
                            className={`py-2.5 px-3 border-2 rounded-xl transition-all text-sm ${
                              eventStatus === status
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-border/60 hover:border-orange-300'
                            }`}
                          >
                            {status === 'upcoming' && '🔜 Sắp diễn ra'}
                            {status === 'ongoing' && '▶️ Đang diễn ra'}
                            {status === 'completed' && '✅ Đã kết thúc'}
                            {status === 'cancelled' && '❌ Đã hủy'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Mô tả sự kiện</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Mô tả chi tiết về sự kiện, nội dung, lợi ích khi tham gia..."
                        rows={8}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-sm text-orange-900">
                        💡 <strong>Tip:</strong> Bạn có thể thêm thông tin về diễn giả, lịch trình chi tiết trong phần mô tả ở trên.
                      </p>
                    </div>
                  </div>
                ) : articleType === 'personnel' ? (
                  /* 👤 Personnel/HR Form Fields */
                  <div className="space-y-6">
                    {/* Personnel Photo */}
                    <div>
                      <label className="block text-sm font-medium mb-3">📸 Ảnh đại diện *</label>
                      
                      <input
                        ref={personnelPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePersonnelPhotoUpload}
                        className="hidden"
                      />

                      {personnelPhoto ? (
                        <div className="relative group inline-block">
                          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-blue-500 relative">
                            <img src={personnelPhoto} alt="Personnel" className="w-full h-full object-cover" />
                            
                            {/* Overlay buttons */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => personnelPhotoInputRef.current?.click()}
                                className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Thay đổi ảnh"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPersonnelPhoto('');
                                  setPersonnelPhotoFile(null);
                                }}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Xóa ảnh"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => personnelPhotoInputRef.current?.click()}
                          className="w-40 h-40 border-2 border-dashed border-border/60 rounded-2xl hover:border-blue-500/50 transition-all duration-200 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex flex-col items-center justify-center h-full">
                            <User className="w-12 h-12 text-blue-500 mb-2" />
                            <span className="text-sm text-muted-foreground">Tải ảnh lên</span>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                        <input
                          type="text"
                          value={personnelName}
                          onChange={(e) => setPersonnelName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Chức vụ *</label>
                        <input
                          type="text"
                          value={personnelPosition}
                          onChange={(e) => setPersonnelPosition(e.target.value)}
                          placeholder="Lập trình viên cao cấp"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Phòng ban</label>
                      <input
                        type="text"
                        value={personnelDepartment}
                        onChange={(e) => setPersonnelDepartment(e.target.value)}
                        placeholder="Phòng Công nghệ thông tin"
                        className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">📧 Email</label>
                        <input
                          type="email"
                          value={personnelEmail}
                          onChange={(e) => setPersonnelEmail(e.target.value)}
                          placeholder="nguyen.van.a@company.com"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">📱 Điện thoại</label>
                        <input
                          type="tel"
                          value={personnelPhone}
                          onChange={(e) => setPersonnelPhone(e.target.value)}
                          placeholder="0123 456 789"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Bio / Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Giới thiệu</label>
                      <textarea
                        value={personnelBio}
                        onChange={(e) => setPersonnelBio(e.target.value)}
                        placeholder="Thông tin tổng quan về nhân sự, thành tựu nổi bật, sở thích..."
                        rows={6}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-900">
                        💡 <strong>Tip:</strong> Ảnh đại diện nên có kích thước vuông (1:1) và dung lượng dưới 2MB để hiển thị tốt nhất.
                      </p>
                    </div>
                  </div>
                ) : articleType === 'faq' ? (
                  /* ❓ FAQ Form Fields */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-cyan-900">
                        💡 <strong>FAQ:</strong> Thêm các câu hỏi thường gặp và câu trả lời tương ứng. Bạn có thể phân loại theo chủ đề.
                      </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                      {faqItems.map((item, index) => (
                        <div key={item.id} className="border border-border/60 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Câu hỏi #{index + 1}</span>
                            {faqItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setFaqItems(faqItems.filter(i => i.id !== item.id))}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Danh mục (tùy chọn)</label>
                            <input
                              type="text"
                              value={item.category}
                              onChange={(e) => {
                                const updated = faqItems.map(i => 
                                  i.id === item.id ? { ...i, category: e.target.value } : i
                                );
                                setFaqItems(updated);
                              }}
                              placeholder="VD: Tài khoản, Thanh toán, Sản phẩm..."
                              className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">❓ Câu hỏi</label>
                            <input
                              type="text"
                              value={item.question}
                              onChange={(e) => {
                                const updated = faqItems.map(i => 
                                  i.id === item.id ? { ...i, question: e.target.value } : i
                                );
                                setFaqItems(updated);
                              }}
                              placeholder="Nhập câu hỏi..."
                              className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">💬 Câu trả lời</label>
                            <textarea
                              value={item.answer}
                              onChange={(e) => {
                                const updated = faqItems.map(i => 
                                  i.id === item.id ? { ...i, answer: e.target.value } : i
                                );
                                setFaqItems(updated);
                              }}
                              placeholder="Nhập câu trả lời chi tiết..."
                              rows={4}
                              className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => {
                          const newId = Math.max(...faqItems.map(i => i.id), 0) + 1;
                          setFaqItems([...faqItems, { id: newId, question: '', answer: '', category: '' }]);
                        }}
                        className="w-full py-3 border-2 border-dashed border-border/60 rounded-xl text-muted-foreground hover:border-cyan-500 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm câu hỏi
                      </button>
                    </div>
                  </div>
                ) : articleType === 'pdf' ? (
                  /* 📄 PDF Form Fields */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-rose-900">
                        💡 <strong>PDF:</strong> Tải lên tài liệu PDF hoặc nhập URL. Hệ thống sẽ tự động trích xuất thông tin.
                      </p>
                    </div>

                    {/* PDF Upload/URL */}
                    <div>
                      <label className="block text-sm font-medium mb-3">📄 Tệp PDF</label>
                      
                      <input
                        ref={pdfFileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPdfFile(file);
                            setPdfTitle(file.name.replace('.pdf', ''));
                            setPdfFileSize(file.size);
                            setPdfPages(0);
                          }
                        }}
                        className="hidden"
                      />

                      {pdfFile || pdfUrl ? (
                        <div className="border-2 border-rose-500 rounded-xl p-4 bg-rose-50/50">
                          <div className="flex items-center gap-3 mb-3">
                            <FileType className="w-8 h-8 text-rose-600" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{pdfFile?.name || pdfUrl}</p>
                              <p className="text-xs text-muted-foreground">
                                {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : 'External URL'}
                                {pdfPages > 0 && ` • ${pdfPages} trang`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => pdfFileInputRef.current?.click()}
                              className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              Thay đổi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPdfFile(null);
                                setPdfUrl('');
                                setPdfPages(0);
                                setPdfFileSize(0);
                              }}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => pdfFileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-border/60 rounded-xl p-8 hover:border-rose-500 hover:bg-rose-50/50 transition-all group"
                        >
                          <FileType className="w-12 h-12 text-muted-foreground group-hover:text-rose-600 mx-auto mb-3" />
                          <p className="text-sm font-medium text-muted-foreground group-hover:text-rose-600">
                            Nhấn để chọn tệp PDF
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Hỗ trợ file PDF dưới 50MB
                          </p>
                        </button>
                      )}

                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-2">Hoặc nhập URL PDF</label>
                        <input
                          type="url"
                          value={pdfUrl}
                          onChange={(e) => setPdfUrl(e.target.value)}
                          placeholder="https://example.com/document.pdf"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        />
                      </div>
                    </div>

                    {/* PDF Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">📝 Tiêu đề tài liệu</label>
                      <input
                        type="text"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        placeholder="Nhập tiêu đề tài liệu..."
                        className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                    </div>

                    {/* PDF Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Mô tả tài liệu</label>
                      <textarea
                        value={pdfDescription}
                        onChange={(e) => setPdfDescription(e.target.value)}
                        placeholder="Mô tả ngắn gọn về nội dung tài liệu..."
                        rows={4}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                      />
                    </div>
                  </div>
                ) : articleType === 'download' ? (
                  /* 📥 Download Form Fields */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-teal-900">
                        💡 <strong>Tải xuống:</strong> Tải lên file hoặc nhập URL. Phù hợp cho phần mềm, tài liệu, template, v.v.
                      </p>
                    </div>

                    {/* File Upload/URL */}
                    <div>
                      <label className="block text-sm font-medium mb-3">📥 Tệp tải xuống</label>
                      
                      <input
                        ref={downloadFileInputRef}
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDownloadFile(file);
                            setDownloadTitle(file.name);
                            setDownloadFileSize(file.size);
                          }
                        }}
                        className="hidden"
                      />

                      {downloadFile || downloadUrl ? (
                        <div className="border-2 border-teal-500 rounded-xl p-4 bg-teal-50/50">
                          <div className="flex items-center gap-3 mb-3">
                            <Download className="w-8 h-8 text-teal-600" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{downloadFile?.name || downloadUrl}</p>
                              <p className="text-xs text-muted-foreground">
                                {downloadFile ? `${(downloadFile.size / 1024 / 1024).toFixed(2)} MB` : 'External URL'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => downloadFileInputRef.current?.click()}
                              className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              Thay đổi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDownloadFile(null);
                                setDownloadUrl('');
                              }}
                              className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => downloadFileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-border/60 rounded-xl p-8 hover:border-teal-500 hover:bg-teal-50/50 transition-all group"
                        >
                          <Download className="w-12 h-12 text-muted-foreground group-hover:text-teal-600 mx-auto mb-3" />
                          <p className="text-sm font-medium text-muted-foreground group-hover:text-teal-600">
                            Nhấn để chọn tệp
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Hỗ trợ mọi loại file dưới 100MB
                          </p>
                        </button>
                      )}

                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-2">Hoặc nhập URL</label>
                        <input
                          type="url"
                          value={downloadUrl}
                          onChange={(e) => setDownloadUrl(e.target.value)}
                          placeholder="https://example.com/file.zip"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Download Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">📝 Tên file</label>
                      <input
                        type="text"
                        value={downloadTitle}
                        onChange={(e) => setDownloadTitle(e.target.value)}
                        placeholder="VD: Document-v1.0.zip"
                        className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    {/* Grid: Version & File Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">🔢 Phiên bản</label>
                        <input
                          type="text"
                          value={downloadVersion}
                          onChange={(e) => setDownloadVersion(e.target.value)}
                          placeholder="VD: 1.0.0, v2.3.1"
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">📁 Loại file</label>
                        <select
                          value={downloadFileType}
                          onChange={(e) => setDownloadFileType(e.target.value as any)}
                          className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                          <option value="software">Phần mềm</option>
                          <option value="document">Tài liệu</option>
                          <option value="template">Template</option>
                          <option value="media">Media (Audio/Video)</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>

                    {/* Download Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">📄 Mô tả</label>
                      <textarea
                        value={downloadDescription}
                        onChange={(e) => setDownloadDescription(e.target.value)}
                        placeholder="Mô tả chi tiết về file tải xuống..."
                        rows={4}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                      />
                    </div>

                    {/* System Requirements (Optional) */}
                    <div>
                      <label className="block text-sm font-medium mb-2">💻 Yêu cầu hệ thống (tùy chọn)</label>
                      <textarea
                        value={systemRequirements}
                        onChange={(e) => setSystemRequirements(e.target.value)}
                        placeholder="VD: Windows 10+, macOS 11+, RAM 8GB, Disk 500MB..."
                        rows={3}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                      />
                    </div>

                    {/* Release Notes (Optional) */}
                    <div>
                      <label className="block text-sm font-medium mb-2">📋 Ghi chú phát hành (tùy chọn)</label>
                      <textarea
                        value={releaseNotes}
                        onChange={(e) => setReleaseNotes(e.target.value)}
                        placeholder="Ghi chú về các tính năng mới, sửa lỗi, cải tiến..."
                        rows={4}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* 📰 Professional News Editor */
                  <div className="space-y-6">
                    {/* Excerpt / Tóm tắt */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Tóm tắt bài viết (Excerpt) *
                        </label>
                        <button
                          type="button"
                          onClick={generateExcerpt}
                          className="px-3 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
                        >
                          <Wand2 className="w-3 h-3" />
                          Tạo tự động
                        </button>
                      </div>
                      <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Nhập tóm tắt ngắn gọn về bài viết (150-300 ký tự)..."
                        rows={3}
                        maxLength={300}
                        className="w-full px-4 py-3 border border-border/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          Tóm tắt hiển thị trong danh sách bài viết và kết quả tìm kiếm
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {excerpt.length}/300
                        </p>
                      </div>
                    </div>

                    {/* Main Content Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Nội dung bài viết *
                        </label>
                      </div>

                      <ContentSectionEditor
                        initialSections={sections}
                        onChange={(newSections) => setSections(newSections)}
                      />
                      
                      {/* Reading Time Display */}
                      {sections.length > 0 && (
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Thời gian đọc: {readingTime} phút</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{sections.length} sections</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Source Attribution */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nguồn tin</label>
                        <input
                          type="text"
                          value={newsSource}
                          onChange={(e) => setNewsSource(e.target.value)}
                          placeholder="VD: Reuters, AFP, VnExpress..."
                          className="w-full px-4 py-2 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Link nguồn</label>
                        <input
                          type="url"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-4 py-2 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    {/* Breaking News Toggle */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBreakingNews}
                          onChange={(e) => setIsBreakingNews(e.target.checked)}
                          className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500/20"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-red-900 flex items-center gap-2">
                            🔴 Đánh dấu là tin nóng (Breaking News)
                          </div>
                          <div className="text-xs text-red-700 mt-0.5">
                            Tin nóng sẽ được hiển thị nổi bật ở đầu trang và có badge đặc biệt
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* AI Headlines Suggestions */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <h4 className="font-medium text-purple-900">AI Headline Suggestions</h4>
                        </div>
                        <button
                          type="button"
                          onClick={generateAIHeadlines}
                          disabled={generatingAI || !title}
                          className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {generatingAI ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Đang tạo...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3 h-3" />
                              Tạo gợi ý
                            </>
                          )}
                        </button>
                      </div>
                      {aiSuggestions.length > 0 ? (
                        <div className="space-y-2">
                          {aiSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setTitle(suggestion)}
                              className="w-full text-left px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all text-sm"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-purple-700">
                          Click "Tạo gợi ý" để AI đề xuất các tiêu đề hấp dẫn hơn
                        </p>
                      )}
                    </div>

                    {/* SEO Optimization Panel */}
                    <div className="border border-border/60 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowSEOPanel(!showSEOPanel)}
                        className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-900">SEO Optimization</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            calculateSEOScore() >= 80 ? 'bg-green-600 text-white' :
                            calculateSEOScore() >= 50 ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {calculateSEOScore()}/100
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-green-600 transition-transform ${showSEOPanel ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSEOPanel && (
                        <div className="p-4 space-y-4 bg-white">
                          {/* Meta Title */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium">Tiêu đề Meta</label>
                              <button
                                type="button"
                                onClick={generateSEOMeta}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Tự động
                              </button>
                            </div>
                            <input
                              type="text"
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value)}
                              placeholder="Tiêu đề SEO (30-60 ký tự)"
                              maxLength={60}
                              className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            />
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs ${
                                metaTitle.length >= 30 && metaTitle.length <= 60 ? 'text-green-600' : 'text-red-500'
                              }`}>
                                {metaTitle.length}/60 ký tự
                              </p>
                              {metaTitle.length >= 30 && metaTitle.length <= 60 && (
                                <span className="text-xs text-green-600">✓ Tối ưu</span>
                              )}
                            </div>
                          </div>

                          {/* Meta Description */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Mô tả Meta</label>
                            <textarea
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value)}
                              placeholder="Mô tả SEO (120-160 ký tự)"
                              maxLength={160}
                              rows={3}
                              className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            />
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs ${
                                metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-green-600' : 'text-red-500'
                              }`}>
                                {metaDescription.length}/160 ký tự
                              </p>
                              {metaDescription.length >= 120 && metaDescription.length <= 160 && (
                                <span className="text-xs text-green-600">✓ Tối ưu</span>
                              )}
                            </div>
                          </div>

                          {/* Focus Keyword */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Từ khóa trọng tâm</label>
                            <input
                              type="text"
                              value={focusKeyword}
                              onChange={(e) => setFocusKeyword(e.target.value)}
                              placeholder="Từ khóa chính của bài viết"
                              className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            />
                            {focusKeyword && (
                              <div className="mt-2 text-xs space-y-1">
                                <p className={title.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'text-green-600' : 'text-red-500'}>
                                  {title.toLowerCase().includes(focusKeyword.toLowerCase()) ? '✓' : '✗'} Keyword trong tiêu đề
                                </p>
                                <p className={content.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'text-green-600' : 'text-red-500'}>
                                  {content.toLowerCase().includes(focusKeyword.toLowerCase()) ? '✓' : '✗'} Keyword trong nội dung
                                </p>
                              </div>
                            )}
                          </div>

                          {/* SEO Tips */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs text-green-800">
                              <strong>💡 SEO Tips:</strong> Sử dụng từ khóa tự nhiên trong tiêu đề và nội dung • 
                              Meta description hấp dẫn tăng CTR • Thêm ảnh đại diện với alt text
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Media Preview */}
                    <div className="border border-border/60 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowSocialPreview(!showSocialPreview)}
                        className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Xem trước mạng xã hội</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${showSocialPreview ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSocialPreview && (
                        <div className="p-4 space-y-4 bg-white">
                          {/* Facebook Preview */}
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-2">Xem trước Facebook</p>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              {featuredImage && (
                                <div className="aspect-[1.91/1] bg-gray-100">
                                  <img src={featuredImage} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="p-3 bg-gray-50">
                                <p className="text-xs text-gray-500 uppercase mb-1">yoursite.com</p>
                                <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                  {title || 'Tiêu đề bài viết'}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {excerpt || 'Tóm tắt bài viết sẽ hiển thị ở đây...'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Twitter Preview */}
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-2">Xem trước Twitter/X</p>
                            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                              {featuredImage && (
                                <div className="aspect-[2/1] bg-gray-100">
                                  <img src={featuredImage} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="p-3">
                                <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                                  {title || 'Tiêu đề bài viết'}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {excerpt || 'Tóm tắt bài viết...'}
                                </p>
                                <p className="text-xs text-gray-400">🔗 yoursite.com</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Advanced Options */}
                    <div className="border border-border/60 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">Tùy chọn nâng cao</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showAdvancedOptions && (
                        <div className="p-4 space-y-4 bg-white">
                          {/* Location */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Địa điểm</label>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="VD: Hà Nội, TP.HCM, Đà Nẵng..."
                              className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                          </div>

                          {/* Featured & Sticky */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span className="text-sm">✨ Bài viết nổi bật (Featured)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSticky}
                                onChange={(e) => setIsSticky(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span className="text-sm">📌 Ghim lên đầu (Sticky)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={allowComments}
                                onChange={(e) => setAllowComments(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span className="text-sm">💬 Cho phép bình luận</span>
                            </label>
                          </div>

                          {/* Publish Schedule */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Lên lịch đăng bài</label>
                            <input
                              type="datetime-local"
                              value={publishSchedule ? publishSchedule.toISOString().slice(0, 16) : ''}
                              onChange={(e) => setPublishSchedule(e.target.value ? new Date(e.target.value) : null)}
                              className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                            {publishSchedule && (
                              <p className="text-xs text-gray-600 mt-1">
                                📅 Đăng lúc: {publishSchedule.toLocaleString('vi-VN')}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Quality Checker */}
                    <div className="border border-border/60 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowContentQuality(!showContentQuality)}
                        className="w-full px-4 py-3 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-900">Chất lượng nội dung</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            contentQualityScore >= 80 ? 'bg-green-600 text-white' :
                            contentQualityScore >= 50 ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {contentQualityScore}/100
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-orange-600 transition-transform ${showContentQuality ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showContentQuality && (
                        <div className="p-4 space-y-4 bg-white">
                          {/* Quality Metrics */}
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Số từ</span>
                                <span className={`text-sm font-medium ${
                                  content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length >= 300 ? 'text-green-600' : 'text-red-500'
                                }`}>
                                  {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length} từ
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length >= 300 ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length / 300) * 100)}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Độ dễ đọc</span>
                                <span className={`text-sm font-medium ${
                                  readabilityScore >= 60 ? 'text-green-600' :
                                  readabilityScore >= 30 ? 'text-yellow-600' :
                                  'text-red-500'
                                }`}>
                                  {readabilityScore}/100
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    readabilityScore >= 60 ? 'bg-green-500' :
                                    readabilityScore >= 30 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${readabilityScore}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {readabilityScore >= 60 ? 'Dễ đọc' : readabilityScore >= 30 ? 'Trung bình' : 'Khó đọc'}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Chất lượng tổng thể</span>
                                <span className={`text-sm font-medium ${
                                  contentQualityScore >= 80 ? 'text-green-600' :
                                  contentQualityScore >= 50 ? 'text-yellow-600' :
                                  'text-red-500'
                                }`}>
                                  {contentQualityScore >= 80 ? 'Xuất sắc' :
                                   contentQualityScore >= 50 ? 'Tốt' : 'Cần cải thiện'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    contentQualityScore >= 80 ? 'bg-green-500' :
                                    contentQualityScore >= 50 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${contentQualityScore}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quality Checklist */}
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Danh sách kiểm tra:</p>
                            <div className="space-y-1.5">
                              <div className={`flex items-center gap-2 text-xs ${
                                content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length >= 300 ? 'text-green-600' : 'text-gray-400'
                              }`}>
                                {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length >= 300 ? '✓' : '○'} Tối thiểu 300 từ
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${featuredImage ? 'text-green-600' : 'text-gray-400'}`}>
                                {featuredImage ? '✓' : '○'} Có ảnh đại diện
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${excerpt.length >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                                {excerpt.length >= 100 ? '✓' : '○'} Có tóm tắt (100+ ký tự)
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${
                                content.includes('<h2>') || content.includes('<h3>') ? 'text-green-600' : 'text-gray-400'
                              }`}>
                                {content.includes('<h2>') || content.includes('<h3>') ? '✓' : '○'} Có tiêu đề phụ
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${content.includes('<a ') ? 'text-green-600' : 'text-gray-400'}`}>
                                {content.includes('<a ') ? '✓' : '○'} Có liên kết
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Templates */}
                    <div className="border border-border/60 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="w-full px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-indigo-900">Mẫu nội dung</span>
                          {selectedTemplate && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                              Đang dùng
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-indigo-600 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showTemplates && (
                        <div className="bg-white">
                          {/* Search & Filter */}
                          <div className="p-4 border-b border-gray-200 space-y-3">
                            {/* Search */}
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={templateSearch}
                                onChange={(e) => setTemplateSearch(e.target.value)}
                                placeholder="Tìm kiếm template..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              />
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-1.5 flex-wrap">
                              <button
                                onClick={() => setTemplateCategory('all')}
                                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                  templateCategory === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Tất cả ({newsTemplates.length})
                              </button>
                              {getCategories().map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setTemplateCategory(cat)}
                                  className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                    templateCategory === cat
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {cat} ({getTemplatesByCategory(cat).length})
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Templates Grid */}
                          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                            {newsTemplates
                              .filter(t => {
                                const matchesCategory = templateCategory === 'all' || t.category === templateCategory;
                                const matchesSearch = templateSearch === '' || 
                                  t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                                  t.description.toLowerCase().includes(templateSearch.toLowerCase());
                                return matchesCategory && matchesSearch;
                              })
                              .map(template => (
                                <button
                                  key={template.id}
                                  type="button"
                                  onClick={() => applyTemplate(template.id)}
                                  className={`w-full text-left p-3 border-2 rounded-lg transition-all hover:shadow-md ${
                                    selectedTemplate === template.id
                                      ? 'border-indigo-500 bg-indigo-50'
                                      : 'border-gray-200 hover:border-indigo-300'
                                  }`}
                                >
                                  {/* Header */}
                                  <div className="flex items-start gap-3 mb-2">
                                    <span className="text-2xl">{template.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900">{template.name}</h4>
                                        {selectedTemplate === template.id && (
                                          <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                                            Đang dùng
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                                    </div>
                                  </div>

                                  {/* Meta Info */}
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {template.estimatedTime}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full ${
                                      template.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                      template.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {template.difficulty === 'easy' ? 'Dễ' : 
                                       template.difficulty === 'medium' ? 'Trung bình' : 'Nâng cao'}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                      {template.category}
                                    </span>
                                  </div>
                                </button>
                              ))}

                            {/* No Results */}
                            {newsTemplates.filter(t => {
                              const matchesCategory = templateCategory === 'all' || t.category === templateCategory;
                              const matchesSearch = templateSearch === '' || 
                                t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                                t.description.toLowerCase().includes(templateSearch.toLowerCase());
                              return matchesCategory && matchesSearch;
                            }).length === 0 && (
                              <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">Không tìm thấy template phù hợp</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Related Articles */}
                    <div className="border border-border/60 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowRelatedArticles(!showRelatedArticles)}
                        className="w-full px-4 py-3 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4 text-teal-600" />
                          <span className="font-medium text-teal-900">Bài viết liên quan</span>
                          {selectedRelatedArticles.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-600 text-white">
                              {selectedRelatedArticles.length}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-teal-600 transition-transform ${showRelatedArticles ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showRelatedArticles && (
                        <div className="p-4 bg-white">
                          <RelatedArticlesPicker
                            selectedArticles={selectedRelatedArticles}
                            onChange={setSelectedRelatedArticles}
                            currentArticleTitle={title}
                            currentArticleCategory={selectedCategories[0]?.name}
                          />
                        </div>
                      )}
                    </div>

                    {/* Auto-save Status */}
                    {lastAutoSave && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Save className="w-3 h-3" />
                          <span>
                            {autoSaving ? (
                              'Đang lưu nháp...'
                            ) : (
                              `Đã lưu nháp: ${lastAutoSave.toLocaleTimeString('vi-VN')}`
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-sm text-purple-900">
                        💡 <strong>Tips:</strong> Ảnh đại diện chất lượng cao và tóm tắt hấp dẫn sẽ tăng tỷ lệ click • 
                        Thời gian đọc được tính tự động dựa trên nội dung • 
                        Ghi rõ nguồn tin để tăng độ tin cậy
                      </p>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex-shrink-0 w-8 flex items-center justify-center bg-muted/30 hover:bg-muted/50 border-x border-border/40 transition-colors group"
              title={sidebarCollapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelRightOpen className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <PanelRightClose className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>

            {/* Right Sidebar - Attributes */}
            <div className={`bg-card/50 overflow-y-auto transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[280px]'}`}>
              <div className="p-4 space-y-4">
                {/* Categories - Multi Select */}
                <div>
                  <label className="block text-foreground mb-2 flex items-center gap-2">
                    <FolderTree className="w-4 h-4" />
                    Danh mục *
                  </label>
                  <div className="relative" ref={categoryPickerRef}>
                    <button
                      onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                      className="w-full px-3 py-2.5 border border-border/60 rounded-xl hover:bg-muted/30 transition-all duration-200 flex items-center justify-between"
                    >
                      <span className="text-muted-foreground text-sm">
                        {selectedCategories.length} đã chọn
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showCategoryPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto animate-slide-in-top">
                        <div className="p-3 border-b border-border/60">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Tìm danh mục..."
                              className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          {availableCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => toggleCategory(cat.name)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                selectedCategories.includes(cat.name)
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-muted/30'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                selectedCategories.includes(cat.name)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-border/60'
                              }`}>
                                {selectedCategories.includes(cat.name) && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Categories */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedCategories.map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1.5"
                        >
                          {cat}
                          <button
                            onClick={() => toggleCategory(cat)}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Image Section - MOVED FROM CONTENT AREA */}
                {articleType === 'news' && (
                  <div>
                    <label className="block text-foreground mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Ảnh đại diện *
                    </label>
                    
                    <input
                      ref={featuredImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      className="hidden"
                    />

                    {featuredImage ? (
                      <div className="relative group">
                        <div className="aspect-video rounded-xl overflow-hidden border-2 border-purple-500 relative">
                          <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                          
                          {/* Overlay buttons */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => featuredImageInputRef.current?.click()}
                              className="px-3 py-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
                            >
                              <Upload className="w-3 h-3" />
                              Thay đổi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFeaturedImage('');
                                setFeaturedImageFile(null);
                              }}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                              Xóa
                            </button>
                          </div>

                          {/* Breaking News Badge */}
                          {isBreakingNews && (
                            <div className="absolute top-2 left-2 z-10">
                              <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse flex items-center gap-1">
                                🔴 HOT
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Image Caption & Credit */}
                        <div className="mt-2 space-y-2">
                          <input
                            type="text"
                            value={imageCaption}
                            onChange={(e) => setImageCaption(e.target.value)}
                            placeholder="Chú thích ảnh..."
                            className="w-full px-3 py-2 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                          <input
                            type="text"
                            value={imageCredit}
                            onChange={(e) => setImageCredit(e.target.value)}
                            placeholder="Nguồn ảnh..."
                            className="w-full px-3 py-2 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => featuredImageInputRef.current?.click()}
                        className="w-full aspect-video border-2 border-dashed border-border/60 rounded-xl hover:border-purple-500/50 transition-all duration-200 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative h-full flex flex-col items-center justify-center">
                          <div className="w-12 h-12 mb-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <h3 className="text-sm text-foreground mb-1">Tải ảnh đại diện</h3>
                          <p className="text-xs text-muted-foreground px-4 text-center">
                            PNG, JPG, WebP
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-foreground mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1.5"
                      >
                        #{tag}
                        <button
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="hover:bg-border rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Thêm tag..."
                    className="w-full px-3 py-2 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setTags([...tags, e.currentTarget.value]);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div className="h-px bg-border/60" />

                {/* Type-specific fields */}
                {renderTypeSpecificFields()}

                <div className="h-px bg-border/60" />

                {/* Author - With Add New */}
                <div>
                  <label className="block text-foreground mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tác giả *
                  </label>
                  
                  {showAddAuthor ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newAuthorName}
                        onChange={(e) => setNewAuthorName(e.target.value)}
                        placeholder="Nhập tên tác giả mới..."
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddAuthor}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                        >
                          Thêm
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAuthor(false);
                            setNewAuthorName('');
                          }}
                          className="px-4 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="flex-1 px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        {authors.map((author) => (
                          <option key={author} value={author}>
                            {author}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowAddAuthor(true)}
                        className="p-3 border border-border/60 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 group"
                        title="Thêm tác giả mới"
                      >
                        <Plus className="w-5 h-5 text-muted-foreground group-hover:text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-foreground mb-2">Lên lịch xuất bản</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Preview Mode - Single Column Full Width */
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-muted/20 to-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Article Header */}
              <div className="mb-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <span>Trang chủ</span>
                  <span>/</span>
                  {selectedCategories[0] && <span>{selectedCategories[0]}</span>}
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-4">
                  {articleTypes.find(t => t.id === articleType) && (() => {
                    const type = articleTypes.find(t => t.id === articleType)!;
                    const Icon = type.icon;
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-${type.color}-100 text-${type.color}-700 rounded-full text-sm`}>
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Title */}
                <h1 className="text-foreground mb-6">
                  {title || 'Tiêu đề bài viết'}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedAuthor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                  {articleType === 'news' && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{readingTime} phút đọc</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Content - Different per type */}
              <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                {articleType === 'news' && (
                  <div>
                    {/* Featured Image */}
                    <div className="aspect-[21/9] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                      {featuredImage ? (
                        <>
                          <img src={featuredImage} alt={title || 'Featured'} className="w-full h-full object-cover" />
                          
                          {/* Breaking News Badge */}
                          {isBreakingNews && (
                            <div className="absolute top-6 left-6 z-10">
                              <span className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg shadow-lg animate-pulse flex items-center gap-2">
                                🔴 BREAKING NEWS
                              </span>
                            </div>
                          )}
                          
                          {/* Image Caption & Credit Overlay */}
                          {(imageCaption || imageCredit) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                              {imageCaption && (
                                <p className="text-white text-sm mb-1">{imageCaption}</p>
                              )}
                              {imageCredit && (
                                <p className="text-white/70 text-xs">📷 {imageCredit}</p>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-16 h-16 text-blue-400" />
                          {isBreakingNews && (
                            <div className="absolute top-6 left-6">
                              <span className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg shadow-lg animate-pulse flex items-center gap-2">
                                🔴 BREAKING NEWS
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      {/* Excerpt */}
                      {excerpt && (
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                          <p className="text-blue-900 italic">{excerpt}</p>
                        </div>
                      )}
                      
                      {/* Main Content */}
                      <div className="prose prose-lg max-w-none">
                        {contentMode === 'sections' && sections.length > 0 ? (
                          <SectionPreviewRenderer sections={sections} />
                        ) : content ? (
                          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                        ) : (
                          <p className="text-muted-foreground">Nội dung bài viết sẽ hiển thị ở đây...</p>
                        )}
                      </div>
                      
                      {/* Source Attribution */}
                      {(newsSource || sourceUrl) && (
                        <div className="mt-8 pt-6 border-t border-border/60">
                          <p className="text-sm text-muted-foreground">
                            <strong>Nguồn:</strong>{' '}
                            {sourceUrl ? (
                              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {newsSource || sourceUrl}
                              </a>
                            ) : (
                              <span>{newsSource}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {articleType === 'video' && (
                  <div>
                    {/* Video Player */}
                    <div className="aspect-video bg-black relative group">
                      {videoData.url && videoData.sourceType === 'youtube' && extractYouTubeId(videoData.url) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(videoData.url)}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : videoData.url && videoData.sourceType === 'vimeo' && extractVimeoId(videoData.url) ? (
                        <iframe
                          src={`https://player.vimeo.com/video/${extractVimeoId(videoData.url)}`}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      ) : videoData.url && (videoData.sourceType === 'url' || videoData.sourceType === 'upload') ? (
                        <video
                          src={videoData.url}
                          className="w-full h-full"
                          controls
                          poster={videoData.thumbnail}
                        />
                      ) : videoData.thumbnail ? (
                        <div className="relative w-full h-full">
                          <img src={videoData.thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
                              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-1" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-red-100 to-red-200">
                          <div className="text-center">
                            <Video className="w-20 h-20 text-red-400 mx-auto mb-4" />
                            <p className="text-red-700">Trình phát video</p>
                            <p className="text-sm text-red-600 mt-2">Chưa có video</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Video Duration Badge */}
                      {(videoData.duration.hours > 0 || videoData.duration.minutes > 0 || videoData.duration.seconds > 0) && (
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-mono">
                          {String(videoData.duration.hours).padStart(2, '0')}:
                          {String(videoData.duration.minutes).padStart(2, '0')}:
                          {String(videoData.duration.seconds).padStart(2, '0')}
                        </div>
                      )}
                      
                      {/* Quality Badge */}
                      <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                        {videoData.quality}
                      </div>
                    </div>
                    
                    {/* Video Info & Chapters */}
                    <div className="p-8">
                      {/* Description */}
                      {content && (
                        <div className="prose prose-lg max-w-none mb-8">
                          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                        </div>
                      )}
                      
                      {/* Chapters */}
                      {videoData.chapters.length > 0 && (
                        <div className="border-t border-border/60 pt-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Các chương
                          </h3>
                          <div className="space-y-3">
                            {videoData.chapters.map((chapter) => (
                              <div
                                key={chapter.id}
                                className="flex gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group"
                              >
                                <div className="flex-shrink-0 w-20 text-center">
                                  <div className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-mono group-hover:bg-red-200 transition-colors">
                                    {chapter.timestamp}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-foreground font-medium group-hover:text-red-600 transition-colors">
                                    {chapter.title}
                                  </h4>
                                  {chapter.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {chapter.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Transcript */}
                      {videoData.transcript && (
                        <div className="border-t border-border/60 pt-6 mt-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Transcript
                          </h3>
                          <div className="prose max-w-none text-muted-foreground bg-muted/20 p-6 rounded-xl">
                            <p className="whitespace-pre-wrap">{videoData.transcript}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Subtitles Info */}
                      {videoData.hasSubtitles && videoData.subtitleFile && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Có phụ đề: {videoData.subtitleFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {articleType === 'gallery' && (
                  <div className="p-8">
                    {galleryImages.length > 0 ? (
                      <div className="space-y-8">
                        {galleryImages.map((img) => (
                          <div key={img.id} className="space-y-3">
                            <div className="rounded-xl overflow-hidden">
                              <img 
                                src={img.url} 
                                alt={img.caption} 
                                className="w-full h-auto"
                              />
                            </div>
                            {img.caption && (
                              <p className="text-center text-muted-foreground italic">
                                {img.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Chưa có ảnh nào trong gallery</p>
                      </div>
                    )}
                  </div>
                )}

                {articleType === 'legal' && (
                  <div className="p-8">
                    {/* Legal Document Info */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Số hiệu:</span>
                          <span className="ml-2 font-medium">15/2024/NĐ-CP</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Loại:</span>
                          <span className="ml-2 font-medium">Nghị định</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ngày ban hành:</span>
                          <span className="ml-2 font-medium">01/01/2024</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ngày hiệu lực:</span>
                          <span className="ml-2 font-medium">01/03/2024</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Cơ quan ban hành:</span>
                          <span className="ml-2 font-medium">Chính phủ</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-muted-foreground">Nội dung văn bản pháp luật...</p>
                      )}
                    </div>

                    {/* Download Button */}
                    <div className="mt-6 pt-6 border-t border-border/60">
                      <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Tải xuống văn bản (PDF)</span>
                      </button>
                    </div>
                  </div>
                )}

                {articleType === 'job' && (
                  <div className="p-8">
                    {/* Job Info Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Cấp bậc</p>
                        <p className="font-medium text-green-700">Senior</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Số lượng</p>
                        <p className="font-medium text-green-700">2 người</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Mức lương</p>
                        <p className="font-medium text-green-700">25-35 triệu</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Hạn nộp</p>
                        <p className="font-medium text-green-700">31/12/2024</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-6">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-muted-foreground">Mô tả công việc và yêu cầu...</p>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="pt-6 border-t border-border/60">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all">
                        <Briefcase className="w-5 h-5" />
                        <span>Ứng tuyển ngay</span>
                      </button>
                    </div>
                  </div>
                )}

                {articleType === 'podcast' && (
                  <div>
                    {/* Podcast Cover */}
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center max-w-md mx-auto">
                      <div className="text-center">
                        <Mic className="w-20 h-20 text-pink-400 mx-auto mb-4" />
                        <p className="text-pink-700">Ảnh bìa album</p>
                      </div>
                    </div>
                    
                    {/* Audio Player Placeholder */}
                    <div className="p-8">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <button className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                            ▶
                          </button>
                          <div className="flex-1">
                            <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                              <div className="h-full w-1/3 bg-pink-500 rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">15:20 / 45:30</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Mùa 2, Tập 12</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose prose-lg max-w-none">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                        ) : (
                          <p className="text-muted-foreground">Mô tả podcast...</p>
                        )}
                      </div>

                      {/* Guests */}
                      <div className="mt-6 pt-6 border-t border-border/60">
                        <h3 className="mb-3">Khách mời</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>TS. Nguyễn Văn X - Nhà nghiên cứu AI</p>
                          <p>Ms. Trần Thị Y - Chiến lược gia nội dung</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {articleType === 'event' && (
                  <div className="p-8">
                    {/* Event Info */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-500 text-white rounded-xl p-4 text-center min-w-[80px]">
                          <div className="text-2xl font-bold">26</div>
                          <div className="text-sm">Th12</div>
                        </div>
                        <div>
                          <h3 className="text-orange-900 mb-2">Sự kiện Tech Conference 2024</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>📍 Hà Nội</p>
                            <p>🕐 09:00 - 17:00</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-6">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-muted-foreground">Thông tin sự kiện...</p>
                      )}
                    </div>

                    {/* Register Button */}
                    <div className="pt-6 border-t border-border/60">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all">
                        <Calendar className="w-5 h-5" />
                        <span>Đăng ký tham dự</span>
                      </button>
                    </div>
                  </div>
                )}

                {articleType === 'personnel' && (
                  <div className="p-8">
                    {/* Personnel Header */}
                    <div className="flex items-start gap-6 mb-8">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        {personnelPhoto ? (
                          <img 
                            src={personnelPhoto} 
                            alt={personnelName}
                            className="w-40 h-40 rounded-2xl object-cover border-4 border-blue-500 shadow-lg"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-blue-500">
                            <User className="w-20 h-20 text-blue-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                          {personnelName || 'Tên nhân sự'}
                        </h2>
                        
                        {personnelPosition && (
                          <p className="text-xl text-blue-600 mb-2">{personnelPosition}</p>
                        )}
                        
                        {personnelDepartment && (
                          <p className="text-muted-foreground mb-4">{personnelDepartment}</p>
                        )}

                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {personnelEmail && (
                            <a href={`mailto:${personnelEmail}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                              <span>📧</span>
                              <span>{personnelEmail}</span>
                            </a>
                          )}
                          {personnelPhone && (
                            <a href={`tel:${personnelPhone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                              <span>📱</span>
                              <span>{personnelPhone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {personnelBio && (
                      <div className="prose prose-lg max-w-none">
                        <h4 className="font-medium text-foreground mb-3">Giới thiệu</h4>
                        <div className="text-muted-foreground whitespace-pre-line">
                          {personnelBio}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {articleType === 'faq' && (
                  <div className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Câu hỏi thường gặp</h2>
                    
                    {faqItems.length > 0 && faqItems.some(item => item.question || item.answer) ? (
                      <div className="space-y-4">
                        {Object.entries(
                          faqItems
                            .filter(item => item.question || item.answer)
                            .reduce((acc, item) => {
                              const category = item.category || 'Chung';
                              if (!acc[category]) {
                                acc[category] = [];
                              }
                              acc[category].push(item);
                              return acc;
                            }, {} as Record<string, typeof faqItems>)
                        ).map(([category, items]) => (
                            <div key={category}>
                              {category !== 'Chung' && (
                                <h3 className="text-xl font-bold text-cyan-600 mb-4 mt-6">
                                  {category}
                                </h3>
                              )}
                              <div className="space-y-4">
                                {items.map((item) => (
                                  <div key={item.id} className="border border-cyan-200 rounded-xl p-6 bg-cyan-50/30">
                                    <div className="flex items-start gap-3 mb-3">
                                      <HelpCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                                      <h4 className="text-lg font-medium text-foreground">
                                        {item.question || 'Câu hỏi'}
                                      </h4>
                                    </div>
                                    <div className="ml-8 text-muted-foreground whitespace-pre-line">
                                      {item.answer || 'Câu trả lời'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <HelpCircle className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p>Chưa có câu hỏi nào</p>
                      </div>
                    )}
                  </div>
                )}

                {articleType === 'pdf' && (
                  <div className="p-8">
                    {pdfFile || pdfUrl ? (
                      <div className="max-w-2xl mx-auto">
                        {/* PDF Preview Card */}
                        <div className="border-2 border-rose-500 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50">
                          {/* PDF Icon Header */}
                          <div className="bg-rose-500 text-white p-6 text-center">
                            <FileType className="w-20 h-20 mx-auto mb-3" />
                            <h2 className="text-2xl font-bold">
                              {pdfTitle || 'Tài liệu PDF'}
                            </h2>
                          </div>

                          {/* PDF Info */}
                          <div className="p-6 space-y-4">
                            {pdfDescription && (
                              <div>
                                <p className="text-muted-foreground">
                                  {pdfDescription}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-rose-200">
                              <div className="text-sm text-muted-foreground">
                                {pdfFile && (
                                  <p>Kích thước: {(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                )}
                                {pdfPages > 0 && (
                                  <p>Số trang: {pdfPages}</p>
                                )}
                              </div>
                              <button className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Tải xuống
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileType className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p>Chưa có tài liệu PDF</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Related Categories */}
              {selectedCategories.length > 0 && (
                <div className="mt-8 p-6 bg-card rounded-xl border border-border/60">
                  <h3 className="text-sm text-muted-foreground mb-3">Danh mục</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat, idx) => (
                      <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Toolbar - AI Tools & Actions */}
      <div className="glass-strong border-t border-border/40 px-6 py-4 relative z-50">
        <div className="flex items-center justify-between max-w-full">
          {/* AI Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiTools(!showAiTools)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 relative z-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Tools</span>
            </button>

            {showAiTools && (
              <div className="flex items-center gap-2 animate-slide-in-bottom">
                {aiTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      className={`flex items-center gap-2 px-4 py-2 bg-${tool.color}-100 text-${tool.color}-700 rounded-xl hover:bg-${tool.color}-200 transition-all duration-200 relative z-50`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                console.log('Hủy button clicked!');
                onClose();
              }}
              className="px-6 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200 relative z-50 pointer-events-auto"
            >
              Hủy
            </button>
            <button className="px-6 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200 relative z-50">
              Lưu nháp
            </button>
            <button 
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 disabled:opacity-50 relative z-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Lưu & Thêm tiếp</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 relative z-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Xuất bản</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Infographic Editor Modal - Fullscreen */}
      {showInfographicEditor && (
        <div className="fixed inset-0 bg-background z-[100] flex flex-col">
          {/* Modal Header */}
          <div className="glass-strong border-b border-border/40 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg">Trình chỉnh sửa Infographic</h2>
                <p className="text-sm text-muted-foreground">Thiết kế và chỉnh sửa infographic</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfographicEditor(false)}
              className="p-2 hover:bg-muted/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Editor */}
          <div className="flex-1 overflow-hidden">
            <InfographicBuilder 
              onChange={(elements) => setInfographicElements(elements)}
              initialElements={infographicElements}
            />
          </div>

          {/* Modal Footer */}
          <div className="glass-strong border-t border-border/40 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {infographicElements.length} phần tử
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowInfographicEditor(false)}
                  className="px-6 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    // Auto-save happens through onChange
                    setShowInfographicEditor(false);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Xong</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 Gallery Settings Modal */}
      {showGallerySettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border/60 p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Cài đặt Gallery</h3>
              <button
                onClick={() => setShowGallerySettings(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Layout Options */}
              <div>
                <label className="block text-sm font-medium mb-3">Kiểu bố cục</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['grid', 'masonry', 'carousel', 'justified'] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => setGallerySettings(prev => ({ ...prev, layout }))}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        gallerySettings.layout === layout
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-border/60 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium capitalize">{layout}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {layout === 'grid' && 'Lưới đều'}
                        {layout === 'masonry' && 'Gạch xếp không đều'}
                        {layout === 'carousel' && 'Băng chuyền'}
                        {layout === 'justified' && 'Căn đều chiều cao'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Columns */}
              <div>
                <label className="block text-sm font-medium mb-3">Số cột ({gallerySettings.columns})</label>
                <input
                  type="range"
                  min="2"
                  max="4"
                  value={gallerySettings.columns}
                  onChange={(e) => setGallerySettings(prev => ({ ...prev, columns: Number(e.target.value) as 2 | 3 | 4 }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-sm font-medium mb-3">Khoảng cách</label>
                <div className="flex gap-2">
                  {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => setGallerySettings(prev => ({ ...prev, spacing }))}
                      className={`flex-1 py-2 px-4 border-2 rounded-lg transition-all ${
                        gallerySettings.spacing === spacing
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-border/60 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-sm capitalize">{spacing}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Tùy chọn hiển thị</label>
                
                <label className="flex items-center gap-3 p-3 border border-border/60 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="checkbox"
                    checked={gallerySettings.enableLightbox}
                    onChange={(e) => setGallerySettings(prev => ({ ...prev, enableLightbox: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Bật Lightbox</div>
                    <div className="text-xs text-muted-foreground">Click ảnh để xem full size</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border/60 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="checkbox"
                    checked={gallerySettings.showCaptions}
                    onChange={(e) => setGallerySettings(prev => ({ ...prev, showCaptions: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Hiển thị caption</div>
                    <div className="text-xs text-muted-foreground">Hiện mô tả dưới mỗi ảnh</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border/60 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="checkbox"
                    checked={gallerySettings.showExif}
                    onChange={(e) => setGallerySettings(prev => ({ ...prev, showExif: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Hiển thị EXIF data</div>
                    <div className="text-xs text-muted-foreground">Thông tin camera, lens, settings</div>
                  </div>
                </label>
              </div>

              {/* Watermark Settings */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-border/60 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="checkbox"
                    checked={gallerySettings.enableWatermark}
                    onChange={(e) => setGallerySettings(prev => ({ ...prev, enableWatermark: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Watermark</div>
                    <div className="text-xs text-muted-foreground">Thêm watermark vào ảnh</div>
                  </div>
                </label>

                {gallerySettings.enableWatermark && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Nội dung watermark</label>
                      <input
                        type="text"
                        value={gallerySettings.watermarkText || ''}
                        onChange={(e) => setGallerySettings(prev => ({ ...prev, watermarkText: e.target.value }))}
                        placeholder="© 2025 Công ty của bạn"
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Vị trí</label>
                      <select
                        value={gallerySettings.watermarkPosition}
                        onChange={(e) => setGallerySettings(prev => ({ ...prev, watermarkPosition: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm"
                      >
                        <option value="top-left">Trên trái</option>
                        <option value="top-right">Trên phải</option>
                        <option value="bottom-left">Dưới trái</option>
                        <option value="bottom-right">Dưới phải</option>
                        <option value="center">Giữa</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border/60 p-6">
              <button
                onClick={() => setShowGallerySettings(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Áp dụng cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 Bulk Caption Editor Modal */}
      {showBulkCaptionEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="p-6 border-b border-border/60">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Caption hàng loạt</h3>
                <button
                  onClick={() => setShowBulkCaptionEditor(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Áp dụng caption template cho tất cả {galleryImages.length} ảnh
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mẫu chú thích</label>
                <textarea
                  value={bulkCaptionTemplate}
                  onChange={(e) => setBulkCaptionTemplate(e.target.value)}
                  placeholder="Ảnh #{index} / {total} - Chụp bởi {photographer} tại {location}"
                  rows={4}
                  className="w-full px-4 py-3 border border-border/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">📌 Biến có sẵn:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{index}'}</code> - Số thứ tự ảnh</li>
                  <li>• <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{total}'}</code> - Tổng số ảnh</li>
                  <li>• <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{photographer}'}</code> - Tên nhiếp ảnh gia</li>
                  <li>• <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{location}'}</code> - Địa điểm chụp</li>
                </ul>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm font-medium mb-2">Xem trước (ảnh đầu tiên):</p>
                <p className="text-sm text-muted-foreground">
                  {bulkCaptionTemplate
                    .replace('{index}', '1')
                    .replace('{total}', galleryImages.length.toString())
                    .replace('{photographer}', galleryImages[0]?.photographer || '[photographer]')
                    .replace('{location}', galleryImages[0]?.location || '[location]')
                    || 'Nhập template để xem preview...'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-border/60 flex gap-3">
              <button
                onClick={() => setShowBulkCaptionEditor(false)}
                className="flex-1 py-3 border border-border/60 rounded-xl hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={applyBulkCaption}
                disabled={!bulkCaptionTemplate.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Áp dụng cho {galleryImages.length} ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 Gallery Image Editor Modal */}
      {showImageEditor && editingImage && (
        <GalleryImageEditor
          image={editingImage}
          onClose={() => {
            setShowImageEditor(false);
            setSelectedImageForEdit(null);
            setEditingImage(null);
          }}
          onSave={(imageId, updates) => {
            updateImageMetadata(imageId, updates);
            setShowImageEditor(false);
            setSelectedImageForEdit(null);
            setEditingImage(null);
          }}
          onGenerateAICaption={generateAICaptionForImage}
          onOptimize={optimizeImage}
          generatingCaption={generatingAICaption}
        />
      )}

      {/* 🗜️ Video Compression Settings Modal */}
      {showCompressionSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="p-6 border-b border-border/60">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Cài đặt nén video</h3>
                <button
                  onClick={() => setShowCompressionSettings(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Tối ưu hóa video để tải nhanh hơn và tiết kiệm băng thông
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Enable Compression */}
              <label className="flex items-center gap-3 p-4 border border-border/60 rounded-xl cursor-pointer hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={videoData.compression?.enabled || false}
                  onChange={(e) => setVideoData(prev => ({
                    ...prev,
                    compression: {
                      ...(prev.compression || { targetQuality: 'high', targetFormat: 'mp4' }),
                      enabled: e.target.checked,
                    }
                  }))}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <div className="font-medium">Bật nén video</div>
                  <div className="text-xs text-muted-foreground">Nén video để giảm dung lượng</div>
                </div>
              </label>

              {videoData.compression?.enabled && (
                <>
                  {/* Target Quality */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Chất lượng đích</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'original'] as const).map((quality) => (
                        <button
                          key={quality}
                          type="button"
                          onClick={() => setVideoData(prev => ({
                            ...prev,
                            compression: {
                              ...(prev.compression || { enabled: false, targetFormat: 'mp4' }),
                              targetQuality: quality,
                              estimatedSize: quality === 'low' ? 20 : quality === 'medium' ? 50 : quality === 'high' ? 100 : undefined,
                            }
                          }))}
                          className={`py-2.5 px-3 border-2 rounded-lg transition-all text-sm ${
                            videoData.compression?.targetQuality === quality
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-border/60 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-medium capitalize">{quality}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {quality === 'low' && '~20MB'}
                            {quality === 'medium' && '~50MB'}
                            {quality === 'high' && '~100MB'}
                            {quality === 'original' && 'Giữ nguyên'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Format */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Định dạng đầu ra</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['mp4', 'webm', 'original'] as const).map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => setVideoData(prev => ({
                            ...prev,
                            compression: {
                              ...prev.compression!,
                              targetFormat: format,
                            }
                          }))}
                          className={`py-3 px-4 border-2 rounded-lg transition-all ${
                            videoData.compression?.targetFormat === format
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-border/60 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-medium uppercase">{format}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format === 'mp4' && 'Phổ biến'}
                            {format === 'webm' && 'Hiện đại'}
                            {format === 'original' && 'Giữ nguyên'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Size (Optional) */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Dung lượng đích (Tùy chọn)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        placeholder="VD: 50"
                        value={videoData.compression?.targetSize || ''}
                        onChange={(e) => setVideoData(prev => ({
                          ...prev,
                          compression: {
                            ...(prev.compression || { enabled: false, targetQuality: 'high', targetFormat: 'mp4' }),
                            targetSize: e.target.value ? Number(e.target.value) : undefined,
                          }
                        }))}
                        className="flex-1 px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                      <span className="text-sm text-muted-foreground font-medium">MB</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Để trống để sử dụng quality preset. Nếu nhập, hệ thống sẽ nén để đạt dung lượng này.
                    </p>
                  </div>

                  {/* Compression Info */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-sm text-purple-900 font-medium mb-2">📊 Tóm tắt nén</p>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• Chất lượng: <strong>{videoData.compression?.targetQuality || 'high'}</strong></li>
                      <li>• Định dạng: <strong>{videoData.compression?.targetFormat || 'mp4'}</strong></li>
                      {videoData.compression?.targetSize && (
                        <li>• Dung lượng đích: <strong>{videoData.compression.targetSize}MB</strong></li>
                      )}
                      {videoData.compression?.estimatedSize && (
                        <li>• Dung lượng ước tính: <strong>~{videoData.compression.estimatedSize}MB</strong></li>
                      )}
                    </ul>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-900">
                      ⚠️ <strong>Lưu ý:</strong> Compression sẽ được thực hiện khi bạn lưu bài viết. 
                      Quá trình có thể mất vài phút tùy thuộc vào kích thước video.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-border/60 flex gap-3">
              <button
                onClick={() => setShowCompressionSettings(false)}
                className="flex-1 py-3 border border-border/60 rounded-xl hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowCompressionSettings(false)}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
