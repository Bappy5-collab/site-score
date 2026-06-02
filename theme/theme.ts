import { createTheme } from '@mui/material/styles';

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

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F97316', // Orange - single brand/button color
      light: '#FB923C',
      dark: '#EA580C',
    },
    secondary: {
      main: '#F97316', // Unified to the single orange accent
      light: '#FB923C',
      dark: '#EA580C',
    },
    background: {
      default: '#0B1120',
      paper: '#111827',
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    dark: {
      main: '#1E293B',
      light: '#334155',
      dark: '#0F172A',
    },
    accent: {
      main: '#F97316', // Unified accent (orange)
      light: '#FB923C',
      dark: '#EA580C',
    },
  },
  typography: {
    fontFamily: '"Inter", "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '12px',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(249, 115, 22, 0.35)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '9px 20px',
          boxShadow: 'none',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#EA580C',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
          '&:hover': {
            backgroundColor: '#C2410C',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.45)',
          },
        },
        outlined: {
          borderColor: 'rgba(249, 115, 22, 0.5)',
          color: '#FB923C',
          '&:hover': {
            borderColor: '#F97316',
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
          },
        },
        text: {
          color: '#FB923C',
          '&:hover': {
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(249, 115, 22, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F97316',
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.12)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0F172A',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
