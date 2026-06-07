import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suratService } from '@/services/surat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, ChevronLeft, ChevronRight, Pencil, Download, Trash2 } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { SuratMasukForm } from './SuratMasukForm';
import { cn } from '@/lib/utils';

function getDateRange(filter: string) {
  const now = new Date();
  switch (filter) {
    case 'today':
      return { startDate: format(startOfDay(now), 'yyyy-MM-dd'), endDate: format(endOfDay(now), 'yyyy-MM-dd') };
    case 'week':
      return { startDate: format(startOfWeek(now), 'yyyy-MM-dd'), endDate: format(endOfWeek(now), 'yyyy-MM-dd') };
    case 'month':
      return { startDate: format(startOfMonth(now), 'yyyy-MM-dd'), endDate: format(endOfMonth(now), 'yyyy-MM-dd') };
    default:
      return {};
  }
}

export function SuratMasukList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const [dateFilter, setDateFilter] = useState('all');

  const { data: suratData, isLoading } = useQuery({
    queryKey: ['surat-masuk', search, status, sort, dateFilter, page],
    queryFn: () =>
      suratService.getSuratMasuk({
        search: search || undefined,
        status: status || undefined,
        sortBy: 'tanggal',
        sortDir: sort,
        page,
        size: pageSize,
        ...getDateRange(dateFilter),
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: suratService.deleteSuratMasuk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-masuk'] });
    },
  });

  const handleDownloadPdf = async (id: number) => {
    try {
      const blob = await suratService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surat-masuk-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const suratList = suratData?.content || [];
  const totalElements = suratData?.totalElements || 0;
  const totalPages = suratData?.totalPages || 0;
  const currentPage = suratData?.currentPage || 0;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getStatusDot = (statusValue: string) => {
    const colors: Record<string, string> = {
      RECEIVED: 'bg-green-500',
      ARCHIVED: 'bg-green-500',
      DRAFT: 'bg-gray-400',
    };
    return colors[statusValue] || 'bg-gray-400';
  };

  const getStatusLabel = (statusValue: string) => {
    const labels: Record<string, string> = {
      RECEIVED: 'Received',
      ARCHIVED: 'Archived',
      DRAFT: 'Draft',
    };
    return labels[statusValue] || statusValue;
  };

  if (showForm) {
    return (
      <SuratMasukForm
        id={editId}
        onClose={() => {
          setShowForm(false);
          setEditId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surat Masuk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola dan pantau semua dokumen surat masuk ke instansi.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Surat Masuk
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari nomor surat, perihal, pengirim..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Semua Tanggal</option>
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Semua Status</option>
          <option value="RECEIVED">Diterima</option>
          <option value="ARCHIVED">Disimpan</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="DESC">Terbaru</option>
          <option value="ASC">Terlama</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-12 px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">No. Surat</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Perihal</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Pengirim</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Tanggal</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : suratList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              suratList.map((surat) => (
                <tr
                  key={surat.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{surat.nomorSurat}</td>
                  <td className="px-4 py-3 text-gray-600">{surat.perihal}</td>
                  <td className="px-4 py-3 text-gray-600">{surat.pengirim}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {format(new Date(surat.tanggal), 'dd MMM yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(surat.status)}`} />
                      {getStatusLabel(surat.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditId(surat.id); setShowForm(true); }}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(surat.id)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-green-600"
                        title="Unduh PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus surat ini?')) {
                            deleteMutation.mutate(surat.id);
                          }
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalElements > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <span className="text-xs text-gray-500">
              Menampilkan {startItem}-{endItem} dari {totalElements} surat
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-md border p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-8 w-8 rounded-md text-sm font-medium ${
                    currentPage === i
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="rounded-md border p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
