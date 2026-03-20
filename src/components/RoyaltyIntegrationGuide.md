# Hướng dẫn tích hợp Quản lý nhuận bút

## Tổng quan

Module Quản lý nhuận bút được thiết kế để tích hợp sâu với các module khác trong hệ thống CMS:

- **Bài viết (Articles)**: Nguồn dữ liệu chính để tính nhuận bút
- **Kiểm duyệt (Moderation)**: Chỉ bài viết đã được duyệt mới được tính nhuận bút
- **Người dùng (Users)**: Tác giả nhận nhuận bút
- **Nhóm người dùng (User Groups)**: Áp dụng cấu hình nhuận bút khác nhau theo nhóm
- **Phân tích & Thống kê (Analytics)**: Báo cáo và phân tích nhuận bút

## Kiến trúc tích hợp

```
┌─────────────────────────────────────────────────────────────┐
│                    Royalty Management System                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Articles   │───▶│ Moderation   │───▶│   Royalty    │  │
│  │  Management  │    │   System     │    │ Calculation  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │    Users     │◀───│  User Groups │◀───│  Analytics   │  │
│  │  Management  │    │              │    │  Dashboard   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 1. Tích hợp với Quản lý bài viết

### Khi bài viết được xuất bản

```typescript
// In ArticleManagement.tsx
import { RoyaltyCalculationService } from './RoyaltyCalculationService';

const onPublishArticle = async (article: Article) => {
  // 1. Publish article
  await publishArticle(article);
  
  // 2. Calculate royalty
  const configs = await getRoyaltyConfigs();
  const service = new RoyaltyCalculationService(configs);
  const user = await getUser(article.authorId);
  const config = service.findApplicableConfig(user, article);
  
  if (config) {
    const royalty = service.calculateRoyalty(article, user, config);
    if (royalty) {
      await saveRoyaltyRecord(royalty);
      
      // 3. Notify author
      await notifyAuthor(user, {
        title: 'Nhuận bút mới',
        message: `Bài viết "${article.title}" đã được tính nhuận bút: ${formatCurrency(royalty.amount)}`,
        type: 'royalty'
      });
    }
  }
};
```

### Lấy thông tin nhuận bút của bài viết

```typescript
// Display royalty info in article list
const ArticleWithRoyalty = ({ article }) => {
  const royalty = useRoyalty(article.id);
  
  return (
    <div className="article-item">
      <h3>{article.title}</h3>
      {royalty && (
        <div className="royalty-badge">
          <DollarSign className="w-4 h-4" />
          {formatCurrency(royalty.amount)}
          <span className={`status-${royalty.status}`}>
            {royalty.status}
          </span>
        </div>
      )}
    </div>
  );
};
```

## 2. Tích hợp với Kiểm duyệt

### Workflow kiểm duyệt → Nhuận bút

```typescript
// In ContentModeration.tsx
const onApproveArticle = async (articleId: string) => {
  // 1. Approve article
  const article = await approveArticle(articleId);
  
  // 2. Update status to approved/published
  article.status = 'approved';
  await updateArticle(article);
  
  // 3. Trigger royalty calculation
  // Only approved/published articles are eligible for royalty
  if (article.status === 'approved' || article.status === 'published') {
    const royalty = await calculateRoyaltyForArticle(article);
    
    if (royalty) {
      // Save royalty record
      await saveRoyaltyRecord(royalty);
      
      // Add to author's pending royalty
      await updateAuthorRoyalty(article.authorId, {
        pending: royalty.amount
      });
    }
  }
};

const onRejectArticle = async (articleId: string) => {
  // Rejected articles don't get royalty
  const article = await rejectArticle(articleId);
  
  // Remove any pending royalty calculation
  await removePendingRoyalty(articleId);
};
```

### Hiển thị thông tin nhuận bút trong hàng đợi kiểm duyệt

```typescript
const ModerationQueueItem = ({ item }) => {
  const estimatedRoyalty = calculateEstimatedRoyalty(item);
  
  return (
    <div className="queue-item">
      <div className="item-info">
        <h4>{item.title}</h4>
        <div className="metadata">
          <span>{item.wordCount} từ</span>
          <span>{item.views} lượt xem</span>
          {estimatedRoyalty && (
            <span className="estimated-royalty">
              ≈ {formatCurrency(estimatedRoyalty)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
```

## 3. Tích hợp với Quản lý người dùng

### Hiển thị thống kê nhuận bút của tác giả

```typescript
// In UserManagement.tsx or UserDetail.tsx
const UserRoyaltySummary = ({ userId }) => {
  const royaltyData = useUserRoyalty(userId);
  
  return (
    <div className="user-royalty-summary">
      <h3>Thống kê nhuận bút</h3>
      
      <div className="stats-grid">
        <StatCard
          label="Tổng nhuận bút"
          value={formatCurrency(royaltyData.totalRoyalty)}
          icon={<DollarSign />}
        />
        <StatCard
          label="Đã thanh toán"
          value={formatCurrency(royaltyData.paidRoyalty)}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          label="Chờ thanh toán"
          value={formatCurrency(royaltyData.pendingRoyalty)}
          icon={<Clock />}
          color="yellow"
        />
        <StatCard
          label="Bài viết"
          value={royaltyData.articlesCount}
          icon={<FileText />}
        />
      </div>
      
      <div className="royalty-config">
        <h4>Cấu hình áp dụng</h4>
        <ConfigBadge config={royaltyData.appliedConfig} />
      </div>
    </div>
  );
};
```

### Gán cấu hình nhuận bút cho người dùng

```typescript
const assignRoyaltyConfig = async (userId: number, configId: string) => {
  // Create user-specific config
  const config = await createRoyaltyConfig({
    scope: 'user',
    userId: userId.toString(),
    // ... other config params
  });
  
  // Recalculate all pending royalties for this user
  const pendingArticles = await getArticlesByAuthor(userId, { status: 'published' });
  const service = new RoyaltyCalculationService([config]);
  const user = await getUser(userId);
  
  for (const article of pendingArticles) {
    const royalty = service.calculateRoyalty(article, user, config);
    if (royalty) {
      await updateRoyaltyRecord(article.id, royalty);
    }
  }
};
```

## 4. Tích hợp với Nhóm người dùng

### Áp dụng cấu hình nhuận bút theo nhóm

```typescript
// In UserGroups.tsx
const GroupRoyaltyConfig = ({ groupId }) => {
  const [config, setConfig] = useState(null);
  
  const onSaveConfig = async (configData) => {
    // Create group-specific config
    const newConfig = await createRoyaltyConfig({
      ...configData,
      scope: 'group',
      groupId: groupId,
      priority: 5 // Group configs have medium priority
    });
    
    setConfig(newConfig);
    
    // Notify all group members
    const members = await getGroupMembers(groupId);
    for (const member of members) {
      await notifyUser(member.id, {
        title: 'Cập nhật cấu hình nhuận bút',
        message: `Nhóm của bạn đã có cấu hình nhuận bút mới: ${newConfig.name}`,
        type: 'info'
      });
    }
  };
  
  return (
    <div className="group-royalty-config">
      <h3>Cấu hình nhuận bút cho nhóm</h3>
      {config ? (
        <ConfigDisplay config={config} onEdit={onSaveConfig} />
      ) : (
        <CreateConfigWizard onComplete={onSaveConfig} />
      )}
    </div>
  );
};
```

### Priority của cấu hình

```
1. User-specific config (priority: 10) - Ưu tiên cao nhất
2. Group-specific config (priority: 5) - Ưu tiên trung bình
3. Global config (priority: 1) - Ưu tiên thấp nhất
```

## 5. Tích hợp với Phân tích & Thống kê

### Báo cáo nhuận bút

```typescript
// In AnalyticsDashboard.tsx
const RoyaltyAnalytics = () => {
  const [period, setPeriod] = useState('month');
  const analytics = useRoyaltyAnalytics(period);
  
  return (
    <div className="royalty-analytics">
      {/* Total royalty trend */}
      <ChartCard
        title="Xu hướng nhuận bút"
        data={analytics.trendData}
        type="line"
      />
      
      {/* Royalty by article type */}
      <ChartCard
        title="Nhuận bút theo loại bài viết"
        data={analytics.byType}
        type="pie"
      />
      
      {/* Top earning authors */}
      <TopAuthorsTable
        authors={analytics.topAuthors}
      />
      
      {/* Royalty by config */}
      <ChartCard
        title="Nhuận bút theo cấu hình"
        data={analytics.byConfig}
        type="bar"
      />
    </div>
  );
};
```

### Export báo cáo

```typescript
const exportRoyaltyReport = async (period: string) => {
  const results = await getRoyaltyResults(period);
  const service = new RoyaltyCalculationService(configs);
  
  // Aggregate data
  const byAuthor = service.aggregateByAuthor(results);
  const periodStats = service.aggregateByPeriod(
    results,
    startDate,
    endDate
  );
  
  // Generate report
  const report = {
    period,
    summary: {
      totalAmount: periodStats.totalAmount,
      articlesCount: periodStats.articlesCount,
      authorsCount: periodStats.authorsCount
    },
    byAuthor: Array.from(byAuthor.values()),
    details: results
  };
  
  // Export to Excel/CSV
  await exportToExcel(report, `royalty-report-${period}.xlsx`);
};
```

## 6. Data Flow

### Flow tính toán nhuận bút

```
1. Tác giả viết bài → ArticleManagement
   ↓
2. Bài viết nháp → status: 'draft'
   ↓
3. Submit để kiểm duyệt → ContentModeration
   ↓
4. Biên tập viên review → status: 'in-review'
   ↓
5. Approve/Reject
   ├─ Reject → Không tính nhuận bút
   └─ Approve → status: 'approved'
       ↓
6. Xuất bản → status: 'published'
       ↓
7. Trigger royalty calculation
       ↓
8. RoyaltyCalculationService
   ├─ Find applicable config (user > group > global)
   ├─ Check eligibility (status, minWords, minViews)
   └─ Calculate amount based on config type
       ↓
9. Save RoyaltyRecord → status: 'calculated'
       ↓
10. Update author's pending royalty
       ↓
11. Monthly payment processing
       ↓
12. RoyaltyRecord → status: 'paid'
```

### Database Schema (Recommended)

```sql
-- Royalty Configs
CREATE TABLE royalty_configs (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  scope ENUM('global', 'group', 'user'),
  calculation_type ENUM('fixed_per_article', 'view_based', 'word_count', 'hybrid', 'revenue_share'),
  priority INT,
  status ENUM('active', 'inactive'),
  
  -- Parameters
  fixed_amount DECIMAL(10, 2),
  base_amount DECIMAL(10, 2),
  view_rate DECIMAL(10, 2),
  word_rate DECIMAL(10, 2),
  quality_bonus DECIMAL(10, 2),
  revenue_percentage DECIMAL(5, 2),
  
  -- Scope
  group_id VARCHAR(50),
  user_id INT,
  
  -- Conditions
  min_words INT,
  min_views INT,
  required_status VARCHAR(20),
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Royalty Records
CREATE TABLE royalty_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT,
  author_id INT,
  config_id VARCHAR(50),
  config_name VARCHAR(255),
  amount DECIMAL(10, 2),
  
  -- Breakdown
  breakdown_base DECIMAL(10, 2),
  breakdown_views DECIMAL(10, 2),
  breakdown_words DECIMAL(10, 2),
  breakdown_quality DECIMAL(10, 2),
  breakdown_revenue DECIMAL(10, 2),
  
  calculated_at TIMESTAMP,
  status ENUM('pending', 'calculated', 'paid'),
  paid_at TIMESTAMP,
  
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (config_id) REFERENCES royalty_configs(id)
);

-- Royalty Payments
CREATE TABLE royalty_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  period VARCHAR(20), -- e.g., "2024-12"
  amount DECIMAL(10, 2),
  articles_count INT,
  status ENUM('pending', 'processing', 'paid', 'failed'),
  paid_date DATE,
  note TEXT,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 7. API Endpoints (Backend Integration)

```typescript
// Royalty calculation
POST /api/royalty/calculate
  Body: { articleId, userId }
  Response: RoyaltyCalculationResult

// Get user royalty summary
GET /api/royalty/user/:userId
  Response: {
    totalRoyalty, paidRoyalty, pendingRoyalty,
    articlesCount, appliedConfig
  }

// Get royalty records
GET /api/royalty/records
  Query: { userId?, period?, status? }
  Response: RoyaltyRecord[]

// Create royalty config
POST /api/royalty/configs
  Body: RoyaltyConfig
  Response: RoyaltyConfig

// Process payment
POST /api/royalty/payments/process
  Body: { userId, period }
  Response: PaymentResult
```

## 8. Notifications & Alerts

### Thông báo cho tác giả

```typescript
// When royalty is calculated
await sendNotification({
  userId: article.authorId,
  type: 'royalty_calculated',
  title: 'Nhuận bút mới',
  message: `Bài "${article.title}" đã được tính nhuận bút: ${formatCurrency(royalty.amount)}`,
  data: { royaltyId: royalty.id, articleId: article.id }
});

// When payment is processed
await sendNotification({
  userId: payment.userId,
  type: 'royalty_paid',
  title: 'Đã thanh toán nhuận bút',
  message: `Bạn đã nhận ${formatCurrency(payment.amount)} cho ${payment.articlesCount} bài viết`,
  data: { paymentId: payment.id }
});
```

## 9. Testing & Validation

### Unit Tests

```typescript
describe('RoyaltyCalculationService', () => {
  it('should calculate fixed amount correctly', () => {
    const service = new RoyaltyCalculationService([fixedConfig]);
    const result = service.calculateRoyalty(article, user, fixedConfig);
    expect(result.amount).toBe(200000);
  });
  
  it('should apply user config over global config', () => {
    const service = new RoyaltyCalculationService([userConfig, globalConfig]);
    const config = service.findApplicableConfig(user, article);
    expect(config.scope).toBe('user');
  });
  
  it('should not calculate for rejected articles', () => {
    const rejectedArticle = { ...article, status: 'rejected' };
    const result = service.calculateRoyalty(rejectedArticle, user, config);
    expect(result).toBeNull();
  });
});
```

## 10. Best Practices

1. **Always check article status** before calculating royalty
2. **Use priority system** for config selection (user > group > global)
3. **Log all calculations** for audit trail
4. **Notify authors** when royalty is calculated or paid
5. **Validate configs** before activation
6. **Handle edge cases** (deleted articles, suspended users, etc.)
7. **Implement retry logic** for failed calculations
8. **Cache frequently used configs** for performance
9. **Schedule batch calculations** for efficiency
10. **Regular reconciliation** between records and payments

## Support

Nếu cần hỗ trợ hoặc có câu hỏi về tích hợp, vui lòng liên hệ team phát triển.
