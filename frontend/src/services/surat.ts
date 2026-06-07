import api from './api';
import {
  SuratMasuk,
  SuratKeluar,
  SuratMasukRequest,
  SuratKeluarRequest,
  DashboardStats,
  FilterParams,
  MonthlyChartData,
} from '@/types';

export const suratService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getMonthlyChartData: async (): Promise<MonthlyChartData> => {
    const response = await api.get<MonthlyChartData>('/dashboard/chart/monthly');
    return response.data;
  },

  // Surat Masuk
  getSuratMasuk: async (params?: FilterParams): Promise<SuratMasuk[]> => {
    const response = await api.get<SuratMasuk[]>('/surat-masuk', { params });
    return response.data;
  },

  getSuratMasukById: async (id: number): Promise<SuratMasuk> => {
    const response = await api.get<SuratMasuk>(`/surat-masuk/${id}`);
    return response.data;
  },

  createSuratMasuk: async (data: SuratMasukRequest): Promise<SuratMasuk> => {
    const response = await api.post<SuratMasuk>('/surat-masuk', data);
    return response.data;
  },

  updateSuratMasuk: async (id: number, data: SuratMasukRequest): Promise<SuratMasuk> => {
    const response = await api.put<SuratMasuk>(`/surat-masuk/${id}`, data);
    return response.data;
  },

  deleteSuratMasuk: async (id: number): Promise<void> => {
    await api.delete(`/surat-masuk/${id}`);
  },

  batchDeleteSuratMasuk: async (ids: number[]): Promise<void> => {
    await api.post('/surat-masuk/batch-delete', ids);
  },

  // Surat Keluar
  getSuratKeluar: async (params?: FilterParams): Promise<SuratKeluar[]> => {
    const response = await api.get<SuratKeluar[]>('/surat-keluar', { params });
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

  deleteSuratKeluar: async (id: number): Promise<void> => {
    await api.delete(`/surat-keluar/${id}`);
  },

  batchDeleteSuratKeluar: async (ids: number[]): Promise<void> => {
    await api.post('/surat-keluar/batch-delete', ids);
  },

  // PDF Export
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
};
