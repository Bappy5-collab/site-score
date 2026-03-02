import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SiteScore AI — AI Growth Operating System | Stop Reading Data, Start Growing',
  description:
    'Turn SEO and performance data into a prioritized action plan. Growth Brain, Smart Actions, Automation, Real-Time Alerts, and AI Copilot. Start free.',
  keywords: ['AI growth', 'SEO automation', 'website optimization', 'growth score', 'action plan', 'AI copilot', 'web performance'],
  openGraph: {
    title: 'SiteScore AI — AI Growth Operating System',
    description: 'Stop reading data. Start growing with AI. Get a prioritized action plan and real-time growth score.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SiteScore AI — AI Growth Operating System',
    description: 'Stop reading data. Start growing with AI.',
  },
  robots: 'index, follow',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
