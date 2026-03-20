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
    deletePermissionGroupWithMembers: 'Bạn có chắc chắn muốn xóa nhóm quyền "{{name}}"? Tất cả thành viên sẽ mất quyn truy cập này.',
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
    infographicBuilder: 'Trình tạo Infographic',
    royalty: 'Nhuận Bút',
  },

  // Brand
  brand: {
    cmsPlatform: 'Nền tảng CMS',
    vhvPlatform: 'VHV Platform',
  },

  // User Management Submenu
  users: {
    submenu: {
      list: 'Danh sách người dùng',
      roles: 'Vai trò & Quyền hạn',
      groups: 'Nhóm người dùng',
      accessLogs: 'Nhật ký truy cập',
      security: 'Bảo mật',
    },
    
    // User Management Page
    management: {
      title: 'Quản lý người dùng',
      description: 'Quản lý tài khoản và phân quyền',
      addUser: 'Thêm người dùng',
      exportList: 'Xuất danh sách',
      
      // Roles stats
      rolesPermissions: 'Vai trò & Quyền hạn',
      
      // Table headers
      user: 'Người dùng',
      role: 'Vai trò',
      status: 'Trạng thái',
      articles: 'Bài viết',
      joined: 'Tham gia',
      lastActivity: 'Hoạt động cuối',
      actions: 'Thao tác',
      
      // Filters
      allRoles: 'Tất cả vai trò',
      filter: 'Lọc',
      
      // Status
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      suspended: 'Tạm khóa',
      
      // Add User Modal
      addUserTitle: 'Thêm người dùng mới',
      fullName: 'Họ và tên',
      fullNameRequired: 'Họ và tên *',
      email: 'Email',
      emailRequired: 'Email *',
      phone: 'Số điện thoại',
      roleRequired: 'Vai trò *',
      password: 'Mật khẩu',
      passwordRequired: 'Mật khẩu *',
      confirmPassword: 'Xác nhận mật khẩu',
      confirmPasswordRequired: 'Xác nhận mật khẩu *',
      sendEmailNotification: 'Gửi email thông báo tài khoản cho người dùng',
      createAccount: 'Tạo tài khoản',
      saveAndAddAnother: 'Lưu và thêm người dùng khác',
      cancel: 'Hủy',
      
      // Role badges
      admin: 'Admin',
      editor: 'Editor',
      author: 'Author',
      contributor: 'Contributor',
      
      // Role permissions
      fullSystemAccess: 'Toàn quyền hệ thống',
      approveArticles: 'Duyệt bài',
      editAllArticles: 'Chỉnh sửa tất cả',
      createEditOwn: 'Tạo & sửa bài của mình',
      createDrafts: 'Tạo bài nháp',
    },
    
    // User Roles Page
    roles: {
      title: 'Vai trò & Quyền hạn',
      description: 'Quản lý vai trò và phân quyền cho người dùng',
      createRole: 'Tạo vai trò mới',
      editRole: 'Chỉnh sửa vai trò',
      hidePermissions: 'Ẩn quyền',
      showAllPermissions: 'Xem tất cả quyền',
      
      // Stats
      totalRoles: 'Tổng vai trò',
      totalUsers: 'Tổng người dùng',
      totalPermissions: 'Tổng quyền hạn',
      customRoles: 'Vai trò tùy chỉnh',
      
      // Permissions Panel
      allSystemPermissions: 'Tất cả quyền hạn trong hệ thống',
      
      // Permission categories
      articlesCategory: 'Bài viết',
      categoriesCategory: 'Danh mục',
      mediaCategory: 'Media',
      usersCategory: 'Người dùng',
      settingsCategory: 'Cài đặt',
      advancedCategory: 'Nâng cao',
      
      // Article permissions
      viewArticles: 'Xem bài viết',
      viewArticlesDesc: 'Xem tất cả bài viết',
      createArticles: 'Tạo bài viết',
      createArticlesDesc: 'Tạo bài vit mới',
      editOwnArticles: 'Sửa bài của mình',
      editOwnArticlesDesc: 'Chỉnh sửa bài viết của bản thân',
      editAllArticles: 'Sửa tất cả bài',
      editAllArticlesDesc: 'Chỉnh sửa tất cả bài viết',
      deleteOwnArticles: 'Xóa bài của mình',
      deleteOwnArticlesDesc: 'Xóa bài viết của bản thân',
      deleteAllArticles: 'Xóa tất cả bài',
      deleteAllArticlesDesc: 'Xóa tất cả bài viết',
      publishArticles: 'Xuất bản bài viết',
      publishArticlesDesc: 'Xuất bản bài viết lên website',
      approveArticles: 'Duyệt bài viết',
      approveArticlesDesc: 'Phê duyệt bài viết từ người khác',
      
      // Category permissions
      viewCategories: 'Xem danh mục',
      viewCategoriesDesc: 'Xem tất cả danh mục',
      createCategories: 'Tạo danh mục',
      createCategoriesDesc: 'Tạo danh mục mới',
      editCategories: 'Sửa danh mục',
      editCategoriesDesc: 'Chỉnh sửa danh mục',
      deleteCategories: 'Xóa danh mục',
      deleteCategoriesDesc: 'Xóa danh mục',
      
      // Media permissions
      viewMedia: 'Xem media',
      viewMediaDesc: 'Xem thư viện media',
      uploadMedia: 'Upload media',
      uploadMediaDesc: 'Tải file lên thư viện',
      editMedia: 'Sửa media',
      editMediaDesc: 'Chỉnh sửa metadata của media',
      deleteMedia: 'Xóa media',
      deleteMediaDesc: 'Xóa file khỏi thư viện',
      
      // User permissions
      viewUsers: 'Xem người dùng',
      viewUsersDesc: 'Xem danh sách người dùng',
      createUsers: 'Tạo người dùng',
      createUsersDesc: 'Tạo tài khoản mới',
      editUsers: 'Sửa người dùng',
      editUsersDesc: 'Chỉnh sửa thông tin người dùng',
      deleteUsers: 'Xóa người dùng',
      deleteUsersDesc: 'Xóa tài khoản người dùng',
      managePermissions: 'Quản lý quyền',
      managePermissionsDesc: 'Phân quyền cho người dùng',
      
      // Settings permissions
      viewSettings: 'Xem cài đặt',
      viewSettingsDesc: 'Xem cài đặt hệ thống',
      editSettings: 'Sửa cài đặt',
      editSettingsDesc: 'Thay đổi cấu hình hệ thống',
      
      // Advanced permissions
      viewLogs: 'Xem logs',
      viewLogsDesc: 'Truy cập nhật ký hệ thống',
      systemBackup: 'Backup hệ thống',
      systemBackupDesc: 'Sao lưu và khôi phục dữ liệu',
      apiAccess: 'Truy cập API',
      apiAccessDesc: 'Sử dụng API keys',
      
      // Role descriptions (system roles)
      superAdminDesc: 'Toàn quyền quản trị h thống, không bị giới hạn',
      adminDesc: 'Quản trị viên với quyền quản lý nội dung và người dùng',
      editorDesc: 'Biên tập viên có quyền duyệt và chỉnh sửa tất cả bài viết',
      authorDesc: 'Tác giả có thể tạo và chỉnh sửa bài viết của mình',
      contributorDesc: 'Cộng tác viên chỉ có thể tạo bài nháp',
      seoSpecialistDesc: 'Chuyên viên SEO có quyền tối ưu nội dung',
      
      // Role form
      roleNameLabel: 'Tên vai trò',
      roleNameRequired: 'Tên vai trò *',
      roleNamePlaceholder: 'VD: Content Manager',
      roleKeyLabel: 'Key (slug)',
      roleKeyRequired: 'Key (slug) *',
      roleKeyPlaceholder: 'VD: content_manager',
      roleDescriptionLabel: 'Mô tả',
      roleDescriptionPlaceholder: 'Mô tả ngắn gọn về vai trò này...',
      selectPermissions: 'Chọn quyền hạn',
      selectAll: 'Chọn tất cả',
      deselectAll: 'Bỏ chọn tất cả',
      permissionsSelected: 'quyền đã chọn',
      
      // Actions
      searchRoles: 'Tìm kiếm vai trò...',
      systemRole: 'Vai trò hệ thống',
      usersCount: 'người dùng',
      save: 'Lưu vai trò',
      saving: 'Đang lưu...',
      
      // Toast messages
      roleCreated: 'Vai trò đã được tạo thành công',
      roleUpdated: 'Vai trò đã được cập nhật',
      roleDeleted: 'Vai trò đã được xóa',
      
      // Modal titles
      createRoleTitle: 'Tạo vai trò mới',
      editRoleTitle: 'Chỉnh sửa vai trò',
      
      // Confirm dialog
      deleteRoleTitle: 'Xóa vai trò',
      deleteRoleMessage: 'Bạn có chắc chắn muốn xóa vai trò "{{name}}"? Hành động này không thể hoàn tác.',
      confirmDelete: 'Xóa vai trò',
      
      // Badge texts
      systemRoleBadge: 'Vai trò hệ thống',
      permissionsLabel: 'quyền',
      mainPermissionsLabel: 'Quyền hạn chính',
      morePermissions: 'khác',
    },
    
    // User Groups Page
    groups: {
      title: 'Nhóm người dùng',
      description: 'Quản lý nhóm và phân công người dùng',
      createGroup: 'Tạo nhóm mới',
      
      // Stats
      totalGroups: 'Tổng nhóm',
      totalMembers: 'Tổng thành viên',
      activeGroups: 'Nhóm hoạt động',
      averageSize: 'Trung bình/nhóm',
      groupsWithLeader: 'Nhóm có trưởng nhóm',
      
      // Group card
      members: 'thành viên',
      leader: 'Trưởng nhóm',
      createdOn: 'Tạo ngày',
      viewMembers: 'Xem thành viên',
      editGroup: 'Sửa nhóm',
      deleteGroup: 'Xóa nhóm',
      
      // Group detail
      groupMembers: 'Thành viên nhóm',
      addMember: 'Thêm thành viên',
      removeMember: 'Xóa',
      
      // Group form
      groupNameLabel: 'Tên nhóm',
      groupNameRequired: 'Tên nhóm *',
      groupNamePlaceholder: 'Ví dụ: Biên tập viên Công nghệ',
      groupDescriptionLabel: 'Mô tả',
      groupDescriptionPlaceholder: 'Mô tả ngắn gọn về nhóm này...',
      groupColor: 'Màu sắc nhóm',
      selectLeader: 'Chọn trưởng nhóm',
      selectLeaderOptional: 'Chọn trưởng nhóm (không bắt buộc)',
      selectMembers: 'Chọn thành viên',
      
      // Actions
      searchGroups: 'Tìm kiếm nhóm...',
      save: 'Lưu nhóm',
      saving: 'Đang lưu...',
      cancel: 'Hủy',
      delete: 'Xóa',
      deleteGroupConfirm: 'Bạn có chắc chắn muốn xóa nhóm "{{name}}"? Hành động này không thể hoàn tác.',
      
      // Sample groups
      techEditorsName: 'Biên tập viên Công nghệ',
      techEditorsDesc: 'Nhóm biên tập viên chuyên về nội dung công nghệ và AI',
      sysAdminsName: 'Quản trị hệ thống',
      sysAdminsDesc: 'Nhóm quản trị viên hệ thống CMS',
      newsAuthorsName: 'Tác giả Tin tức',
      newsAuthorsDesc: 'Nhóm tác giả viết nội dung tin tức thời sự',
      multimediaContributorsName: 'Cộng tác viên Multimedia',
      multimediaContributorsDesc: 'Nhóm cộng tác vin phụ trách nội dung video và podcast',
      reviewersName: 'Người duyệt nội dung',
      reviewersDesc: 'Nhóm phụ trách kiểm duyệt và phê duyệt bài viết',
    },
    
    // Access Logs Page
    accessLogs: {
      title: 'Nhật ký truy cập',
      description: 'Theo dõi hoạt động truy cập của người dùng',
      exportCSV: 'Xuất CSV',
      
      // Stats
      todayLogins: 'Đăng nhập hôm nay',
      failedAttempts: 'Thất bại',
      activeNow: 'Đang hoạt động',
      totalActions: 'Tổng hành động',
      activeUsers: 'Người dùng hoạt động',
      
      // Filters
      allUsers: 'Tất cả người dùng',
      allActions: 'Tất cả hành động',
      today: 'Hôm nay',
      yesterday: 'Hôm qua',
      last7Days: '7 ngày qua',
      last30Days: '30 ngày qua',
      customRange: 'Tùy chỉnh',
      
      // Actions
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      create: 'Tạo mới',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      view: 'Xem',
      failedLogin: 'Đăng nhập thất bại',
      
      // Action labels (for display)
      loginLabel: 'Đăng nhập',
      logoutLabel: 'Đăng xuất',
      createLabel: 'Tạo mới',
      editLabel: 'Chỉnh sửa',
      deleteLabel: 'Xóa',
      viewLabel: 'Xem',
      failedLoginLabel: 'Đăng nhập thất bại',
      
      // Table headers
      user: 'Người dùng',
      action: 'Hành động',
      resource: 'Tài nguyên',
      timestamp: 'Thời gian',
      device: 'Thiết bị',
      location: 'Vị trí',
      status: 'Trạng thái',
      
      // Status
      success: 'Thành công',
      failed: 'Thất bại',
      warning: 'Cảnh báo',
      
      // Actions performed
      loggedIn: 'đã đăng nhập',
      loggedOut: 'đã đăng xuất',
      created: 'đã tạo',
      edited: 'đã chỉnh sửa',
      deleted: 'đã xóa',
      viewed: 'đã xem',
      
      // Export
      exporting: 'Đang xuất...',
      exportSuccess: 'Đã xuất CSV thành công',
      exportError: 'Lỗi khi xuất CSV',
      
      // Search
      searchLogs: 'Tìm kiếm logs...',
    },
    
    // Security Settings Page
    security: {
      title: 'Cài đặt Bảo mật',
      description: 'Quản lý cài đặt bảo mật và quyền riêng tư',
      
      // Stats cards
      twoFactorAuth: 'Xác thực 2 lớp',
      enabled: 'Đã bật',
      disabled: 'Chưa bật',
      activeSessions: 'Phiên hoạt động',
      sessionTimeout: 'Thời gian phiên',
      minutes: 'phút',
      
      // Two-Factor Authentication
      twoFactorTitle: 'Xác thực hai lớp (2FA)',
      authenticatorApp: 'Authenticator App',
      authenticatorDesc: 'Sử dụng ứng dụng như Google Authenticator hoặc Authy để tạo mã xác thực',
      authenticatorConfigured: '✓ Đã cấu hình - Mã xác thực sẽ được yêu cầu khi đăng nhập',
      authenticatorNotConfigured: '⚠ Chưa cấu hình - Tài khoản của bạn có thể kém an toàn hơn',
      enable2FA: 'Bật 2FA',
      disable2FA: 'Tắt 2FA',
      configure: 'Cấu hình',
      
      // Password Policy
      passwordPolicy: 'Chính sách mật khẩu',
      enforcePasswordPolicy: 'Áp dụng chính sách mật khẩu',
      enforcePasswordPolicyDesc: 'Yêu cầu mật khẩu mạnh',
      minPasswordLength: 'Độ dài tối thiểu',
      characters: 'ký tự',
      requireSpecialChars: 'Yêu cầu ký tự đặc biệt',
      requireNumbers: 'Yêu cầu số',
      requireUppercase: 'Yêu cầu chữ hoa',
      passwordExpiry: 'Hết hạn mật khẩu sau',
      passwordExpiryDesc: 'Thời hạn mật khẩu',
      days: 'ngày',
      viewPolicy: 'Xem chính sách',
      updatePolicy: 'Cập nhật chính sách',
      
      // Login Security
      loginSecurity: 'Bảo mật đăng nhập',
      emailVerification: 'Xác minh email',
      emailVerificationDesc: 'Yêu cầu xác minh email khi đăng ký',
      
      // Session Management
      sessionManagement: 'Quản lý phiên làm việc',
      sessionTimeoutLabel: 'Thời gian timeout',
      sessionTimeoutDesc: 'Phiên sẽ tự động đăng xuất sau thời gian không hoạt động',
      blockSuspiciousLogin: 'Chặn đăng nhập khả nghi',
      blockSuspiciousLoginDesc: 'Tự động chặn các lần đăng nhập từ vị trí hoặc thiết bị lạ',
      notifyNewDevice: 'Thông báo thiết bị mới',
      notifyNewDeviceDesc: 'Gửi email khi có đăng nhập từ thiết bị chưa biết',
      
      // IP Whitelist
      ipWhitelist: 'Danh sách IP cho phép',
      ipWhitelistDesc: 'Chỉ cho phép đăng nhập từ các IP này (để trống = cho phép tất cả)',
      ipWhitelistPlaceholder: 'VD: 192.168.1.100, 10.0.0.0/24',
      onePerLine: 'Mỗi IP một dòng hoặc dải CIDR',
      
      // Active Sessions
      activeSessionsTitle: 'Phiên đang hoạt động',
      currentSession: 'Phiên hiện tại',
      device: 'Thiết bị',
      location: 'Vị trí',
      ipAddress: 'IP Address',
      lastActive: 'Hoạt động lần cuối',
      logout: 'Đăng xuất',
      logoutAll: 'Đăng xuất tất cả thiết bị khác',
      
      // Change Password Modal
      changePasswordTitle: 'Đổi mật khẩu',
      currentPassword: 'Mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      confirmNewPassword: 'Xác nhận mật khẩu mới',
      passwordStrength: 'Độ mạnh mật khẩu',
      changePassword: 'Đổi mật khẩu',
      
      // 2FA Setup Modal
      setup2FATitle: 'Cấu hình xác thực 2 lớp',
      setup2FAStep1: 'Bước 1: Quét mã QR',
      setup2FAStep1Desc: 'Sử dụng ứng dụng Authenticator (Google Authenticator, Authy, etc.) để quét mã QR này',
      setup2FAStep2: 'Bước 2: Nhập mã xác thực',
      setup2FAStep2Desc: 'Nhập mã 6 chữ số từ ứng dụng Authenticator để xác nhận',
      verificationCode: 'Mã xác thực',
      verificationCodePlaceholder: '000000',
      enable: 'Bật',
      
      // Password Policy Modal
      passwordPolicyTitle: 'Chính sách mt khẩu',
      currentPolicy: 'Chính sách hiện tại',
      policyMinLength: 'Độ dài tối thiểu',
      policySpecialChars: 'Ký tự đặc biệt',
      policyNumbers: 'Số',
      policyUppercase: 'Chữ hoa',
      policyExpiry: 'Hết hạn sau',
      required: 'Bắt buộc',
      notRequired: 'Không bắt buộc',
      
      // Actions
      save: 'Lưu cài đặt',
      saving: 'Đang lưu...',
      cancel: 'Hủy',
      
      // Toast messages
      settingsSaved: 'Cài đặt đã được lưu',
      passwordChanged: 'Mật khẩu đã được thay đổi',
      twoFactorEnabled: 'Xác thực 2 lớp đã được bật',
      twoFactorDisabled: 'Xác thực 2 lớp đã được tắt',
      sessionLoggedOut: 'Đã đăng xuất phiên',
      allSessionsLoggedOut: 'Đã đăng xuất tất cả phiên',
      
      // Confirm dialogs
      confirmLogout: 'Bạn có chắc chắn muốn đăng xuất thiết bị này?',
      confirmLogoutAll: 'Bạn có chắc chắn muốn đăng xuất tất cả thiết bị khác? Bạn sẽ cần đăng nhập lại trên các thiết bị đó.',
      confirmDisable2FA: 'Bạn có chắc chắn muốn tắt xác thực 2 lớp? Điều này sẽ giảm bảo mật cho tài khoản của bạn.',
    },
  },

  // Article Types
  articleTypes: {
    news: 'Tin tức',
    newsDesc: 'Bài viết tin tức thông thường',
    video: 'Video',
    videoDesc: 'Bài viết kèm video',
    gallery: 'Thư viện ảnh',
    galleryDesc: 'Bộ sưu tập hình ảnh',
    document: 'Văn bản',
    documentDesc: 'Văn bản tài liệu',
    legal: 'Văn bản pháp luật',
    legalDesc: 'Văn bản pháp luật, quy định',
    legalShort: 'Văn bản PL',
    personnel: 'Nhân sự',
    personnelDesc: 'Thông tin nhân sự',
    staff: 'Nhân sự',
    recruitment: 'Tuyển dụng',
    recruitmentDesc: 'Thông tin tuyển dụng',
    job: 'Tuyển dụng',
    podcast: 'Podcast',
    podcastDesc: 'Bài podcast audio',
    event: 'Sự kiện',
    eventDesc: 'Thông tin sự kiện',
    download: 'Tải xuống',
    downloadDesc: 'File tải xuống',
    blog: 'Blog',
    blogDesc: 'Bài viết blog',
    tutorial: 'Hướng dẫn',
    tutorialDesc: 'Bài hướng dẫn',
    pressRelease: 'Thông cáo báo chí',
    pressReleaseDesc: 'Thông cáo báo chí',
    interview: 'Phỏng vấn',
    interviewDesc: 'Bài phỏng vấn',
    infographic: 'Infographic',
    infographicDesc: 'Biểu đồ thông tin trực quan',
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
    welcome: 'Chào mừng tr lại',
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
    approvedToday: 'Đã duyệt hôm nay',
    rejectedToday: 'Từ chối hôm nay',
  },

  // Settings
  settings: {
    title: 'Cài đặt',
    
    // Tabs
    general: 'Cài đặt chung',
    features: 'Tính năng',
    appearance: 'Giao diện',
    notifications: 'Thông báo',
    security: 'Bảo mật',
    email: 'Email',
    api_webhooks: 'API & Webhooks',
    database: 'Cơ sở dữ liệu',
    
    // Page header
    systemSettings: 'Cài đặt hệ thống',
    systemSettingsDesc: 'Quản lý cấu hình CMS',
    
    // General tab
    generalSettings: 'Cài đặt chung',
    websiteName: 'Tên website',
    websiteDescription: 'Mô tả',
    websiteDescriptionPlaceholder: 'Hệ thống quản lý nội dung chuyên nghiệp',
    defaultLanguage: 'Ngôn ngữ mặc định',
    timezone: 'Múi giờ',
    
    // Features tab
    featureManagement: 'Quản lý tính năng',
    featureManagementDesc: 'Bật/tắt các tính năng của hệ thống. Khi tắt, các tính năng liên quan sẽ bị ẩn khỏi giao diện.',
    debugInfo: 'Debug Info',
    resetAllSettings: 'Reset All Settings',
    royaltyEnabled: 'Royalty Enabled',
    mediaEnabled: 'Media Enabled',
    crawlerEnabled: 'Crawler Enabled',
    
    // Feature toggles
    royaltyManagement: 'Quản lý nhuận bút',
    royaltyManagementDesc: 'Tính năng tính toán và quản lý nhuận bút cho tác giả',
    royaltyIncludes: 'Bao gồm:',
    royaltyFeature1: 'Tính toán nhuận bút theo lượt xem',
    royaltyFeature2: 'Báo cáo thu nhập chi tiết',
    royaltyFeature3: 'Quản lý thanh toán',
    enabled: 'Đang bật',
    
    mediaLibrary: 'Thư viện Media',
    mediaLibraryDesc: 'Quản lý file, ảnh, video, và tài liệu',
    mediaIncludes: 'Bao gồm:',
    mediaFeature1: 'Upload và quản lý file',
    mediaFeature2: 'Tối ưu hóa ảnh tự động',
    mediaFeature3: 'Tìm kiếm và lọc nâng cao',
    
    crawlerSystem: 'Hệ thống Crawler',
    crawlerSystemDesc: 'Thu thập nội dung tự động từ các nguồn bên ngoài',
    crawlerIncludes: 'Bao gồm:',
    crawlerFeature1: 'Quản lý nguồn crawler',
    crawlerFeature2: 'Lên lịch thu thập tự động',
    crawlerFeature3: 'Kiểm duyệt nội dung đã crawl',
    
    commentsSystem: 'Hệ thống bình luận',
    commentsSystemDesc: 'Quản lý bình luận từ người đọc',
    
    multiLanguage: 'Đa ngôn ngữ',
    multiLanguageDesc: 'Hỗ trợ quản lý nội dung đa ngôn ngữ',
    
    versionControl: 'Version Control',
    versionControlDesc: 'Lưu lịch sử thay đổi và khôi phục phiên bản',
    
    seoTools: 'SEO Tools',
    seoToolsDesc: 'Công cụ tối ưu hóa công cụ tìm kiếm',
    
    // Appearance tab
    appearanceSettings: 'Cài đặt giao diện',
    themeModes: 'Chế độ giao diện',
    lightMode: 'Sáng',
    darkMode: 'Tối',
    autoMode: 'Tự động',
    primaryColor: 'Màu chủ đạo',
    accentColor: 'Màu nhấn',
    fontFamily: 'Font chữ',
    fontSize: 'Kích thước chữ',
    small: 'Nhỏ',
    medium: 'Trung bình',
    large: 'Lớn',
    
    // Notifications tab
    notificationSettings: 'Cài đặt thông báo',
    emailNotifications: 'Thông báo qua Email',
    pushNotifications: 'Thông báo đẩy',
    newArticle: 'Bài viết mới',
    newComment: 'Bình luận mới',
    articleApproval: 'Phê duyệt bài viết',
    systemUpdates: 'Cập nhật hệ thống',
    
    // Security tab
    securitySettings: 'Cài đặt bảo mật',
    twoFactorAuth: 'Xác thực 2 lớp',
    sessionTimeout: 'Thời gian phiên',
    passwordPolicy: 'Chính sách mật khẩu',
    ipWhitelist: 'IP Whitelist',
    
    // Email tab
    emailSettings: 'Cài đặt Email',
    smtpServer: 'SMTP Server',
    smtpPort: 'SMTP Port',
    smtpUsername: 'SMTP Username',
    smtpPassword: 'SMTP Password',
    fromEmail: 'Email gửi đi',
    fromName: 'Tên người gửi',
    testEmail: 'Gửi email thử nghiệm',
    
    // API tab
    apiSettings: 'Cài đặt API & Webhooks',
    apiKeys: 'API Keys',
    generateNewKey: 'Tạo key mới',
    webhooks: 'Webhooks',
    addWebhook: 'Thêm webhook',
    
    // Database tab
    databaseSettings: 'Cài đặt cơ sở dữ liệu',
    backup: 'Sao lưu',
    restore: 'Khôi phục',
    optimize: 'Tối ưu hóa',
    lastBackup: 'Sao lưu lần cuối',
    databaseSize: 'Kích thước database',
    
    // Actions
    saveChanges: 'Lưu thay đổi',
    resetToDefault: 'Đặt lại mặc định',
    cancel: 'Hủy',
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
  move_category: 'Chuyn danh mục',
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

  // Royalty Management
  royalty: {
    title: 'Nhuận Bút',
    
    // Submenu
    submenu: {
      management: 'Cấu hình',
      integration: 'Quản lý & Báo cáo',
    },
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
    ruleDescription: 'M tả ngắn gọn về rule này...',
    
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

  // Photo Editor
  photoEditor: {
    title: 'Chỉnh sửa ảnh',
    subtitle: 'Công cụ chỉnh sửa ảnh chuyên nghiệp',
    resetAll: 'Đặt lại tất cả',
    saveChanges: 'Lưu thay đổi',
    tabs: {
      crop: 'Cắt ảnh',
      adjust: 'Điều chỉnh',
      filters: 'Bộ lọc',
      effects: 'Hiệu ứng',
    },
    cropResize: 'Cắt & Thay đổi kích thước',
    startCropping: 'Bắt đầu cắt',
    applyCrop: 'Áp dụng cắt',
    cancelCrop: 'Hủy bỏ',
    aspectRatio: 'Tỷ lệ khung hình',
    transform: 'Biến đổi',
    rotateRight: 'Xoay phải',
    rotateLeft: 'Xoay trái',
    flipH: 'Lật ngang',
    flipV: 'Lật dọc',
    background: 'Nền ảnh',
    removing: 'Đang xóa...',
    bgRemoved: 'Đã xóa nền',
    removeBg: 'Xóa nền ảnh',
    bgAINote: 'Sử dụng AI để tự động xóa nền ảnh',
    imageAdjustments: 'Điều chỉnh hình ảnh',
    advanced: 'Nâng cao',
    filterPresets: 'Bộ lọc có sẵn',
    vivid: 'Rực rỡ',
    dramatic: 'Kịch tính',
    bw: 'Đen trắng',
    sepia: 'Hoài cổ',
    cool: 'Mát mẻ',
    warm: 'Ấm áp',
    specialEffects: 'Hiệu ứng đặc biệt',
    aiEnhance: 'AI Nâng cao',
    autoAdjust: 'Tự động điều chỉnh',
    hdrEffect: 'Hiệu ứng HDR',
    moreEffects: 'Thêm nhiều hiệu ứng sẽ sớm ra mắt! Bao gồm AI nâng cao, chế độ chân dung, làm mờ nền, và nhiều hơn nữa.',
    fit: 'Vừa vặn',
  },

  // Smart Crop
  smartCrop: {
    title: 'Cắt ảnh thông minh',
    subtitle: 'Cắt ảnh bằng AI với các mẫu có sẵn',
    aiDetecting: 'Đang phát hiện...',
    aiDetectSubject: 'AI Phát hiện chủ thể',
    categories: 'Danh mục',
    cropPresets: 'Mẫu cắt có sẵn',
    freeRatio: 'Tỷ lệ tự do',
    ratio: 'Tỷ lệ',
    reset: 'Đặt lại',
    applyCrop: 'Áp dụng cắt',
    all: 'Tất cả',
    social: 'Mạng xã hội',
    print: 'In ấn',
    web: 'Web',
    custom: 'Tùy chỉnh',
    instagramSquare: 'Instagram Vuông',
    instagramPortrait: 'Instagram Dọc',
    facebookCover: 'Ảnh bìa Facebook',
    twitterPost: 'Bài đăng Twitter',
    linkedinPost: 'Bài đăng LinkedIn',
    youtubeThumbnail: 'Thumbnail YouTube',
    a4Portrait: 'A4 Dọc',
    a4Landscape: 'A4 Ngang',
    letter: 'Khổ Letter',
    businessCard: 'Danh thiếp',
    webBanner: 'Banner Web',
    heroImage: 'Ảnh Hero',
    freeForm: 'Tự do',
    square: 'Vuông',
  },

  // Text Effects
  textEffects: {
    title: 'Hiệu ứng văn bản nâng cao',
    subtitle: 'Biến đổi văn bản với hiệu ứng ấn tượng',
    effectTypes: 'Loại hiệu ứng',
    presetsAvailable: 'mẫu có sẵn',
    effectSettings: 'Cài đặt hiệu ứng',
    previewText: 'Văn bản xem trước',
    previewPlaceholder: 'Nhập văn bản...',
    applyEffect: 'Áp dụng hiệu ứng',
    gradient: 'Chuyển màu',
    curved: 'Cong',
    threeD: '3D',
    outline: 'Viền',
    shadow: 'Đổ bóng',
    glow: 'Phát sáng',
    neon: 'Neon',
    metallic: 'Kim loại',
    gradientType: 'Kiểu chuyển màu',
    linear: 'Tuyến tính',
    radial: 'Tỏa tròn',
    conic: 'Hình nón',
    angle: 'Góc',
    curvature: 'Độ cong',
    radius: 'Bán kính',
    depth: 'Chiều sâu',
    perspective: 'Phối cảnh',
    lightAngle: 'Góc chiếu sáng',
    width: 'Độ rộng',
    color: 'Màu sắc',
    xOffset: 'Lệch X',
    yOffset: 'Lệch Y',
    blur: 'Độ mờ',
    intensity: 'Cường độ',
    spread: 'Phạm vi',
    flickerEffect: 'Hiệu ứng nhấp nháy',
    type: 'Loại',
    gold: 'Vàng',
    silver: 'Bạc',
    bronze: 'Đồng',
    chrome: 'Chrome',
    shine: 'Độ bóng',
    proTip: 'Mẹo chuyên nghiệp',
    proTipText: 'Kết hợp nhiều hiệu ứng để tạo phong cách độc đáo. Bạn có thể xếp chồng hiệu ứng chuyển màu, đổ bóng và viền.',
  },

  // Element Library Showcase
  elementLibrary: {
    title: 'Trình bày Thư viện phần tử',
    subtitle: 'Khám phá các mẫu thiết kế có sẵn sử dụng Thư viện phần tử',
    useCases: 'trường hợp sử dụng',
    elementsAvailable: 'phần tử có sẵn',
    categoriesCount: 'danh mục',
    quickStart: 'Bắt đầu nhanh',
    quickStartDesc: 'Nhấn tab ⭐ Phần tử để duyệt thư viện',
    customize: 'Tùy chỉnh',
    customizeDesc: 'Đổi màu, thay đổi kích thước, thêm hiệu ứng',
    combine: 'Kết hợp',
    combineDesc: 'Trộn các phần tử để tạo thiết kế độc đáo',
    statsCard: 'Thẻ thống kê',
    customerSatisfaction: 'Sự hài lòng khách hàng',
    socialBanner: 'Banner mạng xã hội',
    followUs: 'Theo dõi chúng tôi',
    featureHighlight: 'Nổi bật tính năng',
    newBadge: 'MỚI',
    premiumFeature: 'Tính năng cao cấp',
    advancedAnalytics: 'Phân tích nâng cao',
    prioritySupport: 'Hỗ trợ ưu tiên',
    contactInfo: 'Thông tin liên hệ',
    getInTouch: 'Liên hệ với chúng tôi',
    teamSection: 'Mục đội ngũ',
    pricingDisplay: 'Hiển thị giá',
    limitedOffer: 'ƯU ĐÃI CÓ HẠN',
    specialPrice: 'Giá đặc biệt',
    saveToday: 'Tiết kiệm 40% hôm nay!',
  },

  // Event Stream Embed
  eventStreamEmbed: {
    title: 'Nhúng & Chia sẻ',
    subtitle: 'Nhúng dòng sự kiện vào website của bạn',
    embedType: 'Kiểu nhúng',
    customization: 'Tùy chỉnh',
    embedCode: 'Mã nhúng',
    copied: 'Đã copy',
    copy: 'Copy',
    timelineDesc: 'Hiển thị timeline đầy đủ với các bài viết',
    cardDesc: 'Card compact hiển thị bài viết mới nhất',
    bannerDesc: 'Banner ngang với featured articles',
    floatingWidgetDesc: 'Widget floating ở góc màn hình',
    showAuthor: 'Hiển thị tác giả',
    showStats: 'Hiển thị thống kê',
    showThumbnail: 'Hiển thị thumbnail',
    showHeader: 'Hiển thị header',
    maxArticles: 'Số bài viết tối đa',
    primaryColor: 'Màu chính',
    borderRadius: 'Bo góc',
    newsAndEvents: 'Chuỗi tin tức và sự kiện',
    latestArticle: 'Bài viết mới nhất',
    articleExcerpt: 'Trích dẫn bài viết...',
    readMore: 'Đọc thêm',
    viewAll: 'Xem tất cả',
    featuredTitle: 'Tiêu đề bài viết nổi bật',
    explore: 'Khám phá',
    newArticles: '3 bài viết mới',
    instructions: 'Hướng dẫn sử dụng',
    step1: 'Chọn kiểu embed phù hợp với website của bạn',
    step2: 'Tùy chỉnh giao diện và chức năng theo ý muốn',
    step3: 'Copy mã nhúng và paste vào HTML của website',
    step4: 'Widget sẽ tự động cập nhật khi có bài viết mới',
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