import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductAnalysis } from '../types/product';

class DatabaseService {
  private readonly COLLECTION_NAME = 'product-analyses';

  // Salva análise no Firebase
  async saveAnalysis(analysis: ProductAnalysis): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...analysis,
        createdAt: Timestamp.fromDate(analysis.createdAt),
        updatedAt: Timestamp.fromDate(analysis.updatedAt),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
      throw new Error('Falha ao salvar análise no banco de dados');
    }
  }

  // Busca todas as análises
  async getAnalyses(limitCount: number = 100): Promise<ProductAnalysis[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as ProductAnalysis;
      });
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
      return [];
    }
  }

  // Busca análises por categoria
  async getAnalysesByCategory(categoryId: string): Promise<ProductAnalysis[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('product.category_id', '==', categoryId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as ProductAnalysis;
      });
    } catch (error) {
      console.error('Erro ao buscar análises por categoria:', error);
      return [];
    }
  }

  // Remove análise
  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, analysisId));
    } catch (error) {
      console.error('Erro ao deletar análise:', error);
      throw new Error('Falha ao deletar análise');
    }
  }

  // Estatísticas gerais
  async getStats(): Promise<{
    totalAnalyses: number;
    avgProfitMargin: number;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    try {
      const analyses = await this.getAnalyses(1000);
      
      const totalAnalyses = analyses.length;
      const avgProfitMargin = analyses.reduce((sum, analysis) => 
        sum + analysis.analysis.profitMargin, 0) / totalAnalyses;
      
      // Conta categorias
      const categoryCount: Record<string, number> = {};
      analyses.forEach(analysis => {
        const categoryId = analysis.product.category_id;
        categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
      });
      
      const topCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }));
      
      return {
        totalAnalyses,
        avgProfitMargin: isNaN(avgProfitMargin) ? 0 : avgProfitMargin,
        topCategories,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        totalAnalyses: 0,
        avgProfitMargin: 0,
        topCategories: [],
      };
    }
  }
}

export const dbService = new DatabaseService();