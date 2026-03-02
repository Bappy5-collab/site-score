import api from './api';

export const exportService = {
  exportPDF: async (scanId: string): Promise<void> => {
    const response = await api.get(`/export/pdf/${scanId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scan-report-${scanId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportJSON: async (scanId: string): Promise<void> => {
    const response = await api.get(`/export/json/${scanId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scan-${scanId}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportCSV: async (scanId: string): Promise<void> => {
    const response = await api.get(`/export/csv/${scanId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scan-${scanId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
