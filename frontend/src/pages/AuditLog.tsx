import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/services/audit';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const actionOptions = [
  { value: '', label: 'All Actions' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
];

const entityTypeOptions = [
  { value: '', label: 'All Entities' },
  { value: 'Surat Masuk', label: 'Surat Masuk' },
  { value: 'Surat Keluar', label: 'Surat Keluar' },
];

export function AuditLog() {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: logData, isLoading } = useQuery({
    queryKey: ['audit-logs', search, action, entityType, page],
    queryFn: () =>
      auditService.getAuditLogs({
        search: search || undefined,
        action: action || undefined,
        entityType: entityType || undefined,
        page,
        size: pageSize,
      }),
  });

  const logs = logData?.content || [];
  const totalElements = logData?.totalElements || 0;
  const totalPages = logData?.totalPages || 0;
  const currentPage = logData?.currentPage || 0;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getActionBadge = (actionValue: string) => {
    const styles: Record<string, string> = {
      CREATE: 'text-green-700 bg-green-50',
      UPDATE: 'text-blue-700 bg-blue-50',
      DELETE: 'text-red-700 bg-red-50',
    };
    return styles[actionValue] || 'text-gray-700 bg-gray-50';
  };

  const getActionDot = (actionValue: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-500',
      UPDATE: 'bg-blue-500',
      DELETE: 'bg-red-500',
    };
    return colors[actionValue] || 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pantau seluruh riwayat aktivitas dan perubahan data dalam sistem.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Filter by entity or actor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {actionOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {entityTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4 text-blue-600" />
          <span className="text-blue-600 text-sm font-medium">Export CSV</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Waktu</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Aksi</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Entitas</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">ID Entitas</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Oleh</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Detail Perubahan</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                      getActionBadge(log.action)
                    )}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getActionDot(log.action)}`} />
                      {log.action.charAt(0) + log.action.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{log.entityType}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.entityLabel}</td>
                  <td className="px-4 py-3 text-gray-900">{log.actor}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalElements > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <span className="text-xs text-gray-500">
              Showing {startItem} to {endItem} of {totalElements} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-md border p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-8 w-8 rounded-md text-sm font-medium ${
                    currentPage === i
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-400 px-1">...</span>
                  <button
                    onClick={() => setPage(totalPages - 1)}
                    className={`h-8 w-8 rounded-md text-sm font-medium ${
                      currentPage === totalPages - 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="rounded-md border p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
