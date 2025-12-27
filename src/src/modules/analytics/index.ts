// Analytics Module - Auto-discovered by framework
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const analyticsModule: ModuleConfig = {
  id: 'analytics',
  name: 'Analytics & Statistics',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'],
  permissions: ['analytics.view'],
};

export default analyticsModule;
