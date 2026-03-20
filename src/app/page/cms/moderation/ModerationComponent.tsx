// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { ContentModeration } from '../../../../components/ContentModeration';
import { CMSLayout } from '../../../../components/CMSLayout';

export function ModerationPage() {
  return (
    <CMSLayout>
      <ContentModeration />
    </CMSLayout>
  );
}
