import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const SettingsPage = lazy(() => import('./pages/SettingsPage'));

export const routes: RouteObject[] = [
  {
    path: '/settings',
    element: <SettingsPage />,
  },
];
