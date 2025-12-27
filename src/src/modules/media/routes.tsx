import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const MediaLibraryPage = lazy(() => import('./pages/MediaLibraryPage'));

export const routes: RouteObject[] = [
  {
    path: '/media',
    element: <MediaLibraryPage />,
  },
];