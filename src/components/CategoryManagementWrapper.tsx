import React from 'react';
import { CategoryManagement as NewCategoryManagement } from './CategoryManagementNew';

interface CategoryManagementWrapperProps {
  onNavigate: (page: any) => void;
}

export function CategoryManagement({ onNavigate }: CategoryManagementWrapperProps) {
  return <NewCategoryManagement onNavigate={onNavigate} />;
}