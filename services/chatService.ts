import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  userId: string;
  scanId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const chatService = {
  getChat: async (scanId: string): Promise<Chat> => {
    const response = await api.get(`/chat/${scanId}`);
    return response.data;
  },

  sendMessage: async (scanId: string, message: string): Promise<Chat> => {
    const response = await api.post('/chat', { scanId, message });
    return response.data;
  },
};
