// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { UserRoles } from '../../../../../components/UserRoles';
import { CMSLayout } from '../../../../../components/CMSLayout';

export function UserRolesPage() {
  return (
    <CMSLayout>
      <UserRoles />
    </CMSLayout>
  );
}
