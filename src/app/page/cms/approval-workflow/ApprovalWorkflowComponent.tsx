// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { ApprovalWorkflow } from '../../../../components/ApprovalWorkflow';
import { CMSLayout } from '../../../../components/CMSLayout';

export function ApprovalWorkflowPage() {
  return (
    <CMSLayout>
      <ApprovalWorkflow />
    </CMSLayout>
  );
}
