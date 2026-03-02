import api from './api';

export interface ComparisonResult {
  yourSite: {
    url: string;
    performanceScore: number;
    seoScore: number;
    securityScore: number;
    overallScore: number;
  };
  competitorSite: {
    url: string;
    performanceScore: number;
    seoScore: number;
    securityScore: number;
    overallScore: number;
  };
  insights: string[];
}

export const compareService = {
  compareWebsites: async (yourUrl: string, competitorUrl: string): Promise<ComparisonResult> => {
    const response = await api.post('/compare', { yourUrl, competitorUrl });
    return response.data;
  },
};
