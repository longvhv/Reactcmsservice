# Fix Lỗi Recharts Width/Height -1

## Vấn đề
Recharts báo lỗi: **"The width(-1) and height(-1) of chart should be greater than 0"**

## Nguyên nhân
1. ResponsiveContainer không thể tính toán được kích thước khi parent container không có kích thước cụ thể
2. Element width/height có thể bị set thành giá trị âm hoặc 0 trong một số trường hợp:
   - Người dùng nhập giá trị invalid vào input
   - Resize element quá nhỏ
   - Sau khi snap to grid, kích thước có thể bị làm tròn xuống 0

## Giải pháp đã áp dụng

### 1. Sửa ResponsiveContainer trong InfographicBuilderV2.tsx

**Before:**
```tsx
<ResponsiveContainer width="100%" height="100%">
```

**After:**
```tsx
<ResponsiveContainer 
  width={Math.max(element.width * (zoom / 100), 50)} 
  height={Math.max(element.height * (zoom / 100), 50)} 
  minWidth={0} 
  minHeight={0}
>
```

**Thêm validation:**
```tsx
{element.type === 'chart' && element.chartData && element.width > 0 && element.height > 0 && (
  // Chart rendering
)}
```

### 2. Thêm validation cho input Width/Height

**Before:**
```tsx
<input
  type="number"
  value={selectedElement.width}
  onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
/>
```

**After:**
```tsx
<input
  type="number"
  min="1"
  value={selectedElement.width}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      updateElement(selectedElement.id, { width: val });
    }
  }}
/>
```

### 3. Thêm validation trong Resize Handler

**Before:**
```tsx
updateElement(selectedElement.id, {
  x: snapValue(newX),
  y: snapValue(newY),
  width: snapValue(newWidth),
  height: snapValue(newHeight)
});
```

**After:**
```tsx
// Ensure minimum size after snapping
const snappedWidth = Math.max(10, snapValue(newWidth));
const snappedHeight = Math.max(10, snapValue(newHeight));

updateElement(selectedElement.id, {
  x: snapValue(newX),
  y: snapValue(newY),
  width: snappedWidth,
  height: snappedHeight
});
```

## Kết quả
✅ Recharts luôn nhận được kích thước hợp lệ (> 0)  
✅ Không còn lỗi width/height -1  
✅ Charts render đúng trong mọi trường hợp  
✅ Người dùng không thể tạo element với kích thước invalid  
✅ Resize và snap to grid hoạt động chính xác  

## Files đã sửa
- `/components/InfographicBuilderV2.tsx` (3 chỗ: ResponsiveContainer, input validation, resize validation)

## Testing checklist
- [x] Tạo chart element mới - hoạt động bình thường
- [x] Resize chart element - không còn lỗi
- [x] Nhập width/height thủ công - chỉ chấp nhận giá trị > 0
- [x] Snap to grid - kích thước luôn >= 10px
- [x] Zoom in/out - charts render đúng ở mọi mức zoom
- [x] Load templates có charts - hiển thị chính xác

---

**Date:** December 30, 2024  
**Status:** ✅ COMPLETED
