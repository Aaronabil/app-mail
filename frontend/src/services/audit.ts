import { AuditLog, PaginatedResponse } from '@/types';
import api from './api';

export const auditService = {
  getAuditLogs: async (params?: {
    search?: string;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get<PaginatedResponse<AuditLog>>('/audit-logs', { params });
    return response.data;
  },
};
