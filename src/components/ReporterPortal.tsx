import React, { useState } from 'react';
import { ReporterSidebar } from './ReporterSidebar';
import { ReporterHeader } from './ReporterHeader';
import { ReporterDashboard } from './ReporterDashboard';
import { ReporterMyArticles } from './ReporterMyArticles';
import { ReporterMyRoyalty } from './ReporterMyRoyalty';
import { ReporterArticleEditor } from './ReporterArticleEditor';
import { ReporterAnalytics } from './ReporterAnalytics';
import { ReporterProfile } from './ReporterProfile';
import { ReporterNotifications } from './ReporterNotifications';
import { ReporterHelp } from './ReporterHelp';
import { mockUsers } from '../utils/mockData';

interface ReporterPortalProps {
  onSwitchToAdmin?: () => void;
}

export function ReporterPortal({ onSwitchToAdmin }: ReporterPortalProps) {
  const [activePage, setActivePage] = useState('dashboard');
  const [articleFormData, setArticleFormData] = useState<{ id?: number; type?: string }>({});
  const [editorResetKey, setEditorResetKey] = useState(0);
  const currentUser = mockUsers[0]; // Nguyễn Văn An - ID 1

  const handleNavigate = (page: string) => {
    // Parse page with query params
    if (page.includes('?')) {
      const [pageName, query] = page.split('?');
      const params = new URLSearchParams(query);
      
      if (pageName === 'create-article') {
        const type = params.get('type') || 'news';
        setArticleFormData({ id: undefined, type });
        setActivePage('create-article');
      } else if (pageName === 'edit-article') {
        const idParam = params.get('id');
        const id = idParam ? parseInt(idParam) : undefined;
        setArticleFormData({ id });
        setActivePage('edit-article');
      }
    } else {
      setActivePage(page);
    }
  };

  const handleSaveArticle = (data: any, saveAndContinue?: boolean) => {
    console.log('Saving article:', data);
    
    if (saveAndContinue) {
      // Reset to create mode - increment key to force component re-mount
      alert('Đã lưu bài viết! Tiếp tục tạo bài mới.');
      setArticleFormData({ id: undefined, type: data.type || 'news' });
      setActivePage('create-article');
      setEditorResetKey(prev => prev + 1); // Force re-mount
    } else {
      // Go back to articles list
      alert('Đã lưu bài viết thành công!');
      setActivePage('my-articles');
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <ReporterDashboard onNavigate={handleNavigate} currentUserId={currentUser.id} />;
      case 'my-articles':
        return <ReporterMyArticles onNavigate={handleNavigate} currentUserId={currentUser.id} />;
      case 'my-royalty':
        return <ReporterMyRoyalty currentUserId={currentUser.id} />;
      case 'create-article':
        return (
          <ReporterArticleEditor
            key={`create-${editorResetKey}`}
            articleId={articleFormData.id}
            articleType={articleFormData.type}
            onBack={() => setActivePage('my-articles')}
            onSave={handleSaveArticle}
          />
        );
      case 'edit-article':
        return (
          <ReporterArticleEditor
            key={`edit-${articleFormData.id}`}
            articleId={articleFormData.id}
            articleType={articleFormData.type}
            onBack={() => setActivePage('my-articles')}
            onSave={handleSaveArticle}
          />
        );
      case 'analytics':
        return <ReporterAnalytics currentUserId={currentUser.id} />;
      case 'profile':
        return <ReporterProfile currentUser={currentUser} />;
      case 'notifications':
        return <ReporterNotifications currentUserId={currentUser.id} />;
      case 'help':
        return <ReporterHelp />;
      default:
        return <ReporterDashboard onNavigate={handleNavigate} currentUserId={currentUser.id} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ReporterHeader 
        currentUser={currentUser}
        onSwitchRole={onSwitchToAdmin}
        onNavigate={handleNavigate}
      />
      <div className="flex flex-1 overflow-hidden">
        <ReporterSidebar 
          activePage={activePage} 
          onNavigate={handleNavigate}
          currentUser={currentUser}
        />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}