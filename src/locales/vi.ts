export default {
  // Common
  common: {
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    create: 'Tạo mới',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    export: 'Xuất',
    import: 'Nhập',
    upload: 'Tải lên',
    download: 'Tải xuống',
    view: 'Xem',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước',
    confirm: 'Xác nhận',
    yes: 'Có',
    no: 'Không',
    all: 'Tất cả',
    select: 'Chọn',
    selected: 'đã chọn',
    actions: 'Thao tác',
    loading: 'Đang tải...',
    saving: 'Đang lưu...',
    publishing: 'Đang xuất bản...',
    draft: 'Lưu nháp',
  },

  // Confirmations
  confirmations: {
    deleteArticle: 'Bạn có chắc chắn muốn xóa bài viết này?',
    deleteCategory: 'Bạn có chắc chắn muốn xóa danh mục này?',
    deleteCategoryWithArticles: 'Bạn có chắc chắn muốn xóa danh mục này? Tất cả bài viết trong danh mục sẽ bị di chuyển về "Chưa phân loại".',
    deletePermissionGroup: 'Bạn có chắc chắn muốn xóa nhóm quyền "{{name}}"?',
    deletePermissionGroupWithMembers: 'Bạn có chắc chắn muốn xóa nhóm quyền "{{name}}"? Tất cả thành viên sẽ mất quyền truy cập này.',
    removeMember: 'Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?',
  },

  // Search
  search: {
    placeholder: 'Tìm kiếm nhanh...',
    recentSearches: 'Tìm kiếm gần đây',
    quickActions: 'Thao tác nhanh',
    commandPalette: 'Tìm kiếm lệnh...',
  },

  // Header
  header: {
    createNew: 'Tạo mới',
    profile: 'Hồ sơ của tôi',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    adminUser: 'Admin User',
    adminEmail: 'admin@cms.com',
    premiumPlan: 'Premium Plan',
    pro: 'PRO',
    expiresIn: 'Expires in 30 days',
    i18nTestSuite: '🧪 i18n Test Suite',
    
    // Notifications
    newComments: '{{count}} bình luận mới cần duyệt',
    pendingApproval: '{{count}} bài viết chờ phê duyệt',
    crawlerCollected: 'Crawler thu thập {{count}} bài mới',
    backupComplete: 'Backup hoàn tất thành công',
    minutesAgo: '{{count}} phút trước',
    hoursAgo: '{{count}} giờ trước',
    
    // Quick actions
    createArticle: 'Tạo bài viết mới',
    uploadMedia: 'Upload media',
    viewStats: 'Xem thống kê',
    manageCategories: 'Quản lý danh mục',
    
    // Recent searches
    recentSearch1: {
      query: 'Bài viết về AI',
      type: 'Bài viết',
    },
    recentSearch2: {
      query: 'Video hướng dẫn React',
      type: 'Media',
    },
    recentSearch3: {
      query: 'Thư viện ảnh 2024',
      type: 'Gallery',
    },
  },

  // Menu Navigation
  menu: {
    dashboard: 'Bảng điều khiển',
    articles: 'Bài viết',
    categories: 'Danh mục',
    media: 'Thư viện Media',
    comments: 'Bình luận',
    users: 'Người dùng',
    moderation: 'Kiểm duyệt',
    moderationAll: 'Kiểm duyệt nội dung',
    analytics: 'Phân tích & Thống kê',
    crawler: 'Crawler',
    settings: 'Cài đặt',
    eventSeries: 'Dòng sự kiện',
    permissions: 'Nhóm quyền',
    aiTools: 'AI Tools',
    activity: 'Nhật ký hoạt động',
  },

  // Article Types
  articleTypes: {
    news: 'Tin tức',
    video: 'Video',
    gallery: 'Thư viện ảnh',
    legal: 'Văn bản pháp luật',
    legalShort: 'Văn bản PL',
    staff: 'Nhân sự',
    job: 'Tuyển dụng',
    podcast: 'Podcast',
    event: 'Sự kiện',
    download: 'Tải xuống',
  },

  // Article Status
  status: {
    published: 'Đã xuất bản',
    draft: 'Nháp',
    review: 'Chờ duyệt',
    scheduled: 'Đã lên lịch',
    archived: 'Đã lưu trữ',
    rejected: 'Từ chối',
    pending: 'Chờ xử lý',
  },

  // Article Management
  articles: {
    title: 'Quản lý bài viết',
    createNew: 'Tạo bài viết mới',
    editArticle: 'Chỉnh sửa bài viết',
    deleteArticle: 'Xóa bài viết',
    bulkActions: 'Thao tác hàng loạt',
    selectAll: 'Chọn tất cả',
    deselectAll: 'Bỏ chọn tất cả',
    selectedItems: 'bài viết',
    noArticles: 'Không có bài viết nào',
    searchPlaceholder: 'Tìm kiếm bài viết...',
    
    // Columns
    columns: {
      id: 'ID',
      thumbnail: 'Hình ảnh',
      title: 'Tiêu đề',
      type: 'Loại',
      status: 'Trạng thái',
      category: 'Danh mục',
      author: 'Tác giả',
      views: 'Lượt xem',
      comments: 'Bình luận',
      publishDate: 'Ngày xuất bản',
      updatedDate: 'Cập nhật',
      featured: 'Nổi bật',
      actions: 'Thao tác',
    },

    // Actions
    viewDetail: 'Xem chi tiết',
    markFeatured: 'Đánh dấu nổi bật',
    unmarkFeatured: 'Bỏ nổi bật',
    moveTo: 'Di chuyển đến',
    duplicate: 'Nhân bản',
    archive: 'Lưu trữ',
    restore: 'Khôi phục',
    
    // Filters
    filterByType: 'Lọc theo loại',
    filterByStatus: 'Lọc theo trạng thái',
    filterByCategory: 'Lọc theo danh mục',
    filterByAuthor: 'Lọc theo tác giả',
    
    // View modes
    viewTable: 'Bảng',
    viewList: 'Danh sách',
    viewGrid: 'Lưới',
    
    // Column selector
    columnsDisplay: 'Cột hiển thị',
    resetColumns: 'Đặt lại',
    columnsCount: 'cột',
  },

  // Article Editor
  editor: {
    title: 'Tiêu đề bài viết',
    titlePlaceholder: 'Tiêu đề bài viết...',
    content: 'Nội dung',
    contentPlaceholder: 'Bắt đầu viết nội dung...',
    excerpt: 'Mô tả ngắn',
    excerptPlaceholder: 'Mô tả ngắn gọn về bài viết...',
    
    // Tabs
    editMode: 'Chỉnh sửa',
    previewMode: 'Xem trước',
    
    // Article type selector
    selectType: 'Loại bài viết',
    selectTypeRequired: 'Loại bài viết *',
    
    // Media
    thumbnail: 'Ảnh đại diện',
    thumbnailRequired: 'Ảnh đại diện *',
    uploadImage: 'Click để tải ảnh lên',
    uploadImageHelp: 'PNG, JPG hoặc WebP (max. 5MB)',
    dragDropImages: 'Kéo thả hoặc click để thêm ảnh',
    dragDropImagesHelp: 'Hỗ trợ nhiều ảnh cùng lúc. PNG, JPG, WebP (max 10MB/ảnh)',
    
    // Categories & Tags
    categories: 'Danh mục',
    categoriesRequired: 'Danh mục *',
    selectCategories: 'Chọn danh mục',
    searchCategories: 'Tìm kiếm danh mục...',
    tags: 'Tags',
    addTag: 'Thêm tag...',
    
    // Author
    author: 'Tác giả',
    authorRequired: 'Tác giả *',
    selectAuthor: 'Chọn tác giả',
    addNewAuthor: 'Thêm tác giả mới',
    authorName: 'Tên tác giả',
    authorNamePlaceholder: 'Nhập tên tác giả mới...',
    
    // AI Tools
    aiTools: 'AI Tools',
    translateAuto: 'Dịch tự động',
    checkGrammar: 'Kiểm tra chính tả',
    optimizeSEO: 'Tối ưu SEO',
    suggestContent: 'Gợi ý nội dung',
    
    // Buttons
    saveAndContinue: 'Lưu và thêm tiếp',
    saveDraft: 'Lưu nháp',
    lastSaved: 'Đã lưu lúc',
    
    // Video specific
    videoUrl: 'URL Video',
    videoUrlPlaceholder: 'https://youtube.com/watch?v=...',
    duration: 'Thời lượng',
    durationPlaceholder: '00:00',
    
    // Gallery specific
    noImages: 'Chưa có ảnh nào trong gallery',
    imageCaption: 'Chú thích ảnh',
    
    // Job specific
    position: 'Vị trí tuyển dụng',
    salary: 'Mức lương',
    location: 'Địa điểm',
    deadline: 'Hạn nộp',
    requirements: 'Yêu cầu',
    benefits: 'Quyền lợi',
    
    // Event specific
    eventDate: 'Ngày sự kiện',
    eventTime: 'Giờ sự kiện',
    venue: 'Địa điểm tổ chức',
    maxParticipants: 'Số người tối đa',
    registrationCount: 'Đã đăng ký',
    
    // Podcast specific
    episode: 'Tập số',
    audioUrl: 'URL Audio',
    albumArt: 'Album Art',
    
    // Legal specific
    documentNumber: 'Số hiệu văn bản',
    documentType: 'Loại văn bản',
    issueDate: 'Ngày ban hành',
    effectiveDate: 'Ngày hiệu lực',
    issuingAuthority: 'Cơ quan ban hành',
    
    // Staff specific
    department: 'Phòng ban',
    joinDate: 'Ngày vào làm',
    bio: 'Tiểu sử',
    
    // Download specific
    fileType: 'Loại file',
    fileSize: 'Dung lượng',
    downloadUrl: 'Link tải xuống',
    
    // Reading time
    readingTime: 'Thời gian đọc (phút)',
    readingTimeUnit: 'phút đọc',
    
    // Stats
    characters: 'characters',
    words: 'words',
  },

  // Categories
  categories: {
    title: 'Quản lý danh mục',
    createNew: 'Tạo danh mục mới',
    editCategory: 'Chỉnh sửa danh mục',
    deleteCategory: 'Xóa danh mục',
    noCategories: 'Không có danh mục nào',
    
    // Form
    name: 'Tên danh mục',
    nameRequired: 'Tên danh mục *',
    namePlaceholder: 'Nhập tên danh mục...',
    slug: 'Slug',
    slugPlaceholder: 'url-friendly-slug',
    description: 'Mô tả',
    descriptionPlaceholder: 'Mô tả về danh mục...',
    parentCategory: 'Danh mục cha',
    selectParent: 'Chọn danh mục cha (không bắt buộc)',
    noParent: 'Không có (Danh mục gốc)',
    icon: 'Icon',
    color: 'Màu sắc',
    image: 'Hình ảnh',
    allowedContentTypes: 'Loại nội dung cho phép',
    
    // Stats
    totalArticles: 'Tổng bài viết',
    publishedArticles: 'Đã xuất bản',
    draftArticles: 'Bản nháp',
    subcategories: 'Danh mục con',
    
    // Actions
    viewArticles: 'Xem bài viết',
    addSubcategory: 'Thêm danh mục con',
    moveCategory: 'Di chuyển',
    mergeCategories: 'Gộp danh mục',
  },

  // Media Library
  media: {
    title: 'Thư viện Media',
    uploadFiles: 'Tải file lên',
    dragDrop: 'Kéo thả file vào đây hoặc',
    clickToUpload: 'click để chọn',
    supportedFormats: 'Hỗ trợ: Images, Videos, Documents',
    maxSize: 'Tối đa 100MB/file',
    
    // Filters
    allFiles: 'Tất cả file',
    images: 'Hình ảnh',
    videos: 'Video',
    documents: 'Tài liệu',
    audio: 'Âm thanh',
    
    // View modes
    gridView: 'Lưới',
    listView: 'Danh sách',
    
    // Info
    fileName: 'Tên file',
    fileSize: 'Kích thước',
    fileType: 'Loại',
    uploadedBy: 'Tải lên bởi',
    uploadDate: 'Ngày tải lên',
    usedIn: 'Sử dng trong',
    
    // Actions
    selectFile: 'Chọn file',
    copyUrl: 'Copy URL',
    urlCopied: 'Đã copy URL',
    downloadFile: 'Tải xuống',
    deleteFile: 'Xóa file',
    editMetadata: 'Sửa metadata',
    replaceFile: 'Thay thế file',
    
    // Stats
    totalFiles: 'Tổng số file',
    totalSize: 'Tổng dung lượng',
    filesSelected: 'file đã chọn',
  },

  // Dashboard
  dashboard: {
    welcome: 'Chào mừng trở lại',
    overview: 'Đây là tổng quan hệ thống CMS của bạn',
    systemHealthy: 'Hệ thống hoạt động tốt',
    
    // Stats cards
    totalArticles: 'Tổng bài viết',
    publishedToday: 'Xuất bản hôm nay',
    pendingReview: 'Chờ duyệt',
    totalViews: 'Lượt xem',
    totalComments: 'Bình luận',
    totalLikes: 'Yêu thích',
    
    // Charts
    viewsChart: 'Lượt xem theo thời gian',
    articlesByType: 'Bài viết theo loại',
    articlesByStatus: 'Bài viết theo trạng thái',
    topAuthors: 'Tác giả nổi bật',
    
    // Recent activity
    recentActivity: 'Hoạt động gần đây',
    recentArticles: 'Bài viết mới nhất',
    popularArticles: 'Bài viết nổi bật',
    
    // Quick actions
    quickActions: 'Thao tác nhanh',
    createArticle: 'Tạo bài viết',
    createCategory: 'Tạo danh mục',
    uploadMedia: 'Tải media',
    reviewContent: 'Kiểm duyệt',
  },

  // Moderation
  moderation: {
    title: 'Kiểm duyệt tổng hợp',
    pendingItems: 'Nội dung chờ duyệt',
    reviewQueue: 'Hàng đợi kiểm duyệt',
    
    // Actions
    approve: 'Phê duyệt',
    reject: 'Từ chối',
    requestChanges: 'Yêu cầu chỉnh sửa',
    
    // Filters
    filterByType: 'Lọc theo loại',
    filterByAuthor: 'Lọc theo tác giả',
    filterByDate: 'Lọc theo ngày',
    
    // Stats
    totalPending: 'Tổng chờ duyệt',
    approvedToday: 'Đã duyệt hm nay',
    rejectedToday: 'Từ chối hôm nay',
  },

  // Users
  users: {
    title: 'Quản lý người dùng',
    createNew: 'Thêm người dùng',
    editUser: 'Chỉnh sửa người dùng',
    
    // Fields
    username: 'Tên đăng nhập',
    email: 'Email',
    fullName: 'Họ và tên',
    role: 'Vai trò',
    status: 'Trạng thái',
    lastLogin: 'Đăng nhập cuối',
    
    // Roles
    admin: 'Quản trị viên',
    editor: 'Biên tập viên',
    author: 'Tác giả',
    contributor: 'Cộng tác viên',
    viewer: 'Người xem',
    
    // Status
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    suspended: 'Tạm khóa',
  },

  // Settings
  settings: {
    title: 'Cài đặt',
    general: 'Cài đặt chung',
    appearance: 'Giao diện',
    language: 'Ngôn ngữ',
    notifications: 'Thông báo',
    security: 'Bảo mật',
    email: 'Email',
    api_webhooks: 'API & Webhooks',
    database: 'Database',
    
    siteName: 'Tên website',
    siteDescription: 'Mô tả website',
    timezone: 'Múi giờ',
    dateFormat: 'Định dạng ngày',
    
    theme: 'Giao diện',
    lightMode: 'Sáng',
    darkMode: 'Tối',
    autoMode: 'Tự động',
  },
  
  // Bulk Operations
  publish: 'Xuất bản',
  publish_description: 'Xuất bản ngay lập tức',
  unpublish: 'Hủy xuất bản',
  unpublish_description: 'Ẩn khỏi trang web',
  schedule: 'Lên lịch',
  schedule_description: 'Đặt lịch xuất bản',
  archive: 'Lưu trữ',
  archive_description: 'Chuyển vào kho lưu trữ',
  delete: 'Xóa',
  delete_description: 'Xóa vĩnh viễn',
  move_category: 'Chuyển danh mục',
  move_category_description: 'Di chuyển sang danh mục khác',
  assign_author: 'Gán tác giả',
  assign_author_description: 'Thay đổi tác giả',
  add_tags: 'Thêm tags',
  add_tags_description: 'Gắn tags cho bài viết',
  export: 'Xuất dữ liệu',
  export_description: 'Tải về file',
  duplicate: 'Nhân bản',
  duplicate_description: 'Tạo bản sao',
  private: 'Riêng tư',
  private_description: 'Đặt chế độ riêng tư',

  // Crawler
  crawler: {
    title: 'Quản lý Crawler',
    campaigns: 'Chiến dịch',
    sources: 'Nguồn thu thập',
    articles: 'Bài viết đã thu thập',
    approved: 'Bài viết đã duyệt',
    
    // Submenu labels
    submenu: {
      campaigns: 'Chiến dịch',
      sources: 'Nguồn thu thập',
      crawled: 'Bài viết đã thu thập',
      approved: 'Bài viết đã duyệt',
    },
    
    // Campaign
    createCampaign: 'Tạo chiến dịch',
    editCampaign: 'Sửa chiến dịch',
    campaignName: 'Tên chiến dịch',
    campaignDescription: 'Mô tả chiến dịch',
    campaignStatus: 'Trạng thái',
    
    // Source
    createSource: 'Thêm nguồn',
    editSource: 'Sửa nguồn',
    sourceName: 'Tên nguồn',
    sourceUrl: 'URL nguồn',
    sourceType: 'Loại nguồn',
    crawlFrequency: 'Tần suất thu thập',
    lastCrawled: 'Thu thập lần cuối',
    
    // Actions
    startCrawl: 'Bắt đầu thu thập',
    stopCrawl: 'Dừng thu thập',
    testSource: 'Kiểm tra nguồn',
    viewResults: 'Xem kết quả',
    
    // Stats
    totalSources: 'Tổng nguồn',
    activeSources: 'Đang hoạt động',
    totalCrawled: 'Đã thu thập',
    pendingApproval: 'Chờ duyệt',
  },

  // AI Tools
  aiTools: {
    title: 'AI Tools',
    autoTranslate: 'Dịch tự động',
    grammarCheck: 'Kiểm tra ngữ pháp',
    seoOptimize: 'Tối ưu SEO',
    contentSuggest: 'Gợi ý nội dung',
    generateSummary: 'Tạo tóm tắt',
    generateTitle: 'Tạo tiêu đề',
    generateTags: 'Tạo tags',
    imageAlt: 'Tạo Alt text cho ảnh',
    
    // Status
    processing: 'Đang xử lý...',
    completed: 'Hoàn thành',
    failed: 'Thất bại',
  },

  // Workflow
  workflow: {
    title: 'Quản lý luồng duyệt',
    createWorkflow: 'Tạo luồng mới',
    editWorkflow: 'Sửa luồng',
    workflowName: 'Tên luồng',
    workflowSteps: 'Các bước',
    
    // Steps
    step: 'Bước',
    addStep: 'Thêm bước',
    removeStep: 'Xóa bước',
    stepName: 'Tên bước',
    assignTo: 'Giao cho',
    
    // Actions
    approve: 'Phê duyệt',
    reject: 'Từ chối',
    requestRevision: 'Yêu cầu chỉnh sửa',
    moveToNext: 'Chuyển bước tiếp',
  },

  // Event Stream
  eventStream: {
    title: 'Dòng sự kiện',
    createStream: 'Tạo dòng sự kiện',
    editStream: 'Sửa dòng sự kiện',
    streamName: 'Tên dòng sự kiện',
    streamDescription: 'Mô tả',
    events: 'Sự kiện',
    
    // Event
    createEvent: 'Tạo sự kiện',
    editEvent: 'Sửa sự kiện',
    eventTitle: 'Tiêu đề sự kiện',
    eventDate: 'Ngày sự kiện',
    eventTime: 'Giờ',
    eventLocation: 'Địa điểm',
    eventDescription: 'Mô tả sự kiện',
    
    // Stats
    totalStreams: 'Tổng dòng sự kiện',
    upcomingEvents: 'Sự kiện sắp tới',
    pastEvents: 'Sự kiện đã qua',
  },

  // Activity Log
  activity: {
    title: 'Nhật ký hoạt động',
    timeline: 'Dòng thời gian',
    filterByUser: 'Lọc theo người dùng',
    filterByAction: 'Lọc theo hành động',
    filterByDate: 'Lọc theo ngày',
    
    // Actions
    created: 'đã tạo',
    updated: 'đã cập nhật',
    deleted: 'đã xóa',
    published: 'đã xuất bản',
    approved: 'đã duyệt',
    rejected: 'đã từ chối',
    
    // Time
    justNow: 'Vừa xong',
    minutesAgo: 'phút trước',
    hoursAgo: 'giờ trước',
    daysAgo: 'ngày trước',
    weeksAgo: 'tuần trước',
    monthsAgo: 'tháng trước',
  },

  // Analytics
  analytics: {
    title: 'Phân tích & Thống kê',
    overview: 'Tổng quan',
    detailed: 'Chi tiết',
    
    // Metrics
    pageviews: 'Lượt xem trang',
    uniqueVisitors: 'Người truy cập',
    bounceRate: 'Tỷ lệ thoát',
    avgTimeOnPage: 'Thời gian trung bình',
    topPages: 'Trang phổ biến',
    topReferrers: 'Nguồn giới thiệu',
    
    // Time ranges
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    last7Days: '7 ngày qua',
    last30Days: '30 ngày qua',
    thisMonth: 'Tháng này',
    lastMonth: 'Tháng trước',
    custom: 'Tùy chỉnh',
  },

  // Permissions
  permissions: {
    title: 'Quản lý nhóm quyền',
    createGroup: 'Tạo nhóm quyền',
    editGroup: 'Sửa nhóm quyền',
    groupName: 'Tên nhóm',
    groupDescription: 'Mô tả nhóm',
    members: 'Thành viên',
    searchPlaceholder: 'Tìm kiếm nhóm quyền...',
    
    // Actions
    canCreate: 'Tạo mới',
    canRead: 'Xem',
    canUpdate: 'Cập nhật',
    canDelete: 'Xóa',
    canPublish: 'Xuất bản',
    canApprove: 'Phê duyệt',
    
    // Resources
    articles: 'Bài viết',
    categories: 'Danh mục',
    media: 'Media',
    users: 'Người dùng',
    settings: 'Cài đặt',
  },

  // Placeholders (for inputs, textareas)
  placeholders: {
    // Search
    searchCommand: 'Tìm kiếm lệnh...',
    searchMedia: 'Tìm kiếm trong Media Library...',
    searchCrawler: 'Tìm kiếm nguồn crawler...',
    searchHistory: 'Tìm kiếm lịch sử...',
    searchArticles: 'Tìm kiếm bài viết...',
    searchEventStream: 'Tìm kiếm dòng sự kiện...',
    
    // Dates
    dateFrom: 'Từ ngày',
    dateTo: 'Đến ngày',
    
    // File sizes
    sizeMin: 'Min',
    sizeMax: 'Max',
    
    // Media
    uploaderName: 'Tên người upload...',
    fileDescription: 'Nhập mô tả cho file...',
    addNewTag: 'Nhập tag mới...',
    
    // Crawler
    webhookUrl: 'https://hooks.slack.com/...',
    crawlerName: 'VD: VnExpress Technology',
    rssUrl: 'https://example.com/rss',
    
    // Content
    startWriting: 'Bắt đầu viết nội dung...',
    shortDescription: 'Mô tả ngắn gọn về bài viết...',
    readingTime: '5',
    videoUrl: 'https://youtube.com/watch?v=...',
    timestamp: '15:30',
    timestamps: '00:00 - Giới thiệu...',
    galleryDescription: 'Mô tả về bộ sưu tập ảnh này...',
    documentNumber: '15/2024/NĐ-CP',
    issuingAuthority: 'Chính phủ',
    jobPosition: 'Senior Frontend Developer',
    years: '2',
    eventName: 'VD: Tech Summit 2025',
    eventDescription: 'Mô tả về dòng sự kiện này...',
    
    // Recruitment specific
    numberOfPositions: '2',
    salary: '25-35 triệu',
    location: 'Hà Nội',
    contactEmail: 'hr@company.com',
    contactPhone: '024 1234 5678',
    minYears: '2',
    maxYears: '12',
    
    // Podcast specific
    duration: '45:30',
    guests: 'Dr. Nguyễn Văn X - AI Researcher\nMs. Trần Thị Y - Content Strategist',
    
    // Image & Gallery
    imageCaption: 'Nhập tiêu đề ảnh...',
    
    // Categories & Tags
    searchCategories: 'Tìm danh mục...',
    addTag: 'Thêm tag...',
    addAuthor: 'Nhập tên tác giả mới...',
    
    // User Management
    fullName: 'Nguyễn Văn A',
    email: 'email@cms.com',
    phone: '0123456789',
    password: '••••••••',
    confirmPassword: '••••••••',
    
    // Global Search
    searchCMS: 'Tìm kiếm trong CMS...',
    
    // SEO
    seoUrl: 'https://example.com/article',
    seoTitleExample: 'Tiêu đề SEO (mặc định sẽ dùng tên dòng)',
    seoDescriptionExample: 'Mô tả SEO (mặc định sẽ dùng mô tả chính)',
    
    // Category Management
    categoryNameExample: 'e.g., Technology News',
    categorySlugExample: 'auto-generated',
    searchTypes: 'Search types...',
    categoryDescription: 'Category description...',
    categoryIcon: '📁',
    
    // Crawler Management
    campaignNameExample: 'e.g., Technology News Q4 2024',
    campaignDescription: 'Campaign description...',
    targetArticles: '1000',
    searchSources: 'Search sources...',
    sourceNameExample: 'VD: VnExpress Tin mới nhất',
    sourceUrl: 'https://example.com/rss/feed.xml',
    
    // Advanced Search
    dateFrom: 'Từ ngày',
    dateTo: 'Đến ngày',
    minViewsExample: 'VD: 1000',
    minCommentsExample: 'VD: 10',
    
    // Comments
    writeReply: 'Viết phản hồi...',
    addComment: 'Thêm bình luận hoặc góp ý...',
    
    // Templates
    searchTemplates: 'Search templates...',
    
    // Event Streams
    eventStreamNameExample: 'VD: Tech Summit 2024',
    eventStreamSlug: 'tu-dong-tao-tu-ten',
    eventStreamDescription: 'Mô tả ngắn gọn về dòng sự kiện này...',
    thumbnailUrl: 'URL ảnh thumbnail...',
    enterTag: 'Nhập tag và nhấn Enter...',
    searchArticleStream: 'Tìm kiếm bài viết...',
    
    // Automation
    ruleNameExample: 'VD: Auto-publish weekly article',
    ruleDescription: 'Mô tả ngắn gọn về rule này...',
    
    // Bulk Operations
    addNewTag: 'Hoặc nhập tag mới...',
    
    // Workflow
    addCommentWorkflow: 'Thêm bình luận...',
    
    // Category Form
    categoryNamePlaceholder: 'Ví dụ: Tin tức công nghệ',
    categorySlugPlaceholder: 'tin-tuc-cong-nghe',
    categoryDescPlaceholder: 'Mô tả ngắn gọn về danh mục này...',
    enterKeyword: 'Nhập từ khóa và nhấn Enter',
    
    // Permission Groups
    permissionGroupName: 'Ví dụ: Editor Công nghệ, Reviewer Tin tức...',
    permissionGroupDesc: 'Mô tả vai trò và trách nhiệm của nhóm quyền này...',
    
    // AI Tools
    seoKeywords: 'Nhập từ khóa SEO...',
    contentToProcess: 'Nhập nội dung cần xử lý...',
    
    // Article Editor (src/modules)
    articleTitle: 'Enter article title...',
    articleSlug: 'auto-generated-from-title',
    articleSummary: 'Brief summary of your article...',
    seoMetaTitle: 'Leave empty to use article title',
    seoMetaDescription: 'Description for search engines...',
    ogImageUrl: 'https://example.com/image.jpg',
    
    // Comment Moderation
    searchComments: 'Search comments...',
    writeYourReply: 'Write your reply...',
    
    // Crawler Config
    crawlerSourceExample: 'e.g., TechCrunch',
    crawlerUrlExample: 'https://example.com',
    cssSelector: 'article.post',
    titleSelector: 'h1.title',
    
    // Media
    searchMedia: 'Search media...',
    searchFiles: 'Search files...',
    folderName: 'Folder name',
    
    // Users
    searchUsers: 'Search users...',
    
    // Roles
    searchRoles: 'Search roles...',
    roleNameExample: 'e.g., Content Manager',
    roleKeyExample: 'e.g., content_manager',
    roleDescription: 'Brief description of this role...',
    
    // Settings
    currentPassword: 'Current password',
    newPassword: 'New password',
    
    // Multi-language
    translatedTitle: 'Translated title...',
    translatedSummary: 'Translated summary...',
    translatedContent: 'Translated content...',
    translatedSlug: 'translated-slug',
    
    // Tags (general)
    tagsExample: 'react, typescript, tutorial',
    
    // Search filters
    searchByTitle: 'Search by title, content, or ID...',
    
    // Category specific
    categoryNameVi: 'Ví dụ: Tin tức công nghệ',
    categorySlugVi: 'tin-tuc-cong-nghe',
    categoryDescVi: 'Mô tả ngắn gọn về danh mục này...',
    seoTitleOptimized: 'Optimized title for search engines',
    seoDescOptimized: 'Meta description for search results',
  },

  // Tooltips (for title attributes)
  tooltips: {
    delete: 'Xóa',
    edit: 'Sửa',
    editItem: 'Chỉnh sửa',
    view: 'Xem',
    viewDetail: 'Xem chi tiết',
    add: 'Thêm',
    addNew: 'Thêm mới',
    changePassword: 'Đổi mật khẩu',
    more: 'Thêm',
    
    // Actions
    runNow: 'Chạy ngay',
    pause: 'Tạm dừng',
    resume: 'Tiếp tục',
    restart: 'Chạy lại',
    download: 'Tải xuống',
    share: 'Chia sẻ',
    restore: 'Khôi phục',
    deletePermanently: 'Xóa vĩnh viễn',
    deselect: 'Bỏ chọn',
    
    // Comments
    approve: 'Duyệt',
    markAsSpam: 'Đánh dấu spam',
    
    // View modes
    tableView: 'Dạng bảng',
    listView: 'Dạng danh sách',
    gridView: 'Dạng lưới',
    
    // Editor
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    insertLink: 'Insert Link',
    insertImage: 'Insert Image',
    insertVideo: 'Insert Video',
    codeBlock: 'Code Block',
    quote: 'Quote',
    undo: 'Undo',
    redo: 'Redo',
  },
};