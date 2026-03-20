// Shim layer for future Next.js Pages Router migration
// Redirects to /page/cms/dashboard

import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/page/cms/dashboard';
    }
  }, []);

  return null;
}
