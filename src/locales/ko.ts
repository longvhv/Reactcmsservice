export default {
  // Common
  common: {
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    edit: '편집',
    create: '생성',
    search: '검색',
    filter: '필터',
    export: '내보내기',
    import: '가져오기',
    upload: '업로드',
    download: '다운로드',
    view: '보기',
    close: '닫기',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    confirm: '확인',
    yes: '예',
    no: '아니오',
    all: '전체',
    select: '선택',
    selected: '선택됨',
    actions: '작업',
    loading: '로딩 중...',
    saving: '저장 중...',
    publishing: '게시 중...',
    draft: '초안 저장',
    publish: '게시',
    preview: '미리보기',
    settings: '설정',
    language: '언어',
  },

  // Confirmations
  confirmations: {
    deleteArticle: '이 게시물을 삭제하시겠습니까?',
    deleteCategory: '이 카테고리를 삭제하시겠습니까?',
    deleteCategoryWithArticles: '이 카테고리를 삭제하시겠습니까? 이 카테고리의 모든 게시물은 "미분류"로 이동됩니다.',
    deletePermissionGroup: '권한 그룹 "{{name}}"을(를) 삭제하시겠습니까?',
    deletePermissionGroupWithMembers: '권한 그룹 "{{name}}"을(를) 삭제하시겠습니까? 모든 구성원이 이 액세스 권한을 잃게 됩니다.',
    removeMember: '이 구성원을 그룹에서 제거하시겠습니까?',
  },

  // Search
  search: {
    placeholder: '빠른 검색...',
    recentSearches: '최근 검색',
    quickActions: '빠른 작업',
    commandPalette: '명령 검색...',
  },

  // Header
  header: {
    createNew: '새로 만들기',
    profile: '내 프로필',
    settings: '설정',
    logout: '로그아웃',
    adminUser: '관리자',
    adminEmail: 'admin@cms.com',
    premiumPlan: '프리미엄 플랜',
    pro: 'PRO',
    expiresIn: '30일 후 만료',
    i18nTestSuite: '🧪 i18n 테스트 스위트',
    
    // Notifications
    newComments: '{{count}}개의 새 댓글이 검토 대기 중입니다',
    pendingApproval: '{{count}}개의 게시물이 승인 대기 중입니다',
    crawlerCollected: '크롤러가 {{count}}개의 새 게시물을 수집했습니다',
    backupComplete: '백업이 성공적으로 완료되었습니다',
    minutesAgo: '{{count}}분 전',
    hoursAgo: '{{count}}시간 전',
    
    // Quick actions
    createArticle: '새 게시물 작성',
    uploadMedia: '미디어 업로드',
    viewStats: '통계 보기',
    manageCategories: '카테고리 관리',
    
    // Recent searches
    recentSearch1: {
      query: 'AI 관련 게시물',
      type: '게시물',
    },
    recentSearch2: {
      query: 'React 튜토리얼 영상',
      type: '미디어',
    },
    recentSearch3: {
      query: '2024 이미지 갤러리',
      type: '갤러리',
    },
  },

  // Menu Navigation
  menu: {
    dashboard: '대시보드',
    articles: '게시물',
    categories: '카테고리',
    media: '미디어 라이브러리',
    comments: '댓글',
    users: '사용자',
    moderation: '검토',
    moderationAll: '콘텐츠 검토',
    analytics: '분석 및 통계',
    crawler: '크롤러',
    settings: '설정',
    eventSeries: '이벤트 스트림',
    permissions: '권한 그룹',
    aiTools: 'AI 도구',
    activity: '활동 로그',
  },

  // Article Types
  articleTypes: {
    news: '뉴스',
    newsDesc: '일반 뉴스 기사',
    video: '비디오',
    videoDesc: '비디오 콘텐츠 기사',
    gallery: '갤러리',
    galleryDesc: '이미지 컬렉션',
    document: '문서',
    documentDesc: '문서 파일',
    legal: '법률 문서',
    legalDesc: '법률 문서 또는 규정',
    legalShort: '법률',
    personnel: '인사',
    personnelDesc: '인사 정보',
    staff: '직원',
    recruitment: '채용',
    recruitmentDesc: '채용 정보',
    job: '채용 공고',
    podcast: '팟캐스트',
    podcastDesc: '오디오 팟캐스트',
    event: '이벤트',
    eventDesc: '이벤트 정보',
    download: '다운로드',
    downloadDesc: '다운로드 가능한 파일',
    blog: '블로그',
    blogDesc: '블로그 게시물',
    tutorial: '튜토리얼',
    tutorialDesc: '튜토리얼 기사',
    pressRelease: '보도 자료',
    pressReleaseDesc: '보도 자료',
    interview: '인터뷰',
    interviewDesc: '인터뷰 기사',
    infographic: '인포그래픽',
    infographicDesc: '시각적 정보 차트',
  },

  // Article Status
  status: {
    published: '게시됨',
    draft: '초안',
    review: '검토 중',
    scheduled: '예약됨',
    archived: '보관됨',
    rejected: '거부됨',
    pending: '대기 중',
  },

  // Article Management
  articles: {
    title: '게시물 관리',
    createNew: '새 게시물 만들기',
    editArticle: '게시물 편집',
    deleteArticle: '게물 삭제',
    bulkActions: '일괄 작업',
    selectAll: '전체 선택',
    deselectAll: '전체 해제',
    selectedItems: '게시물',
    noArticles: '게시물을 찾을 수 없습니다',
    searchPlaceholder: '게시물 검색...',
    
    columns: {
      id: 'ID',
      thumbnail: '이미지',
      title: '제목',
      type: '유형',
      status: '상태',
      category: '카테고리',
      author: '작성자',
      views: '조회수',
      comments: '댓글',
      publishDate: '게시일',
      updatedDate: '수정일',
      featured: '추천',
      actions: '작업',
    },

    viewDetail: '상세 보기',
    markFeatured: '추천으로 표시',
    unmarkFeatured: '추천 해제',
    moveTo: '이동',
    duplicate: '복제',
    archive: '보관',
    restore: '복원',
    
    filterByType: '유형별 필터',
    filterByStatus: '상태별 필터',
    filterByCategory: '카테고리별 필터',
    filterByAuthor: '작성자별 필터',
    
    viewTable: '테이블',
    viewList: '목록',
    viewGrid: '그리드',
    
    columnsDisplay: '표시 열',
    resetColumns: '재설정',
    columnsCount: '열',
  },

  // Article Editor
  editor: {
    title: '게시물 제목',
    titlePlaceholder: '게시물 제목을 입력하세요...',
    content: '내용',
    contentPlaceholder: '내용 작성 시작...',
    excerpt: '요약',
    excerptPlaceholder: '게시물의 간단한 설명...',
    
    editMode: '편집',
    previewMode: '미리보기',
    
    selectType: '게시물 유형',
    selectTypeRequired: '게시물 유형 *',
    
    thumbnail: '썸네일',
    thumbnailRequired: '썸네일 *',
    uploadImage: '클릭하여 이미지 업로드',
    uploadImageHelp: 'PNG, JPG 또는 WebP (최대 5MB)',
    dragDropImages: '이미지를 드래그 앤 드롭하거나 클릭',
    dragDropImagesHelp: '여러 이미지 지원. PNG, JPG, WebP (이미지당 ��대 10MB)',
    
    categories: '카테고리',
    categoriesRequired: '카테고리 *',
    selectCategories: '카테고리 선택',
    searchCategories: '카테고리 검색...',
    tags: '태그',
    addTag: '태그 추가...',
    
    author: '작성자',
    authorRequired: '작성자 *',
    selectAuthor: '작성자 선택',
    addNewAuthor: '새 작성자 추가',
    authorName: '작성자 이름',
    authorNamePlaceholder: '작성자 이름 입력...',
    
    aiTools: 'AI 도구',
    translateAuto: '자동 번역',
    checkGrammar: '문법 검사',
    optimizeSEO: 'SEO 최적화',
    suggestContent: '콘텐츠 제안',
    
    saveAndContinue: '저장하고 계속',
    saveDraft: '초안 저장',
    lastSaved: '마지막 저장',
    
    videoUrl: '비디오 URL',
    videoUrlPlaceholder: 'https://youtube.com/watch?v=...',
    duration: '길이',
    durationPlaceholder: '00:00',
    
    noImages: '갤러리에 아직 이미지가 없습니다',
    imageCaption: '이미지 캡션',
    
    position: '직위',
    salary: '급여',
    location: '위치',
    deadline: '지원 마감일',
    requirements: '요구사항',
    benefits: '혜택',
    
    eventDate: '이벤트 날짜',
    eventTime: '이벤트 시간',
    venue: '장소',
    maxParticipants: '최대 참가자',
    registrationCount: '등록됨',
    
    episode: '에피소드',
    audioUrl: '오디오 URL',
    albumArt: '앨범 아트',
    
    documentNumber: '문서 번호',
    documentType: '문서 유형',
    issueDate: '발행일',
    effectiveDate: '시행일',
    issuingAuthority: '발행 기관',
    
    department: '부서',
    joinDate: '입사일',
    bio: '약력',
    
    fileType: '파일 유형',
    fileSize: '파일 크기',
    downloadUrl: '다운로드 URL',
    
    readingTime: '읽기 시간 (분)',
    readingTimeUnit: '분 읽기',
    
    characters: '문자',
    words: '단어',
  },

  // Categories
  categories: {
    title: '카테고리 관리',
    createNew: '새 카테고리 만들기',
    editCategory: '카테고리 편집',
    deleteCategory: '카테고리 삭제',
    noCategories: '카테고리를 찾을 수 없습니다',
    
    name: '카테리 이름',
    nameRequired: '카테고리 이름 *',
    namePlaceholder: '카테고리 이름 입력...',
    slug: '슬러그',
    slugPlaceholder: 'url-friendly-slug',
    description: '설명',
    descriptionPlaceholder: '카테고리 설명...',
    parentCategory: '상위 카테고리',
    selectParent: '상위 카테고리 선택 (선택사항)',
    noParent: '없음 (루트 카테고리)',
    icon: '아이콘',
    color: '색상',
    image: '이미지',
    allowedContentTypes: '허용된 콘텐츠 유형',
    
    totalArticles: '총 게시물 수',
    publishedArticles: '게시됨',
    draftArticles: '초안',
    subcategories: '하위 카테고리',
    
    viewArticles: '게시물 보기',
    addSubcategory: '하위 카테고리 추가',
    moveCategory: '이동',
    mergeCategories: '카테고리 병합',
  },

  // Media Library
  media: {
    title: '미디어 라이브러리',
    uploadFiles: '파일 업로드',
    dragDrop: '파일을 여기에 드래그 앤 드롭하거나',
    clickToUpload: '클릭하여 선택',
    supportedFormats: '지원: 이미지, 비디오, 문서',
    maxSize: '최대 100MB/파일',
    
    allFiles: '모든 파일',
    images: '이미지',
    videos: '비디오',
    documents: '문서',
    audio: '오디오',
    
    gridView: '그리드',
    listView: '목록',
    
    fileName: '파일 이름',
    fileSize: '크기',
    fileType: '유형',
    uploadedBy: '업로드한 사람',
    uploadDate: '업로드 날짜',
    usedIn: '사용처',
    
    selectFile: '파일 선택',
    copyUrl: 'URL 복사',
    urlCopied: 'URL 복사됨',
    downloadFile: '다운로드',
    deleteFile: '삭제',
    editMetadata: '메타데이터 편집',
    replaceFile: '파일 교체',
    
    totalFiles: '총 파일 수',
    totalSize: '총 크기',
    filesSelected: '파일 선택됨',
  },

  // Dashboard
  dashboard: {
    welcome: '환영합니다',
    overview: 'CMS 시스템 개요입니다',
    systemHealthy: '시스템이 정상적으로 작동 중입니다',
    
    totalArticles: '총 게시물',
    publishedToday: '오늘 게시됨',
    pendingReview: '검토 대기',
    totalViews: '총 조회수',
    totalComments: '댓글',
    totalLikes: '좋아요',
    
    viewsChart: '조회수 추이',
    articlesByType: '유형별 게시물',
    articlesByStatus: '상태별 게시물',
    topAuthors: '인기 작성자',
    
    recentActivity: '최근 활동',
    recentArticles: '최신 게시물',
    popularArticles: '인기 게시물',
    
    quickActions: '빠른 작업',
    createArticle: '게시물 만들기',
    createCategory: '카테고리 만들기',
    uploadMedia: '미디어 업로드',
    reviewContent: '콘텐츠 검토',
  },

  // Moderation
  moderation: {
    title: '콘텐츠 검토',
    pendingItems: '대기 중인 항목',
    reviewQueue: '검토 대기열',
    
    approve: '승인',
    reject: '거부',
    requestChanges: '변경 요청',
    
    filterByType: '유형별 필터',
    filterByAuthor: '작성자별 필터',
    filterByDate: '날짜별 필터',
    
    totalPending: '총 대기 중',
    approvedToday: '오늘 승인됨',
    rejectedToday: '오늘 거부됨',
  },

  // Users
  users: {
    title: '사용자 관리',
    createNew: '사용자 추가',
    editUser: '사용자 편집',
    
    username: '사용자 이름',
    email: '이메일',
    fullName: '전체 이름',
    role: '역할',
    status: '상태',
    lastLogin: '마지막 로그인',
    
    admin: '관리자',
    editor: '편집자',
    author: '작성자',
    contributor: '기여자',
    viewer: '뷰어',
    
    active: '활성',
    inactive: '비활성',
    suspended: '정지됨',
  },

  // Settings
  settings: {
    title: '설정',
    general: '일반',
    appearance: '외관',
    language: '언어',
    notifications: '알림',
    security: '보안',
    
    siteName: '사이트 이름',
    siteDescription: '사이트 설명',
    timezone: '시간대',
    dateFormat: '날짜 형식',
    
    theme: '테마',
    lightMode: '라이트',
    darkMode: '다크',
    autoMode: '자동',
  },

  // Crawler
  crawler: {
    title: '크롤러 관리',
    campaigns: '캠페인',
    sources: '소스',
    articles: '크롤된 게시물',
    approved: '승인된 게시물',
    
    // Submenu labels
    submenu: {
      campaigns: '캠페인',
      sources: '소스',
      crawled: '크롤된 게시물',
      approved: '승인된 게시물',
    },
    
    createCampaign: '캠페인 만들기',
    editCampaign: '캠페인 편집',
    campaignName: '캠페인 이름',
    campaignDescription: '설명',
    campaignStatus: '상태',
    
    createSource: '소스 추가',
    editSource: '소스 편집',
    sourceName: '소스 이름',
    sourceUrl: '소스 URL',
    sourceType: '소스 유형',
    crawlFrequency: '크롤 빈도',
    lastCrawled: '마지막 크롤',
    
    startCrawl: '크롤 시작',
    stopCrawl: '크롤 중지',
    testSource: '소스 테스트',
    viewResults: '결과 보기',
    
    totalSources: '총 소스',
    activeSources: '활성',
    totalCrawled: '크롤됨',
    pendingApproval: '승인 대기',
  },

  // AI Tools
  aiTools: {
    title: 'AI 도구',
    autoTranslate: '자동 번역',
    grammarCheck: '문법 검사',
    seoOptimize: 'SEO 최적화',
    contentSuggest: '콘텐츠 제안',
    generateSummary: '요약 생성',
    generateTitle: '제목 생성',
    generateTags: '태그 생성',
    imageAlt: '대체 텍스트 생성',
    
    processing: '처리 중...',
    completed: '완됨',
    failed: '실패',
  },

  // Workflow
  workflow: {
    title: '워크플로우 관리',
    createWorkflow: '워크플로우 만들기',
    editWorkflow: '워크플로우 편집',
    workflowName: '워크플로우 이름',
    workflowSteps: '단계',
    
    step: '단계',
    addStep: '단계 추가',
    removeStep: '단계 제거',
    stepName: '단계 이름',
    assignTo: '할당',
    
    approve: '승인',
    reject: '거부',
    requestRevision: '수정 요청',
    moveToNext: '다음으로 이동',
  },

  // Event Stream
  eventStream: {
    title: '이벤트 스트림',
    createStream: '스트림 만들기',
    editStream: '스트림 편집',
    streamName: '스트림 이름',
    streamDescription: '설명',
    events: '이벤트',
    
    createEvent: '이벤트 만들기',
    editEvent: '이벤트 편집',
    eventTitle: '이벤트 제목',
    eventDate: '이벤트 날짜',
    eventTime: '시간',
    eventLocation: '위치',
    eventDescription: '설명',
    
    totalStreams: '총 스트림',
    upcomingEvents: '다가오는 이벤트',
    pastEvents: '지난 이벤트',
  },

  // Activity Log
  activity: {
    title: '활동 로그',
    timeline: '타임라인',
    filterByUser: '사용자별 필터',
    filterByAction: '작업별 필터',
    filterByDate: '날짜별 필터',
    
    created: '생성했습니다',
    updated: '업데이트했습니다',
    deleted: '삭제했습니다',
    published: '게시했습니다',
    approved: '승인했습니다',
    rejected: '거부했습니다',
    
    justNow: '방금',
    minutesAgo: '분 전',
    hoursAgo: '시간 전',
    daysAgo: '일 전',
    weeksAgo: '주 전',
    monthsAgo: '개월 전',
  },

  // Analytics
  analytics: {
    title: '분석 및 통계',
    overview: '개요',
    detailed: '상세',
    
    pageviews: '페이지뷰',
    uniqueVisitors: '순 방문자',
    bounceRate: '이탈률',
    avgTimeOnPage: '평균 체류 시간',
    topPages: '인기 페이지',
    topReferrers: '인기 리퍼러',
    
    today: '오늘',
    yesterday: '어제',
    last7Days: '지난 7일',
    last30Days: '지난 30일',
    thisMonth: '이번 달',
    lastMonth: '지난 달',
    custom: '사용자 정의',
  },

  // Permissions
  permissions: {
    title: '권한 그룹',
    createGroup: '그룹 만들기',
    editGroup: '그룹 편집',
    groupName: '그룹 이름',
    groupDescription: '설명',
    members: '구성원',
    searchPlaceholder: '권한 그룹 검색...',
    
    canCreate: '생성',
    canRead: '읽기',
    canUpdate: '업데이트',
    canDelete: '삭제',
    canPublish: '게시',
    canApprove: '승인',
    
    articles: '게시물',
    categories: '카테고리',
    media: '미디어',
    users: '사용자',
    settings: '설정',
  },

  // Placeholders (for inputs, textareas)
  placeholders: {
    // Search
    searchCommand: '명령 검색...',
    searchMedia: '미디어 라이브러리에서 검색...',
    searchCrawler: '크롤러 소스 검색...',
    searchHistory: '기록 검색...',
    searchArticles: '게시물 검색...',
    searchEventStream: '이벤트 스트림 검색...',
    
    // Dates
    dateFrom: '시작 날짜',
    dateTo: '종료 날짜',
    
    // File sizes
    sizeMin: '최소',
    sizeMax: '최대',
    
    // Media
    uploaderName: '업로더 이름...',
    fileDescription: '파일 설명 입력...',
    addNewTag: '새 태그 추가...',
    
    // Crawler
    webhookUrl: 'https://hooks.slack.com/...',
    crawlerName: '예: VnExpress Technology',
    rssUrl: 'https://example.com/rss',
    
    // Content
    startWriting: '내용 작성 시작...',
    shortDescription: '게시물 간단한 설명...',
    readingTime: '5',
    videoUrl: 'https://youtube.com/watch?v=...',
    timestamp: '15:30',
    timestamps: '00:00 - 소개...',
    galleryDescription: '이 이미지 갤러리의 설명...',
    documentNumber: '15/2024/NĐ-CP',
    issuingAuthority: '정부',
    jobPosition: '시니어 프론트엔드 개발자',
    years: '2',
    eventName: '예: Tech Summit 2025',
    eventDescription: '이 이벤트 시리즈의 설명...',
  },

  // Tooltips (for title attributes)
  tooltips: {
    delete: '삭제',
    edit: '편집',
    editItem: '편집',
    view: '보기',
    add: '추가',
    changePassword: '비밀번호 변경',
    more: '더보기',
  },
};