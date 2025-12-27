import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

export const routes: RouteObject[] = [
  {
    path: '/analytics',
    element: <AnalyticsPage />,
  },
];
