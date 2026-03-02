'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/context/AuthContext';
import { notificationService, Notification } from '@/services/notificationService';
import { io, Socket } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface NavbarProps {
  onOpenSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [list, { count }] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount(),
        ]);
        setNotifications(list);
        setUnreadCount(count);
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('connect', () => socket.emit('join-user', user._id));
    socket.on('new-notification', (n: Notification) => {
      setNotifications((prev) => [n, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    socket.on('notification-read', (id: string) => {
      setNotifications((prev) => prev.map((o) => (o._id === id ? { ...o, read: true } : o)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });
    return () => {
      socket.emit('leave-user', user._id);
      socket.disconnect();
    };
  }, [user?._id]);

  const handleNotificationOpen = (e: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(e.currentTarget);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
    setNotificationOpen(false);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) router.push(notification.link);
    if (!notification.read) {
      notificationService.markAsRead(notification._id);
      setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    handleNotificationClose();
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Error marking all as read:', e);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          background: 'rgba(21, 25, 50, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
          width: '100%',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, sm: 2, md: 3 }, minHeight: { xs: 56, sm: 64 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2, md: 3 }, minWidth: 0 }}>
            {onOpenSidebar && (
              <IconButton
                onClick={onOpenSidebar}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: '#94A3B8',
                  '&:hover': { color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)' },
                }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            )}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ flexShrink: 0 }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' },
                }}
              >
                SiteScore AI
              </Typography>
            </motion.div>

            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                px: 2,
                py: 0.5,
                minWidth: 200,
                maxWidth: 300,
              }}
            >
              <SearchIcon sx={{ color: '#9CA3AF', mr: 1 }} />
              <InputBase
                placeholder="Search..."
                sx={{
                  color: '#F1F5F9',
                  flex: 1,
                  fontSize: '0.875rem',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 }, flexShrink: 0 }}>
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNotificationOpen}
              sx={{
                color: '#94A3B8',
                '&:hover': {
                  color: '#8B5CF6',
                  background: 'rgba(139, 92, 246, 0.1)',
                },
              }}
            >
              <Badge
                badgeContent={unreadCount > 0 ? unreadCount : 0}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
                    boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)',
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {user && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.75, sm: 1.5 },
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  px: { xs: 1, sm: 2 },
                  py: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: 0,
                  '&:hover': {
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    background: 'rgba(139, 92, 246, 0.05)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications dropdown - all actions show here */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={notificationOpen}
        onClose={handleNotificationClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            mt: 1.5,
            minWidth: 280,
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 420 },
            width: { xs: '90vw', sm: 'auto' },
            maxHeight: 'min(500px, 70vh)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                size="small"
                label={`${unreadCount} unread`}
                onClick={handleMarkAllAsRead}
                sx={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#8B5CF6',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
                }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <MenuItem
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      p: 2,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      background: notification.read ? 'transparent' : 'rgba(139, 92, 246, 0.05)',
                      '&:hover': { background: 'rgba(139, 92, 246, 0.1)' },
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.read ? 400 : 600,
                          color: '#F1F5F9',
                          mb: 0.5,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                          ml: 1,
                          flexShrink: 0,
                          boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
                        }}
                      />
                    )}
                  </MenuItem>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default Navbar;
