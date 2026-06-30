'use client';

import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Scan } from '@/services/scanService';
import { format } from 'date-fns';

interface ScanTableProps {
  scans: Scan[];
}

// Tiered, accessible score badge — reads cleanly on a light surface
const scoreTier = (value: number) => {
  if (value >= 70) return { color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' };
  if (value >= 40) return { color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' };
  return { color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)' };
};

const ScoreBadge = ({ value }: { value: number }) => {
  const t = scoreTier(value);
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 38,
        px: 1,
        py: 0.25,
        borderRadius: '6px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: t.color,
        background: t.bg,
      }}
    >
      {value}
    </Box>
  );
};

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
          style={{ color: '#FC523F', textDecoration: 'none', fontWeight: 500 }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: 'performanceScore',
      headerName: 'Performance',
      width: 130,
      renderCell: (params) => <ScoreBadge value={params.value} />,
    },
    {
      field: 'seoScore',
      headerName: 'SEO Score',
      width: 130,
      renderCell: (params) => <ScoreBadge value={params.value} />,
    },
    {
      field: 'securityScore',
      headerName: 'Security',
      width: 130,
      renderCell: (params) => <ScoreBadge value={params.value} />,
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
          fontSize: '0.875rem',
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
          '& .MuiDataGrid-cell': {
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
            '&:focus, &:focus-within': { outline: 'none' },
          },
          '& .MuiDataGrid-columnHeaders': {
            borderColor: 'var(--border)',
            background: 'var(--bg-base)',
            color: 'var(--text-muted)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          },
          '& .MuiDataGrid-row': {
            '&:hover': { background: 'var(--overlay-02)' },
          },
          '& .MuiDataGrid-footerContainer': {
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          },
        }}
      />
    </Box>
  );
};

export default ScanTable;
