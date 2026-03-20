# Tai lieu Thiet ke Co so Du lieu (CSDL)

## CMS Service - MongoDB Database Design

**Phien ban:** 2.0
**Cap nhat:** 17/03/2026
**Tac gia:** CMS Engineering Team
**Database Engine:** MongoDB (DocumentDB compatible)
**Backend:** Go microservices (go-cms-service)

---

## 1. Tong quan Kien truc CSDL

### 1.1 Database

| Database           | Mo ta                                    | Engine  |
| :----------------- | :--------------------------------------- | :------ |
| `cms_service`      | Database chinh chua toan bo du lieu CMS  | MongoDB |

### 1.2 Quy uoc dat ten (theo Guidelines.md)

| Thanh phan       | Quy uoc             | Vi du                           |
| :--------------- | :------------------- | :------------------------------ |
| Collection       | `snake_case` (so nhieu) | `articles`, `categories`     |
| Field            | `snake_case`         | `tenant_id`, `created_at`       |
| Golang Struct    | `CamelCase`          | `TenantId`, `CreatedAt`         |
| JSON Response    | `camelCase`          | `tenantId`, `createdAt`         |
| Primary Key      | `id` (UUID v7)       | `018d1234-5678-7123-...`        |

### 1.3 Standard Mixins (Truong bat buoc)

Moi document trong moi collection nghiep vu **BAT BUOC** co cac truong sau:

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID - Dinh danh Tenant (multi-tenant isolation)",
  "version": 1,
  "created_at": "2026-03-17T10:00:00Z",
  "updated_at": "2026-03-17T10:00:00Z",
  "deleted_at": null
}
```

> **QUAN TRONG:** Cam su dung lenh `DELETE` vat ly. Chi su dung **Soft Delete** (set `deleted_at`).
> Field `version` phuc vu **Optimistic Locking** - chong ghi de dong thoi.

---

## 2. Collections & Schema

### 2.1 Collection: `articles`

**Mo ta:** Luu tru toan bo bai viet CMS voi 16 loai bai viet khac nhau.

```json
{
  // === Standard Mixins ===
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  // === Core Fields ===
  "title": "String - Tieu de bai viet (bat buoc)",
  "slug": "String - URL-friendly slug (unique per tenant)",
  "summary": "String - Mo ta ngan",
  "content": "String - Noi dung HTML (legacy mode)",
  "content_mode": "String - 'legacy' | 'sections'",

  // === Classification ===
  "type": "String - Enum ArticleType (16 loai)",
  "status": "String - Enum: draft | pending | published | rejected | archived",
  "category_id": "UUID - FK -> categories.id",
  "tags": ["String - Tag array"],

  // === Media ===
  "featured_image": "String - URL anh dai dien",
  "gallery": [
    {
      "id": "UUID",
      "url": "String",
      "alt": "String",
      "caption": "String"
    }
  ],
  "videos": [{ "id": "UUID", "url": "String", "type": "String", "duration": "Number" }],
  "audios": [{ "id": "UUID", "url": "String", "title": "String" }],
  "documents": [{ "id": "UUID", "url": "String", "title": "String", "size": "Number" }],

  // === Authorship ===
  "author_id": "UUID - FK -> users.id",
  "contributors": ["UUID - FK -> users.id"],

  // === SEO ===
  "seo": {
    "title": "String",
    "description": "String",
    "keywords": ["String"],
    "og_image": "String",
    "og_title": "String",
    "og_description": "String",
    "canonical_url": "String",
    "no_index": false,
    "no_follow": false
  },

  // === Stats (denormalized for performance) ===
  "stats": {
    "views": 0,
    "likes": 0,
    "shares": 0,
    "comments": 0,
    "avg_read_time": 0
  },

  // === Scheduling ===
  "published_at": "ISODate | null",
  "scheduled_at": "ISODate | null",
  "expires_at": "ISODate | null",

  // === Flags ===
  "is_featured": false,
  "is_breaking": false,
  "is_pinned": false,
  "allow_comments": true,

  // === Type-specific Fields (embedded) ===
  "video_data": {
    "url": "String",
    "embed_code": "String",
    "duration": "Number (seconds)",
    "thumbnail": "String",
    "platform": "String - youtube | vimeo | custom"
  },
  "podcast_data": {
    "audio_url": "String",
    "duration": "Number",
    "episode_number": "Number",
    "season": "Number",
    "hosts": ["String"],
    "guests": ["String"],
    "transcript": "String",
    "album_art": "String"
  },
  "event_data": {
    "start_date": "ISODate",
    "end_date": "ISODate",
    "location": "String",
    "location_url": "String",
    "organizer": "String",
    "max_attendees": "Number",
    "current_attendees": "Number",
    "registration_url": "String",
    "is_virtual": false,
    "virtual_url": "String"
  },
  "recruitment_data": {
    "position": "String",
    "department": "String",
    "job_type": "String - full-time | part-time | contract | internship",
    "location": "String",
    "salary": "String",
    "requirements": ["String"],
    "benefits": ["String"],
    "deadline": "ISODate",
    "apply_url": "String",
    "contact_email": "String"
  },
  "legal_data": {
    "document_number": "String - So hieu van ban",
    "document_type": "String",
    "issue_date": "ISODate",
    "effective_date": "ISODate",
    "issuing_authority": "String"
  },
  "personnel_data": {
    "department": "String",
    "join_date": "ISODate",
    "bio": "String"
  },
  "download_data": {
    "file_url": "String",
    "file_name": "String",
    "file_size": "Number (bytes)",
    "file_type": "String",
    "download_count": 0,
    "requires_login": false
  },

  // === Workflow ===
  "approval_status": "String - pending | approved | rejected",
  "approved_by": "UUID | null",
  "approved_at": "ISODate | null",
  "rejection_reason": "String | null",

  // === Multi-language ===
  "language": "String - vi | en | ...",
  "translations": {
    "en": "UUID - article_id of English version",
    "vi": "UUID - article_id of Vietnamese version"
  },

  // === Related ===
  "related_article_ids": ["UUID"]
}
```

**16 loai bai viet (ArticleType enum):**

| Type           | Label Tieng Viet      | Mo ta                          |
| :------------- | :-------------------- | :----------------------------- |
| `news`         | Tin tuc               | Bai viet tin tuc thong thuong  |
| `video`        | Video                 | Bai viet kem video             |
| `gallery`      | Gallery               | Bo suu tap hinh anh            |
| `document`     | Van ban               | Van ban tai lieu               |
| `legal`        | Van ban phap luat     | Van ban phap luat, quy dinh    |
| `recruitment`  | Tuyen dung            | Thong tin tuyen dung           |
| `podcast`      | Podcast               | Bai podcast audio              |
| `event`        | Su kien               | Thong tin su kien              |
| `personnel`    | Nhan su               | Thong tin nhan su              |
| `download`     | Tai xuong             | File tai xuong                 |
| `blog`         | Blog                  | Bai viet blog                  |
| `press-release`| Thong cao bao chi     | Thong cao bao chi              |
| `interview`    | Phong van             | Bai phong van                  |
| `infographic`  | Infographic           | Bieu do thong tin truc quan    |
| `pdf`          | PDF                   | Tai lieu PDF                   |
| `faq`          | FAQ                   | Cau hoi thuong gap             |

---

### 2.2 Collection: `content_sections`

**Mo ta:** Luu tru noi dung da section cua bai viet (Block Editor). Moi bai viet co nhieu sections.

```json
{
  // === Standard Mixins ===
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  // === Reference ===
  "article_id": "UUID - FK -> articles.id",

  // === Section Config ===
  "type": "String - Enum ContentSectionType (24 loai)",
  "order": "Number - Thu tu hien thi (0-based)",
  "is_visible": true,
  "title": "String | null",
  "spacing": "String - none | small | medium | large",
  "css_class": "String | null",
  "background": "String | null",

  // === Content Data (varies by type) ===
  "data": {
    // Dynamic - khac nhau theo tung type
    // Xem chi tiet tai Section 2.2.1
  }
}
```

**24 loai Content Section:**

| Category    | Type            | Label VN              | Mo ta                          |
| :---------- | :-------------- | :-------------------- | :----------------------------- |
| Basic       | `html`          | Van ban               | Noi dung HTML (Block Editor)   |
| Basic       | `image`         | Hinh anh              | Anh don voi caption            |
| Basic       | `quote`         | Trich dan             | Blockquote voi tac gia         |
| Basic       | `callout`       | Ghi chu noi bat       | Info/warning/tip box           |
| Basic       | `alert`         | Thong bao             | Alert/notification             |
| Basic       | `divider`       | Duong phan cach       | Visual separator               |
| Media       | `slideshow`     | Trinh chieu           | Image slideshow                |
| Media       | `gallery`       | Bo suu tap anh        | Photo gallery grid/masonry     |
| Media       | `video`         | Video                 | YouTube/Vimeo/custom           |
| Media       | `audio`         | Am thanh              | Audio player/podcast           |
| Media       | `embed`         | Nhung                 | Nhung noi dung ben ngoai       |
| Media       | `file-download` | Tai tep               | File dinh kem download         |
| Data        | `chart`         | Bieu do               | Bar/line/pie/area charts       |
| Data        | `timeline`      | Dong thoi gian        | Timeline su kien               |
| Data        | `table`         | Bang                  | Bang du lieu                   |
| Data        | `numbers`       | So lieu noi bat       | Animated counters              |
| Data        | `comparison`    | So sanh               | So sanh side by side           |
| Interactive | `poll`          | Binh chon             | Interactive poll               |
| Interactive | `accordion`     | Accordion/FAQ         | Collapsible Q&A                |
| Interactive | `tabs`          | Tab                   | Tabbed content                 |
| Interactive | `steps`         | Cac buoc              | Step-by-step guide             |
| Interactive | `toggle-list`   | Uu/Nhuoc diem         | Pros/cons/checklist            |
| Layout      | `cta`           | Keu goi hanh dong     | Call to action button          |
| Layout      | `code`          | Khoi ma               | Syntax-highlighted code        |

> **Quy tac:** Khi tao bai viet moi, he thong tu dong them 1 section `html` (Van ban) mac dinh.

---

### 2.3 Collection: `categories`

**Mo ta:** Quan ly danh muc phan cap (tree structure). Moi danh muc chi chua **1 loai bai viet**.

```json
{
  // === Standard Mixins ===
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  // === Core Fields ===
  "name": "String - Ten danh muc (bat buoc)",
  "slug": "String - URL slug (unique per tenant)",
  "description": "String | null",
  "type": "String - ArticleType (1 danh muc = 1 loai bai viet)",

  // === Hierarchy ===
  "parent_id": "UUID | null - FK -> categories.id",
  "level": "Number - Cap do trong cay (0 = root)",
  "path": "String - Duong dan materialized: /root_id/parent_id/id",
  "display_order": "Number - Thu tu hien thi",

  // === Metadata ===
  "icon": "String | null - Icon identifier",
  "color": "String | null - Hex color code",
  "featured_image": "String | null - URL anh dai dien",

  // === SEO ===
  "meta_title": "String | null",
  "meta_description": "String | null",

  // === Stats (denormalized) ===
  "article_count": 0,
  "is_active": true,

  // === Audit ===
  "created_by": "UUID - FK -> users.id",
  "updated_by": "UUID - FK -> users.id"
}
```

> **Rang buoc quan trong:** `type` cua category phai khop voi `type` cua bai viet duoc gan vao.

---

### 2.4 Collection: `users`

```json
{
  // === Standard Mixins ===
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  // === Core Fields ===
  "username": "String (unique per tenant)",
  "email": "String (unique per tenant)",
  "full_name": "String",
  "phone": "String | null",
  "avatar": "String | null - URL avatar",

  // === Authentication ===
  "password_hash": "String - bcrypt hash",
  "two_factor_enabled": false,
  "two_factor_secret": "String | null - encrypted",

  // === Authorization ===
  "role": "String - admin | editor | author | contributor | viewer",
  "permission_group_ids": ["UUID - FK -> permission_groups.id"],
  "status": "String - active | inactive | suspended",

  // === Activity ===
  "last_login_at": "ISODate | null",
  "last_login_ip": "String | null",
  "last_login_device": "String | null",
  "login_count": 0,

  // === Preferences ===
  "preferences": {
    "language": "vi",
    "timezone": "Asia/Ho_Chi_Minh",
    "theme": "light",
    "notifications": {
      "email": true,
      "push": true,
      "new_article": true,
      "new_comment": true,
      "article_approval": true
    }
  }
}
```

---

### 2.5 Collection: `tags`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "name": "String",
  "slug": "String (unique per tenant)",
  "article_count": 0
}
```

---

### 2.6 Collection: `media_files`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "url": "String - URL file",
  "type": "String - image | video | audio | document",
  "title": "String | null",
  "caption": "String | null",
  "alt": "String | null",
  "file_name": "String",
  "file_size": "Number (bytes)",
  "mime_type": "String",
  "width": "Number | null (pixels, for images/videos)",
  "height": "Number | null",
  "duration": "Number | null (seconds, for video/audio)",

  "folder_path": "String - /photos/2026/03/",
  "tags": ["String"],
  "usage_count": 0,
  "uploaded_by": "UUID - FK -> users.id"
}
```

---

### 2.7 Collection: `comments`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "article_id": "UUID - FK -> articles.id",
  "author_name": "String",
  "author_email": "String",
  "author_avatar": "String | null",
  "content": "String",

  "parent_id": "UUID | null - FK -> comments.id (nested comments)",
  "status": "String - pending | approved | spam | rejected",
  "moderated_by": "UUID | null - FK -> users.id",
  "moderated_at": "ISODate | null",

  "likes": 0,
  "ip_address": "String",
  "user_agent": "String"
}
```

---

### 2.8 Collection: `event_streams`

**Mo ta:** Dong su kien - nhom nhieu bai viet theo chui su kien.

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "name": "String - Ten dong su kien",
  "slug": "String (unique per tenant)",
  "description": "String | null",
  "thumbnail": "String | null",
  "status": "String - active | inactive | archived",

  "article_ids": ["UUID - FK -> articles.id"],
  "tags": ["String"],

  // === SEO ===
  "seo": {
    "title": "String | null",
    "description": "String | null"
  },

  // === Display ===
  "is_featured": false,
  "display_order": 0,

  "created_by": "UUID - FK -> users.id"
}
```

---

### 2.9 Collection: `permission_groups`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "name": "String",
  "description": "String | null",
  "is_system": false,

  "permissions": {
    "articles": { "create": true, "read": true, "update": true, "delete": false, "publish": false, "approve": false },
    "categories": { "create": true, "read": true, "update": false, "delete": false },
    "media": { "create": true, "read": true, "update": true, "delete": false },
    "users": { "create": false, "read": true, "update": false, "delete": false },
    "settings": { "read": false, "update": false }
  },

  "member_ids": ["UUID - FK -> users.id"],
  "member_count": 0
}
```

---

### 2.10 Collection: `workflow_instances`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "article_id": "UUID - FK -> articles.id",
  "workflow_type": "String - approval | review | publish",
  "current_step": "Number",
  "status": "String - in_progress | completed | rejected | cancelled",

  "steps": [
    {
      "step_number": 1,
      "name": "String - Biên tập duyệt",
      "assignee_id": "UUID - FK -> users.id",
      "status": "String - pending | approved | rejected",
      "comment": "String | null",
      "acted_at": "ISODate | null"
    }
  ],

  "initiated_by": "UUID - FK -> users.id"
}
```

---

### 2.11 Collection: `crawler_campaigns`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "name": "String",
  "description": "String | null",
  "status": "String - active | paused | completed | error",

  "source_ids": ["UUID - FK -> crawler_sources.id"],
  "target_category_id": "UUID | null - FK -> categories.id",
  "target_article_count": "Number",
  "crawled_count": 0,
  "approved_count": 0,

  "schedule": {
    "frequency": "String - hourly | daily | weekly | manual",
    "cron_expression": "String | null",
    "last_run_at": "ISODate | null",
    "next_run_at": "ISODate | null"
  }
}
```

---

### 2.12 Collection: `crawler_sources`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "name": "String",
  "url": "String - RSS/Feed URL",
  "source_type": "String - rss | sitemap | api | scrape",
  "campaign_id": "UUID - FK -> crawler_campaigns.id",

  "config": {
    "css_selectors": {
      "title": "String",
      "content": "String",
      "image": "String",
      "date": "String"
    },
    "headers": {},
    "auth": null
  },

  "status": "String - active | disabled | error",
  "last_crawled_at": "ISODate | null",
  "total_crawled": 0,
  "error_count": 0,
  "last_error": "String | null"
}
```

---

### 2.13 Collection: `crawled_articles`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "source_id": "UUID - FK -> crawler_sources.id",
  "campaign_id": "UUID - FK -> crawler_campaigns.id",
  "original_url": "String",
  "original_title": "String",
  "original_content": "String",
  "original_image": "String | null",
  "original_date": "ISODate | null",

  "status": "String - pending | approved | rejected | imported",
  "approved_article_id": "UUID | null - FK -> articles.id (khi import)",

  "reviewed_by": "UUID | null",
  "reviewed_at": "ISODate | null"
}
```

---

### 2.14 Collection: `activity_logs`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "created_at": "ISODate",

  "user_id": "UUID - FK -> users.id",
  "action": "String - login | logout | create | update | delete | publish | approve | reject",
  "resource_type": "String - article | category | media | user | setting | ...",
  "resource_id": "UUID | null",
  "resource_title": "String | null",

  "details": "Object | null - Chi tiet bo sung",
  "ip_address": "String",
  "user_agent": "String",
  "status": "String - success | failed | warning"
}
```

> **Luu y:** `activity_logs` KHONG co `updated_at`, `deleted_at`, `version` vi la immutable log.

---

### 2.15 Collection: `royalty_configs`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "article_type": "String - ArticleType",
  "base_rate": "Number - VND co ban",
  "view_bonus": "Number - VND per view",
  "tiers": [
    { "min_words": 0, "max_words": 500, "rate": 500 },
    { "min_words": 501, "max_words": 1000, "rate": 600 }
  ],
  "duration_bonus": "Number | null - VND per minute (video/podcast)",
  "download_bonus": "Number | null - VND per download",
  "attendee_bonus": "Number | null - VND per attendee (event)"
}
```

---

### 2.16 Collection: `royalty_reports`

```json
{
  "id": "UUID v7",
  "tenant_id": "UUID",
  "version": 1,
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "deleted_at": null,

  "author_id": "UUID - FK -> users.id",
  "period": "String - 2026-03",
  "article_count": "Number",
  "total_views": "Number",
  "total_amount": "Number - VND",
  "status": "String - draft | confirmed | paid",

  "line_items": [
    {
      "article_id": "UUID",
      "article_title": "String",
      "article_type": "String",
      "word_count": "Number",
      "views": "Number",
      "base_amount": "Number",
      "bonus_amount": "Number",
      "total": "Number"
    }
  ],

  "confirmed_by": "UUID | null",
  "confirmed_at": "ISODate | null",
  "paid_at": "ISODate | null"
}
```

---

## 3. Index Design

### 3.1 Collection: `articles`

| Ten Index                        | Fields                                         | Type     | Muc dich                              |
| :------------------------------- | :--------------------------------------------- | :------- | :------------------------------------ |
| `idx_articles_tenant`            | `{ tenant_id: 1, deleted_at: 1 }`             | Compound | Multi-tenant isolation + soft delete  |
| `idx_articles_tenant_status`     | `{ tenant_id: 1, status: 1, created_at: -1 }` | Compound | Loc theo trang thai                   |
| `idx_articles_tenant_type`       | `{ tenant_id: 1, type: 1, created_at: -1 }`   | Compound | Loc theo loai bai viet                |
| `idx_articles_tenant_category`   | `{ tenant_id: 1, category_id: 1 }`            | Compound | Loc theo danh muc                     |
| `idx_articles_tenant_author`     | `{ tenant_id: 1, author_id: 1, created_at: -1 }` | Compound | Loc theo tac gia                  |
| `idx_articles_slug`              | `{ tenant_id: 1, slug: 1 }`                   | Unique   | Tra cuu theo slug                     |
| `idx_articles_published`         | `{ tenant_id: 1, status: 1, published_at: -1 }` | Compound | Danh sach da xuat ban              |
| `idx_articles_scheduled`         | `{ scheduled_at: 1, status: 1 }`              | Compound | Cron job xuat ban tu dong             |
| `idx_articles_featured`          | `{ tenant_id: 1, is_featured: 1, published_at: -1 }` | Compound | Bai viet noi bat              |
| `idx_articles_fulltext`          | `{ title: "text", summary: "text" }`          | Text     | Tim kiem full-text                    |
| `idx_articles_expires`           | `{ expires_at: 1 }`                           | Sparse   | Auto-archive bai het han             |

### 3.2 Collection: `content_sections`

| Ten Index                        | Fields                                    | Type     | Muc dich                     |
| :------------------------------- | :---------------------------------------- | :------- | :--------------------------- |
| `idx_sections_article`           | `{ article_id: 1, order: 1 }`            | Compound | Lay sections theo bai viet   |
| `idx_sections_tenant`            | `{ tenant_id: 1, deleted_at: 1 }`        | Compound | Multi-tenant                 |

### 3.3 Collection: `categories`

| Ten Index                        | Fields                                       | Type     | Muc dich                     |
| :------------------------------- | :------------------------------------------- | :------- | :--------------------------- |
| `idx_categories_tenant`          | `{ tenant_id: 1, deleted_at: 1 }`           | Compound | Multi-tenant                 |
| `idx_categories_slug`            | `{ tenant_id: 1, slug: 1 }`                 | Unique   | Tra cuu theo slug            |
| `idx_categories_parent`          | `{ tenant_id: 1, parent_id: 1 }`            | Compound | Cay danh muc                 |
| `idx_categories_type`            | `{ tenant_id: 1, type: 1 }`                 | Compound | Loc theo loai bai viet       |
| `idx_categories_path`            | `{ tenant_id: 1, path: 1 }`                 | Compound | Materialized path queries    |

### 3.4 Collection: `users`

| Ten Index                        | Fields                                   | Type     | Muc dich                     |
| :------------------------------- | :--------------------------------------- | :------- | :--------------------------- |
| `idx_users_tenant`               | `{ tenant_id: 1, deleted_at: 1 }`       | Compound | Multi-tenant                 |
| `idx_users_email`                | `{ tenant_id: 1, email: 1 }`            | Unique   | Dang nhap                    |
| `idx_users_username`             | `{ tenant_id: 1, username: 1 }`         | Unique   | Tra cuu                      |
| `idx_users_role`                 | `{ tenant_id: 1, role: 1, status: 1 }`  | Compound | Loc theo vai tro             |

### 3.5 Collection: `comments`

| Ten Index                        | Fields                                        | Type     | Muc dich                     |
| :------------------------------- | :-------------------------------------------- | :------- | :--------------------------- |
| `idx_comments_article`           | `{ article_id: 1, status: 1, created_at: -1 }` | Compound | Binh luan theo bai viet    |
| `idx_comments_moderation`        | `{ tenant_id: 1, status: 1, created_at: -1 }` | Compound | Hang doi kiem duyet        |

### 3.6 Collection: `activity_logs`

| Ten Index                        | Fields                                        | Type     | Muc dich                     |
| :------------------------------- | :-------------------------------------------- | :------- | :--------------------------- |
| `idx_logs_tenant_time`           | `{ tenant_id: 1, created_at: -1 }`           | Compound | Timeline                     |
| `idx_logs_user`                  | `{ tenant_id: 1, user_id: 1, created_at: -1 }` | Compound | Loc theo nguoi dung       |
| `idx_logs_resource`              | `{ resource_type: 1, resource_id: 1 }`       | Compound | Lich su 1 resource           |
| `idx_logs_ttl`                   | `{ created_at: 1 }` TTL: 90 days             | TTL      | Tu dong xoa log cu           |

### 3.7 Collection: `media_files`

| Ten Index                        | Fields                                     | Type     | Muc dich                     |
| :------------------------------- | :----------------------------------------- | :------- | :--------------------------- |
| `idx_media_tenant`               | `{ tenant_id: 1, type: 1, created_at: -1 }` | Compound | Thu vien media             |
| `idx_media_search`               | `{ title: "text", tags: "text" }`          | Text     | Tim kiem media               |

### 3.8 Collection: `crawler_campaigns` / `crawler_sources` / `crawled_articles`

| Ten Index                        | Fields                                        | Type     | Muc dich                     |
| :------------------------------- | :-------------------------------------------- | :------- | :--------------------------- |
| `idx_campaigns_tenant`           | `{ tenant_id: 1, status: 1 }`                | Compound | Danh sach campaigns          |
| `idx_sources_campaign`           | `{ campaign_id: 1, status: 1 }`              | Compound | Sources theo campaign        |
| `idx_crawled_status`             | `{ tenant_id: 1, status: 1, created_at: -1 }` | Compound | Hang doi duyet crawled     |
| `idx_crawled_source`             | `{ source_id: 1, created_at: -1 }`           | Compound | Articles theo source         |
| `idx_crawled_url`                | `{ original_url: 1 }`                        | Unique   | Chong trung lap URL          |

### 3.9 Collection: `royalty_reports`

| Ten Index                        | Fields                                       | Type     | Muc dich                     |
| :------------------------------- | :------------------------------------------- | :------- | :--------------------------- |
| `idx_royalty_author_period`      | `{ tenant_id: 1, author_id: 1, period: 1 }` | Unique   | 1 report/author/period       |
| `idx_royalty_status`             | `{ tenant_id: 1, status: 1, period: -1 }`   | Compound | Loc theo trang thai          |

---

## 4. Entity Relationship Diagram (ERD)

```
                                    +------------------+
                                    |   tenants        |
                                    |  (system DB)     |
                                    +--------+---------+
                                             |
                            tenant_id (FK)   |  (All collections)
                 +---------------------------+---------------------------+
                 |               |               |              |       |
        +--------v--------+  +--v---------+  +--v--------+  +--v----+  |
        |   users         |  | categories |  | tags      |  | ...   |  |
        |                 |  |            |  |           |  |       |  |
        | id (PK)         |  | id (PK)    |  | id (PK)   |  |       |  |
        | email           |  | name       |  | name      |  |       |  |
        | role            |  | type ------+--+ slug      |  |       |  |
        | permission_     |  | parent_id  |  +-----------+  +-------+  |
        |   group_ids[]---+->| slug       |                            |
        +---------+-------+  | path       |                            |
                  |          +-----+------+                            |
                  |                |                                    |
          +-------v-------+  +----v-----+                              |
          |  articles     |<-+ (1 type  |                              |
          |               |  |  per cat)|                              |
          | id (PK)       |  +----------+                              |
          | title         |                                            |
          | type          |     +-------------------+                  |
          | status        |     | content_sections  |                  |
          | category_id --+--->+|                   |                  |
          | author_id ----+--->+| id (PK)           |                  |
          | tags[]        |     | article_id (FK) --+                  |
          |               |     | type (24 types)   |                  |
          +---+---+---+---+     | order             |                  |
              |   |   |         | data {}           |                  |
              |   |   |         +-------------------+                  |
              |   |   |                                                |
    +---------+   |   +----------+                                     |
    |             |              |                                      |
+---v--------+ +-v----------+ +-v-----------------+                    |
| comments   | | workflow_  | | royalty_reports   |                    |
|            | | instances  | |                   |                    |
| article_id | | article_id | | author_id (FK)   |                    |
| parent_id  | | steps[]    | | line_items[]     |                    |
| status     | | status     | | period           |                    |
+------------+ +------------+ +-------------------+                    |
                                                                       |
   +--------------------+   +-------------------+                      |
   | crawler_campaigns  |   | event_streams     |                      |
   |                    |   |                   |                      |
   | source_ids[] ------+-->| article_ids[] ----+--- articles          |
   +--------+-----------+   +-------------------+                      |
            |                                                          |
   +--------v-----------+   +-------------------+                      |
   | crawler_sources    |   | activity_logs     |                      |
   |                    |   |                   |                      |
   | campaign_id (FK)   |   | user_id (FK) -----+--- users            |
   +--------+-----------+   | resource_type     |                      |
            |               | resource_id       |                      |
   +--------v-----------+   +-------------------+                      |
   | crawled_articles   |                                              |
   |                    |   +-------------------+                      |
   | source_id (FK)     |   | media_files       |                      |
   | campaign_id (FK)   |   |                   |                      |
   | approved_article_id|   | uploaded_by (FK) -+--- users             |
   +--------------------+   +-------------------+                      |
                                                                       |
   +--------------------+                                              |
   | permission_groups  |<---------------------------------------------+
   |                    |
   | member_ids[] (FK)  |--- users
   | permissions {}     |
   +--------------------+
```

---

## 5. Data Validation Rules

### 5.1 Articles

| Field            | Validation                                             |
| :--------------- | :----------------------------------------------------- |
| `title`          | Required, min 1, max 500 chars                         |
| `slug`           | Required, unique per tenant, pattern: `[a-z0-9-]+`    |
| `type`           | Required, must be valid ArticleType enum               |
| `status`         | Required, must be valid ArticleStatus enum             |
| `category_id`    | Required, must exist, category.type == article.type    |
| `author_id`      | Required, must exist, user.status == 'active'          |
| `content`        | Required when status != 'draft'                        |
| `scheduled_at`   | Must be future date, only when status == 'scheduled'   |

### 5.2 Categories

| Field            | Validation                                             |
| :--------------- | :----------------------------------------------------- |
| `name`           | Required, min 1, max 200 chars                         |
| `slug`           | Required, unique per tenant                            |
| `type`           | Required, valid ArticleType, immutable after creation  |
| `parent_id`      | If set, must exist and parent.type == this.type        |
| `level`          | Auto-calculated, max depth = 5                         |

### 5.3 Users

| Field            | Validation                                             |
| :--------------- | :----------------------------------------------------- |
| `email`          | Required, valid email, unique per tenant               |
| `username`       | Required, min 3, max 50, unique per tenant             |
| `password_hash`  | Required, min 8 chars original (before hash)           |
| `role`           | Required, valid role enum                              |
