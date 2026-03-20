// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { RoyaltyIntegration } from '../../../../components/RoyaltyIntegration';
import { CMSLayout } from '../../../../components/CMSLayout';

export function RoyaltyIntegrationPage() {
  return (
    <CMSLayout>
      <RoyaltyIntegration />
    </CMSLayout>
  );
}
