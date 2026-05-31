'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { scanService, Scan } from '@/services/scanService';
import { exportService } from '@/services/exportService';

const ReportsPage = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await scanService.getMyScans();
      setScans(data);
    } catch (error) {
      console.error('Error loading scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (scanId: string, format: 'pdf' | 'json' | 'csv') => {
    try {
      setExporting((prev) => ({ ...prev, [scanId]: format }));
      switch (format) {
        case 'pdf':
          await exportService.exportPDF(scanId);
          break;
        case 'json':
          await exportService.exportJSON(scanId);
          break;
        case 'csv':
          await exportService.exportCSV(scanId);
          break;
      }
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExporting((prev) => {
        const newState = { ...prev };
        delete newState[scanId];
        return newState;
      });
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Reports & Export
            </Typography>
          </motion.div>

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
              <CircularProgress sx={{ color: '#8B5CF6' }} />
            </Paper>
          ) : scans.length === 0 ? (
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
                No scans available for export. Analyze a website first.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {scans.map((scan) => (
                <Grid item xs={12} md={6} lg={4} key={scan._id} sx={{ display: 'flex' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%' }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#F1F5F9' }}>
                        {scan.title || scan.url}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, color: '#94A3B8', fontSize: '0.75rem', wordBreak: 'break-all' }}
                      >
                        {scan.url}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={`Performance: ${scan.performanceScore}`}
                          size="small"
                          sx={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#8B5CF6',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                          }}
                        />
                        <Chip
                          label={`SEO: ${scan.seoScore}`}
                          size="small"
                          sx={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#22C55E',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                          }}
                        />
                        <Chip
                          label={`Security: ${scan.securityScore}`}
                          size="small"
                          sx={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#F59E0B',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        <Tooltip title="Export as PDF">
                          <IconButton
                            onClick={() => handleExport(scan._id, 'pdf')}
                            disabled={exporting[scan._id] === 'pdf'}
                            sx={{
                              background: 'rgba(244, 63, 94, 0.1)',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              color: '#F43F5E',
                              '&:hover': {
                                background: 'rgba(244, 63, 94, 0.2)',
                              },
                            }}
                          >
                            {exporting[scan._id] === 'pdf' ? (
                              <CircularProgress size={20} sx={{ color: '#F43F5E' }} />
                            ) : (
                              <PictureAsPdfIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export as JSON">
                          <IconButton
                            onClick={() => handleExport(scan._id, 'json')}
                            disabled={exporting[scan._id] === 'json'}
                            sx={{
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              color: '#8B5CF6',
                              '&:hover': {
                                background: 'rgba(139, 92, 246, 0.2)',
                              },
                            }}
                          >
                            {exporting[scan._id] === 'json' ? (
                              <CircularProgress size={20} sx={{ color: '#8B5CF6' }} />
                            ) : (
                              <DescriptionIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export as CSV">
                          <IconButton
                            onClick={() => handleExport(scan._id, 'csv')}
                            disabled={exporting[scan._id] === 'csv'}
                            sx={{
                              background: 'rgba(6, 182, 212, 0.1)',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              color: '#06B6D4',
                              '&:hover': {
                                background: 'rgba(6, 182, 212, 0.2)',
                              },
                            }}
                          >
                            {exporting[scan._id] === 'csv' ? (
                              <CircularProgress size={20} sx={{ color: '#06B6D4' }} />
                            ) : (
                              <TableChartIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default ReportsPage;
