// Shim layer for Figma Make compatibility
// Imports from /app and wraps with routing logic
// When migrating to Next.js, use /app/page/cms/dashboard/page.tsx instead

'use client';

import { Dashboard } from '../../../app/page/cms/dashboard/DashboardComponent';

export default function DashboardPage() {
  return <Dashboard />;
}
