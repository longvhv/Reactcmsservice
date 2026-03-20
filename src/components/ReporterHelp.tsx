import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Zap,
  Shield,
  DollarSign,
  Settings,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

export function ReporterHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'getting-started',
      name: 'Bắt đầu',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      articles: [
        { title: 'Hướng dẫn sử dụng Reporter Portal', time: '5 phút đọc' },
        { title: 'Tạo bài viết đầu tiên', time: '3 phút đọc' },
        { title: 'Cách sử dụng editor nâng cao', time: '8 phút đọc' },
        { title: 'Tips viết bài thu hút người đọc', time: '10 phút đọc' },
      ]
    },
    {
      id: 'articles',
      name: 'Quản lý bài viết',
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      articles: [
        { title: 'Các loại bài viết và cách sử dụng', time: '7 phút đọc' },
        { title: 'Upload và quản lý media', time: '5 phút đọc' },
        { title: 'SEO cho bài viết', time: '12 phút đọc' },
        { title: 'Quy trình phê duyệt bài viết', time: '6 phút đọc' },
      ]
    },
    {
      id: 'royalty',
      name: 'Nhuận bút',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      articles: [
        { title: 'Cách tính nhuận bút', time: '8 phút đọc' },
        { title: 'Tăng thu nhập từ bài viết', time: '10 phút đọc' },
        { title: 'Lịch thanh toán và rút tiền', time: '5 phút đọc' },
        { title: 'Hiểu về các chỉ số performance', time: '6 phút đọc' },
      ]
    },
    {
      id: 'settings',
      name: 'Cài đặt & Bảo mật',
      icon: Shield,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      articles: [
        { title: 'Bảo mật tài khoản', time: '4 phút đọc' },
        { title: 'Cài đặt thông báo', time: '3 phút đọc' },
        { title: 'Quản lý profile', time: '5 phút đọc' },
        { title: 'Xác thực 2 yếu tố', time: '6 phút đọc' },
      ]
    },
  ];

  const faqs = [
    {
      question: 'Làm sao để bài viết được duyệt nhanh hơn?',
      answer: 'Đảm bảo bài viết có đầy đủ thông tin, hình ảnh chất lượng cao, tuân thủ guidelines, và không có lỗi chính tả. Bài viết chất lượng sẽ được ưu tiên phê duyệt.'
    },
    {
      question: 'Tôi được thanh toán nhuận bút khi nào?',
      answer: 'Nhuận bút được tính vào cuối mỗi tháng và thanh toán vào ngày 5 của tháng tiếp theo. Bạn có thể xem chi tiết trong trang "Nhuận bút".'
    },
    {
      question: 'Tôi có thể chỉnh sửa bài viết sau khi xuất bản không?',
      answer: 'Có, bạn có thể chỉnh sửa bài viết đã xuất bản bất cứ lúc nào. Tuy nhiên, những thay đổi lớn cần được phê duyệt lại.'
    },
    {
      question: 'Làm sao để tăng lượt xem cho bài viết?',
      answer: 'Sử dụng tiêu đề hấp dẫn, hình ảnh đẹp, viết nội dung chất lượng, tối ưu SEO, và chia sẻ trên mạng xã hội. Xem thêm trong phần "Tips viết bài".'
    },
    {
      question: 'Tôi có thể xóa bài viết đã xuất bản không?',
      answer: 'Bạn không thể tự xóa bài đã xuất bản. Hãy liên hệ với biên tập viên để được hỗ trợ.'
    },
  ];

  const videoTutorials = [
    {
      title: 'Giới thiệu Reporter Portal',
      duration: '5:30',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
      views: '1.2K'
    },
    {
      title: 'Tạo và xuất bản bài viết',
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop',
      views: '856'
    },
    {
      title: 'Tối ưu SEO cho bài viết',
      duration: '12:20',
      thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=225&fit=crop',
      views: '623'
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Trò chuyện trực tuyến',
      description: 'Trò chuyện trực tiếp với team support',
      action: 'Bắt đầu chat',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'support@reporterportal.com',
      action: 'Gửi email',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Phone,
      title: 'Hotline',
      description: '1900-xxxx (8:00 - 22:00)',
      action: 'Gọi ngay',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <HelpCircle className="w-8 h-8" />
            </div>
            Trung tâm trợ giúp
          </h1>
          <p className="text-slate-600">Tìm câu trả lời cho mọi thắc mắc của bạn</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm câu hỏi, hướng dẫn..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Danh mục hướng dẫn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all overflow-hidden text-left ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                  <div className="p-6">
                    <div className={`p-3 rounded-xl ${category.bgColor} w-fit mb-3`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-slate-600">{category.articles.length} bài viết</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Articles */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <div className="space-y-3">
                {categories.find(c => c.id === selectedCategory)?.articles.map((article, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Tutorials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-600" />
              Video hướng dẫn
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Eye className="w-4 h-4" />
                    {video.views} lượt xem
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Câu hỏi thường gặp</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-200">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="p-6 cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 group-open:text-blue-600 transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Vẫn cần hỗ trợ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${option.color}`} />
                  <div className="p-6 text-center">
                    <div className={`p-4 rounded-xl ${option.bgColor} w-fit mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-slate-700" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{option.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{option.description}</p>
                    <button className={`w-full px-4 py-2.5 bg-gradient-to-r ${option.color} text-white rounded-xl hover:shadow-lg transition-all font-medium`}>
                      {option.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}