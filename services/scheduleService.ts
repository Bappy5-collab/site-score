import api from './api';

export interface ScheduledScan {
  _id: string;
  url: string;
  schedule: 'none' | 'daily' | 'weekly' | 'monthly';
  nextScanDate: string | null;
}

export const scheduleService = {
  updateSchedule: async (scanId: string, schedule: 'none' | 'daily' | 'weekly' | 'monthly'): Promise<any> => {
    const response = await api.patch(`/schedule/scan/${scanId}/schedule`, { schedule });
    return response.data;
  },

  getScheduledScans: async (): Promise<ScheduledScan[]> => {
    const response = await api.get('/schedule/scheduled');
    return response.data;
  },
};
