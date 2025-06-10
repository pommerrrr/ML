import { useQuery } from '@tanstack/react-query';
import { CostAnalysis } from '@/lib/mercado-livre';

interface ProductsResponse {
  success: boolean;
  data: CostAnalysis[];
  error?: string;
}

export function useProducts(category: string = '', limit: number = 20) {
  return useQuery({
    queryKey: ['products', category, limit],
    queryFn: async (): Promise<CostAnalysis[]> => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', limit.toString());
      
      const response = await fetch(`/api/ml/products?${params}`);
      const result: ProductsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar produtos');
      }
      
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // Atualizar a cada 10 minutos
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/ml/categories');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar categorias');
      }
      
      return result.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
}