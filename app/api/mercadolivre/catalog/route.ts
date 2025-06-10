import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../../lib/mercadolivre-api';

export async function GET(request: NextRequest) {
  try {
    console.log('API Catalog chamada - iniciando busca híbrida...');

    const api = MercadoLivreAPI.getInstance();
    const products = await api.getPopularProducts();

    console.log(`API Catalog retornou ${products.results?.length || 0} produtos`);

    return NextResponse.json({
      results: products.results,
      total: products.results?.length || 0,
      source: products.results?.length > 0 ? 'api_mercadolivre' : 'demo_products'
    });
  } catch (error) {
    console.error('Erro na API de busca de produtos catalogados:', error);
    
    // Em caso de erro, retorna produtos de demonstração
    const api = MercadoLivreAPI.getInstance();
    const demoProducts = (api as any).getDemoProducts();
    
    return NextResponse.json({ 
      results: demoProducts,
      total: demoProducts.length,
      source: 'demo_products',
      error: 'Falha na API, usando produtos de demonstração'
    });
  }
}