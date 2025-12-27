import { LayoutDashboard, FileText, FolderTree, Image, Bot, BarChart3, Settings, Shield, ChevronDown, ChevronRight, Sparkles, Zap, Activity, Layers, Users, Calendar, Package, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: any;
  onPageChange: (page: any) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ currentPage, onPageChange, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['crawler']);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'articles', label: 'Bài viết', icon: FileText, badge: '12' },
    { id: 'categories', label: 'Danh mục', icon: FolderTree, badge: null },
    { id: 'event-series', label: 'Dòng sự kiện', icon: Sparkles, badge: '3' },
    { id: 'permissions', label: 'Nhóm quyền', icon: Shield, badge: null },
    { id: 'media', label: 'Thư viện Media', icon: Image, badge: null },
    { 
      id: 'approval',
      label: 'Kiểm duyệt',
      icon: CheckCircle,
      badge: '23',
      submenu: [
        { id: 'approval-dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'approval-workflow', label: 'Xem xét & Duyệt', icon: CheckCircle },
      ]
    },
    { 
      id: 'crawler', 
      label: 'Crawler', 
      icon: Bot,
      badge: 'NEW',
      submenu: [
        { id: 'campaigns', label: 'Chiến dịch', icon: Package },
        { id: 'sources', label: 'Nguồn thu thập', icon: Layers },
        { id: 'crawled', label: 'Bài viết đã thu thập', icon: FileText },
        { id: 'approved', label: 'Bài viết đã duyệt', icon: CheckCircle },
      ]
    },
    { id: 'stats', label: 'Thống kê', icon: BarChart3, badge: null },
    { id: 'activity', label: 'Nhật ký hoạt động', icon: Activity, badge: null },
    { 
      id: 'settings', 
      label: 'Cài đặt', 
      icon: Settings,
      submenu: [
        { id: 'config', label: 'Cấu hình CMS', icon: Settings },
        { id: 'workflow', label: 'Luồng kiểm duyệt', icon: Activity },
      ]
    },
  ];

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const isActive = (itemId: string, subItemId?: string) => {
    if (subItemId) {
      return currentPage.page === itemId && currentPage.subPage === subItemId;
    }
    return currentPage.page === itemId;
  };

  return (
    <div className={`fixed left-0 top-0 bottom-0 ${isCollapsed ? 'w-20' : 'w-72'} glass-strong border-r border-border/40 flex flex-col z-30 transition-all duration-300 ease-in-out backdrop-blur-xl`}>
      {/* Gradient accent line */}
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
      
      {/* Logo & Brand */}
      <div className="relative p-5 border-b border-border/40">
        {/* Ambient gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo with gradient border */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Brand text with animation */}
            {!isCollapsed && (
              <div className="animate-slide-in-top">
                <h1 className="text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CMS Platform
                </h1>
                <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  VHV Platform
                </p>
              </div>
            )}
          </div>
          
          {/* Collapse Toggle */}
          <button 
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-muted/60 transition-all duration-200 group"
          >
            {isCollapsed ? (
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation with enhanced scrollbar */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenus.includes(item.id);
          const isItemActive = isActive(item.id);
          
          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <button
                onClick={() => {
                  if (hasSubmenu) {
                    toggleMenu(item.id);
                  } else {
                    onPageChange({ page: item.id });
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isItemActive && !hasSubmenu
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-foreground hover:bg-muted/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active indicator glow */}
                {isItemActive && !hasSubmenu && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-30" />
                )}
                
                <Icon className={`w-5 h-5 transition-all duration-200 relative z-10 ${
                  isItemActive && !hasSubmenu 
                    ? '' 
                    : 'group-hover:scale-110'
                }`} />
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left relative z-10">{item.label}</span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold relative z-10 ${
                        item.badge === 'NEW' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Submenu chevron */}
                    {hasSubmenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`} />
                    )}
                  </>
                )}
              </button>
              
              {/* Submenu with enhanced animation */}
              {hasSubmenu && isExpanded && !isCollapsed && (
                <div className="ml-3 mt-1 space-y-0.5 animate-slide-in-top">
                  {item.submenu!.map((subItem) => {
                    const SubIcon = subItem.icon || FileText;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => onPageChange({ page: item.id, subPage: subItem.id })}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm group relative overflow-hidden ${
                          isActive(item.id, subItem.id)
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50'
                            : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive(item.id, subItem.id) && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                        )}
                        
                        <SubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="flex-1">{subItem.label}</span>
                        
                        {/* Hover indicator */}
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* User Profile Section with enhanced design */}
      <div className="p-3 border-t border-border/40 relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent" />
        
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/40 transition-all duration-200 cursor-pointer group relative overflow-hidden ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          {/* Hover gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative">
            {/* Avatar with gradient border */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-semibold">AD</span>
              </div>
            </div>
            
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
            </div>
          </div>
          
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 relative z-10">
                <div className="text-foreground text-sm font-medium truncate">Admin User</div>
                <div className="text-muted-foreground text-xs truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Online
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all relative z-10" />
            </>
          )}
        </div>
        
        {/* Quick stats when expanded */}
        {!isCollapsed && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hoạt động hôm nay</span>
              <span className="font-semibold text-blue-700">24 tác vụ</span>
            </div>
          </div>
        )}
      </div>

      {/* Ambient gradient effects */}
      <div className="absolute -z-10 top-0 left-0 w-full h-48 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent blur-2xl" />
      <div className="absolute -z-10 bottom-0 left-0 w-full h-48 bg-gradient-to-t from-purple-500/10 via-pink-500/5 to-transparent blur-2xl" />
    </div>
  );
}