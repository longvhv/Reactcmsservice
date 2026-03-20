# App Directory

Thư mục này chứa **toàn bộ business logic** của ứng dụng CMS.

## Mục đích

Cấu trúc này được thiết kế để dễ dàng migrate sang **Next.js 14+ App Router** trong tương lai.

## Cấu trúc

```
/app/
  App.tsx              # Main application component với routing logic
  README.md            # File này

/components/           # Tất cả React components
/contexts/             # React contexts (Language, SystemSettings, etc.)
/locales/              # Translation files
/styles/               # Global styles
/utils/                # Utility functions

/pages/                # SHIM LAYER - Chỉ import từ /app
  index.tsx            # Redirect to /page/cms/dashboard
  _app.tsx             # Next.js App wrapper (future use)
  _document.tsx        # Next.js Document (future use)
  /page/cms/[[...slug]].tsx  # Catch-all route handler

/App.tsx               # ROOT SHIM - Re-exports from /app/App.tsx
```

## Nguyên tắc

1. **Code chính phải nằm trong `/app`**: Tất cả business logic, routing, state management
2. **`/pages` chỉ là shim layer**: Chỉ import và re-export từ `/app`
3. **Root `/App.tsx` là shim**: Re-export từ `/app/App.tsx`

## Migration sang Next.js

Khi migrate sang Next.js App Router:

1. Rename `/app/App.tsx` → `/app/page.tsx`
2. Convert routing logic sang Next.js App Router conventions
3. Keep `/pages` directory hoặc xóa nếu không cần Pages Router
4. Components, contexts, utils không cần thay đổi nhiều

## Lợi ích

- ✅ Dễ dàng migrate sang Next.js
- ✅ Code organization rõ ràng
- ✅ Tương thích với Figma Make environment
- ✅ Ready for Server Components (Next.js 13+)
