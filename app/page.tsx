"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calculator, Database, RefreshCw, Package, ExternalLink } from "lucide-react";

interface ProductAnalysis {
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    sold_quantity: number;
    permalink: string;
    listing_type_id: string;
    shipping: {
      free_shipping: boolean;
    };
  };
  salePrice: number;
  commission: number;
  fixedFee: number;
  shippingCost: number;
  totalCosts: number;
  netRevenue: number;
  recommendedCostPrice: number;
  profitMargin: number;
}

export default function Home() {
  const [products, setProducts] = useState<ProductAnalysis[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);

  // Carregar categorias
  useEffect(() => {
    fetch('/api/ml/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Buscar produtos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', limit.toString());
      
      const response = await fetch(`/api/ml/products?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const profitableProducts = products.filter(p => p.profitMargin >= 30);
  const averageMargin = products.length 
    ? products.reduce((acc, p) => acc + p.profitMargin, 0) / products.length 
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
            Descubra os produtos mais vendidos e calcule sua margem de lucro ideal
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Filtros de Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[120px]">
                <label className="text-sm font-medium mb-2 block">Limite</label>
                <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 produtos</SelectItem>
                    <SelectItem value="10">10 produtos</SelectItem>
                    <SelectItem value="20">20 produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={fetchProducts} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Buscar Produtos
              </Button>
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
                  <p className="text-2xl font-bold">{products.length}</p>
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
                    {averageMargin >= 30 ? "Boa" : "Baixa"}
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
                  <p className="text-sm font-medium text-gray-600">Análises Salvas</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Análise de custos e margem de lucro para produtos do Mercado Livre
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length ? (
              <div className="space-y-4">
                {products.map((analysis) => (
                  <div key={analysis.product.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={analysis.product.thumbnail}
                        alt={analysis.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2 mb-2">
                          {analysis.product.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Preço:</span>
                            <div className="font-semibold">R$ {analysis.salePrice.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Custos:</span>
                            <div className="font-semibold text-red-600">R$ {analysis.totalCosts.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Líquido:</span>
                            <div className="font-semibold text-green-600">R$ {analysis.netRevenue.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Custo máx:</span>
                            <div className="font-semibold text-blue-600">R$ {analysis.recommendedCostPrice.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={analysis.profitMargin >= 30 ? "default" : "secondary"}>
                              {analysis.profitMargin.toFixed(1)}% margem
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {analysis.product.sold_quantity} vendidos
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(analysis.product.permalink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Clique em "Buscar Produtos" para começar a análise!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}