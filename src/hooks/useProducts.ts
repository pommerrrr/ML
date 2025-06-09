import { useState, useCallback } from 'react';
import { MLProduct, ProductAnalysis } from '../types/product';
import { mlService } from '../services/mercadoLivre';
import { dbService } from '../services/database';

export interface UseProductsReturn {
  products: MLProduct[];
  analyses: ProductAnalysis[];
  loading: boolean;
  error: string | null;
  searchProducts: (query: string) => Promise<void>;
  searchBestSellers: (category?: string) => Promise<void>;
  analyzeProduct: (product: MLProduct) => Promise<void>;
  analyzeAllProducts: () => Promise<void>;
  loadSavedAnalyses: () => Promise<void>;
  clearProducts: () => void;
  deleteAnalysis: (id: string) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<MLProduct[]>([]);
  const [analyses, setAnalyses] = useState<ProductAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await mlService.searchProducts(query, 50);
      setProducts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBestSellers = useCallback(async (category?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await mlService.searchBestSellers(category, 50);
      setProducts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar mais vendidos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeProduct = useCallback(async (product: MLProduct) => {
    try {
      const analysis = await mlService.analyzeProduct(product);
      
      // Salva no Firebase
      await dbService.saveAnalysis(analysis);
      
      // Adiciona à lista local
      setAnalyses(prev => [analysis, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar produto');
    }
  }, []);

  const analyzeAllProducts = useCallback(async () => {
    if (products.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newAnalyses: ProductAnalysis[] = [];
      
      for (const product of products) {
        const analysis = await mlService.analyzeProduct(product);
        await dbService.saveAnalysis(analysis);
        newAnalyses.push(analysis);
      }
      
      setAnalyses(prev => [...newAnalyses, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar produtos');
    } finally {
      setLoading(false);
    }
  }, [products]);

  const loadSavedAnalyses = useCallback(async () => {
    setLoading(true);
    
    try {
      const savedAnalyses = await dbService.getAnalyses();
      setAnalyses(savedAnalyses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar análises');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAnalysis = useCallback(async (id: string) => {
    try {
      await dbService.deleteAnalysis(id);
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar análise');
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
  }, []);

  return {
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
  };
}