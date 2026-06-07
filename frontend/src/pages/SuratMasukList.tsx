import { useState } from 'react';
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
import { format } from 'date-fns';
import { SuratMasukForm } from './SuratMasukForm';

export function SuratMasukList() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();

  const { data: suratList = [], isLoading } = useQuery({
    queryKey: ['surat-masuk', search],
    queryFn: () => suratService.getSuratMasuk({ search, sortBy: 'tanggal', sortDir: 'DESC' }),
  });

  const deleteMutation = useMutation({
    mutationFn: suratService.deleteSuratMasuk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-masuk'] });
    },
  });

  const batchDeleteMutation = useMutation({
    mutationFn: suratService.batchDeleteSuratMasuk,
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['surat-masuk'] });
    },
  });

  const handleExportPdf = async (id: number) => {
    const blob = await suratService.exportSuratMasukPdf(id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surat-masuk-${id}.pdf`;
    a.click();
  };

  const handleExportBatch = async () => {
    const blob = await suratService.exportSuratMasukListPdf(selectedIds.length > 0 ? selectedIds : undefined);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surat-masuk-list.pdf';
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      RECEIVED: 'default',
      ARCHIVED: 'secondary',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Surat Masuk</h1>
          <p className="text-muted-foreground">Kelola surat masuk</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Surat
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nomor surat, pengirim, atau perihal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
              <TableHead>Pengirim</TableHead>
              <TableHead>Perihal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suratList.map((surat) => (
              <TableRow key={surat.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(surat.id)}
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
                <TableCell>{surat.pengirim}</TableCell>
                <TableCell>{surat.perihal}</TableCell>
                <TableCell>{getStatusBadge(surat.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditId(surat.id);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportPdf(surat.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
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
