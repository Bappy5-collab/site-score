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
import Logo from '@/components/Logo';

const drawerWidth = 260;
const collapsedWidth = 76;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  text: string;
  icon: React.ElementType;
  path: string;
}

interface NavSection {
  heading: string;
  items: NavItem[];
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
  const showLabels = !collapsed || isMobile;

  const sections: NavSection[] = [
    {
      heading: 'Overview',
      items: [
        { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
        { text: 'Activity', icon: TimelineIcon, path: '/activity' },
      ],
    },
    {
      heading: 'Analyze',
      items: [
        { text: 'Analyzer', icon: AssessmentIcon, path: '/analyzer' },
        { text: 'My Scans', icon: HistoryIcon, path: '/my-scans' },
        { text: 'Compare', icon: CompareArrowsIcon, path: '/compare' },
        { text: 'Reports', icon: PictureAsPdfIcon, path: '/reports' },
      ],
    },
    {
      heading: 'Growth',
      items: [
        { text: 'AI Chat', icon: ChatIcon, path: '/ai-chat' },
        { text: 'Growth Insights', icon: InsightsIcon, path: '/ai-growth-insights' },
        { text: 'Growth Brain', icon: PsychologyIcon, path: '/growth' },
        { text: 'Growth Copilot', icon: SmartToyIcon, path: '/growth-copilot' },
        { text: 'Automation', icon: ScheduleIcon, path: '/automation' },
        { text: 'Leaderboard', icon: EmojiEventsIcon, path: '/leaderboard' },
      ],
    },
    {
      heading: 'Workspace',
      items: [
        { text: 'Team', icon: GroupIcon, path: '/team' },
        { text: 'API & Webhooks', icon: ApiIcon, path: '/api-webhooks' },
        { text: 'Billing', icon: CreditCardIcon, path: '/billing' },
      ],
    },
    ...(isAdmin
      ? [
          {
            heading: 'Admin',
            items: [{ text: 'Admin Panel', icon: AdminPanelSettingsIcon, path: '/admin' }],
          },
        ]
      : []),
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

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
        <Tooltip title={collapsed && !isMobile ? item.text : ''} placement="right">
          <ListItemButton
            onClick={() => {
              router.push(item.path);
              if (isMobile && onMobileClose) onMobileClose();
            }}
            sx={{
              borderRadius: '8px',
              minHeight: 40,
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              px: collapsed && !isMobile ? 1.25 : 1.5,
              color: active ? '#F8FAFC' : '#94A3B8',
              background: active ? 'rgba(249, 115, 22, 0.14)' : 'transparent',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              '&:hover': {
                background: active ? 'rgba(249, 115, 22, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                color: '#F8FAFC',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 0 : 34,
                color: active ? '#FB923C' : 'inherit',
                justifyContent: 'center',
                '& svg': { fontSize: 20 },
              }}
            >
              <Icon />
            </ListItemIcon>
            {showLabels && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  color: 'inherit',
                  noWrap: true,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0F172A',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: showLabels ? 2.5 : 0,
          justifyContent: showLabels ? 'flex-start' : 'center',
          height: 64,
          flexShrink: 0,
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <Logo size={32} showText={showLabels} fontSize="1.05rem" />
      </Box>

      {/* Profile */}
      <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
        <Box
          onClick={handleProfileMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1,
            borderRadius: '8px',
            cursor: 'pointer',
            justifyContent: showLabels ? 'flex-start' : 'center',
            transition: 'background-color 0.15s ease',
            '&:hover': { background: 'rgba(255, 255, 255, 0.04)' },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              background: '#EA580C',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          {showLabels && (
            <>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {user?.name || 'User'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748B', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                >
                  {user?.email || ''}
                </Typography>
              </Box>
              <ExpandMoreIcon sx={{ color: '#64748B', fontSize: 18 }} />
            </>
          )}
        </Box>

        <Menu
          anchorEl={profileAnchorEl}
          open={profileMenuOpen}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
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
            sx={{ color: '#F1F5F9', fontSize: '0.875rem', '&:hover': { background: 'rgba(249, 115, 22, 0.1)' } }}
          >
            <PersonIcon sx={{ mr: 1.5, fontSize: 19 }} />
            View Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push('/settings');
              handleProfileMenuClose();
            }}
            sx={{ color: '#F1F5F9', fontSize: '0.875rem', '&:hover': { background: 'rgba(249, 115, 22, 0.1)' } }}
          >
            <SettingsIcon sx={{ mr: 1.5, fontSize: 19 }} />
            Account Settings
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 0.5 }} />
          <MenuItem
            onClick={() => {
              handleLogout();
              handleProfileMenuClose();
            }}
            sx={{ color: '#F87171', fontSize: '0.875rem', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
          >
            <LogoutIcon sx={{ mr: 1.5, fontSize: 19 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
          py: 1.5,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(148, 163, 184, 0.25)', borderRadius: '4px' },
        }}
      >
        {sections.map((section) => (
          <Box key={section.heading} sx={{ px: 1.25, mb: 1.5 }}>
            {showLabels && (
              <Typography
                sx={{
                  px: 1.5,
                  mb: 0.5,
                  color: '#475569',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {section.heading}
              </Typography>
            )}
            <List disablePadding>{section.items.map(renderNavItem)}</List>
          </Box>
        ))}
      </Box>

      {/* Logout + collapse */}
      <Box sx={{ p: 1.25, borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
        <Tooltip title={collapsed && !isMobile ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={() => {
              if (isMobile && onMobileClose) onMobileClose();
              handleLogout();
            }}
            sx={{
              borderRadius: '8px',
              minHeight: 40,
              mb: 0.5,
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              px: collapsed && !isMobile ? 1.25 : 1.5,
              color: '#94A3B8',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              '&:hover': { background: 'rgba(239, 68, 68, 0.1)', color: '#F87171' },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 34, justifyContent: 'center', color: 'inherit', '& svg': { fontSize: 20 } }}>
              <LogoutIcon />
            </ListItemIcon>
            {showLabels && (
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem', color: 'inherit' }} />
            )}
          </ListItemButton>
        </Tooltip>

        {!isMobile && (
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                width: '100%',
                color: '#64748B',
                borderRadius: '8px',
                '&:hover': { background: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8' },
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose || (() => {})}
        ModalProps={{ keepMounted: true }}
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
      sx={{
        flexShrink: 0,
        width: collapsed ? collapsedWidth : drawerWidth,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        overflow: 'hidden',
        transition: 'width 0.25s ease',
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
