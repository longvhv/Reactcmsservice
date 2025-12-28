# 📐 Hướng dẫn Spacing & Padding

## ✅ Đã fix

Đã thêm `PageWrapper` component để đảm bảo spacing đồng nhất cho tất cả các trang.

## 🎯 Components đã cập nhật

### ✅ Hoàn tất
- `ArticleManagement.tsx` - Wrapped with PageWrapper
- `CategoryManagement.tsx` - Wrapped with PageWrapper  
- `Dashboard.tsx` - Wrapped with PageWrapper

### 📋 Cần cập nhật
Các components sau cần wrap với PageWrapper:

```tsx
import { PageWrapper } from './PageWrapper';

export function YourComponent() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Your content */}
      </div>
    </PageWrapper>
  );
}
```

**Danh sách:**
- [ ] ArticleDetail.tsx
- [ ] PermissionGroups.tsx
- [ ] CategoryDetail.tsx
- [ ] EventSeries.tsx
- [ ] MediaManagement.tsx
- [ ] UserManagement.tsx
- [ ] ActivityTimeline.tsx
- [ ] CrawlerManagementNew.tsx
- [ ] CampaignDetail.tsx
- [ ] SourceDetail.tsx
- [ ] CrawlerSources.tsx
- [ ] CrawlerArticles.tsx
- [ ] ApprovedArticles.tsx
- [ ] StatsAnalytics.tsx
- [ ] ApprovalWorkflow.tsx
- [ ] ApprovalDashboard.tsx
- [ ] ReviewComments.tsx
- [ ] WorkflowBuilder.tsx
- [ ] VersionControl.tsx
- [ ] PublishingScheduler.tsx
- [ ] SEOOptimizer.tsx
- [ ] ContentTemplates.tsx
- [ ] AdvancedAnalytics.tsx

## 🎨 PageWrapper Component

```tsx
// /components/PageWrapper.tsx
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className={`p-8 ${className}`}>
      {children}
    </div>
  );
}
```

## 📏 Spacing System

### Standard Padding
- **Page Level**: `p-8` (32px) - Applied by PageWrapper
- **Card**: `p-6` (24px)
- **Small Card**: `p-4` (16px)
- **Compact**: `p-3` (12px)

### Vertical Spacing
- **Sections**: `space-y-6` (24px)
- **Cards**: `space-y-4` (16px)
- **List Items**: `space-y-3` (12px)
- **Tight**: `space-y-2` (8px)

### Grid Gaps
- **Large**: `gap-6` (24px)
- **Medium**: `gap-4` (16px)  
- **Small**: `gap-3` (12px)
- **Tight**: `gap-2` (8px)

## 🔍 Kiểm tra spacing

### Visual Checklist
1. **Không sát lề trái/phải** ✅
2. **Khoảng cách đồng nhất giữa sections** ✅
3. **Cards có padding phù hợp** ✅
4. **Responsive spacing** ✅

### Code Checklist
```tsx
// ❌ BAD - No padding
export function MyPage() {
  return (
    <div className="space-y-6">
      {/* Content sát lề */}
    </div>
  );
}

// ✅ GOOD - With PageWrapper
export function MyPage() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Content có padding đúng */}
      </div>
    </PageWrapper>
  );
}
```

## 🎯 Quick Fix Script

Để nhanh chóng thêm PageWrapper vào một component:

1. Import PageWrapper:
```tsx
import { PageWrapper } from './PageWrapper';
```

2. Wrap root element:
```tsx
return (
  <PageWrapper>
    {/* existing content */}
  </PageWrapper>
);
```

## 🚀 Advanced Customization

Nếu cần custom padding cho một page cụ thể:

```tsx
<PageWrapper className="p-4">
  {/* Less padding */}
</PageWrapper>

<PageWrapper className="p-12">
  {/* More padding */}
</PageWrapper>

<PageWrapper className="px-8 py-4">
  {/* Different horizontal/vertical */}
</PageWrapper>
```

## 📱 Responsive Spacing

PageWrapper có thể được mở rộng để responsive:

```tsx
export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className={`p-4 md:p-6 lg:p-8 ${className}`}>
      {children}
    </div>
  );
}
```

## ✨ Best Practices

### DO ✅
- Always use PageWrapper for page-level components
- Keep spacing consistent across pages
- Use design tokens (p-4, p-6, p-8)
- Test on different screen sizes

### DON'T ❌
- Don't add manual padding to page components
- Don't use arbitrary values (p-[37px])
- Don't mix spacing systems
- Don't forget responsive considerations

## 🎨 Visual Examples

### Before (Sát lề):
```
┌─────────────────────────────────┐
│Header Text                      │← Sát lề
│Content...                       │
└─────────────────────────────────┘
```

### After (With PageWrapper):
```
┌─────────────────────────────────┐
│  [32px padding]                 │
│  Header Text                    │
│  Content...                     │
│  [32px padding]                 │
└─────────────────────────────────┘
```

## 📊 Component Hierarchy

```
App.tsx
└── <main className="flex-1 overflow-y-auto">
    └── <PageWrapper> ← Adds p-8
        └── <div className="space-y-6"> ← Vertical spacing
            ├── Header section
            ├── Stats cards
            └── Content
```

## 🔧 Troubleshooting

**Q: Content vẫn sát lề?**
- ✅ Check if PageWrapper được import
- ✅ Check if component được wrap
- ✅ Check browser DevTools for applied styles

**Q: Padding quá lớn?**
- ✅ Override với className prop
- ✅ hoặc sử dụng spacing utility khác

**Q: Modal cũng bị padding?**
- ✅ Modal nên render outside PageWrapper
- ✅ Sử dụng portal hoặc fixed position

## 📝 Notes

- PageWrapper được áp dụng cho **page-level components** only
- **Modal, Drawer, Popover** không cần PageWrapper
- **Nested components** kế thừa spacing từ parent
- Always check responsive behavior

---

**Last Updated:** December 27, 2024  
**Status:** ✅ FIXED for 3 main components  
**Remaining:** 23 components cần cập nhật
