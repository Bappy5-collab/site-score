import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features | Opus Site Score',
  description: 'Explore every feature of Opus Site Score — analyzer, Growth Brain, automation, AI copilot, reporting, and more.',
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
