import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suratService } from '@/services/surat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const schema = z.object({
  nomorSurat: z.string().optional(),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  penerima: z.string().min(1, 'Penerima wajib diisi'),
  perihal: z.string().min(1, 'Perihal wajib diisi'),
  isiSingkat: z.string().optional(),
  status: z.string().default('DRAFT'),
});

type FormData = z.infer<typeof schema>;

interface SuratKeluarFormProps {
  id?: number | null;
  onClose: () => void;
}

export function SuratKeluarForm({ id, onClose }: SuratKeluarFormProps) {
  const queryClient = useQueryClient();

  const isEditMode = id != null;
  const { data: surat, isLoading: isSuratLoading } = useQuery({
    queryKey: ['surat-keluar', id],
    queryFn: () => suratService.getSuratKeluarById(id!),
    enabled: isEditMode,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomorSurat: '',
      tanggal: '',
      penerima: '',
      perihal: '',
      isiSingkat: '',
      status: 'DRAFT',
    },
  });

  const getFileName = (path: string | undefined | null) =>
    path?.split(/[/\\]/).pop() ?? null;

  useEffect(() => {
    if (surat) {
      reset({
        nomorSurat: surat.nomorSurat,
        tanggal: surat.tanggal,
        penerima: surat.penerima,
        perihal: surat.perihal,
        isiSingkat: surat.isiSingkat || '',
        status: surat.status,
      });
      setExistingFileName(getFileName(surat.filePath));
      setSelectedFile(null);
    } else if (!isEditMode) {
      reset({
        nomorSurat: '',
        tanggal: '',
        penerima: '',
        perihal: '',
        isiSingkat: '',
        status: 'DRAFT',
      });
      setExistingFileName(null);
      setSelectedFile(null);
    }
  }, [surat, reset, isEditMode]);

  const createMutation = useMutation({
    mutationFn: suratService.createSuratKeluar,
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => suratService.updateSuratKeluar(id!, data),
  });

  const uploadAttachment = async (suratId: number) => {
    if (!selectedFile) return;
    setUploadingAttachment(true);
    try {
      const updated = await suratService.uploadSuratKeluarAttachment(suratId, selectedFile);
      setExistingFileName(getFileName(updated.filePath) ?? selectedFile.name);
    } finally {
      setUploadingAttachment(false);
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = isEditMode
        ? await updateMutation.mutateAsync(data)
        : await createMutation.mutateAsync(data);

      const suratId = id ?? result.id;
      if (selectedFile) {
        await uploadAttachment(suratId);
      }

      queryClient.invalidateQueries({ queryKey: ['surat-keluar'] });
      queryClient.invalidateQueries({ queryKey: ['surat-keluar', suratId] });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditMode && isSuratLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Surat Keluar</h1>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Data Surat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 rounded-lg bg-slate-100" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit' : 'Tambah'} Surat Keluar</h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Ubah data surat keluar' : 'Tambahkan surat keluar baru'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Surat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomorSurat">
                  Nomor Surat <span className="text-muted-foreground">(opsional, auto-generate)</span>
                </Label>
                <Input id="nomorSurat" {...register('nomorSurat')} />
                {errors.nomorSurat && (
                  <p className="text-sm text-destructive">{errors.nomorSurat.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal *</Label>
                <Input id="tanggal" type="date" {...register('tanggal')} />
                {errors.tanggal && (
                  <p className="text-sm text-destructive">{errors.tanggal.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="penerima">Penerima *</Label>
              <Input id="penerima" {...register('penerima')} />
              {errors.penerima && (
                <p className="text-sm text-destructive">{errors.penerima.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="perihal">Perihal *</Label>
              <Input id="perihal" {...register('perihal')} />
              {errors.perihal && (
                <p className="text-sm text-destructive">{errors.perihal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isiSingkat">Isi Singkat</Label>
              <Textarea id="isiSingkat" rows={4} {...register('isiSingkat')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Lampiran (PDF)</Label>
              <input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {selectedFile ? (
                <p className="text-sm text-gray-500">File siap diunggah: {selectedFile.name}</p>
              ) : existingFileName ? (
                <p className="text-sm text-gray-500">
                  File saat ini: <a href={`/api/surat-keluar/${id}/attachment`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{existingFileName}</a>
                </p>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada lampiran saat ini.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="SENT">SENT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  createMutation.isPending || updateMutation.isPending || uploadingAttachment
                }
              >
                {uploadingAttachment
                  ? 'Mengunggah lampiran...'
                  : id
                  ? 'Update'
                  : 'Simpan'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
