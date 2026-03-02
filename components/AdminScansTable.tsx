'use client';

import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { adminService } from '@/services/adminService';
import { CircularProgress, Box } from '@mui/material';

interface ScanRow {
  id: string;
  url: string;
  performanceScore: number;
  seoScore: number;
  securityScore: number;
  userName: string;
  userEmail: string;
  createdAt: string;
}

const AdminScansTable: React.FC = () => {
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchScans = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await adminService.getScans(pageNum + 1, 10);
      setScans(
        response.scans.map((scan: any) => ({
          id: scan._id,
          url: scan.url,
          performanceScore: scan.performanceScore,
          seoScore: scan.seoScore,
          securityScore: scan.securityScore,
          userName: scan.userId?.name || 'N/A',
          userEmail: scan.userId?.email || 'N/A',
          createdAt: scan.createdAt,
        }))
      );
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load scans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans(0);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'url',
      headerName: 'URL',
      width: 300,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          {params.value}
        </a>
      ),
    },
    { field: 'userName', headerName: 'User', width: 150 },
    { field: 'userEmail', headerName: 'Email', width: 200 },
    {
      field: 'performanceScore',
      headerName: 'Performance',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value >= 70 ? '#2e7d32' : '#ed6c02' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'seoScore',
      headerName: 'SEO',
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value >= 70 ? '#2e7d32' : '#ed6c02' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'securityScore',
      headerName: 'Security',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value >= 70 ? '#2e7d32' : '#ed6c02' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  if (loading && scans.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={scans}
        columns={columns}
        paginationMode="server"
        page={page}
        pageSize={10}
        rowCount={total}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          fetchScans(model.page);
        }}
        loading={loading}
      />
    </div>
  );
};

export default AdminScansTable;
