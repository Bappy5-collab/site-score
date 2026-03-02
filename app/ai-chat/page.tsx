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
                  background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
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
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      color: '#F1F5F9',
                      '&:hover': {
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                      },
                      '&.Mui-focused': {
                        borderColor: '#8B5CF6',
                      },
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                  }}
                >
                  <InputLabel sx={{ color: '#94A3B8' }}>Select Scan</InputLabel>
                  <Select
                    value={selectedScanId}
                    onChange={(e) => setSelectedScanId(e.target.value)}
                    label="Select Scan"
                    sx={{
                      color: '#F1F5F9',
                      '& .MuiSelect-icon': {
                        color: '#94A3B8',
                      },
                    }}
                  >
                    {scans.map((scan) => (
                      <MenuItem key={scan._id} value={scan._id} sx={{ color: '#F1F5F9' }}>
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
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Loading...
                </Typography>
              </Paper>
            ) : !selectedScanId ? (
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#F1F5F9' }}>
                  No Scans Available
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
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
