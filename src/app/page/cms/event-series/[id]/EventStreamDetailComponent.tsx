// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { EventStreamDetailEnhanced } from '../../../../../components/EventStreamDetailEnhanced';
import { CMSLayout } from '../../../../../components/CMSLayout';

interface EventStreamDetailPageProps {
  streamId: string;
}

export function EventStreamDetailPage({ streamId }: EventStreamDetailPageProps) {
  return (
    <CMSLayout>
      <EventStreamDetailEnhanced streamId={streamId} />
    </CMSLayout>
  );
}
