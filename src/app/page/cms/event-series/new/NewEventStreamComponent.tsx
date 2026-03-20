// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { EventStreamForm } from '../../../../../components/EventStreamForm';
import { CMSLayout } from '../../../../../components/CMSLayout';
import { useRouter } from '../../../../../contexts/RouterContext';

export function NewEventStreamPage() {
  const router = useRouter();
  
  return (
    <CMSLayout>
      <EventStreamForm onNavigate={(page) => {
        if (typeof page === 'string') {
          router.push(`/page/cms/${page}`);
        } else {
          router.push('/page/cms/event-series');
        }
      }} />
    </CMSLayout>
  );
}
