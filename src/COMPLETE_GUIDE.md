# 📘 VHV CMS - Complete Integration Guide

**Hướng dẫn toàn diện về việc tích hợp VHV CMS với VHV Platform React Framework**

---

## 🎯 Tổng Quan

VHV CMS là một **enterprise-grade Content Management System** được xây dựng hoàn toàn trên **VHV Platform React Framework**, hỗ trợ:

- ✅ **14+ loại nội dung** (News, Video, Gallery, Jobs, Events, Documents...)
- ✅ **Module-based architecture** với auto-discovery
- ✅ **JWT authentication** + OAuth (Google, GitHub)
- ✅ **React Query** cho data fetching & caching
- ✅ **Dark/Light mode** với system preference
- ✅ **Multi-language** (Tiếng Việt, English + 4 ngôn ngữ khác)
- ✅ **Real-time notifications** với toast system
- ✅ **Workflow approval** (Draft → Review → Publish)
- ✅ **Media library** với folder structure
- ✅ **Analytics dashboard** với interactive charts

---

## 📂 Cấu Trúc Dự Án

```
vhv-cms/
├── src/
│   ├── modules/              # Module-based architecture
│   │   ├── dashboard/        # Dashboard module
│   │   │   ├── index.ts      # Module config (ModuleConfig)
│   │   │   ├── routes.tsx    # Route definitions
│   │   │   └── pages/
│   │   │       └── DashboardPage.tsx
│   │   │
│   │   ├── articles/         # Articles management
│   │   │   ├── index.ts
│   │   │   ├── routes.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ArticleListPage.tsx
│   │   │   │   ├── ArticleEditorPage.tsx
│   │   │   │   └── ArticleDetailPage.tsx
│   │   │   └── services/
│   │   │       └── articleService.ts
│   │   │
│   │   ├── media/            # Media library
│   │   ├── analytics/        # Analytics & stats
│   │   ├── users/            # User management
│   │   └── settings/         # System settings
│   │
│   ├── components/           # Shared components
│   │   ├── Layout.tsx        # Main layout with sidebar
│   │   └── ErrorBoundary.tsx # Error handling
│   │
│   ├── services/             # API integration
│   │   └── api.ts            # ApiClient instance
│   │
│   ├── hooks/                # Custom hooks
│   │   └── useArticles.ts    # Article operations hook
│   │
│   ├── types/                # TypeScript definitions
│   │   └── article.ts        # Article types
│   │
│   ├── App.tsx               # Main app with providers
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + theme
│
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
│
├── README.md                 # Project overview
├── SETUP_INSTRUCTIONS.md     # Setup guide
├── MIGRATION_GUIDE.md        # Migration from old architecture
├── FRAMEWORK_INTEGRATION.md  # Framework integration details
└── COMPLETE_GUIDE.md         # This file
```

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
✅ Node.js >= 18.0.0
✅ pnpm >= 8.0.0
```

### 2. Installation

```bash
# Clone repository
git clone <your-repo-url>
cd vhv-cms

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

Application will run at: **http://localhost:3000**

### 3. Environment Configuration

Edit `.env`:

```env
# Required
VITE_API_URL=http://localhost:8080

# Optional
VITE_DEFAULT_LANGUAGE=vi
VITE_DEFAULT_THEME=system
VITE_ENABLE_ANALYTICS=true
```

---

## 📦 Framework Packages Integration

### Package Map

| Package | Purpose | Used In |
|---------|---------|---------|
| `@longvhv/core` | Module system, lifecycle | `/src/App.tsx`, modules |
| `@longvhv/auth` | Authentication (JWT, OAuth) | `/src/App.tsx`, Layout |
| `@longvhv/query` | React Query integration | All data fetching |
| `@longvhv/theme` | Dark/Light mode | Layout, global |
| `@longvhv/notifications` | Toast notifications | Throughout app |
| `@longvhv/i18n` | Multi-language | Layout, pages |
| `@longvhv/api-client` | HTTP client | `/src/services/api.ts` |
| `@longvhv/shared` | Utilities (50+) | Throughout app |
| `@longvhv/forms` | Form handling | Future form pages |
| `@longvhv/crud` | CRUD operations | Future list pages |

### Provider Hierarchy

```tsx
// src/App.tsx
<ErrorBoundary>
  <ThemeProvider>
    <I18nProvider>
      <QueryProvider>
        <NotificationProvider />
        <AuthProvider>
          <Router>
            <AppCore modules={modules}>
              <Layout />
            </AppCore>
          </Router>
        </AuthProvider>
      </QueryProvider>
    </I18nProvider>
  </ThemeProvider>
</ErrorBoundary>
```

**Explanation:**
1. **ErrorBoundary** - Catches React errors
2. **ThemeProvider** - Dark/Light mode context
3. **I18nProvider** - Language context
4. **QueryProvider** - React Query client
5. **NotificationProvider** - Toast system
6. **AuthProvider** - User authentication
7. **Router** - React Router
8. **AppCore** - Module registry & routing

---

## 🏗️ Module Development

### Creating a New Module

#### Step 1: Create Module Structure

```bash
mkdir -p src/modules/my-module/{pages,components,services,hooks}
touch src/modules/my-module/index.ts
touch src/modules/my-module/routes.tsx
touch src/modules/my-module/pages/MyPage.tsx
```

#### Step 2: Define Module Config

```typescript
// src/modules/my-module/index.ts
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const myModule: ModuleConfig = {
  id: 'my-module',
  name: 'My Module',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'], // Optional dependencies
  permissions: ['my-module.view', 'my-module.edit'],
};

export default myModule;
```

#### Step 3: Define Routes

```typescript
// src/modules/my-module/routes.tsx
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const MyPage = lazy(() => import('./pages/MyPage'));

export const routes: RouteObject[] = [
  {
    path: '/my-module',
    element: <MyPage />,
  },
];
```

#### Step 4: Create Page Component

```tsx
// src/modules/my-module/pages/MyPage.tsx
import React from 'react';
import { useFetch } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useTranslation } from '@longvhv/i18n';

const MyPage: React.FC = () => {
  const { t } = useTranslation();
  const notifications = useNotifications();
  
  const { data, isLoading } = useFetch('my-data', async () => {
    // Fetch data
    return [];
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{t('myModule.title')}</h1>
      {/* Your content */}
    </div>
  );
};

export default MyPage;
```

#### Step 5: Register Module

```tsx
// src/App.tsx
import myModule from './modules/my-module';

const modules = [
  dashboardModule,
  articlesModule,
  myModule, // Add here
  // ...
];
```

**That's it!** Module is auto-discovered and registered.

---

## 🔐 Authentication Flow

### How It Works

1. **User logs in** → `login()` from `useAuth()`
2. **JWT token received** → Stored in localStorage
3. **ApiClient auto-injects token** → All API calls authenticated
4. **Token expires?** → Auto-redirect to login (401 handler)
5. **User logs out** → `logout()` clears token

### Usage Example

```tsx
import { useAuth } from '@longvhv/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        login({
          email: 'user@example.com',
          password: 'password',
        });
      }}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

Framework handles automatically via permissions in `ModuleConfig`:

```typescript
export const myModule: ModuleConfig = {
  // ...
  permissions: ['my-module.view'], // Only users with this permission can access
};
```

---

## 📡 Data Fetching Pattern

### Using useFetch (Read)

```tsx
import { useFetch } from '@longvhv/query';
import { apiClient } from '@/services/api';

function ArticleList() {
  const { data, isLoading, error, refetch } = useFetch(
    ['articles', { status: 'published' }], // Query key
    () => apiClient.get('/articles?status=published') // Fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Using useMutate (Write)

```tsx
import { useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useQueryClient } from '@tanstack/react-query';

function ArticleActions({ articleId }) {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const { mutate: deleteArticle, isPending } = useMutate(
    (id: string) => apiClient.delete(`/articles/${id}`),
    {
      onSuccess: () => {
        notifications.success('Article deleted!');
        queryClient.invalidateQueries(['articles']); // Refetch
      },
      onError: (error) => {
        notifications.error(error.message);
      },
    }
  );

  return (
    <button 
      onClick={() => deleteArticle(articleId)}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Custom Hook Pattern

```typescript
// src/hooks/useArticles.ts
import { useFetch, useMutate } from '@longvhv/query';
import { articleService } from '@/modules/articles/services/articleService';

export function useArticles() {
  const { data: articles, isLoading } = useFetch(
    'articles',
    () => articleService.getAll()
  );

  const { mutate: createArticle } = useMutate(
    (data) => articleService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['articles']);
      },
    }
  );

  return {
    articles,
    isLoading,
    createArticle,
  };
}
```

---

## 🎨 Theming & Styling

### Theme System

```tsx
import { useTheme } from '@longvhv/theme';

function ThemeToggle() {
  const { isDark, toggleMode, mode, setMode } = useTheme();

  return (
    <div>
      <button onClick={toggleMode}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Or specific mode */}
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
```

### CSS Variables

Theme colors are defined in `/src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --background: 0 0% 100%;
  /* ... */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  /* ... */
}
```

Use with Tailwind:

```tsx
<div className="bg-primary text-primary-foreground">
  Primary colored box
</div>
```

### Custom Utilities

```css
/* Gradient text */
.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

/* Glassmorphism */
.glass {
  @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 🌐 Internationalization

### Setup

```tsx
// App.tsx
<I18nProvider defaultLanguage="vi">
  <YourApp />
</I18nProvider>
```

### Usage

```tsx
import { useTranslation } from '@longvhv/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('articles.total', { count: 10 })}</p>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="vi">🇻🇳 Tiếng Việt</option>
        <option value="en">🇬🇧 English</option>
      </select>
    </div>
  );
}
```

### Adding Translations

Framework provides 200+ built-in translations. To add custom:

```typescript
// In your module
const translations = {
  vi: {
    'myModule.title': 'Tiêu đề của tôi',
    'myModule.description': 'Mô tả',
  },
  en: {
    'myModule.title': 'My Title',
    'myModule.description': 'Description',
  },
};
```

---

## 🔔 Notifications

### Types

```tsx
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();

  return (
    <div>
      <button onClick={() => notifications.success('Success!')}>
        Success
      </button>
      
      <button onClick={() => notifications.error('Error occurred')}>
        Error
      </button>
      
      <button onClick={() => notifications.warning('Warning!')}>
        Warning
      </button>
      
      <button onClick={() => notifications.info('Info message')}>
        Info
      </button>
    </div>
  );
}
```

### Promise-based

```tsx
async function saveArticle() {
  await notifications.promise(
    apiClient.post('/articles', data),
    {
      loading: 'Saving article...',
      success: 'Article saved successfully!',
      error: 'Failed to save article',
    }
  );
}
```

---

## 🧪 Testing (Future)

Framework provides `@longvhv/testing` package:

```typescript
import { render, screen } from '@longvhv/testing';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## 🚀 Deployment

### Build

```bash
pnpm build
```

Output: `dist/` directory

### Environment Variables

Production `.env`:

```env
VITE_API_URL=https://api.production.com
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=true
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "preview"]
```

### Vercel

```bash
vercel --prod
```

---

## 📊 Best Practices

### 1. Module Organization

✅ **DO:**
- One feature per module
- Clear, descriptive names
- Self-contained components
- Well-defined dependencies

❌ **DON'T:**
- Mix unrelated features
- Create circular dependencies
- Hard-code API URLs
- Skip permission definitions

### 2. State Management

✅ **DO:**
- Use `useFetch` for server data
- Use React hooks for local state
- Use `@longvhv/context` for global app state
- Cache with React Query

❌ **DON'T:**
- Mix server and client state
- Create custom data fetching
- Duplicate state across components
- Skip error handling

### 3. API Integration

✅ **DO:**
- Use `apiClient` from `/src/services/api.ts`
- Create service layer (e.g., `articleService`)
- Handle errors gracefully
- Use TypeScript types

❌ **DON'T:**
- Use `fetch` directly
- Skip error handling
- Ignore loading states
- Hard-code endpoints

### 4. Components

✅ **DO:**
- Use framework packages
- Lazy load pages
- Handle loading states
- Show error messages

❌ **DON'T:**
- Reinvent components
- Skip accessibility
- Ignore mobile responsiveness
- Skip TypeScript types

---

## 🐛 Troubleshooting

### Module not discovered

**Problem:** Module doesn't appear in app

**Solution:**
1. Check `index.ts` exports default
2. Verify module is imported in `App.tsx`
3. Check console for errors

### Authentication not working

**Problem:** User can't login

**Solution:**
1. Check `VITE_API_URL` in `.env`
2. Verify backend is running
3. Check network tab for 401 errors
4. Verify `AuthProvider` wraps app

### Dark mode not working

**Problem:** Theme toggle doesn't work

**Solution:**
1. Check `ThemeProvider` wraps app
2. Verify Tailwind config has `darkMode: 'class'`
3. Check CSS variables in `/src/index.css`

### Data not fetching

**Problem:** `useFetch` doesn't return data

**Solution:**
1. Check API endpoint
2. Verify authentication token
3. Check network tab
4. Review query key uniqueness

---

## 📚 Additional Resources

- **[README.md](./README.md)** - Project overview
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Detailed setup
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Migration from old architecture
- **[FRAMEWORK_INTEGRATION.md](./FRAMEWORK_INTEGRATION.md)** - Framework details

- **[Framework Repository](https://github.com/vhvplatform/react-framework)** - Source code
- **[Framework Docs](https://github.com/vhvplatform/react-framework/docs)** - Full documentation

---

## 🆘 Support

- 📧 **Email:** support@vhvplatform.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/vhvplatform/react-framework/discussions)

---

**Built with ❤️ using VHV Platform React Framework**
