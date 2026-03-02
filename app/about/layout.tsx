import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | SiteScore AI',
  description: 'Learn about SiteScore AI — the AI Growth Operating System that turns scan data into prioritized action plans.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
