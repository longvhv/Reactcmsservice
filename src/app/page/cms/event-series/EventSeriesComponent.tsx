// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { EventStreamList } from '../../../../components/EventStreamList';
import { CMSLayout } from '../../../../components/CMSLayout';
import { useRouter } from '../../../../contexts/RouterContext';

export function EventSeriesPage() {
  const router = useRouter();
  
  const handleNavigate = (page: any) => {
    if (page.page === 'event-stream-detail' && page.id) {
      router.push(`/page/cms/event-series/${page.id}`);
    } else if (typeof page === 'string') {
      router.push(`/page/cms/${page}`);
    }
  };
  
  return (
    <CMSLayout>
      <EventStreamList onNavigate={handleNavigate} />
    </CMSLayout>
  );
}
