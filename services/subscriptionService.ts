import api from './api';

export interface Subscription {
  plan: string;
  scansUsed: number;
  scansLimit: number;
  periodStartsAt: string;
  remaining: number;
}

export async function getSubscription(): Promise<Subscription> {
  const { data } = await api.get<Subscription>('/subscription');
  return data;
}

export async function updateSubscription(plan: 'Free' | 'Pro' | 'Business'): Promise<{ plan: string; scansLimit: number; scansUsed: number }> {
  const { data } = await api.post<{ plan: string; scansLimit: number; scansUsed: number }>('/subscription', { plan });
  return data;
}
