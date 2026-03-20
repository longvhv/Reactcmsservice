'use client';

import { EventStreamList } from '../../../../components/EventStreamList';
import { useRouter } from '../../../../contexts/RouterContext';

export default function EventSeriesPage() {
  const router = useRouter();
  
  const handleNavigate = (page: any) => {
    if (page.page === 'event-stream-detail' && page.id) {
      router.push(`/page/cms/event-series/${page.id}`);
    } else if (typeof page === 'string') {
      router.push(`/page/cms/${page}`);
    }
  };
  
  return <EventStreamList onNavigate={handleNavigate} />;
}