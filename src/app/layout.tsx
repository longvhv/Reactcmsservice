import { LanguageProvider } from '../contexts/LanguageContext';
import { SystemSettingsProvider } from '../contexts/SystemSettingsContext';
import '../styles/globals.css';

export const metadata = {
  title: 'CMS Admin - VHV Platform',
  description: 'Hệ thống quản lý nội dung',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <LanguageProvider>
          <SystemSettingsProvider>
            {children}
          </SystemSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
