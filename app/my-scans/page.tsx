'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ScanTable from '@/components/ScanTable';
import { scanService, Scan } from '@/services/scanService';
import { useRouter } from 'next/navigation';

const MyScansPage = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    filterScans();
  }, [searchQuery, scans]);

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await scanService.getMyScans();
      setScans(data);
      setFilteredScans(data);
    } catch (error) {
      console.error('Error loading scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterScans = () => {
    if (!searchQuery.trim()) {
      setFilteredScans(scans);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = scans.filter(
      (scan) =>
        scan.url.toLowerCase().includes(query) ||
        scan.title.toLowerCase().includes(query) ||
        scan.description.toLowerCase().includes(query)
    );
    setFilteredScans(filtered);
  };

  const handleViewScan = (scanId: string) => {
    router.push(`/analyzer?scanId=${scanId}`);
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
                My Scans
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search scans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 300,
                    '& .MuiOutlinedInput-root': {
                      background: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      color: '#F1F5F9',
                      '&:hover': {
                        borderColor: 'rgba(249, 115, 22, 0.3)',
                      },
                      '&.Mui-focused': {
                        borderColor: '#F97316',
                      },
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#F1F5F9',
                      '&::placeholder': {
                        color: '#94A3B8',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: { xs: 120, md: 160 },
              py: 4,
            }}
          >
            <Button
              component={Link}
              href="/analyzer"
              variant="contained"
              startIcon={<AnalyticsIcon />}
              sx={{
                background: '#EA580C',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #EA580C 0%, #6D28D9 100%)',
                },
              }}
            >
              Analyzer
            </Button>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper
              sx={{
                p: 3,
                background: '#111827',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                  All Scans ({filteredScans.length})
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Loading scans...
                  </Typography>
                </Box>
              ) : filteredScans.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    {searchQuery ? 'No scans found matching your search.' : 'No scans yet. Start analyzing websites to see your scan history.'}
                  </Typography>
                </Box>
              ) : (
                <ScanTable scans={filteredScans} />
              )}
            </Paper>
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default MyScansPage;
