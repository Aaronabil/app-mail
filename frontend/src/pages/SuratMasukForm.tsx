import { useEffect } from 'react';
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
  pengirim: z.string().min(1, 'Pengirim wajib diisi'),
  perihal: z.string().min(1, 'Perihal wajib diisi'),
  isiSingkat: z.string().optional(),
  status: z.string().default('RECEIVED'),
});

type FormData = z.infer<typeof schema>;

interface SuratMasukFormProps {
  id?: number | null;
  onClose: () => void;
}

export function SuratMasukForm({ id, onClose }: SuratMasukFormProps) {
  const queryClient = useQueryClient();

  const { data: surat } = useQuery({
    queryKey: ['surat-masuk', id],
    queryFn: () => suratService.getSuratMasukById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (surat) {
      reset({
        nomorSurat: surat.nomorSurat,
        tanggal: surat.tanggal,
        pengirim: surat.pengirim,
        perihal: surat.perihal,
        isiSingkat: surat.isiSingkat || '',
        status: surat.status,
      });
    }
  }, [surat, reset]);

  const createMutation = useMutation({
    mutationFn: suratService.createSuratMasuk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-masuk'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => suratService.updateSuratMasuk(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-masuk'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onClose();
    },
  });

  const onSubmit = (data: FormData) => {
    if (id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Edit' : 'Tambah'} Surat Masuk</h1>
          <p className="text-muted-foreground">
            {id ? 'Ubah data surat masuk' : 'Tambahkan surat masuk baru'}
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
              <Label htmlFor="pengirim">Pengirim *</Label>
              <Input id="pengirim" {...register('pengirim')} />
              {errors.pengirim && (
                <p className="text-sm text-destructive">{errors.pengirim.message}</p>
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
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="RECEIVED">RECEIVED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {id ? 'Update' : 'Simpan'}
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
