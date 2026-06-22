import api from './api';
import {
  SuratMasuk,
  SuratKeluar,
  SuratKeluarRequest,
  DashboardStats,
  FilterParams,
  MonthlyChartData,
  PaginatedResponse,
} from '../types';

export const suratService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getMonthlyChartData: async (): Promise<MonthlyChartData> => {
    const response = await api.get<MonthlyChartData>('/dashboard/chart/monthly');
    return response.data;
  },

  getSuratMasuk: async (params?: FilterParams & { page?: number; size?: number }): Promise<PaginatedResponse<SuratMasuk>> => {
    const response = await api.get<PaginatedResponse<SuratMasuk>>('/surat-masuk', { params });
    return response.data;
  },

  getSuratMasukById: async (id: number): Promise<SuratMasuk> => {
    const response = await api.get<SuratMasuk>(`/surat-masuk/${id}`);
    return response.data;
  },

  createSuratMasuk: async (data: any): Promise<SuratMasuk> => {
    const response = await api.post<SuratMasuk>('/surat-masuk', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateSuratMasuk: async (id: number, data: any): Promise<SuratMasuk> => {
    const response = await api.put<SuratMasuk>(`/surat-masuk/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteSuratMasuk: async (id: number): Promise<void> => {
    await api.delete(`/surat-masuk/${id}`);
  },

  batchDeleteSuratMasuk: async (ids: number[]): Promise<void> => {
    await api.post('/surat-masuk/batch-delete', ids);
  },

  getSuratKeluar: async (params?: FilterParams & { page?: number; size?: number }): Promise<PaginatedResponse<SuratKeluar>> => {
    const response = await api.get<PaginatedResponse<SuratKeluar>>('/surat-keluar', { params });
    return response.data;
  },

  getSuratKeluarById: async (id: number): Promise<SuratKeluar> => {
    const response = await api.get<SuratKeluar>(`/surat-keluar/${id}`);
    return response.data;
  },

  createSuratKeluar: async (data: SuratKeluarRequest): Promise<SuratKeluar> => {
    const response = await api.post<SuratKeluar>('/surat-keluar', data);
    return response.data;
  },

  updateSuratKeluar: async (id: number, data: SuratKeluarRequest): Promise<SuratKeluar> => {
    const response = await api.put<SuratKeluar>(`/surat-keluar/${id}`, data);
    return response.data;
  },

  uploadSuratKeluarAttachment: async (id: number, file: File): Promise<SuratKeluar> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<SuratKeluar>(`/surat-keluar/${id}/attachment`, formData);
    return response.data;
  },

  deleteSuratKeluar: async (id: number): Promise<void> => {
    await api.delete(`/surat-keluar/${id}`);
  },

  batchDeleteSuratKeluar: async (ids: number[]): Promise<void> => {
    await api.post('/surat-keluar/batch-delete', ids);
  },

  exportSuratMasukPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/pdf/surat-masuk/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportSuratKeluarPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/pdf/surat-keluar/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportSuratMasukListPdf: async (ids?: number[]): Promise<Blob> => {
    const response = await api.post('/pdf/surat-masuk/batch', ids || [], {
      responseType: 'blob',
    });
    return response.data;
  },

  exportSuratKeluarListPdf: async (ids?: number[]): Promise<Blob> => {
    const response = await api.post('/pdf/surat-keluar/batch', ids || [], {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadPdf: async (id: number): Promise<Blob> => {
    return suratService.exportSuratMasukPdf(id);
  },

  downloadOriginalFile: async (id: number): Promise<Blob> => {
    const response = await api.get(`/surat-masuk/${id}/file`, {
      responseType: 'blob',
    });
    return response.data;
  
    
  },
  downloadSuratKeluarAttachment: async (id: number): Promise<Blob> => {
  const response = await api.get(`/surat-keluar/${id}/attachment`, {
    responseType: 'blob',
  });
  return response.data;
},
};
