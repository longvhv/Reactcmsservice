import { useState } from 'react';
import { 
  Star, Sparkles, Heart, Award, TrendingUp, Users, 
  MessageCircle, Mail, Phone, MapPin, Check, X,
  ChevronRight, ChevronLeft
} from 'lucide-react';

/**
 * ElementLibraryShowcase - Demo component showing Element Library use cases
 * 
 * This component demonstrates how Element Library can be used to create
 * professional infographic sections quickly without starting from scratch.
 */

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  usedElements: string[];
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'stats-card',
    title: 'Thẻ thống kê',
    description: 'Huy hiệu tròn + Văn bản + Biểu tượng để hiển thị số liệu chính',
    usedElements: ['Huy hiệu tròn', 'Văn bản', 'Biểu tượng sao'],
    preview: (
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white overflow-hidden">
        {/* Trang trí nền */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
        
        {/* Huy hiệu tròn */}
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3">
            <TrendingUp className="w-8 h-8" />
          </div>
          
          {/* Stats */}
          <div className="text-4xl font-bold mb-1">95%</div>
          <div className="text-sm text-blue-100">Sự hài lòng khách hàng</div>
          
          {/* Star decoration */}
          <div className="absolute top-2 right-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'social-banner',
    title: 'Banner mạng xã hội',
    description: 'Dải phân cách sóng + Biểu tượng MXH + Văn bản cho header',
    usedElements: ['Dải phân cách sóng', 'Biểu tượng MXH', 'Văn bản'],
    preview: (
      <div className="relative w-full h-48 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <Sparkles className="w-12 h-12 mb-3 animate-pulse" />
          <h3 className="text-2xl font-bold mb-3">Theo dõi chúng tôi</h3>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <Mail className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <Phone className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        {/* Dải sóng bên dưới */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,60 Q300,10 600,60 T1200,60 L1200,120 L0,120 Z" 
            fill="white" 
            opacity="0.2"
          />
        </svg>
      </div>
    )
  },
  {
    id: 'feature-highlight',
    title: 'Nổi bật tính năng',
    description: 'Huy hiệu lá chắn + Ribbon góc + Biểu tượng cho tính năng sản phẩm',
    usedElements: ['Huy hiệu lá chắn', 'Ribbon góc', 'Biểu tượng tích'],
    preview: (
      <div className="relative w-full h-48 bg-white border-2 border-gray-200 rounded-2xl p-6 overflow-hidden">
        {/* Ribbon góc */}
        <div className="absolute -top-1 -right-1 w-20 h-20">
          <div className="absolute transform rotate-45 bg-red-500 text-white text-xs font-bold py-1 right-[-35px] top-[17px] w-[120px] text-center shadow-md">
            MỚI
          </div>
        </div>
        
        {/* Huy hiệu lá chắn */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Tính năng cao cấp</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                Phân tích nâng cao
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                Hỗ trợ ưu tiên
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'contact-card',
    title: 'Thông tin liên hệ',
    description: 'Biểu tượng + Phần tử trang trí + Văn bản cho mục liên hệ',
    usedElements: ['Biểu tượng thư', 'Biểu tượng ĐT', 'Ghim bản đồ', 'Vòng trang trí'],
    preview: (
      <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
        <div className="relative inline-block mb-4">
          <h4 className="text-xl font-bold text-gray-900">Liên hệ với chúng tôi</h4>
          {/* Hand-drawn underline effect */}
          <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 10">
            <path 
              d="M 5,5 Q 25,3 50,5 T 95,5" 
              stroke="#f59e0b" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-700">hello@company.com</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-700">+1 (555) 123-4567</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-700">San Francisco, CA</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'team-section',
    title: 'Mục đội ngũ',
    description: 'Khung Polaroid + Hình trang trí cho thẻ thành viên',
    usedElements: ['Khung Polaroid', 'Ngôi sao', 'Văn bản'],
    preview: (
      <div className="w-full h-48 bg-white rounded-2xl p-4">
        <div className="grid grid-cols-3 gap-3 h-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <div className="bg-white border-4 border-gray-200 rounded-lg p-2 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-full aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded mb-2" />
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-900">Đội {i}</div>
                  <div className="text-[10px] text-gray-500">Thiết kế</div>
                </div>
              </div>
              
              {/* Burst star decoration */}
              {i === 2 && (
                <div className="absolute -top-2 -right-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'pricing-tag',
    title: 'Hiển thị giá',
    description: 'Thẻ giá + Ribbon + Văn bản cho khuyến mại',
    usedElements: ['Thẻ giá', 'Banner Ribbon', 'Văn bản'],
    preview: (
      <div className="relative w-full h-48 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 flex items-center justify-center text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        
        {/* Ribbon banner */}
        <div className="absolute top-6 -left-2 bg-yellow-400 text-yellow-900 px-4 py-1 text-xs font-bold shadow-lg transform -rotate-3">
          ƯU ĐÃI CÓ HẠN
        </div>
        
        {/* Price tag */}
        <div className="relative z-10 text-center">
          <div className="text-sm mb-2 text-pink-100">Giá đặc biệt</div>
          <div className="flex items-start justify-center mb-2">
            <span className="text-3xl font-bold">$</span>
            <span className="text-6xl font-bold">29</span>
            <span className="text-2xl font-bold mt-2">.99</span>
          </div>
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
            Tiết kiệm 40% hôm nay!
          </div>
        </div>
      </div>
    )
  }
];

export function ElementLibraryShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const currentItem = showcaseItems[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Trình bày Thư viện phần tử</h2>
          </div>
          <p className="text-sm text-purple-100">
            Khám phá các mẫu thiết kế có sẵn sử dụng Thư viện phần tử
          </p>
        </div>

        {/* Preview */}
        <div className="p-8 bg-muted/20">
          <div className="mb-6">
            {currentItem.preview}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 border-t border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{currentItem.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {currentItem.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {currentItem.usedElements.map((element, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    <Star className="w-3 h-3" />
                    {element}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {showcaseItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'bg-purple-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 p-4 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>{showcaseItems.length}</strong> trường hợp sử dụng • 
            <strong> 50+</strong> phần tử có sẵn • 
            <strong> 10</strong> danh mục
          </p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="text-sm font-semibold mb-1">Bắt đầu nhanh</h4>
          <p className="text-xs text-muted-foreground">
            Nhấn tab ⭐ Phần tử để duyệt thư viện
          </p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="text-sm font-semibold mb-1">Tùy chỉnh</h4>
          <p className="text-xs text-muted-foreground">
            Đổi màu, thay đổi kích thước, thêm hiệu ứng
          </p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <h4 className="text-sm font-semibold mb-1">Kết hợp</h4>
          <p className="text-xs text-muted-foreground">
            Trộn các phần tử để tạo thiết kế độc đáo
          </p>
        </div>
      </div>
    </div>
  );
}

export default ElementLibraryShowcase;