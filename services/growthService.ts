import api from './api';

const BASE = '';

export interface GrowthScore {
  _id?: string;
  userId: string;
  overall: number;
  seo: number;
  performance: number;
  authority: number;
  content: number;
  lastCalculatedAt: string;
}

export interface GrowthInsight {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  status: string;
  sourceScanIds?: string[];
  createdAt: string;
}

export interface Action {
  _id: string;
  userId: string;
  growthInsightId?: string;
  title: string;
  description?: string;
  category: string;
  priority: number;
  completedAt: string | null;
  createdAt: string;
}

export interface GrowthPlanResponse {
  insights: GrowthInsight[];
  actions: Action[];
  score: GrowthScore;
}

export const growthService = {
  getGrowthPlan: async (): Promise<GrowthPlanResponse> => {
    const { data } = await api.get<GrowthPlanResponse>(`${BASE}/growth-plan`);
    return data;
  },
  getScore: async (): Promise<GrowthScore> => {
    const { data } = await api.get<GrowthScore>(`${BASE}/growth-score`);
    return data;
  },
  recalculateScore: async (): Promise<GrowthScore> => {
    const { data } = await api.post<GrowthScore>(`${BASE}/growth-score/recalculate`);
    return data;
  },
  getActions: async (completed?: boolean): Promise<Action[]> => {
    const { data } = await api.get<Action[]>(`${BASE}/action`, {
      params: completed !== undefined ? { completed: String(completed) } : {},
    });
    return data;
  },
  updateAction: async (id: string, body: { completed: boolean }): Promise<{ action: Action; score: GrowthScore; actions: Action[] }> => {
    const { data } = await api.patch<{ action: Action; score: GrowthScore; actions: Action[] }>(`${BASE}/action/${id}`, body);
    return data;
  },
};

export interface GrowthChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GrowthChat {
  _id: string;
  userId: string;
  messages: GrowthChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const growthChatService = {
  getChat: async (): Promise<GrowthChat> => {
    const { data } = await api.get<GrowthChat>(`${BASE}/growth-chat`);
    return data;
  },
  sendMessage: async (message: string): Promise<GrowthChat> => {
    const { data } = await api.post<GrowthChat>(`${BASE}/growth-chat`, { message });
    return data;
  },
};

export interface WeeklySummary {
  _id: string;
  userId: string;
  weekStart: string;
  summary: string;
  performanceDrop: boolean;
  previousWeekAvg?: number;
  currentWeekAvg?: number;
  createdAt: string;
}

export const weeklySummaryService = {
  getSummaries: async (limit?: number): Promise<WeeklySummary[]> => {
    const { data } = await api.get<WeeklySummary[]>(`${BASE}/weekly-summary`, {
      params: limit ? { limit } : {},
    });
    return data;
  },
};
