// 📰 News Article Templates for Vietnamese News Sites

export interface NewsTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  title: string;
  excerpt: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  estimatedTime: string;
}

export const newsTemplates: NewsTemplate[] = [
  // 🔴 TIN NÓNG
  {
    id: 'breaking',
    name: 'Tin nóng (Breaking News)',
    category: 'Tin nóng',
    icon: '🔴',
    color: 'red',
    description: 'Tin tức khẩn cấp với cập nhật liên tục',
    difficulty: 'easy',
    estimatedTime: '5-10 phút',
    title: '[BREAKING] ',
    excerpt: 'Tin nóng: ',
    content: `<h2>⚡ Diễn biến mới nhất</h2>
<p><em>(Cập nhật: [Thời gian])</em></p>
<p>Thông tin chi tiết về sự kiện đang diễn ra...</p>

<h2>📍 Tình hình hiện tại</h2>
<p>Mô tả tình hình tại hiện trường...</p>

<h2>📊 Phân tích</h2>
<p>Ý kiến chuyên gia và đánh giá tác động...</p>

<h2>🔄 Cập nhật liên tục</h2>
<p>Chúng tôi sẽ tiếp tục cập nhật thông tin mới nhất...</p>`,
  },
  
  {
    id: 'liveblog',
    name: 'Sự kiện trực tiếp (Live Blog)',
    category: 'Tin nóng',
    icon: '🎬',
    color: 'red',
    description: 'Cập nhật theo thời gian thực',
    difficulty: 'medium',
    estimatedTime: '30-60 phút',
    title: '[TRỰC TIẾP] ',
    excerpt: 'Cập nhật trực tiếp sự kiện ',
    content: `<h2>⚡ Cập nhật mới nhất</h2>
<p><em>Cập nhật lúc: [Thời gian]</em></p>
<p>Thông tin mới nhất về sự kiện...</p>

<hr>

<h2>🕐 [Thời gian] - Diễn biến</h2>
<p>Mô tả diễn biến tại thời điểm này...</p>

<hr>

<h2>🕑 [Thời gian] - Diễn biến</h2>
<p>Mô tả diễn biến tại thời điểm này...</p>

<hr>

<h2>📋 Tóm tắt ban đầu</h2>
<p>Thông tin ban đầu về sự kiện...</p>

<p><em>Chúng tôi sẽ tiếp tục cập nhật...</em></p>`,
  },

  // 🏛️ THỜI SỰ - CHÍNH TRỊ
  {
    id: 'politics',
    name: 'Thời sự - Chính trị',
    category: 'Thời sự',
    icon: '🏛️',
    color: 'blue',
    description: 'Tin chính trị, quốc hội, chính phủ',
    difficulty: 'medium',
    estimatedTime: '15-20 phút',
    title: '',
    excerpt: 'Thông tin quan trọng về ',
    content: `<h2>🎯 Điểm nhấn chính</h2>
<p>Những nội dung quan trọng nhất của sự kiện...</p>

<h2>📋 Diễn biến chi tiết</h2>
<p>Mô tả chi tiết về diễn biến sự kiện...</p>

<h2>💬 Phát biểu nổi bật</h2>
<blockquote>
<p>"Trích dẫn phát biểu quan trọng..."</p>
<footer>— [Người phát biểu], [Chức vụ]</footer>
</blockquote>

<h2>🔍 Ý nghĩa và tác động</h2>
<p>Phân tích ý nghĩa và tác động của sự kiện...</p>`,
  },

  // 💰 KINH TẾ - TÀI CHÍNH
  {
    id: 'economy',
    name: 'Kinh tế - Tài chính',
    category: 'Kinh tế',
    icon: '💰',
    color: 'green',
    description: 'Tin thị trường, chứng khoán, doanh nghiệp',
    difficulty: 'medium',
    estimatedTime: '15-25 phút',
    title: '',
    excerpt: 'Phân tích về ',
    content: `<h2>📊 Số liệu chính</h2>
<ul>
<li><strong>Chỉ số 1:</strong> [Giá trị]</li>
<li><strong>Chỉ số 2:</strong> [Giá trị]</li>
<li><strong>Chỉ số 3:</strong> [Giá trị]</li>
</ul>

<h2>📈 Xu hướng thị trường</h2>
<p>Phân tích xu hướng và biến động...</p>

<h2>💡 Nhận định chuyên gia</h2>
<p>Ý kiến từ các chuyên gia kinh tế...</p>

<h2>🎯 Dự báo</h2>
<p>Dự báo cho giai đoạn tới...</p>`,
  },

  {
    id: 'dataanalysis',
    name: 'Phân tích số liệu',
    category: 'Kinh tế',
    icon: '📊',
    color: 'green',
    description: 'Phân tích chuyên sâu với biểu đồ, số liệu',
    difficulty: 'advanced',
    estimatedTime: '30-45 phút',
    title: '',
    excerpt: 'Phân tích số liệu về ',
    content: `<h2>📊 Tổng quan dữ liệu</h2>
<p>Giới thiệu về nguồn dữ liệu và phương pháp phân tích...</p>

<h2>📈 Các chỉ số chính</h2>
<table>
<tr><th>Chỉ số</th><th>Giá trị</th><th>Thay đổi</th></tr>
<tr><td>Chỉ số 1</td><td>[Giá trị]</td><td>+X%</td></tr>
<tr><td>Chỉ số 2</td><td>[Giá trị]</td><td>-Y%</td></tr>
</table>

<h2>🔍 Phân tích chi tiết</h2>
<p>Phân tích sâu về các số liệu...</p>

<h2>💡 Nhận định</h2>
<p>Đánh giá và dự báo từ chuyên gia...</p>

<h2>📎 Nguồn dữ liệu</h2>
<p>Trích dẫn nguồn và phương pháp thu thập...</p>`,
  },

  // ⚖️ PHÁP LUẬT
  {
    id: 'legal',
    name: 'Pháp luật - An ninh',
    category: 'Pháp luật',
    icon: '⚖️',
    color: 'slate',
    description: 'Tin pháp luật, tòa án, công an',
    difficulty: 'medium',
    estimatedTime: '15-20 phút',
    title: '',
    excerpt: 'Thông tin pháp luật về ',
    content: `<h2>📜 Nội dung chính</h2>
<p>Tóm tắt nội dung chính của vụ việc/văn bản...</p>

<h2>⚖️ Căn cứ pháp lý</h2>
<ul>
<li>[Luật/Nghị định/Thông tư liên quan]</li>
<li>[Điều khoản cụ thể]</li>
</ul>

<h2>🔍 Phân tích</h2>
<p>Phân tích pháp lý từ luật sư/chuyên gia...</p>

<h2>⏰ Thời hạn có hiệu lực</h2>
<p>Thông tin về thời gian áp dụng...</p>`,
  },

  {
    id: 'investigation',
    name: 'Điều tra chuyên sâu',
    category: 'Pháp luật',
    icon: '🔍',
    color: 'slate',
    description: 'Bài điều tra, phóng sự chuyên sâu',
    difficulty: 'advanced',
    estimatedTime: '60-90 phút',
    title: '',
    excerpt: 'Điều tra: ',
    content: `<h2>🎯 Vấn đề đặt ra</h2>
<p>Mô tả vấn đề cần điều tra...</p>

<h2>🔍 Quá trình điều tra</h2>
<p>Phương pháp và quá trình tìm hiểu...</p>

<h2>📊 Phát hiện</h2>
<h3>Phát hiện 1</h3>
<p>Chi tiết về phát hiện...</p>

<h3>Phát hiện 2</h3>
<p>Chi tiết về phát hiện...</p>

<h2>💬 Lời khai/Phỏng vấn</h2>
<blockquote>
<p>"Lời khai từ nguồn tin..."</p>
</blockquote>

<h2>📝 Kết luận</h2>
<p>Kết luận từ cuộc điều tra...</p>

<h2>📎 Tài liệu tham khảo</h2>
<p>Nguồn tài liệu và bằng chứng...</p>`,
  },

  // 🏥 Y TẾ - SỨC KHỎE
  {
    id: 'health',
    name: 'Y tế - Sức khỏe',
    category: 'Đời sống',
    icon: '🏥',
    color: 'teal',
    description: 'Tin y tế, bệnh tật, sức khỏe',
    difficulty: 'medium',
    estimatedTime: '15-20 phút',
    title: '',
    excerpt: 'Thông tin sức khỏe về ',
    content: `<h2>⚕️ Tổng quan</h2>
<p>Giới thiệu chung về vấn đề sức khỏe...</p>

<h2>🔬 Triệu chứng</h2>
<ul>
<li>Triệu chứng 1</li>
<li>Triệu chứng 2</li>
<li>Triệu chứng 3</li>
</ul>

<h2>💊 Điều trị</h2>
<p>Các phương pháp điều trị và phòng ngừa...</p>

<h2>⚠️ Lưu ý</h2>
<p><em>Thông tin chỉ mang tính tham khảo. Vui lòng tham khảo ý kiến bác sĩ.</em></p>`,
  },

  // 🎓 GIÁO DỤC
  {
    id: 'education',
    name: 'Giáo dục - Đào tạo',
    category: 'Đời sống',
    icon: '🎓',
    color: 'purple',
    description: 'Tin tuyển sinh, kỳ thi, chính sách giáo dục',
    difficulty: 'easy',
    estimatedTime: '10-15 phút',
    title: '',
    excerpt: 'Thông tin giáo dục về ',
    content: `<h2>📚 Thông tin chính</h2>
<p>Nội dung chính của thông báo/chính sách giáo dục...</p>

<h2>📅 Thời gian</h2>
<p>Lịch trình và thời gian thực hiện...</p>

<h2>🎯 Đối tượng áp dụng</h2>
<ul>
<li>Đối tượng 1</li>
<li>Đối tượng 2</li>
</ul>

<h2>📝 Hướng dẫn</h2>
<p>Các bước thực hiện chi tiết...</p>

<h2>❓ Câu hỏi thường gặp</h2>
<p><strong>Q:</strong> Câu hỏi?</p>
<p><strong>A:</strong> Trả lời...</p>`,
  },

  // ⚽ THỂ THAO
  {
    id: 'sports',
    name: 'Tin thể thao',
    category: 'Thể thao',
    icon: '⚽',
    color: 'orange',
    description: 'Tin bóng đá, thể thao, kết quả thi đấu',
    difficulty: 'easy',
    estimatedTime: '10-15 phút',
    title: '',
    excerpt: 'Tin thể thao: ',
    content: `<h2>🏆 Kết quả</h2>
<p><strong>[Đội A]</strong> [Tỷ số] <strong>[Đội B]</strong></p>

<h2>⚡ Diễn biến trận đấu</h2>
<p><strong>Hiệp 1:</strong> Mô tả diễn biến...</p>
<p><strong>Hiệp 2:</strong> Mô tả diễn biến...</p>

<h2>⭐ Điểm nhấn</h2>
<ul>
<li>Điểm nhấn 1</li>
<li>Điểm nhấn 2</li>
</ul>

<h2>💬 Phản ứng</h2>
<blockquote>
<p>"Phát biểu của HLV/Cầu thủ..."</p>
</blockquote>

<h2>📊 Thống kê</h2>
<p>Các chỉ số thống kê quan trọng...</p>`,
  },

  // 🎬 GIẢI TRÍ
  {
    id: 'entertainment',
    name: 'Văn hóa - Giải trí',
    category: 'Giải trí',
    icon: '🎬',
    color: 'pink',
    description: 'Tin showbiz, phim ảnh, âm nhạc',
    difficulty: 'easy',
    estimatedTime: '10-15 phút',
    title: '',
    excerpt: 'Tin giải trí: ',
    content: `<h2>✨ Điểm nhấn</h2>
<p>Thông tin chính về sự kiện/nghệ sĩ...</p>

<h2>🎭 Chi tiết</h2>
<p>Mô tả chi tiết về sự kiện, tác phẩm...</p>

<h2>💬 Chia sẻ</h2>
<blockquote>
<p>"Chia sẻ từ nghệ sĩ..."</p>
</blockquote>

<h2>📸 Hình ảnh đáng chú ý</h2>
<p><em>[Mô tả hình ảnh]</em></p>

<h2>👥 Phản ứng khán giả</h2>
<p>Phản ứng từ người hâm mộ và công chúng...</p>`,
  },

  {
    id: 'profile',
    name: 'Chân dung nhân vật',
    category: 'Giải trí',
    icon: '👤',
    color: 'pink',
    description: 'Profile người nổi tiếng, nhân vật',
    difficulty: 'medium',
    estimatedTime: '20-30 phút',
    title: '',
    excerpt: 'Chân dung ',
    content: `<h2>👤 Tiểu sử</h2>
<p><strong>Họ và tên:</strong> [Tên đầy đủ]</p>
<p><strong>Năm sinh:</strong> [Năm]</p>
<p><strong>Quê quán:</strong> [Địa điểm]</p>
<p><strong>Nghề nghiệp:</strong> [Nghề nghiệp]</p>

<h2>🎓 Học vấn và Sự nghiệp</h2>
<p>Quá trình học tập và phát triển sự nghiệp...</p>

<h2>🏆 Thành tựu nổi bật</h2>
<ul>
<li>Thành tựu 1</li>
<li>Thành tựu 2</li>
</ul>

<h2>💭 Triết lý sống</h2>
<blockquote>
<p>"Câu nói/Triết lý đáng nhớ..."</p>
</blockquote>

<h2>📖 Câu chuyện đáng nhớ</h2>
<p>Những câu chuyện, kỷ niệm đặc biệt...</p>`,
  },

  // 🌍 DU LỊCH
  {
    id: 'travel',
    name: 'Du lịch',
    category: 'Du lịch',
    icon: '🌍',
    color: 'cyan',
    description: 'Điểm đến, kinh nghiệm du lịch',
    difficulty: 'medium',
    estimatedTime: '20-30 phút',
    title: '',
    excerpt: 'Khám phá ',
    content: `<h2>📍 Tổng quan điểm đến</h2>
<p>Giới thiệu chung về địa điểm...</p>

<h2>🎯 Điểm tham quan nổi bật</h2>
<h3>1. [Địa điểm 1]</h3>
<p>Mô tả và thông tin...</p>

<h3>2. [Địa điểm 2]</h3>
<p>Mô tả và thông tin...</p>

<h2>🍜 Ẩm thực đặc sản</h2>
<ul>
<li>Món ăn 1</li>
<li>Món ăn 2</li>
</ul>

<h2>💰 Chi phí tham khảo</h2>
<p>Ước tính chi phí cho chuyến đi...</p>

<h2>📝 Lưu ý khi đi</h2>
<ul>
<li>Lưu ý 1</li>
<li>Lưu ý 2</li>
</ul>`,
  },

  // 🍳 ẨM THỰC
  {
    id: 'food',
    name: 'Ẩm thực - Món ngon',
    category: 'Du lịch',
    icon: '🍳',
    color: 'amber',
    description: 'Công thức nấu ăn, địa chỉ ăn uống',
    difficulty: 'easy',
    estimatedTime: '15-20 phút',
    title: '',
    excerpt: 'Khám phá món ăn ',
    content: `<h2>🍽️ Giới thiệu</h2>
<p>Nguồn gốc và đặc điểm của món ăn...</p>

<h2>🥘 Nguyên liệu</h2>
<ul>
<li>[Số lượng] [Nguyên liệu 1]</li>
<li>[Số lượng] [Nguyên liệu 2]</li>
<li>[Số lượng] [Nguyên liệu 3]</li>
</ul>

<h2>👨‍🍳 Cách làm</h2>
<p><strong>Bước 1:</strong> Chuẩn bị nguyên liệu...</p>
<p><strong>Bước 2:</strong> Sơ chế...</p>
<p><strong>Bước 3:</strong> Chế biến...</p>
<p><strong>Bước 4:</strong> Hoàn thiện và trình bày...</p>

<h2>💡 Mẹo hay</h2>
<p>Các mẹo để món ăn ngon hơn...</p>`,
  },

  // 🏠 BẤT ĐỘNG SẢN
  {
    id: 'realestate',
    name: 'Bất động sản',
    category: 'Kinh tế',
    icon: '🏠',
    color: 'emerald',
    description: 'Tin thị trường BĐS, dự án mới',
    difficulty: 'medium',
    estimatedTime: '15-25 phút',
    title: '',
    excerpt: 'Thông tin bất động sản: ',
    content: `<h2>🏢 Tổng quan dự án/Khu vực</h2>
<p>Giới thiệu chung về dự án hoặc thị trường...</p>

<h2>📍 Vị trí</h2>
<p>Địa chỉ và tiện ích xung quanh...</p>

<h2>📊 Thông số kỹ thuật</h2>
<ul>
<li><strong>Diện tích:</strong> [m²]</li>
<li><strong>Giá:</strong> [VNĐ/m²]</li>
<li><strong>Pháp lý:</strong> [Sổ đỏ/Hợp đồng]</li>
</ul>

<h2>🌟 Ưu điểm nổi bật</h2>
<ul>
<li>Ưu điểm 1</li>
<li>Ưu điểm 2</li>
</ul>

<h2>💰 Chính sách bán hàng</h2>
<p>Thông tin về thanh toán, ưu đãi...</p>`,
  },

  // 🎤 PHỎNG VẤN
  {
    id: 'interview',
    name: 'Phỏng vấn Q&A',
    category: 'Chuyên mục',
    icon: '🎤',
    color: 'indigo',
    description: 'Phỏng vấn với format câu hỏi - trả lời',
    difficulty: 'easy',
    estimatedTime: '15-20 phút',
    title: 'Phỏng vấn: ',
    excerpt: 'Cuộc trò chuyện với ',
    content: `<h2>👤 Giới thiệu</h2>
<p>Giới thiệu về người được phỏng vấn...</p>

<h2>💬 Cuộc trò chuyện</h2>
<p><strong>Q:</strong> Câu hỏi đầu tiên?</p>
<p><strong>A:</strong> Câu trả lời chi tiết...</p>

<p><strong>Q:</strong> Câu hỏi thứ hai?</p>
<p><strong>A:</strong> Câu trả lời chi tiết...</p>

<p><strong>Q:</strong> Câu hỏi cuối cùng?</p>
<p><strong>A:</strong> Câu trả lời chi tiết...</p>

<h2>✨ Ấn tượng</h2>
<p>Ấn tượng của phóng viên về cuộc trò chuyện...</p>`,
  },

  // ⭐ REVIEW
  {
    id: 'review',
    name: 'Review/Đánh giá',
    category: 'Chuyên mục',
    icon: '⭐',
    color: 'yellow',
    description: 'Đánh giá sản phẩm, dịch vụ',
    difficulty: 'medium',
    estimatedTime: '20-30 phút',
    title: 'Đánh giá: ',
    excerpt: 'Review chi tiết về ',
    content: `<h2>📋 Thông tin cơ bản</h2>
<p>Giới thiệu về sản phẩm/dịch vụ được đánh giá...</p>

<h2>⭐ Điểm đánh giá</h2>
<ul>
<li><strong>Chất lượng:</strong> ⭐⭐⭐⭐⭐</li>
<li><strong>Giá cả:</strong> ⭐⭐⭐⭐</li>
<li><strong>Dịch vụ:</strong> ⭐⭐⭐⭐⭐</li>
</ul>

<h2>✅ Ưu điểm</h2>
<ul>
<li>Điểm mạnh 1</li>
<li>Điểm mạnh 2</li>
<li>Điểm mạnh 3</li>
</ul>

<h2>❌ Nhược điểm</h2>
<ul>
<li>Điểm yếu 1</li>
<li>Điểm yếu 2</li>
</ul>

<h2>🎯 Kết luận</h2>
<p><strong>Đánh giá tổng thể:</strong> [X/10 điểm]</p>
<p>Nhận xét cuối cùng và khuyến nghị...</p>`,
  },

  // 📚 HƯỚNG DẪN
  {
    id: 'howto',
    name: 'Hướng dẫn từng bước',
    category: 'Chuyên mục',
    icon: '📚',
    color: 'violet',
    description: 'Tutorial, how-to guide chi tiết',
    difficulty: 'easy',
    estimatedTime: '15-25 phút',
    title: 'Hướng dẫn: ',
    excerpt: 'Cách ',
    content: `<h2>🎯 Tổng quan</h2>
<p>Giới thiệu về những gì bạn sẽ học được...</p>

<h2>📝 Chuẩn bị</h2>
<ul>
<li>Công cụ/Vật liệu 1</li>
<li>Công cụ/Vật liệu 2</li>
<li>Công cụ/Vật liệu 3</li>
</ul>

<h2>📖 Các bước thực hiện</h2>
<h3>Bước 1: [Tiêu đề]</h3>
<p>Mô tả chi tiết bước 1...</p>

<h3>Bước 2: [Tiêu đề]</h3>
<p>Mô tả chi tiết bước 2...</p>

<h3>Bước 3: [Tiêu đề]</h3>
<p>Mô tả chi tiết bước 3...</p>

<h2>💡 Mẹo và lưu ý</h2>
<ul>
<li>Mẹo 1</li>
<li>Mẹo 2</li>
</ul>

<h2>⚠️ Lỗi thường gặp</h2>
<p>Những lỗi cần tránh và cách khắc phục...</p>`,
  },

  // 📝 LISTICLE
  {
    id: 'listicle',
    name: 'Listicle/Top List',
    category: 'Chuyên mục',
    icon: '📝',
    color: 'rose',
    description: 'Danh sách Top 10, Top 5...',
    difficulty: 'easy',
    estimatedTime: '15-20 phút',
    title: 'Top ',
    excerpt: 'Danh sách những ',
    content: `<h2>📌 Giới thiệu</h2>
<p>Tại sao danh sách này quan trọng và hữu ích...</p>

<h2>1️⃣ [Mục đầu tiên]</h2>
<p>Mô tả chi tiết về mục này...</p>
<p><strong>Điểm nổi bật:</strong> Điểm đặc biệt...</p>

<h2>2️⃣ [Mục thứ hai]</h2>
<p>Mô tả chi tiết về mục này...</p>
<p><strong>Điểm nổi bật:</strong> Điểm đặc biệt...</p>

<h2>3️⃣ [Mục thứ ba]</h2>
<p>Mô tả chi tiết về mục này...</p>
<p><strong>Điểm nổi bật:</strong> Điểm đặc biệt...</p>

<p><em>[Tiếp tục cho các mục còn lại...]</em></p>

<h2>🎯 Kết luận</h2>
<p>Tổng kết và khuyến nghị...</p>`,
  },
];

// Helper function to get templates by category
export const getTemplatesByCategory = (category: string) => {
  return newsTemplates.filter(t => t.category === category);
};

// Get all categories
export const getCategories = () => {
  const categories = [...new Set(newsTemplates.map(t => t.category))];
  return categories;
};

// Get template by ID
export const getTemplateById = (id: string) => {
  return newsTemplates.find(t => t.id === id);
};
