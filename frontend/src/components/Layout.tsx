import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, UserCircle, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CardTitle } from './ui/card';
import { suratService } from '@/services/surat';
import { SuratMasuk } from '@/types';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title = 'Dashboard' }: LayoutProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<SuratMasuk[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  async function loadNotifications() {
    setLoadingNotifications(true);
    try {
      const data = await suratService.getSuratMasuk({ page: 0, size: 4, sortBy: 'tanggal', sortDir: 'DESC' });
      setNotifications(data.content || []);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!open) return;
    loadNotifications();
  }, [open]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative flex h-16 items-center justify-between border-b bg-white px-8">
          <CardTitle className="font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Notifikasi"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              {open ? (
                <div className="absolute right-0 z-10 mt-2 w-96 rounded-3xl border border-gray-200 bg-white p-4 shadow-lg ring-1 ring-black/5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Notifikasi Surat Masuk</p>
                      <p className="text-xs text-gray-500">
                        {loadingNotifications
                          ? 'Memuat...'
                          : notifications.length > 0
                          ? `Menampilkan ${notifications.length} surat terbaru`
                          : 'Tidak ada surat masuk baru'}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="space-y-2">
                    {loadingNotifications ? (
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-500">
                        Memuat notifikasi...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-500">
                        Belum ada surat masuk terbaru.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600">
                              <Inbox className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">{item.pengirim}</p>
                              <p className="text-sm text-gray-500">{item.perihal}</p>
                              <p className="text-xs text-gray-400">{new Date(item.tanggal).toLocaleDateString('id-ID')}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <UserCircle className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {user?.fullName || 'Admin Profile'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
