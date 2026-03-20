# Pages Directory (Shim Layer)

⚠️ **QUAN TRỌNG**: Thư mục này chỉ là **SHIM LAYER** để chuẩn bị cho migration sang Next.js.

## Quy tắc

### ❌ KHÔNG được làm:
- ❌ Viết business logic trong thư mục này
- ❌ Tạo components mới trong `/pages`
- ❌ Import từ `/components`, `/contexts` trực tiếp
- ❌ Thêm state management hoặc data fetching

### ✅ CHỈ được làm:
- ✅ Import từ `/app` và re-export
- ✅ Tạo route wrappers đơn giản
- ✅ Next.js specific files (`_app.tsx`, `_document.tsx`)

## Cấu trúc

```
/pages/
  _app.tsx              # Next.js App wrapper - imports global CSS
  _document.tsx         # Next.js Document - HTML structure
  index.tsx             # Root redirect to /page/cms/dashboard
  /page/
    /cms/
      [[...slug]].tsx   # Catch-all route - imports from /app/App.tsx
```

## Ví dụ

### ✅ Đúng:
```tsx
// /pages/page/cms/[[...slug]].tsx
import App from '../../../app/App';

export default function CMSPage() {
  return <App />;
}
```

### ❌ Sai:
```tsx
// /pages/page/cms/dashboard.tsx
import { Dashboard } from '../../../components/Dashboard';
import { useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState([]); // ❌ Business logic không được ở đây
  return <Dashboard data={data} />;
}
```

## Migration sang Next.js

Khi ready để migrate:

1. Cài đặt Next.js dependencies
2. Update `next.config.js`
3. Files trong `/pages` đã sẵn sàng cho Next.js Pages Router
4. Hoặc migrate sang App Router bằng cách dùng `/app` directory

## Tại sao cần shim layer?

- Tách biệt rõ ràng giữa routing framework và business logic
- Dễ dàng test và maintain
- Có thể switch giữa SPA và SSR/SSG
- Ready for incremental migration
