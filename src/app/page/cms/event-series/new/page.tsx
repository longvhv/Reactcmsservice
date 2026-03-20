'use client';

import { EventStreamForm } from '../../../../../components/EventStreamForm';
import { useRouter } from 'next/navigation';

export default function NewEventStreamPage() {
  const router = useRouter();

  return (
    <EventStreamForm 
      onBack={() => router.push('/page/cms/event-series')}
    />
  );
}
