export default {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    upload: 'Upload',
    download: 'Download',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    select: 'Select',
    selected: 'selected',
    actions: 'Actions',
    loading: 'Loading...',
    saving: 'Saving...',
    publishing: 'Publishing...',
    draft: 'Save Draft',
    publish: 'Publish',
    preview: 'Preview',
    settings: 'Settings',
    language: 'Language',
  },

  // Confirmations
  confirmations: {
    deleteArticle: 'Are you sure you want to delete this article?',
    deleteCategory: 'Are you sure you want to delete this category?',
    deleteCategoryWithArticles: 'Are you sure you want to delete this category? All articles in this category will be moved to "Uncategorized".',
    deletePermissionGroup: 'Are you sure you want to delete permission group "{{name}}"?',
    deletePermissionGroupWithMembers: 'Are you sure you want to delete permission group "{{name}}"? All members will lose this access.',
    removeMember: 'Are you sure you want to remove this member from the group?',
  },

  // Search
  search: {
    placeholder: 'Quick search...',
    recentSearches: 'Recent searches',
    quickActions: 'Quick actions',
    commandPalette: 'Search command...',
  },

  // Header
  header: {
    createNew: 'Create New',
    profile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    adminUser: 'Admin User',
    adminEmail: 'admin@cms.com',
    premiumPlan: 'Premium Plan',
    pro: 'PRO',
    expiresIn: 'Expires in 30 days',
    i18nTestSuite: '🧪 i18n Test Suite',
    
    // Notifications
    newComments: '{{count}} new comments need review',
    pendingApproval: '{{count}} articles pending approval',
    crawlerCollected: 'Crawler collected {{count}} new articles',
    backupComplete: 'Backup completed successfully',
    minutesAgo: '{{count}} minutes ago',
    hoursAgo: '{{count}} hours ago',
    
    // Quick actions
    createArticle: 'Create new article',
    uploadMedia: 'Upload media',
    viewStats: 'View statistics',
    manageCategories: 'Manage categories',
    
    // Recent searches
    recentSearch1: {
      query: 'AI articles',
      type: 'Articles',
    },
    recentSearch2: {
      query: 'React tutorial videos',
      type: 'Media',
    },
    recentSearch3: {
      query: '2024 image gallery',
      type: 'Gallery',
    },
  },

  // Menu Navigation
  menu: {
    dashboard: 'Dashboard',
    articles: 'Articles',
    categories: 'Categories',
    media: 'Media Library',
    comments: 'Comments',
    users: 'Users',
    moderation: 'Content Moderation',
    moderationAll: 'Content Moderation',
    analytics: 'Analytics & Stats',
    crawler: 'Crawler',
    settings: 'Settings',
    eventSeries: 'Event Streams',
    permissions: 'Permission Groups',
    aiTools: 'AI Tools',
    activity: 'Activity Log',
  },

  // Article Types
  articleTypes: {
    news: 'News',
    newsDesc: 'Regular news article',
    video: 'Video',
    videoDesc: 'Article with video content',
    gallery: 'Gallery',
    galleryDesc: 'Image collection',
    document: 'Document',
    documentDesc: 'Document file',
    legal: 'Legal Document',
    legalDesc: 'Legal document or regulation',
    legalShort: 'Legal Doc',
    personnel: 'Personnel',
    personnelDesc: 'Personnel information',
    staff: 'Staff',
    recruitment: 'Recruitment',
    recruitmentDesc: 'Job recruitment information',
    job: 'Job Posting',
    podcast: 'Podcast',
    podcastDesc: 'Audio podcast',
    event: 'Event',
    eventDesc: 'Event information',
    download: 'Download',
    downloadDesc: 'Downloadable file',
    blog: 'Blog',
    blogDesc: 'Blog post',
    tutorial: 'Tutorial',
    tutorialDesc: 'Tutorial article',
    pressRelease: 'Press Release',
    pressReleaseDesc: 'Press release',
    interview: 'Interview',
    interviewDesc: 'Interview article',
    infographic: 'Infographic',
    infographicDesc: 'Visual information chart',
  },

  // Article Status
  status: {
    published: 'Published',
    draft: 'Draft',
    review: 'Under Review',
    scheduled: 'Scheduled',
    archived: 'Archived',
    rejected: 'Rejected',
    pending: 'Pending',
  },

  // Article Management
  articles: {
    title: 'Article Management',
    createNew: 'Create New Article',
    editArticle: 'Edit Article',
    deleteArticle: 'Delete Article',
    bulkActions: 'Bulk Actions',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selectedItems: 'articles',
    noArticles: 'No articles found',
    searchPlaceholder: 'Search articles...',
    
    // Columns
    columns: {
      id: 'ID',
      thumbnail: 'Image',
      title: 'Title',
      type: 'Type',
      status: 'Status',
      category: 'Category',
      author: 'Author',
      views: 'Views',
      comments: 'Comments',
      publishDate: 'Published',
      updatedDate: 'Updated',
      featured: 'Featured',
      actions: 'Actions',
    },

    // Actions
    viewDetail: 'View Details',
    markFeatured: 'Mark as Featured',
    unmarkFeatured: 'Remove Featured',
    moveTo: 'Move to',
    duplicate: 'Duplicate',
    archive: 'Archive',
    restore: 'Restore',
    
    // Filters
    filterByType: 'Filter by Type',
    filterByStatus: 'Filter by Status',
    filterByCategory: 'Filter by Category',
    filterByAuthor: 'Filter by Author',
    
    // View modes
    viewTable: 'Table',
    viewList: 'List',
    viewGrid: 'Grid',
    
    // Column selector
    columnsDisplay: 'Display Columns',
    resetColumns: 'Reset',
    columnsCount: 'columns',
  },

  // Article Editor
  editor: {
    title: 'Article Title',
    titlePlaceholder: 'Enter article title...',
    content: 'Content',
    contentPlaceholder: 'Start writing content...',
    excerpt: 'Excerpt',
    excerptPlaceholder: 'Brief description of the article...',
    
    // Tabs
    editMode: 'Edit',
    previewMode: 'Preview',
    
    // Article type selector
    selectType: 'Article Type',
    selectTypeRequired: 'Article Type *',
    
    // Media
    thumbnail: 'Thumbnail',
    thumbnailRequired: 'Thumbnail *',
    uploadImage: 'Click to upload image',
    uploadImageHelp: 'PNG, JPG or WebP (max. 5MB)',
    dragDropImages: 'Drag & drop or click to add images',
    dragDropImagesHelp: 'Support multiple images. PNG, JPG, WebP (max 10MB/image)',
    
    // Categories & Tags
    categories: 'Categories',
    categoriesRequired: 'Categories *',
    selectCategories: 'Select categories',
    searchCategories: 'Search categories...',
    tags: 'Tags',
    addTag: 'Add tag...',
    
    // Author
    author: 'Author',
    authorRequired: 'Author *',
    selectAuthor: 'Select author',
    addNewAuthor: 'Add new author',
    authorName: 'Author Name',
    authorNamePlaceholder: 'Enter author name...',
    
    // AI Tools
    aiTools: 'AI Tools',
    translateAuto: 'Auto Translate',
    checkGrammar: 'Check Grammar',
    optimizeSEO: 'Optimize SEO',
    suggestContent: 'Suggest Content',
    
    // Buttons
    saveAndContinue: 'Save & Add Another',
    saveDraft: 'Save Draft',
    lastSaved: 'Last saved at',
    
    // Video specific
    videoUrl: 'Video URL',
    videoUrlPlaceholder: 'https://youtube.com/watch?v=...',
    duration: 'Duration',
    durationPlaceholder: '00:00',
    
    // Gallery specific
    noImages: 'No images in gallery yet',
    imageCaption: 'Image Caption',
    
    // Job specific
    position: 'Position',
    salary: 'Salary',
    location: 'Location',
    deadline: 'Application Deadline',
    requirements: 'Requirements',
    benefits: 'Benefits',
    
    // Event specific
    eventDate: 'Event Date',
    eventTime: 'Event Time',
    venue: 'Venue',
    maxParticipants: 'Max Participants',
    registrationCount: 'Registered',
    
    // Podcast specific
    episode: 'Episode',
    audioUrl: 'Audio URL',
    albumArt: 'Album Art',
    
    // Legal specific
    documentNumber: 'Document Number',
    documentType: 'Document Type',
    issueDate: 'Issue Date',
    effectiveDate: 'Effective Date',
    issuingAuthority: 'Issuing Authority',
    
    // Staff specific
    department: 'Department',
    joinDate: 'Join Date',
    bio: 'Biography',
    
    // Download specific
    fileType: 'File Type',
    fileSize: 'File Size',
    downloadUrl: 'Download URL',
    
    // Reading time
    readingTime: 'Reading Time (minutes)',
    readingTimeUnit: 'min read',
    
    // Stats
    characters: 'characters',
    words: 'words',
  },

  // Categories
  categories: {
    title: 'Category Management',
    createNew: 'Create New Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    noCategories: 'No categories found',
    
    // Form
    name: 'Category Name',
    nameRequired: 'Category Name *',
    namePlaceholder: 'Enter category name...',
    slug: 'Slug',
    slugPlaceholder: 'url-friendly-slug',
    description: 'Description',
    descriptionPlaceholder: 'Category description...',
    parentCategory: 'Parent Category',
    selectParent: 'Select parent category (optional)',
    noParent: 'None (Root Category)',
    icon: 'Icon',
    color: 'Color',
    image: 'Image',
    allowedContentTypes: 'Allowed Content Types',
    
    // Stats
    totalArticles: 'Total Articles',
    publishedArticles: 'Published',
    draftArticles: 'Drafts',
    subcategories: 'Subcategories',
    
    // Actions
    viewArticles: 'View Articles',
    addSubcategory: 'Add Subcategory',
    moveCategory: 'Move',
    mergeCategories: 'Merge Categories',
  },

  // Media Library
  media: {
    title: 'Media Library',
    uploadFiles: 'Upload Files',
    dragDrop: 'Drag & drop files here or',
    clickToUpload: 'click to select',
    supportedFormats: 'Supports: Images, Videos, Documents',
    maxSize: 'Max 100MB/file',
    
    // Filters
    allFiles: 'All Files',
    images: 'Images',
    videos: 'Videos',
    documents: 'Documents',
    audio: 'Audio',
    
    // View modes
    gridView: 'Grid',
    listView: 'List',
    
    // Info
    fileName: 'File Name',
    fileSize: 'Size',
    fileType: 'Type',
    uploadedBy: 'Uploaded by',
    uploadDate: 'Upload Date',
    usedIn: 'Used in',
    
    // Actions
    selectFile: 'Select File',
    copyUrl: 'Copy URL',
    urlCopied: 'URL Copied',
    downloadFile: 'Download',
    deleteFile: 'Delete',
    editMetadata: 'Edit Metadata',
    replaceFile: 'Replace File',
    
    // Stats
    totalFiles: 'Total Files',
    totalSize: 'Total Size',
    filesSelected: 'files selected',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back',
    overview: 'Here\'s an overview of your CMS system',
    systemHealthy: 'System running smoothly',
    
    // Stats cards
    totalArticles: 'Total Articles',
    publishedToday: 'Published Today',
    pendingReview: 'Pending Review',
    totalViews: 'Total Views',
    totalComments: 'Comments',
    totalLikes: 'Likes',
    
    // Charts
    viewsChart: 'Views Over Time',
    articlesByType: 'Articles by Type',
    articlesByStatus: 'Articles by Status',
    topAuthors: 'Top Authors',
    
    // Recent activity
    recentActivity: 'Recent Activity',
    recentArticles: 'Latest Articles',
    popularArticles: 'Popular Articles',
    
    // Quick actions
    quickActions: 'Quick Actions',
    createArticle: 'Create Article',
    createCategory: 'Create Category',
    uploadMedia: 'Upload Media',
    reviewContent: 'Review Content',
  },

  // Moderation
  moderation: {
    title: 'Content Moderation',
    pendingItems: 'Pending Items',
    reviewQueue: 'Review Queue',
    
    // Actions
    approve: 'Approve',
    reject: 'Reject',
    requestChanges: 'Request Changes',
    
    // Filters
    filterByType: 'Filter by Type',
    filterByAuthor: 'Filter by Author',
    filterByDate: 'Filter by Date',
    
    // Stats
    totalPending: 'Total Pending',
    approvedToday: 'Approved Today',
    rejectedToday: 'Rejected Today',
  },

  // Users
  users: {
    title: 'User Management',
    createNew: 'Add User',
    editUser: 'Edit User',
    
    // Fields
    username: 'Username',
    email: 'Email',
    fullName: 'Full Name',
    role: 'Role',
    status: 'Status',
    lastLogin: 'Last Login',
    
    // Roles
    admin: 'Administrator',
    editor: 'Editor',
    author: 'Author',
    contributor: 'Contributor',
    viewer: 'Viewer',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    language: 'Language',
    notifications: 'Notifications',
    security: 'Security',
    
    // General
    siteName: 'Site Name',
    siteDescription: 'Site Description',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    
    // Appearance
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    autoMode: 'Auto',
  },

  // Crawler
  crawler: {
    title: 'Crawler Management',
    campaigns: 'Campaigns',
    sources: 'Sources',
    articles: 'Crawled Articles',
    approved: 'Approved Articles',
    
    // Submenu labels
    submenu: {
      campaigns: 'Campaigns',
      sources: 'Sources',
      crawled: 'Crawled Articles',
      approved: 'Approved Articles',
    },
    
    // Campaign
    createCampaign: 'Create Campaign',
    editCampaign: 'Edit Campaign',
    campaignName: 'Campaign Name',
    campaignDescription: 'Description',
    campaignStatus: 'Status',
    
    // Source
    createSource: 'Add Source',
    editSource: 'Edit Source',
    sourceName: 'Source Name',
    sourceUrl: 'Source URL',
    sourceType: 'Source Type',
    crawlFrequency: 'Crawl Frequency',
    lastCrawled: 'Last Crawled',
    
    // Actions
    startCrawl: 'Start Crawl',
    stopCrawl: 'Stop Crawl',
    testSource: 'Test Source',
    viewResults: 'View Results',
    
    // Stats
    totalSources: 'Total Sources',
    activeSources: 'Active',
    totalCrawled: 'Crawled',
    pendingApproval: 'Pending',
  },

  // AI Tools
  aiTools: {
    title: 'AI Tools',
    autoTranslate: 'Auto Translate',
    grammarCheck: 'Grammar Check',
    seoOptimize: 'SEO Optimization',
    contentSuggest: 'Content Suggestions',
    generateSummary: 'Generate Summary',
    generateTitle: 'Generate Title',
    generateTags: 'Generate Tags',
    imageAlt: 'Generate Alt Text',
    
    // Status
    processing: 'Processing...',
    completed: 'Completed',
    failed: 'Failed',
  },

  // Workflow
  workflow: {
    title: 'Workflow Management',
    createWorkflow: 'Create Workflow',
    editWorkflow: 'Edit Workflow',
    workflowName: 'Workflow Name',
    workflowSteps: 'Steps',
    
    // Steps
    step: 'Step',
    addStep: 'Add Step',
    removeStep: 'Remove Step',
    stepName: 'Step Name',
    assignTo: 'Assign to',
    
    // Actions
    approve: 'Approve',
    reject: 'Reject',
    requestRevision: 'Request Revision',
    moveToNext: 'Move to Next',
  },

  // Event Stream
  eventStream: {
    title: 'Event Streams',
    createStream: 'Create Stream',
    editStream: 'Edit Stream',
    streamName: 'Stream Name',
    streamDescription: 'Description',
    events: 'Events',
    
    // Event
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    eventTitle: 'Event Title',
    eventDate: 'Event Date',
    eventTime: 'Time',
    eventLocation: 'Location',
    eventDescription: 'Description',
    
    // Stats
    totalStreams: 'Total Streams',
    upcomingEvents: 'Upcoming Events',
    pastEvents: 'Past Events',
  },

  // Activity Log
  activity: {
    title: 'Activity Log',
    timeline: 'Timeline',
    filterByUser: 'Filter by User',
    filterByAction: 'Filter by Action',
    filterByDate: 'Filter by Date',
    
    // Actions
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
    published: 'published',
    approved: 'approved',
    rejected: 'rejected',
    
    // Time
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    monthsAgo: 'months ago',
  },

  // Analytics
  analytics: {
    title: 'Analytics & Statistics',
    overview: 'Overview',
    detailed: 'Detailed',
    
    // Metrics
    pageviews: 'Pageviews',
    uniqueVisitors: 'Unique Visitors',
    bounceRate: 'Bounce Rate',
    avgTimeOnPage: 'Avg. Time on Page',
    topPages: 'Top Pages',
    topReferrers: 'Top Referrers',
    
    // Time ranges
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    custom: 'Custom',
  },

  // Permissions
  permissions: {
    title: 'Permission Groups',
    createGroup: 'Create Group',
    editGroup: 'Edit Group',
    groupName: 'Group Name',
    groupDescription: 'Description',
    members: 'Members',
    searchPlaceholder: 'Search permission groups...',
    
    // Actions
    canCreate: 'Create',
    canRead: 'Read',
    canUpdate: 'Update',
    canDelete: 'Delete',
    canPublish: 'Publish',
    canApprove: 'Approve',
    
    // Resources
    articles: 'Articles',
    categories: 'Categories',
    media: 'Media',
    users: 'Users',
    settings: 'Settings',
  },

  // Photo Editor
  photoEditor: {
    title: 'Photo Editor',
    subtitle: 'Professional photo editing tools',
    resetAll: 'Reset All',
    saveChanges: 'Save Changes',
    tabs: {
      crop: 'Crop',
      adjust: 'Adjust',
      filters: 'Filters',
      effects: 'Effects',
    },
    cropResize: 'Crop & Resize',
    startCropping: 'Start Cropping',
    applyCrop: 'Apply Crop',
    cancelCrop: 'Cancel',
    aspectRatio: 'Aspect Ratio',
    transform: 'Transform',
    rotateRight: 'Rotate Right',
    rotateLeft: 'Rotate Left',
    flipH: 'Flip H',
    flipV: 'Flip V',
    background: 'Background',
    removing: 'Removing...',
    bgRemoved: 'Background Removed',
    removeBg: 'Remove Background',
    bgAINote: 'Uses AI to automatically remove the background',
    imageAdjustments: 'Image Adjustments',
    advanced: 'Advanced',
    filterPresets: 'Filter Presets',
    vivid: 'Vivid',
    dramatic: 'Dramatic',
    bw: 'B&W',
    sepia: 'Sepia',
    cool: 'Cool',
    warm: 'Warm',
    specialEffects: 'Special Effects',
    aiEnhance: 'AI Enhance',
    autoAdjust: 'Auto Adjust',
    hdrEffect: 'HDR Effect',
    moreEffects: 'More effects coming soon! Including AI enhancements, portrait mode, background blur, and more.',
    fit: 'Fit',
  },

  // Smart Crop
  smartCrop: {
    title: 'Smart Crop',
    subtitle: 'AI-powered cropping with presets',
    aiDetecting: 'Detecting...',
    aiDetectSubject: 'AI Detect Subject',
    categories: 'Categories',
    cropPresets: 'Crop Presets',
    freeRatio: 'Any aspect ratio',
    ratio: 'Ratio',
    reset: 'Reset',
    applyCrop: 'Apply Crop',
    all: 'All Presets',
    social: 'Social Media',
    print: 'Print',
    web: 'Web',
    custom: 'Custom',
    instagramSquare: 'Instagram Square',
    instagramPortrait: 'Instagram Portrait',
    facebookCover: 'Facebook Cover',
    twitterPost: 'Twitter Post',
    linkedinPost: 'LinkedIn Post',
    youtubeThumbnail: 'YouTube Thumbnail',
    a4Portrait: 'A4 Portrait',
    a4Landscape: 'A4 Landscape',
    letter: 'Letter',
    businessCard: 'Business Card',
    webBanner: 'Web Banner',
    heroImage: 'Hero Image',
    freeForm: 'Free Form',
    square: 'Square',
  },

  // Text Effects
  textEffects: {
    title: 'Advanced Text Effects',
    subtitle: 'Transform text with stunning effects',
    effectTypes: 'Effect Types',
    presetsAvailable: 'presets',
    effectSettings: 'Effect Settings',
    previewText: 'Preview Text',
    previewPlaceholder: 'Enter text...',
    applyEffect: 'Apply Effect',
    gradient: 'Gradient',
    curved: 'Curved',
    threeD: '3D',
    outline: 'Outline',
    shadow: 'Shadow',
    glow: 'Glow',
    neon: 'Neon',
    metallic: 'Metallic',
    gradientType: 'Gradient Type',
    linear: 'Linear',
    radial: 'Radial',
    conic: 'Conic',
    angle: 'Angle',
    curvature: 'Curvature',
    radius: 'Radius',
    depth: 'Depth',
    perspective: 'Perspective',
    lightAngle: 'Light Angle',
    width: 'Width',
    color: 'Color',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Blur',
    intensity: 'Intensity',
    spread: 'Spread',
    flickerEffect: 'Flicker Effect',
    type: 'Type',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze',
    chrome: 'Chrome',
    shine: 'Shine',
    proTip: 'Pro Tip',
    proTipText: 'Combine multiple effects for unique styles. You can layer gradient, shadow, and outline effects together.',
  },

  // Element Library Showcase
  elementLibrary: {
    title: 'Element Library Showcase',
    subtitle: 'Explore pre-made design examples using Element Library',
    useCases: 'use cases',
    elementsAvailable: 'elements available',
    categoriesCount: 'categories',
    quickStart: 'Quick Start',
    quickStartDesc: 'Click ⭐ Elements tab to browse library',
    customize: 'Customize',
    customizeDesc: 'Change colors, resize, add effects',
    combine: 'Combine',
    combineDesc: 'Mix elements for unique designs',
    statsCard: 'Statistics Card',
    customerSatisfaction: 'Customer Satisfaction',
    socialBanner: 'Social Media Banner',
    followUs: 'Follow Us',
    featureHighlight: 'Feature Highlight',
    newBadge: 'NEW',
    premiumFeature: 'Premium Feature',
    advancedAnalytics: 'Advanced Analytics',
    prioritySupport: 'Priority Support',
    contactInfo: 'Contact Information',
    getInTouch: 'Get In Touch',
    teamSection: 'Team Section',
    pricingDisplay: 'Pricing Display',
    limitedOffer: 'LIMITED OFFER',
    specialPrice: 'Special Price',
    saveToday: 'Save 40% Today!',
  },

  // Event Stream Embed
  eventStreamEmbed: {
    title: 'Embed & Share',
    subtitle: 'Embed event stream on your website',
    embedType: 'Embed Type',
    customization: 'Customization',
    embedCode: 'Embed Code',
    copied: 'Copied',
    copy: 'Copy',
    timelineDesc: 'Full timeline display with articles',
    cardDesc: 'Compact card showing latest article',
    bannerDesc: 'Horizontal banner with featured articles',
    floatingWidgetDesc: 'Floating widget at screen corner',
    showAuthor: 'Show Author',
    showStats: 'Show Stats',
    showThumbnail: 'Show Thumbnail',
    showHeader: 'Show Header',
    maxArticles: 'Max Articles',
    primaryColor: 'Primary Color',
    borderRadius: 'Border Radius',
    newsAndEvents: 'News and events stream',
    latestArticle: 'Latest Article Title',
    articleExcerpt: 'Article excerpt text...',
    readMore: 'Read More',
    viewAll: 'View All',
    featuredTitle: 'Featured article title',
    explore: 'Explore',
    newArticles: '3 new articles',
    instructions: 'How to Use',
    step1: 'Choose the embed type that fits your website',
    step2: 'Customize the appearance and features as desired',
    step3: 'Copy the embed code and paste into your website HTML',
    step4: 'Widget will auto-update when new articles are published',
  },

  // Placeholders (for inputs, textareas)
  placeholders: {
    // Search
    searchCommand: 'Search commands...',
    searchMedia: 'Search in Media Library...',
    searchCrawler: 'Search crawler sources...',
    searchHistory: 'Search history...',
    searchArticles: 'Search articles...',
    searchEventStream: 'Search event streams...',
    
    // Dates
    dateFrom: 'From date',
    dateTo: 'To date',
    
    // File sizes
    sizeMin: 'Min',
    sizeMax: 'Max',
    
    // Media
    uploaderName: 'Uploader name...',
    fileDescription: 'Enter file description...',
    addNewTag: 'Add new tag...',
    
    // Crawler
    webhookUrl: 'https://hooks.slack.com/...',
    crawlerName: 'E.g: VnExpress Technology',
    rssUrl: 'https://example.com/rss',
    
    // Content
    startWriting: 'Start writing content...',
    shortDescription: 'Brief description of the article...',
    readingTime: '5',
    videoUrl: 'https://youtube.com/watch?v=...',
    timestamp: '15:30',
    timestamps: '00:00 - Introduction...',
    galleryDescription: 'Description of this image gallery...',
    documentNumber: '15/2024/NĐ-CP',
    issuingAuthority: 'Government',
    jobPosition: 'Senior Frontend Developer',
    years: '2',
    eventName: 'E.g: Tech Summit 2025',
    eventDescription: 'Description of this event series...',
  },

  // Tooltips (for title attributes)
  tooltips: {
    delete: 'Delete',
    edit: 'Edit',
    editItem: 'Edit',
    view: 'View',
    add: 'Add',
    changePassword: 'Change Password',
    more: 'More',
  },

  // Messages & Notifications
  messages: {
    success: 'Success!',
    error: 'Error!',
    warning: 'Warning!',
    info: 'Information',
    
    // Success messages
    saveSuccess: 'Saved successfully',
    publishSuccess: 'Published successfully',
    deleteSuccess: 'Deleted successfully',
    updateSuccess: 'Updated successfully',
    uploadSuccess: 'Uploaded successfully',
    
    // Error messages
    saveError: 'Error saving',
    publishError: 'Error publishing',
    deleteError: 'Error deleting',
    updateError: 'Error updating',
    uploadError: 'Error uploading',
    
    // Confirmations
    confirmDelete: 'Are you sure you want to delete?',
    confirmPublish: 'Are you sure you want to publish?',
    unsavedChanges: 'You have unsaved changes. Do you want to leave?',
  },
};