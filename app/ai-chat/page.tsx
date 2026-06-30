'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ChatPanel from '@/components/ChatPanel';
import { scanService, Scan } from '@/services/scanService';

const AIChatPage = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  /** Selected scan ID, or 'general' when no scan (chat available for all). */
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    if (scans.length > 0 && !selectedScanId) {
      setSelectedScanId(scans[0]._id);
    } else if (scans.length === 0 && selectedScanId !== 'general') {
      setSelectedScanId('general');
    }
  }, [scans]);

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await scanService.getMyScans();
      setScans(data);
      if (data.length > 0) {
        setSelectedScanId((prev) => prev && prev !== 'general' ? prev : data[0]._id);
      } else {
        setSelectedScanId('general');
      }
    } catch (error) {
      console.error('Error loading scans:', error);
      setSelectedScanId('general');
    } finally {
      setLoading(false);
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
                AI Chat Assistant
              </Typography>

              {scans.length > 0 && (
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 300,
                    '& .MuiOutlinedInput-root': {
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      '&:hover': {
                        borderColor: 'rgba(252, 82, 63, 0.3)',
                      },
                      '&.Mui-focused': {
                        borderColor: '#FC523F',
                      },
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                  }}
                >
                  <InputLabel sx={{ color: 'var(--text-muted)' }}>Select Scan</InputLabel>
                  <Select
                    value={selectedScanId}
                    onChange={(e) => setSelectedScanId(e.target.value)}
                    label="Select Scan"
                    sx={{
                      color: 'var(--text-primary)',
                      '& .MuiSelect-icon': {
                        color: 'var(--text-muted)',
                      },
                    }}
                  >
                    {scans.map((scan) => (
                      <MenuItem key={scan._id} value={scan._id} sx={{ color: 'var(--text-primary)' }}>
                        {scan.url}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
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
                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                  Loading...
                </Typography>
              </Paper>
            ) : !selectedScanId ? (
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
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)' }}>
                  No Scans Available
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                  Please analyze a website first to start chatting with AI.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                <ChatPanel scanId={selectedScanId} />
              </Box>
            )}
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default AIChatPage;
