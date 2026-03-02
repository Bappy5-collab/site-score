import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | SiteScore AI',
  description: 'Join the SiteScore AI team. Open roles in engineering, product, and growth.',
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
