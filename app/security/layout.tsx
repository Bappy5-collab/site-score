import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security | SiteScore AI',
  description: 'How SiteScore AI secures your data and our security practices.',
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
