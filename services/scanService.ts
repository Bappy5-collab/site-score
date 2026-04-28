import api from './api';

// ── Core Web Vitals ──────────────────────────────────────────────────────────
export interface CoreWebVitals {
  lcp: number | null;   // ms  — Largest Contentful Paint
  cls: number | null;   // 0–1 — Cumulative Layout Shift
  inp: number | null;   // ms  — Interaction to Next Paint
}

export interface LighthouseMetrics {
  fcp: number | null;         // ms  — First Contentful Paint
  tti: number | null;         // ms  — Time to Interactive
  speedIndex: number | null;  // ms  — Speed Index
  tbt: number | null;         // ms  — Total Blocking Time
}

export interface LighthouseDisplayValues {
  lcp: string | null;
  cls: string | null;
  inp: string | null;
  fcp: string | null;
  tti: string | null;
  speedIndex: string | null;
  tbt: string | null;
}

export interface LighthouseResult {
  lighthouseScore: number;
  deviceType: 'desktop' | 'mobile';
  coreWebVitals: CoreWebVitals;
  metrics: LighthouseMetrics;
  displayValues: LighthouseDisplayValues;
  lighthouseIssues: string[];
  auditedAt: string;
}

// ── Scan ─────────────────────────────────────────────────────────────────────
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
  // Lighthouse fields (optional — populated after separate audit)
  lighthouseScore?: number | null;
  lighthouseDeviceType?: 'desktop' | 'mobile' | null;
  coreWebVitals?: CoreWebVitals;
  lighthouseMetrics?: LighthouseMetrics;
  lighthouseDisplayValues?: LighthouseDisplayValues;
  lighthouseAuditedAt?: string | null;
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

  runLighthouseAudit: async (
    url: string,
    deviceType: 'desktop' | 'mobile',
    scanId?: string
  ): Promise<LighthouseResult> => {
    const response = await api.post<LighthouseResult>('/scan/lighthouse', {
      url,
      deviceType,
      scanId,
    });
    return response.data;
  },

  getScanById: async (scanId: string): Promise<Scan> => {
    const response = await api.get<Scan>(`/scan/${scanId}`);
    return response.data;
  },
};
