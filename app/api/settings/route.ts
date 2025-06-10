import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '../../../lib/firebase-service';
import { AnalysisSettings } from '../../../types';

export async function GET() {
  try {
    const firebaseService = FirebaseService.getInstance();
    const settings = await firebaseService.getAnalysisSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar configurações' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings: AnalysisSettings = await request.json();

    // Validar configurações
    if (settings.targetProfitMargin < 0 || settings.targetProfitMargin > 100) {
      return NextResponse.json(
        { error: 'Margem de lucro deve estar entre 0 e 100%' },
        { status: 400 }
      );
    }

    const firebaseService = FirebaseService.getInstance();
    await firebaseService.saveAnalysisSettings(settings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json(
      { error: 'Falha ao salvar configurações' },
      { status: 500 }
    );
  }
}