// Shim layer for Next.js Pages Router
// This file will handle all /page/cms/* routes when migrated to Next.js
// For now, it just imports and renders the main App from /app

import App from '../../../app/App';

export default function CMSPage() {
  return <App />;
}
