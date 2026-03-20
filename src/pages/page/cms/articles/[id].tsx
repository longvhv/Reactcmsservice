// Shim layer for Figma Make
'use client';
import { ArticleDetailPage } from '../../../../app/page/cms/articles/[id]/ArticleDetailComponent';
export default function ArticleDetail({ params }: { params: { id: string } }) {
  return <ArticleDetailPage params={params} />;
}
