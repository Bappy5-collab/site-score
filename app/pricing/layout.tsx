import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | SiteScore AI',
  description: 'Simple, transparent pricing for SiteScore AI. Start free and upgrade when you need more scans and power.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
