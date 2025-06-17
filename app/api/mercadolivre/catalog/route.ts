import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../../lib/mercadolivre-api';

export async function GET(request: NextRequest) {
  try {
    console.log('API Catalog chamada - iniciando busca híbrida...');

    const api = MercadoLivreAPI.getInstance();
    const products = await api.getPopularProducts();

    const isDemoData = products.results?.length > 0 && (
      // Verifica se os produtos têm características de demonstração
      products.results[0].id.length > 15 || // IDs fictícios são mais longos
      products.results.some(p => p.seller?.nickname?.includes('STORE') && p.id.startsWith('MLB') && p.id.length > 13)
    );

    console.log(`API Catalog retornou ${products.results?.length || 0} produtos (${isDemoData ? 'demonstração' : 'API real'})`);

    return NextResponse.json({
      results: products.results,
      total: products.results?.length || 0,
      source: isDemoData ? 'demo_products' : 'api_mercadolivre',
      isDemo: isDemoData
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
      isDemo: true,
      error: 'Falha na API, usando produtos de demonstração'
    });
  }
}