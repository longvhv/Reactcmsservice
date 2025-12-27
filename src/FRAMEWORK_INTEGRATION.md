# 🔗 Framework Integration Guide

Chi tiết cách **VHV CMS** tích hợp với **VHV Platform React Framework**.

## 📦 Framework Packages Used

### 1. @longvhv/core - Module System

**Mục đích:** Auto-discovery modules, lifecycle management, routing integration

**Cách sử dụng:**

```tsx
// App.tsx
import { AppCore } from '@longvhv/core';

const modules = [
  dashboardModule,
  articlesModule,
  mediaModule,
];

<AppCore modules={modules}>
  <Layout />
</AppCore>
```

**Module Config:**

```typescript
// modules/dashboard/index.ts
import { ModuleConfig } from '@longvhv/core';

export const dashboardModule: ModuleConfig = {
  id: 'dashboard',
  name: 'Dashboard',
  version: '1.0.0',
  routes,
  dependencies: [],
  permissions: ['dashboard.view'],
};
```

**Benefits:**
- ✅ Auto-discovery và registration
- ✅ Dependency management
- ✅ Hot Module Replacement
- ✅ Permission-based loading
- ✅ Parallel development

---

### 2. @longvhv/auth - Authentication

**Mục đích:** JWT authentication, OAuth, session management

**Cách sử dụng:**

```tsx
// App.tsx
import { AuthProvider } from '@longvhv/auth';

<AuthProvider
  apiUrl={process.env.VITE_API_URL}
  onLoginSuccess={() => console.log('Logged in')}
  onLogoutSuccess={() => console.log('Logged out')}
>
  <YourApp />
</AuthProvider>

// Component
import { useAuth } from '@longvhv/auth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }
  
  return <div>Welcome {user.firstName}!</div>;
}
```

**Features:**
- ✅ JWT token management
- ✅ OAuth (Google, GitHub)
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ Secure storage
- ✅ 401 handling

**Integration Points:**
- `/src/App.tsx` - AuthProvider wrapper
- `/src/components/Layout.tsx` - useAuth for user info
- `/src/services/api.ts` - Automatic token injection

---

### 3. @longvhv/query - Data Fetching

**Mục đích:** React Query integration, caching, mutations

**Cách sử dụng:**

```tsx
// App.tsx
import { QueryProvider } from '@longvhv/query';

<QueryProvider>
  <YourApp />
</QueryProvider>

// Component
import { useFetch, useMutate } from '@longvhv/query';

function ArticleList() {
  // Fetch data với auto-caching
  const { data, isLoading } = useFetch(
    'articles',
    () => api.get('/articles')
  );
  
  // Mutation với optimistic updates
  const { mutate: deleteArticle } = useMutate(
    (id) => api.delete(`/articles/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('articles');
      },
    }
  );
  
  return (
    <ul>
      {data?.map(article => (
        <li key={article.id}>
          {article.title}
          <button onClick={() => deleteArticle(article.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

**Features:**
- ✅ Automatic caching
- ✅ Background refetch
- ✅ Optimistic updates
- ✅ Pagination support
- ✅ Query invalidation
- ✅ Loading states

**Integration Points:**
- `/src/App.tsx` - QueryProvider wrapper
- `/src/modules/articles/pages/ArticleListPage.tsx` - useFetch for articles
- `/src/hooks/useArticles.ts` - Custom hooks với useMutate

---

### 4. @longvhv/theme - Theme Management

**Mục đích:** Dark/Light mode, system preference support

**Cách sử dụng:**

```tsx
// App.tsx
import { ThemeProvider } from '@longvhv/theme';

<ThemeProvider defaultMode="system">
  <YourApp />
</ThemeProvider>

// Component
import { useTheme } from '@longvhv/theme';

function ThemeToggle() {
  const { isDark, toggleMode, mode } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

**Features:**
- ✅ Dark/Light/System modes
- ✅ localStorage persistence
- ✅ CSS variable integration
- ✅ Smooth transitions
- ✅ System preference detection

**Integration Points:**
- `/src/App.tsx` - ThemeProvider wrapper
- `/src/components/Layout.tsx` - useTheme for toggle button
- `/src/index.css` - CSS variables for colors

---

### 5. @longvhv/notifications - Toast Notifications

**Mục đích:** Beautiful toast notifications với react-hot-toast

**Cách sử dụng:**

```tsx
// App.tsx
import { NotificationProvider } from '@longvhv/notifications';

<NotificationProvider />

// Component
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  
  // Simple notification
  notifications.success('Saved!');
  notifications.error('Failed!');
  
  // Promise-based
  await notifications.promise(
    api.save(data),
    {
      loading: 'Saving...',
      success: 'Saved successfully!',
      error: 'Failed to save',
    }
  );
}
```

**Features:**
- ✅ 4 types (success, error, warning, info)
- ✅ Promise-based notifications
- ✅ Auto-dismiss
- ✅ Customizable position
- ✅ Beautiful animations

**Integration Points:**
- `/src/App.tsx` - NotificationProvider
- `/src/modules/articles/pages/ArticleListPage.tsx` - useNotifications
- `/src/hooks/useArticles.ts` - Notifications in mutations

---

### 6. @longvhv/i18n - Internationalization

**Mục đích:** Multi-language support (6 languages)

**Cách sử dụng:**

```tsx
// App.tsx
import { I18nProvider } from '@longvhv/i18n';

<I18nProvider defaultLanguage="vi">
  <YourApp />
</I18nProvider>

// Component
import { useTranslation } from '@longvhv/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

**Supported Languages:**
- 🇻🇳 Vietnamese (vi)
- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇨🇳 Chinese (zh)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)

**Integration Points:**
- `/src/App.tsx` - I18nProvider wrapper
- `/src/components/Layout.tsx` - Language switcher
- `/src/modules/*/pages/*.tsx` - useTranslation for texts

---

### 7. @longvhv/api-client - HTTP Client

**Mục đích:** Axios wrapper với interceptors, error handling

**Cách sử dụng:**

```tsx
import { ApiClient } from '@longvhv/api-client';

export const api = new ApiClient({
  baseURL: process.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-configured features:
// - JWT token injection (via @longvhv/auth)
// - Request/Response transformers
// - Error handling
// - 401 redirect to login
```

**Features:**
- ✅ Axios-based
- ✅ Interceptors for auth
- ✅ Error handling
- ✅ Request/Response transform
- ✅ Timeout management

**Integration Points:**
- `/src/services/api.ts` - API client instance
- `/src/modules/*/services/*.ts` - Service layer

---

### 8. @longvhv/shared - Utilities

**Mục đích:** 50+ utility functions and hooks

**Cách sử dụng:**

```tsx
import { 
  formatDate,
  formatCurrency,
  debounce,
  useDebounce,
  useLocalStorage,
  usePagination,
} from '@longvhv/shared';

// Format date
const formattedDate = formatDate(new Date()); // "Jan 15, 2024"

// Debounce hook
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

// Local storage hook
const [theme, setTheme] = useLocalStorage('theme', 'light');

// Pagination hook
const { page, limit, setPage, setLimit } = usePagination({
  initialPage: 1,
  initialLimit: 20,
});
```

**Categories:**
- 📅 Date utilities
- 💰 Currency formatting
- 🔤 String manipulation
- 📊 Array utilities
- 🎣 React hooks
- ✅ Validation helpers

**Integration Points:**
- Used throughout all modules for common operations

---

## 🏗️ Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ErrorBoundary                                     │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ ThemeProvider (@longvhv/theme)            │  │  │
│  │  │  ┌──────────────────────────────────────┐ │  │  │
│  │  │  │ I18nProvider (@longvhv/i18n)        │ │  │  │
│  │  │  │  ┌────────────────────────────────┐ │ │  │  │
│  │  │  │  │ QueryProvider (@longvhv/query)│ │ │  │  │
│  │  │  │  │  ┌──────────────────────────┐  │ │ │  │  │
│  │  │  │  │  │ NotificationProvider    │  │ │ │  │  │
│  │  │  │  │  │ (@longvhv/notifications)│  │ │ │  │  │
│  │  │  │  │  │  ┌────────────────────┐ │  │ │ │  │  │
│  │  │  │  │  │  │ AuthProvider      │ │  │ │ │  │  │
│  │  │  │  │  │  │ (@longvhv/auth)   │ │  │ │ │  │  │
│  │  │  │  │  │  │  ┌──────────────┐ │ │  │ │ │  │  │
│  │  │  │  │  │  │  │ Router       │ │ │  │ │ │  │  │
│  │  │  │  │  │  │  │  ┌────────┐  │ │ │  │ │ │  │  │
│  │  │  │  │  │  │  │  │AppCore │  │ │ │  │ │ │  │  │
│  │  │  │  │  │  │  │  │(@core) │  │ │ │  │ │ │  │  │
│  │  │  │  │  │  │  │  │ Layout │  │ │ │  │ │ │  │  │
│  │  │  │  │  │  │  │  └────────┘  │ │ │  │ │ │  │  │
│  │  │  │  │  │  │  └──────────────┘ │ │  │ │ │  │  │
│  │  │  │  │  │  └────────────────────┘ │  │ │ │  │  │
│  │  │  │  │  └──────────────────────────┘  │ │ │  │  │
│  │  │  │  └────────────────────────────────┘ │ │  │  │
│  │  │  └──────────────────────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Article Fetching Flow

```
Component (ArticleListPage.tsx)
    │
    └─> useArticles() hook
            │
            └─> useFetch() from @longvhv/query
                    │
                    └─> articleService.getAll()
                            │
                            └─> apiClient.get() from @longvhv/api-client
                                    │
                                    ├─> Add JWT token (via @longvhv/auth)
                                    ├─> Send request to backend
                                    ├─> Handle errors
                                    └─> Return data
                                            │
                                            └─> React Query cache
                                                    │
                                                    └─> Component renders
```

### 2. Article Creation Flow

```
Component (ArticleEditor)
    │
    └─> createArticle() mutation
            │
            └─> useMutate() from @longvhv/query
                    │
                    └─> articleService.create()
                            │
                            └─> apiClient.post()
                                    │
                                    ├─> Success?
                                    │   ├─> notifications.success()
                                    │   └─> queryClient.invalidateQueries()
                                    │           │
                                    │           └─> Refetch articles list
                                    │
                                    └─> Error?
                                        └─> notifications.error()
```

---

## 📂 File Structure by Framework Package

```
src/
├── App.tsx                    # All providers integrated
├── main.tsx                   # Entry point
├── index.css                  # Theme CSS variables
│
├── components/
│   ├── Layout.tsx             # useAuth, useTheme, useTranslation
│   └── ErrorBoundary.tsx      # Error handling
│
├── modules/                   # Module-based architecture
│   ├── dashboard/
│   │   ├── index.ts           # ModuleConfig from @longvhv/core
│   │   ├── routes.tsx         # Route definitions
│   │   └── pages/
│   │       └── DashboardPage.tsx  # useFetch, useNotifications
│   │
│   └── articles/
│       ├── index.ts           # ModuleConfig
│       ├── routes.tsx         # Routes
│       ├── pages/
│       │   └── ArticleListPage.tsx  # useFetch, useMutate
│       └── services/
│           └── articleService.ts     # ApiClient usage
│
├── services/
│   └── api.ts                 # ApiClient instance
│
├── hooks/
│   └── useArticles.ts         # Custom hook combining framework packages
│
└── types/
    └── article.ts             # TypeScript definitions
```

---

## ✅ Best Practices

### 1. Module Organization

```typescript
// ✅ GOOD: Clear module structure
modules/
  articles/
    index.ts              # Module config
    routes.tsx            # Routes
    pages/                # Page components
    components/           # Module-specific components
    services/             # API services
    hooks/                # Module-specific hooks
    types/                # Module-specific types
```

### 2. Using Framework Hooks

```tsx
// ✅ GOOD: Use framework hooks
import { useFetch } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  const { data } = useFetch('key', fetcher);
  
  // ...
}

// ❌ BAD: Custom implementation
function MyComponent() {
  const [data, setData] = useState();
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
}
```

### 3. Service Layer

```typescript
// ✅ GOOD: Use ApiClient
import { apiClient } from '@/services/api';

class ArticleService {
  async getAll() {
    const response = await apiClient.get('/articles');
    return response.data;
  }
}

// ❌ BAD: Direct fetch
class ArticleService {
  async getAll() {
    const response = await fetch('/api/articles');
    return response.json();
  }
}
```

---

## 🚀 Benefits Summary

| Feature | Before | After (Framework) |
|---------|--------|-------------------|
| **Auth** | Custom implementation | `@longvhv/auth` - JWT + OAuth |
| **Data Fetching** | useEffect + fetch | `@longvhv/query` - React Query |
| **Notifications** | Custom toast | `@longvhv/notifications` - react-hot-toast |
| **Theme** | Manual dark mode | `@longvhv/theme` - System aware |
| **i18n** | Custom translations | `@longvhv/i18n` - 6 languages |
| **Module System** | Manual routing | `@longvhv/core` - Auto-discovery |
| **API Client** | Axios instance | `@longvhv/api-client` - Interceptors |
| **Utilities** | Custom utils | `@longvhv/shared` - 50+ utils |

---

## 📚 Resources

- [Framework Repository](https://github.com/vhvplatform/react-framework)
- [Framework Documentation](https://github.com/vhvplatform/react-framework/docs)
- [Module Development Guide](./MIGRATION_GUIDE.md)
- [API Reference](./docs/API.md)

---

**Built with ❤️ using VHV Platform React Framework**
