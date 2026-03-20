/**
 * ArticleManagement - Optimized Version
 * This is an example of how to refactor ArticleManagement using /lib utilities
 * 
 * BEFORE: ~500 lines with hardcoded values, repeated logic
 * AFTER: ~150 lines with reusable components and hooks
 */

import React, { useState } from 'react';
import { Plus, Wand2, Table, LayoutGrid, List, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import from centralized library
import {
  // Types
  type Article,
  type ArticleFilters,
  type ArticleSortConfig,
  
  // Constants
  ARTICLE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  
  // Components
  StatusBadge,
  ArticleTypeBadge,
  EmptyState,
  
  // Utils
  formatters,
} from '../lib';

interface ArticleManagementProps {
  onNavigate: (page: any) => void;
}

export function ArticleManagementOptimized({ onNavigate }: ArticleManagementProps) {
  const { t } = useLanguage();

  // State
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'grid'>('table');
  const [filters, setFilters] = useState<ArticleFilters>({
    search: '',
    type: 'all',
    status: 'all',
  });
  const [sort, setSort] = useState<ArticleSortConfig>({
    field: 'createdAt',
    order: 'desc',
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Mock data - in real app, this would come from API/state management
  const articles: Article[] = [
    {
      id: 1,
      title: 'CMS Development Best Practices',
      slug: 'cms-development-best-practices',
      content: '...',
      type: 'news',
      status: 'published',
      author: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1234,
      likes: 56,
      comments: 12,
    },
    // ... more articles
  ];

  // Handlers
  const handleCreateNew = () => {
    onNavigate({ page: 'article-detail', id: 0 }); // 0 = new article
  };

  const handleEdit = (id: number) => {
    onNavigate({ page: 'article-detail', id });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmations.deleteArticle'))) return;
    // API call to delete
    console.log('Delete article:', id);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} articles?`)) return;
    // API call to bulk delete
    console.log('Bulk delete:', selectedIds);
    setSelectedIds([]);
  };

  // Filtering and sorting
  const filteredArticles = articles.filter(article => {
    if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && article.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'all' && article.status !== filters.status) {
      return false;
    }
    return true;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    const order = sort.order === 'asc' ? 1 : -1;
    return aVal > bVal ? order : -order;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('articles.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('articles.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate({ page: 'ai-tools' })}
            className="px-4 py-2.5 border border-border rounded-xl hover:bg-muted/50 transition-all flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {t('aiTools.title')}
          </button>
          
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('articles.createNew')}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder={t('placeholders.searchArticles')}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">-- Loại bài viết --</option>
            {ARTICLE_TYPE_OPTIONS.map(type => (
              <option key={type.value} value={type.value}>
                {t(type.labelKey)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">-- Trạng thái --</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {t(status.labelKey)}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} {t('common.selected')}
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              {t('actions.delete')}
            </button>
          </div>
        )}
      </div>

      {/* Articles List/Table/Grid */}
      {sortedArticles.length === 0 ? (
        <EmptyState
          title={t('articles.noArticles')}
          description={t('articles.noArticlesDesc')}
          action={{
            label: t('articles.createNew'),
            onClick: handleCreateNew,
            icon: Plus,
          }}
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {viewMode === 'table' && (
            <ArticleTable
              articles={sortedArticles}
              selectedIds={selectedIds}
              onToggleSelect={(id) => {
                setSelectedIds(prev =>
                  prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                );
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {viewMode === 'list' && (
            <ArticleList
              articles={sortedArticles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {viewMode === 'grid' && (
            <ArticleGrid
              articles={sortedArticles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Sub-components using lib utilities

function ArticleTable({ articles, selectedIds, onToggleSelect, onEdit, onDelete }: any) {
  const { t } = useLanguage();

  return (
    <table className="w-full">
      <thead className="bg-secondary border-b border-border">
        <tr>
          <th className="px-4 py-3 text-left w-12">
            <input type="checkbox" className="rounded" />
          </th>
          <th className="px-4 py-3 text-left font-semibold">{t('articles.title')}</th>
          <th className="px-4 py-3 text-left font-semibold">{t('articles.type')}</th>
          <th className="px-4 py-3 text-left font-semibold">{t('articles.status')}</th>
          <th className="px-4 py-3 text-left font-semibold">{t('articles.author')}</th>
          <th className="px-4 py-3 text-left font-semibold">{t('articles.date')}</th>
          <th className="px-4 py-3 text-left font-semibold">{t('articles.views')}</th>
          <th className="px-4 py-3 text-right font-semibold">{t('common.actions')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {articles.map((article: Article) => (
          <tr key={article.id} className="hover:bg-secondary/50 transition-colors">
            <td className="px-4 py-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(article.id)}
                onChange={() => onToggleSelect(article.id)}
                className="rounded"
              />
            </td>
            <td className="px-4 py-4">
              <button
                onClick={() => onEdit(article.id)}
                className="font-semibold hover:text-blue-600 transition-colors text-left"
              >
                {article.title}
              </button>
            </td>
            <td className="px-4 py-4">
              <ArticleTypeBadge type={article.type} size="sm" />
            </td>
            <td className="px-4 py-4">
              <StatusBadge status={article.status} size="sm" />
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {article.author}
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {formatters.relativeTime(article.createdAt)}
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {formatters.number(article.views || 0)}
            </td>
            <td className="px-4 py-4 text-right">
              <button
                onClick={() => onDelete(article.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                {t('actions.delete')}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ArticleList({ articles, onEdit, onDelete }: any) {
  return (
    <div className="divide-y divide-border">
      {articles.map((article: Article) => (
        <div key={article.id} className="p-4 hover:bg-secondary/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={article.status} size="sm" />
                <ArticleTypeBadge type={article.type} size="sm" />
              </div>
              <h3
                onClick={() => onEdit(article.id)}
                className="font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors"
              >
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {article.author} • {formatters.relativeTime(article.createdAt)} • {formatters.number(article.views || 0)} views
              </p>
            </div>
            <button
              onClick={() => onDelete(article.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleGrid({ articles, onEdit, onDelete }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {articles.map((article: Article) => (
        <div
          key={article.id}
          className="border border-border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => onEdit(article.id)}
        >
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={article.status} size="sm" />
            <ArticleTypeBadge type={article.type} size="sm" />
          </div>
          <h3 className="font-semibold mb-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {formatters.truncate(article.excerpt || article.content, 100)}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatters.relativeTime(article.createdAt)}</span>
            <span>{formatters.number(article.views || 0)} views</span>
          </div>
        </div>
      ))}
    </div>
  );
}