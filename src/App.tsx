// Main entry point for Figma Make
// This file handles routing and state management
// When migrating to Next.js, this will be replaced by Next.js App Router

import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { SystemSettingsProvider } from './contexts/SystemSettingsContext';
import { RouterProvider } from './contexts/RouterContext';
import './styles/globals.css';

// Import page components from /pages shim layer
import DashboardPage from './pages/page/cms/dashboard';
import ArticlesPage from './pages/page/cms/articles';
import ArticleDetailPage from './pages/page/cms/articles/[id]';
import CategoriesPage from './pages/page/cms/categories';
import CategoryDetailPage from './pages/page/cms/categories/[id]';
import PermissionsPage from './pages/page/cms/permissions';
import PermissionGroupDetailPage from './pages/page/cms/permissions/[id]';
import EventSeriesPage from './pages/page/cms/event-series';
import NewEventStreamPage from './pages/page/cms/event-series/new';
import EventStreamDetailPage from './pages/page/cms/event-series/[id]';
import EditEventStreamPage from './pages/page/cms/event-series/edit/[id]';
import UsersPage from './pages/page/cms/users';
import UserDetailPage from './pages/page/cms/users/[id]';
import UserRolesPage from './pages/page/cms/users/roles';
import UserGroupsPage from './pages/page/cms/users/groups';
import UserAccessLogsPage from './pages/page/cms/users/access-logs';
import UserSecuritySettingsPage from './pages/page/cms/users/security';
import AIToolsPage from './pages/page/cms/ai-tools';
import ContentModerationPage from './pages/page/cms/moderation';
import AnalyticsPage from './pages/page/cms/analytics';
import StatsPage from './pages/page/cms/stats';
import ActivityPage from './pages/page/cms/activity';
import ActivityLogPage from './pages/page/cms/activity-log';
import SettingsPage from './pages/page/cms/settings';
import ApprovalWorkflowPage from './pages/page/cms/approval-workflow';
import ApprovalDashboardPage from './pages/page/cms/approval-dashboard';
import AdvancedSearchPage from './pages/page/cms/advanced-search';
import WorkflowManagerPage from './pages/page/cms/workflow-manager';
import RoyaltyManagementPage from './pages/page/cms/royalty-management';
import RoyaltyIntegrationPage from './pages/page/cms/royalty-integration';
import ReporterPortalPage from './pages/page/cms/reporter';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<{
    path: string;
    params?: Record<string, string>;
  }>({ path: '/page/cms/dashboard' });

  useEffect(() => {
    // Handle browser back/forward
    const handlePopState = () => {
      const path = window.location.pathname || '/page/cms/dashboard';
      setCurrentRoute({ path });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params?: Record<string, string>) => {
    setCurrentRoute({ path, params });
    window.history.pushState({}, '', path);
  };

  const renderPage = () => {
    const { path } = currentRoute;

    // Dashboard
    if (path === '/page/cms/dashboard') return <DashboardPage />;

    // Articles
    if (path === '/page/cms/articles') return <ArticlesPage />;
    if (path.match(/^\/page\/cms\/articles\/\d+$/)) {
      const id = path.split('/').pop()!;
      return <ArticleDetailPage params={{ id }} />;
    }

    // Categories
    if (path === '/page/cms/categories') return <CategoriesPage />;
    if (path.match(/^\/page\/cms\/categories\/\d+$/)) {
      const id = path.split('/').pop()!;
      return <CategoryDetailPage params={{ id }} />;
    }

    // Permissions
    if (path === '/page/cms/permissions') return <PermissionsPage />;
    if (path.match(/^\/page\/cms\/permissions\/\d+$/)) {
      const id = path.split('/').pop()!;
      return <PermissionGroupDetailPage params={{ id }} />;
    }

    // Event Series
    if (path === '/page/cms/event-series') return <EventSeriesPage />;
    if (path === '/page/cms/event-series/new') return <NewEventStreamPage />;
    if (path.match(/^\/page\/cms\/event-series\/edit\/[^/]+$/)) {
      const id = path.split('/').pop()!;
      return <EditEventStreamPage params={{ id }} />;
    }
    if (path.match(/^\/page\/cms\/event-series\/[^/]+$/)) {
      const id = path.split('/').pop()!;
      return <EventStreamDetailPage params={{ id }} />;
    }

    // Users
    if (path === '/page/cms/users') return <UsersPage />;
    if (path === '/page/cms/users/roles') return <UserRolesPage />;
    if (path === '/page/cms/users/groups') return <UserGroupsPage />;
    if (path === '/page/cms/users/access-logs') return <UserAccessLogsPage />;
    if (path === '/page/cms/users/security') return <UserSecuritySettingsPage />;
    if (path.match(/^\/page\/cms\/users\/\d+$/)) {
      const id = path.split('/').pop()!;
      return <UserDetailPage params={{ id }} />;
    }

    // AI & Moderation
    if (path === '/page/cms/ai-tools') return <AIToolsPage />;
    if (path === '/page/cms/moderation') return <ContentModerationPage />;

    // Analytics & Activity
    if (path === '/page/cms/analytics') return <AnalyticsPage />;
    if (path === '/page/cms/stats') return <StatsPage />;
    if (path === '/page/cms/activity') return <ActivityPage />;
    if (path === '/page/cms/activity-log') return <ActivityLogPage />;

    // Workflows
    if (path === '/page/cms/approval-workflow') return <ApprovalWorkflowPage />;
    if (path === '/page/cms/approval-dashboard') return <ApprovalDashboardPage />;
    if (path === '/page/cms/advanced-search') return <AdvancedSearchPage />;
    if (path === '/page/cms/workflow-manager') return <WorkflowManagerPage />;

    // Royalty
    if (path === '/page/cms/royalty-management') return <RoyaltyManagementPage />;
    if (path === '/page/cms/royalty-integration') return <RoyaltyIntegrationPage />;

    // Reporter
    if (path === '/page/cms/reporter') return <ReporterPortalPage />;

    // Settings
    if (path === '/page/cms/settings') return <SettingsPage />;

    // Default fallback
    return <DashboardPage />;
  };

  return (
    <LanguageProvider>
      <SystemSettingsProvider>
        <RouterProvider value={{ navigate, currentRoute }}>
          {renderPage()}
        </RouterProvider>
      </SystemSettingsProvider>
    </LanguageProvider>
  );
}
