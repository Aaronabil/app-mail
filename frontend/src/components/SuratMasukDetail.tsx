import { useQuery } from '@tanstack/react-query';
import { suratService } from '../services/surat';
import { Button } from './ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface SuratMasukDetailProps {
  id: number;
  onClose: () => void;
}

export function SuratMasukDetail({ id, onClose }: SuratMasukDetailProps) {
  const { data: surat, isLoading, error } = useQuery({
    queryKey: ['surat-surat-masuk', id],
    queryFn: () => suratService.getSuratMasukById(id),
  });

  const handleExportPdfSistem = async () => {
    try {
      const blob = await suratService.exportSuratMasukPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cetak-surat-masuk-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadAttachment = async () => {
    try {
      const dataSurat = surat as any;
      const fileName = dataSurat.namaFile || (dataSurat.filePath ? dataSurat.filePath.split('/').pop() : 'lampiran_surat_masuk.pdf');
      const blob = await suratService.downloadOriginalFile(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Memuat detail surat...</div>;
  if (error || !surat) return <div className="p-8 text-center text-red-500">Gagal memuat atau data surat tidak ditemukan.</div>;

  const statusConfig: Record<string, { label: string; badgeClass: string }> = {
    RECEIVED: { label: 'Diterima', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ARCHIVED: { label: 'Disimpan', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    DRAFT: { label: 'Draft', badgeClass: 'bg-gray-50 text-gray-600 border-gray-200' },
  };

  const config = statusConfig[surat.status] || {
    label: surat.status,
    badgeClass: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  const dataSurat = surat as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{dataSurat.nomorSurat || 'Tanpa Nomor'}</h1>
              <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm", config.badgeClass)}>
                {config.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Surat Masuk / Detail</p>
          </div>
        </div>
        
        <Button onClick={handleExportPdfSistem} className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
        <div>
          <span className="text-xs text-gray-400 font-medium block">Tanggal</span>
          <span className="text-sm font-semibold text-gray-800">
            {dataSurat.tanggal ? format(new Date(dataSurat.tanggal), 'dd MMM yyyy') : '-'}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-400 font-medium block">Jenis</span>
          <span className="text-sm font-semibold text-gray-800">Surat Masuk</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 font-medium block">Pengirim</span>
          <span className="text-sm font-semibold text-gray-800">{dataSurat.pengirim || '-'}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 font-medium block">Penerima</span>
          <span className="text-sm font-semibold text-gray-800">
            {dataSurat.penerima || dataSurat.divisiTujuan || 'Internal / Instansi'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{dataSurat.perihal}</h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {dataSurat.isiSingkat || dataSurat.ringkasan || 'Tidak ada deskripsi atau ringkasan isi surat.'}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Attachments</h3>
          {dataSurat.filePath || dataSurat.namaFile ? (
            <div className="inline-flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 max-w-sm">
              <div className="p-2 bg-red-50 text-red-500 rounded-md">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {dataSurat.namaFile || (dataSurat.filePath ? dataSurat.filePath.split('/').pop() : 'Lampiran_Surat.pdf')}
                </p>
                <p className="text-[10px] text-gray-400">File Lampiran Surat</p>
              </div>
              <button onClick={handleDownloadAttachment} className="text-xs text-blue-600 font-bold hover:underline ml-2">
                Unduh
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Tidak ada file lampiran.</p>
          )}
        </div>
      </div>
    </div>
  );
}
