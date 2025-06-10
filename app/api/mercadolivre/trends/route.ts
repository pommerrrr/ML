import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../../lib/mercadolivre-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site_id') || 'MLB';

    const api = MercadoLivreAPI.getInstance();
    const trends = await api.getTrends(siteId);

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Erro na API de tendências:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar tendências' },
      { status: 500 }
    );
  }
}