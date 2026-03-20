// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { AnalyticsDashboard } from '../../../../components/AnalyticsDashboard';
import { CMSLayout } from '../../../../components/CMSLayout';

export function AnalyticsPage() {
  return (
    <CMSLayout>
      <AnalyticsDashboard />
    </CMSLayout>
  );
}
