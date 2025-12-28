/**
 * useCategoryTree Hook
 * Manages category tree state and operations
 */

import { useState, useMemo, useCallback } from 'react';
import type { Category, CategoryTreeNode } from '../types/category';
import type { ArticleType } from '../constants/article-types';

interface UseCategoryTreeOptions {
  initialCategories?: Category[];
  filterType?: ArticleType | 'all';
}

export function useCategoryTree(options: UseCategoryTreeOptions = {}) {
  const { initialCategories = [], filterType = 'all' } = options;

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Build tree structure
  const categoryTree = useMemo(() => {
    const filtered = filterType === 'all'
      ? categories
      : categories.filter(cat => cat.type === filterType);

    const buildTree = (parentId?: number): CategoryTreeNode[] => {
      return filtered
        .filter(cat => cat.parentId === parentId)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map(cat => ({
          ...cat,
          children: buildTree(cat.id),
          isExpanded: expandedIds.has(cat.id),
          isSelected: selectedId === cat.id,
        }));
    };

    return buildTree();
  }, [categories, filterType, expandedIds, selectedId]);

  // Flatten tree for easier operations
  const flatCategories = useMemo(() => {
    const flatten = (nodes: CategoryTreeNode[], level = 0): CategoryTreeNode[] => {
      return nodes.flatMap(node => [
        { ...node, level },
        ...flatten(node.children, level + 1),
      ]);
    };
    return flatten(categoryTree);
  }, [categoryTree]);

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(categories.map(cat => cat.id)));
  }, [categories]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const select = useCallback((id: number | null) => {
    setSelectedId(id);
  }, []);

  const findCategory = useCallback((id: number): Category | undefined => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  const findBySlug = useCallback((slug: string): Category | undefined => {
    return categories.find(cat => cat.slug === slug);
  }, [categories]);

  const getParentChain = useCallback((id: number): Category[] => {
    const chain: Category[] = [];
    let current = findCategory(id);

    while (current) {
      chain.unshift(current);
      current = current.parentId ? findCategory(current.parentId) : undefined;
    }

    return chain;
  }, [findCategory]);

  const getChildren = useCallback((id: number): Category[] => {
    return categories.filter(cat => cat.parentId === id);
  }, [categories]);

  const getAllDescendants = useCallback((id: number): Category[] => {
    const descendants: Category[] = [];
    const collect = (parentId: number) => {
      const children = getChildren(parentId);
      descendants.push(...children);
      children.forEach(child => collect(child.id));
    };
    collect(id);
    return descendants;
  }, [getChildren]);

  const canMove = useCallback((categoryId: number, newParentId?: number): boolean => {
    if (categoryId === newParentId) return false;
    if (!newParentId) return true;

    // Check if newParent is a descendant of category (would create circular reference)
    const descendants = getAllDescendants(categoryId);
    return !descendants.some(d => d.id === newParentId);
  }, [getAllDescendants]);

  const updateCategories = useCallback((newCategories: Category[]) => {
    setCategories(newCategories);
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories(prev => [...prev, category]);
  }, []);

  const updateCategory = useCallback((id: number, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  return {
    categories,
    categoryTree,
    flatCategories,
    expandedIds,
    selectedId,
    toggleExpand,
    expandAll,
    collapseAll,
    select,
    findCategory,
    findBySlug,
    getParentChain,
    getChildren,
    getAllDescendants,
    canMove,
    updateCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
