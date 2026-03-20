// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { UserAccessLogs } from '../../../../../components/UserAccessLogs';
import { CMSLayout } from '../../../../../components/CMSLayout';

export function UserAccessLogsPage() {
  return (
    <CMSLayout>
      <UserAccessLogs />
    </CMSLayout>
  );
}
