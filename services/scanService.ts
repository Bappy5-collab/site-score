import api from './api';

export interface Scan {
  _id: string;
  url: string;
  title: string;
  description: string;
  performanceScore: number;
  seoScore: number;
  securityScore: number;
  issues: string[];
  aiRecommendations?: string[];
  aiSummary?: string;
  aiSuggestions?: string[];
  screenshotUrl?: string;
  isBookmarked?: boolean;
  schedule?: 'none' | 'daily' | 'weekly' | 'monthly';
  nextScanDate?: string | null;
  createdAt: string;
}

export interface CreateScanData {
  url: string;
}

export interface DashboardStats {
  totalScans: number;
  avgPerformanceScore: number;
  avgSeoScore: number;
  avgSecurityScore: number;
}

export const scanService = {
  createScan: async (data: CreateScanData): Promise<Scan> => {
    const response = await api.post<Scan>('/scan', data);
    return response.data;
  },

  getMyScans: async (): Promise<Scan[]> => {
    const response = await api.get<Scan[]>('/scan/my-scans');
    return response.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/scan/stats');
    return response.data;
  },

  toggleBookmark: async (scanId: string): Promise<Scan> => {
    const response = await api.patch<Scan>(`/scan/${scanId}/bookmark`);
    return response.data;
  },

  getBookmarkedScans: async (): Promise<Scan[]> => {
    const response = await api.get<Scan[]>('/scan/bookmarked');
    return response.data;
  },

  generateReport: async (scanId: string): Promise<Blob> => {
    const response = await api.get(`/scan/${scanId}/report`, {
      responseType: 'blob',
    });
    return response.data;
  },

  captureScreenshot: async (url: string, scanId?: string): Promise<{ screenshotUrl: string }> => {
    const response = await api.post<{ screenshotUrl: string }>('/screenshot', { url, scanId });
    return response.data;
  },
};
