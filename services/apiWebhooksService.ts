import api from './api';

export interface ApiKeyInfo {
  hasKey: boolean;
  keyPrefix: string | null;
}

export interface GenerateKeyResponse {
  apiKey: string;
  id: string;
  message: string;
}

export interface WebhookInfo {
  _id?: string;
  url: string;
  enabled: boolean;
}

export interface WebhookLogEntry {
  _id: string;
  method: string;
  endpoint: string;
  status?: number;
  error?: string;
  createdAt: string;
}

export async function getApiKeyInfo(): Promise<ApiKeyInfo> {
  const { data } = await api.get<ApiKeyInfo>('/api-webhooks/key');
  return data;
}

export async function generateApiKey(): Promise<GenerateKeyResponse> {
  const { data } = await api.post<GenerateKeyResponse>('/api-webhooks/key');
  return data;
}

export async function getWebhook(): Promise<WebhookInfo> {
  const { data } = await api.get<WebhookInfo>('/api-webhooks/webhook');
  return data;
}

export async function saveWebhook(url: string, enabled?: boolean): Promise<WebhookInfo> {
  const { data } = await api.post<WebhookInfo>('/api-webhooks/webhook', { url, enabled });
  return data;
}

export async function getLogs(): Promise<WebhookLogEntry[]> {
  const { data } = await api.get<WebhookLogEntry[]>('/api-webhooks/logs');
  return data;
}
