'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { 
  BarChart3, 
  Search, 
  Settings, 
  TrendingUp, 
  Package,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Catálogo de Produtos', href: '/analysis', icon: Search },
  { name: 'Produtos Salvos', href: '/products', icon: Package },
  { name: 'Tendências', href: '/trends', icon: TrendingUp },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl">
        <div className="flex items-center justify-center h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-900" />
            </div>
            <span className="text-white font-bold text-lg">ML Analyzer</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 transition-colors',
                    isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-4 py-6 border-t border-blue-700">
          <div className="text-xs text-blue-200">
            <p>Mercado Livre Analyzer</p>
            <p className="mt-1">Versão 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}