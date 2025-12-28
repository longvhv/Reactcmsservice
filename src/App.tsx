import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ArticleManagement } from './components/ArticleManagement';
import { ArticleDetail } from './components/ArticleDetail';
import { CategoryManagement } from './components/CategoryManagement';
import { CategoryDetail } from './components/CategoryDetail';
import { PermissionGroups } from './components/PermissionGroups';
import { PermissionGroupDetail } from './components/PermissionGroupDetail';
import { MediaManagement } from './components/MediaManagement';
import { CrawlerManagement } from './components/CrawlerManagementNew';
import { CrawlerSources } from './components/CrawlerSources';
import { CrawlerArticles } from './components/CrawlerArticles';
import { ApprovedArticles } from './components/ApprovedArticles';
import { CampaignDetail } from './components/CampaignDetail';
import { SourceDetail } from './components/SourceDetail';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EventStreamList } from './components/EventStreamList';
import { EventStreamForm } from './components/EventStreamForm';
import { EventStreamDetailEnhanced } from './components/EventStreamDetailEnhanced';
import { StatsAnalytics } from './components/StatsAnalytics';
import { UserManagement } from './components/UserManagement';
import { ApprovalWorkflow } from './components/ApprovalWorkflow';
import { ApprovalDashboard } from './components/ApprovalDashboard';
import { ContentModeration } from './components/ContentModeration';
import { AdvancedSearch } from './components/AdvancedSearch';
import { WorkflowManager } from './components/WorkflowManager';
import { ActivityLog } from './components/ActivityLog';
import { ActivityTimeline } from './components/ActivityTimeline';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AITools } from './components/AITools';
import { ErrorBoundary } from './components/ErrorBoundary';

type PageState = 
  | { page: 'dashboard' }
  | { page: 'articles' }
  | { page: 'article-detail'; id: number }
  | { page: 'categories' }
  | { page: 'category-detail'; id: number }
  | { page: 'permissions' }
  | { page: 'permission-group-detail'; id: number }
  | { page: 'event-series' }
  | { page: 'event-stream-form'; id?: string }
  | { page: 'event-stream-detail'; id: string }
  | { page: 'media' }
  | { page: 'crawler'; subPage?: string }
  | { page: 'campaign-detail'; campaignId: string }
  | { page: 'source-detail'; sourceId: string; campaignId: string }
  | { page: 'stats'; reportId?: string }
  | { page: 'users' }
  | { page: 'activity' }
  | { page: 'settings'; subPage?: string }
  | { page: 'approval-workflow' }
  | { page: 'approval-dashboard' }
  | { page: 'content-moderation' }
  | { page: 'advanced-search' }
  | { page: 'workflow-manager' }
  | { page: 'activity-log' }
  | { page: 'analytics' }
  | { page: 'ai-tools' };

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>({ page: 'dashboard' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage.page) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'articles':
        return <ArticleManagement onNavigate={setCurrentPage} />;
      case 'article-detail':
        return <ArticleDetail articleId={currentPage.id} onNavigate={setCurrentPage} />;
      case 'categories':
        return <CategoryManagement onNavigate={setCurrentPage} />;
      case 'category-detail':
        return <CategoryDetail categoryId={currentPage.id} onBack={() => setCurrentPage({ page: 'categories' })} onNavigate={setCurrentPage} />;
      case 'permissions':
        return <PermissionGroups onNavigate={setCurrentPage} />;
      case 'permission-group-detail':
        return <PermissionGroupDetail groupId={currentPage.id} onBack={() => setCurrentPage({ page: 'permissions' })} onNavigate={setCurrentPage} />;
      case 'event-series':
        return <EventStreamList onNavigate={setCurrentPage} />;
      case 'event-stream-form':
        return <EventStreamForm onNavigate={setCurrentPage} streamId={currentPage.id} />;
      case 'event-stream-detail':
        return <EventStreamDetailEnhanced streamId={currentPage.id} onNavigate={setCurrentPage} />;
      case 'media':
        return <MediaManagement onNavigate={setCurrentPage} />;
      case 'crawler':
        // Handle crawler submenu routing
        if (currentPage.subPage === 'campaigns') {
          return <CrawlerManagement onNavigate={setCurrentPage} />;
        } else if (currentPage.subPage === 'sources') {
          return <CrawlerSources />;
        } else if (currentPage.subPage === 'crawled') {
          return <CrawlerArticles />;
        } else if (currentPage.subPage === 'approved') {
          return <ApprovedArticles />;
        }
        // Default to campaigns
        return <CrawlerManagement onNavigate={setCurrentPage} />;
      case 'campaign-detail':
        return <CampaignDetail campaignId={currentPage.campaignId} onNavigate={setCurrentPage} />;
      case 'source-detail':
        return <SourceDetail sourceId={currentPage.sourceId} campaignId={currentPage.campaignId} onNavigate={setCurrentPage} />;
      case 'stats':
        return <StatsAnalytics reportId={currentPage.reportId} />;
      case 'users':
        return <UserManagement />;
      case 'activity':
        return <ActivityTimeline />;
      case 'settings':
        return <Settings subPage={currentPage.subPage} />;
      case 'approval-workflow':
        return <ApprovalWorkflow />;
      case 'approval-dashboard':
        return <ApprovalDashboard />;
      case 'content-moderation':
        return <ContentModeration />;
      case 'advanced-search':
        return <AdvancedSearch onNavigate={setCurrentPage} />;
      case 'workflow-manager':
        return <WorkflowManager onNavigate={setCurrentPage} />;
      case 'activity-log':
        return <ActivityLog onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsDashboard onNavigate={setCurrentPage} />;
      case 'ai-tools':
        return <AITools onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  // Fullscreen pages without sidebar/header
  if (currentPage.page === 'media') {
    return (
      <ErrorBoundary>
        <MediaManagement onNavigate={setCurrentPage} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="flex h-screen bg-background gradient-mesh">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={(page) => setCurrentPage(typeof page === 'string' ? { page: page as any } : page)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          onNavigate={setCurrentPage}
        />
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}