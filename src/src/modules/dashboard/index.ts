// Dashboard Module - Auto-discovered by framework
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const dashboardModule: ModuleConfig = {
  id: 'dashboard',
  name: 'Dashboard',
  version: '1.0.0',
  routes,
  dependencies: [],
  permissions: ['dashboard.view'],
};

export default dashboardModule;
