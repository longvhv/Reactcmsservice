// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { WorkflowManager } from '../../../../components/WorkflowManager';
import { CMSLayout } from '../../../../components/CMSLayout';

export function WorkflowManagerPage() {
  return (
    <CMSLayout>
      <WorkflowManager />
    </CMSLayout>
  );
}
