'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  TrendingUp, 
  Search, 
  ExternalLink, 
  RefreshCw,
  Filter
} from 'lucide-react';
import { TrendProduct } from '../../types';

interface SearchResult {
  id: string;
  title: string;
  price: number;
  sold_quantity: number;
  thumbnail: string;
  permalink: string;
  condition: string;
  shipping: {
    free_shipping: boolean;
  };
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendProduct[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/mercadolivre/trends');
      if (response.ok) {
        const data = await response.json();
        setTrends(data.trends || []);
      }
    } catch (error) {
      console.error('Erro ao buscar tendências:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(`/api/mercadolivre/search?q=${encodeURIComponent(query)}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setSelectedTrend(query);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleTrendClick = (trend: TrendProduct) => {
    searchProducts(trend.keyword);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchTerm);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tendências</h1>
          <p className="text-gray-600 mt-1">
            Produtos em alta no Mercado Livre
          </p>
        </div>
        
        <Button 
          onClick={fetchTrends} 
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
      </div>

      {/* Barra de pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Produtos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <Input
              placeholder="Digite o nome do produto que deseja pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={searching || !searchTerm.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {searching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de tendências */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Produtos em Tendência</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : trends.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Nenhuma tendência encontrada
                  </p>
                  <Button 
                    onClick={fetchTrends} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {trends.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendClick(trend)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedTrend === trend.keyword
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {trend.keyword}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      {trend.categoryName && (
                        <p className="text-xs text-gray-500 mt-1">
                          {trend.categoryName}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resultados da pesquisa */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>
                    {selectedTrend ? `Resultados para "${selectedTrend}"` : 'Produtos'}
                  </span>
                </div>
                {searchResults.length > 0 && (
                  <Badge variant="outline">
                    {searchResults.length} produtos
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searching ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedTrend || searchTerm 
                      ? 'Nenhum produto encontrado'
                      : 'Selecione uma tendência ou faça uma busca para ver os produtos'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-2 text-sm mb-2">
                            {product.title}
                          </h4>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-green-600">
                                {formatCurrency(product.price)}
                              </span>
                              <a
                                href={product.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{product.sold_quantity} vendidos</span>
                              <div className="flex space-x-1">
                                <Badge 
                                  variant={product.condition === 'new' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {product.condition === 'new' ? 'Novo' : 'Usado'}
                                </Badge>
                                {product.shipping.free_shipping && (
                                  <Badge variant="outline" className="text-xs">
                                    Frete grátis
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3"
                            onClick={() => {
                              window.open(`/analysis?product=${product.id}`, '_blank');
                            }}
                          >
                            Analisar Produto
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}