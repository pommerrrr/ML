import { NextResponse } from 'next/server';
import { FirebaseService } from '../../../lib/firebase-service';

export async function GET() {
  try {
    const firebaseService = FirebaseService.getInstance();
    const stats = await firebaseService.getDashboardStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar estatísticas' },
      { status: 500 }
    );
  }
}