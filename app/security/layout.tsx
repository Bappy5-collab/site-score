import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security | Opus Site Score',
  description: 'How Opus Site Score secures your data and our security practices.',
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
