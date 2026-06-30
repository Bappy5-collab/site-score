'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A thin top progress bar that animates during client-side navigation.
 * - Starts when a navigation is triggered (link click, router.push, back/forward).
 * - Completes when the new route (pathname) commits.
 * No external dependencies; mounted once in the root layout.
 */
export default function TopLoader() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const rampRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const clearTimers = () => {
    if (rampRef.current) clearInterval(rampRef.current);
    if (doneRef.current) clearTimeout(doneRef.current);
    rampRef.current = null;
    doneRef.current = null;
  };

  const begin = useCallback(() => {
    clearTimers();
    setWidth(10);
    // Ease toward 90% while the next route loads.
    rampRef.current = setInterval(() => {
      setWidth((w) => (w >= 90 ? w : w + (90 - w) * 0.12));
    }, 180);
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setWidth(100);
    doneRef.current = setTimeout(() => setWidth(0), 320);
  }, []);

  // Complete the bar whenever the committed route changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    finish();
  }, [pathname, finish]);

  // Start the bar on navigation intent (clicks, programmatic push, back/forward).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');
      if (!href || target === '_blank' || anchor.hasAttribute('download')) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
        begin();
      } catch {
        /* ignore malformed hrefs */
      }
    };

    // Patch history so programmatic navigation (router.push/replace) also starts the bar.
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      begin();
      return origPush.apply(this, args as Parameters<typeof origPush>);
    };
    history.replaceState = function (...args) {
      return origReplace.apply(this, args as Parameters<typeof origReplace>);
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', begin);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', begin);
      history.pushState = origPush;
      history.replaceState = origReplace;
      clearTimers();
    };
  }, [begin]);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        width: `${width}%`,
        zIndex: 2000,
        background: 'linear-gradient(90deg, #FC523F, #FD7565)',
        boxShadow: '0 0 10px rgba(252, 82, 63, 0.7), 0 0 4px rgba(252, 82, 63, 0.5)',
        borderRadius: '0 2px 2px 0',
        opacity: width === 0 ? 0 : 1,
        transition: 'width 0.2s ease, opacity 0.3s ease',
        pointerEvents: 'none',
      }}
    />
  );
}
