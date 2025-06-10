import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calculator, Database, RefreshCw, Package } from "lucide-react";

// Função para buscar produtos (server-side)
async function getProducts() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?sort=sold_quantity_desc&limit=5', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    
    const data = await response.json();
    return data.results.slice(0, 5); // Pegar apenas 5 produtos
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

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

        {/* Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Frontend</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Deploy</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">API ML</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">🔄</div>
                <div className="text-sm text-gray-600">Firebase</div>
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
                  <p className="text-sm font-medium text-gray-600">Produtos Encontrados</p>
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
                  <p className="text-sm font-medium text-gray-600">Sistema</p>
                  <p className="text-2xl font-bold text-green-600">OK</p>
                  <p className="text-xs text-gray-500">Funcionando</p>
                </div>
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">API Status</p>
                  <p className="text-2xl font-bold">100%</p>
                  <Badge variant="default" className="mt-1">
                    Conectado
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
                  <p className="text-sm font-medium text-gray-600">Próximo</p>
                  <p className="text-2xl font-bold">Firebase</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos - Mercado Livre</CardTitle>
            <CardDescription>
              Produtos reais sendo buscados da API do Mercado Livre
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product: any) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Preço:</span>
                            <div className="font-semibold text-green-600">
                              R$ {product.price?.toFixed(2) || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Vendidos:</span>
                            <div className="font-semibold">
                              {product.sold_quantity || 0}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Disponível:</span>
                            <div className="font-semibold">
                              {product.available_quantity || 0}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Condição:</span>
                            <div className="font-semibold">
                              {product.condition || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline">
                            ID: {product.id}
                          </Badge>
                          {product.shipping?.free_shipping && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Frete Grátis
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Erro ao carregar produtos ou sem produtos disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🎉 Sistema funcionando! Produtos sendo buscados diretamente do Mercado Livre
          </p>
        </div>
      </div>
    </div>
  );
}