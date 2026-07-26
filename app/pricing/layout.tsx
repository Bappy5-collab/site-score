import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Opus Site Score',
  description: 'Simple, transparent pricing for Opus Site Score. Start free and upgrade when you need more scans and power.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
