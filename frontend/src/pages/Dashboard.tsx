  import { useQuery } from '@tanstack/react-query';
import { suratService } from '@/services/surat';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart } from 'recharts';
import {
  FileClock,
  Archive,
  Inbox,
  SendHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

const barChartConfig = {
  suratMasuk: {
    label: 'Surat Masuk',
    color: 'hsl(var(--chart-1))',
  },
  suratKeluar: {
    label: 'Surat Keluar',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const pieChartConfig = {
  terarsip: {
    label: 'Terarsip',
    color: 'hsl(var(--chart-3))',
  },
  terkirim: {
    label: 'Terkirim',
    color: 'hsl(var(--chart-1))',
  },
  draft: {
    label: 'Draft',
    color: 'hsl(var(--chart-5))',
  },
  diterima: {
    label: 'Diterima',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: suratService.getDashboardStats,
  });

  const { data: chartData } = useQuery({
    queryKey: ['dashboard-chart-monthly'],
    queryFn: suratService.getMonthlyChartData,
  });

  const { data: suratMasukData } = useQuery({
    queryKey: ['dashboard-surat-masuk'],
    queryFn: () => suratService.getSuratMasuk({ size: 5, sortBy: 'createdAt', sortDir: 'DESC' }),
  });

  const { data: suratKeluarData } = useQuery({
    queryKey: ['dashboard-surat-keluar'],
    queryFn: () => suratService.getSuratKeluar({ sortBy: 'createdAt', sortDir: 'DESC' }),
  });

const recentActivity = [
  ...(suratMasukData?.content || []).map((s: any) => ({ ...s, type: 'masuk' })),
  ...(suratKeluarData?.content || []).map((s: any) => ({ ...s, type: 'keluar' })),
]
  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);
  
  const barData =
    chartData?.months.map((m) => ({
      month: m.month,
      suratMasuk: m.suratMasuk,
      suratKeluar: m.suratKeluar,
    })) || [];

  const pieData = [
    {
      key: 'terarsip',
      label: 'Terarsip',
      count: (stats?.suratMasukArchived || 0) + (stats?.suratKeluarArchived || 0),
      fill: 'hsl(var(--chart-3))',
    },
    {
      key: 'terkirim',
      label: 'Terkirim',
      count: stats?.suratKeluarSent || 0,
      fill: 'hsl(var(--chart-1))',
    },
    {
      key: 'draft',
      label: 'Draft',
      count: stats?.suratKeluarDraft || 0,
      fill: 'hsl(var(--chart-5))',
    },
    {
      key: 'diterima',
      label: 'Diterima',
      count: stats?.suratMasukReceived || 0,
      fill: 'hsl(var(--chart-4))',
    },
  ].filter((d) => d.count > 0);

  const totalPie = pieData.reduce((sum, d) => sum + d.count, 0);  

  const statCards = [
    {
      label: 'Total Surat Masuk',
      value: stats?.totalSuratMasuk || 0,
      icon: Inbox,
      iconBg: '',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Surat Keluar',
      value: stats?.totalSuratKeluar || 0,
      icon: SendHorizontal,
      iconBg: '',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Surat Draft',
      value: stats?.suratKeluarDraft || 0,
      icon: FileClock,
      iconBg: '',
      iconColor: 'text-red-600',
    },
    {
      label: 'Surat Terarsip',
      value: (stats?.suratMasukArchived || 0) + (stats?.suratKeluarArchived || 0),
      icon: Archive,
      iconBg: '',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl bg-white p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`rounded-lg ${card.iconBg} p-2`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bar Chart - Multiple */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Statistik Surat</CardTitle>
              </div>
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                Semester {new Date().getMonth() < 6 ? 1 : 2}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-72 w-full">
              <BarChart accessibilityLayer data={barData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="suratMasuk" fill="hsl(var(--chart-1))" radius={4} />
                <Bar dataKey="suratKeluar" fill="hsl(var(--chart-2))" radius={4} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Donut */}
        <Card className="flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle>Komposisi Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto aspect-square max-h-[250px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={60}
                  strokeWidth={5}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <div className="flex flex-col gap-2 px-6 pb-4 text-sm">
            <div className="flex items-center justify-center gap-2 font-medium">
              <span>{totalPie} Total Surat</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {pieData.map((item) => (
                <div key={item.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span>{item.label}</span>
                  <span className="font-medium text-foreground">
                    {totalPie > 0 ? Math.round((item.count / totalPie) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Aktivitas Terbaru */}
      <Card>
        <div className="px-5 py-4 border-b">
          <h3 className="text-sm font-bold">Aktivitas Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">No. Surat</th>
                <th className="px-5 py-3 font-medium">Perihal</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    Belum ada aktivitas
                  </td>
                </tr>
              ) : (
                recentActivity.map((item: any) => {
                  const isMasuk = item.type === 'masuk';
                  const statusConfig: Record<string, { label: string; dotColor: string; color: string }> = {
                    RECEIVED: { label: 'Diterima', dotColor: 'bg-emerald-500', color: 'text-emerald-700' },
                    ARCHIVED: { label: 'Disimpan', dotColor: 'bg-blue-500', color: 'text-blue-700' },
                    DRAFT: { label: 'Draft', dotColor: 'bg-gray-400', color: 'text-gray-600' },
                    SENT: { label: 'Terkirim', dotColor: 'bg-blue-500', color: 'text-blue-700' },
                  };
                  const sc = statusConfig[item.status] || { label: item.status, dotColor: 'bg-gray-400', color: 'text-gray-600' };

                  return (
                    <tr key={`${item.type}-${item.id}`} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3.5 font-medium">
                        <div className="flex items-center gap-2">
                          {item.nomorSurat}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isMasuk ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            {isMasuk ? 'Masuk' : 'Keluar'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.perihal}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {item.tanggal ? format(new Date(item.tanggal), 'dd MMM yyyy') : '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${sc.dotColor}`} />
                          <span className={`text-xs font-medium ${sc.color}`}>{sc.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
