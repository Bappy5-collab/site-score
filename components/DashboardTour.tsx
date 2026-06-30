'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { CallBackProps, Step } from 'react-joyride';

// react-joyride touches window/document, so load it client-side only.
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

const STORAGE_KEY = 'dashboardTourDone';

const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    title: 'Welcome to your dashboard 🎉',
    content: 'Quick 30-second tour so you know where everything lives. You can skip anytime.',
  },
  {
    target: '[data-tour="analyze"]',
    title: 'Analyze a new site',
    content: 'Start here. Paste any URL and SiteScore AI audits SEO, performance and security in one scan.',
  },
  {
    target: '[data-tour="stats"]',
    title: 'Your key metrics',
    content: 'These cards track your total scans and average Performance, SEO and Security scores at a glance.',
  },
  {
    target: '[data-tour="trends"]',
    title: 'Score trends',
    content: 'Watch how your scores move over time. Hover the chart to see exact values for each scan.',
  },
  {
    target: '[data-tour="recent"]',
    title: 'Recent scans',
    content: 'Your latest audits show up here so you can jump back into any report quickly.',
  },
  {
    target: '[data-tour="all-scans"]',
    title: 'All your scans',
    content: 'Every scan you run is stored here — open one to see the full breakdown and AI insights.',
  },
];

export default function DashboardTour({ enabled = true }: { enabled?: boolean }) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') {
        // Let the dashboard finish rendering its cards/charts before starting.
        const t = setTimeout(() => setRun(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, [enabled]);

  // Allow re-launching the tour on demand (e.g. a "Take a tour" button).
  useEffect(() => {
    const start = () => setRun(true);
    window.addEventListener('sitescore:start-tour', start);
    return () => window.removeEventListener('sitescore:start-tour', start);
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const finished = data.status === 'finished' || data.status === 'skipped';
    if (finished) {
      setRun(false);
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      disableScrollParentFix
      scrollToFirstStep
      callback={handleCallback}
      locale={{ back: 'Back', close: 'Close', last: 'Finish', next: 'Next', skip: 'Skip tour' }}
      styles={{
        options: {
          primaryColor: '#FC523F',
          backgroundColor: '#FFFFFF',
          arrowColor: '#FFFFFF',
          textColor: '#334155',
          overlayColor: 'rgba(5, 8, 20, 0.7)',
          zIndex: 13000,
        },
        tooltip: {
          borderRadius: 10,
          border: '1px solid rgba(15,23,42,0.08)',
          padding: 20,
        },
        tooltipTitle: {
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#0F172A',
        },
        tooltipContent: {
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: '#64748B',
          padding: '8px 0 0',
        },
        buttonNext: {
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '0.875rem',
          padding: '9px 18px',
          background: '#E13E2C',
        },
        buttonBack: {
          color: '#64748B',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        buttonSkip: {
          color: '#64748B',
          fontSize: '0.85rem',
        },
        spotlight: {
          borderRadius: 10,
        },
      }}
    />
  );
}
