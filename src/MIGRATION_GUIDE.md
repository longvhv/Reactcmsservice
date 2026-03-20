# Migration Guide: React Router to RouterContext

## ✅ Completed Migration

All components have been migrated from `next/navigation` to use the custom `RouterContext` shim layer for Figma Make compatibility.

## Changed Imports

### Before (Next.js only):
```tsx
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
```

### After (Figma Make compatible):
```tsx
import { useRouter, usePathname, useParams } from '../contexts/RouterContext';
// No Link component needed - use router.push() or button onClick
```

## Updated Components

### Core Components
- ✅ `/components/Dashboard.tsx`
- ✅ `/components/ArticleManagement.tsx`
- ✅ `/components/CategoryManagement.tsx`
- ✅ `/components/SidebarNext.tsx`
- ✅ `/components/Header.tsx`

### App Components
- ✅ `/app/page/cms/dashboard/DashboardComponent.tsx`
- ✅ `/app/page/cms/articles/ArticlesComponent.tsx`
- ✅ `/app/page/cms/articles/[id]/ArticleDetailComponent.tsx`
- ✅ `/app/page/cms/categories/CategoriesComponent.tsx`
- ✅ `/app/page/cms/categories/[id]/CategoryDetailComponent.tsx`

### Shim Pages
- ✅ All 35+ pages in `/pages/page/cms/*`

## Usage Examples

### Navigation
```tsx
const router = useRouter();

// Navigate to a page
router.push('/page/cms/articles');

// Navigate with state (Figma Make)
router.push('/page/cms/articles/123');

// Go back
router.back();
```

### Getting Current Route
```tsx
const pathname = usePathname();

// Check current path
if (pathname === '/page/cms/dashboard') {
  // Do something
}
```

### Getting Route Parameters
```tsx
// In /pages/page/cms/articles/[id].tsx
const params = useParams();
const articleId = params.id;
```

## How RouterContext Works

The `RouterContext` provides a unified interface that works in both:

1. **Figma Make**: Uses state-based routing from `/App.tsx`
2. **Next.js**: Falls back to browser navigation (future)

### Implementation Details

```tsx
// contexts/RouterContext.tsx
export function useRouter() {
  const context = useContext(RouterContext);
  
  if (!context) {
    // Fallback for Next.js
    return {
      push: (path: string) => {
        window.location.href = path;
      },
      back: () => {
        window.history.back();
      },
    };
  }

  // Figma Make implementation
  return {
    push: (path: string) => context.navigate(path),
    back: () => window.history.back(),
  };
}
```

## Important Notes

⚠️ **Do NOT import from next/navigation in components**
- All components should use `/contexts/RouterContext`
- This ensures Figma Make compatibility

⚠️ **Link Component**
- Don't use `<Link>` from `next/link`
- Use `<button onClick={() => router.push('/path')}>` instead
- Or use `<a href="/path" onClick={(e) => { e.preventDefault(); router.push('/path'); }}>`

⚠️ **Route Paths**
- All CMS routes use `/page/cms/` prefix
- Example: `/page/cms/dashboard`, `/page/cms/articles`, etc.

## Future Migration to Next.js

When ready to migrate to pure Next.js:

1. Replace all `import { useRouter } from '../contexts/RouterContext'` with `import { useRouter } from 'next/navigation'`
2. Replace all `router.push()` calls with Next.js router
3. Add back `<Link>` components from `next/link` where appropriate
4. Remove `/contexts/RouterContext.tsx`
5. Remove `/pages` shim layer
6. Remove `/App.tsx`

## Testing

### Test in Figma Make
```bash
# Current setup - works with shim layer
npm run dev
# Navigate to http://localhost:3000
```

### Test Navigation
1. Click sidebar items - should navigate without page refresh
2. Use browser back/forward - should work
3. Direct URL access - should work

## Troubleshooting

### Error: "invariant expected app router to be mounted"
- This means a component is still importing from `next/navigation`
- Search for: `from 'next/navigation'` or `from 'next/link'`
- Replace with RouterContext imports

### Error: "Cannot read property 'push' of undefined"
- Router context not available
- Make sure component is wrapped in `<RouterProvider>` (done in `/App.tsx`)

### Navigation not working
- Check console for errors
- Verify route paths start with `/page/cms/`
- Verify route is registered in `/App.tsx` routing logic

## Questions?

See `/ARCHITECTURE.md` for full architecture details.
