// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { RoyaltyManagementEnhanced } from '../../../../components/RoyaltyManagementEnhanced';
import { CMSLayout } from '../../../../components/CMSLayout';

export function RoyaltyManagementPage() {
  return (
    <CMSLayout>
      <RoyaltyManagementEnhanced />
    </CMSLayout>
  );
}
