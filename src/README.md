# 🚀 VHV CMS Application

Enterprise-grade Content Management System built with **VHV Platform React Framework**.

## 🎯 Overview

A comprehensive CMS solution supporting 14+ content types with modern microservices architecture, built on top of the **@longvhv/react-framework**.

### Key Features

- **14+ Content Types**: News, Video, Gallery, Legal Documents, Jobs, Podcasts, Events, Downloads, etc.
- **Advanced Workflow**: Draft → Review → Approve publishing workflow
- **Hierarchical Categories**: Tree structure with drag-drop support
- **Media Library**: Automated processing with folder management
- **Auto Crawler**: Automated content collection from external sources
- **Multi-Language**: Vietnamese & English support via `@longvhv/i18n`
- **Dark Mode**: Built-in theme support via `@longvhv/theme`
- **Real-time Stats**: Dashboard analytics with interactive charts
- **Role-Based Access**: Enterprise-grade permissions via `@longvhv/auth`

---

## ⚡ Quick Start

### Automatic Setup (Recommended)

```bash
# Make script executable
chmod +x scripts/quick-start.sh

# Run quick start
./scripts/quick-start.sh
```

This will:
- ✅ Check prerequisites (Node.js, pnpm)
- ✅ Install dependencies
- ✅ Setup environment files
- ✅ Run type checking
- ✅ Start development server

### Manual Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.development .env

# Start development server
pnpm dev
```

Application runs at: **http://localhost:3000**

---

## 📋 Immediate Actions Checklist

After setup, follow this checklist:

### ✅ 1. Review Files

- [ ] Check `/src/modules/` - All 6 modules created
- [ ] Check `/src/components/` - Layout & ErrorBoundary
- [ ] Check `/src/services/` - API client configured
- [ ] Check `.env.development` - Environment variables

### ✅ 2. Test Module System

```bash
pnpm dev
```

Open browser console and verify:
```
🏥 VHV CMS Health Check
  ✅ Framework Packages: All @longvhv packages loaded
  ✅ Environment Variables: All configured
  ⚠️  API Connection: Using mock data
  ✅ LocalStorage: Available
  ✅ Browser Compatibility: All features supported
```

### ✅ 3. Test Framework Integration

**Theme Toggle:**
- Click Sun/Moon icon in header
- Verify dark mode switches instantly

**Language Switch:**
- Select 🇻🇳 VI or 🇬🇧 EN
- Verify UI text changes

**DevTools Panel:**
- Click purple gear icon (bottom-right)
- Explore all features

**Module Navigation:**
- Visit: `/`, `/articles`, `/media`, `/analytics`, `/users`, `/settings`
- Verify all routes work

### ✅ 4. Connect Backend API

Update `.env`:
```env
VITE_API_URL=http://localhost:8080  # Your backend URL
```

Restart server:
```bash
pnpm dev
```

### ✅ 5. Complete Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for full checklist.

---

## 📦 Framework Packages Used

- **@longvhv/core** - Application lifecycle & module registry
- **@longvhv/auth** - JWT authentication & OAuth
- **@longvhv/query** - React Query for data fetching
- **@longvhv/theme** - Dark/Light mode management
- **@longvhv/notifications** - Toast notifications
- **@longvhv/ui-components** - Pre-built Tailwind components
- **@longvhv/i18n** - Internationalization (VI/EN)
- **@longvhv/forms** - React Hook Form + Zod validation
- **@longvhv/crud** - Generic CRUD operations
- **@longvhv/context** - Multi-tenant context
- **@longvhv/shared** - Utility functions & hooks

## 🏗️ Architecture

Built on **VHV Platform React Framework** with module-based architecture:

```
src/
├── modules/              # Auto-discovered modules
│   ├── dashboard/        # Dashboard module
│   ├── articles/         # Article management
│   ├── media/            # Media library
│   ├── analytics/        # Statistics & analytics
│   ├── users/            # User management
│   ├── crawler/          # Content crawler
│   └── settings/         # System settings
├── components/           # Shared components
│   └── Layout.tsx        # Main layout
├── services/             # API services
├── types/                # TypeScript types
└── App.tsx               # Application entry point
```

### Module System

Each module is auto-discovered and registered:

```typescript
// modules/dashboard/index.ts
export const dashboardModule: ModuleConfig = {
  id: 'dashboard',
  name: 'Dashboard',
  version: '1.0.0',
  routes,
  dependencies: [],
  permissions: ['dashboard.view'],
};
```

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
pnpm >= 8.0.0
```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=VHV CMS
VITE_APP_VERSION=1.0.0
```

## 🎨 UI/UX Features

### Modern Design System

- **Glassmorphism effects** throughout
- **Gradient backgrounds** with hover states
- **Micro-animations** for smooth UX
- **Responsive layouts** (mobile-first)
- **Dark mode** with system preference support
- **Professional color schemes** (Stripe/Vercel style)

### Components

All components use **@longvhv/ui-components**:
- Button (primary, secondary, danger)
- Card (with header/footer)
- Input (with validation)
- Spinner (loading states)

### Theming

```tsx
import { useTheme } from '@longvhv/theme';

function MyComponent() {
  const { isDark, toggleMode } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

### Notifications

```tsx
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  
  const handleSave = async () => {
    await notifications.promise(
      api.save(data),
      {
        loading: 'Saving...',
        success: 'Saved!',
        error: 'Failed to save',
      }
    );
  };
}
```

## 📚 Module Development

### Create New Module

```bash
# Using CLI (if available)
pnpm cli create-module my-module

# Manual creation
mkdir -p src/modules/my-module
touch src/modules/my-module/index.ts
touch src/modules/my-module/routes.tsx
```

### Module Structure

```
my-module/
├── index.ts              # Module config
├── routes.tsx            # Route definitions
├── pages/                # Page components
│   └── MyPage.tsx
├── components/           # Module-specific components
└── services/             # API services
```

### Module Template

```typescript
// index.ts
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const myModule: ModuleConfig = {
  id: 'my-module',
  name: 'My Module',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'],
  permissions: ['my-module.view'],
};

export default myModule;
```

```tsx
// routes.tsx
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

## 🔐 Authentication

Using **@longvhv/auth** package:

```tsx
import { useAuth } from '@longvhv/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🌐 Data Fetching

Using **@longvhv/query** (React Query):

```tsx
import { useFetch, useMutate } from '@longvhv/query';

function ArticleList() {
  // Fetch data
  const { data, isLoading } = useFetch('articles', () => 
    api.get('/articles')
  );
  
  // Mutations
  const { mutate: deleteArticle } = useMutate(
    (id: string) => api.delete(`/articles/${id}`),
    {
      onSuccess: () => {
        // Invalidate query to refetch
        queryClient.invalidateQueries('articles');
      },
    }
  );
  
  if (isLoading) return <Spinner />;
  
  return (
    <ul>
      {data.map((article) => (
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

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage
pnpm test:coverage
```

## 🚢 Deployment

### Build for Production

```bash
pnpm build
```

Output: `dist/` directory ready for deployment.

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

### Environment Setup

- **Development**: `pnpm dev` (port 3000)
- **Staging**: Build with staging env vars
- **Production**: Build with production env vars

## 📖 Documentation

- [Framework Documentation](https://github.com/vhvplatform/react-framework)
- [API Documentation](./docs/API.md)
- [Module Development Guide](./docs/MODULES.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **React Query** - Server state
- **React Hook Form** - Forms
- **Zod** - Validation
- **Lucide React** - Icons

## 🤝 Contributing

1. Create feature branch
2. Follow module-based architecture
3. Use framework packages
4. Write tests
5. Submit PR

## 📄 License

MIT © VHV Platform

## 🆘 Support

- 📧 Email: support@vhvplatform.com
- 🐛 Issues: [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/vhvplatform/react-framework/discussions)

---

**Built with ❤️ using VHV Platform React Framework**