// Shim layer
'use client';
import { EventStreamDetailPage } from '../../../../app/page/cms/event-series/[id]/EventStreamDetailComponent';

export default function EventStreamDetailPageShim({ params }: { params: { id: string } }) {
  return <EventStreamDetailPage streamId={params.id} />;
}