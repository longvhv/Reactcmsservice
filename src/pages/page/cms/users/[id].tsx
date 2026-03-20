// Shim layer
'use client';
import { UserDetailPage } from '../../../../app/page/cms/users/[id]/UserDetailComponent';
import { useRouter } from 'next/router';

export default function UserDetailPageShim() {
  const router = useRouter();
  const userId = router.query.id as string;

  if (!userId) return null;

  return <UserDetailPage userId={userId} />;
}