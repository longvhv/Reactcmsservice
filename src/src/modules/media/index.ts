// Media Module - Auto-discovered by framework
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const mediaModule: ModuleConfig = {
  id: 'media',
  name: 'Media Library',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'],
  permissions: ['media.view', 'media.upload', 'media.delete'],
};

export default mediaModule;
