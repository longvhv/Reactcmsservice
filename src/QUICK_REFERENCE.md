# ⚡ Quick Reference - CMS Library

Cheat sheet nhanh cho việc sử dụng `/lib` trong development.

---

## 📦 Import Statement

```tsx
import {
  // Types
  type Article,
  type Category,
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
  TextArea,
  Select,
  Modal,
  ModalFooter,
  EmptyState,
  
  // Hooks
  useArticleForm,
  useCategoryTree,
  
  // Utils
  formatters,
  validators,
  validate,
  cn,
} from '@/lib';
```

---

## 🎨 Components

### StatusBadge

```tsx
// Basic
<StatusBadge status="published" />

// Without icon
<StatusBadge status="draft" showIcon={false} />

// Different sizes
<StatusBadge status="pending" size="sm" />
<StatusBadge status="approved" size="lg" />

// Just a dot
<StatusDot status="published" />
```

### ArticleTypeBadge

```tsx
// Basic
<ArticleTypeBadge type="news" />

// Variants
<ArticleTypeBadge type="video" variant="outline" />
<ArticleTypeBadge type="gallery" variant="minimal" />

// Icon only
<ArticleTypeBadge type="podcast" showLabel={false} />

// Different sizes
<ArticleTypeBadge type="event" size="lg" />
```

### Form Components

```tsx
// FormField wrapper
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

// TextArea
<FormField label="Nội dung" required error={errors.content}>
  <TextArea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    rows={10}
  />
</FormField>

// Select
<FormField label="Loại">
  <Select value={type} onChange={(e) => setType(e.target.value)}>
    <option value="news">Tin tức</option>
    <option value="video">Video</option>
  </Select>
</FormField>
```

### Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Xác nhận xóa"
  description="Bạn có chắc chắn muốn xóa?"
  size="md"
>
  <p>Content here</p>
  
  <ModalFooter>
    <button onClick={() => setIsOpen(false)}>Hủy</button>
    <button onClick={handleDelete}>Xóa</button>
  </ModalFooter>
</Modal>
```

### EmptyState

```tsx
<EmptyState
  icon={FileText}
  title="Chưa có bài viết"
  description="Tạo bài viết đầu tiên của bạn"
  action={{
    label: "Tạo mới",
    onClick: handleCreate,
    icon: Plus,
  }}
/>
```

---

## 🪝 Hooks

### useArticleForm

```tsx
function ArticleEditor() {
  const {
    formData,        // Current form data
    errors,          // Validation errors
    isSaving,        // Loading state
    isDirty,         // Has unsaved changes
    updateField,     // Update single field
    updateFields,    // Update multiple fields
    handleSave,      // Save handler
    handleSaveAndContinue,  // Save & continue
    reset,           // Reset form
  } = useArticleForm({
    initialData: article,
    onSave: async (data) => {
      await api.save(data);
    },
    onSaveAndContinue: async (data) => {
      await api.save(data);
      // Form auto resets
    },
  });

  return (
    <div>
      <input
        value={formData.title}
        onChange={(e) => updateField('title', e.target.value)}
      />
      {errors.title && <span>{errors.title}</span>}
      
      <button onClick={handleSave} disabled={isSaving}>
        Save
      </button>
      <button onClick={handleSaveAndContinue}>
        Save & Continue
      </button>
    </div>
  );
}
```

### useCategoryTree

```tsx
function CategoryManager() {
  const {
    categoryTree,      // Tree structure
    flatCategories,    // Flat list
    expandedIds,       // Set of expanded IDs
    selectedId,        // Selected category ID
    toggleExpand,      // Toggle expand/collapse
    expandAll,         // Expand all nodes
    collapseAll,       // Collapse all nodes
    select,            // Select a category
    findCategory,      // Find by ID
    findBySlug,        // Find by slug
    getParentChain,    // Get parent breadcrumb
    getChildren,       // Get direct children
    getAllDescendants, // Get all descendants
    canMove,           // Check if can move
    updateCategory,    // Update category
    deleteCategory,    // Delete category
  } = useCategoryTree({
    initialCategories: categories,
    filterType: 'news',  // Filter by article type
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

---

## 🛠️ Utils

### Formatters

```tsx
// Date & Time
formatters.date('2024-12-28')                    // "28 tháng 12, 2024"
formatters.datetime('2024-12-28T10:30:00')       // "28 tháng 12, 2024, 10:30"
formatters.relativeTime('2024-12-28T08:00:00')   // "2 giờ trước"

// Numbers
formatters.number(1234567)                       // "1,234,567"
formatters.fileSize(1024000)                     // "1000 KB"
formatters.duration(3665)                        // "1h 1m 5s"
formatters.currency(100000, 'VND')               // "100.000 ₫"
formatters.percentage(87.5)                      // "87.5%"

// Strings
formatters.truncate('Long text...', 50)          // "Long text..."
formatters.slug('Xin chào Việt Nam')             // "xin-chao-viet-nam"
formatters.capitalize('hello world')             // "Hello world"
```

### Validators

```tsx
// Single validation
validators.required(value, 'Title')              // "Title is required"
validators.email('test@example')                 // "Invalid email address"
validators.url('not-a-url')                      // "Invalid URL"
validators.minLength('abc', 5)                   // "Must be at least 5 characters"
validators.slug('Invalid Slug!')                 // "Invalid slug format..."

// Multiple validations
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

// errors = { title: "Must be at least 5 characters", ... }
```

### Class Names

```tsx
// Merge class names
cn('base-class', isActive && 'active', 'another-class')
// → "base-class active another-class"

// With arrays
cn(['class1', 'class2'], condition && 'class3')

// Remove falsy values
cn('base', false, null, undefined, 'end')
// → "base end"
```

---

## 📋 Constants

### Article Types

```tsx
// All types
ARTICLE_TYPE_OPTIONS  // Array of all 14 types

// Get config
const config = getArticleTypeConfig('news');
// {
//   value: 'news',
//   label: 'Tin tức',
//   labelKey: 'articleTypes.news',
//   icon: FileText,
//   color: 'text-blue-600',
//   bgColor: 'bg-blue-100 dark:bg-blue-900/30',
//   description: '...',
//   descriptionKey: 'articleTypes.newsDesc',
// }

// Use in select
<select>
  {ARTICLE_TYPE_OPTIONS.map(type => (
    <option key={type.value} value={type.value}>
      {t(type.labelKey)}
    </option>
  ))}
</select>
```

### Status Types

```tsx
// All statuses
STATUS_OPTIONS  // Array of all 8 statuses

// Get config
const config = getStatusConfig('published');
// {
//   value: 'published',
//   label: 'Đã xuất bản',
//   labelKey: 'status.published',
//   icon: Send,
//   color: 'text-blue-600',
//   bgColor: 'bg-blue-100 dark:bg-blue-900/30',
//   borderColor: 'border-blue-300',
//   dotColor: 'bg-blue-500',
// }
```

---

## 🎯 Common Patterns

### Article List Item

```tsx
function ArticleListItem({ article }: { article: Article }) {
  return (
    <div className="p-4 border rounded-xl">
      <div className="flex gap-2 mb-2">
        <StatusBadge status={article.status} size="sm" />
        <ArticleTypeBadge type={article.type} size="sm" />
      </div>
      <h3>{article.title}</h3>
      <p className="text-sm text-muted-foreground">
        {article.author} • {formatters.relativeTime(article.createdAt)}
      </p>
      <p className="text-sm text-muted-foreground">
        {formatters.number(article.views)} views
      </p>
    </div>
  );
}
```

### Form with Validation

```tsx
function ArticleForm() {
  const {
    formData,
    errors,
    updateField,
    handleSave,
  } = useArticleForm({
    onSave: async (data) => await api.save(data),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <FormField label="Title" required error={errors.title}>
        <TextInput
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
      </FormField>
      
      <button type="submit">Save</button>
    </form>
  );
}
```

### Delete Confirmation

```tsx
function DeleteButton({ article }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button onClick={() => setShowConfirm(true)}>Delete</button>
      
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Delete"
        size="sm"
      >
        <p>Are you sure you want to delete "{article.title}"?</p>
        <ModalFooter>
          <button onClick={() => setShowConfirm(false)}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Empty State

```tsx
function ArticleList({ articles }) {
  if (articles.length === 0) {
    return (
      <EmptyState
        title="No articles yet"
        description="Create your first article to get started"
        action={{
          label: "Create Article",
          onClick: () => navigate('/articles/new'),
          icon: Plus,
        }}
      />
    );
  }

  return (
    <div>
      {articles.map(article => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </div>
  );
}
```

---

## 💡 Tips

1. **Always import from `@/lib`** not from individual files
2. **Check existing components** before creating new ones
3. **Use TypeScript types** for better DX
4. **Follow naming conventions** from the library
5. **Add to library** if you create something reusable

---

## 📚 Full Documentation

- **Library Overview**: `/lib/README.md`
- **Migration Guide**: `/OPTIMIZATION_GUIDE.md`
- **Complete Summary**: `/CODE_OPTIMIZATION_SUMMARY.md`
- **Examples**: `/examples/ArticleManagementOptimized.tsx`

---

**Keep this handy while coding! 🚀**
