import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Opus Site Score',
  description: 'Learn about Opus Site Score — the AI Growth Operating System that turns scan data into prioritized action plans.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
