import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | Opus Site Score',
  description: 'Whats new in Opus Site Score — product updates, new features, and improvements.',
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
