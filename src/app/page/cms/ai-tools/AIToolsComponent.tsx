// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { AITools } from '../../../../components/AITools';
import { CMSLayout } from '../../../../components/CMSLayout';

export function AIToolsPage() {
  return (
    <CMSLayout>
      <AITools />
    </CMSLayout>
  );
}
