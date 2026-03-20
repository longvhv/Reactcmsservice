// Shared data source for the entire CMS

import type { ArticleData, UserData } from './royaltyCalculations';

// Mock users data (sync with UserManagement)
export const mockUsers: UserData[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvana@cms.com',
    role: 'Biên tập viên',
    department: 'Biên tập',
    avatar: 'https://i.pravatar.cc/150?img=1',
    royaltyPercentage: 100
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'tranthib@cms.com',
    role: 'Tác giả',
    department: 'Nội dung',
    avatar: 'https://i.pravatar.cc/150?img=2',
    royaltyPercentage: 100
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    email: 'levanc@cms.com',
    role: 'Video Creator',
    department: 'Media',
    avatar: 'https://i.pravatar.cc/150?img=3',
    royaltyPercentage: 120 // Premium creator
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    email: 'phamthid@cms.com',
    role: 'Photographer',
    department: 'Media',
    avatar: 'https://i.pravatar.cc/150?img=4',
    royaltyPercentage: 100
  },
  {
    id: 5,
    name: 'Hoàng Minh Em',
    email: 'hoangminhe@cms.com',
    role: 'Podcast Host',
    department: 'Audio',
    avatar: 'https://i.pravatar.cc/150?img=5',
    royaltyPercentage: 110
  },
  {
    id: 6,
    name: 'Vũ Thị Phương',
    email: 'vuthiphuong@cms.com',
    role: 'Designer',
    department: 'Creative',
    avatar: 'https://i.pravatar.cc/150?img=6',
    royaltyPercentage: 100
  },
  {
    id: 7,
    name: 'Đỗ Văn Giang',
    email: 'dovangiang@cms.com',
    role: 'Reporter',
    department: 'Biên tập',
    avatar: 'https://i.pravatar.cc/150?img=7',
    royaltyPercentage: 100
  },
  {
    id: 8,
    name: 'Bùi Thị Hương',
    email: 'buithihuong@cms.com',
    role: 'Content Writer',
    department: 'Nội dung',
    avatar: 'https://i.pravatar.cc/150?img=8',
    royaltyPercentage: 95
  }
];

// Mock articles data with real royalty calculation
export const mockArticles: ArticleData[] = [
  // News articles
  {
    id: 1,
    title: 'Hướng dẫn sử dụng CMS Platform mới cho người mới bắt đầu',
    type: 'news',
    status: 'published',
    authorId: 1,
    authorName: 'Nguyễn Văn An',
    wordCount: 1200,
    views: 12450,
    publishDate: '2024-12-15',
    category: 'Công nghệ',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    contentMode: 'sections',
    sections: [
      {
        id: 'sec_demo_1',
        type: 'html',
        order: 0,
        isVisible: true,
        spacing: 'medium',
        content: '<h2>Giới thiệu CMS Platform</h2><p>CMS Platform là hệ thống quản lý nội dung thế hệ mới, được thiết kế dành cho các tổ chức truyền thông hiện đại. Với kiến trúc microservices và giao diện trực quan, CMS Platform giúp đội ngũ biên tập viên làm việc hiệu quả hơn.</p>'
      },
      {
        id: 'sec_demo_2',
        type: 'callout',
        order: 1,
        isVisible: true,
        spacing: 'medium',
        variant: 'tip',
        calloutTitle: 'Mẹo cho người mới',
        content: 'Hãy bắt đầu bằng việc tạo một bài viết nháp để làm quen với giao diện trước khi xuất bản chính thức.',
        dismissible: false
      },
      {
        id: 'sec_demo_3',
        type: 'steps',
        order: 2,
        isVisible: true,
        spacing: 'medium',
        title: 'Các bước bắt đầu',
        steps: [
          { id: 'step_1', stepTitle: 'Đăng nhập hệ thống', description: 'Sử dụng tài khoản được cấp để đăng nhập vào CMS Dashboard.' },
          { id: 'step_2', stepTitle: 'Tạo bài viết mới', description: 'Nhấn nút "Tạo bài viết" và chọn loại bài viết phù hợp.' },
          { id: 'step_3', stepTitle: 'Thêm nội dung', description: 'Sử dụng Block Editor để thêm các section nội dung đa dạng.' },
          { id: 'step_4', stepTitle: 'Xuất bản', description: 'Gửi bài viết để phê duyệt hoặc xuất bản trực tiếp nếu có quyền.' }
        ],
        layout: 'vertical',
        showNumbers: true,
        stepsStyle: 'cards'
      },
      {
        id: 'sec_demo_4',
        type: 'numbers',
        order: 3,
        isVisible: true,
        spacing: 'medium',
        items: [
          { id: 'num_1', value: 26, label: 'Loại section', suffix: '+' },
          { id: 'num_2', value: 10, label: 'Loại bài viết', suffix: '' },
          { id: 'num_3', value: 99, label: 'Hài lòng', suffix: '%' }
        ],
        columns: 3,
        animate: true,
        numbersStyle: 'gradient'
      },
      {
        id: 'sec_demo_5',
        type: 'quote',
        order: 4,
        isVisible: true,
        spacing: 'medium',
        text: 'CMS Platform đã thay đổi hoàn toàn cách chúng tôi quản lý nội dung. Quy trình xuất bản nhanh hơn 3 lần so với trước.',
        author: 'Trần Minh Đức',
        source: 'Trưởng phòng Biên tập - VHV Media',
        quoteStyle: 'bordered'
      },
      {
        id: 'sec_demo_6',
        type: 'chart',
        order: 5,
        isVisible: true,
        spacing: 'medium',
        title: 'Thống kê sử dụng theo tháng',
        chartType: 'bar',
        data: [
          { label: 'T1', value: 120, color: '#3b82f6' },
          { label: 'T2', value: 180, color: '#8b5cf6' },
          { label: 'T3', value: 250, color: '#10b981' },
          { label: 'T4', value: 310, color: '#f59e0b' },
          { label: 'T5', value: 420, color: '#ef4444' },
          { label: 'T6', value: 380, color: '#ec4899' }
        ],
        showLegend: true,
        showGrid: true,
        showValues: true,
        animate: true,
        colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
        chartHeight: 300
      },
      {
        id: 'sec_demo_7',
        type: 'cta',
        order: 6,
        isVisible: true,
        spacing: 'medium',
        ctaTitle: 'Bắt đầu sử dụng ngay hôm nay',
        description: 'Đăng ký tài khoản miễn phí và trải nghiệm sức mạnh của CMS Platform.',
        buttonText: 'Đăng ký miễn phí',
        buttonUrl: '#',
        buttonStyle: 'gradient',
        ctaLayout: 'centered'
      },
      {
        id: 'sec_demo_8',
        type: 'gallery',
        order: 7,
        isVisible: true,
        spacing: 'medium',
        title: 'Hình ảnh giao diện CMS',
        images: [
          { id: 'gal_1', url: 'https://images.unsplash.com/photo-1768796371784-3ad0bf2723a0?w=400&h=400&fit=crop', alt: 'Dashboard CMS', caption: 'Tổng quan Dashboard' },
          { id: 'gal_2', url: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?w=400&h=400&fit=crop', alt: 'Server Infrastructure', caption: 'Hạ tầng máy chủ' },
          { id: 'gal_3', url: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?w=400&h=400&fit=crop', alt: 'Code Editor', caption: 'Trình soạn thảo mã nguồn' },
          { id: 'gal_4', url: 'https://images.unsplash.com/photo-1739298061740-5ed03045b280?w=400&h=400&fit=crop', alt: 'Team Collaboration', caption: 'Làm việc nhóm' },
        ],
        layout: 'grid',
        columns: 2,
        gap: 'medium',
        enableLightbox: true
      },
      {
        id: 'sec_demo_9',
        type: 'audio',
        order: 8,
        isVisible: true,
        spacing: 'medium',
        title: 'Podcast: Tương lai CMS',
        source: 'url',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        audioTitle: 'CMS Platform Podcast - Episode 1',
        artist: 'VHV Tech Team',
        coverImage: 'https://images.unsplash.com/photo-1768796371784-3ad0bf2723a0?w=200&h=200&fit=crop'
      },
      {
        id: 'sec_demo_10',
        type: 'embed',
        order: 9,
        isVisible: true,
        spacing: 'medium',
        title: 'Video hướng dẫn sử dụng',
        embedType: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        aspectRatio: '16:9'
      },
      {
        id: 'sec_demo_11',
        type: 'comparison',
        order: 10,
        isVisible: true,
        spacing: 'medium',
        title: 'So sánh các gói dịch vụ',
        comparisonLayout: 'table',
        items: [
          { id: 'comp_a', name: 'Starter', values: { 'cr_1': '5 GB', 'cr_2': '1,000', 'cr_3': 'true', 'cr_4': 'false', 'cr_5': '7' } },
          { id: 'comp_b', name: 'Professional', values: { 'cr_1': '50 GB', 'cr_2': '50,000', 'cr_3': 'true', 'cr_4': 'true', 'cr_5': '9' } },
          { id: 'comp_c', name: 'Enterprise', values: { 'cr_1': 'Unlimited', 'cr_2': 'Unlimited', 'cr_3': 'true', 'cr_4': 'true', 'cr_5': '10' } },
        ],
        criteria: [
          { id: 'cr_1', name: 'Dung lượng lưu trữ', criteriaType: 'text' },
          { id: 'cr_2', name: 'Lượt xem/tháng', criteriaType: 'text' },
          { id: 'cr_3', name: 'Hỗ trợ SEO', criteriaType: 'boolean' },
          { id: 'cr_4', name: 'API Access', criteriaType: 'boolean' },
          { id: 'cr_5', name: 'Đánh giá tổng', criteriaType: 'rating' },
        ]
      },
      {
        id: 'sec_demo_12',
        type: 'file-download',
        order: 11,
        isVisible: true,
        spacing: 'medium',
        title: 'Tài liệu tham khảo',
        files: [
          { id: 'file_1', name: 'Hướng dẫn sử dụng CMS v2.0', url: '#', size: '2.4 MB', fileType: 'pdf', description: 'Tài liệu hướng dẫn sử dụng đầy đủ cho người dùng mới' },
          { id: 'file_2', name: 'API Documentation', url: '#', size: '1.8 MB', fileType: 'pdf', description: 'Tài liệu kỹ thuật dành cho developer' },
          { id: 'file_3', name: 'Template mẫu bài viết', url: '#', size: '450 KB', fileType: 'docx', description: 'Bộ template chuẩn cho các loại bài viết' },
          { id: 'file_4', name: 'Source code mẫu', url: '#', size: '3.2 MB', fileType: 'zip', description: 'Code mẫu tích hợp CMS API' },
        ],
        downloadLayout: 'list'
      }
    ]
  },
  {
    id: 2,
    title: 'Xu hướng công nghệ AI và Machine Learning năm 2024',
    type: 'news',
    status: 'published',
    authorId: 2,
    authorName: 'Trần Thị Bình',
    wordCount: 1500,
    views: 8500,
    publishDate: '2024-12-18',
    category: 'Công nghệ',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Phân tích thị trường blockchain và cryptocurrency',
    type: 'news',
    status: 'published',
    authorId: 1,
    authorName: 'Nguyễn Văn An',
    wordCount: 2000,
    views: 6200,
    publishDate: '2024-12-22',
    category: 'Tài chính',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'Khám phá ẩm thực Việt Nam qua 3 miền',
    type: 'news',
    status: 'published',
    authorId: 7,
    authorName: 'Đỗ Văn Giang',
    wordCount: 800,
    views: 15600,
    publishDate: '2024-12-20',
    category: 'Văn hóa',
    thumbnail: 'https://images.unsplash.com/photo-1559305616-3bed4d732bdf?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    title: 'Hướng dẫn đầu tư chứng khoán cho người mới',
    type: 'news',
    status: 'published',
    authorId: 8,
    authorName: 'Bùi Thị Hương',
    wordCount: 2200,
    views: 9800,
    publishDate: '2024-12-25',
    category: 'Tài chính',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop'
  },

  // Video articles
  {
    id: 6,
    title: 'Video hướng dẫn React Framework từ cơ bản đến nâng cao',
    type: 'video',
    status: 'published',
    authorId: 3,
    authorName: 'Lê Văn Cường',
    duration: 45, // minutes
    views: 25000,
    publishDate: '2024-12-20',
    category: 'Lập trình',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop'
  },
  {
    id: 7,
    title: 'Review chi tiết iPhone 15 Pro Max',
    type: 'video',
    status: 'published',
    authorId: 3,
    authorName: 'Lê Văn Cường',
    duration: 15,
    views: 18200,
    publishDate: '2024-12-10',
    category: 'Công nghệ',
    thumbnail: 'https://images.unsplash.com/photo-1678652197365-f88dc2ce0b64?w=400&h=300&fit=crop'
  },
  {
    id: 8,
    title: 'Workshop thiết kế UI/UX cho ứng dụng mobile',
    type: 'video',
    status: 'published',
    authorId: 3,
    authorName: 'Lê Văn Cường',
    duration: 120,
    views: 12500,
    publishDate: '2024-12-05',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop'
  },

  // Gallery articles
  {
    id: 9,
    title: 'Bộ sưu tập ảnh sự kiện Tech Summit 2024',
    type: 'gallery',
    status: 'published',
    authorId: 4,
    authorName: 'Phạm Thị Dung',
    imageCount: 50,
    views: 8400,
    publishDate: '2024-12-25',
    category: 'Sự kiện',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
  },
  {
    id: 10,
    title: 'Gallery: Vẻ đẹp Hà Nội mùa đông',
    type: 'gallery',
    status: 'published',
    authorId: 4,
    authorName: 'Phạm Thị Dung',
    imageCount: 35,
    views: 22000,
    publishDate: '2024-12-15',
    category: 'Du lịch',
    thumbnail: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=300&fit=crop'
  },
  {
    id: 11,
    title: 'Những khoảnh khắc đẹp của năm 2024',
    type: 'gallery',
    status: 'published',
    authorId: 4,
    authorName: 'Phạm Thị Dung',
    imageCount: 60,
    views: 15300,
    publishDate: '2024-12-28',
    category: 'Tổng hợp',
    thumbnail: 'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?w=400&h=300&fit=crop'
  },

  // Podcast articles
  {
    id: 12,
    title: 'Podcast: Chuyện công nghệ - Tập 15: AI thay đổi cuộc sống',
    type: 'podcast',
    status: 'published',
    authorId: 5,
    authorName: 'Hoàng Minh Em',
    duration: 45,
    views: 5600,
    publishDate: '2024-12-18',
    category: 'Công nghệ',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop'
  },
  {
    id: 13,
    title: 'Podcast: Khởi nghiệp và đầu tư - Tập 8',
    type: 'podcast',
    status: 'published',
    authorId: 5,
    authorName: 'Hoàng Minh Em',
    duration: 60,
    views: 7200,
    publishDate: '2024-12-22',
    category: 'Kinh doanh',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop'
  },

  // Infographic
  {
    id: 14,
    title: 'Infographic: Thống kê thị trường công nghệ Việt Nam 2024',
    type: 'infographic',
    status: 'published',
    authorId: 6,
    authorName: 'Vũ Thị Phương',
    views: 18500,
    publishDate: '2024-12-10',
    category: 'Công ngh��',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  },
  {
    id: 15,
    title: 'Infographic: Xu hướng thiết kế 2025',
    type: 'infographic',
    status: 'published',
    authorId: 6,
    authorName: 'Vũ Thị Phương',
    views: 12300,
    publishDate: '2024-12-20',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop'
  },

  // Document
  {
    id: 16,
    title: 'Tài liệu hướng dẫn React Hooks đầy đủ',
    type: 'document',
    status: 'published',
    authorId: 2,
    authorName: 'Trần Thị Bình',
    pageCount: 45,
    downloads: 850,
    views: 3200,
    publishDate: '2024-12-12',
    category: 'Lập trình',
    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop'
  },
  {
    id: 17,
    title: 'E-book: Marketing số cho doanh nghiệp nhỏ',
    type: 'document',
    status: 'published',
    authorId: 8,
    authorName: 'Bùi Thị Hương',
    pageCount: 120,
    downloads: 1200,
    views: 5600,
    publishDate: '2024-12-08',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop'
  },

  // Event
  {
    id: 18,
    title: 'Sự kiện: AI Summit Vietnam 2024',
    type: 'event',
    status: 'published',
    authorId: 1,
    authorName: 'Nguyễn Văn An',
    attendees: 500,
    views: 8900,
    publishDate: '2024-12-01',
    category: 'Sự kiện',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
  },
  {
    id: 19,
    title: 'Workshop: Modern Web Development 2024',
    type: 'event',
    status: 'published',
    authorId: 7,
    authorName: 'Đỗ Văn Giang',
    attendees: 150,
    views: 4200,
    publishDate: '2024-12-15',
    category: 'Workshop',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop'
  },

  // Job
  {
    id: 20,
    title: 'Tuyển dụng: Senior React Developer',
    type: 'job',
    status: 'published',
    authorId: 1,
    authorName: 'Nguyễn Văn An',
    applications: 85,
    views: 2500,
    publishDate: '2024-12-05',
    category: 'Tuyển dụng',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
  },
  {
    id: 21,
    title: 'Tuyển dụng: UI/UX Designer',
    type: 'job',
    status: 'published',
    authorId: 6,
    authorName: 'Vũ Thị Phương',
    applications: 120,
    views: 3200,
    publishDate: '2024-12-10',
    category: 'Tuyển dụng',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
  },

  // Person profile
  {
    id: 22,
    title: 'Nhân vật: CEO Nguyễn Văn A - Hành trình xây dựng startup',
    type: 'person',
    status: 'published',
    authorId: 7,
    authorName: 'Đỗ Văn Giang',
    wordCount: 1500,
    views: 12000,
    publishDate: '2024-12-18',
    category: 'Nhân vật',
    thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop'
  },

  // Download resource
  {
    id: 23,
    title: 'Download: Template thiết kế Landing Page',
    type: 'download',
    status: 'published',
    authorId: 6,
    authorName: 'Vũ Thị Phương',
    downloads: 650,
    views: 2800,
    publishDate: '2024-12-12',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
  },
  {
    id: 24,
    title: 'Download: Preset Lightroom cho ảnh phong cảnh',
    type: 'download',
    status: 'published',
    authorId: 4,
    authorName: 'Phạm Thị Dung',
    downloads: 920,
    views: 4100,
    publishDate: '2024-12-16',
    category: 'Photography',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },

  // Draft/Pending articles (not included in royalty calculation)
  {
    id: 25,
    title: 'Bài viết đang soạn thảo về Quantum Computing',
    type: 'news',
    status: 'draft',
    authorId: 2,
    authorName: 'Trần Thị Bình',
    wordCount: 800,
    views: 0,
    publishDate: '2024-12-28',
    category: 'Công nghệ'
  },
  {
    id: 26,
    title: 'Video đang chờ duyệt về Next.js 14',
    type: 'video',
    status: 'pending',
    authorId: 3,
    authorName: 'Lê Văn Cường',
    duration: 30,
    views: 0,
    publishDate: '2024-12-29',
    category: 'Lập trình'
  }
];

// Export counts for quick access
export const dataStats = {
  totalUsers: mockUsers.length,
  totalArticles: mockArticles.length,
  publishedArticles: mockArticles.filter(a => a.status === 'published').length,
  draftArticles: mockArticles.filter(a => a.status === 'draft').length,
  pendingArticles: mockArticles.filter(a => a.status === 'pending').length,
};