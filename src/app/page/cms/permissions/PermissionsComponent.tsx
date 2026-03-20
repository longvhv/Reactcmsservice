// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { PermissionGroups } from '../../../../components/PermissionGroups';
import { CMSLayout } from '../../../../components/CMSLayout';

export function PermissionsPage() {
  return (
    <CMSLayout>
      <PermissionGroups />
    </CMSLayout>
  );
}
