# 🚀 Code Optimization Guide

Hướng dẫn tối ưu hóa codebase CMS để dễ phát triển và bảo trì.

## 📋 Table of Contents

1. [Tổng quan](#tổng-quan)
2. [Cấu trúc mới](#cấu-trúc-mới)
3. [Migration Steps](#migration-steps)
4. [Before & After Examples](#before--after-examples)
5. [Best Practices](#best-practices)
6. [Performance Tips](#performance-tips)

---

## 🎯 Tổng quan

### Vấn đề hiện tại

- ❌ **Code trùng lặp**: Định nghĩa article types, status ở nhiều nơi
- ❌ **Hardcoded values**: Magic strings và colors
- ❌ **Inline styles**: Không consistent
- ❌ **Repeated logic**: Form validation, tree operations lặp lại
- ❌ **Large components**: Components quá lớn, khó maintain
- ❌ **No type safety**: Thiếu centralized types

### Giải pháp

- ✅ **Centralized library**: `/lib` folder với reusable code
- ✅ **Constants**: Article types, status configs
- ✅ **Types**: Shared TypeScript definitions
- ✅ **Hooks**: Reusable business logic
- ✅ **Components**: Small, focused, reusable components
- ✅ **Utils**: Formatting, validation utilities

---

## 📁 Cấu trúc mới

```
/lib                          # NEW - Centralized library
├── constants/
│   ├── article-types.ts      # 14 article type configs
│   └── status-types.ts       # Status configs
├── types/
│   ├── article.ts            # Article domain types
│   └── category.ts           # Category domain types
├── hooks/
│   ├── useArticleForm.ts     # Form state management
│   └── useCategoryTree.ts    # Category tree operations
├── components/
│   ├── StatusBadge.tsx       # Reusable status badge
│   ├── ArticleTypeBadge.tsx  # Article type badge
│   ├── FormField.tsx         # Form components
│   ├── Modal.tsx             # Modal dialog
│   └── EmptyState.tsx        # Empty state
├── utils/
│   ├── validation.ts         # Validation functions
│   ├── formatters.ts         # Formatting functions
│   └── cn.ts                 # className utility
└── index.ts                  # Central exports
```

---

## 🔄 Migration Steps

### Step 1: Import thư viện

```tsx
// Add to top of your component
import {
  // Types
  type Article,
  type ArticleType,
  type StatusType,
  
  // Constants
  ARTICLE_TYPES,
  STATUS_CONFIGS,
  getArticleTypeConfig,
  getStatusConfig,
  
  // Components
  StatusBadge,
  ArticleTypeBadge,
  FormField,
  TextInput,
  Modal,
  EmptyState,
  
  // Hooks
  useArticleForm,
  useCategoryTree,
  
  // Utils
  formatters,
  validators,
} from '@/lib';
```

### Step 2: Replace hardcoded configs

**BEFORE:**
```tsx
const articleTypes = [
  { value: 'news', label: 'Tin tức', icon: FileText, color: 'text-blue-600' },
  { value: 'video', label: 'Video', icon: Video, color: 'text-red-600' },
  // ...
];
```

**AFTER:**
```tsx
import { ARTICLE_TYPE_OPTIONS } from '@/lib';

// Use it directly
const articleTypes = ARTICLE_TYPE_OPTIONS;
```

### Step 3: Use reusable components

**BEFORE:**
```tsx
<span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
  Đã xuất bản
</span>
```

**AFTER:**
```tsx
<StatusBadge status="published" />
```

### Step 4: Use hooks for form logic

**BEFORE:**
```tsx
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [errors, setErrors] = useState({});
const [isSaving, setIsSaving] = useState(false);

const handleSave = async () => {
  const newErrors = {};
  if (!title) newErrors.title = 'Required';
  if (!content) newErrors.content = 'Required';
  setErrors(newErrors);
  
  if (Object.keys(newErrors).length > 0) return;
  
  setIsSaving(true);
  try {
    await api.save({ title, content });
  } finally {
    setIsSaving(false);
  }
};
```

**AFTER:**
```tsx
const {
  formData,
  errors,
  isSaving,
  updateField,
  handleSave,
} = useArticleForm({
  onSave: async (data) => {
    await api.save(data);
  },
});

// Just use it
<input
  value={formData.title}
  onChange={(e) => updateField('title', e.target.value)}
/>
```

### Step 5: Use formatters

**BEFORE:**
```tsx
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  // ... more code
};
```

**AFTER:**
```tsx
import { formatters } from '@/lib';

formatters.date(article.createdAt);
formatters.fileSize(file.size);
formatters.relativeTime(article.updatedAt);
```

---

## 📊 Before & After Examples

### Example 1: Article List Item

#### BEFORE (60 lines)

```tsx
function ArticleItem({ article }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'news': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'gallery': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(article.status)}`}>
          {article.status === 'published' ? 'Đã xuất bản' : 
           article.status === 'draft' ? 'Nháp' : 'Chờ duyệt'}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-600">
          {getTypeIcon(article.type)}
          {article.type === 'news' ? 'Tin tức' : 
           article.type === 'video' ? 'Video' : 'Gallery'}
        </span>
      </div>
      
      <h3 className="font-bold text-lg mb-2">{article.title}</h3>
      <p className="text-sm text-gray-600">{formatDate(article.createdAt)}</p>
      <p className="text-sm text-gray-600">{article.views} lượt xem</p>
    </div>
  );
}
```

#### AFTER (15 lines)

```tsx
import { StatusBadge, ArticleTypeBadge, formatters } from '@/lib';

function ArticleItem({ article }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <StatusBadge status={article.status} />
        <ArticleTypeBadge type={article.type} size="sm" />
      </div>
      
      <h3 className="font-bold text-lg mb-2">{article.title}</h3>
      <p className="text-sm text-gray-600">{formatters.date(article.createdAt)}</p>
      <p className="text-sm text-gray-600">{formatters.number(article.views)} lượt xem</p>
    </div>
  );
}
```

**Improvements:**
- 📉 **60 lines → 15 lines** (75% reduction)
- ✅ **Consistent styling** across app
- ✅ **i18n ready** via labelKey
- ✅ **Type safe** with TypeScript

---

### Example 2: Article Form

#### BEFORE (150+ lines)

```tsx
function ArticleEditor({ articleId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('news');
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!content.trim()) newErrors.content = 'Nội dung không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      await api.saveArticle({ title, content, type, status });
      alert('Saved successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Nội dung <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
          rows={10}
        />
        {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
      </div>

      {/* ... more fields ... */}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-6 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
      >
        {isSaving ? 'Đang lưu...' : 'Lưu'}
      </button>
    </div>
  );
}
```

#### AFTER (40 lines)

```tsx
import { useArticleForm, FormField, TextInput, TextArea } from '@/lib';

function ArticleEditor({ articleId }) {
  const {
    formData,
    errors,
    isSaving,
    updateField,
    handleSave,
    handleSaveAndContinue,
  } = useArticleForm({
    onSave: async (data) => {
      await api.saveArticle(data);
      showNotification('Saved successfully!');
    },
  });

  return (
    <div>
      <FormField label="Tiêu đề" required error={errors.title}>
        <TextInput
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={!!errors.title}
        />
      </FormField>

      <FormField label="Nội dung" required error={errors.content}>
        <TextArea
          value={formData.content}
          onChange={(e) => updateField('content', e.target.value)}
          rows={10}
          error={!!errors.content}
        />
      </FormField>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button onClick={handleSaveAndContinue} disabled={isSaving}>
          Lưu & Thêm tiếp
        </button>
      </div>
    </div>
  );
}
```

**Improvements:**
- 📉 **150 lines → 40 lines** (73% reduction)
- ✅ **Built-in validation**
- ✅ **Save & Continue** feature
- ✅ **Consistent styling**
- ✅ **Type safe** formData

---

## 🎯 Best Practices

### 1. Single Responsibility Principle

```tsx
// ✅ GOOD - Component only handles rendering
function ArticleCard({ article }) {
  return (
    <div>
      <StatusBadge status={article.status} />
      <h3>{article.title}</h3>
    </div>
  );
}

// ❌ BAD - Component handles too many things
function ArticleCard({ articleId }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  useEffect(() => {
    fetchArticle(articleId).then(setArticle);
  }, [articleId]);
  
  const handleSave = async () => { /* ... */ };
  const handleDelete = async () => { /* ... */ };
  
  // ... 100 more lines
}
```

### 2. Composition over Inheritance

```tsx
// ✅ GOOD - Compose smaller components
function ArticleEditor() {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ArticleForm onSave={handleSave} />
      <ModalFooter>
        <SaveButton />
        <CancelButton />
      </ModalFooter>
    </Modal>
  );
}

// ❌ BAD - Monolithic component
function ArticleEditor() {
  return (
    <div className="modal">
      {/* 500 lines of mixed concerns */}
    </div>
  );
}
```

### 3. Extract Business Logic to Hooks

```tsx
// ✅ GOOD - Logic in custom hook
function useArticleOperations(articleId) {
  const [article, setArticle] = useState(null);
  
  const load = useCallback(async () => {
    const data = await api.getArticle(articleId);
    setArticle(data);
  }, [articleId]);
  
  const save = useCallback(async (updates) => {
    await api.updateArticle(articleId, updates);
    await load();
  }, [articleId, load]);
  
  return { article, load, save };
}

function ArticleEditor() {
  const { article, save } = useArticleOperations(articleId);
  // Component just handles rendering
}
```

### 4. Use TypeScript Properly

```tsx
// ✅ GOOD - Type safe
import type { Article, ArticleFormData } from '@/lib';

interface Props {
  article: Article;
  onSave: (data: ArticleFormData) => Promise<void>;
}

function ArticleEditor({ article, onSave }: Props) {
  // TypeScript will catch errors
}

// ❌ BAD - No types
function ArticleEditor({ article, onSave }) {
  // No type safety
}
```

---

## ⚡ Performance Tips

### 1. Memoize Expensive Computations

```tsx
import { useMemo } from 'react';

// ✅ GOOD
const filteredArticles = useMemo(() => {
  return articles.filter(a => a.status === 'published');
}, [articles]);

// ❌ BAD - Recomputes every render
const filteredArticles = articles.filter(a => a.status === 'published');
```

### 2. Use useCallback for Event Handlers

```tsx
import { useCallback } from 'react';

// ✅ GOOD
const handleClick = useCallback((id: number) => {
  onSelect(id);
}, [onSelect]);

// ❌ BAD - Creates new function every render
const handleClick = (id: number) => {
  onSelect(id);
};
```

### 3. Lazy Load Components

```tsx
import { lazy, Suspense } from 'react';

// ✅ GOOD - Load on demand
const ArticleEditor = lazy(() => import('./ArticleEditor'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ArticleEditor />
    </Suspense>
  );
}
```

### 4. Virtualize Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// ✅ GOOD - Only render visible items
function ArticleList({ articles }) {
  const virtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });
  
  // Render only visible items
}
```

---

## 📈 Migration Checklist

- [ ] Import `/lib` types cho Article, Category
- [ ] Replace hardcoded article types với `ARTICLE_TYPES`
- [ ] Replace hardcoded status configs với `STATUS_CONFIGS`
- [ ] Use `StatusBadge` component thay vì custom spans
- [ ] Use `ArticleTypeBadge` component
- [ ] Use `FormField`, `TextInput`, `TextArea` components
- [ ] Use `Modal` component cho dialogs
- [ ] Use `EmptyState` component
- [ ] Use `formatters` utilities
- [ ] Use `validators` utilities
- [ ] Extract form logic sang `useArticleForm` hook
- [ ] Extract tree logic sang `useCategoryTree` hook
- [ ] Add TypeScript types cho props
- [ ] Remove inline validation code
- [ ] Remove duplicate utility functions

---

## 🎉 Benefits After Migration

### Code Quality
- ✅ **50-75% less code** in components
- ✅ **100% type safe** with TypeScript
- ✅ **Consistent UI** across app
- ✅ **Easier to test** with small components

### Developer Experience
- ✅ **Auto-completion** in IDE
- ✅ **Faster development** with reusable code
- ✅ **Easier onboarding** for new developers
- ✅ **Better documentation** with JSDoc

### Maintainability
- ✅ **Single source of truth** for configs
- ✅ **Easy to update** styling globally
- ✅ **No code duplication**
- ✅ **Clear separation of concerns**

### Performance
- ✅ **Smaller bundle** with tree-shaking
- ✅ **Better memoization**
- ✅ **Lazy loading** ready
- ✅ **Optimized re-renders**

---

**Happy Refactoring! 🚀**
