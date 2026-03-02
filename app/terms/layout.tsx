import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | SiteScore AI',
  description: 'SiteScore AI terms of service — use of the AI Growth Operating System.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
