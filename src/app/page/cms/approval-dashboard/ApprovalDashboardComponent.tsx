// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { ApprovalDashboard } from '../../../../components/ApprovalDashboard';
import { CMSLayout } from '../../../../components/CMSLayout';

export function ApprovalDashboardPage() {
  return (
    <CMSLayout>
      <ApprovalDashboard />
    </CMSLayout>
  );
}
