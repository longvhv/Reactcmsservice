// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { StatsAnalytics } from '../../../../components/StatsAnalytics';
import { CMSLayout } from '../../../../components/CMSLayout';

export function StatsPage() {
  return (
    <CMSLayout>
      <StatsAnalytics />
    </CMSLayout>
  );
}
