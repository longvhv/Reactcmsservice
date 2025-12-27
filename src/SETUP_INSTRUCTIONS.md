# 🚀 VHV CMS - Setup Instructions

Hướng dẫn chi tiết để setup và chạy VHV CMS với VHV Platform Framework.

## 📋 Prerequisites

### Required Software

```bash
✅ Node.js >= 18.0.0
✅ pnpm >= 8.0.0
✅ Git
```

### Check Versions

```bash
node --version   # Should be >= v18.0.0
pnpm --version   # Should be >= 8.0.0
```

### Install pnpm (if needed)

```bash
npm install -g pnpm
```

## 🛠️ Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/vhv-cms.git
cd vhv-cms
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install:
- React & React Router
- VHV Platform Framework packages
- Vite & dev tools
- TypeScript & types
- Tailwind CSS

### Step 3: Environment Configuration

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Required Variables:**
```env
VITE_API_URL=http://localhost:8080    # Your backend API URL
VITE_APP_NAME=VHV CMS                 # App name
```

**Optional Variables:**
```env
VITE_GOOGLE_CLIENT_ID=...             # For Google OAuth
VITE_GITHUB_CLIENT_ID=...             # For GitHub OAuth
VITE_DEFAULT_LANGUAGE=vi              # Default language (vi/en)
```

### Step 4: Start Development Server

```bash
pnpm dev
```

Application will open at: **http://localhost:3000**

## 🏗️ Project Structure

```
vhv-cms/
├── src/
│   ├── modules/              # Auto-discovered modules
│   │   ├── dashboard/        # Dashboard module
│   │   │   ├── index.ts      # Module config
│   │   │   ├── routes.tsx    # Routes
│   │   │   └── pages/        # Page components
│   │   ├── articles/         # Articles module
│   │   ├── media/            # Media library
│   │   ├── analytics/        # Analytics
│   │   ├── users/            # User management
│   │   └── settings/         # Settings
│   ├── components/           # Shared components
│   │   └── Layout.tsx        # Main layout
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   ├── App.tsx               # Application entry
│   └── main.tsx              # Vite entry point
├── public/                   # Static assets
├── .env                      # Environment variables
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── tailwind.config.js        # Tailwind CSS config
```

## 🎯 Module System

### How Modules Work

Modules are **auto-discovered** by the framework:

1. **Create module folder**: `src/modules/my-module/`
2. **Define module config**: `index.ts`
3. **Define routes**: `routes.tsx`
4. **Import in App.tsx**: Framework auto-registers

### Module Template

```typescript
// src/modules/my-module/index.ts
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const myModule: ModuleConfig = {
  id: 'my-module',
  name: 'My Module',
  version: '1.0.0',
  routes,
  dependencies: [],
  permissions: ['my-module.view'],
};

export default myModule;
```

```tsx
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

## 📦 Framework Packages

### Core Packages

```typescript
import { AppCore } from '@longvhv/core';           // Module system
import { useAuth } from '@longvhv/auth';           // Authentication
import { useFetch } from '@longvhv/query';         // Data fetching
import { useTheme } from '@longvhv/theme';         // Theme management
import { useNotifications } from '@longvhv/notifications'; // Toasts
import { useTranslation } from '@longvhv/i18n';   // i18n
```

### Usage Examples

#### Authentication

```tsx
import { useAuth } from '@longvhv/auth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }
  
  return (
    <div>
      <h1>Welcome {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Data Fetching

```tsx
import { useFetch, useMutate } from '@longvhv/query';

function ArticleList() {
  // Fetch data
  const { data, isLoading, error } = useFetch(
    'articles',
    () => api.get('/articles')
  );
  
  // Mutation
  const { mutate: deleteArticle } = useMutate(
    (id: string) => api.delete(`/articles/${id}`)
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(article => (
        <li key={article.id}>
          {article.title}
          <button onClick={() => deleteArticle(article.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

#### Notifications

```tsx
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  
  const handleSave = async () => {
    try {
      await api.save(data);
      notifications.success('Saved successfully!');
    } catch (error) {
      notifications.error('Failed to save');
    }
  };
  
  // Or use promise-based
  const handleSaveWithPromise = async () => {
    await notifications.promise(
      api.save(data),
      {
        loading: 'Saving...',
        success: 'Saved!',
        error: 'Failed!',
      }
    );
  };
}
```

#### Theme Toggle

```tsx
import { useTheme } from '@longvhv/theme';

function ThemeToggle() {
  const { isDark, toggleMode, mode } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

#### Internationalization

```tsx
import { useTranslation } from '@longvhv/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

## 🧪 Development

### Start Development Server

```bash
pnpm dev
```

Features:
- ✅ Hot Module Replacement
- ✅ Fast refresh
- ✅ Auto-open browser
- ✅ Port 3000

### Linting & Formatting

```bash
# Run ESLint
pnpm lint

# Fix ESLint errors
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check
pnpm type-check
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage
pnpm test:coverage
```

## 🏗️ Building

### Build for Production

```bash
pnpm build
```

Output: `dist/` directory

### Preview Production Build

```bash
pnpm preview
```

Serves production build at: **http://localhost:4173**

### Build Configuration

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          framework: ['@longvhv/core', '@longvhv/auth'],
        },
      },
    },
  },
});
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build command
pnpm build

# Publish directory
dist
```

### Deploy with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "preview"]
```

```bash
# Build image
docker build -t vhv-cms .

# Run container
docker run -p 3000:3000 vhv-cms
```

## 🔐 Backend Integration

### API Configuration

The CMS expects a backend API with these endpoints:

```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Get current user
GET    /api/articles            # List articles
POST   /api/articles            # Create article
GET    /api/articles/:id        # Get article
PUT    /api/articles/:id        # Update article
DELETE /api/articles/:id        # Delete article
...
```

### API Client Setup

```typescript
// services/api.ts
import { ApiClient } from '@longvhv/api-client';

export const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors are auto-configured by @longvhv/auth
```

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev --port 3001
```

### Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript errors

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
pnpm build
```

### Dark mode not working

Ensure Tailwind is configured:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // ...
};
```

## 📚 Next Steps

1. ✅ **Read the docs**: [Framework Documentation](https://github.com/vhvplatform/react-framework)
2. ✅ **Create your first module**: See [Module Guide](./docs/MODULES.md)
3. ✅ **Customize theme**: Edit `src/styles/theme.css`
4. ✅ **Add translations**: Edit `src/locales/`
5. ✅ **Connect backend**: Configure API endpoints

## 🆘 Support

- 📧 Email: support@vhvplatform.com
- 🐛 Issues: [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- 💬 Discord: [Join our server](https://discord.gg/vhvplatform)
- 📖 Docs: [Full Documentation](https://docs.vhvplatform.com)

---

**Happy Coding! 🎉**
