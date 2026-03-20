// Shim layer
'use client';
import { EditEventStreamPage } from '../../../../../app/page/cms/event-series/edit/[id]/EditEventStreamComponent';

export default function EditEventStreamPageShim({ params }: { params: { id: string } }) {
  return <EditEventStreamPage streamId={params.id} />;
}