# 🔄 Migration Guide: VHV CMS → VHV Platform Framework

Hướng dẫn chi tiết về việc chuyển đổi CMS từ architecture cũ sang **VHV Platform React Framework**.

## 📋 Tổng Quan

### Thay Đổi Chính

| Trước | Sau | Lý do |
|-------|-----|-------|
| Component-based | **Module-based** | Auto-discovery, better organization |
| Custom Auth | **@longvhv/auth** | JWT, OAuth, secure tokens |
| Custom API client | **@longvhv/api-client** | Interceptors, error handling |
| Custom Toast | **@longvhv/notifications** | react-hot-toast integration |
| Manual state | **@longvhv/query** | React Query caching |
| Custom theme | **@longvhv/theme** | Dark/Light mode system |
| Custom i18n | **@longvhv/i18n** | 6 languages support |

## 🏗️ Kiến Trúc Mới

### 1. Module System

**Trước:**
```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/articles" element={<Articles />} />
</Routes>
```

**Sau:**
```tsx
// modules/dashboard/index.ts
export const dashboardModule: ModuleConfig = {
  id: 'dashboard',
  name: 'Dashboard',
  routes,
  permissions: ['dashboard.view'],
};

// App.tsx
<AppCore modules={[dashboardModule, articlesModule]} />
```

**Lợi ích:**
- ✅ Auto-discovery modules
- ✅ Dependency management
- ✅ Hot Module Replacement
- ✅ Independent development
- ✅ Permission-based loading

### 2. Authentication

**Trước:**
```tsx
// Custom AuthContext
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };
  
  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Sau:**
```tsx
// Using @longvhv/auth
import { AuthProvider, useAuth } from '@longvhv/auth';

function App() {
  return (
    <AuthProvider
      apiUrl={process.env.VITE_API_URL}
      onLoginSuccess={() => console.log('Logged in')}
    >
      <YourApp />
    </AuthProvider>
  );
}

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <h1>Welcome {user.firstName}</h1>
      ) : (
        <LoginForm onSubmit={login} />
      )}
    </div>
  );
}
```

**Lợi ích:**
- ✅ JWT token management
- ✅ OAuth support (Google, GitHub)
- ✅ Automatic token refresh
- ✅ Secure storage
- ✅ Protected routes component

### 3. Data Fetching

**Trước:**
```tsx
function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <ul>{articles.map(a => <li>{a.title}</li>)}</ul>;
}
```

**Sau:**
```tsx
import { useFetch } from '@longvhv/query';

function ArticleList() {
  const { data: articles, isLoading } = useFetch(
    'articles',
    () => api.get('/articles')
  );
  
  if (isLoading) return <Spinner />;
  
  return <ul>{articles.map(a => <li>{a.title}</li>)}</ul>;
}
```

**Lợi ích:**
- ✅ Automatic caching
- ✅ Background refetch
- ✅ Optimistic updates
- ✅ Pagination support
- ✅ Error handling
- ✅ Loading states

### 4. Notifications

**Trước:**
```tsx
// Custom toast implementation
const [toast, setToast] = useState(null);

const showToast = (message) => {
  setToast(message);
  setTimeout(() => setToast(null), 3000);
};

return (
  <>
    {toast && <div className="toast">{toast}</div>}
    <button onClick={() => showToast('Saved!')}>Save</button>
  </>
);
```

**Sau:**
```tsx
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  
  const handleSave = async () => {
    await notifications.promise(
      api.save(data),
      {
        loading: 'Saving...',
        success: 'Saved successfully!',
        error: 'Failed to save',
      }
    );
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

**Lợi ích:**
- ✅ Promise-based notifications
- ✅ 4 types (success, error, warning, info)
- ✅ Auto-dismiss
- ✅ Customizable position
- ✅ Beautiful animations

### 5. Theme Management

**Trước:**
```tsx
const [isDark, setIsDark] = useState(false);

const toggleTheme = () => {
  setIsDark(!isDark);
  document.body.classList.toggle('dark');
};

return (
  <button onClick={toggleTheme}>
    {isDark ? 'Light' : 'Dark'}
  </button>
);
```

**Sau:**
```tsx
import { useTheme } from '@longvhv/theme';

function ThemeToggle() {
  const { isDark, toggleMode } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

// In App.tsx
<ThemeProvider defaultMode="system">
  <YourApp />
</ThemeProvider>
```

**Lợi ích:**
- ✅ System preference detection
- ✅ localStorage persistence
- ✅ CSS variable integration
- ✅ Smooth transitions

### 6. Internationalization

**Trước:**
```tsx
const translations = {
  en: { hello: 'Hello' },
  vi: { hello: 'Xin chào' },
};

const [lang, setLang] = useState('vi');

return <h1>{translations[lang].hello}</h1>;
```

**Sau:**
```tsx
import { useTranslation } from '@longvhv/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <>
      <h1>{t('hello')}</h1>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </>
  );
}

// In App.tsx
<I18nProvider defaultLanguage="vi">
  <YourApp />
</I18nProvider>
```

**Lợi ích:**
- ✅ 6 languages support
- ✅ 200+ translations
- ✅ Type-safe keys
- ✅ Easy to extend

## 📦 Cấu Trúc Thư Mục

### Trước
```
src/
├── components/
│   ├── Dashboard.tsx
│   ├── ArticleManagement.tsx
│   ├── MediaManagement.tsx
│   └── ...
├── App.tsx
└── main.tsx
```

### Sau
```
src/
├── modules/               # Module-based architecture
│   ├── dashboard/
│   │   ├── index.ts      # Module config
│   │   ├── routes.tsx    # Routes
│   │   ├── pages/        # Page components
│   │   │   └── DashboardPage.tsx
│   │   └── components/   # Module-specific components
│   ├── articles/
│   │   ├── index.ts
│   │   ├── routes.tsx
│   │   └── pages/
│   │       ├── ArticleListPage.tsx
│   │       └── ArticleEditorPage.tsx
│   └── media/
│       ├── index.ts
│       ├── routes.tsx
│       └── pages/
│           └── MediaLibraryPage.tsx
├── components/           # Shared components
│   └── Layout.tsx
├── services/             # API services
├── types/                # TypeScript types
├── App.tsx               # Application entry
└── main.tsx              # Entry point
```

## 🔄 Migration Steps

### Step 1: Setup Dependencies

```bash
# Install framework packages
pnpm add @longvhv/core @longvhv/auth @longvhv/query
pnpm add @longvhv/theme @longvhv/notifications @longvhv/i18n
pnpm add @longvhv/ui-components @longvhv/shared
```

### Step 2: Create Module Structure

```bash
# Create modules directory
mkdir -p src/modules

# Create first module
mkdir -p src/modules/dashboard/{pages,components}
touch src/modules/dashboard/index.ts
touch src/modules/dashboard/routes.tsx
touch src/modules/dashboard/pages/DashboardPage.tsx
```

### Step 3: Convert Components to Modules

**Old Component:**
```tsx
// components/Dashboard.tsx
export function Dashboard() {
  return <div>Dashboard</div>;
}
```

**New Module:**
```tsx
// modules/dashboard/index.ts
export const dashboardModule: ModuleConfig = {
  id: 'dashboard',
  name: 'Dashboard',
  routes,
};

// modules/dashboard/routes.tsx
export const routes: RouteObject[] = [
  { path: '/', element: <DashboardPage /> },
];

// modules/dashboard/pages/DashboardPage.tsx
function DashboardPage() {
  return <div>Dashboard</div>;
}
export default DashboardPage;
```

### Step 4: Update App.tsx

```tsx
import { AppCore } from '@longvhv/core';
import { ThemeProvider } from '@longvhv/theme';
import { QueryProvider } from '@longvhv/query';
import { AuthProvider } from '@longvhv/auth';

// Import modules
import dashboardModule from './modules/dashboard';
import articlesModule from './modules/articles';

const modules = [dashboardModule, articlesModule];

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider apiUrl={import.meta.env.VITE_API_URL}>
          <Router>
            <AppCore modules={modules}>
              <Layout />
            </AppCore>
          </Router>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
```

### Step 5: Update Layout

Use framework packages in Layout:

```tsx
import { useAuth } from '@longvhv/auth';
import { useTheme } from '@longvhv/theme';
import { useTranslation } from '@longvhv/i18n';
```

### Step 6: Update API Calls

Replace fetch with `@longvhv/query`:

```tsx
// Before
useEffect(() => {
  fetch('/api/articles').then(...)
}, []);

// After
const { data } = useFetch('articles', () => api.get('/articles'));
```

### Step 7: Update Notifications

Replace custom toast with `@longvhv/notifications`:

```tsx
// Before
setToast('Saved!');

// After
notifications.success('Saved!');
```

## 🎯 Best Practices

### 1. Module Organization

✅ **DO:**
- One feature per module
- Keep modules independent
- Use clear naming conventions
- Define permissions per module

❌ **DON'T:**
- Mix unrelated features
- Create circular dependencies
- Use hardcoded paths
- Skip permission definitions

### 2. Component Structure

✅ **DO:**
```tsx
// Good: Using framework packages
import { useFetch } from '@longvhv/query';
import { useAuth } from '@longvhv/auth';
import { Button } from '@longvhv/ui-components';

function MyPage() {
  const { data } = useFetch('key', fetcher);
  const { user } = useAuth();
  
  return <Button onClick={...}>Click</Button>;
}
```

❌ **DON'T:**
```tsx
// Bad: Reinventing the wheel
function MyPage() {
  const [data, setData] = useState();
  const [user, setUser] = useState();
  
  useEffect(() => {
    fetch(...).then(setData);
  }, []);
  
  return <button className="...">Click</button>;
}
```

### 3. State Management

✅ **DO:**
- Use `@longvhv/query` for server state
- Use `@longvhv/context` for tenant context
- Use React hooks for local state

❌ **DON'T:**
- Create custom data fetching
- Mix server and client state
- Duplicate context providers

## 🐛 Troubleshooting

### Issue: Module not discovered

**Solution:**
```tsx
// Make sure module is exported as default
export default myModule;

// And imported in App.tsx
import myModule from './modules/my-module';
```

### Issue: Auth not working

**Solution:**
```tsx
// Ensure AuthProvider wraps entire app
<AuthProvider apiUrl="...">
  <Router>
    <AppCore modules={modules}>
      <Layout />
    </AppCore>
  </Router>
</AuthProvider>
```

### Issue: Dark mode not working

**Solution:**
```tsx
// Wrap app with ThemeProvider
<ThemeProvider defaultMode="system">
  <YourApp />
</ThemeProvider>

// Ensure Tailwind config has darkMode
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
};
```

## 📚 Resources

- [Framework Documentation](https://github.com/vhvplatform/react-framework)
- [API Reference](./docs/API.md)
- [Examples](./docs/EXAMPLES.md)
- [TypeScript Guide](./docs/TYPESCRIPT.md)

## 🎉 Benefits After Migration

✅ **Developer Experience:**
- Auto-discovery modules
- Hot Module Replacement
- Type-safe APIs
- Reusable packages

✅ **Performance:**
- Automatic code splitting
- React Query caching
- Optimized builds
- Lazy loading

✅ **Maintainability:**
- Clear module boundaries
- Shared utilities
- Consistent patterns
- Easy testing

✅ **Features:**
- Dark mode built-in
- Multi-language support
- Professional UI components
- Enterprise authentication

---

**Happy Migrating! 🚀**
