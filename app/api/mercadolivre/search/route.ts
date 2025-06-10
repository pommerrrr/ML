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

    const api = MercadoLivreAPI.getInstance();
    const products = await api.searchProducts(
      siteId, 
      query || undefined, 
      categoryId || undefined, 
      limit,
      sortBy || undefined
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro na API de busca de produtos:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar produtos' },
      { status: 500 }
    );
  }
}