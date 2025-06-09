import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';
import { Loader2, BarChart3, Search, Calculator, RefreshCw } from 'lucide-react';
import { ProductSearch } from './components/ProductSearch';
import { ProductList } from './components/ProductList';
import { AnalysisList } from './components/AnalysisList';
import { Dashboard } from './components/Dashboard';
import { useProducts } from './hooks/useProducts';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const {
    products,
    analyses,
    loading,
    error,
    searchProducts,
    searchBestSellers,
    analyzeProduct,
    analyzeAllProducts,
    loadSavedAnalyses,
    clearProducts,
    deleteAnalysis,
  } = useProducts();

  useEffect(() => {
    loadSavedAnalyses();
  }, [loadSavedAnalyses]);

  const handleSearch = async (query: string) => {
    await searchProducts(query);
    setActiveTab('products');
  };

  const handleSearchBestSellers = async (category?: string) => {
    await searchBestSellers(category);
    setActiveTab('products');
  };

  const handleAnalyze = async (product: any) => {
    await analyzeProduct(product);
    setActiveTab('analyses');
  };

  const handleAnalyzeAll = async () => {
    await analyzeAllProducts();
    setActiveTab('analyses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Mercado Livre Analyzer
                </h1>
                <p className="text-sm text-gray-600">
                  Análise de produtos e margens de lucro
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSavedAnalyses}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed top-20 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Processando...
              </span>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Produtos</span>
              {products.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5 ml-1">
                  {products.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Análises</span>
              {analyses.length > 0 && (
                <span className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5 ml-1">
                  {analyses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search">
            <ProductSearch
              onSearch={handleSearch}
              onSearchBestSellers={handleSearchBestSellers}
              loading={loading}
            />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              {products.length > 0 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={clearProducts}
                  >
                    Limpar Produtos
                  </Button>
                </div>
              )}
              
              <ProductList
                products={products}
                onAnalyze={handleAnalyze}
                onAnalyzeAll={handleAnalyzeAll}
                loading={loading}
              />
            </div>
          </TabsContent>

          {/* Analyses Tab */}
          <TabsContent value="analyses">
            <AnalysisList
              analyses={analyses}
              onDelete={deleteAnalysis}
            />
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Dashboard analyses={analyses} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Mercado Livre Analyzer - Sistema de análise de produtos e margens
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Desenvolvido para otimizar suas vendas no Mercado Livre
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;