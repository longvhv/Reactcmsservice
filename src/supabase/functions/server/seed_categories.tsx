import * as kv from "./kv_store.tsx";

export async function seedCategories() {
  console.log('Seeding categories...');
  
  const categories = [
    // NEWS CATEGORIES
    {
      id: 1,
      name: 'Tin tức',
      slug: 'tin-tuc',
      parent: null,
      articleTypes: ['news'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 2,
      name: 'Thời sự',
      slug: 'thoi-su',
      parent: 1,
      articleTypes: ['news'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 3,
      name: 'Kinh tế',
      slug: 'kinh-te',
      parent: 1,
      articleTypes: ['news'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    {
      id: 4,
      name: 'Văn hóa',
      slug: 'van-hoa',
      parent: 1,
      articleTypes: ['news'],
      active: true,
      order: 3,
      articleCount: 0,
    },
    {
      id: 5,
      name: 'Thể thao',
      slug: 'the-thao',
      parent: 1,
      articleTypes: ['news'],
      active: true,
      order: 4,
      articleCount: 0,
    },
    
    // VIDEO CATEGORIES
    {
      id: 10,
      name: 'Video',
      slug: 'video',
      parent: null,
      articleTypes: ['video'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    {
      id: 11,
      name: 'Phóng sự',
      slug: 'phong-su',
      parent: 10,
      articleTypes: ['video'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 12,
      name: 'Talkshow',
      slug: 'talkshow',
      parent: 10,
      articleTypes: ['video'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    
    // GALLERY CATEGORIES
    {
      id: 20,
      name: 'Thư viện ảnh',
      slug: 'thu-vien-anh',
      parent: null,
      articleTypes: ['gallery'],
      active: true,
      order: 3,
      articleCount: 0,
    },
    {
      id: 21,
      name: 'Sự kiện',
      slug: 'su-kien-anh',
      parent: 20,
      articleTypes: ['gallery'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 22,
      name: 'Du lịch',
      slug: 'du-lich-anh',
      parent: 20,
      articleTypes: ['gallery'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    
    // LEGAL CATEGORIES
    {
      id: 30,
      name: 'Văn bản pháp luật',
      slug: 'van-ban-phap-luat',
      parent: null,
      articleTypes: ['legal'],
      active: true,
      order: 4,
      articleCount: 0,
    },
    {
      id: 31,
      name: 'Luật lao động',
      slug: 'luat-lao-dong',
      parent: 30,
      articleTypes: ['legal'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 32,
      name: 'Luật dân sự',
      slug: 'luat-dan-su',
      parent: 30,
      articleTypes: ['legal'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    
    // JOB CATEGORIES
    {
      id: 40,
      name: 'Tuyển dụng',
      slug: 'tuyen-dung',
      parent: null,
      articleTypes: ['job'],
      active: true,
      order: 5,
      articleCount: 0,
    },
    {
      id: 41,
      name: 'IT & Technology',
      slug: 'it-technology',
      parent: 40,
      articleTypes: ['job'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 42,
      name: 'Marketing & Sales',
      slug: 'marketing-sales',
      parent: 40,
      articleTypes: ['job'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    
    // PODCAST CATEGORIES
    {
      id: 50,
      name: 'Podcast',
      slug: 'podcast',
      parent: null,
      articleTypes: ['podcast'],
      active: true,
      order: 6,
      articleCount: 0,
    },
    {
      id: 51,
      name: 'Chuyện buổi sáng',
      slug: 'chuyen-buoi-sang',
      parent: 50,
      articleTypes: ['podcast'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 52,
      name: 'Khởi nghiệp',
      slug: 'khoi-nghiep',
      parent: 50,
      articleTypes: ['podcast'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    
    // EVENT CATEGORIES
    {
      id: 60,
      name: 'Sự kiện',
      slug: 'su-kien',
      parent: null,
      articleTypes: ['event'],
      active: true,
      order: 7,
      articleCount: 0,
    },
    {
      id: 61,
      name: 'Hội thảo',
      slug: 'hoi-thao',
      parent: 60,
      articleTypes: ['event'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    {
      id: 62,
      name: 'Triển lãm',
      slug: 'trien-lam',
      parent: 60,
      articleTypes: ['event'],
      active: true,
      order: 2,
      articleCount: 0,
    },
    
    // STAFF CATEGORIES
    {
      id: 70,
      name: 'Nhân sự',
      slug: 'nhan-su',
      parent: null,
      articleTypes: ['staff'],
      active: true,
      order: 8,
      articleCount: 0,
    },
    {
      id: 71,
      name: 'Ban lãnh đạo',
      slug: 'ban-lanh-dao',
      parent: 70,
      articleTypes: ['staff'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    
    // DOWNLOAD CATEGORIES
    {
      id: 80,
      name: 'Tải xuống',
      slug: 'tai-xuong',
      parent: null,
      articleTypes: ['download'],
      active: true,
      order: 9,
      articleCount: 0,
    },
    {
      id: 81,
      name: 'Tài liệu',
      slug: 'tai-lieu',
      parent: 80,
      articleTypes: ['download'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    
    // INFOGRAPHIC CATEGORIES
    {
      id: 90,
      name: 'Infographic',
      slug: 'infographic',
      parent: null,
      articleTypes: ['infographic'],
      active: true,
      order: 10,
      articleCount: 0,
    },
    {
      id: 91,
      name: 'Thống kê',
      slug: 'thong-ke',
      parent: 90,
      articleTypes: ['infographic'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    
    // BLOG CATEGORIES
    {
      id: 100,
      name: 'Blog',
      slug: 'blog',
      parent: null,
      articleTypes: ['blog'],
      active: true,
      order: 11,
      articleCount: 0,
    },
    {
      id: 101,
      name: 'Góc nhìn',
      slug: 'goc-nhin',
      parent: 100,
      articleTypes: ['blog'],
      active: true,
      order: 1,
      articleCount: 0,
    },
    
    // PAGE CATEGORIES
    {
      id: 110,
      name: 'Trang',
      slug: 'trang',
      parent: null,
      articleTypes: ['page'],
      active: true,
      order: 12,
      articleCount: 0,
    },
    
    // FAQ CATEGORIES
    {
      id: 120,
      name: 'Hỏi đáp',
      slug: 'hoi-dap',
      parent: null,
      articleTypes: ['faq'],
      active: true,
      order: 13,
      articleCount: 0,
    },
    
    // TESTIMONIAL CATEGORIES
    {
      id: 130,
      name: 'Đánh giá',
      slug: 'danh-gia',
      parent: null,
      articleTypes: ['testimonial'],
      active: true,
      order: 14,
      articleCount: 0,
    },
    
    // PORTFOLIO CATEGORIES
    {
      id: 140,
      name: 'Portfolio',
      slug: 'portfolio',
      parent: null,
      articleTypes: ['portfolio'],
      active: true,
      order: 15,
      articleCount: 0,
    },
  ];

  // Save all categories to KV store
  for (const category of categories) {
    await kv.set(`category:${category.id}`, category);
  }

  console.log(`✅ Seeded ${categories.length} categories successfully`);
}
