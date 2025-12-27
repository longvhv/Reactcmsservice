import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const ArticleListPage = lazy(() => import('./pages/ArticleListPage'));
const ArticleEditorPage = lazy(() => import('./pages/ArticleEditorPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const CategoryManagementPage = lazy(() => import('./pages/CategoryManagementPage'));

export const routes: RouteObject[] = [
  {
    path: '/articles',
    element: <ArticleListPage />,
  },
  {
    path: '/articles/create',
    element: <ArticleEditorPage />,
  },
  {
    path: '/articles/:id',
    element: <ArticleDetailPage />,
  },
  {
    path: '/articles/:id/edit',
    element: <ArticleEditorPage />,
  },
  {
    path: '/articles/categories',
    element: <CategoryManagementPage />,
  },
];