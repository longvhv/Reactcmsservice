import { BrowserRouter as Router } from 'react-router-dom';
import { QueryProvider } from '@longvhv/query';
import { ThemeProvider } from '@longvhv/theme';
import { NotificationProvider } from '@longvhv/notifications';
import { AuthProvider } from '@longvhv/auth';
import { AppCore } from '@longvhv/core';
import { I18nProvider } from '@longvhv/i18n';
import { Layout } from '@/components/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './App.css';

// Import all modules - they will be auto-discovered
import dashboardModule from './modules/dashboard';
import articlesModule from './modules/articles';
import mediaModule from './modules/media';
import analyticsModule from './modules/analytics';
import usersModule from './modules/users';
import settingsModule from './modules/settings';

// Health check in development
if (import.meta.env.DEV) {
  import('./utils/healthCheck').then(({ runHealthCheck, printHealthCheck }) => {
    runHealthCheck().then(printHealthCheck);
  });
}

const modules = [
  dashboardModule,
  articlesModule,
  mediaModule,
  analyticsModule,
  usersModule,
  settingsModule,
];

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultMode={import.meta.env.VITE_DEFAULT_THEME || 'system'}>
        <I18nProvider defaultLanguage={import.meta.env.VITE_DEFAULT_LANGUAGE || 'vi'}>
          <QueryProvider>
            <NotificationProvider />
            <AuthProvider
              apiUrl={import.meta.env.VITE_API_URL || 'http://localhost:8080'}
              onLoginSuccess={() => {
                console.log('✅ Login successful');
              }}
              onLogoutSuccess={() => {
                console.log('👋 Logout successful');
              }}
            >
              <Router>
                <AppCore modules={modules}>
                  <Layout />
                </AppCore>
              </Router>
            </AuthProvider>
          </QueryProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;