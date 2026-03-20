'use client';

import { UserDetailPage } from './UserDetailComponent';
import { useRouter as useNextRouter } from 'next/router';

export default function UserDetailPageRoute() {
  const router = useNextRouter();
  const userId = router.query.id as string;

  if (!userId) return null;

  return <UserDetailPage userId={userId} />;
}