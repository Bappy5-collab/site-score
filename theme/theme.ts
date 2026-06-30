import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    dark: {
      main: string;
      light: string;
      dark: string;
    };
    accent: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    dark?: {
      main: string;
      light: string;
      dark: string;
    };
    accent?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

export type ThemeMode = 'light' | 'dark';

// Per-mode design tokens — kept in sync with the CSS variables in globals.css.
const tokens = {
  light: {
    bgBase: '#F8FAFC',
    bgSurface: '#FFFFFF',
    bgElevated: '#F1F5F9',
    border: '#E5E9F0',
    borderStrong: '#D8DEE9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    inputBg: '#FFFFFF',
    appBar: 'rgba(255, 255, 255, 0.85)',
    drawer: '#FFFFFF',
    shadowSm: '0 1px 2px rgba(15, 23, 42, 0.04)',
    shadowMd: '0 4px 16px rgba(15, 23, 42, 0.08)',
    cardHoverBorder: 'rgba(252, 82, 63, 0.4)',
  },
  dark: {
    bgBase: '#0B1120',
    bgSurface: '#111827',
    bgElevated: '#1E293B',
    border: 'rgba(255, 255, 255, 0.07)',
    borderStrong: 'rgba(255, 255, 255, 0.12)',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    inputBg: 'rgba(255, 255, 255, 0.02)',
    appBar: 'rgba(17, 24, 39, 0.85)',
    drawer: '#0F172A',
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    shadowMd: '0 8px 24px rgba(0, 0, 0, 0.45)',
    cardHoverBorder: 'rgba(252, 82, 63, 0.35)',
  },
} as const;

export const createAppTheme = (mode: ThemeMode) => {
  const t = tokens[mode];

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: '#FC523F', // Brand / button color — identical in both modes
        light: '#FD7565',
        dark: '#E13E2C',
      },
      secondary: {
        main: '#FC523F',
        light: '#FD7565',
        dark: '#E13E2C',
      },
      background: {
        default: t.bgBase,
        paper: t.bgSurface,
      },
      success: {
        main: mode === 'light' ? '#16A34A' : '#22C55E',
        light: '#4ADE80',
        dark: '#15803D',
      },
      warning: {
        main: mode === 'light' ? '#D97706' : '#F59E0B',
        light: '#FBBF24',
        dark: '#B45309',
      },
      error: {
        main: mode === 'light' ? '#DC2626' : '#EF4444',
        light: '#F87171',
        dark: '#B91C1C',
      },
      info: {
        main: mode === 'light' ? '#0891B2' : '#06B6D4',
        light: '#22D3EE',
        dark: '#0E7490',
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textSecondary,
      },
      divider: t.border,
      dark: {
        main: mode === 'light' ? '#E2E8F0' : '#1E293B',
        light: mode === 'light' ? '#F1F5F9' : '#334155',
        dark: mode === 'light' ? '#CBD5E1' : '#0F172A',
      },
      accent: {
        main: '#FC523F',
        light: '#FD7565',
        dark: '#E13E2C',
      },
    },
    typography: {
      fontFamily: '"Inter", "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
      h2: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.3 },
      h3: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.4 },
      h4: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4 },
      h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.5 },
      h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
      body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.6 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: t.bgSurface,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: t.shadowSm,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: t.cardHoverBorder,
              boxShadow: t.shadowMd,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '9px 20px',
            boxShadow: 'none',
            transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            backgroundColor: '#FC523F',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(252, 82, 63, 0.3)',
            '&:hover': {
              backgroundColor: '#E13E2C',
              boxShadow: '0 4px 14px rgba(252, 82, 63, 0.4)',
            },
          },
          outlined: {
            borderColor: 'rgba(252, 82, 63, 0.5)',
            color: '#FC523F',
            '&:hover': {
              borderColor: '#FC523F',
              backgroundColor: 'rgba(252, 82, 63, 0.06)',
            },
          },
          text: {
            color: '#FC523F',
            '&:hover': { backgroundColor: 'rgba(252, 82, 63, 0.06)' },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
              background: t.inputBg,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              '& fieldset': { borderColor: t.borderStrong },
              '&:hover fieldset': { borderColor: 'rgba(252, 82, 63, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#FC523F', borderWidth: '1px' },
              '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.12)' },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: t.bgSurface,
            border: `1px solid ${t.border}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: t.appBar,
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${t.border}`,
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: t.drawer,
            borderRight: `1px solid ${t.border}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: '6px', fontWeight: 500 },
        },
      },
    },
  };

  return createTheme(options);
};

// Default export kept for any direct imports — light theme.
const theme = createAppTheme('light');
export default theme;
