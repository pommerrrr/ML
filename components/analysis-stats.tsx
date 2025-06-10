'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostAnalysis } from '@/lib/mercado-livre';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calculator, DollarSign } from 'lucide-react';

interface AnalysisStatsProps {
  analyses: CostAnalysis[];
}

export function AnalysisStats({ analyses }: AnalysisStatsProps) {
  if (!analyses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <TrendingUp className=\"h-5 w-5\" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=\"text-center py-8 text-gray-500\">
            <Calculator className=\"h-12 w-12 mx-auto mb-4 opacity-50\" />
            <p>Análise produtos para ver estatísticas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dados para gráfico de barras - distribuição por faixa de margem
  const marginRanges = [
    { range: '0-15%', count: 0, color: '#ef4444' },
    { range: '15-30%', count: 0, color: '#f59e0b' },
    { range: '30-50%', count: 0, color: '#10b981' },
    { range: '50%+', count: 0, color: '#06b6d4' },
  ];

  analyses.forEach(analysis => {
    if (analysis.profitMargin < 15) marginRanges[0].count++;
    else if (analysis.profitMargin < 30) marginRanges[1].count++;
    else if (analysis.profitMargin < 50) marginRanges[2].count++;
    else marginRanges[3].count++;
  });

  // Dados para gráfico de pizza - tipo de anúncio
  const adTypes = [
    { name: 'Premium', value: 0, color: '#8b5cf6' },
    { name: 'Clássico', value: 0, color: '#06b6d4' },
  ];

  analyses.forEach(analysis => {
    if (analysis.product.listing_type_id.includes('gold')) {
      adTypes[0].value++;
    } else {
      adTypes[1].value++;
    }
  });

  // Estatísticas resumidas
  const avgMargin = analyses.reduce((acc, a) => acc + a.profitMargin, 0) / analyses.length;
  const avgRevenue = analyses.reduce((acc, a) => acc + a.netRevenue, 0) / analyses.length;
  const profitableCount = analyses.filter(a => a.profitMargin >= 30).length;

  return (
    <div className=\"space-y-6\">
      {/* Resumo rápido */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <TrendingUp className=\"h-5 w-5\" />
            Resumo da Análise
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          <div className=\"grid grid-cols-1 gap-4\">
            <div className=\"text-center p-4 bg-blue-50 rounded-lg\">
              <div className=\"text-2xl font-bold text-blue-600\">{avgMargin.toFixed(1)}%</div>
              <div className=\"text-sm text-gray-600\">Margem Média</div>
            </div>
            
            <div className=\"text-center p-4 bg-green-50 rounded-lg\">
              <div className=\"text-2xl font-bold text-green-600\">R$ {avgRevenue.toFixed(0)}</div>
              <div className=\"text-sm text-gray-600\">Receita Líquida Média</div>
            </div>
            
            <div className=\"text-center p-4 bg-purple-50 rounded-lg\">
              <div className=\"text-2xl font-bold text-purple-600\">{profitableCount}</div>
              <div className=\"text-sm text-gray-600\">Produtos Lucrativos (≥30%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de distribuição por margem */}
      <Card>
        <CardHeader>
          <CardTitle className=\"text-base\">Distribuição por Margem</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width=\"100%\" height={200}>
            <BarChart data={marginRanges}>
              <CartesianGrid strokeDasharray=\"3 3\" />
              <XAxis dataKey=\"range\" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar 
                dataKey=\"count\" 
                fill={(entry) => entry.color}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de tipos de anúncio */}
      {adTypes.some(type => type.value > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className=\"text-base\">Tipos de Anúncio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width=\"100%\" height={180}>
              <PieChart>
                <Pie
                  data={adTypes}
                  cx=\"50%\"
                  cy=\"50%\"
                  outerRadius={60}
                  dataKey=\"value\"
                  label={({ name, value }) => `${name}: ${value}`}
                  fontSize={12}
                >
                  {adTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top 3 produtos por margem */}
      <Card>
        <CardHeader>
          <CardTitle className=\"text-base flex items-center gap-2\">
            <DollarSign className=\"h-4 w-4\" />
            Top 3 Margens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=\"space-y-3\">
            {analyses
              .sort((a, b) => b.profitMargin - a.profitMargin)
              .slice(0, 3)
              .map((analysis, index) => (
                <div key={analysis.product.id} className=\"flex items-center gap-3\">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className=\"flex-1 min-w-0\">
                    <div className=\"text-sm font-medium line-clamp-1\">
                      {analysis.product.title}
                    </div>
                    <div className=\"text-xs text-gray-500\">
                      R$ {analysis.salePrice.toFixed(2)}
                    </div>
                  </div>
                  <div className=\"text-right\">
                    <div className=\"text-sm font-bold text-green-600\">
                      {analysis.profitMargin.toFixed(1)}%
                    </div>
                    <div className=\"text-xs text-gray-500\">
                      R$ {analysis.netRevenue.toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}