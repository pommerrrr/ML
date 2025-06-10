'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package
} from 'lucide-react';
import { ProductAnalysis, DashboardStats } from '../../types';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ReportsPage() {
  const [products, setProducts] = useState<ProductAnalysis[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, statsResponse] = await Promise.all([
        fetch('/api/analysis?limit=1000'),
        fetch('/api/dashboard')
      ]);

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.analyses || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Preparar dados para gráficos
  const profitMarginData = products.reduce((acc, product) => {
    const range = product.profitMargin >= 30 ? '30%+' :
                  product.profitMargin >= 20 ? '20-30%' :
                  product.profitMargin >= 10 ? '10-20%' :
                  product.profitMargin >= 0 ? '0-10%' : 'Negativa';
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const profitMarginChartData = Object.entries(profitMarginData).map(([range, count]) => ({
    range,
    count,
    percentage: ((count / products.length) * 100).toFixed(1)
  }));

  const priceRangeData = products.reduce((acc, product) => {
    const range = product.currentPrice >= 1000 ? 'R$ 1000+' :
                  product.currentPrice >= 500 ? 'R$ 500-1000' :
                  product.currentPrice >= 200 ? 'R$ 200-500' :
                  product.currentPrice >= 100 ? 'R$ 100-200' :
                  product.currentPrice >= 50 ? 'R$ 50-100' : 'R$ 0-50';
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priceRangeChartData = Object.entries(priceRangeData).map(([range, count]) => ({
    range,
    count
  }));

  // Análise temporal (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), i));
    return {
      date,
      dateStr: format(date, 'dd/MM', { locale: ptBR }),
      products: products.filter(p => {
        const productDate = startOfDay(new Date(p.lastUpdated));
        return productDate.getTime() === date.getTime();
      }).length
    };
  }).reverse();

  const winningProducts = products.filter(p => p.isWinning).length;
  const losingProducts = products.filter(p => !p.isWinning).length;
  const averageMargin = products.length > 0 
    ? products.reduce((sum, p) => sum + p.profitMargin, 0) / products.length 
    : 0;
  const totalRevenue = products.reduce((sum, p) => sum + p.netReceived, 0);

  const statusData = [
    { name: 'Ganhando', value: winningProducts, color: '#10b981' },
    { name: 'Perdendo', value: losingProducts, color: '#ef4444' }
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalProducts: products.length,
        winningProducts,
        losingProducts,
        averageMargin: averageMargin.toFixed(2),
        totalRevenue
      },
      products: products.map(p => ({
        id: p.productId,
        title: p.title,
        price: p.currentPrice,
        margin: p.profitMargin,
        netReceived: p.netReceived,
        isWinning: p.isWinning,
        lastUpdated: p.lastUpdated
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-mercadolivre-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Carregando dados...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">
            Análise detalhada dos seus produtos e performance
          </p>
        </div>
        
        <Button onClick={exportReport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Margem Média</p>
                <p className={`text-2xl font-bold ${
                  averageMargin >= 30 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {averageMargin.toFixed(1)}%
                </p>
              </div>
              {averageMargin >= 30 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {products.length > 0 ? ((winningProducts / products.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de distribuição de margens */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Margens de Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitMarginChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-blue-600">
                              Produtos: {payload[0].value}
                            </p>
                            <p className="text-gray-600">
                              {payload[0].payload.percentage}% do total
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de status dos produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Análise por faixa de preço */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos por Faixa de Preço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceRangeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Atividade dos últimos 7 dias */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateStr" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return format(data.date, 'dd/MM/yyyy', { locale: ptBR });
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="products" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top produtos por margem */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 - Produtos com Melhor Margem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products
              .sort((a, b) => b.profitMargin - a.profitMargin)
              .slice(0, 10)
              .map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.currentPrice)} • {product.soldQuantity} vendidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getProfitMarginColor(product.profitMargin)}`}>
                      {product.profitMargin.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(product.netReceived)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function getProfitMarginColor(margin: number) {
    if (margin >= 30) return 'text-green-600';
    if (margin >= 15) return 'text-yellow-600';
    return 'text-red-600';
  }
}