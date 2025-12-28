export default {
  // Common
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    search: '搜索',
    filter: '筛选',
    export: '导出',
    import: '导入',
    upload: '上传',
    download: '下载',
    view: '查看',
    close: '关闭',
    back: '返回',
    next: '下一个',
    previous: '上一个',
    confirm: '确认',
    yes: '是',
    no: '否',
    all: '全部',
    select: '选择',
    selected: '已选择',
    actions: '操作',
    loading: '加载中...',
    saving: '保存中...',
    publishing: '发布中...',
    draft: '保存草稿',
    publish: '发布',
    preview: '预览',
    settings: '设置',
    language: '语言',
  },

  // Confirmations
  confirmations: {
    deleteArticle: '您确定要删除此文章吗？',
    deleteCategory: '您确定要删除此分类吗？',
    deleteCategoryWithArticles: '您确定要删除此分类吗？此分类中的所有文章将移至"未分类"。',
    deletePermissionGroup: '您确定要删除权限组"{{name}}"吗？',
    deletePermissionGroupWithMembers: '您确定要删除权限组"{{name}}"吗？所有成员将失去此访问权限。',
    removeMember: '您确定要从组中删除此成员吗？',
  },

  // Search
  search: {
    placeholder: '快速搜索...',
    recentSearches: '最近搜索',
    quickActions: '快速操作',
    commandPalette: '搜索命令...',
  },

  // Header
  header: {
    createNew: '新建',
    profile: '我的资料',
    settings: '设置',
    logout: '退出登录',
    adminUser: '管理员用户',
    adminEmail: 'admin@cms.com',
    premiumPlan: '高级套餐',
    pro: '专业版',
    expiresIn: '30天后到期',
    i18nTestSuite: '🧪 i18n 测试套件',
    
    // Notifications
    newComments: '{{count}} 条新评论需要审核',
    pendingApproval: '{{count}} 篇文章待审批',
    crawlerCollected: '爬虫收集了 {{count}} 篇新文章',
    backupComplete: '备份成功完成',
    minutesAgo: '{{count}} 分钟前',
    hoursAgo: '{{count}} 小时前',
    
    // Quick actions
    createArticle: '创建新文章',
    uploadMedia: '上传媒体',
    viewStats: '查看统计',
    manageCategories: '管理分类',
    
    // Recent searches
    recentSearch1: {
      query: '关于AI的文章',
      type: '文章',
    },
    recentSearch2: {
      query: 'React教程视频',
      type: '媒体',
    },
    recentSearch3: {
      query: '2024图片库',
      type: '图库',
    },
  },

  // Menu Navigation
  menu: {
    dashboard: '仪表板',
    articles: '文章',
    categories: '分类',
    media: '媒体库',
    comments: '评论',
    users: '用户',
    moderation: '审核',
    moderationAll: '内容审核',
    analytics: '分析统计',
    crawler: '爬虫',
    settings: '设置',
    eventSeries: '事件流',
    permissions: '权限组',
    aiTools: 'AI工具',
    activity: '活动日志',
  },

  // Article Types
  articleTypes: {
    news: '新闻',
    video: '视频',
    gallery: '图库',
    legal: '法律文件',
    legalShort: '法律',
    staff: '员工',
    job: '招聘',
    podcast: '播客',
    event: '活动',
    download: '下载',
  },

  // Article Status
  status: {
    published: '已发布',
    draft: '草稿',
    review: '审核中',
    scheduled: '已计划',
    archived: '已存档',
    rejected: '已拒绝',
    pending: '待处理',
  },

  // Article Management
  articles: {
    title: '文章管理',
    createNew: '创建新文章',
    editArticle: '编辑文章',
    deleteArticle: '删除文章',
    bulkActions: '批量操作',
    selectAll: '全选',
    deselectAll: '取消全选',
    selectedItems: '篇文章',
    noArticles: '未找到文章',
    searchPlaceholder: '搜索文章...',
    
    // Columns
    columns: {
      id: 'ID',
      thumbnail: '图片',
      title: '标题',
      type: '类型',
      status: '状态',
      category: '分类',
      author: '作者',
      views: '浏览量',
      comments: '评论',
      publishDate: '发布日期',
      updatedDate: '更新日期',
      featured: '精选',
      actions: '操作',
    },

    // Actions
    viewDetail: '查看详情',
    markFeatured: '标记为精选',
    unmarkFeatured: '取消精选',
    moveTo: '移动到',
    duplicate: '复制',
    archive: '存档',
    restore: '恢复',
    
    // Filters
    filterByType: '按类型筛选',
    filterByStatus: '按状态筛选',
    filterByCategory: '按分类筛选',
    filterByAuthor: '按作者筛选',
    
    // View modes
    viewTable: '表格',
    viewList: '列表',
    viewGrid: '网格',
    
    // Column selector
    columnsDisplay: '显示列',
    resetColumns: '重置',
    columnsCount: '列',
  },

  // Article Editor
  editor: {
    title: '文章标题',
    titlePlaceholder: '输入文章标题...',
    content: '内容',
    contentPlaceholder: '开始编写内容...',
    excerpt: '摘要',
    excerptPlaceholder: '文章简要描述...',
    
    // Tabs
    editMode: '编辑',
    previewMode: '预览',
    
    // Article type selector
    selectType: '文章类型',
    selectTypeRequired: '文章类型 *',
    
    // Media
    thumbnail: '缩略图',
    thumbnailRequired: '缩略图 *',
    uploadImage: '点击上传图片',
    uploadImageHelp: 'PNG、JPG 或 WebP（最大 5MB）',
    dragDropImages: '拖放或点击添加图片',
    dragDropImagesHelp: '支持多张图片。PNG、JPG、WebP（每张最大 10MB）',
    
    // Categories & Tags
    categories: '分类',
    categoriesRequired: '分类 *',
    selectCategories: '选择分类',
    searchCategories: '搜索分类...',
    tags: '标签',
    addTag: '添加标签...',
    
    // Author
    author: '作者',
    authorRequired: '作者 *',
    selectAuthor: '选择作者',
    addNewAuthor: '添加新作者',
    authorName: '作者姓名',
    authorNamePlaceholder: '输入作者姓名...',
    
    // AI Tools
    aiTools: 'AI 工具',
    translateAuto: '自动翻译',
    checkGrammar: '语法检查',
    optimizeSEO: 'SEO 优化',
    suggestContent: '内容建议',
    
    // Buttons
    saveAndContinue: '保存并继续',
    saveDraft: '保存草稿',
    lastSaved: '最后保存于',
    
    // Video specific
    videoUrl: '视频 URL',
    videoUrlPlaceholder: 'https://youtube.com/watch?v=...',
    duration: '时长',
    durationPlaceholder: '00:00',
    
    // Gallery specific
    noImages: '图库中还没有图片',
    imageCaption: '图片说明',
    
    // Job specific
    position: '职',
    salary: '薪资',
    location: '地点',
    deadline: '申请截止日期',
    requirements: '要求',
    benefits: '福利',
    
    // Event specific
    eventDate: '活动日期',
    eventTime: '活动时间',
    venue: '场地',
    maxParticipants: '最大参与人数',
    registrationCount: '已注册',
    
    // Podcast specific
    episode: '集数',
    audioUrl: '音频 URL',
    albumArt: '专辑封面',
    
    // Legal specific
    documentNumber: '文件编号',
    documentType: '文件类型',
    issueDate: '发布日期',
    effectiveDate: '生效日期',
    issuingAuthority: '发布机构',
    
    // Staff specific
    department: '部门',
    joinDate: '入职日期',
    bio: '简介',
    
    // Download specific
    fileType: '文件类型',
    fileSize: '文件大小',
    downloadUrl: '下载 URL',
    
    // Reading time
    readingTime: '阅读时间（分钟）',
    readingTimeUnit: '分钟阅读',
    
    // Stats
    characters: '字符',
    words: '词',
  },

  // Categories
  categories: {
    title: '分类管理',
    createNew: '创建新分类',
    editCategory: '编辑分类',
    deleteCategory: '删除分类',
    noCategories: '未找到分类',
    
    // Form
    name: '分类名称',
    nameRequired: '分类名称 *',
    namePlaceholder: '输入分类名称...',
    slug: 'Slug',
    slugPlaceholder: 'url-friendly-slug',
    description: '描述',
    descriptionPlaceholder: '分类描述...',
    parentCategory: '父分类',
    selectParent: '选择父分类（可选）',
    noParent: '无（根分类）',
    icon: '图标',
    color: '颜色',
    image: '图片',
    allowedContentTypes: '允许的内容类型',
    
    // Stats
    totalArticles: '文章总数',
    publishedArticles: '已发布',
    draftArticles: '草稿',
    subcategories: '子分类',
    
    // Actions
    viewArticles: '查看文章',
    addSubcategory: '添加子分类',
    moveCategory: '移动',
    mergeCategories: '合并分类',
  },

  // Media Library
  media: {
    title: '媒体库',
    uploadFiles: '上传文件',
    dragDrop: '拖放文件到这里或',
    clickToUpload: '点击选择',
    supportedFormats: '支持：图片、视频、文档',
    maxSize: '最大 100MB/文件',
    
    // Filters
    allFiles: '所有文件',
    images: '图片',
    videos: '视频',
    documents: '文档',
    audio: '音频',
    
    // View modes
    gridView: '网格',
    listView: '列表',
    
    // Info
    fileName: '文件���',
    fileSize: '大小',
    fileType: '类型',
    uploadedBy: '上传者',
    uploadDate: '上传日期',
    usedIn: '使用于',
    
    // Actions
    selectFile: '选择文件',
    copyUrl: '复制 URL',
    urlCopied: 'URL 已复制',
    downloadFile: '下载',
    deleteFile: '删除',
    editMetadata: '编辑元数据',
    replaceFile: '替换文件',
    
    // Stats
    totalFiles: '文件总数',
    totalSize: '总大小',
    filesSelected: '个文件已选择',
  },

  // Dashboard
  dashboard: {
    welcome: '欢迎回来',
    overview: '这是您的 CMS 系统概览',
    systemHealthy: '系统运行正常',
    
    // Stats cards
    totalArticles: '文章总数',
    publishedToday: '今日发布',
    pendingReview: '待审核',
    totalViews: '总浏览量',
    totalComments: '评论',
    totalLikes: '喜欢',
    
    // Charts
    viewsChart: '浏览量趋势',
    articlesByType: '按类型分类',
    articlesByStatus: '按状态分类',
    topAuthors: '热门作者',
    
    // Recent activity
    recentActivity: '最近活动',
    recentArticles: '最新文章',
    popularArticles: '热门文章',
    
    // Quick actions
    quickActions: '快捷操作',
    createArticle: '创建文章',
    createCategory: '创建分类',
    uploadMedia: '上传媒体',
    reviewContent: '审核内容',
  },

  // Moderation
  moderation: {
    title: '内容审核',
    pendingItems: '待处理项目',
    reviewQueue: '审核队列',
    
    // Actions
    approve: '批准',
    reject: '拒绝',
    requestChanges: '请求更改',
    
    // Filters
    filterByType: '按类型筛选',
    filterByAuthor: '按作者筛选',
    filterByDate: '按日期筛选',
    
    // Stats
    totalPending: '总待处理',
    approvedToday: '今日已批准',
    rejectedToday: '今日已拒绝',
  },

  // Users
  users: {
    title: '用户管理',
    createNew: '添加用户',
    editUser: '编辑用户',
    
    // Fields
    username: '用户名',
    email: '邮箱',
    fullName: '全名',
    role: '角色',
    status: '状态',
    lastLogin: '最后登录',
    
    // Roles
    admin: '管理员',
    editor: '编辑',
    author: '作者',
    contributor: '贡献者',
    viewer: '查看者',
    
    // Status
    active: '活跃',
    inactive: '不活跃',
    suspended: '已暂停',
  },

  // Settings
  settings: {
    title: '设置',
    general: '常规',
    appearance: '外观',
    language: '语言',
    notifications: '通知',
    security: '安全',
    
    // General
    siteName: '网站名称',
    siteDescription: '网站描述',
    timezone: '时区',
    dateFormat: '日期格式',
    
    // Appearance
    theme: '主题',
    lightMode: '浅色',
    darkMode: '深色',
    autoMode: '自动',
  },

  // Crawler
  crawler: {
    title: '爬虫管理',
    campaigns: '活动',
    sources: '来源',
    articles: '已抓取文章',
    approved: '已批准文章',
    
    // Submenu labels
    submenu: {
      campaigns: '活动',
      sources: '来源',
      crawled: '已抓取文章',
      approved: '已批准文章',
    },
    
    // Campaign
    createCampaign: '创建活动',
    editCampaign: '编辑活动',
    campaignName: '活动名称',
    campaignDescription: '描述',
    campaignStatus: '状态',
    
    // Source
    createSource: '添加来源',
    editSource: '编辑来源',
    sourceName: '来源名称',
    sourceUrl: '来源 URL',
    sourceType: '来源类型',
    crawlFrequency: '抓取频率',
    lastCrawled: '最后抓取',
    
    // Actions
    startCrawl: '开始抓取',
    stopCrawl: '停止抓取',
    testSource: '测试来源',
    viewResults: '查看结果',
    
    // Stats
    totalSources: '来源总数',
    activeSources: '活跃',
    totalCrawled: '已抓取',
    pendingApproval: '待处理',
  },

  // AI Tools
  aiTools: {
    title: 'AI 工具',
    autoTranslate: '自动翻译',
    grammarCheck: '语法检查',
    seoOptimize: 'SEO 优化',
    contentSuggest: '内容建议',
    generateSummary: '生成摘要',
    generateTitle: '生成标题',
    generateTags: '生成标签',
    imageAlt: '生成替代文本',
    
    // Status
    processing: '处理中...',
    completed: '已完成',
    failed: '失败',
  },

  // Workflow
  workflow: {
    title: '工作流管理',
    createWorkflow: '创建工作流',
    editWorkflow: '编辑工作流',
    workflowName: '工作流名称',
    workflowSteps: '步骤',
    
    // Steps
    step: '步骤',
    addStep: '添加步骤',
    removeStep: '删除步骤',
    stepName: '步骤名称',
    assignTo: '分配给',
    
    // Actions
    approve: '批准',
    reject: '拒绝',
    requestRevision: '请求修订',
    moveToNext: '移至下一步',
  },

  // Event Stream
  eventStream: {
    title: '事件流',
    createStream: '创建流',
    editStream: '编辑流',
    streamName: '流名称',
    streamDescription: '描述',
    events: '事件',
    
    // Event
    createEvent: '创建事件',
    editEvent: '编辑事件',
    eventTitle: '事件标题',
    eventDate: '事件日期',
    eventTime: '时间',
    eventLocation: '地点',
    eventDescription: '描述',
    
    // Stats
    totalStreams: '流总数',
    upcomingEvents: '即将到来的事件',
    pastEvents: '过去的事件',
  },

  // Activity Log
  activity: {
    title: '活动日志',
    timeline: '时间线',
    filterByUser: '按用户筛选',
    filterByAction: '按操作筛选',
    filterByDate: '按日期筛选',
    
    // Actions
    created: '创建了',
    updated: '更新了',
    deleted: '删除了',
    published: '发布了',
    approved: '批准了',
    rejected: '拒绝了',
    
    // Time
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    weeksAgo: '周前',
    monthsAgo: '月前',
  },

  // Analytics
  analytics: {
    title: '分析与统计',
    overview: '概览',
    detailed: '详细',
    
    // Metrics
    pageviews: '页面浏览量',
    uniqueVisitors: '独立访客',
    bounceRate: '跳出率',
    avgTimeOnPage: '平均停留时间',
    topPages: '热门页面',
    topReferrers: '热门来源',
    
    // Time ranges
    today: '今天',
    yesterday: '昨天',
    last7Days: '最近 7 天',
    last30Days: '最近 30 天',
    thisMonth: '本月',
    lastMonth: '上月',
    custom: '自定义',
  },

  // Permissions
  permissions: {
    title: '权限组',
    createGroup: '创建组',
    editGroup: '编辑组',
    groupName: '组名称',
    groupDescription: '描述',
    members: '成员',
    searchPlaceholder: '搜索权限组...',
    
    // Actions
    canCreate: '创建',
    canRead: '读取',
    canUpdate: '更新',
    canDelete: '删除',
    canPublish: '发布',
    canApprove: '批准',
    
    // Resources
    articles: '文章',
    categories: '分类',
    media: '媒体',
    users: '用户',
    settings: '设置',
  },

  // Placeholders (for inputs, textareas)
  placeholders: {
    // Search
    searchCommand: '搜索命令...',
    searchMedia: '在媒体库中搜索...',
    searchCrawler: '搜索爬虫源...',
    searchHistory: '搜索历史...',
    searchArticles: '搜索文章...',
    searchEventStream: '搜索事件流...',
    
    // Dates
    dateFrom: '开始日期',
    dateTo: '结束日期',
    
    // File sizes
    sizeMin: '最小',
    sizeMax: '最大',
    
    // Media
    uploaderName: '上传者姓名...',
    fileDescription: '输入文件描述...',
    addNewTag: '添加新标签...',
    
    // Crawler
    webhookUrl: 'https://hooks.slack.com/...',
    crawlerName: '例如：VnExpress Technology',
    rssUrl: 'https://example.com/rss',
    
    // Content
    startWriting: '开始编写内容...',
    shortDescription: '文章简短描述...',
    readingTime: '5',
    videoUrl: 'https://youtube.com/watch?v=...',
    timestamp: '15:30',
    timestamps: '00:00 - 简介...',
    galleryDescription: '此图片库的描述...',
    documentNumber: '15/2024/NĐ-CP',
    issuingAuthority: '政府',
    jobPosition: '高级前端开发工程师',
    years: '2',
    eventName: '例如：Tech Summit 2025',
    eventDescription: '此活动系列的描述...',
  },

  // Tooltips (for title attributes)
  tooltips: {
    delete: '删除',
    edit: '编辑',
    editItem: '编辑',
    view: '查看',
    add: '添加',
    changePassword: '更改密码',
    more: '更多',
  },
};