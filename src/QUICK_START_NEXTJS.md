# 🚀 Quick Start - Next.js Version

## ⚡ 3 Steps to Run

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

### 3. Start Development Server
```bash
pnpm dev
```

**✅ App is now running at http://localhost:3000**

---

## 🎯 Quick Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Type checking without build |

---

## 📦 What Changed from Vite?

### ✅ Same Features
- All components work exactly the same
- Same styling (Tailwind CSS v4)
- Same functionality
- Same codebase structure

### 🆕 Better with Next.js
- ⚡ Faster builds
- 🔍 Better SEO
- 🖼️ Image optimization
- 📦 Smaller bundle size
- 🚀 Production-ready

---

## 🎨 Current Features

### Main Routes 🗺️
- **`/`** - Auto redirects to CMS
- **`/page/cms`** - Main Admin Portal
- **`/page/cms/reporter`** - Reporter Portal

### Admin Portal ✅
- Dashboard
- Article Management (All types)
- Category Management
- Media Library
- User & Permissions
- Approval Workflow
- Crawler Management
- Analytics
- AI Tools
- Royalty System

### Reporter Portal ✅
- Dashboard
- My Articles
- Article Editor
- Royalty Tracking
- Analytics
- Notifications
- Profile
- Help Center

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

### TypeScript Errors
```bash
# Regenerate types
pnpm type-check
```

---

## 📚 Learn More

- **Next.js Docs**: https://nextjs.org/docs
- **Migration Guide**: See `MIGRATION_TO_NEXTJS.md`
- **Project Docs**: See `README.md`

---

## 🎉 You're All Set!

The app is now running on Next.js with all features intact.

**Happy coding! 🚀**