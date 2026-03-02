import api from './api';

export interface AISuggestionsResponse {
  scanId: string;
  suggestions: string[];
}

export const aiService = {
  generateSuggestions: async (scanId: string): Promise<AISuggestionsResponse> => {
    const response = await api.post<AISuggestionsResponse>('/ai/suggestions', { scanId });
    return response.data;
  },
};
