import api from './api';

export interface InsightsResponse {
  performanceOverTime: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string }[] };
  growthSummary: { trend: number; scansAnalyzed: number; trendLabel: string };
  suggestions: { id: string; title: string; impact: string; priority: number }[];
}

export async function getInsights(): Promise<InsightsResponse> {
  const { data } = await api.get<InsightsResponse>('/insights');
  return data;
}
