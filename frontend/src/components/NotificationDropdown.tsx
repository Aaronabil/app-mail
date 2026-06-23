import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Inbox } from 'lucide-react';
import { suratService } from '@/services/surat';
import { SuratMasuk } from '@/types';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [lastSeenNotificationTime, setLastSeenNotificationTime] = useState<number | null>(null);

  const notificationQuery = useQuery<SuratMasuk[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await suratService.getSuratMasuk({
        page: 0,
        size: 3,
        sortBy: 'tanggal',
        sortDir: 'DESC',
      });
      return data.content || [];
    },
    staleTime: 0,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const incoming = notificationQuery.data || [];
    const latestNotificationTime = incoming.length > 0 ? new Date(incoming[0].tanggal).getTime() : 0;

    if (lastSeenNotificationTime === null) {
      setLastSeenNotificationTime(latestNotificationTime);
      return;
    }

    if (latestNotificationTime > lastSeenNotificationTime) {
      setHasUnreadNotifications(incoming.length > 0);
    }
  }, [notificationQuery.data, lastSeenNotificationTime]);

  useEffect(() => {
    if (!open) return;

    async function markNotificationsRead() {
      const result = await notificationQuery.refetch();
      const incoming = result.data || [];
      const latestNotificationTime = incoming.length > 0 ? new Date(incoming[0].tanggal).getTime() : 0;
      setHasUnreadNotifications(false);
      setLastSeenNotificationTime(latestNotificationTime);
    }

    markNotificationsRead();
  }, [open]);

  const notifications = notificationQuery.data ?? [];
  const loadingNotifications = notificationQuery.isLoading || notificationQuery.isFetching;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
        aria-label="Notifikasi"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications ? (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        ) : null}
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
                      <p className="text-xs text-gray-400">
                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
