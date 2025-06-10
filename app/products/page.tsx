'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Package, 
  Search, 
  ExternalLink, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Trash2,
  Filter
} from 'lucide-react';
import { ProductAnalysis } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductAnalysis[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'winning' | 'losing'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSearchProducts();
  }, [products, searchTerm, filterStatus]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/analysis?limit=100');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.analyses || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchProducts = () => {
    let filtered = products;

    // Filtrar por status
    if (filterStatus === 'winning') {
      filtered = filtered.filter(p => p.isWinning);
    } else if (filterStatus === 'losing') {
      filtered = filtered.filter(p => !p.isWinning);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta análise?')) {
      return;
    }

    try {
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const getStatusColor = (isWinning: boolean) => {
    return isWinning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 30) return 'text-green-600';
    if (margin >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos Analisados</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas análises de produtos salvos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={fetchProducts} 
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
          
          <Link href="/analysis">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Package className="h-4 w-4 mr-2" />
              Analisar Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome do produto ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por status */}
            <div className="flex space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'winning' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('winning')}
                size="sm"
              >
                Ganhando
              </Button>
              <Button
                variant={filterStatus === 'losing' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('losing')}
                size="sm"
              >
                Perdendo
              </Button>
            </div>
          </div>

          {/* Resumo dos filtros */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredProducts.length} de {products.length} produtos
            </span>
            {(searchTerm || filterStatus !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de produtos */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          // Estado vazio
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? 'Nenhum produto analisado' : 'Nenhum produto encontrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {products.length === 0 
                  ? 'Comece analisando seu primeiro produto do Mercado Livre'
                  : 'Tente ajustar os filtros ou termos de busca'
                }
              </p>
              {products.length === 0 && (
                <Link href="/analysis">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Package className="h-4 w-4 mr-2" />
                    Analisar Primeiro Produto
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          // Lista de produtos
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <span>ID: {product.productId}</span>
                          <span>•</span>
                          <span>{formatCurrency(product.currentPrice)}</span>
                          <span>•</span>
                          <span>{product.soldQuantity} vendidos</span>
                          <span>•</span>
                          <span>
                            Atualizado: {format(new Date(product.lastUpdated), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Margem de Lucro</p>
                            <div className={`flex items-center space-x-1 ${getProfitMarginColor(product.profitMargin)}`}>
                              {product.profitMargin >= 30 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <span className="font-medium">
                                {product.profitMargin.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Valor Líquido</p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(product.netReceived)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Custo Máximo</p>
                            <p className="font-medium text-blue-600">
                              {formatCurrency(product.recommendedCostPrice)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <Badge className={getStatusColor(product.isWinning)}>
                              {product.isWinning ? 'Ganhando' : 'Perdendo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <a
                      href={`https://produto.mercadolivre.com.br/${product.productId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}