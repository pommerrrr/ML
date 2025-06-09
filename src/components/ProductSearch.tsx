import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { mlService } from '../services/mercadoLivre';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onSearchBestSellers: (category?: string) => void;
  loading: boolean;
}

export function ProductSearch({ onSearch, onSearchBestSellers, loading }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
    loadSearchHistory();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await mlService.getPopularCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadSearchHistory = () => {
    const history = localStorage.getItem('search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const saveToHistory = (searchTerm: string) => {
    const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      saveToHistory(query.trim());
    }
  };

  const handleBestSellers = () => {
    onSearchBestSellers(selectedCategory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Search className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Buscar Produtos</h2>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Digite o produto que deseja analisar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="h-12 px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      {/* Best Sellers Button */}
      <div className="border-t pt-4">
        <Button 
          onClick={handleBestSellers}
          disabled={loading}
          variant="outline"
          className="w-full h-12"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Buscar Mais Vendidos
          {selectedCategory && (
            <Badge variant="secondary" className="ml-2">
              Categoria selecionada
            </Badge>
          )}
        </Button>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Buscas recentes</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearHistory}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setQuery(term);
                  onSearch(term);
                }}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}