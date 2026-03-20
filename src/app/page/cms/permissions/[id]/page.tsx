'use client';

import { PermissionGroupDetail } from '../../../../../components/PermissionGroupDetail';
import { useParams, useRouter } from 'next/navigation';

export default function PermissionGroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = parseInt(params.id as string);

  return (
    <PermissionGroupDetail 
      groupId={groupId}
      onBack={() => router.push('/page/cms/permissions')}
    />
  );
}
