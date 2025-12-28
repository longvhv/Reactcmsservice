# 📚 CMS Library

Thư viện tập trung các utilities, components, hooks, types và constants có thể tái sử dụng cho toàn bộ CMS system.

## 🎯 Mục đích

- ✅ **DRY (Don't Repeat Yourself)**: Tránh code trùng lặp
- ✅ **Type Safety**: Đảm bảo type safety với TypeScript
- ✅ **Consistency**: Đồng nhất UI/UX và business logic
- ✅ **Maintainability**: Dễ bảo trì và mở rộng
- ✅ **Developer Experience**: Tăng tốc độ phát triển

## 📁 Cấu trúc

```
/lib
├── constants/          # Hằng số và cấu hình
│   ├── article-types.ts
│   └── status-types.ts
├── types/             # TypeScript type definitions
│   ├── article.ts
│   └── category.ts
├── hooks/             # Custom React hooks
│   ├── useArticleForm.ts
│   └── useCategoryTree.ts
├── components/        # Reusable UI components
│   ├── StatusBadge.tsx
│   ├── ArticleTypeBadge.tsx
│   ├── FormField.tsx
│   ├── Modal.tsx
│   └── EmptyState.tsx
├── utils/             # Utility functions
│   ├── validation.ts
│   ├── formatters.ts
│   └── cn.ts
├── index.ts           # Central exports
└── README.md          # Documentation
```

## 🚀 Usage Examples

### 1. Constants & Types

```tsx
import { ARTICLE_TYPES, getArticleTypeConfig, type ArticleType } from '@/lib';

// Get all article types
const types = ARTICLE_TYPE_OPTIONS;

// Get specific config
const config = getArticleTypeConfig('news');
console.log(config.label, config.icon, config.color);

// Type-safe article
const article: Article = {
  id: 1,
  title: 'Hello World',
  type: 'news',
  status: 'published',
  // ...
};
```

### 2. Hooks

```tsx
import { useArticleForm } from '@/lib';

function ArticleEditor() {
  const {
    formData,
    errors,
    isSaving,
    updateField,
    handleSave,
    handleSaveAndContinue,
  } = useArticleForm({
    onSave: async (data) => {
      await api.createArticle(data);
    },
  });

  return (
    <form>
      <input
        value={formData.title}
        onChange={(e) => updateField('title', e.target.value)}
      />
      {errors.title && <span>{errors.title}</span>}
      
      <button onClick={handleSave} disabled={isSaving}>
        Save
      </button>
    </form>
  );
}
```

```tsx
import { useCategoryTree } from '@/lib';

function CategoryTree() {
  const {
    categoryTree,
    expandedIds,
    toggleExpand,
    select,
  } = useCategoryTree({
    initialCategories: categories,
    filterType: 'news',
  });

  return (
    <div>
      {categoryTree.map(node => (
        <CategoryNode
          key={node.id}
          node={node}
          onToggle={() => toggleExpand(node.id)}
          onSelect={() => select(node.id)}
        />
      ))}
    </div>
  );
}
```

### 3. Components

```tsx
import { StatusBadge, ArticleTypeBadge, FormField, TextInput } from '@/lib';

function ArticleCard({ article }) {
  return (
    <div>
      <StatusBadge status={article.status} />
      <ArticleTypeBadge type={article.type} />
      <h3>{article.title}</h3>
    </div>
  );
}

function ArticleForm() {
  return (
    <FormField
      label="Tiêu đề"
      required
      error={errors.title}
      helperText="Tối đa 200 ký tự"
    >
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!errors.title}
      />
    </FormField>
  );
}
```

```tsx
import { Modal, ModalFooter } from '@/lib';

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa"
      description="Bạn có chắc chắn muốn xóa bài viết này?"
      size="sm"
    >
      <ModalFooter>
        <button onClick={onClose}>Hủy</button>
        <button onClick={onConfirm}>Xóa</button>
      </ModalFooter>
    </Modal>
  );
}
```

### 4. Utilities

```tsx
import { formatters, validators, validate } from '@/lib';

// Formatting
formatters.date(article.createdAt);           // "28 tháng 12, 2025"
formatters.relativeTime(article.createdAt);   // "2 giờ trước"
formatters.number(1234567);                   // "1,234,567"
formatters.fileSize(1024000);                 // "1000 KB"
formatters.truncate(longText, 100);           // "Short text..."
formatters.slug("Xin chào Việt Nam");         // "xin-chao-viet-nam"

// Validation
const errors = validate(formData, {
  title: [
    (v) => validators.required(v, 'Title'),
    (v) => validators.minLength(v, 5),
    (v) => validators.maxLength(v, 200),
  ],
  email: [
    (v) => validators.required(v, 'Email'),
    (v) => validators.email(v),
  ],
  url: [
    (v) => validators.url(v),
  ],
});
```

## 🎨 Theming & Styling

Tất cả components đều sử dụng:
- **Tailwind CSS v4.0** variables từ `/styles/globals.css`
- **CSS Variables**: `--background`, `--foreground`, `--border`, etc.
- **Dark Mode**: Tự động với `dark:` variants
- **Consistent spacing**: Tuân theo design system

## 🔧 Best Practices

### 1. Import từ lib

```tsx
// ✅ GOOD - Import from lib
import { StatusBadge, formatters } from '@/lib';

// ❌ BAD - Import directly
import { StatusBadge } from '@/lib/components/StatusBadge';
```

### 2. Type Safety

```tsx
// ✅ GOOD - Use exported types
import type { Article, ArticleType } from '@/lib';

const article: Article = { ... };

// ❌ BAD - Define types inline
const article: { id: number; title: string; ... } = { ... };
```

### 3. Reuse Components

```tsx
// ✅ GOOD - Reuse library components
import { FormField, TextInput } from '@/lib';

<FormField label="Title" error={errors.title}>
  <TextInput value={title} onChange={handleChange} />
</FormField>

// ❌ BAD - Create custom wrapper every time
<div>
  <label>Title</label>
  <input className="w-full px-4 py-2..." />
  {errors.title && <span>{errors.title}</span>}
</div>
```

### 4. Use Constants

```tsx
// ✅ GOOD - Use centralized constants
import { ARTICLE_TYPES } from '@/lib';

const options = Object.values(ARTICLE_TYPES);

// ❌ BAD - Hardcode values
const options = [
  { value: 'news', label: 'Tin tức' },
  { value: 'video', label: 'Video' },
  // ...
];
```

## 📝 Adding New Features

### Thêm Article Type mới

1. Update `/lib/constants/article-types.ts`:
```tsx
export const ARTICLE_TYPES = {
  // ... existing types
  'new-type': {
    value: 'new-type',
    label: 'New Type',
    labelKey: 'articleTypes.newType',
    icon: NewIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Description',
    descriptionKey: 'articleTypes.newTypeDesc',
  },
};
```

2. Update i18n files in `/locales/`

3. Update type definition if needed in `/lib/types/article.ts`

### Thêm Component mới

1. Tạo file trong `/lib/components/`
2. Export trong `/lib/index.ts`
3. Document usage trong README

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/lib';

test('renders status badge', () => {
  render(<StatusBadge status="published" />);
  expect(screen.getByText('Đã xuất bản')).toBeInTheDocument();
});
```

## 📊 Performance

- ✅ Tree-shakable exports
- ✅ No runtime overhead
- ✅ Memoized computations in hooks
- ✅ Minimal bundle impact

## 🔗 Related

- [Type Definitions](/src/types/)
- [Design System](/styles/globals.css)
- [i18n Guide](/I18N_GUIDE.md)
- [Component Library](/components/ui/)

## 💡 Tips

1. **Code Completion**: Your IDE sẽ suggest tất cả exports từ `@/lib`
2. **Type Inference**: TypeScript sẽ tự động infer types
3. **Refactoring**: Dễ dàng refactor với centralized definitions
4. **Documentation**: Hover over imports để xem JSDoc comments

---

**Happy Coding! 🚀**
