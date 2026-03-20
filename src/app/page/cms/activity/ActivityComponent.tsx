// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { ActivityTimeline } from '../../../../components/ActivityTimeline';
import { CMSLayout } from '../../../../components/CMSLayout';

export function Activity() {
  return (
    <CMSLayout>
      <ActivityTimeline />
    </CMSLayout>
  );
}
