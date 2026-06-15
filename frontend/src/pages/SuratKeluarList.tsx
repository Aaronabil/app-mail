import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suratService } from '@/services/surat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Download, Trash2, Search } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { SuratKeluarForm } from './SuratKeluarForm';

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

export function SuratKeluarList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('DESC');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();

  const { data: suratList = [], isLoading } = useQuery({
    queryKey: ['surat-keluar', search, status, sort, dateFilter],
    queryFn: () =>
      suratService.getSuratKeluar({
        search: search || undefined,
        status: status || undefined,
        sortBy: 'tanggal',
        sortDir: sort,
        ...getDateRange(dateFilter),
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: suratService.deleteSuratKeluar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-keluar'] });
    },
  });

  const batchDeleteMutation = useMutation({
    mutationFn: suratService.batchDeleteSuratKeluar,
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['surat-keluar'] });
    },
  });

  const handleExportPdf = async (id: number) => {
    const blob = await suratService.exportSuratKeluarPdf(id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surat-keluar-${id}.pdf`;
    a.click();
  };

  const navigate = useNavigate();

  const handleExportBatch = async () => {
    const blob = await suratService.exportSuratKeluarListPdf(selectedIds.length > 0 ? selectedIds : undefined);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surat-keluar-list.pdf';
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      DRAFT: 'outline',
      SENT: 'default',
      ARCHIVED: 'secondary',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (showForm) {
    return (
      <SuratKeluarForm
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Surat Keluar</h1>
          <p className="text-muted-foreground">Kelola surat keluar</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Surat
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nomor surat, penerima, atau perihal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Semua Tanggal</option>
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Terkirim</option>
          <option value="ARCHIVED">Diarsipkan</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="DESC">Terbaru</option>
          <option value="ASC">Terlama</option>
        </select>

        <Button variant="outline" onClick={handleExportBatch}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(`Hapus ${selectedIds.length} surat?`)) {
                batchDeleteMutation.mutate(selectedIds);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus ({selectedIds.length})
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.length === suratList.length && suratList.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(suratList.map((s) => s.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Nomor Surat</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead>Perihal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suratList.map((surat) => (
              <TableRow
              key={surat.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => navigate(`/surat-keluar/${surat.id}`)}
            >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(surat.id)}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, surat.id]);
                      } else {
                        setSelectedIds(selectedIds.filter((id) => id !== surat.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{surat.nomorSurat}</TableCell>
                <TableCell>{format(new Date(surat.tanggal), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{surat.penerima}</TableCell>
                <TableCell>{surat.perihal}</TableCell>
                <TableCell>{getStatusBadge(surat.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditId(surat.id);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleExportPdf(surat.id);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (confirm('Hapus surat ini?')) {
                          deleteMutation.mutate(surat.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
