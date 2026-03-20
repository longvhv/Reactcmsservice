'use client';

import { EventStreamForm } from '../../../../../../components/EventStreamForm';
import { useParams, useRouter } from 'next/navigation';

export default function EditEventStreamPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <EventStreamForm 
      streamId={params.id as string}
      onBack={() => router.push('/page/cms/event-series')}
    />
  );
}
