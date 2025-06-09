import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  Package, 
  Target,
  Activity,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ProductAnalysis } from '../types/product';
import { dbService } from '../services/database';

interface DashboardProps {
  analyses: ProductAnalysis[];
}

interface DashboardStats {
  totalAnalyses: number;
  avgProfitMargin: number;
  totalRevenue: number;
  profitableProducts: number;
  avgSuggestedCost: number;
  categoryDistribution: Array<{ name: string; value: number; color: string }>;
  profitMarginDistribution: Array<{ range: string; count: number; percentage: number }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function Dashboard({ analyses }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    avgProfitMargin: 0,
    totalRevenue: 0,
    profitableProducts: 0,
    avgSuggestedCost: 0,
    categoryDistribution: [],
    profitMarginDistribution: [],
  });

  useEffect(() => {
    calculateStats();
  }, [analyses]);

  const calculateStats = async () => {
    if (analyses.length === 0) {
      setStats({
        totalAnalyses: 0,
        avgProfitMargin: 0,
        totalRevenue: 0,
        profitableProducts: 0,
        avgSuggestedCost: 0,
        categoryDistribution: [],
        profitMarginDistribution: [],
      });
      return;
    }

    const totalAnalyses = analyses.length;
    
    // Calcula médias
    const totalProfitMargin = analyses.reduce((sum, a) => sum + a.analysis.profitMargin, 0);
    const avgProfitMargin = totalProfitMargin / totalAnalyses;
    
    const totalRevenue = analyses.reduce((sum, a) => sum + a.analysis.netRevenue, 0);
    
    const profitableProducts = analyses.filter(a => a.analysis.profitMargin >= 0.30).length;
    
    const totalSuggestedCost = analyses.reduce((sum, a) => sum + a.analysis.suggestedMaxCost, 0);
    const avgSuggestedCost = totalSuggestedCost / totalAnalyses;

    // Distribuição por categoria (simplificada)
    const categories: Record<string, number> = {};
    analyses.forEach(analysis => {
      const category = analysis.product.category_id || 'Outros';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    const categoryDistribution = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, value], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        value,
        color: COLORS[index % COLORS.length],
      }));

    // Distribuição de margem de lucro
    const profitRanges = [
      { range: '< 10%', min: 0, max: 0.1 },
      { range: '10-20%', min: 0.1, max: 0.2 },
      { range: '20-30%', min: 0.2, max: 0.3 },
      { range: '30-40%', min: 0.3, max: 0.4 },
      { range: '> 40%', min: 0.4, max: 1 }
    ];

    const profitMarginDistribution = profitRanges.map(range => {
      const count = analyses.filter(a => 
        a.analysis.profitMargin >= range.min && a.analysis.profitMargin < range.max
      ).length;
      return {
        range: range.range,
        count,
        percentage: (count / totalAnalyses) * 100,
      };
    });

    setStats({
      totalAnalyses,
      avgProfitMargin,
      totalRevenue,
      profitableProducts,
      avgSuggestedCost,
      categoryDistribution,
      profitMarginDistribution,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard de Análises</h2>
        <p className="text-gray-600">Visão geral dos produtos analisados</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">produtos analisados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(stats.avgProfitMargin)}</div>
            <p className="text-xs text-muted-foreground">margem de lucro média</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">receita líquida projetada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Lucrativos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.profitableProducts}
              <span className="text-sm font-normal text-gray-500">/{stats.totalAnalyses}</span>
            </div>
            <p className="text-xs text-muted-foreground">com margem ≥ 30%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profit Margin Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Distribuição de Margens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.profitMarginDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} produtos`, 'Quantidade']}
                    labelFormatter={(label) => `Margem: ${label}`}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Categorias Analisadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {stats.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Cards */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Custo médio sugerido:</span>
                <span className="font-semibold">{formatCurrency(stats.avgSuggestedCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Receita total projetada:</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de produtos lucrativos:</span>
                <Badge variant={stats.totalAnalyses > 0 && (stats.profitableProducts / stats.totalAnalyses) >= 0.5 ? 'default' : 'secondary'}>
                  {stats.totalAnalyses > 0 ? formatPercentage(stats.profitableProducts / stats.totalAnalyses) : '0%'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.avgProfitMargin >= 0.30 && (
                <div className="flex items-start gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <Target className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">Excelente performance! Margem média acima do target.</span>
                </div>
              )}
              
              {stats.avgProfitMargin < 0.20 && (
                <div className="flex items-start gap-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                  <Activity className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">Considere focar em produtos com maior margem de lucro.</span>
                </div>
              )}

              {stats.profitableProducts / stats.totalAnalyses < 0.5 && stats.totalAnalyses > 0 && (
                <div className="flex items-start gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <Package className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">Menos de 50% dos produtos atingem a meta de 30% de lucro.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}