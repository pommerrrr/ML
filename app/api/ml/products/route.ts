import { NextRequest, NextResponse } from 'next/server';
import { getTopSellingProducts, analyzeCosts } from '@/lib/mercado-livre';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    const products = await getTopSellingProducts(category, limit);
    
    // Analisar custos para cada produto
    const analyses = products.map(product => analyzeCosts(product));
    
    return NextResponse.json({ 
      success: true, 
      data: analyses 
    });
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar produtos' 
    }, { status: 500 });
  }
}