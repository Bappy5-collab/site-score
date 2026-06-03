import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features | SiteScore AI',
  description: 'Explore every feature of SiteScore AI — analyzer, Growth Brain, automation, AI copilot, reporting, and more.',
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
