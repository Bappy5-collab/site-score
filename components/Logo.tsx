'use client';

import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useId } from 'react';

interface LogoProps {
  /** Size of the square mark in px */
  size?: number;
  /** Show the "SiteScore AI" wordmark next to the mark */
  showText?: boolean;
  /** Colour of the "SiteScore" part of the wordmark */
  textColor?: string;
  /** Wordmark font size (CSS value) */
  fontSize?: number | string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

/**
 * SiteScore AI brand logo — an orange "trending up" badge + wordmark.
 * Reusable across the app (sidebar, navbars, footers, auth, demo, favicon).
 */
export default function Logo({
  size = 34,
  showText = true,
  textColor = 'var(--text-primary)',
  fontSize,
  sx,
  onClick,
}: LogoProps) {
  const rawId = useId().replace(/:/g, '');
  const gid = `ss-logo-${rawId}`;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.1,
        cursor: onClick ? 'pointer' : 'inherit',
        userSelect: 'none',
        ...sx,
      }}
    >
      <Box
        component="svg"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        role="img"
        aria-label="SiteScore AI"
        sx={{ flexShrink: 0, display: 'block' }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FD7565" />
            <stop offset="1" stopColor="#E13E2C" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
        {/* upward trending line */}
        <path d="M8 27 L17 20 L23 24 L32 12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* arrow head */}
        <path d="M24 12 L32 12 L32 20" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </Box>

      {showText && (
        <Typography
          component="span"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: textColor,
            fontSize: fontSize ?? '1.15rem',
            whiteSpace: 'nowrap',
          }}
        >
          SiteScore
          <Box component="span" sx={{ color: '#FC523F' }}>
            {' '}
            AI
          </Box>
        </Typography>
      )}
    </Box>
  );
}
