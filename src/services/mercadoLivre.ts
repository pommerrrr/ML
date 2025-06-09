import axios from 'axios';
import { MLProduct, MLSearchResponse, ProductAnalysis, CostCalculation } from '../types/product';

const ML_API_BASE = 'https://api.mercadolibre.com';

class MercadoLivreService {
  private api = axios.create({
    baseURL: ML_API_BASE,
    timeout: 10000,
  });

  // Busca produtos mais vendidos por categoria
  async searchBestSellers(category: string = '', limit: number = 50): Promise<MLProduct[]> {
    try {
      const response = await this.api.get<MLSearchResponse>('/sites/MLB/search', {
        params: {
          category: category || undefined,
          sort: 'sold_quantity_desc',
          limit,
          condition: 'new',
          shipping_cost: 'free',
        },
      });

      return response.data.results.filter(product => 
        product.sold_quantity > 10 && // Mínimo de vendas
        product.price > 0
      );
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos do Mercado Livre');
    }
  }

  // Busca produtos por termo
  async searchProducts(query: string, limit: number = 50): Promise<MLProduct[]> {
    try {
      const response = await this.api.get<MLSearchResponse>('/sites/MLB/search', {
        params: {
          q: query,
          sort: 'sold_quantity_desc',
          limit,
          condition: 'new',
        },
      });

      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }

  // Calcula custos e margens
  calculateCosts(product: MLProduct, config: Partial<CostCalculation> = {}): ProductAnalysis['analysis'] {
    const sellingPrice = product.price;
    const mlFeePercentage = config.mlFeePercentage || 0.12; // 12% média
    const shippingCost = config.shippingCost || (product.shipping.free_shipping ? 15 : 0); // Estimativa
    const premiumAdCost = config.premiumAdCost || sellingPrice * 0.05; // 5% para anúncio premium
    const targetProfitMargin = config.targetProfitMargin || 0.30; // 30%

    const mlFees = sellingPrice * mlFeePercentage;
    const totalCosts = mlFees + shippingCost + premiumAdCost;
    const netRevenue = sellingPrice - totalCosts;
    
    // Preço máximo que pode pagar pelo produto para ter 30% de lucro
    const suggestedMaxCost = netRevenue / (1 + targetProfitMargin);
    const profitMargin = suggestedMaxCost > 0 ? (netRevenue - suggestedMaxCost) / netRevenue : 0;

    return {
      sellingPrice,
      mlFees,
      shippingCost,
      premiumAdCost,
      totalCosts,
      netRevenue,
      suggestedMaxCost: Math.max(0, suggestedMaxCost),
      profitMargin,
      targetProfitMargin,
    };
  }

  // Analisa um produto completo
  async analyzeProduct(product: MLProduct, config?: Partial<CostCalculation>): Promise<ProductAnalysis> {
    const analysis = this.calculateCosts(product, config);
    
    return {
      id: product.id,
      product,
      analysis,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Busca categorias populares
  async getPopularCategories(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await this.api.get('/sites/MLB/categories');
      
      // Retorna as principais categorias
      return response.data
        .filter((cat: any) => cat.name && !cat.name.includes('Mais vendidos'))
        .slice(0, 20)
        .map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        }));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }
}

export const mlService = new MercadoLivreService();