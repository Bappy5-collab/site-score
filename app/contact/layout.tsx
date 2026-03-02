import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | SiteScore AI',
  description: 'Get in touch with SiteScore AI — support, sales, and partnership inquiries.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
