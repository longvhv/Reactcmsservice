# 🌍 Hệ thống Đa ngữ (i18n) - CMS Platform

Hệ thống đa ngữ hỗ trợ 6 ngôn ngữ: Tiếng Việt, English, Español, 中文, 日本語, 한국어

## 📁 Cấu trúc File

```
/contexts
  ├── LanguageContext.tsx      # Context & Provider cho i18n
/locales
  ├── vi.ts                     # Tiếng Việt (mặc định)
  ├── en.ts                     # English
  ├── es.ts                     # Español
  ├── zh.ts                     # 中文
  ├── ja.ts                     # 日本語
  └── ko.ts                     # 한국어
/components
  ├── LanguageSwitcher.tsx      # Component chuyển đổi ngôn ngữ
  └── I18nExampleUsage.tsx      # Ví dụ sử dụng
```

## 🚀 Cách sử dụng

### 1. Trong Component

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <button>{t('common.save')}</button>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### 2. Translation Keys

Sử dụng dot notation để truy cập các key lồng nhau:

```typescript
// Common actions
t('common.save')        // Lưu / Save / Guardar / 保存 / 保存 / 저장
t('common.cancel')      // Hủy / Cancel / Cancelar / 取消 / キャンセル / 취소
t('common.delete')      // Xóa / Delete / Eliminar / 删除 / 削除 / 삭제

// Menu items
t('menu.dashboard')     // Tổng quan / Dashboard / Panel / 仪表板 / ダッシュボード / 대시보드
t('menu.articles')      // Bài viết / Articles / Artículos / 文章 / 記事 / 게시글

// Article types
t('articleTypes.news')  // Tin tức / News / Noticias / 新闻 / ニュース / 뉴스
t('articleTypes.video') // Video / Video / Video / 视频 / 動画 / 비디오

// Status
t('status.published')   // Đã xuất bản / Published / Publicado / 已发布 / 公開済み / 게시됨
t('status.draft')       // Nháp / Draft / Borrador / 草稿 / 下書き / 임시저장

// Editor
t('editor.title')       // Tiêu đề bài viết / Article Title / Título del Artículo
t('editor.content')     // Nội dung / Content / Contenido / 内容 / コンテンツ / 내용
```

### 3. Chuyển đổi Ngôn ngữ

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="vi">Tiếng Việt</option>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="zh">中文</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
    </select>
  );
}
```

Hoặc sử dụng component có sẵn:

```typescript
import { LanguageSwitcher } from './components/LanguageSwitcher';

// Dropdown variant (default)
<LanguageSwitcher />

// Sidebar variant
<LanguageSwitcher variant="sidebar" />
```

## 📝 Thêm Translation Mới

### Bước 1: Thêm vào tất cả file ngôn ngữ

Ví dụ thêm translation cho "Export PDF":

**vi.ts:**
```typescript
export default {
  common: {
    // ... existing keys
    exportPdf: 'Xuất PDF',
  },
}
```

**en.ts:**
```typescript
export default {
  common: {
    // ... existing keys
    exportPdf: 'Export PDF',
  },
}
```

**es.ts:**
```typescript
export default {
  common: {
    // ... existing keys
    exportPdf: 'Exportar PDF',
  },
}
```

**zh.ts:**
```typescript
export default {
  common: {
    // ... existing keys
    exportPdf: '导出PDF',
  },
}
```

**ja.ts:**
```typescript
export default {
  common: {
    // ... existing keys
    exportPdf: 'PDF出力',
  },
}
```

**ko.ts:**
```typescript
export default {
  common: {
    // ... existing keys
    exportPdf: 'PDF 내보내기',
  },
}
```

### Bước 2: Sử dụng trong component

```typescript
<button>{t('common.exportPdf')}</button>
```

## 🎯 Best Practices

### 1. Nhóm Keys theo Chức năng

```typescript
export default {
  // Common actions - dùng chung
  common: {
    save: '...',
    cancel: '...',
  },
  
  // Menu navigation
  menu: {
    dashboard: '...',
    articles: '...',
  },
  
  // Specific features
  articles: {
    title: '...',
    createNew: '...',
  },
}
```

### 2. Giữ Cấu trúc Nhất quán

Tất cả file ngôn ngữ phải có cùng cấu trúc key:

```typescript
// ✅ GOOD - Same structure in all files
vi.ts: { common: { save: 'Lưu' } }
en.ts: { common: { save: 'Save' } }

// ❌ BAD - Different structure
vi.ts: { common: { save: 'Lưu' } }
en.ts: { actions: { save: 'Save' } }  // Wrong!
```

### 3. Sử dụng Nested Objects cho Tổ chức Tốt hơn

```typescript
export default {
  articles: {
    columns: {
      id: 'ID',
      title: 'Title',
      author: 'Author',
    },
    actions: {
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
    },
  },
}

// Usage:
t('articles.columns.title')
t('articles.actions.create')
```

### 4. Tránh Hard-coded Text

```typescript
// ❌ BAD
<button>Save</button>
<h1>Dashboard</h1>

// ✅ GOOD
<button>{t('common.save')}</button>
<h1>{t('menu.dashboard')}</h1>
```

## 🔄 Migration từ Hard-coded Text

### Trước:
```typescript
function ArticleList() {
  return (
    <div>
      <h1>Article Management</h1>
      <button>Create New</button>
      <span>Published</span>
    </div>
  );
}
```

### Sau:
```typescript
import { useLanguage } from '../contexts/LanguageContext';

function ArticleList() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('articles.title')}</h1>
      <button>{t('articles.createNew')}</button>
      <span>{t('status.published')}</span>
    </div>
  );
}
```

## 🌟 Tính năng Nâng cao

### Lấy Ngôn ngữ Hiện tại

```typescript
const { language } = useLanguage();

// Use for conditional rendering or logic
if (language === 'vi') {
  // Vietnamese-specific logic
}
```

### Thay đổi Ngôn ngữ Programmatically

```typescript
const { setLanguage } = useLanguage();

// Change to English
setLanguage('en');

// Change to Vietnamese
setLanguage('vi');
```

### Persistence

Ngôn ngữ được lưu tự động vào `localStorage` với key `cms-language` và sẽ được restore khi reload page.

## 📊 Danh sách Translation Keys

### Common (Dùng chung)
- `common.save`, `common.cancel`, `common.delete`, `common.edit`
- `common.create`, `common.search`, `common.filter`, `common.export`
- `common.loading`, `common.saving`, `common.publishing`

### Menu
- `menu.dashboard`, `menu.articles`, `menu.categories`
- `menu.media`, `menu.moderation`, `menu.settings`

### Articles
- `articles.title`, `articles.createNew`, `articles.searchPlaceholder`
- `articles.columns.*` (id, title, type, status, author, etc.)
- `articles.viewDetail`, `articles.markFeatured`

### Editor
- `editor.title`, `editor.content`, `editor.excerpt`
- `editor.categories`, `editor.tags`, `editor.author`
- `editor.aiTools`, `editor.saveDraft`, `editor.publish`

### Status
- `status.published`, `status.draft`, `status.review`
- `status.scheduled`, `status.archived`, `status.rejected`

### Messages
- `messages.success`, `messages.error`, `messages.warning`
- `messages.saveSuccess`, `messages.publishSuccess`
- `messages.confirmDelete`, `messages.confirmPublish`

Xem file `/locales/vi.ts` để biết danh sách đầy đủ các translation keys.

## 🐛 Troubleshooting

### Translation không hiển thị

1. Kiểm tra key có tồn tại trong file ngôn ngữ không
2. Kiểm tra cấu trúc nested object đúng chưa
3. Kiểm tra component đã wrap trong `<LanguageProvider>` chưa

### Ngôn ngữ không thay đổi

1. Kiểm tra `LanguageProvider` đã wrap `App` component chưa
2. Clear localStorage và thử lại
3. Kiểm tra console có lỗi import file translation không

### File translation không load

1. Kiểm tra đường dẫn import trong `LanguageContext.tsx`
2. Kiểm tra file name chính xác: `vi.ts`, `en.ts`, etc.
3. Kiểm tra export default trong file translation

## 📞 Hỗ trợ

Nếu cần thêm ngôn ngữ mới hoặc có vấn đề, liên hệ team development.
