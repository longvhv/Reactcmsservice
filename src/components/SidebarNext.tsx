'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, FolderTree, Image, Bot, BarChart3, Settings, 
  Shield, ChevronDown, Sparkles, Zap, Activity, Layers, Users, Calendar, 
  Package, ArrowLeft, ArrowRight, CheckCircle, Clock, Wand2, Lock, DollarSign 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { useRouter, usePathname } from '../contexts/RouterContext';

interface SidebarNextProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarNext({ isCollapsed = false, onToggleCollapse }: SidebarNextProps) {
  const { t } = useLanguage();
  const { isRoyaltyEnabled } = useSystemSettings();
  const router = useRouter();
  const pathname = usePathname();
  
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['crawler', 'users', 'royalty']);

  // Helper to handle navigation
  const handleNavigation = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    router.push(href);
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: t('menu.dashboard'), 
      icon: LayoutDashboard, 
      badge: null,
      href: '/page/cms/dashboard'
    },
    { 
      id: 'articles', 
      label: t('menu.articles'), 
      icon: FileText, 
      badge: '12',
      href: '/page/cms/articles'
    },
    { 
      id: 'categories', 
      label: t('menu.categories'), 
      icon: FolderTree, 
      badge: null,
      href: '/page/cms/categories'
    },
    { 
      id: 'event-series', 
      label: t('menu.eventSeries'), 
      icon: Activity, 
      badge: '4',
      href: '/page/cms/event-series'
    },
    { 
      id: 'permissions', 
      label: t('menu.permissions'), 
      icon: Shield, 
      badge: null,
      href: '/page/cms/permissions'
    },
    { 
      id: 'users', 
      label: t('menu.users'), 
      icon: Users, 
      badge: '8',
      submenu: [
        { id: 'list', label: t('users.submenu.list'), icon: Users, href: '/page/cms/users' },
        { id: 'roles', label: t('users.submenu.roles'), icon: Shield, href: '/page/cms/users/roles' },
        { id: 'groups', label: t('users.submenu.groups'), icon: Users, href: '/page/cms/users/groups' },
        { id: 'access-logs', label: t('users.submenu.accessLogs'), icon: Activity, href: '/page/cms/users/access-logs' },
        { id: 'security', label: t('users.submenu.security'), icon: Lock, href: '/page/cms/users/security' },
      ]
    },
    { 
      id: 'ai-tools', 
      label: t('menu.aiTools'), 
      icon: Wand2, 
      badge: 'HOT',
      href: '/page/cms/ai-tools'
    },
    { 
      id: 'media', 
      label: t('menu.media'), 
      icon: Image, 
      badge: null,
      href: '/page/cms/media'
    },
    { 
      id: 'content-moderation', 
      label: t('menu.moderation'), 
      icon: CheckCircle, 
      badge: '23',
      href: '/page/cms/moderation'
    },
    { 
      id: 'crawler', 
      label: t('menu.crawler'), 
      icon: Bot,
      badge: 'NEW',
      submenu: [
        { id: 'campaigns', label: t('crawler.submenu.campaigns'), icon: Package, href: '/page/cms/crawler' },
        { id: 'sources', label: t('crawler.submenu.sources'), icon: Layers, href: '/page/cms/crawler/sources' },
        { id: 'crawled', label: t('crawler.submenu.crawled'), icon: FileText, href: '/page/cms/crawler/articles' },
        { id: 'approved', label: t('crawler.submenu.approved'), icon: CheckCircle, href: '/page/cms/crawler/approved' },
      ]
    },
    { 
      id: 'analytics', 
      label: t('menu.analytics'), 
      icon: BarChart3, 
      badge: null,
      href: '/page/cms/analytics'
    },
    { 
      id: 'royalty', 
      label: t('menu.royalty'), 
      icon: DollarSign, 
      badge: 'NEW',
      submenu: [
        { id: 'royalty-management', label: t('royalty.submenu.management'), icon: Settings, href: '/page/cms/royalty-management' },
        { id: 'royalty-integration', label: t('royalty.submenu.integration'), icon: BarChart3, href: '/page/cms/royalty-integration' },
      ]
    },
    { 
      id: 'activity', 
      label: t('menu.activity'), 
      icon: Clock, 
      badge: null,
      href: '/page/cms/activity'
    },
    { 
      id: 'settings', 
      label: t('menu.settings'), 
      icon: Settings,
      href: '/page/cms/settings'
    },
  ];

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const isActive = (href?: string, submenuHrefs?: string[]) => {
    if (!href && !submenuHrefs) return false;
    
    if (href) {
      return pathname === href || pathname.startsWith(href + '/');
    }
    
    if (submenuHrefs) {
      return submenuHrefs.some(h => pathname === h || pathname.startsWith(h + '/'));
    }
    
    return false;
  };

  const getBadgeClasses = (badge: string) => {
    if (badge === 'NEW') {
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm';
    } else if (badge === 'HOT') {
      return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm animate-pulse';
    } else {
      return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className={`fixed left-0 top-0 bottom-0 ${isCollapsed ? 'w-20' : 'w-72'} glass-strong border-r border-border/40 flex flex-col z-30 transition-all duration-300 ease-in-out backdrop-blur-xl`}>
      {/* Gradient accent line */}
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
      
      {/* Logo & Brand */}
      <div className="relative p-5 border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        
        <div className="relative flex items-center justify-between">
          <button 
            onClick={(e) => handleNavigation('/page/cms/dashboard', e)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            
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
          </button>
          
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
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems
          .filter(item => {
            if (item.id === 'royalty' && !isRoyaltyEnabled) {
              return false;
            }
            return true;
          })
          .map((item) => {
          const Icon = item.icon;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenus.includes(item.id);
          const submenuHrefs = item.submenu?.map(sub => sub.href);
          const itemIsActive = isActive(item.href, submenuHrefs);
          
          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              {hasSubmenu ? (
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    itemIsActive
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-600/10 text-foreground'
                      : 'text-foreground hover:bg-muted/60'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 transition-all duration-200 relative z-10 ${
                    itemIsActive ? '' : 'group-hover:scale-110'
                  }`} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left relative z-10">{item.label}</span>
                      
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold relative z-10 ${getBadgeClasses(item.badge)}`}>
                          {item.badge}
                        </span>
                      )}
                      
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={(e) => handleNavigation(item.href!, e)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                    itemIsActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-foreground hover:bg-muted/60'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {itemIsActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-30" />
                  )}
                  
                  <Icon className={`w-5 h-5 transition-all duration-200 relative z-10 ${
                    itemIsActive ? '' : 'group-hover:scale-110'
                  }`} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left relative z-10">{item.label}</span>
                      
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold relative z-10 ${getBadgeClasses(item.badge)}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}
              
              {/* Submenu */}
              {hasSubmenu && isExpanded && !isCollapsed && (
                <div className="ml-3 mt-1 space-y-0.5 animate-slide-in-top">
                  {item.submenu!.map((subItem) => {
                    const SubIcon = subItem.icon || FileText;
                    const subIsActive = isActive(subItem.href);
                    
                    return (
                      <button
                        key={subItem.id}
                        onClick={(e) => handleNavigation(subItem.href, e)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm group relative overflow-hidden cursor-pointer ${
                          subIsActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50'
                            : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                        }`}
                      >
                        {subIsActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                        )}
                        
                        <SubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="flex-1 text-left">{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* Footer - User info can go here if needed */}
      <div className="p-4 border-t border-border/40">
        <div className="text-center text-xs text-muted-foreground">
          <p>VHV CMS v2.0</p>
        </div>
      </div>
    </div>
  );
}