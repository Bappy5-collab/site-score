import api from './api';

export interface ActivityItem {
  _id: string;
  type: string;
  title: string;
  detail?: string;
  metadata?: Record<string, unknown>;
  link?: string;
  createdAt: string;
}

export async function getActivity(limit?: number): Promise<ActivityItem[]> {
  const { data } = await api.get<ActivityItem[]>('/activity', { params: limit ? { limit } : {} });
  return data;
}
