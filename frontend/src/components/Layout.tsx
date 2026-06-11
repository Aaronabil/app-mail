import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { NotificationDropdown } from './NotificationDropdown';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CardTitle } from './ui/card';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title = 'Dashboard' }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative flex h-16 items-center justify-between border-b bg-white px-8">
          <CardTitle className="font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
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
