'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './product-card';
import { AnalysisStats } from './analysis-stats';
import { SavedAnalyses } from './saved-analyses';
import { useProducts, useCategories } from '@/hooks/use-products';
import { useFirebaseAnalyses } from '@/hooks/use-firebase';
import { RefreshCw, TrendingUp, Calculator, Database } from 'lucide-react';

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limit, setLimit] = useState(20);
  
  const { data: products, isLoading: productsLoading, refetch } = useProducts(selectedCategory, limit);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { analyses: savedAnalyses, loading: savedLoading } = useFirebaseAnalyses();

  const handleRefresh = () => {
    refetch();
  };

  const profitableProducts = products?.filter(p => p.profitMargin >= 30) || [];
  const averageMargin = products?.length 
    ? products.reduce((acc, p) => acc + p.profitMargin, 0) / products.length 
    : 0;

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50\">
      <div className=\"container mx-auto px-4 py-8\">
        {/* Header */}
        <div className=\"mb-8\">
          <h1 className=\"text-4xl font-bold text-gray-900 mb-2\">
            Análise Mercado Livre
          </h1>
          <p className=\"text-gray-600 text-lg\">
            Descubra os produtos mais vendidos e calcule sua margem de lucro ideal
          </p>
        </div>

        {/* Controls */}
        <Card className=\"mb-8\">
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Calculator className=\"h-5 w-5\" />
              Filtros de Análise
            </CardTitle>
            <CardDescription>
              Configure os parâmetros para buscar produtos e analisar custos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"flex flex-wrap gap-4 items-end\">
              <div className=\"flex-1 min-w-[200px]\">
                <label className=\"text-sm font-medium mb-2 block\">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder=\"Todas as categorias\" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"\">Todas as categorias</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className=\"min-w-[120px]\">
                <label className=\"text-sm font-medium mb-2 block\">Limite</label>
                <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"10\">10 produtos</SelectItem>
                    <SelectItem value=\"20\">20 produtos</SelectItem>
                    <SelectItem value=\"50\">50 produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleRefresh} 
                disabled={productsLoading}
                className=\"bg-blue-600 hover:bg-blue-700\"
              >
                {productsLoading ? (
                  <RefreshCw className=\"h-4 w-4 animate-spin\" />
                ) : (
                  <RefreshCw className=\"h-4 w-4\" />
                )}
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-6 mb-8\">
          <Card>
            <CardContent className=\"p-6\">
              <div className=\"flex items-center justify-between\">
                <div>
                  <p className=\"text-sm font-medium text-gray-600\">Produtos Analisados</p>
                  <p className=\"text-2xl font-bold\">{products?.length || 0}</p>
                </div>
                <TrendingUp className=\"h-8 w-8 text-blue-600\" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className=\"p-6\">
              <div className=\"flex items-center justify-between\">
                <div>
                  <p className=\"text-sm font-medium text-gray-600\">Produtos Lucrativos</p>
                  <p className=\"text-2xl font-bold text-green-600\">{profitableProducts.length}</p>
                  <p className=\"text-xs text-gray-500\">Margem ≥ 30%</p>
                </div>
                <Calculator className=\"h-8 w-8 text-green-600\" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className=\"p-6\">
              <div className=\"flex items-center justify-between\">
                <div>
                  <p className=\"text-sm font-medium text-gray-600\">Margem Média</p>
                  <p className=\"text-2xl font-bold\">{averageMargin.toFixed(1)}%</p>
                  <Badge variant={averageMargin >= 30 ? \"default\" : \"secondary\"} className=\"mt-1\">
                    {averageMargin >= 30 ? \"Boa\" : \"Baixa\"}
                  </Badge>
                </div>
                <TrendingUp className=\"h-8 w-8 text-orange-600\" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className=\"p-6\">
              <div className=\"flex items-center justify-between\">
                <div>
                  <p className=\"text-sm font-medium text-gray-600\">Análises Salvas</p>
                  <p className=\"text-2xl font-bold\">{savedAnalyses.length}</p>
                </div>
                <Database className=\"h-8 w-8 text-purple-600\" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-8\">
          {/* Products List */}
          <div className=\"lg:col-span-2\">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                  Análise de custos e margem de lucro para produtos catalogados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className=\"space-y-4\">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className=\"flex gap-4\">
                        <Skeleton className=\"h-20 w-20 rounded\" />
                        <div className=\"flex-1 space-y-2\">
                          <Skeleton className=\"h-4 w-3/4\" />
                          <Skeleton className=\"h-4 w-1/2\" />
                          <Skeleton className=\"h-6 w-1/4\" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products?.length ? (
                  <div className=\"space-y-4\">
                    {products.map((analysis) => (
                      <ProductCard 
                        key={analysis.product.id} 
                        analysis={analysis} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className=\"text-center py-8 text-gray-500\">
                    <TrendingUp className=\"h-12 w-12 mx-auto mb-4 opacity-50\" />
                    <p>Nenhum produto encontrado</p>
                    <p className=\"text-sm\">Tente alterar os filtros ou atualizar a pesquisa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className=\"space-y-6\">
            <AnalysisStats analyses={products || []} />
            <SavedAnalyses />
          </div>
        </div>
      </div>
    </div>
  );
}