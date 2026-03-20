// Business logic component
'use client';
import { ArticleManagement as ArticleManagementImpl } from '../../../../components/ArticleManagement';
import { CMSLayout } from '../../../../components/CMSLayout';

export function ArticleManagement() {
  return (
    <CMSLayout>
      <ArticleManagementImpl />
    </CMSLayout>
  );
}