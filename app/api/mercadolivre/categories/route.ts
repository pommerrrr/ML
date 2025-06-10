import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../../lib/mercadolivre-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site_id') || 'MLB';

    const api = MercadoLivreAPI.getInstance();
    const categories = await api.getCategories(siteId);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erro na API de categorias:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar categorias' },
      { status: 500 }
    );
  }
}