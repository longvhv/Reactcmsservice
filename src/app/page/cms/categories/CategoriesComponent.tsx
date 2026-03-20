// Business logic component
'use client';
import { CategoryManagement as CategoryManagementImpl } from '../../../../components/CategoryManagement';
import { CMSLayout } from '../../../../components/CMSLayout';

export function CategoryManagement() {
  return (
    <CMSLayout>
      <CategoryManagementImpl />
    </CMSLayout>
  );
}