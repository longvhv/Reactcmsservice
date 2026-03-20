// Router context for Figma Make compatibility
// Simulates Next.js routing behavior
// Will be replaced by Next.js routing when migrating

'use client';

import { createContext, useContext } from 'react';

interface RouterContextValue {
  navigate: (path: string, params?: Record<string, string>) => void;
  currentRoute: {
    path: string;
    params?: Record<string, string>;
  };
}

const RouterContext = createContext<RouterContextValue | null>(null);

export const RouterProvider = RouterContext.Provider;

export function useRouter() {
  const context = useContext(RouterContext);
  
  if (!context) {
    // Fallback for when used outside provider (e.g., in Next.js)
    return {
      push: (path: string) => {
        if (typeof window !== 'undefined') {
          window.location.href = path;
        }
      },
      back: () => {
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      },
      navigate: (path: string) => {
        if (typeof window !== 'undefined') {
          window.location.href = path;
        }
      },
    };
  }

  return {
    push: (path: string) => context.navigate(path),
    back: () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
    navigate: context.navigate,
  };
}

export function usePathname() {
  const context = useContext(RouterContext);
  
  if (!context) {
    // Fallback for Next.js
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  }

  return context.currentRoute.path;
}

export function useParams() {
  const context = useContext(RouterContext);
  
  if (!context) {
    return {};
  }

  return context.currentRoute.params || {};
}
