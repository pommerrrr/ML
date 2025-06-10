import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '../../../lib/mercadolivre-api';
import { FirebaseService } from '../../../lib/firebase-service';
import { ProductAnalysis } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    const mlApi = MercadoLivreAPI.getInstance();
    const firebaseService = FirebaseService.getInstance();

    // Buscar produto no Mercado Livre
    const product = await mlApi.getProductDetail(productId);
    
    // Buscar informações de concorrência
    const competitionInfo = await mlApi.getCompetitionInfo(productId);
    
    // Buscar configurações de análise
    const settings = await firebaseService.getAnalysisSettings();
    
    // Calcular análise
    const analysis = mlApi.calculateProductAnalysis(product, settings);
    
    // Criar objeto de análise completo
    const productAnalysis: Omit<ProductAnalysis, 'id'> = {
      productId: product.id,
      title: product.title,
      currentPrice: product.price,
      soldQuantity: product.sold_quantity,
      catalogPrice: product.price, // Placeholder - seria obtido de outra fonte
      shippingCost: analysis.shippingCost,
      marketplaceFee: analysis.marketplaceFee,
      advertisingCost: analysis.advertisingCost,
      totalCosts: analysis.totalCosts,
      netReceived: analysis.netReceived,
      recommendedCostPrice: analysis.recommendedCostPrice,
      profitMargin: analysis.currentProfitMargin,
      lastUpdated: new Date(),
      isWinning: competitionInfo?.status === 'winning' || false,
      competition: {
        totalListings: competitionInfo?.total_listings || 0,
        averagePrice: competitionInfo?.average_price || product.price,
        lowestPrice: competitionInfo?.lowest_price || product.price,
      },
    };

    // Salvar no Firebase
    const analysisId = await firebaseService.saveProductAnalysis(productAnalysis);

    return NextResponse.json({
      id: analysisId,
      ...productAnalysis,
    });
  } catch (error) {
    console.error('Erro na análise do produto:', error);
    return NextResponse.json(
      { error: 'Falha ao analisar produto' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    const firebaseService = FirebaseService.getInstance();
    
    let analyses;
    if (search) {
      analyses = await firebaseService.searchProductAnalyses(search);
    } else {
      analyses = await firebaseService.getProductAnalyses(limit);
    }

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Erro ao buscar análises:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar análises' },
      { status: 500 }
    );
  }
}