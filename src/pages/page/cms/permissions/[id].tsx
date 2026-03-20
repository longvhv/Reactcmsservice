// Shim layer
'use client';
import { PermissionGroupDetailPage } from '../../../../app/page/cms/permissions/[id]/PermissionGroupDetailComponent';

export default function PermissionGroupDetailPageShim({ params }: { params: { id: string } }) {
  return <PermissionGroupDetailPage groupId={parseInt(params.id)} />;
}