import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  ClipboardList,
  Settings,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/surat-masuk', label: 'Surat Masuk', icon: FileText },
  { path: '/surat-keluar', label: 'Surat Keluar', icon: FilePlus },
  { path: '/audit-log', label: 'Audit Log', icon: ClipboardList },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/support', label: 'Support', icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();
  useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
          A
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">Arsip Surat</h1>
          <p className="text-[10px] text-gray-500 leading-tight">Technical Management</p>
        </div>
      </div>

      {/* Tombol Arsip Baru */}
      <div className="px-4 mb-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Arsip Baru
        </button>
      </div>

      {/* Menu Utama */}
      <nav className="flex-1 space-y-0.5 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-blue-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Menu Bawah */}
      <div className="space-y-0.5 px-3 pb-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-blue-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
