// Settings Module - Auto-discovered by framework
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const settingsModule: ModuleConfig = {
  id: 'settings',
  name: 'System Settings',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'],
  permissions: ['settings.view', 'settings.edit'],
};

export default settingsModule;
