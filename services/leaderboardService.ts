import api from './api';

export interface LeaderboardEntry {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  totalScans: number;
  averageScore: number;
  averagePerformance: number;
  averageSEO: number;
  averageSecurity: number;
}

export const leaderboardService = {
  getLeaderboard: async (limit?: number): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/leaderboard', {
      params: { limit },
    });
    return response.data;
  },
};
