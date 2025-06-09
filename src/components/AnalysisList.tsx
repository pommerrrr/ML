import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Trash2,
  ExternalLink,
  Calculator,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ProductAnalysis } from '../types/product';

interface AnalysisListProps {
  analyses: ProductAnalysis[];
  onDelete: (id: string) => void;
}

export function AnalysisList({ analyses, onDelete }: AnalysisListProps) {
  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma análise realizada</h3>
        <p className="text-gray-500">
          Analise produtos para ver os cálculos de margem e custos aqui
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getProfitabilityStatus = (analysis: ProductAnalysis['analysis']) => {
    const profitMargin = (analysis.netRevenue - analysis.suggestedMaxCost) / analysis.netRevenue;
    
    if (profitMargin >= 0.30) {
      return { 
        status: 'excellent', 
        icon: CheckCircle, 
        text: 'Excelente margem',
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    } else if (profitMargin >= 0.20) {
      return { 
        status: 'good', 
        icon: TrendingUp, 
        text: 'Boa margem',
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    } else if (profitMargin >= 0.10) {
      return { 
        status: 'warning', 
        icon: AlertTriangle, 
        text: 'Margem baixa',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
      };
    } else {
      return { 
        status: 'poor', 
        icon: TrendingDown, 
        text: 'Margem ruim',
        color: 'text-red-600 bg-red-50 border-red-200'
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análises Realizadas</h2>
          <p className="text-gray-600 mt-1">
            {analyses.length} produtos analisados
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {analyses.map((analysis) => {
          const profitability = getProfitabilityStatus(analysis.analysis);
          const ProfitIcon = profitability.icon;
          
          return (
            <Card key={analysis.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={analysis.product.thumbnail}
                    alt={analysis.product.title}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyOEg1MlY1Mkg0MFYyOFoiIGZpbGw9IiNEMUQwRDUiLz4KPHBhdGggZD0iTTI4IDI4SDQwVjUySDI4VjI4WiIgZmlsbD0iI0QxRDBENSIvPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {analysis.product.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{format(analysis.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                      <Badge variant="outline" className={profitability.color}>
                        <ProfitIcon className="h-3 w-3 mr-1" />
                        {profitability.text}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(analysis.product.permalink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(analysis.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Preço de Venda */}
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-600 mb-1">Preço de Venda</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(analysis.analysis.sellingPrice)}
                    </div>
                  </div>

                  {/* Custos Totais */}
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Package className="h-5 w-5 text-red-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-red-600 mb-1">Custos Totais</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(analysis.analysis.totalCosts)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ML: {formatCurrency(analysis.analysis.mlFees)} • 
                      Frete: {formatCurrency(analysis.analysis.shippingCost)} • 
                      Ads: {formatCurrency(analysis.analysis.premiumAdCost)}
                    </div>
                  </div>

                  {/* Receita Líquida */}
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-600 mb-1">Receita Líquida</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(analysis.analysis.netRevenue)}
                    </div>
                  </div>

                  {/* Custo Máximo Sugerido */}
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calculator className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-600 mb-1">Custo Máximo</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(analysis.analysis.suggestedMaxCost)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Para 30% lucro
                    </div>
                  </div>
                </div>

                {/* Resumo da Margem */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Margem de Lucro Projetada:
                    </span>
                    <span className={`text-lg font-bold ${
                      analysis.analysis.profitMargin >= 0.30 ? 'text-green-600' :
                      analysis.analysis.profitMargin >= 0.20 ? 'text-blue-600' :
                      analysis.analysis.profitMargin >= 0.10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {formatPercentage(analysis.analysis.profitMargin)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Se comprar por até {formatCurrency(analysis.analysis.suggestedMaxCost)}, 
                    terá {formatPercentage(analysis.analysis.targetProfitMargin)} de lucro
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}