# VHV CMS - Enterprise Content Management System

Modern CMS built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS v4**.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context + Hooks
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Edge Functions)

## 📦 Installation

```bash
# Install dependencies
pnpm install

# or
npm install

# or
yarn install
```

## 🛠️ Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check
```

The application will be available at `http://localhost:3000`.

## 🗺️ Routes

All CMS routes are prefixed with `/page/cms/`:

| URL | Description |
|-----|-------------|
| `/` | Redirects to main CMS |
| `/page/cms` | Main Admin Portal (Dashboard, Articles, Media, Users, etc.) |
| `/page/cms/reporter` | Reporter Portal (My Articles, Editor, Royalty, Analytics) |

See [ROUTING_STRUCTURE.md](./ROUTING_STRUCTURE.md) for detailed routing documentation.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui style)
│   ├── figma/            # Figma imports
│   └── ...               # Feature components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities and types
├── locales/              # i18n translations
├── styles/               # Global styles
├── utils/                # Helper functions
├── supabase/             # Supabase functions
│   └── functions/        # Edge functions
└── public/               # Static files
```

## 🎨 Features

### Admin Portal
- ✅ Dashboard with analytics
- ✅ Article Management (News, Video, Gallery, PDF, etc.)
- ✅ Category Management (Tree structure)
- ✅ Media Library
- ✅ User & Permission Management
- ✅ Approval Workflow
- ✅ Crawler Management
- ✅ Event Streaming
- ✅ Advanced Analytics
- ✅ AI Tools Integration
- ✅ Royalty Management

### Reporter Portal
- ✅ Reporter Dashboard
- ✅ My Articles
- ✅ Article Editor (All types)
- ✅ Royalty Tracking
- ✅ Analytics & Insights
- ✅ Notifications
- ✅ Profile Management
- ✅ Help Center

### Design System
- 🎨 Modern & Elegant (Stripe/Vercel/Linear style)
- 🎨 Glassmorphism effects
- 🎨 Micro-animations
- 🎨 Gradient backgrounds
- 🎨 Responsive design
- 🎨 Dark mode ready

## 🌍 i18n Support

Supported languages:
- 🇻🇳 Vietnamese (vi)
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇨🇳 Chinese (zh)

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📝 Migration from Vite

This project was migrated from Vite to Next.js for:
- ✅ Better SEO with Server-Side Rendering
- ✅ API Routes for backend logic
- ✅ Image optimization
- ✅ Built-in routing
- ✅ Better performance
- ✅ Production-ready deployment

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel
```

### Docker

```bash
# Build Docker image
docker build -t vhv-cms .

# Run container
docker run -p 3000:3000 vhv-cms
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Built by VHV Platform Team

---

**Made with ❤️ using Next.js + React + TypeScript + Tailwind CSS**