'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Snackbar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { teamService, Team } from '@/services/teamService';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

const TeamPage = () => {
  const searchParams = useSearchParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteToken, setInviteToken] = useState<string>('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [newMemberNotification, setNewMemberNotification] = useState<{ name: string; email: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Check for invite token in URL
    const token = searchParams.get('token');
    if (token) {
      setInviteToken(token);
      setAcceptDialogOpen(true);
    } else {
      loadTeam();
    }
  }, [searchParams]);

  // Set up Socket.io for real-time updates
  useEffect(() => {
    if (!team?._id) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Join team room
    socket.emit('join-team', team._id);

    // Listen for new member added
    socket.on('member-added', (data: { team: Team; newMember: { name: string; email: string } }) => {
      setTeam(data.team);
      setNewMemberNotification({
        name: data.newMember.name,
        email: data.newMember.email,
      });
      setSuccess(`${data.newMember.name} joined the team!`);
    });

    // Cleanup on unmount
    return () => {
      socket.emit('leave-team', team._id);
      socket.disconnect();
    };
  }, [team?._id]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeam();
      setTeam(data);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      setError('');
      const newTeam = await teamService.createTeam('My Team');
      setTeam(newTeam);
      setSuccess('Team created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setError('');
      const response = await teamService.inviteMember(inviteEmail.trim());

      // Token-based invite flow: show the token/link to share.
      setShareToken(response.token);
      setInviteDialogOpen(false);
      setShowTokenDialog(true);
      setInviteEmail('');
      loadTeam();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invite');
    }
  };

  const handleAcceptInvite = async () => {
    if (!inviteToken.trim()) {
      setError('Please enter an invite token');
      return;
    }

    try {
      setError('');
      const updatedTeam = await teamService.acceptInvite(inviteToken.trim());
      setTeam(updatedTeam);
      setSuccess('Successfully joined team!');
      setInviteToken('');
      setAcceptDialogOpen(false);
      
      // Join the team room for real-time updates
      if (socketRef.current && updatedTeam._id) {
        socketRef.current.emit('join-team', updatedTeam._id);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to accept invite';
      setError(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', px: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Team Collaboration
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setAcceptDialogOpen(true)}
                  sx={{
                    borderColor: 'rgba(252, 82, 63, 0.3)',
                    color: '#FC523F',
                    '&:hover': {
                      borderColor: 'rgba(252, 82, 63, 0.5)',
                      background: 'rgba(252, 82, 63, 0.1)',
                    },
                  }}
                >
                  Accept Invite
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setInviteDialogOpen(true)}
                  disabled={!team}
                  sx={{
                    background: '#E13E2C',
                    '&:hover': {
                      background: '#C9341F',
                    },
                    '&:disabled': {
                      background: 'rgba(252, 82, 63, 0.3)',
                    },
                  }}
                >
                  Invite Member
                </Button>
              </Box>
            </Box>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                }}
                onClose={() => setSuccess('')}
              >
                {success}
              </Alert>
            </motion.div>
          )}

          {/* Real-time member notification */}
          <Snackbar
            open={!!newMemberNotification}
            autoHideDuration={5000}
            onClose={() => setNewMemberNotification(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setNewMemberNotification(null)}
              severity="info"
              sx={{
                background: 'rgba(252, 82, 63, 0.1)',
                border: '1px solid rgba(252, 82, 63, 0.3)',
                borderRadius: '8px',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                New member joined!
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                {newMemberNotification?.name} ({newMemberNotification?.email}) has joined the team
              </Typography>
            </Alert>
          </Snackbar>

          {loading ? (
            <Paper
              sx={{
                p: 3,
                background: 'var(--bg-surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                textAlign: 'center',
                py: 8,
              }}
            >
              <CircularProgress sx={{ color: '#FC523F' }} />
            </Paper>
          ) : !team ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper
                sx={{
                  p: 4,
                  background: 'var(--bg-surface)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)' }}>
                  No Team Found
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'var(--text-muted)' }}>
                  Create a team to start collaborating with others.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleCreateTeam}
                  sx={{
                    background: '#E13E2C',
                    '&:hover': {
                      background: '#C9341F',
                    },
                  }}
                >
                  Create Team
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper
                    sx={{
                      p: 3,
                      background: 'var(--bg-surface)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Team Members ({team.members?.length || 0})
                    </Typography>
                    <List>
                      <AnimatePresence>
                        {(team.members || []).map((member, index) => (
                          <motion.div
                            key={member.userId?._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ListItem
                              sx={{
                                mb: 1,
                                background: 'var(--overlay-04)',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    background: '#E13E2C',
                                  }}
                                >
                                  {member.userId?.name?.charAt(0) || 'U'}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={member.userId?.name || 'Unknown User'}
                                secondary={member.userId?.email || ''}
                                primaryTypographyProps={{ color: 'var(--text-primary)', fontWeight: 500 }}
                                secondaryTypographyProps={{ color: 'var(--text-muted)' }}
                              />
                              <Chip
                                label={member.role}
                                size="small"
                                sx={{
                                  background:
                                    member.role === 'admin'
                                      ? 'rgba(252, 82, 63, 0.2)'
                                      : 'rgba(6, 182, 212, 0.2)',
                                  color: member.role === 'admin' ? '#FC523F' : '#06B6D4',
                                  border: `1px solid ${member.role === 'admin' ? 'rgba(252, 82, 63, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
                                }}
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 3,
                      background: 'var(--bg-surface)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Team Info
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Name:</strong> {team.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Members:</strong> {team.members?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Created:</strong>{' '}
                      {new Date(team.createdAt).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Invite Dialog */}
          <Dialog
            open={inviteDialogOpen}
            onClose={() => setInviteDialogOpen(false)}
            PaperProps={{
              sx: {
                background: 'var(--bg-surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              },
            }}
          >
            <DialogTitle sx={{ color: 'var(--text-primary)' }}>Invite Team Member</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-muted)',
                  },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setInviteDialogOpen(false)} sx={{ color: 'var(--text-muted)' }}>
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                variant="contained"
                sx={{
                  background: '#E13E2C',
                  '&:hover': {
                    background: '#C9341F',
                  },
                }}
              >
                Send Invite
              </Button>
            </DialogActions>
          </Dialog>

          {/* Accept Invite Dialog */}
          <Dialog
            open={acceptDialogOpen}
            onClose={() => setAcceptDialogOpen(false)}
            PaperProps={{
              sx: {
                background: 'var(--bg-surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              },
            }}
          >
            <DialogTitle sx={{ color: 'var(--text-primary)' }}>Accept Team Invite</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Invite Token"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-muted)',
                  },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setAcceptDialogOpen(false)} sx={{ color: 'var(--text-muted)' }}>
                Cancel
              </Button>
              <Button
                onClick={handleAcceptInvite}
                variant="contained"
                sx={{
                  background: '#E13E2C',
                  '&:hover': {
                    background: '#C9341F',
                  },
                }}
              >
                Accept
              </Button>
            </DialogActions>
          </Dialog>

          {/* Token Display Dialog (when email fails) */}
          <Dialog
            open={showTokenDialog}
            onClose={() => setShowTokenDialog(false)}
            PaperProps={{
              sx: {
                background: 'var(--bg-surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                maxWidth: '500px',
              },
            }}
          >
            <DialogTitle sx={{ color: 'var(--text-primary)' }}>Share Invite</DialogTitle>
            <DialogContent>
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  background: 'rgba(252, 82, 63, 0.1)',
                  border: '1px solid rgba(252, 82, 63, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Send this token or link to your teammate. They can join from <strong>Team → Accept Invite</strong>, or just open the link.
              </Alert>
              <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                Invite Token:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  background: 'var(--overlay-04)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  mb: 2,
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                }}
              >
                {shareToken}
              </Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                Or share this link:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  background: 'var(--overlay-04)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  wordBreak: 'break-all',
                  fontSize: '0.875rem',
                  color: '#FC523F',
                }}
              >
                {typeof window !== 'undefined' && shareToken ? `${window.location.origin}/team?token=${shareToken}` : ''}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => {
                  if (shareToken) {
                    navigator.clipboard.writeText(shareToken);
                    setSuccess('Token copied to clipboard!');
                  }
                }}
                sx={{ color: 'var(--text-muted)' }}
              >
                Copy Token
              </Button>
              <Button
                onClick={() => {
                  if (shareToken && typeof window !== 'undefined') {
                    navigator.clipboard.writeText(`${window.location.origin}/team?token=${shareToken}`);
                    setSuccess('Invite link copied to clipboard!');
                  }
                }}
                sx={{ color: 'var(--text-muted)' }}
              >
                Copy Link
              </Button>
              <Button
                onClick={() => setShowTokenDialog(false)}
                variant="contained"
                sx={{
                  background: '#E13E2C',
                  '&:hover': {
                    background: '#C9341F',
                  },
                }}
              >
                Done
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

const TeamPageWrapper = () => {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#FC523F' }} />
      </Box>
    }>
      <TeamPage />
    </Suspense>
  );
};

export default TeamPageWrapper;
