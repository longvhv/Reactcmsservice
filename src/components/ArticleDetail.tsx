import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Globe, Calendar, User, Eye, MessageCircle, Heart, Clock, Share2, Bookmark, MapPin, Briefcase, DollarSign, FileText, Download, Play, Image as ImageIcon, Users, RotateCcw, GitBranch, Upload, FolderOpen, Film, Headphones, X, ExternalLink, Tag, Building2, Mail, Phone, Gavel, Scale, FileCheck } from 'lucide-react';

interface ArticleDetailProps {
  articleId: number;
  onNavigate: (page: any) => void;
}

export function ArticleDetail({ articleId, onNavigate }: ArticleDetailProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedVersion, setSelectedVersion] = useState(3);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedMediaTab, setSelectedMediaTab] = useState('images');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);

  const getArticleData = (id: number) => {
    const articles: any = {
      1: {
        id: 1,
        type: 'news',
        title: 'Hướng dẫn sử dụng CMS Platform mới - Nền tảng quản lý nội dung hiện đại',
        category: 'Công nghệ',
        categories: ['Công nghệ', 'Hướng dẫn', 'AI'],
        author: 'Nguyễn Văn A',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        views: 1234,
        comments: 45,
        likes: 234,
        publishDate: '2024-12-26 10:30',
        updatedDate: '2024-12-26 14:20',
        readTime: '5 phút đọc',
        content: `<p class="lead">CMS Platform là hệ thống quản lý nội dung hiện đại...</p><h2>Giới thiệu</h2><p>Nội dung chi tiết...</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
        tags: ['CMS', 'Hướng dẫn', 'Công nghệ'],
        status: 'published',
      },
      2: {
        id: 2,
        type: 'video',
        title: 'Hướng dẫn tích hợp AI Translation vào CMS',
        category: 'Video Tutorial',
        categories: ['Tutorial', 'AI', 'Công nghệ'],
        author: 'Trần Thị B',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        views: 3421,
        comments: 89,
        likes: 567,
        publishDate: '2024-12-25 14:00',
        updatedDate: '2024-12-25 16:30',
        duration: '15:30',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        transcript: `
          <p>00:00 - Giới thiệu về tính năng AI Translation</p>
          <p>02:30 - Cài đặt và cấu hình API keys</p>
          <p>05:45 - Demo dịch tự động từ tiếng Việt sang tiếng Anh</p>
          <p>10:20 - Các tùy chọn nâng cao và tối ưu</p>
          <p>14:00 - Kết luận và Q&A</p>
        `,
        thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200',
        tags: ['AI', 'Translation', 'Tutorial'],
        status: 'published',
      },
      3: {
        id: 3,
        type: 'gallery',
        title: 'Tech Summit 2024 - Sự kiện công nghệ lớn nhất năm',
        category: 'Sự kiện',
        categories: ['Sự kiện', 'Công nghệ', 'Hội thảo'],
        author: 'Lê Văn C',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        views: 5632,
        comments: 134,
        likes: 892,
        publishDate: '2024-12-24 09:00',
        updatedDate: '2024-12-24 18:00',
        description: 'Hơn 1000 chuyên gia công nghệ, 50+ diễn giả quốc tế, 30+ workshop và hàng trăm startup đã tham gia Tech Summit 2024.',
        images: [
          { id: 1, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', caption: 'Khai mạc Tech Summit 2024 với sự tham gia của hơn 1000 đại biểu' },
          { id: 2, url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200', caption: 'Phiên thảo luận về AI và Machine Learning' },
          { id: 3, url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200', caption: 'Gian hàng trưng bày của các startup công nghệ' },
          { id: 4, url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1200', caption: 'Workshop về Cloud Computing và DevOps' },
          { id: 5, url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200', caption: 'Networking session với các nhà đầu tư' },
          { id: 6, url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200', caption: 'Bế mạc và trao giải Best Startup Award' },
        ],
        thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
        tags: ['Tech Summit', 'Sự kiện', 'Công nghệ'],
        status: 'published',
      },
      4: {
        id: 4,
        type: 'legal',
        title: 'Nghị định 15/2024/NĐ-CP về An toàn thông tin mạng',
        category: 'Văn bản pháp luật',
        categories: ['Pháp luật', 'An ninh mạng', 'Nghị định'],
        author: 'Phòng Pháp chế',
        authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        views: 2341,
        comments: 23,
        likes: 145,
        publishDate: '2024-12-20 08:00',
        updatedDate: '2024-12-20 08:00',
        documentNumber: '15/2024/NĐ-CP',
        issueDate: '15/03/2024',
        effectiveDate: '01/06/2024',
        issuedBy: 'Chính phủ',
        signer: 'Thủ tướng Chính phủ',
        documentType: 'Nghị định',
        field: 'An toàn thông tin mạng',
        content: `
          <h2>CHÍNH PHỦ</h2>
          <p><strong>Căn cứ</strong> Luật Tổ chức Chính phủ ngày 19 tháng 6 năm 2015;</p>
          <p><strong>Căn cứ</strong> Luật An toàn thông tin mạng ngày 19 tháng 11 năm 2015;</p>
          <p><strong>Theo đề nghị</strong> của Bộ trưởng Bộ Thông tin và Truyền thông;</p>
          
          <h3>NGHỊ ĐỊNH:</h3>
          
          <h4>Chương I: QUY ĐỊNH CHUNG</h4>
          
          <p><strong>Điều 1. Phạm vi điều chỉnh</strong></p>
          <p>Nghị định này quy định chi tiết một số điều và biện pháp thi hành Luật An toàn thông tin mạng về bảo vệ hệ thống thông tin quan trọng về an ninh quốc gia.</p>
          
          <p><strong>Điều 2. Đối tượng áp dụng</strong></p>
          <p>1. Cơ quan, tổ chức, cá nhân Việt Nam và nước ngoài có liên quan đến hoạt động bảo vệ hệ thống thông tin quan trọng về an ninh quốc gia tại Việt Nam.</p>
          <p>2. Cơ quan quản lý nhà nước về an toàn thông tin mạng các cấp.</p>
        `,
        attachments: [
          { name: 'nghi-dinh-15-2024-full.pdf', size: '2.4 MB', type: 'PDF' },
          { name: 'thong-tu-huong-dan-15.pdf', size: '1.8 MB', type: 'PDF' },
        ],
        thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200',
        tags: ['Nghị định', 'An ninh mạng', 'Pháp luật'],
        status: 'published',
      },
      5: {
        id: 5,
        type: 'job',
        title: 'Tuyển dụng Senior Frontend Developer (ReactJS)',
        category: 'Tuyển dụng',
        categories: ['Tuyển dụng', 'IT', 'Frontend'],
        author: 'Phòng Nhân sự',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
        views: 4521,
        comments: 67,
        likes: 234,
        publishDate: '2024-12-26 09:00',
        updatedDate: '2024-12-26 09:00',
        deadline: '31/01/2025',
        position: 'Senior Frontend Developer',
        level: 'Senior',
        quantity: 2,
        salary: '25-35 triệu',
        workLocation: 'Hà Nội',
        workType: 'Full-time',
        department: 'Phòng Phát triển sản phẩm',
        description: `
          <h3>Mô tả công việc</h3>
          <ul>
            <li>Phát triển và bảo trì các ứng dụng web sử dụng ReactJS, TypeScript</li>
            <li>Xây dựng UI components tái sử dụng và các thư viện frontend</li>
            <li>Tối ưu hiệu suất ứng dụng và trải nghiệm người dùng</li>
            <li>Làm việc chặt chẽ với team Backend và Design để đảm bảo chất lượng sản phẩm</li>
            <li>Code review và mentor các junior developers</li>
          </ul>

          <h3>Yêu cầu công việc</h3>
          <ul>
            <li>4+ năm kinh nghiệm với ReactJS và TypeScript</li>
            <li>Thành thạo HTML5, CSS3, JavaScript ES6+</li>
            <li>Kinh nghiệm với State Management (Redux, MobX, Zustand)</li>
            <li>Am hiểu về RESTful API, GraphQL</li>
            <li>Kinh nghiệm với các công cụ build: Webpack, Vite</li>
            <li>Hiểu biết về UX/UI design principles</li>
            <li>Có kinh nghiệm làm việc Agile/Scrum là một lợi thế</li>
          </ul>

          <h3>Quyền lợi</h3>
          <ul>
            <li>Lương cạnh tranh: 25-35 triệu (tùy kinh nghiệm)</li>
            <li>Thưởng hiệu suất hàng quý, thưởng cuối năm</li>
            <li>Review lương 2 lần/năm</li>
            <li>Bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình</li>
            <li>Làm việc trong môi trường chuyên nghiệp, năng động</li>
            <li>Cơ hội thăng tiến rõ ràng</li>
            <li>Team building, du lịch hàng năm</li>
          </ul>
        `,
        contactEmail: 'hr@vhvplatform.com',
        contactPhone: '024 1234 5678',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
        tags: ['Frontend', 'ReactJS', 'Senior'],
        status: 'published',
      },
      6: {
        id: 6,
        type: 'podcast',
        title: 'Tech Talk #12: AI và Tương lai của Content Creation',
        category: 'Podcast',
        categories: ['Podcast', 'AI', 'Tech Talk'],
        author: 'Podcast Team',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        views: 2134,
        comments: 45,
        likes: 389,
        publishDate: '2024-12-23 18:00',
        updatedDate: '2024-12-23 18:00',
        duration: '45:20',
        audioUrl: 'https://example.com/podcast-12.mp3',
        episode: 12,
        season: 2,
        guests: ['Dr. Nguyễn Văn X - AI Researcher', 'Ms. Trần Thị Y - Content Strategist'],
        description: `
          <p>Trong tập này, chúng ta sẽ khám phá cách AI đang thay đổi ngành content creation và những xu hướng mới nhất trong lĩnh vực này.</p>
          
          <h3>Nội dung chính:</h3>
          <ul>
            <li><strong>00:00 - 05:00:</strong> Giới thiệu khách mời và chủ đề</li>
            <li><strong>05:00 - 15:30:</strong> AI trong content generation - Cơ hội và thách thức</li>
            <li><strong>15:30 - 28:00:</strong> Case studies về ứng dụng AI tại các tổ chức lớn</li>
            <li><strong>28:00 - 38:45:</strong> Tương lai của Content Creator trong kỷ nguyên AI</li>
            <li><strong>38:45 - 45:20:</strong> Q&A và kết luận</li>
          </ul>

          <h3>Resources được nhắc đến:</h3>
          <ul>
            <li>ChatGPT và GPT-4 trong content creation</li>
            <li>Midjourney và DALL-E cho thiết kế</li>
            <li>Tools tối ưu workflow với AI</li>
          </ul>
        `,
        thumbnail: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1200',
        tags: ['Podcast', 'AI', 'Content'],
        status: 'published',
      },
    };

    return articles[id] || articles[1];
  };

  const article = getArticleData(articleId);

  const versionHistory = [
    { 
      version: 3, 
      user: article.author,
      userAvatar: article.authorAvatar,
      date: article.updatedDate, 
      changes: 'Cập nhật nội dung mới nhất',
      content: article.content,
      title: article.title,
      thumbnail: article.thumbnail,
      isCurrent: true
    },
    { 
      version: 2, 
      user: 'Editor Team',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: '2024-12-25 12:15', 
      changes: 'Sửa lỗi chính tả, cải thiện văn phong',
      content: '<p>Nội dung phiên bản 2...</p>',
      title: article.title,
      thumbnail: article.thumbnail,
      isCurrent: false
    },
    { 
      version: 1, 
      user: article.author,
      userAvatar: article.authorAvatar,
      date: '2024-12-24 10:30', 
      changes: 'Tạo bài viết mới',
      content: '<p>Nội dung ban đầu...</p>',
      title: article.title,
      thumbnail: article.thumbnail,
      isCurrent: false
    },
  ];

  const mediaAssets = {
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', name: 'hero-image.jpg', size: '2.4 MB', uploadDate: '2024-12-26', usedIn: 'Featured' },
      { id: 2, url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', name: 'content-image.jpg', size: '1.8 MB', uploadDate: '2024-12-26', usedIn: 'Content' },
    ],
    videos: [
      { id: 1, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', name: 'demo-video.mp4', duration: '5:30', size: '45 MB', uploadDate: '2024-12-26' },
    ],
    documents: [
      { id: 1, name: 'user-guide.pdf', type: 'PDF', size: '5.2 MB', uploadDate: '2024-12-26', downloads: 234 },
    ],
    audio: [
      { id: 1, name: 'background-music.mp3', duration: '3:45', size: '8.2 MB', uploadDate: '2024-12-26' },
    ],
  };

  const tabs = [
    { id: 'preview', label: 'Xem trước', icon: Eye },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
    { id: 'media', label: 'Media & Assets', icon: ImageIcon },
    { id: 'history', label: 'Lịch sử phiên bản', icon: GitBranch },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      news: 'Tin tức',
      video: 'Video',
      gallery: 'Thư viện ảnh',
      legal: 'Văn bản PL',
      job: 'Tuyển dụng',
      podcast: 'Podcast',
      event: 'Sự kiện',
      staff: 'Nhân sự',
      download: 'Tải xuống',
    };
    return labels[type] || type;
  };

  // Render News Preview
  const renderNewsPreview = () => (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {article.categories.map((cat: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm shadow-lg shadow-blue-500/20">
              {cat}
            </span>
          ))}
        </div>

        <h1 className="text-foreground mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={article.authorAvatar} 
              alt={article.author} 
              className="w-12 h-12 rounded-full ring-2 ring-blue-100"
            />
            <div>
              <div className="text-foreground">{article.author}</div>
              <div className="text-sm text-muted-foreground">Content Creator</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border"></div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{article.publishDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 py-4 border-y border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-5 h-5" />
            <span>{article.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-5 h-5" />
            <span>{article.likes}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
            <span>{article.comments}</span>
          </div>
        </div>
      </header>

      {article.thumbnail && (
        <figure className="mb-12">
          <img 
            src={article.thumbnail} 
            alt={article.title} 
            className="w-full rounded-2xl shadow-xl"
          />
        </figure>
      )}

      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />

      <div className="mb-12 pb-8 border-b border-border">
        <h3 className="text-foreground mb-4">Tags</h3>
        <div className="flex flex-wrap gap-3">
          {article.tags?.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-muted rounded-full text-muted-foreground hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  // Render Video Preview
  const renderVideoPreview = () => (
    <article className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-foreground mb-4">{article.title}</h1>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{article.views.toLocaleString()} views</span>
          </div>
        </div>
      </div>

      <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <iframe
          src={article.videoUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="bg-card border border-border/60 rounded-2xl p-8 mb-8">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Transcript
        </h3>
        <div 
          className="prose max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: article.transcript }} 
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {article.tags?.map((tag: string, index: number) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );

  // Render Gallery Preview
  const renderGalleryPreview = () => (
    <article className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-foreground mb-4">{article.title}</h1>
        <p className="text-muted-foreground text-lg mb-6">{article.description}</p>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{article.publishDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>{article.images?.length} ảnh</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {article.images?.map((img: any, index: number) => (
          <div 
            key={img.id}
            className="group relative aspect-video bg-muted rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
            onClick={() => setSelectedGalleryImage(index)}
          >
            <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm">{img.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGalleryImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6" />
          </button>
          <img 
            src={article.images[selectedGalleryImage].url} 
            alt={article.images[selectedGalleryImage].caption}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-8 left-0 right-0 text-center text-white">
            <p className="text-lg mb-2">{article.images[selectedGalleryImage].caption}</p>
            <p className="text-sm text-white/60">{selectedGalleryImage + 1} / {article.images.length}</p>
          </div>
        </div>
      )}
    </article>
  );

  // Render Legal Document Preview
  const renderLegalPreview = () => (
    <article className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-foreground mb-2">{article.title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">{article.documentType}</span>
              <span>{article.documentNumber}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-muted-foreground mb-1">Ngày ban hành</div>
            <div className="text-foreground">{article.issueDate}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-muted-foreground mb-1">Ngày hiệu lực</div>
            <div className="text-foreground">{article.effectiveDate}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-muted-foreground mb-1">Cơ quan ban hành</div>
            <div className="text-foreground">{article.issuedBy}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-muted-foreground mb-1">Lĩnh vực</div>
            <div className="text-foreground">{article.field}</div>
          </div>
        </div>
      </div>

      <div 
        className="prose prose-lg max-w-none mb-8 bg-card border border-border/60 rounded-2xl p-8"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />

      {article.attachments && article.attachments.length > 0 && (
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Tài liệu đính kèm
          </h3>
          <div className="space-y-3">
            {article.attachments.map((file: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-blue-50 transition-all duration-200 group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-foreground">{file.name}</div>
                    <div className="text-sm text-muted-foreground">{file.type} • {file.size}</div>
                  </div>
                </div>
                <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );

  // Render Job Posting Preview
  const renderJobPreview = () => (
    <article className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-white mb-2">{article.position}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full text-sm">{article.level}</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full text-sm">{article.workType}</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full text-sm">{article.workLocation}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="text-sm text-white/80 mb-1">Mức lương</div>
            <div className="text-white">{article.salary}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="text-sm text-white/80 mb-1">Số lượng</div>
            <div className="text-white">{article.quantity} người</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="text-sm text-white/80 mb-1">Hạn nộp</div>
            <div className="text-white">{article.deadline}</div>
          </div>
        </div>
      </div>

      <div 
        className="prose prose-lg max-w-none mb-8 bg-card border border-border/60 rounded-2xl p-8"
        dangerouslySetInnerHTML={{ __html: article.description }} 
      />

      <div className="bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200 rounded-2xl p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-green-600" />
          Thông tin liên hệ
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-foreground">
            <Mail className="w-5 h-5 text-green-600" />
            <a href={`mailto:${article.contactEmail}`} className="hover:text-blue-600 transition-colors">
              {article.contactEmail}
            </a>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Phone className="w-5 h-5 text-green-600" />
            <span>{article.contactPhone}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Building2 className="w-5 h-5 text-green-600" />
            <span>{article.department}</span>
          </div>
        </div>
        <button className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200">
          Ứng tuyển ngay
        </button>
      </div>
    </article>
  );

  // Render Podcast Preview
  const renderPodcastPreview = () => (
    <article className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-80">
          <img src={article.thumbnail} alt={article.title} className="w-full aspect-square rounded-2xl shadow-2xl" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-2">Season {article.season} • Episode {article.episode}</div>
          <h1 className="text-foreground mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <img src={article.authorAvatar} alt={article.author} className="w-8 h-8 rounded-full" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.duration}</span>
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1" />
              </button>
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-1/3"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>15:20</span>
              <span>{article.duration}</span>
            </div>
          </div>

          {article.guests && (
            <div className="mb-6">
              <h4 className="text-foreground mb-3">Khách mời</h4>
              <div className="space-y-2">
                {article.guests.map((guest: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{guest}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div 
        className="prose prose-lg max-w-none bg-card border border-border/60 rounded-2xl p-8"
        dangerouslySetInnerHTML={{ __html: article.description }} 
      />
    </article>
  );

  // Main render function based on article type
  const renderPreview = () => {
    switch (article.type) {
      case 'news':
        return renderNewsPreview();
      case 'video':
        return renderVideoPreview();
      case 'gallery':
        return renderGalleryPreview();
      case 'legal':
        return renderLegalPreview();
      case 'job':
        return renderJobPreview();
      case 'podcast':
        return renderPodcastPreview();
      default:
        return renderNewsPreview();
    }
  };

  const selectedVersionData = versionHistory.find(v => v.version === selectedVersion);

  return (
    <div className="space-y-6 animate-in">
      {/* Floating Action Bar */}
      <div className="sticky top-0 z-10 glass-strong border-b border-border/40 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate({ page: 'articles' })}
              className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-foreground line-clamp-1">{article.title}</h2>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(article.status)}`}>
                  {article.status === 'published' ? 'Đã xuất bản' : article.status}
                </span>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded text-xs shadow-sm">
                  {getTypeLabel(article.type)}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{article.author}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate({ page: 'articles' })}
              className="flex items-center gap-2 px-4 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              <span>Hủy</span>
            </button>
            <button 
              onClick={() => {
                alert('Đã lưu bài viết dưới dạng nháp');
                // TODO: Call API to save as draft
              }}
              className="flex items-center gap-2 px-4 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Lưu nháp</span>
            </button>
            <button 
              onClick={() => onNavigate({ page: 'articles' })}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
            <button className="p-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                  onNavigate({ page: 'articles' });
                }
              }}
              className="p-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Lượt xem', value: article.views.toLocaleString(), icon: Eye, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Bình luận', value: article.comments, icon: MessageCircle, gradient: 'from-purple-500 to-pink-500' },
          { label: 'Yêu thích', value: article.likes, icon: Heart, gradient: 'from-red-500 to-rose-500' },
          { label: 'Cập nhật', value: article.updatedDate.split(' ')[0], icon: Clock, gradient: 'from-green-500 to-emerald-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group bg-card border border-border/60 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === 'preview' && (
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-8">
            {renderPreview()}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-8 space-y-8">
            <div>
              <h3 className="text-foreground mb-6">SEO & Metadata</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-foreground mb-2">Tiêu đề SEO</label>
                  <input
                    type="text"
                    defaultValue={article.title}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">60/60 ký tự</span>
                    <span className="text-sm text-green-600">✓ Tối ưu</span>
                  </div>
                </div>

                <div>
                  <label className="block text-foreground mb-2">Mô tả SEO</label>
                  <textarea
                    rows={3}
                    defaultValue="Mô tả tối ưu SEO cho bài viết..."
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Media & Assets</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                <Upload className="w-4 h-4" />
                <span>Tải lên</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {mediaAssets.images.map((image) => (
                <div key={image.id} className="group relative aspect-video bg-muted rounded-xl overflow-hidden border border-border/60 hover:shadow-xl transition-all duration-300">
                  <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Preview */}
            <div className="col-span-8">
              <div className="bg-card rounded-2xl border border-border/60 shadow-sm sticky top-24">
                <div className="p-6 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-foreground">Xem trước phiên bản {selectedVersion}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedVersionData?.user} • {selectedVersionData?.date}
                      </p>
                    </div>
                    {!selectedVersionData?.isCurrent && (
                      <button
                        onClick={() => setShowRestoreConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Khôi phục</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-8 max-h-[calc(100vh-16rem)] overflow-y-auto">
                  {selectedVersionData && renderPreview()}
                </div>
              </div>
            </div>

            {/* Right: Version List */}
            <div className="col-span-4">
              <div className="space-y-3">
                {versionHistory.map((version) => (
                  <button
                    key={version.version}
                    onClick={() => setSelectedVersion(version.version)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selectedVersion === version.version
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                        : 'border-border/60 bg-card hover:border-border hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={version.userAvatar} 
                        alt={version.user}
                        className="w-10 h-10 rounded-full ring-2 ring-background"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${selectedVersion === version.version ? 'text-blue-600' : 'text-foreground'}`}>
                            V{version.version}
                          </span>
                          {version.isCurrent && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                              Hiện tại
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-foreground mb-1">{version.user}</div>
                        <div className="text-xs text-muted-foreground mb-2">{version.date}</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{version.changes}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl animate-zoom-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-foreground">Khôi phục phiên bản {selectedVersion}?</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Bạn có chắc chắn muốn khôi phục phiên bản này? Nội dung hiện tại sẽ được lưu làm phiên bản mới.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="flex-1 px-4 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert('Đã khôi phục phiên bản ' + selectedVersion);
                  setShowRestoreConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}