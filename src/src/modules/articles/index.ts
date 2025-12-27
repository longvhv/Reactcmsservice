// Articles Module - Auto-discovered by framework
import { ModuleConfig } from '@longvhv/core';
import { routes } from './routes';

export const articlesModule: ModuleConfig = {
  id: 'articles',
  name: 'Articles Management',
  version: '1.0.0',
  routes,
  dependencies: ['dashboard'],
  permissions: ['articles.view', 'articles.create', 'articles.edit', 'articles.delete'],
};

export default articlesModule;
