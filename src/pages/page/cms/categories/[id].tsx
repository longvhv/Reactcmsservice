// Shim layer for Figma Make
'use client';
import { CategoryDetailPage } from '../../../../app/page/cms/categories/[id]/CategoryDetailComponent';
export default function CategoryDetail({ params }: { params: { id: string } }) {
  return <CategoryDetailPage params={params} />;
}
