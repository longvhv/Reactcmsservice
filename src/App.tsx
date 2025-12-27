import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ArticleManagement } from './components/ArticleManagement';
import { ArticleDetail } from './components/ArticleDetail';
import { CategoryManagement } from './components/CategoryManagementWrapper';
import { CategoryDetail } from './components/CategoryDetail';
import { PermissionGroups } from './components/PermissionGroups';
import { MediaManagement } from './components/MediaManagement';
import { CrawlerManagement } from './components/CrawlerManagementNew';
import { CampaignDetail } from './components/CampaignDetail';
import { SourceDetail } from './components/SourceDetail';
import { CrawlerSources } from './components/CrawlerSources';
import { CrawlerArticles } from './components/CrawlerArticles';
import { ApprovedArticles } from './components/ApprovedArticles';
import { StatsAnalytics } from './components/StatsAnalytics';
import { Settings } from './components/Settings';
import { EventSeries } from './components/EventSeries';
import { UserManagement } from './components/UserManagement';
import { ActivityTimeline } from './components/ActivityTimeline';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ApprovalWorkflow } from './components/ApprovalWorkflow';
import { ApprovalDashboard } from './components/ApprovalDashboard';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { VersionControl } from './components/VersionControl';
import { PublishingScheduler } from './components/PublishingScheduler';

type PageState = 
  | { page: 'dashboard' }
  | { page: 'articles' }
  | { page: 'article-detail'; id: number }
  | { page: 'categories' }
  | { page: 'category-detail'; id: number }
  | { page: 'permissions' }
  | { page: 'event-series' }
  | { page: 'media' }
  | { page: 'crawler'; subPage?: string }
  | { page: 'campaign-detail'; campaignId: string }
  | { page: 'source-detail'; sourceId: string; campaignId: string }
  | { page: 'stats'; reportId?: string }
  | { page: 'users' }
  | { page: 'activity' }
  | { page: 'settings'; subPage?: string }
  | { page: 'approval-workflow' }
  | { page: 'approval-dashboard' };

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
        return <CategoryDetail categoryId={currentPage.id} onNavigate={setCurrentPage} />;
      case 'permissions':
        return <PermissionGroups />;
      case 'event-series':
        return <EventSeries />;
      case 'media':
        return <MediaManagement />;
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
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-background gradient-mesh">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={(page) => setCurrentPage(typeof page === 'string' ? { page: page as any } : page)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}