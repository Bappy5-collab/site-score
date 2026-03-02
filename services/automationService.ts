import api from './api';

export interface Automation {
  _id: string;
  name: string;
  url: string;
  schedule: 'daily' | 'weekly';
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  lastScanId?: string;
  createdAt: string;
}

export async function getAutomations(): Promise<Automation[]> {
  const { data } = await api.get<Automation[]>('/automation');
  return data;
}

export async function createAutomation(body: { name: string; url: string; schedule?: 'daily' | 'weekly' }): Promise<Automation> {
  const { data } = await api.post<Automation>('/automation', body);
  return data;
}

export async function updateAutomation(id: string, body: { enabled?: boolean; name?: string; url?: string; schedule?: string }): Promise<Automation> {
  const { data } = await api.patch<Automation>(`/automation/${id}`, body);
  return data;
}

export async function deleteAutomation(id: string): Promise<void> {
  await api.delete(`/automation/${id}`);
}
