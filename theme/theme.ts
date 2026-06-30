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
    mode: 'light',
    primary: {
      main: '#FC523F', // Brand / button color
      light: '#FD7565',
      dark: '#E13E2C',
    },
    secondary: {
      main: '#FC523F', // Unified to the single brand accent
      light: '#FD7565',
      dark: '#E13E2C',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
    },
    warning: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#B45309',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
    },
    info: {
      main: '#0891B2',
      light: '#06B6D4',
      dark: '#0E7490',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    dark: {
      main: '#E2E8F0',
      light: '#F1F5F9',
      dark: '#CBD5E1',
    },
    accent: {
      main: '#FC523F', // Unified accent
      light: '#FD7565',
      dark: '#E13E2C',
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
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          border: '1px solid #E5E9F0',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(252, 82, 63, 0.4)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
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
          '&:hover': {
            boxShadow: 'none',
          },
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
          '&:hover': {
            backgroundColor: 'rgba(252, 82, 63, 0.06)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            background: '#FFFFFF',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '& fieldset': {
              borderColor: '#D8DEE9',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(252, 82, 63, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FC523F',
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.12)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#FFFFFF',
          border: '1px solid #E5E9F0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5E9F0',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          borderRight: '1px solid #E5E9F0',
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
