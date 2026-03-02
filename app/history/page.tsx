'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ScanTable from '@/components/ScanTable';
import { scanService, Scan } from '@/services/scanService';
import { format } from 'date-fns';

const HistoryPage = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');

  useEffect(() => {
    const fetchScans = async () => {
      try {
        setLoading(true);
        const data = await scanService.getMyScans();
        setScans(data);
        setFilteredScans(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load scan history');
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  useEffect(() => {
    let filtered = scans;

    // Filter by bookmark status
    if (filter === 'bookmarked') {
      filtered = filtered.filter((scan) => scan.isBookmarked);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (scan) =>
          scan.url.toLowerCase().includes(query) ||
          scan.title.toLowerCase().includes(query) ||
          scan.description.toLowerCase().includes(query)
      );
    }

    setFilteredScans(filtered);
  }, [searchQuery, filter, scans]);

  const handleToggleBookmark = async (scanId: string) => {
    try {
      const updated = await scanService.toggleBookmark(scanId);
      setScans((prev) =>
        prev.map((scan) =>
          scan._id === scanId
            ? { ...scan, isBookmarked: updated.isBookmarked }
            : scan
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle bookmark');
    }
  };

  const handleDownloadReport = async (scanId: string) => {
    try {
      const blob = await scanService.generateReport(scanId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-report-${scanId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report');
    }
  };

  const totalScans = scans.length;
  const bookmarkedScans = scans.filter((s) => s.isBookmarked).length;

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Scan History
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Stats Cards */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Paper sx={{ p: 2, minWidth: 150 }}>
                <Typography variant="h6" color="primary">
                  {totalScans}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Scans
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, minWidth: 150 }}>
                <Typography variant="h6" color="primary">
                  {bookmarkedScans}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bookmarked
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, minWidth: 150 }}>
                <Typography variant="h6" color="primary">
                  {filteredScans.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing
                </Typography>
              </Paper>
            </Box>

            {/* Search and Filter */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  placeholder="Search by URL, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flexGrow: 1, minWidth: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="All"
                    onClick={() => setFilter('all')}
                    color={filter === 'all' ? 'primary' : 'default'}
                    variant={filter === 'all' ? 'filled' : 'outlined'}
                    clickable
                  />
                  <Chip
                    label="Bookmarked"
                    onClick={() => setFilter('bookmarked')}
                    color={filter === 'bookmarked' ? 'primary' : 'default'}
                    variant={filter === 'bookmarked' ? 'filled' : 'outlined'}
                    clickable
                  />
                </Box>
              </Box>
            </Paper>

            {/* Scans Table */}
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : filteredScans.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No scans found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery || filter === 'bookmarked'
                    ? 'Try adjusting your search or filter'
                    : 'Start by analyzing a website to see your scan history here'}
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ p: 2 }}>
                <ScanTable scans={filteredScans} />
              </Paper>
            )}

            {/* Detailed Scan Cards (Optional - can be expanded) */}
            {filteredScans.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Scans
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredScans.slice(0, 5).map((scan) => (
                    <Paper key={scan._id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            <a
                              href={scan.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1976d2', textDecoration: 'none' }}
                            >
                              {scan.url}
                            </a>
                          </Typography>
                          {scan.title && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {scan.title}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={`Performance: ${scan.performanceScore}`}
                              color={scan.performanceScore >= 70 ? 'success' : 'warning'}
                              size="small"
                            />
                            <Chip
                              label={`SEO: ${scan.seoScore}`}
                              color={scan.seoScore >= 70 ? 'success' : 'warning'}
                              size="small"
                            />
                            <Chip
                              label={`Security: ${scan.securityScore}`}
                              color={scan.securityScore >= 70 ? 'success' : 'warning'}
                              size="small"
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                              {format(new Date(scan.createdAt), 'PPp')}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={scan.isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleBookmark(scan._id)}
                              color={scan.isBookmarked ? 'primary' : 'default'}
                            >
                              {scan.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download PDF Report">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadReport(scan._id)}
                            >
                              <PictureAsPdfIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default HistoryPage;
