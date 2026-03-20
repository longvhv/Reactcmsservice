# Tai lieu Luong Nghiep vu & Xu ly Tinh nang

## CMS Service - Business Process Documentation

**Phien ban:** 2.0
**Cap nhat:** 17/03/2026
**Tac gia:** CMS Engineering Team

---

## 1. Tong quan cac luong nghiep vu chinh

| STT | Luong nghiep vu                  | Module            | Do phuc tap |
| :-- | :------------------------------- | :---------------- | :---------- |
| 1   | Quan ly bai viet (CRUD)          | Articles          | Cao         |
| 2   | Multi-Section Content Editor     | Articles/Sections | Cao         |
| 3   | Workflow duyet bai               | Workflow          | Cao         |
| 4   | Quan ly danh muc                 | Categories        | Trung binh  |
| 5   | Quan ly media                    | Media             | Trung binh  |
| 6   | Kiem duyet binh luan             | Comments          | Trung binh  |
| 7   | Crawler thu thap noi dung        | Crawler           | Cao         |
| 8   | Tinh nhuan but (Royalty)         | Royalty           | Cao         |
| 9   | Quan ly nguoi dung & phan quyen  | Users/Permissions | Cao         |
| 10  | Dong su kien (Event Streams)     | Event Streams     | Trung binh  |
| 11  | Xuat ban tu dong (Scheduling)    | Articles          | Trung binh  |

---

## 2. Luong 1: Quan ly Bai viet (Article Lifecycle)

### 2.1 Mo ta

Toan bo vong doi cua mot bai viet tu khi tao den khi luu tru, bao gom:
- Tao moi (voi 16 loai bai viet khac nhau)
- Chinh sua (multi-section block editor)
- Gui duyet / Duyet bai
- Xuat ban (ngay hoac len lich)
- Luu tru / Xoa mem

### 2.2 Luong xu ly chi tiet

```
[Nguoi dung] --> Chon "Tao bai viet moi"
      |
      v
[He thong] --> Hien thi form ArticleEditor
      |        - Chon loai bai viet (1 trong 16 types)
      |        - Tu dong them 1 section "Van ban (HTML)" mac dinh
      |        - Load truong dac thu theo type (video_data, event_data, ...)
      |
      v
[Nguoi dung] --> Nhap thong tin
      |        - Tieu de, mo ta ngan
      |        - Chon danh muc (chi hien danh muc co type khop)
      |        - Them tags, chon tac gia
      |        - Upload anh dai dien
      |        - Soạn noi dung (them/xoa/sap xep sections)
      |        - Nhap truong dac thu (neu co)
      |        - Cau hinh SEO (optional)
      |
      v
[Nguoi dung] --> Chon hanh dong:
      |
      +---> [Luu nhap]
      |       status = 'draft'
      |       --> Luu vao DB --> Quay lai form
      |
      +---> [Luu va them tiep]
      |       status = 'draft'
      |       --> Luu vao DB --> Reset form --> Tao bai viet moi
      |
      +---> [Gui duyet]
      |       status = 'pending'
      |       --> Tao workflow_instance
      |       --> Gui thong bao cho reviewer
      |       --> Chuyen sang luong Workflow (xem Luong 3)
      |
      +---> [Xuat ban]
              Kiem tra quyen "publish"
              |
              +---> Co quyen: status = 'published', published_at = now()
              +---> Khong quyen: status = 'pending' (bat buoc qua workflow)
```

### 2.3 Rang buoc nghiep vu

| Rang buoc                                          | Mo ta                                                    |
| :------------------------------------------------- | :------------------------------------------------------- |
| **RC-ART-01** Category-Type binding                | Danh muc chi chua 1 loai bai viet. article.type == category.type |
| **RC-ART-02** Auto section on create               | Tao bai viet moi -> tu dong them 1 section `html`       |
| **RC-ART-03** Save & Continue                      | Tat ca form them/sua deu co tuy chon "Luu va them tiep" |
| **RC-ART-04** Slug unique                          | slug la duy nhat trong tenant, tu dong generate tu title |
| **RC-ART-05** Status transition                    | draft -> pending -> published/rejected, published -> archived |
| **RC-ART-06** Soft delete only                     | Khong xoa vat ly, chi set deleted_at                     |
| **RC-ART-07** Optimistic locking                   | Check version truoc khi save, reject neu version mismatch |
| **RC-ART-08** Content required for publish         | Bai viet phai co noi dung (sections) khi xuat ban        |

---

## 3. Luong 2: Multi-Section Content Editor

### 3.1 Mo ta

He thong noi dung da section voi 24 loai section, chi su dung Block Editor (da loai bo Rich Text editor).

### 3.2 Luong xu ly

```
[Bai viet moi] --> He thong tu dong tao 1 section HTML mac dinh
      |
      v
[Nguoi dung] --> Thao tac voi sections:
      |
      +---> [Them section]
      |       Click "Them section" -> Chon tu 24 loai
      |       -> Section moi duoc them vao cuoi (order = max + 1)
      |       -> Mo editor tuong ung (Block Editor)
      |
      +---> [Sua section]
      |       Click vao section -> Mo section editor
      |       -> Sua noi dung, cau hinh (spacing, background, css_class)
      |       -> Tu dong luu (debounce 500ms)
      |
      +---> [Xoa section]
      |       Click "Xoa" -> Hien confirm dialog
      |       -> Soft delete section, re-order cac section con lai
      |
      +---> [Sap xep section]
      |       Keo tha (drag & drop) de thay doi thu tu
      |       -> Cap nhat order field cua tat ca sections bi anh huong
      |
      +---> [An/Hien section]
              Toggle is_visible -> Section bi an khong hien thi o frontend
              Nhung van duoc luu trong DB
```

### 3.3 Cau truc du lieu Section theo Type

| Section Type    | Data chinh                                            |
| :-------------- | :---------------------------------------------------- |
| `html`          | `content: string (HTML tu Block Editor)`              |
| `image`         | `imageUrl, alt, caption, credit, width, alignment`    |
| `gallery`       | `images[], layout, columns, gap, enableLightbox`      |
| `video`         | `source, url, poster, aspectRatio, caption`           |
| `chart`         | `chartType, data[], title, axes, colorScheme`         |
| `timeline`      | `events[], layout, showConnector`                     |
| `poll`          | `question, options[], allowMultiple, endDate`         |
| `accordion`     | `items[], allowMultipleOpen, style`                   |
| `tabs`          | `tabs[], tabStyle`                                    |
| `steps`         | `steps[], layout, showNumbers, style`                 |
| `comparison`    | `items[], criteria[], layout`                         |
| `code`          | `language, code, filename, showLineNumbers, theme`    |
| `table`         | `headers[], rows[][], striped, bordered`              |
| `cta`           | `title, description, buttonText, buttonUrl, style`    |
| `quote`         | `text, author, source, avatar, style`                 |
| `callout`       | `variant, title, content, dismissible`                |
| `alert`         | `variant, title, message, link`                       |
| `divider`       | `style, width, color, withText`                       |
| `slideshow`     | `slides[], autoPlay, interval, transition`            |
| `audio`         | `source, url, title, artist, coverImage`              |
| `embed`         | `embedType, url, embedCode, aspectRatio`              |
| `numbers`       | `items[], columns, animate, style`                    |
| `toggle-list`   | `variant, columns, items[]`                           |
| `file-download` | `files[], layout`                                     |

---

## 4. Luong 3: Workflow Duyet bai

### 4.1 Mo ta

He thong phe duyet nhieu buoc. Bai viet phai duoc nguoi co quyen duyet truoc khi xuat ban.

### 4.2 Luong xu ly

```
[Tac gia] --> Submit bai viet (status: pending)
      |
      v
[He thong] --> Tao workflow_instance
      |        current_step = 1
      |        status = 'in_progress'
      |
      v
[He thong] --> Gui thong bao cho Reviewer (step 1)
      |        (email + notification center)
      |
      v
[Reviewer] --> Xem bai viet, kiem tra noi dung
      |
      +---> [Phe duyet] ----+
      |       step.status = 'approved'
      |       |
      |       v
      |       Con buoc tiep?
      |       |
      |       +---> Co: current_step++ --> Gui thong bao reviewer tiep theo
      |       |
      |       +---> Khong: workflow.status = 'completed'
      |              article.status = 'published'
      |              article.published_at = now()
      |              article.approved_by = reviewer.id
      |              article.approved_at = now()
      |              --> Gui thong bao cho tac gia "Bai viet da duoc duyet"
      |
      +---> [Tu choi] ----+
      |       step.status = 'rejected'
      |       workflow.status = 'rejected'
      |       article.status = 'rejected'
      |       article.rejection_reason = comment
      |       --> Gui thong bao cho tac gia "Bai viet bi tu choi"
      |       --> Tac gia co the chinh sua va gui lai
      |
      +---> [Yeu cau chinh sua] ----+
              step.status = 'revision_requested'
              --> Gui thong bao cho tac gia kem nhan xet
              --> Tac gia sua bai --> Gui lai (reset workflow)
```

### 4.3 Rang buoc Workflow

| Rang buoc                          | Mo ta                                             |
| :--------------------------------- | :------------------------------------------------ |
| **RC-WF-01** Role-based review     | Chi user co quyen 'approve' moi duoc duyet bai    |
| **RC-WF-02** No self-approve       | Tac gia khong the tu duyet bai cua minh            |
| **RC-WF-03** Sequential steps      | Cac buoc phai thuc hien tuan tu                    |
| **RC-WF-04** Audit trail           | Moi hanh dong duyet deu duoc ghi log               |
| **RC-WF-05** Re-submit after reject| Bai bi tu choi co the sua va gui lai               |

---

## 5. Luong 4: Quan ly Danh muc

### 5.1 Mo ta

Danh muc phan cap (tree structure) voi rang buoc moi danh muc chi chua 1 loai bai viet.

### 5.2 Luong xu ly

```
[Admin] --> Tao danh muc moi
      |
      v
[He thong] --> Hien thi form CategoryFormModal
      |        - Ten danh muc (bat buoc)
      |        - Slug (tu dong generate, co the sua)
      |        - Loai bai viet (bat buoc, khong doi duoc sau khi tao)
      |        - Danh muc cha (optional - chi hien danh muc cung type)
      |        - Mo ta, icon, mau sac, anh dai dien
      |        - SEO: meta title, meta description
      |
      v
[Validation]
      |
      +---> Check slug unique trong tenant
      +---> Check type hop le
      +---> Check parent_id (neu co): parent.type == this.type
      +---> Check max depth <= 5
      +---> Auto-calculate: level, path
      |
      v
[Luu] --> Insert vao categories collection
      |
      +---> [Luu va them tiep] --> Reset form, giu lai type va parent
```

### 5.3 Cac thao tac danh muc

| Thao tac            | Mo ta                                               | Rang buoc                              |
| :------------------ | :-------------------------------------------------- | :------------------------------------- |
| Tao moi             | Tao danh muc voi type co dinh                       | Type bat buoc, khong doi sau khi tao   |
| Sua                 | Sua ten, mo ta, SEO, icon, mau                      | Khong doi duoc type                    |
| Xoa                 | Soft delete                                         | Bai viet con -> chuyen sang "Chua phan loai" |
| Di chuyen           | Thay doi parent_id                                  | Chi di chuyen sang parent cung type    |
| Gop (Merge)         | Gop 2 danh muc cung type                            | Bai viet cua danh muc bi gop -> chuyen sang danh muc dich |

---

## 6. Luong 5: Crawler Thu thap Noi dung

### 6.1 Mo ta

He thong tu dong thu thap noi dung tu cac nguon ben ngoai (RSS, sitemap, scrape).

### 6.2 Luong xu ly

```
[Admin] --> Tao Chien dich Crawler
      |     (ten, mo ta, tham so, lich chay)
      |
      v
[Admin] --> Them Nguon thu thap
      |     (ten, URL, loai nguon, CSS selectors)
      |
      v
[He thong] --> Chay crawler theo lich
      |        (cron job hoac manual trigger)
      |
      v
[Crawler Engine] --> Fetch noi dung tu nguon
      |             Parse HTML/RSS/API
      |             Extract: title, content, image, date
      |
      v
[He thong] --> Luu vao crawled_articles
      |        status = 'pending'
      |        Check trung lap (original_url unique)
      |
      v
[Reviewer] --> Duyet noi dung da crawl
      |
      +---> [Duyet] --> Tao article tu crawled data
      |               crawled.status = 'approved'
      |               crawled.approved_article_id = new_article.id
      |               article.status = 'draft' (can chinh sua truoc khi xuat ban)
      |
      +---> [Tu choi] --> crawled.status = 'rejected'
      |
      +---> [Bo qua] --> Giu nguyen 'pending', xu ly sau
```

### 6.3 Rang buoc Crawler

| Rang buoc                          | Mo ta                                             |
| :--------------------------------- | :------------------------------------------------ |
| **RC-CRW-01** URL unique           | Khong crawl trung URL da ton tai                   |
| **RC-CRW-02** Rate limiting        | Gioi han tan suat request toi 1 nguon              |
| **RC-CRW-03** Error handling       | Sau 3 lan loi lien tiep -> disable source          |
| **RC-CRW-04** Content validation   | Bai crawl phai co title va content, khong rong      |
| **RC-CRW-05** Review required      | Tat ca bai crawl phai duoc review truoc khi import  |

---

## 7. Luong 6: Tinh Nhuan but (Royalty)

### 7.1 Mo ta

Tu dong tinh nhuan but cho tac gia dua tren loai bai viet, so tu, luot xem, va cac tieu chi khac.

### 7.2 Luong xu ly

```
[Cron Job] --> Chay hang thang (hoac theo yeu cau)
      |
      v
[He thong] --> Cho moi tac gia:
      |
      +---> Lay tat ca bai viet da xuat ban trong ky
      |
      +---> Voi moi bai viet:
      |       |
      |       +---> Xac dinh article_type
      |       +---> Lay royalty_config tuong ung
      |       +---> Tinh base_amount:
      |       |       - news: word_count * rate_per_word (theo tier)
      |       |       - video: base_rate + duration * duration_bonus
      |       |       - gallery: image_count * base_rate_per_image
      |       |       - podcast: base_rate + duration * duration_bonus
      |       |       - event: base_rate + attendees * attendee_bonus
      |       |       - download: base_rate + downloads * download_bonus
      |       |
      |       +---> Tinh bonus_amount = views * view_bonus
      |       +---> total = base_amount + bonus_amount
      |
      +---> Tao royalty_report voi line_items
      |     status = 'draft'
      |
      v
[Admin/KeToan] --> Xem va xac nhan bao cao
      |
      +---> [Xac nhan] --> status = 'confirmed'
      +---> [Sua] --> Dieu chinh so lieu truoc khi xac nhan
      +---> [Thanh toan] --> status = 'paid', paid_at = now()
```

### 7.3 Cong thuc tinh Nhuan but

```
=== Tin tuc (news/blog/press-release/interview) ===
Tier 1: 0-500 tu     -> 500 VND/tu
Tier 2: 501-1000 tu  -> 600 VND/tu
Tier 3: 1001-2000 tu -> 700 VND/tu
Tier 4: 2001+ tu     -> 800 VND/tu
View bonus: 50 VND/luot xem

=== Video ===
Base: 50,000 VND/video
Duration bonus: 5,000 VND/phut
View bonus: 100 VND/luot xem

=== Gallery ===
Base: 20,000 VND/anh
View bonus: 30 VND/luot xem

=== Podcast ===
Base: 80,000 VND/tap
View bonus: 80 VND/luot nghe

=== Su kien ===
Base: 100,000 VND/su kien
Attendee bonus: 1,000 VND/nguoi tham gia

=== Tuyen dung ===
Base: 50,000 VND/tin
Application bonus: 2,000 VND/don ung tuyen

=== Infographic ===
Base: 150,000 VND/infographic
View bonus: 120 VND/luot xem
```

---

## 8. Luong 7: Quan ly Nguoi dung & Phan quyen

### 8.1 Luong tao nguoi dung

```
[Admin] --> Chon "Them nguoi dung"
      |
      v
[He thong] --> Hien thi form
      |        - Ho ten (bat buoc)
      |        - Email (bat buoc, unique)
      |        - So dien thoai
      |        - Vai tro (bat buoc): Admin | Editor | Author | Contributor
      |        - Mat khau (bat buoc, min 8 ky tu)
      |        - Xac nhan mat khau
      |        - [x] Gui email thong bao tai khoan
      |
      v
[Validation] --> Kiem tra:
      |        - Email unique trong tenant
      |        - Mat khau du manh (Policy check)
      |        - Vai tro hop le
      |
      v
[Luu] --> Hash password (bcrypt) --> Insert user
      |
      +---> [Luu va them nguoi dung khac] --> Reset form
      +---> Gui email thong bao (neu chon)
```

### 8.2 He thong phan quyen

```
User --has--> Role (admin/editor/author/contributor/viewer)
  |
  +--belongs-to--> Permission Group(s)
                      |
                      +--has--> Permissions {
                                  articles: { create, read, update, delete, publish, approve }
                                  categories: { create, read, update, delete }
                                  media: { create, read, update, delete }
                                  users: { create, read, update, delete }
                                  settings: { read, update }
                                }
```

**Ma tran quyen mac dinh:**

| Quyen              | Admin | Editor | Author | Contributor | Viewer |
| :----------------- | :---: | :----: | :----: | :---------: | :----: |
| articles.create    |  v    |   v    |   v    |     v       |        |
| articles.read      |  v    |   v    |   v    |     v       |   v    |
| articles.update    |  v    |   v    |  own   |    own      |        |
| articles.delete    |  v    |   v    |        |             |        |
| articles.publish   |  v    |   v    |        |             |        |
| articles.approve   |  v    |   v    |        |             |        |
| categories.create  |  v    |   v    |        |             |        |
| categories.update  |  v    |   v    |        |             |        |
| categories.delete  |  v    |        |        |             |        |
| media.upload       |  v    |   v    |   v    |     v       |        |
| media.delete       |  v    |   v    |        |             |        |
| users.manage       |  v    |        |        |             |        |
| settings.update    |  v    |        |        |             |        |

---

## 9. Luong 8: Dong Su kien (Event Streams)

### 9.1 Mo ta

Nhom nhieu bai viet theo 1 chu de/su kien (VD: "Tech Summit 2026").

### 9.2 Luong xu ly

```
[Editor] --> Tao dong su kien moi
      |     (ten, slug, mo ta, thumbnail, tags, SEO)
      |
      v
[Luu] --> Insert event_stream
      |
      v
[Editor] --> Them bai viet vao dong su kien
      |     - Tim kiem bai viet san co
      |     - Hoac tao bai viet moi gan vao dong
      |     - Sap xep thu tu bai viet
      |
      v
[He thong] --> Cap nhat event_stream.article_ids[]
      |
      v
[Frontend] --> Hien thi trang dong su kien
      |       - Timeline bai viet
      |       - Embed widget (4 kieu: timeline, card, banner, floating)
```

---

## 10. Luong 9: Xuat ban Tu dong (Auto-scheduling)

### 10.1 Mo ta

Bai viet co the dat lich xuat ban tu dong tai thoi diem chi dinh.

### 10.2 Luong xu ly

```
[Tac gia/Editor] --> Tao/sua bai viet
      |             Bat "Len lich xuat ban"
      |             Chon ngay gio xuat ban (phai la tuong lai)
      |
      v
[He thong] --> Luu article:
      |        status = 'draft' (hoac 'pending' neu can duyet)
      |        scheduled_at = <thoi diem chon>
      |
      v
[Cron Job] --> Chay moi phut
      |        Query: { scheduled_at <= now(), status in ['draft','pending'] }
      |
      v
[He thong] --> Voi moi bai viet den han:
      |
      +---> Kiem tra da duoc duyet chua?
      |     +---> Chua -> Bo qua, giu nguyen
      |     +---> Roi -> Chuyen status = 'published'
      |                  published_at = now()
      |                  Gui thong bao cho tac gia
      |
      v
[He thong] --> Ghi activity_log
```

---

## 11. Luong 10: Kiem duyet Binh luan

```
[Doc gia] --> Gui binh luan tren bai viet
      |
      v
[He thong] --> Luu comment, status = 'pending'
      |        Gui thong bao cho moderator
      |
      v
[Moderator] --> Xem hang doi kiem duyet
      |
      +---> [Duyet] --> status = 'approved' --> Hien thi comment
      +---> [Tu choi] --> status = 'rejected'
      +---> [Danh dau spam] --> status = 'spam'
      +---> [Phan hoi] --> Tao comment moi voi parent_id = comment.id
```

---

## 12. Tieu chuan API Endpoints

Theo Guidelines.md - su dung danh tu so it, bo hau to `-service`.

### 12.1 Article API

| Method | Endpoint                                  | Mo ta                    |
| :----- | :---------------------------------------- | :----------------------- |
| GET    | `/api/cms/v1/articles`                    | List articles (paginated)|
| GET    | `/api/cms/v1/articles/:id`                | Get article by ID        |
| POST   | `/api/cms/v1/articles`                    | Create article           |
| PUT    | `/api/cms/v1/articles/:id`                | Update article           |
| DELETE | `/api/cms/v1/articles/:id`                | Soft delete article      |
| POST   | `/api/cms/v1/articles/:id/publish`        | Publish article          |
| POST   | `/api/cms/v1/articles/:id/submit-review`  | Submit for review        |
| GET    | `/api/cms/v1/articles/:id/sections`       | Get article sections     |
| POST   | `/api/cms/v1/articles/:id/sections`       | Add section              |
| PUT    | `/api/cms/v1/articles/:id/sections/:sid`  | Update section           |
| DELETE | `/api/cms/v1/articles/:id/sections/:sid`  | Delete section           |
| PUT    | `/api/cms/v1/articles/:id/sections/order` | Reorder sections         |

### 12.2 Category API

| Method | Endpoint                                  | Mo ta                    |
| :----- | :---------------------------------------- | :----------------------- |
| GET    | `/api/cms/v1/categories`                  | List/tree categories     |
| GET    | `/api/cms/v1/categories/:id`              | Get category by ID       |
| POST   | `/api/cms/v1/categories`                  | Create category          |
| PUT    | `/api/cms/v1/categories/:id`              | Update category          |
| DELETE | `/api/cms/v1/categories/:id`              | Soft delete category     |
| PUT    | `/api/cms/v1/categories/:id/move`         | Move category            |
| POST   | `/api/cms/v1/categories/merge`            | Merge categories         |

### 12.3 User API

| Method | Endpoint                                  | Mo ta                    |
| :----- | :---------------------------------------- | :----------------------- |
| GET    | `/api/user/v1/users`                      | List users               |
| GET    | `/api/user/v1/users/:id`                  | Get user by ID           |
| POST   | `/api/user/v1/users`                      | Create user              |
| PUT    | `/api/user/v1/users/:id`                  | Update user              |
| DELETE | `/api/user/v1/users/:id`                  | Soft delete user         |

### 12.4 Authentication API

| Method | Endpoint                                  | Mo ta                    |
| :----- | :---------------------------------------- | :----------------------- |
| POST   | `/api/authentication/v1/login`            | Login                    |
| POST   | `/api/authentication/v1/logout`           | Logout                   |
| POST   | `/api/authentication/v1/refresh`          | Refresh token            |
| POST   | `/api/authentication/v1/2fa/verify`       | Verify 2FA code          |

### 12.5 Pages (Frontend Routes)

| Route                                      | Mo ta                    |
| :----------------------------------------- | :----------------------- |
| `/page/cms/dashboard`                      | Bang dieu khien          |
| `/page/cms/articles`                       | Quan ly bai viet         |
| `/page/cms/articles/:id`                   | Chi tiet bai viet        |
| `/page/cms/categories`                     | Quan ly danh muc         |
| `/page/cms/categories/:id`                 | Chi tiet danh muc        |
| `/page/cms/moderation`                     | Kiem duyet               |
| `/page/cms/users`                          | Quan ly nguoi dung       |
| `/page/cms/users/roles`                    | Vai tro & Quyen han      |
| `/page/cms/users/groups`                   | Nhom nguoi dung          |
| `/page/cms/users/access-logs`              | Nhat ky truy cap         |
| `/page/cms/users/security`                 | Bao mat                  |
| `/page/cms/analytics`                      | Phan tich thong ke       |
| `/page/cms/settings`                       | Cai dat                  |
| `/page/cms/event-series`                   | Dong su kien             |
| `/page/cms/event-series/:id`               | Chi tiet dong su kien    |
| `/page/cms/permissions`                    | Nhom quyen               |
| `/page/cms/permissions/:id`                | Chi tiet nhom quyen      |
| `/page/cms/royalty-management`             | Cau hinh nhuan but       |
| `/page/cms/royalty-integration`            | Quan ly & Bao cao        |
| `/page/cms/activity`                       | Nhat ky hoat dong        |
| `/page/cms/ai-tools`                       | Cong cu AI               |
| `/page/cms/approval-workflow`              | Luong duyet bai          |
| `/page/cms/workflow-manager`               | Quan ly workflow         |
