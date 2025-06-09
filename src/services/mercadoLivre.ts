import axios from 'axios';
import { MLProduct, MLSearchResponse, ProductAnalysis, CostCalculation } from '../types/product';

// Proxy CORS para desenvolvimento - em produção use um backend próprio
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const ML_API_BASE = 'https://api.mercadolibre.com';

class MercadoLivreService {
  private api = axios.create({
    timeout: 15000,
  });

  // Constrói URL com proxy CORS se necessário
  private buildUrl(endpoint: string): string {
    const fullUrl = `${ML_API_BASE}${endpoint}`;
    
    // Em desenvolvimento local, usa proxy CORS
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${CORS_PROXY}${encodeURIComponent(fullUrl)}`;
    }
    
    // Em produção, tenta direto primeiro (pode falhar por CORS)
    return fullUrl;
  }

  // Busca produtos mais vendidos por categoria
  async searchBestSellers(category: string = '', limit: number = 50): Promise<MLProduct[]> {
    try {
      const params = new URLSearchParams({
        sort: 'sold_quantity_desc',
        limit: limit.toString(),
        condition: 'new',
        shipping_cost: 'free',
      });
      
      if (category) {
        params.append('category', category);
      }

      const url = this.buildUrl(`/sites/MLB/search?${params.toString()}`);
      
      const response = await this.api.get<MLSearchResponse>(url);

      return response.data.results.filter(product => 
        product.sold_quantity > 10 && // Mínimo de vendas
        product.price > 0
      );
    } catch (error) {
      console.warn('Erro na API do ML, usando dados mock:', error);
      return this.getMockProducts();
    }
  }

  // Busca produtos por termo
  async searchProducts(query: string, limit: number = 50): Promise<MLProduct[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        sort: 'sold_quantity_desc',
        limit: limit.toString(),
        condition: 'new',
      });

      const url = this.buildUrl(`/sites/MLB/search?${params.toString()}`);
      
      const response = await this.api.get<MLSearchResponse>(url);

      return response.data.results;
    } catch (error) {
      console.warn('Erro na API do ML, usando dados mock:', error);
      return this.getMockProducts(query);
    }
  }

  // Dados mock para demonstração quando API falha
  private getMockProducts(query?: string): MLProduct[] {
    const searchTerm = query || 'Produto';
    
    const mockProducts: MLProduct[] = [
      {
        id: 'MLB123456789',
        title: `${searchTerm} - Smartphone Samsung Galaxy A54 128GB 6GB RAM Dual Sim`,
        price: 1299.99,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_742326-MLU54758317403_032023-V.webp',
        permalink: 'https://produto.mercadolivre.com.br/MLB-123456789',
        category_id: 'MLB1055',
        sold_quantity: 5847,
        condition: 'new',
        shipping: {
          free_shipping: true,
        },
        attributes: [
          { id: 'BRAND', name: 'Marca', value_name: 'Samsung' },
          { id: 'MODEL', name: 'Modelo', value_name: 'Galaxy A54' }
        ]
      },
      {
        id: 'MLB987654321',
        title: `${searchTerm} - Notebook Lenovo IdeaPad 3 15.6" Intel i5 8GB 256GB SSD`,
        price: 2899.90,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_985724-MLU69123456789_042023-V.webp',
        permalink: 'https://produto.mercadolivre.com.br/MLB-987654321',
        category_id: 'MLB1649',
        sold_quantity: 2341,
        condition: 'new',
        shipping: {
          free_shipping: true,
        },
        attributes: [
          { id: 'BRAND', name: 'Marca', value_name: 'Lenovo' },
          { id: 'MODEL', name: 'Modelo', value_name: 'IdeaPad 3' }
        ]
      },
      {
        id: 'MLB555666777',
        title: `${searchTerm} - Apple AirPods Pro 2ª Geração com Case MagSafe`,
        price: 1899.99,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_123456-MLU70987654321_082023-V.webp',
        permalink: 'https://produto.mercadolivre.com.br/MLB-555666777',
        category_id: 'MLB1276',
        sold_quantity: 8765,
        condition: 'new',
        shipping: {
          free_shipping: true,
        },
        attributes: [
          { id: 'BRAND', name: 'Marca', value_name: 'Apple' },
          { id: 'MODEL', name: 'Modelo', value_name: 'AirPods Pro' }
        ]
      },
      {
        id: 'MLB111222333',
        title: `${searchTerm} - Smart TV LG 55" 4K UHD ThinQ AI`,
        price: 2199.00,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_654321-MLU75123456789_032024-V.webp',
        permalink: 'https://produto.mercadolivre.com.br/MLB-111222333',
        category_id: 'MLB1002',
        sold_quantity: 1456,
        condition: 'new',
        shipping: {
          free_shipping: true,
        },
        attributes: [
          { id: 'BRAND', name: 'Marca', value_name: 'LG' },
          { id: 'SCREEN_SIZE', name: 'Tamanho da tela', value_name: '55"' }
        ]
      },
      {
        id: 'MLB444555666',
        title: `${searchTerm} - Console PlayStation 5 825GB SSD`,
        price: 3999.99,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_789012-MLU80123456789_092024-V.webp',
        permalink: 'https://produto.mercadolivre.com.br/MLB-444555666',
        category_id: 'MLB1144',
        sold_quantity: 3278,
        condition: 'new',
        shipping: {
          free_shipping: true,
        },
        attributes: [
          { id: 'BRAND', name: 'Marca', value_name: 'Sony' },
          { id: 'MODEL', name: 'Modelo', value_name: 'PlayStation 5' }
        ]
      }
    ];

    return mockProducts;
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

  // Busca categorias populares (dados fixos por enquanto)
  async getPopularCategories(): Promise<Array<{ id: string; name: string }>> {
    return [
      { id: 'MLB5672', name: 'Acessórios para Veículos' },
      { id: 'MLB271599', name: 'Agro' },
      { id: 'MLB1403', name: 'Alimentos e Bebidas' },
      { id: 'MLB1071', name: 'Animais' },
      { id: 'MLB1367', name: 'Antiguidades e Coleções' },
      { id: 'MLB1368', name: 'Arte, Papelaria e Armarinho' },
      { id: 'MLB1384', name: 'Bebês' },
      { id: 'MLB1246', name: 'Beleza e Cuidado Pessoal' },
      { id: 'MLB1132', name: 'Brinquedos e Hobbies' },
      { id: 'MLB1430', name: 'Calçados, Roupas e Bolsas' },
      { id: 'MLB1039', name: 'Câmeras e Acessórios' },
      { id: 'MLB1743', name: 'Carros, Motos e Outros' },
      { id: 'MLB1574', name: 'Casa, Móveis e Decoração' },
      { id: 'MLB1051', name: 'Celulares e Telefones' },
      { id: 'MLB1500', name: 'Construção' },
      { id: 'MLB5726', name: 'Eletrodomésticos' },
      { id: 'MLB1000', name: 'Eletrônicos, Áudio e Vídeo' },
      { id: 'MLB1276', name: 'Esportes e Fitness' },
      { id: 'MLB263532', name: 'Ferramentas' },
      { id: 'MLB12404', name: 'Festas e Lembrancinhas' },
      { id: 'MLB1144', name: 'Games' },
      { id: 'MLB1459', name: 'Imóveis' },
      { id: 'MLB1499', name: 'Indústria e Comércio' },
      { id: 'MLB1648', name: 'Informática' },
      { id: 'MLB218519', name: 'Instrumentos Musicais' },
      { id: 'MLB3937', name: 'Joias e Relógios' },
      { id: 'MLB1196', name: 'Música, Filmes e Seriados' },
      { id: 'MLB264586', name: 'Saúde' },
      { id: 'MLB1540', name: 'Serviços' }
    ];
  }
}

export const mlService = new MercadoLivreService();