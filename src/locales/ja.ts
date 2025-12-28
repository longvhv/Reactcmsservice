export default {
  // Common
  common: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    create: '作成',
    search: '検索',
    filter: 'フィルター',
    export: 'エクスポート',
    import: 'インポート',
    upload: 'アップロード',
    download: 'ダウンロード',
    view: '表示',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    confirm: '確認',
    yes: 'はい',
    no: 'いいえ',
    all: 'すべて',
    select: '選択',
    selected: '選択済み',
    actions: '操作',
    loading: '読み込み中...',
    saving: '保存中...',
    publishing: '公開中...',
    draft: '下書き保存',
    publish: '公開',
    preview: 'プレビュー',
    settings: '設定',
    language: '言語',
  },

  // Confirmations
  confirmations: {
    deleteArticle: 'この記事を削除してもよろしいですか？',
    deleteCategory: 'このカテゴリを削除してもよろしいですか？',
    deleteCategoryWithArticles: 'このカテゴリを削除してもよろしいですか？このカテゴリ内のすべての記事は「未分類」に移動されます。',
    deletePermissionGroup: '権限グループ"{{name}}"を削除してもよろしいですか？',
    deletePermissionGroupWithMembers: '権限グループ"{{name}}"を削除してもよろしいですか？すべてのメンバーはこのアクセス権を失います。',
    removeMember: 'このメンバーをグループから削除してもよろしいですか？',
  },

  // Search
  search: {
    placeholder: 'クイック検索...',
    recentSearches: '最近の検索',
    quickActions: 'クイックアクション',
    commandPalette: 'コマンドを検索...',
  },

  // Header
  header: {
    createNew: '新規作成',
    profile: 'マイプロフィール',
    settings: '設定',
    logout: 'ログアウト',
    adminUser: '管理者ユーザー',
    adminEmail: 'admin@cms.com',
    premiumPlan: 'プレミアムプラン',
    pro: 'PRO',
    expiresIn: '30日後に期限切れ',
    i18nTestSuite: '🧪 i18n テストスイート',
    
    // Notifications
    newComments: '{{count}}件の新しいコメントの確認が必要です',
    pendingApproval: '{{count}}件の記事が承認待ちです',
    crawlerCollected: 'クローラーが{{count}}件の新しい記事を収集しました',
    backupComplete: 'バックアップが正常に完了しました',
    minutesAgo: '{{count}}分前',
    hoursAgo: '{{count}}時間前',
    
    // Quick actions
    createArticle: '新しい記事を作成',
    uploadMedia: 'メディアをアップロード',
    viewStats: '統計を表示',
    manageCategories: 'カテゴリを管理',
    
    // Recent searches
    recentSearch1: {
      query: 'AIに関する記事',
      type: '記事',
    },
    recentSearch2: {
      query: 'Reactチュートリアル動画',
      type: 'メディア',
    },
    recentSearch3: {
      query: '2024画像ギャラリー',
      type: 'ギャラリー',
    },
  },

  // Menu Navigation
  menu: {
    dashboard: 'ダッシュボード',
    articles: '記事',
    categories: 'カテゴリ',
    media: 'メディアライブラリ',
    comments: 'コメント',
    users: 'ユーザー',
    moderation: 'モデレーション',
    moderationAll: 'コンテンツモデレーション',
    analytics: '分析・統計',
    crawler: 'クローラー',
    settings: '設定',
    eventSeries: 'イベントストリーム',
    permissions: '権限グループ',
    aiTools: 'AIツール',
    activity: 'アクティビティログ',
  },

  // Article Types
  articleTypes: {
    news: 'ニュース',
    video: 'ビデオ',
    gallery: 'ギャラリー',
    legal: '法的文書',
    legalShort: '法的',
    staff: 'スタッフ',
    job: '求人',
    podcast: 'ポッドキャスト',
    event: 'イベント',
    download: 'ダウンロード',
  },

  // Article Status
  status: {
    published: '公開済み',
    draft: '下書き',
    review: 'レビュー中',
    scheduled: '予約済み',
    archived: 'アーカイブ済み',
    rejected: '却下',
    pending: '保留中',
  },

  // Article Management
  articles: {
    title: '記事管理',
    createNew: '新規記事作成',
    editArticle: '記事編集',
    deleteArticle: '記事削除',
    bulkActions: '一括操作',
    selectAll: 'すべて選択',
    deselectAll: 'すべて解除',
    selectedItems: '記事',
    noArticles: '記事が見つかりません',
    searchPlaceholder: '記事を検索...',
    
    columns: {
      id: 'ID',
      thumbnail: '画像',
      title: 'タイトル',
      type: 'タイプ',
      status: 'ステータス',
      category: 'カテゴリー',
      author: '著者',
      views: '閲覧数',
      comments: 'コメント',
      publishDate: '公開日',
      updatedDate: '更新日',
      featured: '注目',
      actions: '操作',
    },

    viewDetail: '詳細を表示',
    markFeatured: '注目記事にする',
    unmarkFeatured: '注目記事を解除',
    moveTo: '移動',
    duplicate: '複製',
    archive: 'アーカイブ',
    restore: '復元',
    
    filterByType: 'タイプでフィルター',
    filterByStatus: 'ステータスでフィルター',
    filterByCategory: 'カテゴリーでフィルター',
    filterByAuthor: '著者でフィルター',
    
    viewTable: 'テーブル',
    viewList: 'リスト',
    viewGrid: 'グリッド',
    
    columnsDisplay: '表示列',
    resetColumns: 'リセット',
    columnsCount: '列',
  },

  // Article Editor
  editor: {
    title: '記事タイトル',
    titlePlaceholder: '記事タイトルを入力...',
    content: 'コンテンツ',
    contentPlaceholder: 'コンテンツの作成を開始...',
    excerpt: '抜粋',
    excerptPlaceholder: '記事の簡単な説明...',
    
    editMode: '編集',
    previewMode: 'プレビュー',
    
    selectType: '記事タイプ',
    selectTypeRequired: '記事タイプ *',
    
    thumbnail: 'サムネイル',
    thumbnailRequired: 'サムネイル *',
    uploadImage: 'クリックして画像をアップロード',
    uploadImageHelp: 'PNG、JPG、またはWebP（最大5MB）',
    dragDropImages: 'ドラッグ＆ドロップまたはクリックして画像を追加',
    dragDropImagesHelp: '複数の画像をサポート。PNG、JPG、WebP（画像あたり最大10MB）',
    
    categories: 'カテゴリー',
    categoriesRequired: 'カテゴリー *',
    selectCategories: 'カテゴリーを選択',
    searchCategories: 'カテゴリーを検索...',
    tags: 'タグ',
    addTag: 'タグを追加...',
    
    author: '著者',
    authorRequired: '著者 *',
    selectAuthor: '著者を選択',
    addNewAuthor: '新しい著者を追加',
    authorName: '著者名',
    authorNamePlaceholder: '著者名を入力...',
    
    aiTools: 'AIツール',
    translateAuto: '自動翻訳',
    checkGrammar: '文法チェック',
    optimizeSEO: 'SEO最適化',
    suggestContent: 'コンテンツ提案',
    
    saveAndContinue: '保存して続ける',
    saveDraft: '下書き保存',
    lastSaved: '最終保存',
    
    videoUrl: 'ビデオURL',
    videoUrlPlaceholder: 'https://youtube.com/watch?v=...',
    duration: '長さ',
    durationPlaceholder: '00:00',
    
    noImages: 'ギャラリーにまだ画像がありません',
    imageCaption: '画像のキャプション',
    
    position: 'ポジション',
    salary: '給与',
    location: '場所',
    deadline: '応募締切',
    requirements: '要件',
    benefits: '福利厚生',
    
    eventDate: 'イベント日',
    eventTime: 'イベント時間',
    venue: '会場',
    maxParticipants: '最大参加者数',
    registrationCount: '登録済み',
    
    episode: 'エピソード',
    audioUrl: 'オーディオURL',
    albumArt: 'アルバムアート',
    
    documentNumber: '文書番号',
    documentType: '文書タイプ',
    issueDate: '発行日',
    effectiveDate: '発効日',
    issuingAuthority: '発行機関',
    
    department: '部門',
    joinDate: '入社日',
    bio: '略歴',
    
    fileType: 'ファイルタイプ',
    fileSize: 'ファイルサイズ',
    downloadUrl: 'ダウンロードURL',
    
    readingTime: '読書時間（分）',
    readingTimeUnit: '分読み',
    
    characters: '文字',
    words: '単語',
  },

  // Categories
  categories: {
    title: 'カテゴリー管理',
    createNew: '新規カテゴリー作成',
    editCategory: 'カテゴリー編集',
    deleteCategory: 'カテゴリー削除',
    noCategories: 'カテゴリーが見つかりません',
    
    name: 'カテゴリー名',
    nameRequired: 'カテゴリー名 *',
    namePlaceholder: 'カテゴリー名を入力...',
    slug: 'スラッグ',
    slugPlaceholder: 'url-friendly-slug',
    description: '説明',
    descriptionPlaceholder: 'カテゴリーの説明...',
    parentCategory: '親カテゴリー',
    selectParent: '親カテゴリーを選択（オプション）',
    noParent: 'なし（ルートカテゴリー）',
    icon: 'アイコン',
    color: '色',
    image: '画像',
    allowedContentTypes: '許可されたコンテンツタイプ',
    
    totalArticles: '記事総数',
    publishedArticles: '公開済み',
    draftArticles: '下書き',
    subcategories: 'サブカテゴリー',
    
    viewArticles: '���事を表示',
    addSubcategory: 'サブカテゴリーを追加',
    moveCategory: '移動',
    mergeCategories: 'カテゴリーを統合',
  },

  // Media Library
  media: {
    title: 'メディアライブラリ',
    uploadFiles: 'ファイルをアップロード',
    dragDrop: 'ファイルをここにドラッグ＆ドロップ、または',
    clickToUpload: 'クリックして選択',
    supportedFormats: 'サポート：画像、ビデオ、ドキュメント',
    maxSize: '最大100MB/ファイル',
    
    allFiles: 'すべてのファイル',
    images: '画像',
    videos: 'ビデオ',
    documents: 'ドキュメント',
    audio: 'オーディオ',
    
    gridView: 'グリッド',
    listView: 'リスト',
    
    fileName: 'ファイル名',
    fileSize: 'サイズ',
    fileType: 'タイプ',
    uploadedBy: 'アップロード者',
    uploadDate: 'アップロード日',
    usedIn: '使用先',
    
    selectFile: 'ファイルを選択',
    copyUrl: 'URLをコピー',
    urlCopied: 'URLをコピーしました',
    downloadFile: 'ダウンロード',
    deleteFile: '削除',
    editMetadata: 'メタデータを編集',
    replaceFile: 'ファイルを置換',
    
    totalFiles: 'ファイル総数',
    totalSize: '合計サイズ',
    filesSelected: 'ファイル選択済み',
  },

  // Dashboard
  dashboard: {
    welcome: 'おかえりなさい',
    overview: 'CMSシステムの概要です',
    systemHealthy: 'システムは正常に動作しています',
    
    totalArticles: '記事総数',
    publishedToday: '本日公開',
    pendingReview: 'レビュー待ち',
    totalViews: '総閲覧数',
    totalComments: 'コメント',
    totalLikes: 'いいね',
    
    viewsChart: '閲覧数の推移',
    articlesByType: 'タイプ別記事',
    articlesByStatus: 'ステータス別記事',
    topAuthors: 'トップ著者',
    
    recentActivity: '最近のアクティビティ',
    recentArticles: '最新記事',
    popularArticles: '人気記事',
    
    quickActions: 'クイックアクション',
    createArticle: '記事作成',
    createCategory: 'カテゴリー作成',
    uploadMedia: 'メディアアップロード',
    reviewContent: 'コンテンツレビュー',
  },

  // Moderation
  moderation: {
    title: 'コンテンツモデレーション',
    pendingItems: '保留中のアイテム',
    reviewQueue: 'レビューキュー',
    
    approve: '承認',
    reject: '却下',
    requestChanges: '変更をリクエスト',
    
    filterByType: 'タイプでフィルター',
    filterByAuthor: '著者でフィルター',
    filterByDate: '日付でフィルター',
    
    totalPending: '保留総数',
    approvedToday: '本日承認',
    rejectedToday: '本日却下',
  },

  // Users
  users: {
    title: 'ユーザー管理',
    createNew: 'ユーザー追加',
    editUser: 'ユーザー編集',
    
    username: 'ユーザー名',
    email: 'メール',
    fullName: 'フルネーム',
    role: '役割',
    status: 'ステータス',
    lastLogin: '最終ログイン',
    
    admin: '管理者',
    editor: '編集者',
    author: '著者',
    contributor: '寄稿者',
    viewer: '閲覧者',
    
    active: 'アクティブ',
    inactive: '非アクティブ',
    suspended: '停止中',
  },

  // Settings
  settings: {
    title: '設定',
    general: '一般',
    appearance: '外観',
    language: '言語',
    notifications: '通知',
    security: 'セキュリティ',
    
    siteName: 'サイト名',
    siteDescription: 'サイト説明',
    timezone: 'タイムゾーン',
    dateFormat: '日付形式',
    
    theme: 'テーマ',
    lightMode: 'ライト',
    darkMode: 'ダーク',
    autoMode: '自動',
  },

  // Crawler
  crawler: {
    title: 'クローラー管理',
    campaigns: 'キャンペーン',
    sources: 'ソース',
    articles: 'クロール済み記事',
    approved: '承認済み記事',
    
    // Submenu labels
    submenu: {
      campaigns: 'キャンペーン',
      sources: 'ソース',
      crawled: 'クロール済み記事',
      approved: '承認済み記事',
    },
    
    createCampaign: 'キャンペーン作成',
    editCampaign: 'キャンペーン編集',
    campaignName: 'キャンペーン名',
    campaignDescription: '説明',
    campaignStatus: 'ステータス',
    
    createSource: 'ソース追加',
    editSource: 'ソース編集',
    sourceName: 'ソース名',
    sourceUrl: 'ソースURL',
    sourceType: 'ソースタイプ',
    crawlFrequency: 'クロール頻度',
    lastCrawled: '最終クロール',
    
    startCrawl: 'クロール開始',
    stopCrawl: 'クロール停止',
    testSource: 'ソーステスト',
    viewResults: '結果を表示',
    
    totalSources: 'ソース総数',
    activeSources: 'アクティブ',
    totalCrawled: 'クロール済み',
    pendingApproval: '承認待ち',
  },

  // AI Tools
  aiTools: {
    title: 'AIツール',
    autoTranslate: '自動翻訳',
    grammarCheck: '文法チェック',
    seoOptimize: 'SEO最適化',
    contentSuggest: 'コンテンツ提案',
    generateSummary: '要約生成',
    generateTitle: 'タイトル生成',
    generateTags: 'タグ生成',
    imageAlt: '代替テキスト生成',
    
    processing: '処理中...',
    completed: '完了',
    failed: '失敗',
  },

  // Workflow
  workflow: {
    title: 'ワークフロー管理',
    createWorkflow: 'ワークフロー作成',
    editWorkflow: 'ワークフロー編集',
    workflowName: 'ワークフロー名',
    workflowSteps: 'ステップ',
    
    step: 'ステップ',
    addStep: 'ステップ追加',
    removeStep: 'ステップ削除',
    stepName: 'ステップ名',
    assignTo: '割り当て先',
    
    approve: '承認',
    reject: '却下',
    requestRevision: '修正をリクエスト',
    moveToNext: '次へ移動',
  },

  // Event Stream
  eventStream: {
    title: 'イベントストリーム',
    createStream: 'ストリーム作成',
    editStream: 'ストリーム編集',
    streamName: 'ストリーム名',
    streamDescription: '説明',
    events: 'イベント',
    
    createEvent: 'イベント作成',
    editEvent: 'イベント編集',
    eventTitle: 'イベントタイトル',
    eventDate: 'イベント日',
    eventTime: '時間',
    eventLocation: '場所',
    eventDescription: '説明',
    
    totalStreams: 'ストリーム総数',
    upcomingEvents: '今後のイベント',
    pastEvents: '過去のイベント',
  },

  // Activity Log
  activity: {
    title: 'アクティビティログ',
    timeline: 'タイムライン',
    filterByUser: 'ユーザーでフィルター',
    filterByAction: 'アクションでフィルター',
    filterByDate: '日付でフィルター',
    
    created: '作成しました',
    updated: '更新しました',
    deleted: '削除しました',
    published: '公開しました',
    approved: '承認しました',
    rejected: '却下しました',
    
    justNow: 'たった今',
    minutesAgo: '分前',
    hoursAgo: '時間前',
    daysAgo: '日前',
    weeksAgo: '週間前',
    monthsAgo: 'ヶ月前',
  },

  // Analytics
  analytics: {
    title: '分析と統計',
    overview: '概要',
    detailed: '詳細',
    
    pageviews: 'ページビュー',
    uniqueVisitors: 'ユニーク訪問者',
    bounceRate: '直帰率',
    avgTimeOnPage: '��均滞在時間',
    topPages: 'トップページ',
    topReferrers: 'トップ参照元',
    
    today: '今日',
    yesterday: '昨日',
    last7Days: '過去7日間',
    last30Days: '過去30日間',
    thisMonth: '今月',
    lastMonth: '先月',
    custom: 'カスタム',
  },

  // Permissions
  permissions: {
    title: '権限グループ',
    createGroup: 'グループ作成',
    editGroup: 'グループ編集',
    groupName: 'グループ名',
    groupDescription: '説明',
    members: 'メンバー',
    searchPlaceholder: '権限グループを検索...',
    
    canCreate: '作成',
    canRead: '読み取り',
    canUpdate: '更新',
    canDelete: '削除',
    canPublish: '公開',
    canApprove: '承認',
    
    articles: '記事',
    categories: 'カテゴリー',
    media: 'メディア',
    users: 'ユーザー',
    settings: '設定',
  },

  // Placeholders (for inputs, textareas)
  placeholders: {
    // Search
    searchCommand: 'コマンドを検索...',
    searchMedia: 'メディアライブラリで検索...',
    searchCrawler: 'クローラーソースを検索...',
    searchHistory: '履歴を検索...',
    searchArticles: '記事を検索...',
    searchEventStream: 'イベントストリームを検索...',
    
    // Dates
    dateFrom: '開始日',
    dateTo: '終了日',
    
    // File sizes
    sizeMin: '最小',
    sizeMax: '最大',
    
    // Media
    uploaderName: 'アップロード者名...',
    fileDescription: 'ファイルの説明を入力...',
    addNewTag: '新しいタグを追加...',
    
    // Crawler
    webhookUrl: 'https://hooks.slack.com/...',
    crawlerName: '例: VnExpress Technology',
    rssUrl: 'https://example.com/rss',
    
    // Content
    startWriting: 'コンテンツを書き始める...',
    shortDescription: '記事の簡単な説明...',
    readingTime: '5',
    videoUrl: 'https://youtube.com/watch?v=...',
    timestamp: '15:30',
    timestamps: '00:00 - イントロダクション...',
    galleryDescription: 'この画像ギャラリーの説明...',
    documentNumber: '15/2024/NĐ-CP',
    issuingAuthority: '政府',
    jobPosition: 'シニアフロントエンド開発者',
    years: '2',
    eventName: '例: Tech Summit 2025',
    eventDescription: 'このイベントシリーズの説明...',
  },

  // Tooltips (for title attributes)
  tooltips: {
    delete: '削除',
    edit: '編集',
    editItem: '編集',
    view: '表示',
    add: '追加',
    changePassword: 'パスワードを変更',
    more: 'もっと',
  },
};