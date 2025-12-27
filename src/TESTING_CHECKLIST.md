# ✅ Testing Checklist - VHV CMS

Danh sách kiểm tra để đảm bảo mọi thứ hoạt động đúng sau khi refactor.

---

## 🔧 **1. Environment Setup**

### ✅ Configuration Files

- [ ] `.env.development` được tạo
- [ ] `VITE_API_URL` được cấu hình đúng
- [ ] `package.json` có tất cả dependencies
- [ ] `tsconfig.json` cấu hình TypeScript
- [ ] `vite.config.ts` cấu hình build

### ✅ Installation

```bash
# Run these commands
pnpm install              # Should complete without errors
pnpm type-check          # Should pass without TypeScript errors
```

**Expected Output:**
- ✅ No installation errors
- ✅ No TypeScript errors
- ✅ All packages installed successfully

---

## 🚀 **2. Development Server**

### ✅ Start Server

```bash
pnpm dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Check in Browser:**
- [ ] Application loads at `http://localhost:3000`
- [ ] No console errors in DevTools
- [ ] Health Check appears in console:

```
🏥 VHV CMS Health Check
  ✅ Framework Packages: All @longvhv packages loaded
  ✅ Environment Variables: All environment variables configured
  ⚠️  API Connection: Cannot reach http://localhost:8080 (using mock data)
  ✅ LocalStorage: LocalStorage available
  ✅ Browser Compatibility: All features supported

📊 Summary:
   ✅ OK: 4
   ⚠️  Warnings: 1
   ❌ Errors: 0
```

---

## 🎨 **3. Framework Providers**

### ✅ Theme Provider (`@longvhv/theme`)

**Test Steps:**
1. [ ] Open application
2. [ ] Click theme toggle button (Sun/Moon icon)
3. [ ] Verify dark mode switches
4. [ ] Open DevTools panel (purple gear icon)
5. [ ] Try all 3 theme modes: Light, Dark, System

**Expected:**
- ✅ Theme switches instantly
- ✅ Colors change correctly
- ✅ Preference saved in localStorage
- ✅ System mode follows OS preference

### ✅ I18n Provider (`@longvhv/i18n`)

**Test Steps:**
1. [ ] Open application
2. [ ] Find language switcher (🇻🇳 VI / 🇬🇧 EN)
3. [ ] Switch to English
4. [ ] Switch back to Vietnamese
5. [ ] Open DevTools, test language buttons

**Expected:**
- ✅ Text changes to correct language
- ✅ All UI elements translate
- ✅ Preference saved

### ✅ Query Provider (`@longvhv/query`)

**Test Steps:**
1. [ ] Navigate to `/articles`
2. [ ] Open Network tab in DevTools
3. [ ] Watch for API calls
4. [ ] Verify loading states appear

**Expected:**
- ✅ Loading spinner shows initially
- ✅ Mock data displays (since backend not connected)
- ✅ No duplicate API calls (caching works)

### ✅ Notification Provider (`@longvhv/notifications`)

**Test Steps:**
1. [ ] Open DevTools panel
2. [ ] Click "Clear React Query Cache"
3. [ ] Verify toast notification appears
4. [ ] Try other notification types (if available)

**Expected:**
- ✅ Toast appears with animation
- ✅ Toast auto-dismisses after 3-5 seconds
- ✅ Multiple toasts stack properly

### ✅ Auth Provider (`@longvhv/auth`)

**Test Steps:**
1. [ ] Check user info in top-right corner
2. [ ] Click user avatar
3. [ ] Verify dropdown shows user info
4. [ ] Check DevTools panel → Authentication section

**Expected:**
- ✅ User info displays (mock data)
- ✅ Logout button works
- ✅ Auth status shows in DevTools

---

## 🏗️ **4. Module System**

### ✅ Module Auto-Discovery

**Check Console:**
```
Should see something like:
✅ Modules registered: 6
  - dashboard
  - articles
  - media
  - analytics
  - users
  - settings
```

### ✅ Dashboard Module

**Test Steps:**
1. [ ] Navigate to `/` (root)
2. [ ] Verify Dashboard loads
3. [ ] Check stats cards display
4. [ ] Verify charts/graphs render
5. [ ] Test quick action buttons

**Expected:**
- ✅ Dashboard page loads without errors
- ✅ Stats show mock data
- ✅ All components render
- ✅ No console errors

### ✅ Articles Module

**Test Steps:**
1. [ ] Navigate to `/articles`
2. [ ] Verify article list loads
3. [ ] Check filters (search, status, type)
4. [ ] Test actions (view, edit, delete)
5. [ ] Verify stats overview at top

**Expected:**
- ✅ Article list shows 3 mock articles
- ✅ Filters work correctly
- ✅ Table is responsive
- ✅ Actions buttons work

### ✅ Other Modules

**Test Steps:**
1. [ ] Navigate to `/media` - Should load (empty state)
2. [ ] Navigate to `/analytics` - Should load (empty state)
3. [ ] Navigate to `/users` - Should load (empty state)
4. [ ] Navigate to `/settings` - Should load (empty state)

**Expected:**
- ✅ All routes exist
- ✅ No 404 errors
- ✅ Pages render correctly

---

## 🎯 **5. Components**

### ✅ Layout Component

**Test Steps:**
1. [ ] Verify sidebar appears
2. [ ] Click collapse button (X icon)
3. [ ] Sidebar collapses to icon-only mode
4. [ ] Expand again
5. [ ] Test all navigation links

**Expected:**
- ✅ Sidebar toggles smoothly
- ✅ Icons remain visible when collapsed
- ✅ All links navigate correctly
- ✅ Active route highlights

### ✅ Error Boundary

**Test Steps:**
1. [ ] Open DevTools console
2. [ ] Type: `window.throwError = () => { throw new Error('Test Error'); }`
3. [ ] Call: `window.throwError()`
4. [ ] Verify error boundary catches it

**Expected:**
- ✅ Error boundary shows custom error page
- ✅ Reload button works
- ✅ Go to Home button works
- ✅ Error details shown in dev mode

### ✅ DevTools Panel

**Test Steps:**
1. [ ] Look for purple gear icon (bottom-right)
2. [ ] Click to open DevTools panel
3. [ ] Test all sections:
   - [ ] Environment info
   - [ ] Auth status
   - [ ] Theme controls
   - [ ] Language controls
   - [ ] Cache controls
   - [ ] Framework packages list

**Expected:**
- ✅ Panel opens/closes smoothly
- ✅ All info displays correctly
- ✅ Controls work as expected
- ✅ Clear cache button works

---

## 📡 **6. API Integration**

### ✅ API Client

**Test Steps:**
1. [ ] Open `/src/services/api.ts`
2. [ ] Verify `ApiClient` imported from `@longvhv/api-client`
3. [ ] Check configuration

**Expected:**
```typescript
export const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### ✅ Article Service

**Test Steps:**
1. [ ] Open `/src/modules/articles/services/articleService.ts`
2. [ ] Verify mock data exists
3. [ ] Navigate to `/articles`
4. [ ] Verify mock articles display

**Expected:**
- ✅ 3 mock articles show
- ✅ Service uses `apiClient`
- ✅ Error handling present

---

## 🎨 **7. Styling & Theme**

### ✅ Tailwind CSS

**Test Steps:**
1. [ ] Check any component for Tailwind classes
2. [ ] Verify styles apply
3. [ ] Test responsive design (resize browser)

**Expected:**
- ✅ Tailwind classes work
- ✅ Responsive breakpoints work
- ✅ Dark mode classes apply

### ✅ CSS Variables

**Test Steps:**
1. [ ] Open `/src/index.css`
2. [ ] Verify CSS variables defined
3. [ ] Toggle dark mode
4. [ ] Verify colors change

**Expected:**
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  /* ... */
}
```

---

## 🔍 **8. TypeScript**

### ✅ Type Checking

```bash
pnpm type-check
```

**Expected Output:**
```
✓ TypeScript compiled successfully
```

### ✅ Types Usage

**Test Steps:**
1. [ ] Open `/src/types/article.ts`
2. [ ] Verify all types defined
3. [ ] Check usage in components
4. [ ] Verify intellisense works in IDE

**Expected:**
- ✅ No TypeScript errors
- ✅ Autocomplete works
- ✅ Type inference works

---

## 🧪 **9. Performance**

### ✅ Build Size

```bash
pnpm build
```

**Expected Output:**
```
vite v5.x.x building for production...
✓ xxx modules transformed.
dist/index.html                  x.xx kB
dist/assets/index-xxxxx.css     xx.xx kB
dist/assets/index-xxxxx.js     xxx.xx kB
✓ built in xxxs
```

**Check:**
- [ ] Build completes without errors
- [ ] Bundle size reasonable (<500KB for main chunk)
- [ ] Assets split correctly

### ✅ Development Performance

**Test Steps:**
1. [ ] Check HMR (Hot Module Replacement)
2. [ ] Edit a component
3. [ ] Save file
4. [ ] Verify instant update in browser

**Expected:**
- ✅ HMR updates in <1 second
- ✅ No full page reload
- ✅ State preserved

---

## 🌐 **10. Browser Compatibility**

### ✅ Test in Browsers

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

**Expected:**
- ✅ App works in all browsers
- ✅ No browser-specific errors
- ✅ Consistent behavior

---

## 📱 **11. Responsive Design**

### ✅ Mobile View

**Test Steps:**
1. [ ] Resize browser to mobile size (375px)
2. [ ] Test navigation
3. [ ] Test all pages

**Expected:**
- ✅ Layout adapts to mobile
- ✅ Sidebar behavior changes
- ✅ Touch-friendly buttons

### ✅ Tablet View

**Test Steps:**
1. [ ] Resize to tablet size (768px)
2. [ ] Verify layout

**Expected:**
- ✅ Optimal layout for tablet
- ✅ All features accessible

---

## 🐛 **12. Error Handling**

### ✅ Network Errors

**Test Steps:**
1. [ ] Open Network tab
2. [ ] Enable "Offline" mode
3. [ ] Navigate to `/articles`

**Expected:**
- ✅ Error message shows
- ✅ Retry button appears
- ✅ No crash

### ✅ 404 Pages

**Test Steps:**
1. [ ] Navigate to `/non-existent-route`

**Expected:**
- ✅ Shows 404 or redirects to home
- ✅ No crash

---

## ✅ **FINAL CHECKLIST**

**Before marking as complete:**

- [ ] All environment variables configured
- [ ] Development server starts without errors
- [ ] All 6 modules load correctly
- [ ] Theme switching works (Light/Dark/System)
- [ ] Language switching works (VI/EN)
- [ ] Mock data displays in articles list
- [ ] DevTools panel works
- [ ] Error boundary catches errors
- [ ] TypeScript compiles without errors
- [ ] Build completes successfully
- [ ] App works in all browsers
- [ ] Responsive design works
- [ ] No console errors in DevTools

---

## 🎉 **Success Criteria**

✅ **Minimum Requirements:**
- At least 90% of checklist items pass
- No critical errors in console
- App loads and navigates smoothly

✅ **Recommended:**
- 100% of checklist items pass
- Performance metrics good
- All features work as expected

---

## 🆘 **If Something Fails**

1. Check console for errors
2. Verify `.env.development` configuration
3. Run `pnpm install` again
4. Clear cache: `pnpm clean && pnpm install`
5. Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
6. Review [FRAMEWORK_INTEGRATION.md](./FRAMEWORK_INTEGRATION.md)

---

**After completing this checklist, you're ready to connect the real backend API!** 🚀
