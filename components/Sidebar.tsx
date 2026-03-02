'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GroupIcon from '@mui/icons-material/Group';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InsightsIcon from '@mui/icons-material/Insights';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ApiIcon from '@mui/icons-material/Api';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TimelineIcon from '@mui/icons-material/Timeline';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@/context/AuthContext';

const drawerWidth = 260;
const collapsedWidth = 80;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { text: 'Analyzer', icon: AssessmentIcon, path: '/analyzer' },
    { text: 'My Scans', icon: HistoryIcon, path: '/my-scans' },
    { text: 'AI Chat', icon: ChatIcon, path: '/ai-chat' },
    { text: 'Compare', icon: CompareArrowsIcon, path: '/compare' },
    { text: 'Team', icon: GroupIcon, path: '/team' },
    { text: 'Reports', icon: PictureAsPdfIcon, path: '/reports' },
    { text: 'Leaderboard', icon: EmojiEventsIcon, path: '/leaderboard' },
    { text: 'AI Growth Insights', icon: InsightsIcon, path: '/ai-growth-insights' },
    { text: 'Growth Brain', icon: PsychologyIcon, path: '/growth' },
    { text: 'Growth Copilot', icon: SmartToyIcon, path: '/growth-copilot' },
    { text: 'Automation Center', icon: ScheduleIcon, path: '/automation' },
    { text: 'API & Webhooks', icon: ApiIcon, path: '/api-webhooks' },
    { text: 'Billing', icon: CreditCardIcon, path: '/billing' },
    { text: 'Activity Timeline', icon: TimelineIcon, path: '/activity' },
    ...(isAdmin ? [{ text: 'Admin Panel', icon: AdminPanelSettingsIcon, path: '/admin' }] : []),
  ];

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
    setProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Profile Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProfileMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.1)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                sx={{ flex: 1, minWidth: 0 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#F1F5F9',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name || 'User'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {user?.email || ''}
                </Typography>
              </Box>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <ExpandMoreIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={profileMenuOpen}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              mt: 1,
              minWidth: 200,
            },
          }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              router.push('/profile');
              handleProfileMenuClose();
            }}
            sx={{
              color: '#F1F5F9',
              '&:hover': {
                background: 'rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
            View Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push('/settings');
              handleProfileMenuClose();
            }}
            sx={{
              color: '#F1F5F9',
              '&:hover': {
                background: 'rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
            Account Settings
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 0.5 }} />
          <MenuItem
            onClick={() => {
              handleLogout();
              handleProfileMenuClose();
            }}
            sx={{
              color: '#F43F5E',
              '&:hover': {
                background: 'rgba(244, 63, 94, 0.1)',
              },
            }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <List sx={{ pt: 2, px: 1, flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={collapsed && !isMobile ? item.text : ''} placement="right">
                  <ListItemButton
                    component={motion.div}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push(item.path);
                      if (isMobile && onMobileClose) onMobileClose();
                    }}
                    sx={{
                      borderRadius: '12px',
                      minHeight: 48,
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                      px: collapsed && !isMobile ? 1.5 : 2,
                      position: 'relative',
                      background: active
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                        : 'transparent',
                      border: active ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                      '&:hover': {
                        background: active
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        borderColor: active ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: active ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {active && (
                      <Box
                        component={motion.div}
                        layoutId="activeIndicator"
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: 24,
                          background: 'linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)',
                          borderRadius: '0 4px 4px 0',
                          boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)',
                        }}
                      />
                    )}
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed && !isMobile ? 0 : 40,
                        color: active ? '#8B5CF6' : '#94A3B8',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    <AnimatePresence>
                      {(!collapsed || isMobile) && (
                        <ListItemText
                          component={motion.div}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: active ? 600 : 500,
                            fontSize: '0.875rem',
                            color: active ? '#F1F5F9' : '#94A3B8',
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Logout button */}
        <List sx={{ px: 1, py: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={collapsed && !isMobile ? 'Logout' : ''} placement="right">
              <ListItemButton
                component={motion.div}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (isMobile && onMobileClose) onMobileClose();
                  handleLogout();
                }}
                sx={{
                  borderRadius: '12px',
                  minHeight: 48,
                  justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                  px: collapsed && !isMobile ? 1.5 : 2,
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 40, justifyContent: 'center', color: '#F87171' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <ListItemText
                      component={motion.div}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      primary="Logout"
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: '#F87171' }}
                    />
                  )}
                </AnimatePresence>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        <Box sx={{ p: 1 }}>
          {!isMobile && (
            <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
              <IconButton
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCollapsed(!collapsed)}
                sx={{
                  width: '100%',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#8B5CF6',
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose || (() => {})}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: Math.min(drawerWidth, 280),
            maxWidth: '85vw',
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={false}
      animate={{
        width: collapsed ? collapsedWidth : drawerWidth,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      sx={{
        flexShrink: 0,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        overflow: 'hidden',
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
