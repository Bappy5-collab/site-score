import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API | SiteScore AI',
  description: 'Automate scans and integrate SiteScore AI into your own stack with a simple, powerful REST API and webhooks.',
};

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
