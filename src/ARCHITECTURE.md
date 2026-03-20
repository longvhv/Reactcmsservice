# CMS Architecture - Shim Layer for Figma Make to Next.js Migration

## Overview

This CMS uses a **shim layer architecture** that allows the same codebase to run on both **Figma Make** (current) and **Next.js App Router** (future), enabling gradual migration without breaking existing functionality.

## Directory Structure

```
/
├── App.tsx                    # Entry point for Figma Make
├── /app                       # Next.js App Router (future)
│   └── /page/cms
│       ├── dashboard/
│       │   ├── page.tsx       # Next.js page (uses DashboardComponent)
│       │   └── DashboardComponent.tsx  # Business logic component
│       ├── articles/
│       │   ├── page.tsx
│       │   ├── ArticlesComponent.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── ArticleDetailComponent.tsx
│       └── ...
├── /pages                     # Shim layer for Figma Make compatibility
│   └── /page/cms
│       ├── dashboard.tsx      # Imports from /app
│       ├── articles.tsx
│       ├── articles/[id].tsx
│       └── ...
├── /components                # Reusable UI components
│   ├── Dashboard.tsx          # Core business logic
│   ├── ArticleManagement.tsx
│   ├── CategoryManagement.tsx
│   ├── CMSLayout.tsx          # Layout wrapper (Sidebar + Header)
│   ├── SidebarNext.tsx
│   ├── Header.tsx
│   └── ...
└── /contexts                  # Shared contexts
    ├── LanguageContext.tsx
    ├── SystemSettingsContext.tsx
    └── RouterContext.tsx       # Router shim (wraps both)
```

## How It Works

### 1. Figma Make Mode (Current)

**Entry Point:** `/App.tsx`

```tsx
// App.tsx handles routing in Figma Make
<RouterProvider value={{ navigate, currentRoute }}>
  {renderPage()}  // Routes to /pages shim files
</RouterProvider>
```

**Flow:**
```
App.tsx
  ↓ (state-based routing)
/pages/page/cms/dashboard.tsx (shim)
  ↓ (import)
/app/page/cms/dashboard/DashboardComponent.tsx
  ↓ (renders)
<CMSLayout>
  <Dashboard />  // from /components
</CMSLayout>
```

### 2. Next.js Mode (Future)

**Entry Point:** `/app/page.tsx` (redirects to `/app/page/cms/dashboard/page.tsx`)

```tsx
// Next.js handles routing via file system
export default function DashboardPage() {
  return <Dashboard />;  // from DashboardComponent.tsx
}
```

**Flow:**
```
/app/page/cms/dashboard/page.tsx
  ↓ (import)
/app/page/cms/dashboard/DashboardComponent.tsx
  ↓ (renders)
<CMSLayout>
  <Dashboard />  // from /components
</CMSLayout>
```

## Key Components

### RouterContext (`/contexts/RouterContext.tsx`)

Provides a unified routing interface for both modes:

**Figma Make:**
- Uses internal state management
- `navigate(path)` updates state
- `currentRoute` tracks current page

**Next.js:**
- Falls back to browser navigation
- `router.push(path)` uses Next.js router
- `usePathname()` uses Next.js hook

### CMSLayout (`/components/CMSLayout.tsx`)

Wraps all CMS pages with:
- Sidebar (collapsible)
- Header (with search, notifications, user menu)
- Main content area

### Business Logic Components (`/components/*`)

Core components that contain actual business logic:
- `Dashboard.tsx`
- `ArticleManagement.tsx`
- `CategoryManagement.tsx`
- etc.

These components:
- Accept optional `onNavigate` prop for backward compatibility
- Use `useRouter()` from RouterContext internally
- Work in both Figma Make and Next.js

### Shim Layer (`/pages/*`)

Thin wrapper files that import from `/app` and forward props:

```tsx
// /pages/page/cms/articles.tsx
import { ArticleManagement } from '../../../app/page/cms/articles/ArticlesComponent';

export default function ArticlesPage() {
  return <ArticleManagement />;
}
```

## Migration Strategy

### Phase 1: Current (Figma Make)
✅ All code runs through `/App.tsx`  
✅ Routing via state management  
✅ Shim layer imports from `/app`

### Phase 2: Dual Mode
- Figma Make continues using `/App.tsx`
- Next.js pages can be tested via `/app` routes
- Both modes share same business logic

### Phase 3: Next.js Migration
1. Test each page in Next.js mode
2. Update any incompatible code
3. Switch entry point from `/App.tsx` to `/app/page.tsx`
4. Remove shim layer (`/pages`)

### Phase 4: Cleanup
- Remove `/App.tsx`
- Remove `/pages` directory
- Remove `/contexts/RouterContext.tsx`
- Update all imports to use `next/navigation`

## Router Usage

### In Components

```tsx
import { useRouter, usePathname } from '../contexts/RouterContext';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigate to another page
  const handleClick = () => {
    router.push('/page/cms/articles');
  };

  // Check current path
  const isActive = pathname === '/page/cms/dashboard';
}
```

### Dynamic Routes

**Figma Make:**
```tsx
// State-based with params
currentRoute = {
  path: '/page/cms/articles/123',
  params: { id: '123' }
}
```

**Next.js:**
```tsx
// File-based routing
/app/page/cms/articles/[id]/page.tsx
```

## Benefits of This Architecture

1. **Zero Breaking Changes**: Existing Figma Make code continues to work
2. **Gradual Migration**: Can migrate page-by-page
3. **Code Reuse**: Business logic shared between modes
4. **Type Safety**: Full TypeScript support in both modes
5. **Developer Experience**: Clean separation of concerns

## Important Notes

⚠️ **Do NOT mix routing approaches**
- Use `useRouter()` from `/contexts/RouterContext` (not `next/navigation`)
- Let the shim handle the difference

⚠️ **Component Props**
- `onNavigate` is optional for backward compatibility
- Components should primarily use `useRouter()` internally

⚠️ **Path Prefix**
- All CMS routes use `/page/cms/` prefix
- Matches repository requirements

## Testing

### Test in Figma Make
```bash
# Current behavior - no changes needed
npm run dev
```

### Test in Next.js (future)
```bash
# When migrating
npm run dev
# Navigate directly to /page/cms/dashboard
```

## Questions?

See the main README or contact the development team.
