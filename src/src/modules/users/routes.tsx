import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const UsersPage = lazy(() => import('./pages/UsersPage'));

export const routes: RouteObject[] = [
  {
    path: '/users',
    element: <UsersPage />,
  },
];
