# Tai lieu Dieu kien Rang buoc & Quy tac Nghiep vu

## CMS Service - Constraints & Business Rules

**Phien ban:** 2.0
**Cap nhat:** 17/03/2026
**Tac gia:** CMS Engineering Team

---

## 1. Rang buoc Toan ven Du lieu (Data Integrity Constraints)

### 1.1 Primary Key

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| PK-01     | Moi document co field `id` duy nhat, kieu UUID v7               |
| PK-02     | UUID v7 duoc generate phia server (Go), bao dam tinh sap xep theo thoi gian |
| PK-03     | Khong su dung ObjectId cua MongoDB lam primary key              |

### 1.2 Multi-Tenant Isolation

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| MT-01     | Moi document **BAT BUOC** co field `tenant_id`                 |
| MT-02     | Moi query **BAT BUOC** co dieu kien `tenant_id` trong WHERE    |
| MT-03     | Index dau tien cua moi collection phai bao gom `tenant_id`     |
| MT-04     | Unique constraint (slug, email) chi trong pham vi 1 tenant     |
| MT-05     | API Gateway inject `tenant_id` tu JWT token, khong cho client truyen |

### 1.3 Soft Delete

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| SD-01     | **CAM** su dung lenh DELETE vat ly tren moi collection nghiep vu |
| SD-02     | Xoa = set `deleted_at = ISODate(now)`                           |
| SD-03     | Moi query doc du lieu phai them dieu kien `deleted_at IS NULL`  |
| SD-04     | Chi co Super Admin moi co quyen xoa vinh vien (purge) va phai qua confirm |
| SD-05     | Du lieu da soft delete van giu nguyen de phuc vu audit, bao cao |

### 1.4 Optimistic Locking

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| OL-01     | Moi document co field `version` kieu integer, bat dau tu 1     |
| OL-02     | Khi update: SET version = version + 1 WHERE version = old_version |
| OL-03     | Neu khong match (0 documents updated) -> tra ve loi 409 Conflict |
| OL-04     | Client phai retry: doc lai version moi, merge thay doi, gui lai |

**Vi du xu ly Optimistic Locking:**

```go
// Go pseudo-code
func UpdateArticle(id string, data UpdateInput, clientVersion int) error {
    result := collection.UpdateOne(
        bson.M{
            "id":         id,
            "tenant_id":  tenantId,
            "version":    clientVersion,  // Chi update khi version khop
            "deleted_at": nil,
        },
        bson.M{
            "$set": data,
            "$inc": bson.M{"version": 1},  // Tang version
        },
    )
    
    if result.MatchedCount == 0 {
        return ErrVersionConflict  // 409 Conflict
    }
    return nil
}
```

### 1.5 Timestamp

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| TS-01     | `created_at` set 1 lan khi tao, khong bao gio thay doi         |
| TS-02     | `updated_at` cap nhat moi lan co thay doi du lieu               |
| TS-03     | Tat ca timestamp luu dang UTC (ISODate)                         |
| TS-04     | Frontend chiu trach nhiem chuyen doi sang timezone nguoi dung   |

---

## 2. Rang buoc Tham chieu (Referential Constraints)

### 2.1 Articles -> Categories

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-AC-01  | `article.category_id` phai tro den `category.id` ton tai       |
| RF-AC-02  | `article.type` **PHAI BANG** `category.type` (rang buoc quan trong nhat) |
| RF-AC-03  | Khi xoa category, bai viet duoc chuyen sang "Chua phan loai"  |
| RF-AC-04  | "Chua phan loai" la category dac biet, khong the xoa           |

### 2.2 Articles -> Users (Author)

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-AU-01  | `article.author_id` phai tro den `user.id` ton tai             |
| RF-AU-02  | User phai co `status = 'active'` de duoc chon lam tac gia      |
| RF-AU-03  | Khi user bi suspend, bai viet van giu nguyen khong bi anh huong |

### 2.3 Content Sections -> Articles

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-SA-01  | `section.article_id` phai tro den `article.id` ton tai         |
| RF-SA-02  | Xoa article (soft) -> sections van ton tai (lien ket qua article_id) |
| RF-SA-03  | `section.order` phai lien tuc trong pham vi 1 article (0, 1, 2, ...) |

### 2.4 Categories -> Categories (Self-reference)

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-CC-01  | `category.parent_id` neu set, phai tro den category ton tai    |
| RF-CC-02  | Parent category phai co **cung `type`** voi child              |
| RF-CC-03  | Khong cho phep tham chieu vong (circular reference)            |
| RF-CC-04  | Chieu sau toi da: 5 cap (level <= 4, root = 0)                |
| RF-CC-05  | Khi di chuyen category, tu dong cap nhat `path` cua tat ca con |

### 2.5 Comments -> Articles

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-CM-01  | `comment.article_id` phai tro den article ton tai              |
| RF-CM-02  | Chi cho binh luan tren article co `allow_comments = true`      |
| RF-CM-03  | `comment.parent_id` neu set, phai tro den comment cung article |
| RF-CM-04  | Chieu sau nested comment toi da: 3 cap                         |

### 2.6 Event Streams -> Articles

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-ES-01  | `event_stream.article_ids[]` moi item phai tro den article ton tai |
| RF-ES-02  | 1 article co the thuoc nhieu event_stream                      |
| RF-ES-03  | Khi xoa article khoi stream, chi remove ID khoi array          |

### 2.7 Crawler

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-CR-01  | `source.campaign_id` phai tro den campaign ton tai             |
| RF-CR-02  | `crawled_article.source_id` phai tro den source ton tai        |
| RF-CR-03  | `crawled_article.approved_article_id` chi set khi import thanh cong |

### 2.8 Workflow

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| RF-WF-01  | `workflow.article_id` phai tro den article ton tai             |
| RF-WF-02  | `workflow.steps[].assignee_id` phai tro den user co quyen 'approve' |
| RF-WF-03  | `workflow.initiated_by` phai tro den author cua article        |

---

## 3. Rang buoc Nghiep vu Dac thu (Business-Specific Rules)

### 3.1 Category-Type Binding (BR-001, BR-002)

**Day la rang buoc nghiep vu QUAN TRONG NHAT cua he thong.**

```
QUY TAC:
  - Moi danh muc (category) chi chua DUNG 1 loai bai viet (article type)
  - Khi tao danh muc, bat buoc chon type va KHONG THE THAY DOI sau do
  - Khi gan bai viet vao danh muc, he thong kiem tra: article.type == category.type
  - Khi di chuyen danh muc (parent), chi cho phep parent co cung type

VI DU:
  Category "Tin cong nghe" (type=news)
    -> Chi chua bai viet type=news
    -> Khong the gan bai viet type=video vao day
    -> Chi co the la con cua category cung type=news

  Category "Video huong dan" (type=video)
    -> Chi chua bai viet type=video
```

**Validation pseudo-code:**

```go
func ValidateArticleCategory(article Article, category Category) error {
    if article.Type != category.Type {
        return fmt.Errorf(
            "article type '%s' khong khop voi category type '%s'",
            article.Type, category.Type,
        )
    }
    return nil
}

func ValidateCategoryMove(category Category, newParent Category) error {
    if category.Type != newParent.Type {
        return fmt.Errorf(
            "khong the di chuyen category type '%s' vao parent type '%s'",
            category.Type, newParent.Type,
        )
    }
    return nil
}
```

### 3.2 Auto-Section on Article Create (BR-003)

```
QUY TAC:
  - Khi tao bai viet moi, he thong TU DONG them 1 content_section:
    {
      type: "html",
      order: 0,
      is_visible: true,
      spacing: "medium",
      data: { content: "" }
    }
  - Nguoi dung co the xoa section nay neu muon
  - Section nay su dung Block Editor (KHONG phai Rich Text)
```

### 3.3 Save & Continue (BR-004)

```
QUY TAC:
  - TAT CA form them moi va chinh sua DEUPHẢI co nut "Luu va them tiep"
  - Khi click "Luu va them tiep":
    1. Validate va luu du lieu hien tai
    2. Reset form ve trang thai tao moi
    3. Giu lai mot so truong context (VD: type, parent_category)
    4. Focus vao field dau tien
  
  Ap dung cho:
  - Form tao bai viet
  - Form tao danh muc
  - Form them nguoi dung
  - Form tao nhom quyen
  - Form tao dong su kien
  - Form tao nguon crawler
```

### 3.4 Block Editor Only (BR-016)

```
QUY TAC:
  - He thong chi su dung Block Editor cho tat ca section types
  - Da LOAI BO hoan toan Rich Text editor (CKEditor/TinyMCE)
  - Moi section type co editor rieng (24 section editors)
  - Output la structured data, khong phai raw HTML (tru section type 'html')
```

### 3.5 Routing Convention (BR-015)

```
QUY TAC:
  - Tat ca trang CMS frontend co prefix: /page/cms/
  - API endpoints theo Guidelines.md: /api/{service}/v1/{resource}
  - Khong dung hau to -service trong URL
  - Su dung danh tu so it cho service name
  
VI DU:
  Frontend:  /page/cms/articles
  API:       /api/cms/v1/articles
  
  Frontend:  /page/cms/users/roles
  API:       /api/user/v1/roles
```

---

## 4. Rang buoc An ninh (Security Constraints)

### 4.1 Authentication

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| SEC-01    | Mat khau toi thieu 8 ky tu                                     |
| SEC-02    | Mat khau hash bang bcrypt (cost factor >= 12)                   |
| SEC-03    | JWT token co thoi han (access: 15 phut, refresh: 7 ngay)       |
| SEC-04    | Support 2FA (TOTP) qua Authenticator App                       |
| SEC-05    | Ghi log tat ca hoat dong dang nhap (thanh cong & that bai)     |

### 4.2 Authorization

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| SEC-06    | Moi API endpoint phai kiem tra quyen truoc khi xu ly            |
| SEC-07    | Tac gia KHONG duoc tu duyet bai cua minh                       |
| SEC-08    | Chi Admin moi co quyen quan ly users va settings                |
| SEC-09    | Contributor chi tao duoc draft, khong publish                   |
| SEC-10    | Author chi sua/xoa bai cua minh, khong phai cua nguoi khac     |

### 4.3 Session Management

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| SEC-11    | Session timeout mac dinh: 30 phut khong hoat dong               |
| SEC-12    | Co the chan dang nhap tu IP/thiet bi la                         |
| SEC-13    | Thong bao khi co dang nhap tu thiet bi moi                     |
| SEC-14    | Cho phep dang xuat tat ca thiet bi khac                        |

### 4.4 Password Policy

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| SEC-15    | Do dai toi thieu: 8 ky tu (co the cau hinh)                   |
| SEC-16    | Yeu cau ky tu dac biet: tuy cau hinh                           |
| SEC-17    | Yeu cau chu hoa + so: tuy cau hinh                             |
| SEC-18    | Het han mat khau: tuy cau hinh (mac dinh 90 ngay)              |
| SEC-19    | IP Whitelist: tuy cau hinh (mac dinh tat ca)                   |

---

## 5. Rang buoc Hieu nang & Van hanh (Operational Constraints)

### 5.1 Pagination & Query

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| OP-01     | API tra ve toi da 100 records/request (configurable)           |
| OP-02     | Default pagination: page=1, limit=20                            |
| OP-03     | Full-text search su dung MongoDB text index                     |
| OP-04     | Sort mac dinh: created_at DESC                                  |
| OP-05     | Tat ca list API phai tra ve: { data, total, page, limit, totalPages } |

### 5.2 Rate Limiting

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| OP-06     | API rate limit: 100 requests/phut/user                         |
| OP-07     | Upload rate limit: 10 files/phut/user                          |
| OP-08     | Crawler rate limit: 1 request/2 giay/source                    |
| OP-09     | Login rate limit: 5 lan/phut/IP (chong brute force)            |

### 5.3 File Upload

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| OP-10     | Image max size: 10MB                                            |
| OP-11     | Video max size: 500MB                                           |
| OP-12     | Document max size: 50MB                                         |
| OP-13     | Allowed image types: PNG, JPG, JPEG, WebP, GIF, SVG            |
| OP-14     | Allowed video types: MP4, WebM, MOV                             |
| OP-15     | Allowed document types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX  |

### 5.4 Data Retention

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| OP-16     | Activity logs: TTL 90 ngay (tu dong xoa sau 90 ngay)           |
| OP-17     | Crawled articles (rejected): TTL 30 ngay                        |
| OP-18     | Soft-deleted data: giu toi thieu 30 ngay truoc khi purge       |
| OP-19     | Backup: tu dong hang ngay, giu 30 ban backup                   |

### 5.5 Caching

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| OP-20     | Category tree: cache 5 phut (invalidate khi co thay doi)       |
| OP-21     | Article stats (views): ghi batch moi 1 phut (khong ghi tung luot) |
| OP-22     | User permissions: cache trong session, reload khi co thay doi  |

---

## 6. Rang buoc Giao dien (UI/UX Constraints)

### 6.1 Design System

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| UI-01     | Phong cach: Modern & Elegant (Stripe/Vercel/Linear)            |
| UI-02     | Font: Inter                                                     |
| UI-03     | Glassmorphism effects cho cards va modals                       |
| UI-04     | Micro-animations cho interactions                               |
| UI-05     | Gradient backgrounds cho headers                                |
| UI-06     | Tat ca React Fragment da thay bang `<div>` wrapper (Figma compatible) |

### 6.2 i18n & Viet hoa

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| UI-07     | He thong ho tro 6 ngon ngu: vi, en, es, zh, ja, ko            |
| UI-08     | Mac dinh: Tieng Viet (vi)                                       |
| UI-09     | Tat ca chuoi hien thi phai dung qua ham `t()` tu LanguageContext |
| UI-10     | I18n keys luu tai /locales/{lang}.ts                            |
| UI-11     | Dang chien dich Viet hoa toan dien (da hoan tat 11 dot)        |

### 6.3 Responsive & Accessibility

| Rang buoc | Mo ta                                                           |
| :-------- | :-------------------------------------------------------------- |
| UI-12     | Responsive: Desktop (1920px) -> Tablet (768px) -> Mobile (375px) |
| UI-13     | Sidebar collapse tren man hinh nho                              |
| UI-14     | Keyboard shortcuts cho cac thao tac pho bien                   |
| UI-15     | Dropdown su dung fixed positioning (tranh overflow clip)        |

---

## 7. Tong hop Ma Rang buoc

### Quick Reference Table

| Nhom     | Pham vi        | So luong | Danh muc                          |
| :------- | :------------- | :------: | :-------------------------------- |
| PK       | Primary Key    |    3     | UUID v7, unique, server-generated |
| MT       | Multi-Tenant   |    5     | tenant_id isolation               |
| SD       | Soft Delete    |    5     | No physical delete                |
| OL       | Optimistic Lock|    4     | Version-based concurrency         |
| TS       | Timestamp      |    4     | UTC, created_at immutable         |
| RF       | Referential    |   22     | Foreign key relationships         |
| BR       | Business Rules |   17     | Domain-specific logic             |
| SC       | State Machine  |    8     | Status transitions                |
| SEC      | Security       |   19     | Auth, authz, session, password    |
| OP       | Operational    |   22     | Performance, limits, retention    |
| UI       | UI/UX          |   15     | Design, i18n, responsive          |
| DC       | Data           |    7     | Uniqueness, format                |
| **TONG** |                | **131**  |                                   |
