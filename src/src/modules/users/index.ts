// Users Module - Auto-discovered by framework
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const usersModule: ModuleConfig = {
  id: 'users',
  name: 'User Management',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'],
  permissions: ['users.view', 'users.create', 'users.edit', 'users.delete'],
};

export default usersModule;
