'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Search, 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Filter,
  Grid,
  List,
  RefreshCw,
  Star
} from 'lucide-react';
import { ProductAnalysis, MercadoLivreProduct } from '../../types';

interface Filters {
  category: string;
  sortBy: string;
  priceRange: string;
  searchTerm: string;
}

export default function AnalysisPage() {
  const [products, setProducts] = useState<MercadoLivreProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MercadoLivreProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isUsingDemoProducts, setIsUsingDemoProducts] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    sortBy: 'sold_quantity_desc',
    priceRange: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchCatalogProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchCatalogProducts = async () => {
    setLoading(true);
    setDebugInfo('Iniciando busca de produtos...');
    
    try {
      console.log('Iniciando busca de produtos...');
      setDebugInfo('Conectando à API do Mercado Livre...');
      
      // Busca direta usando o novo endpoint híbrido
      const response = await fetch('/api/mercadolivre/catalog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const isDemoData = data.isDemo || data.source === 'demo_products';
          setIsUsingDemoProducts(isDemoData);
          
          setDebugInfo(`${data.results.length} produtos carregados (${isDemoData ? 'demonstração' : 'API real'})`);
          
          // Processar produtos
          const validProducts = data.results.filter(p => 
            p && p.id && p.title && p.price && p.price > 0
          );

          // Ordenar por quantidade vendida
          validProducts.sort((a, b) => (b.sold_quantity || 0) - (a.sold_quantity || 0));
          
          setProducts(validProducts);
          setDebugInfo(`✅ Sucesso! ${validProducts.length} produtos carregados${isDemoData ? ' (demonstração)' : ''}`);
          
          console.log('Produtos carregados:', validProducts.length);
        } else {
          throw new Error('Nenhum produto retornado da API');
        }
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setDebugInfo(`❌ Erro: ${error}. Recarregue a página para tentar novamente.`);
      
      // Em caso de erro total, mostrar mensagem clara
      setProducts([]);
    } finally {
      setLoading(false);
      
      // Limpar debug info após 5 segundos
      setTimeout(() => setDebugInfo(''), 5000);
    }
  };

  const fetchCategories = async () => {
    // Usar categorias fixas principais do Mercado Livre Brasil
    const mainCategories = [
      { id: 'MLB1055', name: 'Celulares e Telefones' },
      { id: 'MLB1648', name: 'Informática' },
      { id: 'MLB1051', name: 'Eletrônicos, Áudio e Vídeo' },
      { id: 'MLB1276', name: 'Esportes e Fitness' },
      { id: 'MLB1430', name: 'Roupas e Acessórios' },
      { id: 'MLB1574', name: 'Casa, Móveis e Decoração' },
      { id: 'MLB1132', name: 'Beleza e Cuidado Pessoal' },
      { id: 'MLB1384', name: 'Bebês' },
      { id: 'MLB1144', name: 'Carros, Motos e Outros' },
      { id: 'MLB1367', name: 'Livros, Revistas e Comics' },
      { id: 'MLB1196', name: 'Música, Filmes e Seriados' },
      { id: 'MLB1182', name: 'Ferramentas e Construção' },
      { id: 'MLB1500', name: 'Agro' },
      { id: 'MLB1953', name: 'Serviços' }
    ];
    
    setCategories(mainCategories);
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por categoria
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category_id === filters.category);
    }

    // Filtro por faixa de preço
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max && max !== 999999) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Filtro por busca
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        (p.product_name && p.product_name.toLowerCase().includes(searchLower))
      );
    }

    // Ordenação
    switch (filters.sortBy) {
      case 'sold_quantity_desc':
        filtered.sort((a, b) => (b.sold_quantity || 0) - (a.sold_quantity || 0));
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAnalyzeProduct = async (productId: string) => {
    setAnalyzing(productId);
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
    } catch (error) {
      console.error('Erro ao analisar produto:', error);
      alert('Erro ao analisar produto. Tente novamente.');
    } finally {
      setAnalyzing(null);
    }
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const getProductImage = (product: MercadoLivreProduct) => {
    // Tenta múltiplas fontes de imagem
    if (product.thumbnail) {
      // Converte para imagem de maior resolução
      let imageUrl = product.thumbnail
        .replace('-I.webp', '-F.webp')
        .replace('-S.webp', '-F.webp')
        .replace('-I.jpg', '-F.jpg')
        .replace('-S.jpg', '-F.jpg');
      
      // Garante que seja https
      if (imageUrl.startsWith('http:')) {
        imageUrl = imageUrl.replace('http:', 'https:');
      }
      
      return imageUrl;
    }
    
    // Fallback para placeholder personalizado baseado na categoria
    const categoryColors = {
      'MLB1055': '4f46e5/white', // Celulares - azul
      'MLB1648': '059669/white', // Informática - verde
      'MLB1051': 'dc2626/white', // Eletrônicos - vermelho
      'MLB1276': 'ea580c/white', // Esportes - laranja
      'MLB1430': 'c2410c/white', // Roupas - marrom
      'MLB1574': '7c3aed/white', // Casa - roxo
      'MLB1132': 'db2777/white', // Beleza - rosa
      'MLB1144': '0891b2/white', // Games - ciano
    };
    
    const color = categoryColors[product.category_id as keyof typeof categoryColors] || 'e5e7eb/6b7280';
    const shortTitle = product.title.slice(0, 20).replace(/[^a-zA-Z0-9 ]/g, '').trim();
    
    return `https://via.placeholder.com/400x300/${color}?text=${encodeURIComponent(shortTitle)}`;
  };

  const getProductLink = (product: MercadoLivreProduct) => {
    // Se for produto de demonstração (ID fictício), redireciona para busca
    if (isUsingDemoProducts || product.id.startsWith('MLB') && product.id.length > 15) {
      // Para produtos de demonstração, faz busca pelo título
      const searchQuery = encodeURIComponent(
        product.title.split(' ').slice(0, 3).join(' ')
      );
      return `https://lista.mercadolivre.com.br/${searchQuery}`;
    }
    
    // Para produtos reais da API, usa permalink original ou gera baseado no ID
    if (product.permalink && product.permalink.includes('mercadolivre.com.br')) {
      return product.permalink;
    }
    
    // Fallback para URL padrão do ML
    return `https://produto.mercadolivre.com.br/${product.id}`;
  };

  const handleExternalLink = (product: MercadoLivreProduct) => {
    if (isUsingDemoProducts) {
      // Mostra aviso para produtos de demonstração
      const confirmOpen = window.confirm(
        `🚨 ATENÇÃO: Este é um produto de demonstração!\n\n` +
        `O sistema irá redirecionar para uma busca por "${product.title.split(' ').slice(0, 3).join(' ')}" no Mercado Livre.\n\n` +
        `Deseja continuar?`
      );
      
      if (confirmOpen) {
        window.open(getProductLink(product), '_blank');
      }
    } else {
      // Para produtos reais, abre diretamente
      window.open(getProductLink(product), '_blank');
    }
  };

  const priceRanges = [
    { value: 'all', label: 'Todos os preços' },
    { value: '0-50', label: 'Até R$ 50' },
    { value: '50-100', label: 'R$ 50 - R$ 100' },
    { value: '100-500', label: 'R$ 100 - R$ 500' },
    { value: '500-1000', label: 'R$ 500 - R$ 1.000' },
    { value: '1000-999999', label: 'Acima de R$ 1.000' }
  ];

  const sortOptions = [
    { value: 'sold_quantity_desc', label: 'Mais vendidos' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'title_asc', label: 'Nome A-Z' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isUsingDemoProducts ? 'Produtos de Demonstração' : 'Produtos Catalogados Ativos'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isUsingDemoProducts 
              ? `Produtos para demonstração das funcionalidades - ${filteredProducts.length} produtos`
              : `Produtos catalogados e ativos do Mercado Livre - ${filteredProducts.length} produtos encontrados`
            }
          </p>
          {!isUsingDemoProducts && (
            <p className="text-xs text-gray-500 mt-1">
              🔍 <strong>Parâmetros de busca:</strong> Produtos catalogados (gold_special), condição nova, ordenação por vendas, 4 categorias principais + termos populares, até 200 produtos únicos
            </p>
          )}
          {isUsingDemoProducts && (
            <p className="text-xs text-orange-600 mt-1">
              📊 <strong>Demonstração:</strong> Produtos reais do ML para teste das funcionalidades (dados estáticos)
            </p>
          )}
          {debugInfo && (
            <p className="text-sm text-blue-600 mt-1 font-medium">
              {debugInfo}
            </p>
          )}
          {isUsingDemoProducts && (
            <div className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded">
              ⚠️ <strong>Modo demonstração:</strong> API do ML indisponível. Produtos para demonstração das funcionalidades.
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            onClick={fetchCatalogProducts}
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Aviso de demonstração */}
      {isUsingDemoProducts && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>⚠️ MODO DEMONSTRAÇÃO ATIVO</strong><br />
            Os produtos mostrados são para demonstração das funcionalidades do sistema. 
            Os links externos farão busca por produtos similares no Mercado Livre, não levando ao produto exato mostrado.
            <br />
            <span className="text-sm text-orange-600 mt-1 block">
              💡 A API do Mercado Livre pode estar temporariamente indisponível. Os dados e análises funcionam normalmente.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div>
              <Label>Buscar produto</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Nome do produto..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <Label>Ordenar por</Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Faixa de preço */}
            <div>
              <Label>Faixa de preço</Label>
              <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div>
              <Label>Categoria</Label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.slice(0, 10).map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de produtos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="w-full h-48 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className={`${viewMode === 'list' ? 'flex space-x-4' : 'space-y-3'}`}>
                  {/* Imagem */}
                  <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'} flex-shrink-0`}>
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="w-full h-full object-cover rounded bg-gray-100"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${encodeURIComponent(product.title.slice(0, 15))}`;
                      }}
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''} space-y-2`}>
                    <h3 className={`font-medium text-gray-900 line-clamp-2 ${
                      viewMode === 'list' ? 'text-lg' : 'text-sm'
                    }`}>
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(product.price)}
                      </span>
                      
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-medium">
                          {product.sold_quantity} vendidos
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant={product.condition === 'new' ? 'default' : 'secondary'} className="text-xs">
                        {product.condition === 'new' ? 'Novo' : 'Usado'}
                      </Badge>
                      
                      {product.shipping?.free_shipping && (
                        <Badge variant="outline" className="text-xs">
                          Frete grátis
                        </Badge>
                      )}

                      {product.listing_type_id === 'gold_special' && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                          Premium
                        </Badge>
                      )}

                      {product.sold_quantity >= 100 && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Mais vendido
                        </Badge>
                      )}

                      {product.sold_quantity >= 1000 && (
                        <Badge className="text-xs bg-red-100 text-red-800">
                          Top vendas
                        </Badge>
                      )}

                      {isUsingDemoProducts && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
                          🚨 Demonstração
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAnalyzeProduct(product.id)}
                        disabled={analyzing === product.id}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        {analyzing === product.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Calculator className="h-4 w-4 mr-1" />
                        )}
                        {analyzing === product.id ? 'Analisando...' : 'Analisar'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExternalLink(product)}
                        title={isUsingDemoProducts ? "Buscar produto similar no ML (demonstração)" : "Ver no Mercado Livre"}
                        className={isUsingDemoProducts ? "border-orange-300 text-orange-600 hover:bg-orange-50" : ""}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {isUsingDemoProducts && <span className="ml-1 text-xs">Demo</span>}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button onClick={fetchCatalogProducts} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar produtos
            </Button>
          </CardContent>
        </Card>
      )}

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