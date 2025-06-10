import axios from 'axios';
import { MercadoLivreProduct, TrendProduct } from '../types';

const MERCADOLIVRE_API_BASE = 'https://api.mercadolibre.com';

export class MercadoLivreAPI {
  private static instance: MercadoLivreAPI;
  private accessToken: string | null = null;

  public static getInstance(): MercadoLivreAPI {
    if (!MercadoLivreAPI.instance) {
      MercadoLivreAPI.instance = new MercadoLivreAPI();
    }
    return MercadoLivreAPI.instance;
  }

  // Buscar tendências por país (API pública)
  async getTrends(siteId: string = 'MLB'): Promise<TrendProduct[]> {
    try {
      const response = await axios.get(
        `${MERCADOLIVRE_API_BASE}/trends/${siteId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tendências:', error);
      throw new Error('Falha ao buscar tendências do Mercado Livre');
    }
  }

  // Buscar produtos por categoria
  async searchProducts(
    siteId: string = 'MLB',
    query?: string,
    categoryId?: string,
    limit: number = 50,
    sortBy?: string
  ): Promise<{ results: MercadoLivreProduct[] }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      if (query) params.append('q', query);
      if (categoryId) params.append('category', categoryId);
      if (sortBy) params.append('sort', sortBy);

      console.log(`Buscando no ML: ${MERCADOLIVRE_API_BASE}/sites/${siteId}/search?${params.toString()}`);
      
      const response = await axios.get(
        `${MERCADOLIVRE_API_BASE}/sites/${siteId}/search?${params.toString()}`,
        {
          timeout: 10000, // 10 segundos de timeout
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      console.log(`Resposta da API ML:`, response.status, response.data?.results?.length || 0);
      return response.data || { results: [] };
    } catch (error: any) {
      console.error('Erro detalhado ao buscar produtos:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        query,
        siteId
      });
      
      // Se der erro, retorna array vazio ao invés de lançar exceção
      return { results: [] };
    }
  }

  // Buscar detalhes de um produto específico
  async getProductDetail(itemId: string): Promise<MercadoLivreProduct> {
    try {
      const response = await axios.get(
        `${MERCADOLIVRE_API_BASE}/items/${itemId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do produto:', error);
      throw new Error('Falha ao buscar detalhes do produto');
    }
  }

  // Buscar informações de concorrência (preço para ganhar)
  async getCompetitionInfo(itemId: string) {
    try {
      const response = await axios.get(
        `${MERCADOLIVRE_API_BASE}/items/${itemId}/price_to_win`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações de concorrência:', error);
      return null;
    }
  }

  // Buscar categorias
  async getCategories(siteId: string = 'MLB') {
    try {
      const response = await axios.get(
        `${MERCADOLIVRE_API_BASE}/sites/${siteId}/categories`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw new Error('Falha ao buscar categorias');
    }
  }

  // Calcular custos e margens
  calculateProductAnalysis(
    product: MercadoLivreProduct,
    settings: {
      targetProfitMargin: number;
      shippingCostPercentage: number;
      marketplaceFeePercentage: number;
      advertisingCostPercentage: number;
      additionalCosts: number;
    }
  ) {
    const price = product.price;
    
    // Custos do Mercado Livre
    const shippingCost = price * (settings.shippingCostPercentage / 100);
    const marketplaceFee = price * (settings.marketplaceFeePercentage / 100);
    const advertisingCost = price * (settings.advertisingCostPercentage / 100);
    const totalCosts = shippingCost + marketplaceFee + advertisingCost + settings.additionalCosts;
    
    // Valor líquido recebido
    const netReceived = price - totalCosts;
    
    // Preço de custo recomendado para atingir a margem desejada
    const recommendedCostPrice = netReceived / (1 + settings.targetProfitMargin / 100);
    
    // Margem atual (assumindo custo zero para cálculo)
    const currentProfitMargin = ((netReceived / price) * 100);

    return {
      price,
      shippingCost,
      marketplaceFee,
      advertisingCost,
      totalCosts,
      netReceived,
      recommendedCostPrice,
      currentProfitMargin,
    };
  }
}