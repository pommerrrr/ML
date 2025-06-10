import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/mercado-livre';

export async function GET() {
  try {
    const categories = await getCategories();
    
    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Erro na API de categorias:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar categorias' 
    }, { status: 500 });
  }
}