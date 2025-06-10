import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../../lib/mercadolivre-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site_id') || 'MLB';
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category');
    const sortBy = searchParams.get('sort');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.log('API Search chamada com:', { siteId, query, categoryId, sortBy, limit });

    const api = MercadoLivreAPI.getInstance();
    const products = await api.searchProducts(
      siteId, 
      query || undefined, 
      categoryId || undefined, 
      limit,
      sortBy || undefined
    );

    console.log(`API retornou ${products.results?.length || 0} produtos`);

    // Se não encontrou produtos e tem query, tenta busca mais simples
    if ((!products.results || products.results.length === 0) && query) {
      console.log('Tentando busca mais simples...');
      const fallbackProducts = await api.searchProducts(siteId, undefined, undefined, limit);
      return NextResponse.json(fallbackProducts);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro na API de busca de produtos:', error);
    
    // Retorna array vazio ao invés de erro para não quebrar o frontend
    return NextResponse.json({ 
      results: [],
      error: 'Falha ao buscar produtos, mas aplicação continua funcionando'
    });
  }
}