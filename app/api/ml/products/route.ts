import { NextRequest, NextResponse } from 'next/server';

interface MLProduct {
  id: string;
  title: string;
  price: number;
  category_id: string;
  thumbnail: string;
  condition: string;
  sold_quantity: number;
  available_quantity: number;
  permalink: string;
  listing_type_id: string;
  shipping: {
    free_shipping: boolean;
    mode: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Buscar produtos mais vendidos no ML
    const baseUrl = 'https://api.mercadolibre.com';
    const site = 'MLB'; // Brasil
    
    let searchUrl = `${baseUrl}/sites/${site}/search?sort=sold_quantity_desc&limit=${limit}`;
    if (category) {
      searchUrl += `&category=${category}`;
    }
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos no ML');
    }
    
    const data = await response.json();
    
    // Simular análise de custos (versão básica)
    const analyses = data.results.map((product: MLProduct) => {
      const salePrice = product.price;
      const commissionPercent = product.listing_type_id.includes('gold') ? 17 : 12;
      const commission = (salePrice * commissionPercent) / 100;
      const fixedFee = salePrice <= 79 ? Math.min(6.75, salePrice * 0.05) : 6.75;
      const shippingCost = product.shipping.free_shipping ? 
        (salePrice <= 50 ? 8 : salePrice <= 100 ? 12 : 15) : 0;
      
      const totalCosts = commission + fixedFee + shippingCost;
      const netRevenue = salePrice - totalCosts;
      const recommendedCostPrice = netRevenue * 0.7; // Para 30% de lucro
      const profitMargin = netRevenue > 0 ? ((netRevenue - recommendedCostPrice) / salePrice) * 100 : 0;

      return {
        product,
        salePrice,
        commission,
        fixedFee,
        shippingCost,
        totalCosts,
        netRevenue,
        recommendedCostPrice,
        profitMargin
      };
    });
    
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