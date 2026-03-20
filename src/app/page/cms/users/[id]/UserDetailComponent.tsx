// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { UserDetail } from '../../../../../components/UserDetail';
import { CMSLayout } from '../../../../../components/CMSLayout';
import { useRouter } from '../../../../../contexts/RouterContext';

export function UserDetailPage({ userId }: { userId: string }) {
  const router = useRouter();

  return (
    <CMSLayout>
      <UserDetail 
        userId={userId}
        onBack={() => router.push('/page/cms/users')}
      />
    </CMSLayout>
  );
}
