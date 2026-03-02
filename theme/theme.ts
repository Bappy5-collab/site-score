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
      main: '#8B5CF6', // Purple
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    secondary: {
      main: '#EC4899', // Pink
      light: '#F472B6',
      dark: '#DB2777',
    },
    background: {
      default: '#0A0E27',
      paper: '#151932',
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
      main: '#F43F5E',
      light: '#FB7185',
      dark: '#E11D48',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
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
      main: '#06B6D4', // Cyan - New accent color
      light: '#22D3EE',
      dark: '#0891B2',
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
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.5)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(139, 92, 246, 0.3)',
            },
            '&.Mui-focused': {
              borderColor: '#8B5CF6',
              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
