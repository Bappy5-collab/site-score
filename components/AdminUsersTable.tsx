'use client';

import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { adminService, User } from '@/services/adminService';
import { Alert, Snackbar, CircularProgress, Box } from '@mui/material';

const AdminUsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchUsers = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(pageNum + 1, 10);
      setUsers(response.users);
      setTotal(response.total);
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Failed to load users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      fetchUsers(page);
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete user', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value === 'admin' ? '#1976d2' : '#666' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
          disabled={params.row.role === 'admin'}
        />,
      ],
    },
  ];

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          paginationMode="server"
          page={page}
          pageSize={10}
          rowCount={total}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            fetchUsers(model.page);
          }}
          loading={loading}
        />
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default AdminUsersTable;
