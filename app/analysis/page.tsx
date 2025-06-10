'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  Search, 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ProductAnalysis } from '../../types';

export default function AnalysisPage() {
  const [productUrl, setProductUrl] = useState('');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractProductId = (url: string): string | null => {
    // Extrair ID do produto da URL do Mercado Livre
    const patterns = [
      /\/p\/([A-Z0-9-]+)/,
      /\/([A-Z0-9-]+)$/,
      /item\/([A-Z0-9-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // Se for apenas o ID
    if (/^[A-Z0-9-]+$/.test(url.trim())) {
      return url.trim();
    }

    return null;
  };

  const handleAnalyze = async () => {
    if (!productUrl.trim()) {
      setError('Por favor, insira uma URL ou ID do produto');
      return;
    }

    const productId = extractProductId(productUrl);
    if (!productId) {
      setError('URL inválida. Use uma URL do Mercado Livre ou o ID do produto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar produto');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Erro ao analisar produto. Verifique se o ID/URL está correto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análise de Produtos</h1>
        <p className="text-gray-600 mt-1">
          Analise a rentabilidade de produtos do Mercado Livre
        </p>
      </div>

      {/* Formulário de análise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Analisar Produto</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-url">URL ou ID do Produto</Label>
            <div className="flex space-x-2">
              <Input
                id="product-url"
                placeholder="https://produto.mercadolivre.com.br/MLB-12345... ou MLB-12345..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Analisando...' : 'Analisar'}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultados da análise */}
      {analysis && (
        <div className="space-y-6">
          {/* Informações do produto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Informações do Produto</span>
                </div>
                <a
                  href={`https://produto.mercadolivre.com.br/${analysis.productId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {analysis.title}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Preço Atual</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(analysis.currentPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendidos</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {analysis.soldQuantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={analysis.isWinning ? 'default' : 'secondary'}>
                      {analysis.isWinning ? 'Ganhando' : 'Perdendo'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Concorrentes</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {analysis.competition.totalListings}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análise de custos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Análise de Custos e Margem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Breakdown de custos */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Breakdown de Custos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço de venda:</span>
                      <span className="font-medium">{formatCurrency(analysis.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>(-) Taxa do Mercado Livre:</span>
                      <span>-{formatCurrency(analysis.marketplaceFee)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>(-) Frete:</span>
                      <span>-{formatCurrency(analysis.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>(-) Publicidade:</span>
                      <span>-{formatCurrency(analysis.advertisingCost)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>Valor líquido recebido:</span>
                      <span>{formatCurrency(analysis.netReceived)}</span>
                    </div>
                  </div>
                </div>

                {/* Margem atual e recomendação */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className={`flex items-center justify-center space-x-2 mb-2 ${
                      analysis.profitMargin >= 30 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analysis.profitMargin >= 30 ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                      <span className="text-2xl font-bold">
                        {analysis.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Margem Atual</p>
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                      <span className="text-2xl font-bold">
                        {formatCurrency(analysis.recommendedCostPrice)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Custo Máximo para 30% de Margem</p>
                  </div>
                </div>

                {/* Alerta sobre margem */}
                <Alert variant={analysis.profitMargin >= 30 ? 'default' : 'destructive'}>
                  {analysis.profitMargin >= 30 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {analysis.profitMargin >= 30 ? (
                      <>
                        <strong>Excelente!</strong> Este produto atende ao objetivo de margem de 30%.
                        Para manter essa margem, pague no máximo {formatCurrency(analysis.recommendedCostPrice)} pelo produto.
                      </>
                    ) : (
                      <>
                        <strong>Atenção!</strong> A margem atual está abaixo dos 30% desejados.
                        Para atingir 30% de margem, você deveria pagar no máximo {formatCurrency(analysis.recommendedCostPrice)} pelo produto.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Informações da concorrência */}
          <Card>
            <CardHeader>
              <CardTitle>Análise da Concorrência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de Anúncios</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analysis.competition.totalListings}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preço Médio</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(analysis.competition.averagePrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Menor Preço</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(analysis.competition.lowestPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}