  import { useQuery } from '@tanstack/react-query';
import { suratService } from '@/services/surat';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart } from 'recharts';
import {
  FileText,
  FileOutput,
  FileClock,
  Archive,
  TrendingUp,
  TrendingDown,
  MoreVertical,
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
      change: '+12%',
      up: true,
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Surat Keluar',
      value: stats?.totalSuratKeluar || 0,
      change: '+5%',
      up: true,
      icon: FileOutput,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Surat Draft',
      value: stats?.suratKeluarDraft || 0,
      change: '-2%',
      up: false,
      icon: FileClock,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: 'Surat Terarsip',
      value: (stats?.suratMasukArchived || 0) + (stats?.suratKeluarArchived || 0),
      change: '+5%',
      up: true,
      icon: Archive,
      iconBg: 'bg-green-100',
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
              <div className="mt-3 flex items-center gap-1 text-xs">
                {card.up ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={card.up ? 'text-green-600' : 'text-red-600'}>
                  {card.change}
                </span>
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
              <TrendingUp className="h-4 w-4 text-green-500" />
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
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-bold">Aktivitas Terbaru</h3>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">No. Surat</th>
                <th className="px-5 py-3 font-medium">Perihal</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium">SRT/2023/10/045</td>
                <td className="px-5 py-3.5 text-muted-foreground">Undangan Rapat Evaluasi Triwulan</td>
                <td className="px-5 py-3.5 text-muted-foreground">12 Okt 2023</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-700">Terarsip</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium">SRT/2023/10/044</td>
                <td className="px-5 py-3.5 text-muted-foreground">Permohonan Pengadaan Barang IT</td>
                <td className="px-5 py-3.5 text-muted-foreground">11 Okt 2023</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-blue-700">Terkirim</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium">-</td>
                <td className="px-5 py-3.5 text-muted-foreground">Laporan Bulanan September</td>
                <td className="px-5 py-3.5 text-muted-foreground">10 Okt 2023</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-xs font-medium text-gray-600">Draft</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium">SRT/2023/10/042</td>
                <td className="px-5 py-3.5 text-muted-foreground">Balasan Penawaran Kerjasama</td>
                <td className="px-5 py-3.5 text-muted-foreground">08 Okt 2023</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-700">Terarsip</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium">SRT/2023/10/041</td>
                <td className="px-5 py-3.5 text-muted-foreground">Pemberitahuan Cuti Bersama</td>
                <td className="px-5 py-3.5 text-muted-foreground">05 Okt 2023</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-700">Terarsip</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
