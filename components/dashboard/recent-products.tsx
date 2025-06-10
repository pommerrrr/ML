'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ProductAnalysis } from '../../types';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface RecentProductsProps {
  products: ProductAnalysis[];
  loading?: boolean;
}

export function RecentProducts({ products, loading }: RecentProductsProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Produtos Analisados Recentemente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum produto analisado ainda</p>
            <Link href="/analysis" className="text-blue-600 hover:underline mt-2 inline-block">
              Analisar primeiro produto
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                    {product.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>R$ {product.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>•</span>
                    <span>{product.soldQuantity} vendidos</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      product.profitMargin >= 30 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.profitMargin >= 30 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {product.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">margem</p>
                  </div>
                  
                  <Badge variant={product.isWinning ? 'default' : 'secondary'}>
                    {product.isWinning ? 'Ganhando' : 'Perdendo'}
                  </Badge>
                  
                  <Link
                    href={`https://mercadolivre.com.br/p/${product.productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}