import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Opus Site Score',
  description: 'Opus Site Score privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
