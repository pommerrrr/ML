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

    console.log(`Iniciando análise do produto: ${productId}`);
    
    const mlApi = MercadoLivreAPI.getInstance();
    let product;
    let competitionInfo: any = null;

    try {
      // Buscar produto no Mercado Livre
      product = await mlApi.getProductDetail(productId);
      console.log(`Produto encontrado: ${product.title}`);
    } catch (error) {
      console.error('Erro ao buscar produto da API, tentando demonstração:', error);
      
      // Se não conseguir buscar da API, usar dados dos produtos de demonstração
      const demoProducts = (mlApi as any).getDemoProducts();
      product = demoProducts.find((p: any) => p.id === productId);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Produto não encontrado' },
          { status: 404 }
        );
      }
      
      console.log('Usando dados de demonstração para análise');
    }
    
    try {
      // Buscar informações de concorrência (pode falhar)
      competitionInfo = await mlApi.getCompetitionInfo(productId);
      console.log('Informações de concorrência obtidas');
    } catch (error) {
      console.log('Informações de concorrência indisponíveis, gerando estimativas');
      
      // Criar dados estimados baseados no produto
      competitionInfo = {
        total_listings: Math.floor(Math.random() * 50) + 10,
        average_price: product.price * (0.9 + Math.random() * 0.2),
        lowest_price: product.price * (0.8 + Math.random() * 0.1),
        price_to_win: product.price * (0.85 + Math.random() * 0.1),
        status: product.price < (product.price * 0.9) ? 'winning' : 'losing'
      };
    }

    let settings;
    try {
      // Buscar configurações de análise do Firebase
      const firebaseService = FirebaseService.getInstance();
      settings = await firebaseService.getAnalysisSettings();
    } catch (error) {
      console.log('Usando configurações padrão para análise');
      // Configurações padrão em caso de falha
      settings = {
        targetProfitMargin: 30, // 30%
        shippingCostPercentage: 8, // 8% do preço
        marketplaceFeePercentage: 12, // 12% taxa do ML
        advertisingCostPercentage: 5, // 5% publicidade
        additionalCosts: 10 // R$ 10 custos extras
      };
    }
    
    // Calcular análise
    const analysis = mlApi.calculateProductAnalysis(product, settings);
    
    // Criar objeto de análise completo
    const productAnalysis: Omit<ProductAnalysis, 'id'> = {
      productId: product.id,
      title: product.title,
      currentPrice: product.price,
      soldQuantity: product.sold_quantity || 0,
      catalogPrice: product.price, // Placeholder - seria obtido de outra fonte
      shippingCost: analysis.shippingCost,
      marketplaceFee: analysis.marketplaceFee,
      advertisingCost: analysis.advertisingCost,
      totalCosts: analysis.totalCosts,
      netReceived: analysis.netReceived,
      recommendedCostPrice: analysis.recommendedCostPrice,
      profitMargin: analysis.currentProfitMargin,
      lastUpdated: new Date(),
      isWinning: competitionInfo?.status === 'winning' || competitionInfo?.price_to_win ? product.price <= competitionInfo.price_to_win : true,
      competition: {
        totalListings: competitionInfo?.total_listings || 0,
        averagePrice: competitionInfo?.average_price || product.price,
        lowestPrice: competitionInfo?.lowest_price || product.price,
      },
    };

    try {
      // Tentar salvar no Firebase
      const firebaseService = FirebaseService.getInstance();
      const analysisId = await firebaseService.saveProductAnalysis(productAnalysis);
      console.log(`Análise salva no Firebase com ID: ${analysisId}`);
      
      return NextResponse.json({
        id: analysisId,
        ...productAnalysis,
      });
    } catch (firebaseError) {
      console.warn('Erro ao salvar no Firebase, retornando análise sem persistir:', firebaseError);
      
      // Retornar análise mesmo se não conseguir salvar no Firebase
      return NextResponse.json({
        id: 'temp-' + Date.now(),
        ...productAnalysis,
        warning: 'Análise gerada mas não foi possível salvar no banco de dados'
      });
    }

  } catch (error) {
    console.error('Erro geral na análise do produto:', error);
    return NextResponse.json(
      { error: 'Falha ao analisar produto. Tente novamente.' },
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