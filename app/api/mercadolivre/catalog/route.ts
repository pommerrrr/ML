import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../../lib/mercadolivre-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site_id') || 'MLB';
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('API Catalog chamada com:', { siteId, query, categoryId, limit, offset });

    const api = MercadoLivreAPI.getInstance();
    const products = await api.searchCatalogProducts(
      siteId, 
      query || undefined, 
      categoryId || undefined, 
      limit,
      offset
    );

    console.log(`API Catalog retornou ${products.results?.length || 0} produtos`);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro na API de busca de produtos catalogados:', error);
    
    // Retorna array vazio ao invés de erro para não quebrar o frontend
    return NextResponse.json({ 
      results: [],
      total: 0,
      error: 'Falha ao buscar produtos catalogados'
    });
  }
}