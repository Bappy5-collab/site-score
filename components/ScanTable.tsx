'use client';

import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Scan } from '@/services/scanService';
import { format } from 'date-fns';

interface ScanTableProps {
  scans: Scan[];
}

const ScanTable: React.FC<ScanTableProps> = ({ scans }) => {
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
          style={{ color: '#8B5CF6', textDecoration: 'none' }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: 'performanceScore',
      headerName: 'Performance',
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value >= 70 ? '#22C55E' : '#F59E0B' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'seoScore',
      headerName: 'SEO Score',
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value >= 70 ? '#22C55E' : '#F59E0B' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'securityScore',
      headerName: 'Security',
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value >= 70 ? '#22C55E' : '#F59E0B' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      renderCell: (params) => format(new Date(params.value), 'PPp'),
    },
  ];

  const rows = scans.map((scan) => ({
    id: scan._id,
    url: scan.url,
    performanceScore: scan.performanceScore,
    seoScore: scan.seoScore,
    securityScore: scan.securityScore,
    createdAt: scan.createdAt,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
            color: '#F1F5F9',
            '&:focus': {
              outline: 'none',
            },
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.05)',
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#94A3B8',
            fontWeight: 600,
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.05)',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
            color: '#94A3B8',
          },
        }}
      />
    </Box>
  );
};

export default ScanTable;
