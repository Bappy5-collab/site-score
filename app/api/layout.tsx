import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API | Opus Site Score',
  description: 'Automate scans and integrate Opus Site Score into your own stack with a simple, powerful REST API and webhooks.',
};

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
