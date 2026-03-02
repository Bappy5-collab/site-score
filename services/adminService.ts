import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminScansResponse {
  scans: any[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminStats {
  totalUsers: number;
  totalScans: number;
  totalAdmins: number;
  recentScans: number;
  avgPerformance: number;
  avgSEO: number;
  avgSecurity: number;
}

export const adminService = {
  getUsers: async (page: number = 1, limit: number = 10): Promise<AdminUsersResponse> => {
    const response = await api.get<AdminUsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getScans: async (page: number = 1, limit: number = 10): Promise<AdminScansResponse> => {
    const response = await api.get<AdminScansResponse>(`/admin/scans?page=${page}&limit=${limit}`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/user/${userId}`);
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },
};
