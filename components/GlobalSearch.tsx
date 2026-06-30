'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, InputBase, Popper, Paper, ClickAwayListener, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import BoltIcon from '@mui/icons-material/Bolt';
import { scanService, Scan } from '@/services/scanService';

interface PageItem {
  label: string;
  path: string;
  keywords: string;
}

const PAGES: PageItem[] = [
  { label: 'Dashboard', path: '/dashboard', keywords: 'home overview stats' },
  { label: 'Activity', path: '/activity', keywords: 'timeline history log' },
  { label: 'Analyzer', path: '/analyzer', keywords: 'scan audit analyze new site url' },
  { label: 'My Scans', path: '/my-scans', keywords: 'scans history results' },
  { label: 'Compare', path: '/compare', keywords: 'compare sites diff versus' },
  { label: 'Reports', path: '/reports', keywords: 'pdf export report' },
  { label: 'AI Chat', path: '/ai-chat', keywords: 'chat assistant ai ask' },
  { label: 'Growth Insights', path: '/ai-growth-insights', keywords: 'insights opportunities ai' },
  { label: 'Growth Brain', path: '/growth', keywords: 'plan actions growth brain' },
  { label: 'Growth Copilot', path: '/growth-copilot', keywords: 'copilot assistant guide' },
  { label: 'Automation', path: '/automation', keywords: 'schedule automate cron' },
  { label: 'Leaderboard', path: '/leaderboard', keywords: 'rank leaderboard score' },
  { label: 'Team', path: '/team', keywords: 'team members collaborate invite' },
  { label: 'API & Webhooks', path: '/api-webhooks', keywords: 'api keys webhooks integrate' },
  { label: 'Billing', path: '/billing', keywords: 'billing plan invoice subscription' },
  { label: 'Profile', path: '/profile', keywords: 'profile account me' },
  { label: 'Settings', path: '/settings', keywords: 'settings preferences config' },
];

type ResultItem =
  | { kind: 'scan-url'; label: string; sublabel: string; action: () => void }
  | { kind: 'page'; label: string; sublabel: string; action: () => void }
  | { kind: 'scan'; label: string; sublabel: string; action: () => void };

const looksLikeUrl = (q: string) => /^[^\s]+\.[a-z]{2,}/i.test(q.trim());

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [scans, setScans] = useState<Scan[]>([]);
  const [scansLoaded, setScansLoaded] = useState(false);
  const [active, setActive] = useState(0);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  // Lazy-load the user's scans the first time the box is focused.
  const ensureScans = useCallback(async () => {
    if (scansLoaded) return;
    setScansLoaded(true);
    try {
      const data = await scanService.getMyScans();
      setScans(data);
    } catch {
      /* ignore — search still works for pages */
    }
  }, [scansLoaded]);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery('');
      router.push(path);
    },
    [router]
  );

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const items: ResultItem[] = [];

    if (looksLikeUrl(query)) {
      const clean = query.trim();
      items.push({
        kind: 'scan-url',
        label: `Scan “${clean}”`,
        sublabel: 'Run a new audit',
        action: () => go(`/analyzer?url=${encodeURIComponent(clean)}`),
      });
    }

    if (q) {
      PAGES.filter((p) => p.label.toLowerCase().includes(q) || p.keywords.includes(q))
        .slice(0, 6)
        .forEach((p) =>
          items.push({ kind: 'page', label: p.label, sublabel: 'Page', action: () => go(p.path) })
        );

      scans
        .filter((s) => s.url?.toLowerCase().includes(q) || s.title?.toLowerCase().includes(q))
        .slice(0, 6)
        .forEach((s) =>
          items.push({
            kind: 'scan',
            label: s.title || s.url,
            sublabel: s.url,
            action: () => {
              setOpen(false);
              setQuery('');
              window.open(s.url, '_blank', 'noopener,noreferrer');
            },
          })
        );
    } else {
      // Empty query → show quick links
      PAGES.slice(0, 5).forEach((p) =>
        items.push({ kind: 'page', label: p.label, sublabel: 'Page', action: () => go(p.path) })
      );
    }

    return items;
  }, [query, scans, go]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[active]?.action();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const iconFor = (kind: ResultItem['kind']) => {
    if (kind === 'scan-url') return <BoltIcon sx={{ fontSize: 18, color: '#FC523F' }} />;
    if (kind === 'scan') return <LanguageIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />;
    return <NorthEastIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />;
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '100%', maxWidth: 360 }}>
        <Box
          ref={anchorRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--overlay-03)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            px: 1.5,
            py: 0.5,
            transition: 'border-color 0.15s ease',
            '&:focus-within': { borderColor: 'rgba(252, 82, 63, 0.5)' },
          }}
        >
          <SearchIcon sx={{ color: 'var(--text-muted)', mr: 1 }} />
          <InputBase
            placeholder="Search pages, scans, or type a URL…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              ensureScans();
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            sx={{
              color: 'var(--text-primary)',
              flex: 1,
              fontSize: '0.875rem',
              '& input::placeholder': { color: 'var(--text-muted)', opacity: 1 },
            }}
          />
        </Box>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
          modifiers={[{ name: 'offset', options: { offset: [0, 6] } }]}
        >
          <Paper
            sx={{
              background: 'var(--bg-surface)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-strong)',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              maxHeight: 420,
              overflowY: 'auto',
            }}
          >
            {results.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                  No matches for “{query}”
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 0.75 }}>
                {results.map((r, i) => (
                  <Box
                    key={`${r.kind}-${r.label}-${i}`}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      r.action();
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      px: 1.75,
                      py: 1.1,
                      cursor: 'pointer',
                      background: i === active ? 'rgba(252, 82, 63, 0.12)' : 'transparent',
                    }}
                  >
                    <Box sx={{ width: 24, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                      {iconFor(r.kind)}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {r.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                      >
                        {r.sublabel}
                      </Typography>
                    </Box>
                    {i === active && (
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                        ↵
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
