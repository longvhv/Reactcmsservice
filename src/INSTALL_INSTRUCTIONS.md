# 📦 **INSTALLATION INSTRUCTIONS**

## ⚠️ **REQUIRED LIBRARY**

Activity Timeline cần library **date-fns** để format timestamps!

---

## 🚀 **CÁCH CÀI ĐẶT:**

### **Option 1: NPM**
```bash
npm install date-fns
```

### **Option 2: Yarn**
```bash
yarn add date-fns
```

### **Option 3: PNPM**
```bash
pnpm add date-fns
```

---

## ✅ **VERIFY INSTALLATION:**

Check `package.json`:
```json
{
  "dependencies": {
    "date-fns": "^3.0.0"
  }
}
```

---

## 🎯 **WHAT IT'S USED FOR:**

### **1. Relative Time:**
```typescript
formatDistanceToNow(new Date(timestamp), { addSuffix: true })
// Output: "5 minutes ago"
```

### **2. Full Format:**
```typescript
format(new Date(timestamp), 'PPpp')
// Output: "Jan 1, 2024, 10:30:45 AM"
```

---

## 🔧 **IF YOU CAN'T INSTALL:**

### **Alternative: Remove date-fns imports**

Edit `/src/modules/system/components/ActivityTimeline.tsx`:

**Remove:**
```typescript
import { format, formatDistanceToNow } from 'date-fns';
```

**Replace usage with:**
```typescript
// Instead of formatDistanceToNow
new Date(event.timestamp).toLocaleString()

// Instead of format
new Date(event.timestamp).toLocaleString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})
```

---

## 📝 **FULL CHANGES NEEDED:**

```typescript
// Line ~40 (in timeline rendering)
// OLD:
<span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>

// NEW:
<span>{new Date(event.timestamp).toLocaleString()}</span>

// Line ~120 (in expanded details)
// OLD:
<span className="ml-2">{format(new Date(event.timestamp), 'PPpp')}</span>

// NEW:
<span className="ml-2">{new Date(event.timestamp).toLocaleString()}</span>
```

---

## ✅ **AFTER INSTALLATION:**

1. Run dev server:
```bash
npm run dev
```

2. Open browser

3. Navigate to: **Nhật ký hoạt động**

4. You should see timestamps like:
   - "5 minutes ago"
   - "2 hours ago"
   - "Jan 1, 2024, 10:30 AM"

---

## 🎊 **READY TO GO!**

Once installed, the Activity Timeline will work perfectly! 🚀
