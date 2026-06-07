export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  fullName: string;
  role: string;
  message: string;
}

export interface SuratMasuk {
  id: number;
  nomorSurat: string;
  tanggal: string;
  pengirim: string;
  perihal: string;
  isiSingkat?: string;
  status: string;
  filePath?: string;
  createdByUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuratKeluar {
  id: number;
  nomorSurat: string;
  tanggal: string;
  penerima: string;
  perihal: string;
  isiSingkat?: string;
  status: string;
  filePath?: string;
  createdByUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuratMasukRequest {
  nomorSurat?: string;
  tanggal: string;
  pengirim: string;
  perihal: string;
  isiSingkat?: string;
  status?: string;
}

export interface SuratKeluarRequest {
  nomorSurat?: string;
  tanggal: string;
  penerima: string;
  perihal: string;
  isiSingkat?: string;
  status?: string;
}

export interface DashboardStats {
  totalSuratMasuk: number;
  totalSuratKeluar: number;
  suratMasukReceived: number;
  suratMasukArchived: number;
  suratKeluarDraft: number;
  suratKeluarSent: number;
  suratKeluarArchived: number;
}

export interface FilterParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface MonthlyChartData {
  months: MonthData[];
}

export interface MonthData {
  month: string;
  suratMasuk: number;
  suratKeluar: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  entityLabel: string;
  details: string;
  actor: string;
  timestamp: string;
}
