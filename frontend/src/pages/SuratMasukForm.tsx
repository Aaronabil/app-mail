import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { suratService } from '../services/surat';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, UploadCloud, RefreshCw } from 'lucide-react';

const schema = z.object({
  nomorSurat: z.string().optional(),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  pengirim: z.string().min(1, 'Pengirim wajib diisi'),
  perihal: z.string().min(1, 'Perihal wajib diisi'),
  isiSingkat: z.string().optional(),
  status: z.string().default('RECEIVED'),
  file: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface SuratMasukFormProps {
  id?: number | null;
  onClose: () => void;
}

export function SuratMasukForm({ id, onClose }: SuratMasukFormProps) {
  const queryClient = useQueryClient();
  const [isDragActive, setIsDragActive] = useState(false);

  const { data: surat } = useQuery({
    queryKey: ['surat-surat-masuk', id],
    queryFn: () => suratService.getSuratMasukById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'RECEIVED'
    }
  });

  const currentFile = watch('file');

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
    mutationFn: (formData: any) => suratService.createSuratMasuk(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-surat-masuk'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Surat masuk berhasil disimpan');
      onClose();
    },
    onError: (error: any) => {
      toast.error('Gagal menyimpan surat masuk: ' + (error?.response?.data?.message || error?.message || 'Terjadi kesalahan'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData: any) => suratService.updateSuratMasuk(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-surat-masuk'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Surat masuk berhasil diperbarui');
      onClose();
    },
    onError: (error: any) => {
      toast.error('Gagal mengupdate surat masuk: ' + (error?.response?.data?.message || error?.message || 'Terjadi kesalahan'));
    },
  });

  const validateFileFile = (file: File): boolean => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 10MB.");
      return false;
    }
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error("Format file tidak didukung! Hanya boleh PDF, DOCS, JPG, atau PNG.");
      return false;
    }
    return true;
  };

  const onSubmit = (data: FormData) => {
    const { file, ...suratData } = data;
    const formData = new FormData();

    formData.append(
      "request",
      new Blob([JSON.stringify(suratData)], { type: "application/json" })
    );

    if (file) {
      formData.append("file", file);
    }

    if (id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFileFile(droppedFile)) {
        setValue('file', droppedFile);
      }
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100" disabled={isLoading}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit' : 'Tambah'} Surat Masuk</h1>
          <p className="text-sm text-muted-foreground">
            {id ? 'Surat Masuk / Edit' : 'Tambahkan data arsip surat masuk baru'}
          </p>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-blue-900 mb-4">Informasi Surat</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="perihal" className="text-sm font-medium text-gray-600">Perihal</Label>
                      <Input 
                        id="perihal" 
                        {...register('perihal')} 
                        placeholder="Cth: Undangan Rapat Evaluasi"
                        className="bg-white border-gray-200 focus-visible:ring-blue-500 h-11"
                        disabled={isLoading}
                      />
                      {errors.perihal && (
                        <p className="text-xs text-destructive">{errors.perihal.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="pengirim" className="text-sm font-medium text-gray-600">Pengirim</Label>
                        <Input 
                          id="pengirim" 
                          {...register('pengirim')} 
                          placeholder="Instansi/Divisi Pengirim"
                          className="bg-white border-gray-200 focus-visible:ring-blue-500 h-11"
                          disabled={isLoading}
                        />
                        {errors.pengirim && (
                          <p className="text-xs text-destructive">{errors.pengirim.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-400">Penerima</Label>
                        <Input 
                          placeholder="Instansi/Divisi Penerima" 
                          disabled 
                          value="Internal / Logistik (Auto)"
                          className="bg-gray-50 border-gray-200 text-gray-400 h-11 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-blue-900">Lampiran</h2>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                      ${isDragActive 
                        ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' 
                        : 'border-gray-200 bg-gray-50/30 hover:bg-gray-50'
                      } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <UploadCloud className={`h-9 w-9 mb-2 transition-transform ${isDragActive ? 'scale-110 text-blue-500' : 'text-gray-400'}`} />
                      <p className="text-sm text-gray-600">
                        Tarik & lepaskan file di sini, atau <span className="text-blue-600 font-medium hover:underline">pilih file</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        Mendukung PDF, DOCS, JPG, PNG (Max 10MB)
                      </p>
                    </div>

                    <input
                      id="fileBerkas"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      disabled={isLoading}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const selectedFile = e.target.files[0];
                          if (validateFileFile(selectedFile)) {
                            setValue('file', selectedFile);
                          } else {
                            e.target.value = "";
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>

                  {currentFile && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg animate-in fade-in duration-200">
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-2">
                        <span className="bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</span> 
                        File siap diunggah: <span className="font-bold underline">{currentFile.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 bg-gray-50/60 p-6 rounded-xl border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Detail Arsip</h2>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nomorSurat" className="text-sm font-medium text-gray-600">No. Surat (Auto-generated)</Label>
                    <div className="relative flex items-center">
                      <Input 
                        id="nomorSurat" 
                        {...register('nomorSurat')} 
                        placeholder="SK/0011/VI/2026"
                        className="bg-white border-gray-200 focus-visible:ring-blue-500 h-11 pr-10"
                        disabled={isLoading}
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 text-gray-400 hover:text-gray-600 h-9 w-9" disabled={isLoading}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.nomorSurat && (
                      <p className="text-xs text-destructive">{errors.nomorSurat.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="tanggal" className="text-sm font-medium text-gray-600">Tanggal Surat</Label>
                    <Input 
                      id="tanggal" 
                      type="date" 
                      {...register('tanggal')} 
                      className="bg-white border-gray-200 focus-visible:ring-blue-500 h-11"
                      disabled={isLoading}
                    />
                    {errors.tanggal && (
                      <p className="text-xs text-destructive">{errors.tanggal.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-600">Status</Label>
                    <select
                      id="status"
                      {...register('status')}
                      disabled={isLoading}
                      className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 disabled:opacity-60"
                    >
                      <option value="RECEIVED">RECEIVED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="isiSingkat" className="text-sm font-medium text-gray-600">Catatan Tambahan</Label>
                    <Textarea 
                      id="isiSingkat" 
                      rows={4} 
                      {...register('isiSingkat')} 
                      placeholder="Tambahkan catatan khusus untuk arsip ini..."
                      className="bg-white border-gray-200 focus-visible:ring-blue-500 resize-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
                className="border-gray-200 hover:bg-gray-50 text-gray-600 h-11 px-6 font-medium rounded-lg"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 font-medium rounded-lg shadow-sm shadow-blue-500/10 min-w-[100px]"
              >
                {isLoading ? 'Memproses...' : id ? 'Update' : 'Simpan'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}