import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Opus Site Score',
  description: 'Join the Opus Site Score team. Open roles in engineering, product, and growth.',
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
