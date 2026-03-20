# 🔄 Migration from Vite to Next.js - Complete Guide

## ✅ What Has Been Done

### 1. **Project Configuration**
- ✅ Created `next.config.mjs` - Next.js configuration
- ✅ Updated `package.json` - Changed scripts and dependencies
- ✅ Created `tsconfig.json` - TypeScript configuration for Next.js
- ✅ Created `postcss.config.mjs` - PostCSS configuration
- ✅ Created `.gitignore` - Next.js specific ignores
- ✅ Created `.env.example` - Environment variables template

### 2. **App Structure**
- ✅ Created `/app/layout.tsx` - Root layout with providers
- ✅ Created `/app/page.tsx` - Home page (converted from App.tsx)
- ✅ Deleted `vite.config.ts` - No longer needed
- ✅ Deleted `tsconfig.node.json` - No longer needed
- ✅ Deleted `/src/main.tsx` - No longer needed

### 3. **Key Changes**

#### Scripts (package.json)
```json
// Before (Vite)
"dev": "vite"
"build": "tsc && vite build"

// After (Next.js)
"dev": "next dev"
"build": "next build"
```

#### Dependencies
```json
// Removed
- "@vitejs/plugin-react"
- "vite"

// Added
+ "next": "^14.2.15"
+ Additional libraries (recharts, motion, etc.)
```

## 🚀 How to Run

### Install Dependencies
```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development Mode
```bash
pnpm dev
# App will run at http://localhost:3000
```

### Build for Production
```bash
pnpm build
pnpm start
```

## 📁 Project Structure

### Old Structure (Vite)
```
/
├── src/
│   ├── main.tsx          ❌ Entry point
│   └── App.tsx           ❌ Root component
├── vite.config.ts        ❌ Vite config
└── index.html            ❌ HTML template
```

### New Structure (Next.js)
```
/
├── app/
│   ├── layout.tsx        ✅ Root layout
│   └── page.tsx          ✅ Home page
├── components/           ✅ React components (unchanged)
├── contexts/             ✅ React contexts (unchanged)
├── hooks/                ✅ Custom hooks (unchanged)
├── lib/                  ✅ Utilities (unchanged)
├── styles/               ✅ Global styles (unchanged)
├── next.config.mjs       ✅ Next.js config
└── tsconfig.json         ✅ TypeScript config
```

## 🔧 Important Notes

### 1. **Client Components**
All interactive components now need `'use client'` directive:

```tsx
'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

The main `/app/page.tsx` already has this directive since it uses `useState`.

### 2. **Server vs Client Components**
- **Server Components** (default): No state, no hooks, run on server
- **Client Components** (`'use client'`): Can use state, hooks, browser APIs

Most of our components are client components because they use:
- `useState`, `useEffect`, etc.
- Browser APIs
- Event handlers

### 3. **Image Optimization**
Replace `<img>` with Next.js `<Image>`:

```tsx
// Before
<img src="/logo.png" alt="Logo" />

// After
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### 4. **Routing**
- ❌ No need for `react-router-dom` for basic routing
- ✅ Use Next.js file-based routing if needed
- ✅ Current SPA-style navigation still works (state-based)

### 5. **Environment Variables**
```bash
# Create .env.local file
cp .env.example .env.local

# Then edit with your values
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Important**: Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser.

## 🎨 Features Still Work

All features from Vite version still work:
- ✅ Admin Portal
- ✅ Reporter Portal  
- ✅ Article Management
- ✅ Category Management
- ✅ Media Library
- ✅ User Management
- ✅ Royalty System
- ✅ Analytics
- ✅ AI Tools
- ✅ All UI components
- ✅ i18n support
- ✅ Tailwind CSS v4

## 🆕 New Benefits with Next.js

### 1. **Better Performance**
- Automatic code splitting
- Image optimization
- Font optimization

### 2. **SEO Friendly**
- Server-side rendering (when needed)
- Better meta tags management
- Sitemap generation

### 3. **API Routes**
Can create API endpoints in `/app/api/`:
```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' });
}
```

### 4. **Built-in Deployment**
- Optimized for Vercel
- Zero-config deployment
- Automatic HTTPS

## 🔄 Migration Checklist

- [x] Install Next.js dependencies
- [x] Create Next.js config files
- [x] Move App.tsx to app/page.tsx
- [x] Create app/layout.tsx with providers
- [x] Update package.json scripts
- [x] Update tsconfig.json
- [x] Delete Vite-specific files
- [x] Test all features
- [x] Update documentation

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution**: Check import paths. Next.js uses `/` from root, not relative paths.

### Issue: "useState is not a function"
**Solution**: Add `'use client'` directive at top of file.

### Issue: "window is not defined"
**Solution**: Use `useEffect` or check `typeof window !== 'undefined'`.

### Issue: Tailwind not working
**Solution**: Make sure `globals.css` is imported in `app/layout.tsx`.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [App Router](https://nextjs.org/docs/app)

## 🎉 Success!

Your app is now running on Next.js! All features work the same, but with better:
- Performance
- SEO
- Developer experience
- Production deployment

**Happy coding! 🚀**
