import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suratService } from '@/services/surat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Download, Trash2, Eye } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { SuratMasukForm } from './SuratMasukForm';
import { SuratMasukDetail } from '@/components/SuratMasukDetail'; 
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
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const [dateFilter, setDateFilter] = useState('all');

  const { data: suratData, isLoading } = useQuery({
    queryKey: ['surat-surat-masuk', search, status, sort, dateFilter, page],
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
      queryClient.invalidateQueries({ queryKey: ['surat-surat-masuk'] });
      setSelectedIds([]);
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

  const handleSelectAll = (checked: boolean) => {
    if (checked && suratList.length > 0) {
      const allIds = suratList.map((surat: any) => surat.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const statusConfig: Record<string, { label: string; dotColor: string; badgeClass: string }> = {
    RECEIVED: { 
      label: 'Diterima', 
      dotColor: 'bg-emerald-500', 
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    },
    ARCHIVED: { 
      label: 'Disimpan', 
      dotColor: 'bg-blue-500', 
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' 
    },
    DRAFT: { 
      label: 'Draft', 
      dotColor: 'bg-gray-400', 
      badgeClass: 'bg-gray-50 text-gray-600 border-gray-200' 
    },
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

  if (viewId) {
    return (
      <SuratMasukDetail
        id={viewId}
        onClose={() => setViewId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surat Masuk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola dan pantau semua dokumen surat masuk ke instansi.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Surat Masuk
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari nomor surat, perihal, pengirim..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
              setSelectedIds([]);
            }}
            className="pl-9 h-10 border-gray-200"
          />
        </div>
        <select
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(0); setSelectedIds([]); }}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Semua Tanggal</option>
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(0); setSelectedIds([]); }}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Semua Status</option>
          <option value="RECEIVED">Diterima</option>
          <option value="ARCHIVED">Disimpan</option>
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as 'ASC' | 'DESC'); setSelectedIds([]); }}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="DESC">Terbaru</option>
          <option value="ASC">Terlama</option>
        </select>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="w-12 px-4 py-4">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4" 
                  checked={suratList.length > 0 && selectedIds.length === suratList.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-4 text-left font-bold text-gray-500 text-[11px] uppercase tracking-wider">No. Surat</th>
              <th className="px-4 py-4 text-left font-bold text-gray-500 text-[11px] uppercase tracking-wider">Perihal</th>
              <th className="px-4 py-4 text-left font-bold text-gray-500 text-[11px] uppercase tracking-wider">Pengirim</th>
              <th className="px-4 py-4 text-left font-bold text-gray-500 text-[11px] uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-4 text-left font-bold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-left font-bold text-gray-500 text-[11px] uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ={isLoading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Memuat data...</td></tr>
            ) : suratList.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data</td></tr>
            ) : (
              suratList.map((surat: any) => {
                const config = statusConfig[surat.status] || { 
                  label: surat.status, dotColor: 'bg-gray-400', badgeClass: 'bg-gray-50 text-gray-600 border-gray-200' 
                };
                return (
                  <tr key={surat.id} className={cn("border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors", selectedIds.includes(surat.id) && "bg-blue-50/40")}>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4" 
                        checked={selectedIds.includes(surat.id)}
                        onChange={(e) => handleSelectRow(surat.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{surat.nomorSurat}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{surat.perihal}</td>
                    <td className="px-4 py-3 text-gray-600">{surat.pengirim}</td>
                    <td className="px-4 py-3 text-gray-500">{format(new Date(surat.tanggal), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm", config.badgeClass)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setViewId(surat.id)} 
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setEditId(surat.id); setShowForm(true); }} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDownloadPdf(surat.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"><Download className="h-4 w-4" /></button>
                        <button onClick={() => { if(window.confirm('Hapus?')) deleteMutation.mutate(surat.id); }} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalElements > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/30">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">Menampilkan {startItem}-{endItem} dari {totalElements} surat</span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 0} onClick={() => {setPage(p => Math.max(0, p - 1)); setSelectedIds([]);}} className="rounded-lg border border-gray-200 p-2 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i).map(i => (
                <button key={i} onClick={() => {setPage(i); setSelectedIds([]);}} className={`h-9 w-9 rounded-lg text-xs font-bold transition-all ${currentPage === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>
              ))}
              <button disabled={currentPage >= totalPages - 1} onClick={() => {setPage(p => Math.min(totalPages - 1, p + 1)); setSelectedIds([]);}} className="rounded-lg border border-gray-200 p-2 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}