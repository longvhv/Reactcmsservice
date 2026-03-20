// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { PermissionGroupDetail } from '../../../../../components/PermissionGroupDetail';
import { CMSLayout } from '../../../../../components/CMSLayout';
import { useRouter } from '../../../../../contexts/RouterContext';

interface PermissionGroupDetailPageProps {
  groupId: number;
}

export function PermissionGroupDetailPage({ groupId }: PermissionGroupDetailPageProps) {
  const router = useRouter();
  
  return (
    <CMSLayout>
      <PermissionGroupDetail groupId={groupId} onBack={() => router.push('/page/cms/permissions')} />
    </CMSLayout>
  );
}
