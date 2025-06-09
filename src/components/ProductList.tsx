import React from 'react';
import { ExternalLink, ShoppingCart, TrendingUp, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { MLProduct } from '../types/product';

interface ProductListProps {
  products: MLProduct[];
  onAnalyze: (product: MLProduct) => void;
  onAnalyzeAll: () => void;
  loading: boolean;
}

export function ProductList({ products, onAnalyze, onAnalyzeAll, loading }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
        <p className="text-gray-500">
          Use a busca acima para encontrar produtos para analisar
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)}k vendidos`;
    }
    return `${quantity} vendidos`;
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Produtos Encontrados
          </h2>
          <p className="text-gray-600 mt-1">
            {products.length} produtos encontrados
          </p>
        </div>
        <Button 
          onClick={onAnalyzeAll}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Analisar Todos
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBIMTMwVjEzMEgxMDBWNzBaIiBmaWxsPSIjRDFEMEQ1Ii8+CjxwYXRoIGQ9Ik03MCA3MEgxMDBWMTMwSDcwVjcwWiIgZmlsbD0iI0QxRDBENSIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                {product.title}
              </h3>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <Badge variant={product.condition === 'new' ? 'default' : 'secondary'}>
                  {product.condition === 'new' ? 'Novo' : 'Usado'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>{formatQuantity(product.sold_quantity)}</span>
              </div>
              
              {product.shipping.free_shipping && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Frete grátis
                </Badge>
              )}
            </CardContent>
            
            <CardFooter className="pt-3 gap-2">
              <Button
                onClick={() => onAnalyze(product)}
                disabled={loading}
                className="flex-1"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Analisar
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(product.permalink, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}