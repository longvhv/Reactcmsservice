// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { Dashboard as DashboardImpl } from '../../../../components/Dashboard';
import { CMSLayout } from '../../../../components/CMSLayout';

export function Dashboard() {
  return (
    <CMSLayout>
      <DashboardImpl />
    </CMSLayout>
  );
}