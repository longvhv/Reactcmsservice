'use client';

import { EventStreamDetailEnhanced } from '../../../../../components/EventStreamDetailEnhanced';
import { useParams, useRouter } from 'next/navigation';

export default function EventStreamDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <EventStreamDetailEnhanced 
      streamId={params.id as string}
      onBack={() => router.push('/page/cms/event-series')}
    />
  );
}
