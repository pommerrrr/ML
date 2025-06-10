// Mercado Livre API integration
export interface MLProduct {
  id: string;
  title: string;
  price: number;
  category_id: string;
  catalog_product_id?: string;
  thumbnail: string;
  condition: string;
  sold_quantity: number;
  available_quantity: number;
  permalink: string;
  seller: {
    id: number;
    nickname: string;
    reputation: {
      level_id: string;
    };
  };
  shipping: {
    free_shipping: boolean;
    mode: string;
  };
  listing_type_id: string; // gold_pro, gold_special, etc.
}

export interface MLHighlight {
  item: MLProduct;
  position: number;
  type: string;
}

export interface CostAnalysis {
  product: MLProduct;
  salePrice: number;
  commission: number; // Percentage
  fixedFee: number;
  shippingCost: number;
  totalCosts: number;
  netRevenue: number;
  recommendedCostPrice: number; // Para 30%+ de lucro
  profitMargin: number;
}

// Cálculo das taxas do Mercado Livre baseado no tipo de anúncio
export function calculateMLCommission(price: number, listingType: string): { commissionPercent: number; fixedFee: number } {
  let commissionPercent = 0;
  let fixedFee = 0;

  // Premium ads: 15-19%
  if (listingType.includes('gold_pro') || listingType.includes('gold_special')) {
    commissionPercent = 17; // Média de 15-19%
  } 
  // Classic ads: 10-14%  
  else {
    commissionPercent = 12; // Média de 10-14%
  }

  // Taxa fixa baseada no preço
  if (price <= 12.5) {
    fixedFee = price * 0.5; // 50% do valor para produtos muito baratos
  } else if (price <= 79) {
    fixedFee = Math.min(6.75, price * 0.05); // Até R$ 6,75
  } else {
    fixedFee = 6.75;
  }

  return { commissionPercent, fixedFee };
}

// Estimativa de frete (baseado em peso/dimensões médias)
export function estimateShippingCost(price: number, freeShipping: boolean): number {
  if (!freeShipping) return 0;
  
  // Estimativas baseadas no valor do produto
  if (price <= 50) return 8;
  if (price <= 100) return 12;
  if (price <= 200) return 15;
  if (price <= 500) return 20;
  return 25;
}

// Análise completa de custos
export function analyzeCosts(product: MLProduct): CostAnalysis {
  const salePrice = product.price;
  const { commissionPercent, fixedFee } = calculateMLCommission(salePrice, product.listing_type_id);
  const shippingCost = estimateShippingCost(salePrice, product.shipping.free_shipping);
  
  const commission = (salePrice * commissionPercent) / 100;
  const totalCosts = commission + fixedFee + shippingCost;
  const netRevenue = salePrice - totalCosts;
  
  // Para ter 30% de lucro líquido, o custo deve ser 70% da receita líquida
  const recommendedCostPrice = netRevenue * 0.7;
  const profitMargin = netRevenue > 0 ? ((netRevenue - recommendedCostPrice) / salePrice) * 100 : 0;

  return {
    product,
    salePrice,
    commission,
    fixedFee,
    shippingCost,
    totalCosts,
    netRevenue,
    recommendedCostPrice,
    profitMargin
  };
}

// Buscar produtos mais vendidos
export async function getTopSellingProducts(category: string = '', limit: number = 20): Promise<MLProduct[]> {
  try {
    const baseUrl = 'https://api.mercadolibre.com';
    const site = 'MLB'; // Brasil
    
    // Primeiro, vamos buscar produtos em alta
    const highlightsUrl = `${baseUrl}/highlights/${site}${category ? `/category/${category}` : ''}?limit=${limit}`;
    const highlightsResponse = await fetch(highlightsUrl);
    
    if (!highlightsResponse.ok) {
      throw new Error('Erro ao buscar destaques do ML');
    }
    
    const highlights: { content: MLHighlight[] } = await highlightsResponse.json();
    const products = highlights.content.map(h => h.item);
    
    // Filtrar apenas produtos catalogados (que têm catalog_product_id)
    return products.filter(p => p.catalog_product_id);
    
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    // Fallback: buscar através de search
    return getProductsBySearch(category, limit);
  }
}

// Busca alternativa por search
async function getProductsBySearch(category: string = '', limit: number = 20): Promise<MLProduct[]> {
  try {
    const baseUrl = 'https://api.mercadolibre.com';
    const site = 'MLB';
    
    let searchUrl = `${baseUrl}/sites/${site}/search?sort=sold_quantity_desc&limit=${limit}`;
    if (category) {
      searchUrl += `&category=${category}`;
    }
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return data.results.filter((p: MLProduct) => p.catalog_product_id);
  } catch (error) {
    console.error('Erro na busca alternativa:', error);
    return [];
  }
}

// Buscar categorias
export async function getCategories(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/categories');
    const categories = await response.json();
    
    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}