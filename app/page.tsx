'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '../components/dashboard/stats-cards';
import { ProfitChart } from '../components/dashboard/profit-chart';
import { RecentProducts } from '../components/dashboard/recent-products';
import { DashboardStats, ProductAnalysis } from '../types';
import { Button } from '../components/ui/button';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    averageProfitMargin: 0,
    totalRevenue: 0,
    topCategories: [],
  });
  const [recentProducts, setRecentProducts] = useState<ProductAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Buscar estatísticas do dashboard
        const statsResponse = await fetch('/api/dashboard');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Buscar produtos recentes
        const productsResponse = await fetch('/api/analysis?limit=5');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setRecentProducts(productsData.analyses || []);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral dos seus produtos e análises do Mercado Livre
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link href="/analysis">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Analisar Produto
            </Button>
          </Link>
          <Link href="/trends">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Ver Tendências
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <StatsCards stats={stats} loading={loading} />

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de categorias */}
        <ProfitChart stats={stats} loading={loading} />
        
        {/* Produtos recentes */}
        <RecentProducts products={recentProducts} loading={loading} />
      </div>

      {/* Call to action para usuários novos */}
      {!loading && stats.totalProducts === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Comece a analisar produtos!
            </h3>
            <p className="text-gray-600 mb-6">
              Descubra os produtos mais rentáveis do Mercado Livre e calcule suas margens de lucro automaticamente.
            </p>
            <div className="space-y-3">
              <Link href="/analysis">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Analisar Primeiro Produto
                </Button>
              </Link>
              <Link href="/trends">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Ver Produtos em Tendência
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}