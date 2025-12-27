import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardPage />,
  },
];
