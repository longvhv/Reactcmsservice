# Hướng dẫn tích hợp API thực

## Tổng quan

Hệ thống CMS hiện đang sử dụng **mock data** thông qua service layer `/services/api.ts`. Tất cả các API calls đã được chuẩn bị sẵn để dễ dàng thay thế bằng API thật khi backend sẵn sàng.

## Cấu trúc hiện tại

### Service Layer: `/services/api.ts`

File này chứa tất cả các API functions với mock data:

```typescript
// Mock implementation
export async function getArticles(params?: {...}): Promise<{...}> {
  await delay(); // Simulate network latency
  // Return mock data
  return { articles: [...], total: 100 };
}
```

### Các components sử dụng service

Các components sau đã được cập nhật để sử dụng service layer:

- **ArticleManagement** - Quản lý danh sách bài viết
- **ArticleEditor** - Tạo/chỉnh sửa bài viết
- **RelatedArticlesPicker** - Chọn bài viết liên quan
- **BulkOperations** - Thao tác hàng loạt
- **DevTools** - Seed database với mock data

### Hooks sử dụng service

- **useCategories** - Quản lý danh mục
- **useUsers** - Quản lý người dùng
- **useArticles** - Quản lý bài viết

## Cách tích hợp API thật

### Bước 1: Cập nhật base URL

Thêm biến môi trường cho API endpoint:

```typescript
// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### Bước 2: Thay thế mock functions

Ví dụ với `getArticles`:

**Trước (Mock):**
```typescript
export async function getArticles(params?: {...}): Promise<{...}> {
  await delay();
  let filtered = [...articlesStore];
  // ... filter logic
  return { articles: filtered, total: filtered.length };
}
```

**Sau (Real API):**
```typescript
export async function getArticles(params?: {...}): Promise<{...}> {
  const queryString = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_BASE_URL}/articles?${queryString}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`, // If auth required
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }
  
  return response.json();
}
```

### Bước 3: Thêm authentication (nếu cần)

```typescript
// services/auth.ts
export function getAuthToken(): string {
  // Get token from localStorage, cookies, or context
  return localStorage.getItem('auth_token') || '';
}

// services/api.ts
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };
}
```

### Bước 4: Xử lý errors

```typescript
export async function getArticles(params?: {...}): Promise<{...}> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch articles');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## API Endpoints cần implement

### Articles

```
GET    /api/articles              - Lấy danh sách bài viết (with filters)
GET    /api/articles/:id          - Lấy chi tiết bài viết
POST   /api/articles              - Tạo bài viết mới
PUT    /api/articles/:id          - Cập nhật bài viết
DELETE /api/articles/:id          - Xóa bài viết
POST   /api/articles/bulk-delete  - Xóa nhiều bài viết
PUT    /api/articles/bulk-status  - Cập nhật status nhiều bài viết
```

### Categories

```
GET    /api/categories            - Lấy danh sách danh mục (with filters)
GET    /api/categories/:id        - Lấy chi tiết danh mục
POST   /api/categories            - Tạo danh mục mới
PUT    /api/categories/:id        - Cập nhật danh mục
DELETE /api/categories/:id        - Xóa danh mục
```

### Users

```
GET    /api/users                 - Lấy danh sách người dùng (with filters)
GET    /api/users/:id             - Lấy chi tiết người dùng
POST   /api/users                 - Tạo người dùng mới
PUT    /api/users/:id             - Cập nhật người dùng
DELETE /api/users/:id             - Xóa người dùng
```

### Stats

```
GET    /api/stats                 - Lấy thống kê dashboard
```

### Seed (Dev only)

```
POST   /api/seed                  - Reset database với mock data
```

## Request/Response Format

### Articles

**Request (Create/Update):**
```json
{
  "title": "Tiêu đề bài viết",
  "content": "Nội dung HTML",
  "type": "news",
  "category": "Công nghệ",
  "status": "draft",
  "author": "Nguyễn Văn A",
  "tags": ["AI", "technology"],
  "excerpt": "Tóm tắt ngắn",
  "thumbnail": "https://...",
  "publishDate": "2026-03-11"
}
```

**Response (Single):**
```json
{
  "id": 1,
  "title": "Tiêu đề bài viết",
  "type": "news",
  "status": "draft",
  "category": "Công nghệ",
  "author": "Nguyễn Văn A",
  "views": 0,
  "comments": 0,
  "publishDate": "2026-03-11",
  "updatedDate": "2026-03-11",
  "featured": false
}
```

**Response (List):**
```json
{
  "articles": [...],
  "total": 100
}
```

## Query Parameters

### Articles List

```
?search=keyword         - Tìm kiếm theo tiêu đề, tác giả
?type=news              - Lọc theo loại bài viết
?status=published       - Lọc theo trạng thái
?category=Công nghệ     - Lọc theo danh mục
?limit=20               - Số bài viết mỗi trang
?offset=0               - Vị trí bắt đầu (cho pagination)
```

### Categories List

```
?articleType=news       - Lọc theo loại bài viết
?parentId=5             - Lọc theo danh mục cha
```

### Users List

```
?role=admin             - Lọc theo vai trò
?department=IT          - Lọc theo phòng ban
?search=keyword         - Tìm kiếm theo tên, email
```

## Xử lý Pagination

```typescript
// Frontend
const [page, setPage] = useState(1);
const ITEMS_PER_PAGE = 20;

const { articles, total } = await getArticles({
  limit: ITEMS_PER_PAGE,
  offset: (page - 1) * ITEMS_PER_PAGE,
});

const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
```

## Error Handling

Các API nên trả về errors theo format:

```json
{
  "error": "Error message",
  "code": "VALIDATION_ERROR",
  "details": {...}
}
```

Components sẽ handle errors:

```typescript
try {
  const result = await getArticles();
  setArticles(result.articles);
} catch (error) {
  console.error('Error:', error);
  // Show error toast/notification
  toast.error('Không thể tải bài viết');
}
```

## Testing với Mock Data

Mock data hiện tại được định nghĩa trong:

- `/utils/mockData.ts` - Shared mock data
- `/services/api.ts` - Mock API logic

Để test với mock data:
1. Không cần thay đổi gì, hệ thống đã sẵn sàng
2. Sử dụng DevTools component để reset data
3. Data được lưu trong memory, refresh page sẽ reset

## Migration Checklist

- [ ] Setup API base URL
- [ ] Implement authentication nếu cần
- [ ] Replace `getArticles` function
- [ ] Replace `getArticle` function
- [ ] Replace `createArticle` function
- [ ] Replace `updateArticle` function
- [ ] Replace `deleteArticle` function
- [ ] Replace `bulkDeleteArticles` function
- [ ] Replace `bulkUpdateStatus` function
- [ ] Replace `getCategories` function
- [ ] Replace `createCategory` function
- [ ] Replace `updateCategory` function
- [ ] Replace `deleteCategory` function
- [ ] Replace `getUsers` function
- [ ] Replace `createUser` function
- [ ] Replace `updateUser` function
- [ ] Replace `deleteUser` function
- [ ] Replace `getStats` function
- [ ] Test all CRUD operations
- [ ] Test error handling
- [ ] Test pagination
- [ ] Test filters and search

## Lưu ý quan trọng

1. **Không cần Supabase**: Tất cả code liên quan đến Supabase đã được loại bỏ
2. **Type Safety**: Tất cả API functions đều có TypeScript types đầy đủ
3. **Async/Await**: Tất cả functions đều async để dễ thay thế
4. **Error Handling**: Components đã có try-catch để handle errors
5. **Mock Delay**: Có simulate network delay để testing UX
6. **Consistent Pattern**: Tất cả API calls đều follow cùng pattern

## Ví dụ hoàn chỉnh

```typescript
// services/api.ts - Production version

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export async function getArticles(params?: {
  type?: string;
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; total: number }> {
  try {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(
      `${API_BASE_URL}/articles${queryString ? `?${queryString}` : ''}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch articles');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## Contact

Nếu có câu hỏi về API integration, vui lòng tham khảo:
- Backend repository: https://github.com/vhvplatform/go-cms-service
- Frontend framework: https://github.com/vhvplatform/react-framework
