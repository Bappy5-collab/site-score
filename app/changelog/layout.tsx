import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | SiteScore AI',
  description: 'Whats new in SiteScore AI — product updates, new features, and improvements.',
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
