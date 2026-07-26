import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Opus Site Score',
  description: 'Get in touch with Opus Site Score — support, sales, and partnership inquiries.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
