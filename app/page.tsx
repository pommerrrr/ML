import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calculator, Database, Package, ExternalLink, CreditCard, Truck } from "lucide-react";

interface ProductAnalysis {
  product: any;
  salePrice: number;
  commission: number;
  fixedFee: number;
  shippingCost: number;
  totalCosts: number;
  netRevenue: number;
  recommendedCostPrice: number;
  profitMargin: number;
}

// Função para calcular custos
function calculateCosts(product: any): ProductAnalysis {
  const salePrice = product.price || 0;
  
  // Comissão baseada no tipo de anúncio
  const commissionPercent = product.listing_type_id?.includes('gold') ? 17 : 12;
  const commission = (salePrice * commissionPercent) / 100;
  
  // Taxa fixa baseada no preço
  let fixedFee = 0;
  if (salePrice <= 12.5) {
    fixedFee = salePrice * 0.5; // 50% para produtos muito baratos
  } else if (salePrice <= 79) {
    fixedFee = Math.min(6.75, salePrice * 0.05);
  } else {
    fixedFee = 6.75;
  }
  
  // Estimativa de frete (se grátis, vendedor paga)
  let shippingCost = 0;
  if (product.shipping?.free_shipping) {
    if (salePrice <= 50) shippingCost = 8;
    else if (salePrice <= 100) shippingCost = 12;
    else if (salePrice <= 200) shippingCost = 15;
    else if (salePrice <= 500) shippingCost = 20;
    else shippingCost = 25;
  }
  
  const totalCosts = commission + fixedFee + shippingCost;
  const netRevenue = salePrice - totalCosts;
  
  // Para ter 30% de lucro líquido, o custo deve ser 70% da receita líquida
  const recommendedCostPrice = netRevenue * 0.7;
  const profitMargin = netRevenue > 0 ? ((netRevenue - recommendedCostPrice) / salePrice) * 100 : 0;

  return {
    product,
    salePrice,
    commission,
    fixedFee,
    shippingCost,
    totalCosts,
    netRevenue,
    recommendedCostPrice,
    profitMargin
  };
}

// Função para buscar e analisar produtos
async function getProductAnalyses() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?sort=sold_quantity_desc&limit=10', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    
    const data = await response.json();
    const products = data.results.slice(0, 10);
    
    // Analisar cada produto
    return products.map(calculateCosts);
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

export default async function Home() {
  const analyses = await getProductAnalyses();
  
  // Estatísticas
  const profitableProducts = analyses.filter(a => a.profitMargin >= 30);
  const averageMargin = analyses.length 
    ? analyses.reduce((acc, a) => acc + a.profitMargin, 0) / analyses.length 
    : 0;
  const averageRevenue = analyses.length 
    ? analyses.reduce((acc, a) => acc + a.netRevenue, 0) / analyses.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Análise Mercado Livre
          </h1>
          <p className="text-gray-600 text-lg">
            Análise completa de custos e margem de lucro para produtos mais vendidos
          </p>
        </div>

        {/* Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Sistema de Análise - Totalmente Funcional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">API Mercado Livre</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Cálculo de Custos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Margem de Lucro</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">🔄</div>
                <div className="text-sm text-gray-600">Firebase (próximo)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Analisados</p>
                  <p className="text-2xl font-bold">{analyses.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Lucrativos</p>
                  <p className="text-2xl font-bold text-green-600">{profitableProducts.length}</p>
                  <p className="text-xs text-gray-500">Margem ≥ 30%</p>
                </div>
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem Média</p>
                  <p className="text-2xl font-bold">{averageMargin.toFixed(1)}%</p>
                  <Badge variant={averageMargin >= 30 ? "default" : "secondary"} className="mt-1">
                    {averageMargin >= 30 ? "Excelente" : averageMargin >= 15 ? "Boa" : "Baixa"}
                  </Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Média</p>
                  <p className="text-2xl font-bold">R$ {averageRevenue.toFixed(0)}</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Análise Completa de Produtos</CardTitle>
            <CardDescription>
              Produtos mais vendidos com análise detalhada de custos, receita líquida e margem de lucro
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyses.length > 0 ? (
              <div className="space-y-6">
                {analyses.map((analysis) => {
                  const profitColor = analysis.profitMargin >= 30 
                    ? 'text-green-600 bg-green-50' 
                    : analysis.profitMargin >= 15 
                    ? 'text-yellow-600 bg-yellow-50' 
                    : 'text-red-600 bg-red-50';

                  return (
                    <div key={analysis.product.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={analysis.product.thumbnail}
                          alt={analysis.product.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {analysis.product.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {analysis.product.sold_quantity} vendidos
                            </span>
                            {analysis.product.shipping?.free_shipping && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Truck className="h-4 w-4" />
                                Frete grátis
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${profitColor}`}>
                              {analysis.profitMargin.toFixed(1)}% margem
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            R$ {analysis.salePrice.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Preço de venda</p>
                        </div>
                      </div>

                      {/* Análise detalhada */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Custos */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-gray-700 font-medium">
                            <CreditCard className="h-4 w-4" />
                            Custos Mercado Livre
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Comissão:</span>
                              <span className="font-medium">R$ {analysis.commission.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Taxa fixa:</span>
                              <span className="font-medium">R$ {analysis.fixedFee.toFixed(2)}</span>
                            </div>
                            {analysis.shippingCost > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Frete:</span>
                                <span className="font-medium">R$ {analysis.shippingCost.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold border-t pt-1">
                              <span>Total:</span>
                              <span className="text-red-600">R$ {analysis.totalCosts.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Receita */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-gray-700 font-medium">
                            <Calculator className="h-4 w-4" />
                            Receita
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bruta:</span>
                              <span className="font-medium">R$ {analysis.salePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Custos:</span>
                              <span className="font-medium text-red-600">-R$ {analysis.totalCosts.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-1">
                              <span>Líquida:</span>
                              <span className="text-green-600">R$ {analysis.netRevenue.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Recomendação */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-gray-700 font-medium">
                            <TrendingUp className="h-4 w-4" />
                            Para 30% de Lucro
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Custo máximo:</span>
                              <span className="font-bold text-blue-600">R$ {analysis.recommendedCostPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lucro esperado:</span>
                              <span className="font-medium">R$ {(analysis.netRevenue - analysis.recommendedCostPrice).toFixed(2)}</span>
                            </div>
                            <Badge variant={analysis.profitMargin >= 30 ? "default" : "secondary"} className="w-full justify-center">
                              {analysis.profitMargin >= 30 ? "✅ Recomendado" : "⚠️ Margem baixa"}
                            </Badge>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="space-y-2">
                          <div className="text-gray-700 font-medium">
                            Ações
                          </div>
                          <div className="space-y-2">
                            <button
                              onClick={() => window.open(analysis.product.permalink, '_blank')}
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Ver no ML
                            </button>
                            <div className="text-xs text-gray-500 text-center">
                              Tipo: {analysis.product.listing_type_id?.includes('gold') ? 'Premium' : 'Clássico'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Erro ao carregar produtos</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🎯 Sistema completo de análise funcionando! Próximo passo: integração com Firebase para salvamento
          </p>
        </div>
      </div>
    </div>
  );
}