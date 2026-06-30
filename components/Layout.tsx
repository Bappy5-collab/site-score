'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 260;
const collapsedWidth = 76;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-base)',
          width: '100%',
        }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onCollapsedChange={setCollapsed}
        />

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            minWidth: 0,
            ml: { md: `${sidebarWidth}px` },
            transition: 'margin-left 0.25s ease',
          }}
        >
          <Navbar onOpenSidebar={() => setMobileOpen(true)} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              px: { xs: 1.5, sm: 2, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              width: '100%',
              maxWidth: '1400px',
              mx: 'auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              minWidth: 0,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'var(--overlay-04)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(252, 82, 63, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(252, 82, 63, 0.5)',
                },
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
  );
};

export default Layout;
