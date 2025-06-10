import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/categories');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }
    
    const categories = await response.json();
    
    // Pegar apenas as principais categorias
    const mainCategories = categories.slice(0, 10).map((cat: any) => ({
      id: cat.id,
      name: cat.name
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: mainCategories 
    });
  } catch (error) {
    console.error('Erro na API de categorias:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar categorias' 
    }, { status: 500 });
  }
}