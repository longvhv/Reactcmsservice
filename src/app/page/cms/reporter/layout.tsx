import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reporter Portal | VHV CMS',
  description: 'Reporter Portal for content creators and journalists',
};

export default function ReporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
