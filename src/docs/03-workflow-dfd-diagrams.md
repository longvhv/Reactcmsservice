# Tai lieu Workflow & Data Flow Diagrams (DFD)

## CMS Service - Visual Process Documentation

**Phien ban:** 2.0
**Cap nhat:** 17/03/2026
**Tac gia:** CMS Engineering Team

---

## 1. Context Diagram (DFD Level 0)

```
                   +------------------+
                   |    Doc gia       |
                   | (Reader/Visitor) |
                   +--------+---------+
                            |
                   Binh luan, Xem bai viet
                            |
                            v
+------------+     +--------+----------+     +--------------+
|  Tac gia   |---->|                   |---->|  Nguon       |
| (Author/   |     |   HE THONG CMS   |     |  ben ngoai   |
| Contributor)|<---|   (cms_service)   |<----|  (RSS/APIs)  |
+------------+     |                   |     +--------------+
                   +--+----+------+---+
                      |    |      |
          +-----------+    |      +-----------+
          |                |                  |
          v                v                  v
   +------+-----+  +------+------+  +--------+-------+
   |   Admin    |  |  Editor/    |  |  Ke toan       |
   | (Quan tri) |  |  Reviewer   |  | (Accountant)   |
   +------------+  +-------------+  +----------------+
```

**Cac Actor chinh:**

| Actor          | Vai tro                                                 |
| :------------- | :------------------------------------------------------ |
| Doc gia        | Xem bai viet, gui binh luan                             |
| Tac gia        | Tao, sua bai viet, gui duyet                            |
| Editor         | Bien tap, duyet bai, quan ly noi dung                   |
| Admin          | Quan tri toan he thong, phan quyen, cau hinh            |
| Ke toan        | Xac nhan va thanh toan nhuan but                        |
| Nguon ben ngoai| RSS feeds, APIs cung cap noi dung cho Crawler           |

---

## 2. DFD Level 1 - Cac Process chinh

```
+------------------------------------------------------------------+
|                        HE THONG CMS                               |
|                                                                   |
|  +-------------+     +---------------+     +------------------+   |
|  | P1. Quan ly |     | P2. Quan ly   |     | P3. Workflow     |   |
|  | Bai viet    |<--->| Danh muc      |     | Duyet bai        |   |
|  +------+------+     +-------+-------+     +--------+---------+   |
|         |                    |                       |            |
|         v                    v                       v            |
|  +------+----------------------------------------------------+   |
|  |                   D1. articles (MongoDB)                   |   |
|  +------+----------------------------------------------------+   |
|         |                                                         |
|  +------+------+     +---------------+     +------------------+   |
|  | P4. Quan ly |     | P5. Crawler   |     | P6. Tinh         |   |
|  | Media       |     | Thu thap      |     | Nhuan but        |   |
|  +------+------+     +-------+-------+     +--------+---------+   |
|         |                    |                       |            |
|         v                    v                       v            |
|  +------+------+     +------+--------+     +--------+---------+   |
|  | D2. media   |     | D3. crawled   |     | D4. royalty      |   |
|  | _files      |     | _articles     |     | _reports         |   |
|  +-------------+     +---------------+     +------------------+   |
|                                                                   |
|  +-------------+     +---------------+     +------------------+   |
|  | P7. Quan ly |     | P8. Kiem duyet|     | P9. Phan tich    |   |
|  | Nguoi dung  |     | Binh luan     |     | Thong ke         |   |
|  +------+------+     +-------+-------+     +--------+---------+   |
|         |                    |                       |            |
|         v                    v                       v            |
|  +------+------+     +------+--------+     +--------+---------+   |
|  | D5. users   |     | D6. comments  |     | D7. activity     |   |
|  |             |     |               |     | _logs            |   |
|  +-------------+     +---------------+     +------------------+   |
+------------------------------------------------------------------+
```

---

## 3. DFD Level 2 - Process P1: Quan ly Bai viet

```
                         Tac gia / Editor
                              |
              +---------------+----------------+
              |               |                |
              v               v                v
     +--------+------+ +-----+-------+ +------+--------+
     | P1.1 Tao      | | P1.2 Sua   | | P1.3 Tim kiem |
     | bai viet moi  | | bai viet   | | & Loc         |
     +--------+------+ +-----+-------+ +------+--------+
              |               |                |
              v               v                v
     +--------+------+ +-----+-------+ +------+--------+
     | P1.4 Quan ly  | | P1.5 Xuat  | | P1.6 Xoa/     |
     | Sections      | | ban/Len    | | Luu tru        |
     | (Block Editor)| | lich       | |                |
     +--------+------+ +-----+-------+ +------+--------+
              |               |                |
              +-------+-------+--------+-------+
                      |                |
                      v                v
              +-------+------+ +------+----------+
              | D1. articles | | D1a. content    |
              |              | | _sections       |
              +--------------+ +------------------+
```

**Chi tiet P1.1 - Tao bai viet moi:**

```
Input:                          Processing:                     Output:
                                                                
[Tac gia nhap]                  [He thong xu ly]                [Ket qua]
                                                                
  title        ----+            1. Validate inputs              article (status=draft)
  type         ----|            2. Generate slug from title      |
  category_id  ----|------->    3. Check slug uniqueness         +-> content_sections
  author_id    ----|            4. Check category.type ==        |   (1 section html
  tags[]       ----|               article.type                 |    mac dinh)
  featured_img ----+            5. Create article document      |
                                6. Auto-create 1 HTML section   +-> activity_log
                                7. Log activity                     (action=create)
                                8. Return article
```

---

## 4. DFD Level 2 - Process P3: Workflow Duyet bai

```
                    Tac gia
                      |
                      | Submit bai viet
                      v
             +--------+----------+
             | P3.1 Khoi tao     |
             | Workflow          |
             | - Tao instance    |
             | - Xac dinh steps  |
             +--------+----------+
                      |
                      | Gui thong bao
                      v
             +--------+----------+
             | P3.2 Thong bao    |
             | cho Reviewer      |
             | (Email + Push)    |
             +--------+----------+
                      |
                      v
                   Reviewer
                      |
         +------------+------------+
         |            |            |
         v            v            v
  +------+-----+ +---+------+ +---+--------+
  | P3.3       | | P3.4     | | P3.5       |
  | Phe duyet  | | Tu choi  | | Yeu cau    |
  |            | |          | | chinh sua  |
  +------+-----+ +---+------+ +---+--------+
         |            |            |
         v            v            v
  +------+-----+ +---+------+ +---+--------+
  | Con buoc?  | | Reject   | | Gui thong  |
  |            | | article  | | bao tac gia|
  | Co -> P3.2 | | Notify   | | -> Sua bai |
  | Khong:     | | author   | | -> Gui lai |
  | Publish    | +----------+ +---+--------+
  | article    |                   |
  +------+-----+                   |
         |                         |
         v                         v
  +------+-----+           +------+------+
  | D1.articles|           | P3.1 (Loop) |
  | status =   |           | Re-submit   |
  | published  |           +-------------+
  +------------+
```

---

## 5. DFD Level 2 - Process P5: Crawler

```
     Admin
       |
       | Cau hinh Campaign + Sources
       v
+------+--------+
| P5.1 Cau hinh |
| Crawler       |
| - Campaign    |
| - Sources     |
| - Schedule    |
+------+--------+
       |
       v
+------+--------+      +---------------+
| P5.2 Thuc thi |----->| Nguon ben     |
| Crawler       |<-----| ngoai (RSS/   |
| (Cron/Manual) |      | Web/API)      |
+------+--------+      +---------------+
       |
       | Raw content
       v
+------+--------+
| P5.3 Parse &  |
| Extract       |
| - Title       |
| - Content     |
| - Image       |
| - Date        |
+------+--------+
       |
       v
+------+---------+
| P5.4 Validate  |
| & Deduplicate  |
| - Check URL    |
|   unique       |
| - Validate     |
|   content      |
+------+---------+
       |
       v
+------+--------+       Reviewer
| D3. crawled   |-------->  |
| _articles     |          |
| status=pending|    +-----+------+-----+
+---------------+    |            |     |
                     v            v     v
              [Duyet]      [Tu choi] [Bo qua]
                  |
                  v
           +------+------+
           | P5.5 Import |
           | vao articles|
           | status=draft|
           +------+------+
                  |
                  v
           +------+------+
           | D1. articles|
           +-------------+
```

---

## 6. DFD Level 2 - Process P6: Tinh Nhuan but

```
     Cron Job (hang thang)
              |
              v
     +--------+---------+
     | P6.1 Thu thap    |
     | du lieu bai viet |
     | - author_id      |
     | - article_type   |
     | - word_count     |
     | - views          |
     +--------+---------+
              |
              v
     +--------+---------+        +------------------+
     | P6.2 Ap dung     |<------| D8. royalty      |
     | cong thuc tinh   |       | _configs         |
     | - Base rate      |       +------------------+
     | - Tiers          |
     | - View bonus     |
     | - Type bonuses   |
     +--------+---------+
              |
              v
     +--------+---------+
     | P6.3 Tao bao cao |
     | royalty_report   |
     | - line_items[]   |
     | - total_amount   |
     | status = 'draft' |
     +--------+---------+
              |
              v
     +--------+---------+        Ke toan / Admin
     | D4. royalty      |-------->    |
     | _reports         |        +---+---+---+
     +------------------+        |       |   |
                           [Xac nhan] [Sua] [Thanh toan]
                                |             |
                                v             v
                          status =       status =
                          'confirmed'    'paid'
```

---

## 7. Workflow: Vong doi Bai viet (Article State Machine)

```
                            +-------+
                            | START |
                            +---+---+
                                |
                                | Tao moi
                                v
                          +-----+------+
                     +--->|   DRAFT    |<---+
                     |    +-----+------+    |
                     |          |           |
                     |    Gui duyet    Yeu cau sua
                     |          |           |
                     |          v           |
                     |    +-----+------+    |
              Sua lai+----|  PENDING   |----+
                          +-----+------+
                                |
                    +-----------+-----------+
                    |                       |
               Duyet                   Tu choi
                    |                       |
                    v                       v
            +-------+------+        +------+-------+
            |  PUBLISHED   |        |  REJECTED    |
            +-------+------+        +------+-------+
                    |                       |
               Luu tru               Sua va gui lai
                    |                       |
                    v                       v
            +-------+------+          +-----+------+
            |  ARCHIVED    |          |   DRAFT    |
            +--------------+          +------------+

  === Trang thai ===
  DRAFT      : Nhap, chua gui duyet
  PENDING    : Da gui, dang cho duyet
  PUBLISHED  : Da xuat ban, hien thi cong khai
  REJECTED   : Bi tu choi, can chinh sua
  ARCHIVED   : Da luu tru, khong hien thi
```

**Cac transition hop le:**

| Trang thai hien tai | Trang thai moi | Dieu kien                              |
| :------------------ | :------------- | :------------------------------------- |
| DRAFT               | PENDING        | Noi dung day du, co category           |
| DRAFT               | PUBLISHED      | User co quyen "publish"                |
| PENDING             | PUBLISHED      | Reviewer "approve"                     |
| PENDING             | REJECTED       | Reviewer "reject"                      |
| PENDING             | DRAFT          | Reviewer "request revision"            |
| PUBLISHED           | ARCHIVED       | Admin/Editor chon luu tru              |
| PUBLISHED           | DRAFT          | Editor "unpublish"                     |
| REJECTED            | DRAFT          | Author chinh sua lai                   |
| ARCHIVED            | PUBLISHED      | Admin "restore"                        |
| ARCHIVED            | DRAFT          | Admin "restore as draft"               |

---

## 8. Workflow: Crawler Pipeline

```
  +----------+    +----------+    +----------+    +----------+
  | Campaign |    |  Source  |    |  Crawl   |    |  Review  |
  |  Setup   |--->|  Config  |--->| Execute  |--->|  Queue   |
  +----------+    +----------+    +----+-----+    +----+-----+
                                       |               |
                                       v               |
                                  +----+-----+    +----+-----+
                                  |  Parse & |    |  Import  |
                                  |  Dedup   |    |  Article |
                                  +----------+    +----------+
```

**Chi tiet tung buoc:**

```
Step 1: Campaign Setup
  Input: name, description, schedule, target_count
  Output: crawler_campaign document

Step 2: Source Config
  Input: name, url, source_type, css_selectors, headers
  Output: crawler_source document
  Validation: Test connection, verify selectors

Step 3: Crawl Execute (Cron or Manual)
  Trigger: cron_expression or API call
  Process:
    - Fetch URL
    - Parse response (RSS/HTML/JSON)
    - Rate limit (1 req/2s per source)
  Error: 3 consecutive failures -> disable source

Step 4: Parse & Deduplicate
  Process:
    - Extract title, content, image, date
    - Check original_url uniqueness
    - Validate content not empty
  Output: crawled_article (status=pending)

Step 5: Review Queue
  Actor: Reviewer/Editor
  Actions: Approve / Reject / Skip
  
Step 6: Import Article (on Approve)
  Process:
    - Create article from crawled data
    - Set status = draft
    - Link crawled.approved_article_id
    - Author can edit before publishing
```

---

## 9. Workflow: Multi-Section Content Editing

```
  [Tao/Mo bai viet]
         |
         v
  +------+--------+
  | Load sections |
  | (order ASC)   |
  +------+--------+
         |
         v
  +------+--------+
  | Hien thi      |
  | Section List  |
  | (sortable)    |
  +------+--------+
         |
    +----+----+----+----+----+
    |    |    |    |    |    |
    v    v    v    v    v    v
  [Them] [Sua] [Xoa] [Keo] [An/  [Cau
  moi   noi  sec- tha  Hien] hinh
       dung  tion  sap       spacing,
              xep        bg, css]
    |    |    |    |    |    |
    v    v    v    v    v    v
  +------+--------+
  | Auto-save     |
  | (debounce     |
  |  500ms)       |
  +------+--------+
         |
         v
  +------+--------+
  | D1a. content  |
  | _sections     |
  +---------------+
```

**Them Section moi:**

```
  [Click "Them section"]
         |
         v
  +------+--------+
  | Hien Section  |
  | Type Picker   |
  | (24 types,    |
  |  5 categories)|
  +------+--------+
         |
         | Chon type
         v
  +------+--------+
  | Tao section   |
  | - id: UUID v7 |
  | - type: chosen|
  | - order: last |
  | - is_visible: |
  |   true        |
  | - spacing:    |
  |   'medium'    |
  +------+--------+
         |
         v
  [Mo Block Editor tuong ung]
```

---

## 10. Workflow: Quan ly Quyen va Phan quyen

```
  [Admin]
     |
     +---> Tao Permission Group
     |       |
     |       v
     |     +----------+
     |     | Group    |
     |     | - name   |
     |     | - desc   |
     |     | - perms{}|
     |     +----+-----+
     |          |
     |          v
     |     Them thanh vien
     |       |
     |       +---> Tim user
     |       +---> Them vao group.member_ids[]
     |       +---> User.permission_group_ids[] += group.id
     |
     +---> Phan quyen cho Resource
              |
              v
        +-----+-------+
        | Kiem tra     |
        | quyen khi    |
        | user thao tac|
        +-----+-------+
              |
              v
        [user.role]
        MERGE voi
        [permission_groups.permissions]
              |
              v
        Quyen cao nhat duoc ap dung
        (OR logic giua cac groups)
```

**Logic kiem tra quyen:**

```
function hasPermission(user, resource, action):
  // 1. Check role-based permission
  if (ROLE_PERMISSIONS[user.role][resource][action]):
    return true
  
  // 2. Check permission groups
  for groupId in user.permission_group_ids:
    group = getPermissionGroup(groupId)
    if (group.permissions[resource][action]):
      return true
  
  // 3. Check ownership (for 'own' permissions)
  if (action in ['update', 'delete']):
    if (resource.author_id == user.id):
      if (ROLE_PERMISSIONS[user.role][resource][action + '_own']):
        return true
  
  return false
```

---

## 11. Workflow: Xuat ban Tu dong (Scheduling)

```
  +------------+
  | Cron Job   |
  | (every 1m) |
  +-----+------+
        |
        v
  +-----+----------+
  | Query articles |
  | WHERE:          |
  | scheduled_at    |
  |   <= NOW()     |
  | AND status IN  |
  | (draft,pending)|
  | AND deleted_at |
  |   IS NULL      |
  +-----+----------+
        |
        v
  +-----+----------+     +--------+
  | For each       |---->| Da     |
  | article:       |     | duyet? |
  +----------------+     +---+----+
                              |
                  +-----------+-----------+
                  |                       |
              [Co]                    [Chua]
                  |                       |
                  v                       v
          +-------+------+       +-------+------+
          | status =     |       | Bo qua       |
          | 'published'  |       | (doi duyet)  |
          | published_at |       +--------------+
          | = NOW()      |
          +-------+------+
                  |
                  v
          +-------+------+
          | Gui thong bao|
          | cho tac gia  |
          +-------+------+
                  |
                  v
          +-------+------+
          | Ghi activity |
          | _log         |
          +--------------+
```

---

## 12. Workflow: Binh luan & Kiem duyet

```
  [Doc gia]                    [Moderator]
     |                              |
     | Post comment                 | Xem queue
     v                              v
  +--+----------+           +------+--------+
  | Tao comment |           | Moderation    |
  | status =    |---------->| Queue         |
  | 'pending'   |           | (sorted by    |
  +--+----------+           |  created_at)  |
     |                      +------+--------+
     v                             |
  +--+----------+        +---------+---------+
  | Gui thong   |        |         |         |
  | bao cho     |        v         v         v
  | moderator   |    [Duyet]  [Tu choi] [Spam]
  +-------------+        |         |         |
                         v         v         v
                    approved   rejected    spam
                         |
                         v
                    Hien thi
                    tren bai viet
                         |
                         v
                    [Phan hoi?]
                    parent_id =
                    comment.id
```

---

## 13. Sequence Diagram: Tao Bai viet moi

```
  Author          Frontend          API Server        MongoDB
    |                |                  |                |
    |  Click "Tao"   |                  |                |
    |--------------->|                  |                |
    |                |  GET /categories |                |
    |                |  ?type=news      |                |
    |                |----------------->|                |
    |                |                  |  find()        |
    |                |                  |--------------->|
    |                |                  |<---------------|
    |                |<-----------------|                |
    |                |                  |                |
    |  Fill form     |                  |                |
    |  + Submit      |                  |                |
    |--------------->|                  |                |
    |                | POST /articles   |                |
    |                |  { title, type,  |                |
    |                |    category_id,  |                |
    |                |    author_id }   |                |
    |                |----------------->|                |
    |                |                  | Validate       |
    |                |                  | - slug unique? |
    |                |                  | - cat.type ==  |
    |                |                  |   art.type?    |
    |                |                  | Generate slug  |
    |                |                  | Insert article |
    |                |                  |--------------->|
    |                |                  |<---------------|
    |                |                  |                |
    |                |                  | Auto-create    |
    |                |                  | HTML section   |
    |                |                  |--------------->|
    |                |                  |<---------------|
    |                |                  |                |
    |                |                  | Log activity   |
    |                |                  |--------------->|
    |                |                  |<---------------|
    |                |                  |                |
    |                |<----- 201 ------|                |
    |                |  { article }     |                |
    |<---------------|                  |                |
    |  Show editor   |                  |                |
```

---

## 14. Sequence Diagram: Workflow Duyet bai

```
  Author      Frontend      API Server      MongoDB      Reviewer
    |            |              |               |             |
    | Submit     |              |               |             |
    |----------->|              |               |             |
    |            | POST /articles|              |             |
    |            | /:id/submit  |               |             |
    |            |------------->|               |             |
    |            |              | Update status |             |
    |            |              | = 'pending'   |             |
    |            |              |-------------->|             |
    |            |              |               |             |
    |            |              | Create        |             |
    |            |              | workflow_inst |             |
    |            |              |-------------->|             |
    |            |              |               |             |
    |            |              | Send notif    |             |
    |            |              |------------------------------>|
    |            |              |               |             |
    |            |<-- 200 -----|               |             |
    |<-----------|              |               |             |
    |            |              |               |             |
    |            |              |               |  Review     |
    |            |              |               |<------------|
    |            |              | POST /workflow|             |
    |            |              | /:id/approve  |             |
    |            |              |<------------- |             |
    |            |              |               |             |
    |            |              | Update step   |             |
    |            |              | Check: last?  |             |
    |            |              |               |             |
    |            |              | YES: Publish  |             |
    |            |              | article       |             |
    |            |              |-------------->|             |
    |            |              |               |             |
    |            |              | Notify author |             |
    |            |              |               |             |
    | Thong bao  |              |               |             |
    |<-----------|              |               |             |
```

---

## 15. Tong hop Dieu kien Rang buoc

### 15.1 Rang buoc Du lieu (Data Constraints)

| Ma          | Mo ta                                                      | Collection   |
| :---------- | :--------------------------------------------------------- | :----------- |
| DC-001      | `id` phai la UUID v7 hop le                                | Tat ca       |
| DC-002      | `tenant_id` bat buoc, khong duoc null                      | Tat ca       |
| DC-003      | `slug` unique trong pham vi tenant                         | articles, categories, tags, event_streams |
| DC-004      | `email` unique trong pham vi tenant                        | users        |
| DC-005      | `deleted_at` = null nghia la chua xoa, khac null = da xoa  | Tat ca       |
| DC-006      | `version` >= 1, tang 1 moi lan update                      | Tat ca       |
| DC-007      | `original_url` unique (chong crawl trung)                  | crawled_articles |

### 15.2 Rang buoc Nghiep vu (Business Rules)

| Ma          | Mo ta                                                      | Module       |
| :---------- | :--------------------------------------------------------- | :----------- |
| BR-001      | Moi danh muc chi chua 1 loai bai viet                     | Categories   |
| BR-002      | article.type phai == category.type khi gan category        | Articles     |
| BR-003      | Tao bai viet moi tu dong them 1 section HTML              | Sections     |
| BR-004      | Tat ca form them/sua co "Luu va them tiep"                 | UI           |
| BR-005      | Tac gia khong duoc tu duyet bai cua minh                   | Workflow     |
| BR-006      | Bai viet can noi dung khi xuat ban                         | Articles     |
| BR-007      | Danh muc co chieu sau toi da 5 cap                         | Categories   |
| BR-008      | category.type khong doi duoc sau khi tao                   | Categories   |
| BR-009      | Di chuyen danh muc chi trong cung type                     | Categories   |
| BR-010      | Scheduled_at phai la thoi diem tuong lai                   | Articles     |
| BR-011      | Crawler: 3 loi lien tiep -> disable source                 | Crawler      |
| BR-012      | Royalty: 1 report/author/period (unique)                   | Royalty      |
| BR-013      | Cam DELETE vat ly, chi soft delete (set deleted_at)        | Tat ca       |
| BR-014      | Optimistic locking: reject neu version mismatch            | Tat ca       |
| BR-015      | Router cac page co prefix `/page/cms/`                     | Frontend     |
| BR-016      | Block Editor only - da loai bo Rich Text editor            | Sections     |
| BR-017      | Password toi thieu 8 ky tu                                 | Users        |

### 15.3 Rang buoc Trang thai (State Constraints)

| Ma          | Transition                        | Dieu kien                          |
| :---------- | :-------------------------------- | :--------------------------------- |
| SC-001      | draft -> pending                  | Bai viet co title, category, content |
| SC-002      | draft -> published                | User co quyen 'publish'            |
| SC-003      | pending -> published              | Reviewer approve                   |
| SC-004      | pending -> rejected               | Reviewer reject                    |
| SC-005      | pending -> draft                  | Reviewer request revision          |
| SC-006      | published -> archived             | Admin/Editor                       |
| SC-007      | rejected -> draft                 | Author edit                        |
| SC-008      | archived -> published             | Admin restore                      |

### 15.4 Rang buoc Hieu nang (Performance Constraints)

| Ma          | Mo ta                                                      |
| :---------- | :--------------------------------------------------------- |
| PC-001      | Pagination mac dinh: page=1, limit=20, max_limit=100      |
| PC-002      | Full-text search su dung MongoDB text index                |
| PC-003      | Denormalized stats (views, comments) de tranh aggregate    |
| PC-004      | Activity logs TTL 90 ngay (tu dong xoa)                    |
| PC-005      | Crawler rate limit: 1 request/2 giay moi source            |
| PC-006      | Auto-save debounce 500ms cho section editor                |
