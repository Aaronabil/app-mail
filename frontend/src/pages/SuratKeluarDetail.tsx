import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { suratService } from '@/services/surat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

export function SuratKeluarDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const suratId = Number(id);

  const { data: surat, isLoading, isError } = useQuery({
    queryKey: ['surat-keluar', suratId],
    queryFn: () => suratService.getSuratKeluarById(suratId),
    enabled: !Number.isNaN(suratId),
  });

  const statusLabel = useMemo(() => {
    if (!surat) return '';
    const labels: Record<string, string> = {
      DRAFT: 'Draft',
      SENT: 'Sent',
      ARCHIVED: 'Archived',
    };
    return labels[surat.status] ?? surat.status;
  }, [surat]);

  const handleExportPdf = async () => {
    if (!surat) return;
    const blob = await suratService.exportSuratKeluarPdf(surat.id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surat-keluar-${surat.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const attachmentFileName = surat?.filePath?.split(/[/\\]/).pop();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/surat-keluar')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <div className="rounded-2xl border p-8">Memuat detail surat...</div>
      </div>
    );
  }

  if (isError || !surat) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/surat-keluar')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <div className="rounded-2xl border p-8 text-center text-sm text-red-600">
          Tidak dapat memuat detail surat.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{surat.nomorSurat}</h1>
            <Badge variant="secondary">{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Detail Surat Keluar (read only)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/surat-keluar')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tanggal</p>
          <p className="mt-3 text-base font-semibold text-slate-900">{format(new Date(surat.tanggal), 'dd MMM yyyy')}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Jenis</p>
          <p className="mt-3 text-base font-semibold text-slate-900">Surat Keluar</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pengirim</p>
          <p className="mt-3 text-base font-semibold text-slate-900">{surat.createdByUsername ?? '-'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Penerima</p>
          <p className="mt-3 text-base font-semibold text-slate-900">{surat.penerima}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 pb-4">
            <CardTitle className="text-lg font-semibold">Isi Surat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Perihal</p>
              <h2 className="text-xl font-semibold text-slate-900">{surat.perihal}</h2>
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-700">{surat.isiSingkat || 'Tidak ada isi tambahan.'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle className="text-lg font-semibold">Lampiran</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {attachmentFileName ? (
                <div className="flex items-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <FileText className="h-6 w-6 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">{attachmentFileName}</p>
                    <p className="text-sm text-slate-500">PDF lampiran tersedia</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Belum ada lampiran.</p>
              )}
              {attachmentFileName ? (
                <a
                  href={`/api/surat-keluar/${surat.id}/attachment`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                >
                  Buka Lampiran
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle className="text-lg font-semibold">Audit History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dibuat</p>
                <p className="mt-2 text-sm text-slate-700">
                  {surat.createdByUsername ?? 'Pengguna tidak diketahui'} • {surat.createdAt ? format(new Date(surat.createdAt), 'dd MMM yyyy HH:mm') : '-'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Diubah</p>
                <p className="mt-2 text-sm text-slate-700">
                  {surat.updatedAt ? format(new Date(surat.updatedAt), 'dd MMM yyyy HH:mm') : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
