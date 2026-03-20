# 🗺️ Next.js Routing Structure

## 📍 URL Structure

All CMS pages are prefixed with `/page/cms/`

### Root Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Redirect | Auto redirects to `/page/cms` |
| `/page/cms` | Main CMS | Main CMS application with all features |
| `/page/cms/reporter` | Reporter Portal | Dedicated reporter interface |

---

## 🏗️ Folder Structure

```
/app/
├── layout.tsx                    # Root layout (providers, fonts, etc.)
├── page.tsx                      # Root page (redirects to /page/cms)
├── middleware.ts                 # Routing middleware
│
└── /page/
    └── /cms/
        ├── layout.tsx            # CMS section layout
        ├── page.tsx              # Main CMS app (Admin + All features)
        │
        └── /reporter/
            ├── layout.tsx        # Reporter section layout
            └── page.tsx          # Reporter Portal
```

---

## 🎯 Route Details

### 1. **Root Route (`/`)**
```tsx
// app/page.tsx
- Redirects to /page/cms
- Shows loading spinner during redirect
```

### 2. **Main CMS (`/page/cms`)**
```tsx
// app/page/cms/page.tsx
- Full admin portal
- All features: Dashboard, Articles, Media, Users, etc.
- State-based navigation (SPA-style)
- Sidebar + Header layout
```

**Available Internal Pages** (state-based):
- Dashboard
- Article Management
- Category Management
- Media Library
- User Management
- Crawler Management
- Analytics
- AI Tools
- Royalty Management
- Settings
- And 20+ more...

### 3. **Reporter Portal (`/page/cms/reporter`)**
```tsx
// app/page/cms/reporter/page.tsx
- Dedicated reporter interface
- Dashboard, My Articles, Editor
- Royalty tracking
- Analytics
- Profile
```

---

## 🔄 Navigation Types

### Type 1: Next.js Routing (URL changes)
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/page/cms/reporter');
```

**Used for:**
- ✅ Main section switches (Admin ↔ Reporter)
- ✅ SEO-critical pages
- ✅ Shareable URLs

### Type 2: State-based Navigation (SPA, no URL change)
```tsx
const [currentPage, setCurrentPage] = useState({ page: 'dashboard' });
setCurrentPage({ page: 'articles' });
```

**Used for:**
- ✅ Internal CMS navigation
- ✅ Fast transitions
- ✅ Complex state management
- ✅ Modal-like pages

---

## 🛣️ Adding New Routes

### Add a Top-level Route
```bash
# Create new route: /page/cms/new-section
mkdir -p app/page/cms/new-section
```

```tsx
// app/page/cms/new-section/page.tsx
'use client';

export default function NewSectionPage() {
  return <div>New Section</div>;
}
```

```tsx
// app/page/cms/new-section/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Section | VHV CMS',
};

export default function NewSectionLayout({ children }) {
  return <>{children}</>;
}
```

### Add Internal State-based Page
```tsx
// In app/page/cms/page.tsx
type PageState = 
  | { page: 'existing-page' }
  | { page: 'new-internal-page' }; // Add this

// Then add render case:
case 'new-internal-page':
  return <NewInternalPageComponent />;
```

---

## 🎨 Metadata Management

Each route can have its own metadata:

```tsx
// app/page/cms/reporter/layout.tsx
export const metadata: Metadata = {
  title: 'Reporter Portal | VHV CMS',
  description: 'Reporter Portal for content creators',
  keywords: 'reporter, cms, content creation',
  openGraph: {
    title: 'Reporter Portal',
    description: 'Create and manage your articles',
    images: ['/og-reporter.png'],
  },
};
```

---

## 🔐 Protected Routes (Future)

To add authentication:

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // Protect /page/cms/* routes
  if (request.nextUrl.pathname.startsWith('/page/cms')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

---

## 🚀 Dynamic Routes (Future Enhancement)

Can be added if needed:

```
/page/cms/articles/[id]/page.tsx      → /page/cms/articles/123
/page/cms/users/[id]/page.tsx         → /page/cms/users/456
/page/cms/categories/[slug]/page.tsx  → /page/cms/categories/tech
```

Example:
```tsx
// app/page/cms/articles/[id]/page.tsx
export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticleDetail articleId={parseInt(params.id)} />;
}
```

---

## 📊 Current Implementation

✅ **Working Routes:**
- `/` → Redirects to `/page/cms`
- `/page/cms` → Full admin portal with all features
- `/page/cms/reporter` → Reporter portal

✅ **Navigation:**
- Next.js routing for top-level sections
- State-based navigation for internal CMS pages
- Smooth transitions
- No page reloads

✅ **SEO:**
- Proper metadata per route
- Server components where possible
- Dynamic titles

---

## 🔧 Configuration

### Base Path
If you need to change the base path (e.g., from `/page/cms` to `/admin`):

1. Update folder structure: `app/page/cms/` → `app/admin/`
2. Update middleware redirect
3. Update all imports

### URL Rewriting
In `next.config.mjs`:
```js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/cms',
        destination: '/page/cms',
      },
    ];
  },
};
```

---

## 📝 Best Practices

1. **Use Next.js routing** for:
   - Different user roles (admin, reporter, viewer)
   - Major feature sections
   - Public vs. private areas

2. **Use state-based navigation** for:
   - Internal dashboard navigation
   - Modal-like experiences
   - Quick page switches

3. **Always set metadata** for SEO

4. **Use layouts** to share logic between related pages

5. **Keep folder structure** clean and intuitive

---

## 🎯 Summary

- ✅ All routes have `/page/cms/` prefix
- ✅ Clean URL structure
- ✅ Flexible navigation (Next.js + State)
- ✅ SEO-friendly
- ✅ Easy to extend
- ✅ Production-ready

**Main URLs:**
- Admin: `http://localhost:3000/page/cms`
- Reporter: `http://localhost:3000/page/cms/reporter`

🚀 **Happy routing!**
