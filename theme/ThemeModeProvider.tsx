'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme, ThemeMode } from './theme';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  toggleMode: () => {},
  setMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

const STORAGE_KEY = 'theme-mode';

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  // Default is light. The inline script in layout.tsx sets data-theme before
  // paint so there is no flash; here we read back the persisted value on mount.
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'dark' || stored === 'light') setModeState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setMode: setModeState,
      toggleMode: () => setModeState((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
