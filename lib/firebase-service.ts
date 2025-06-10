import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { ProductAnalysis, AnalysisSettings, DashboardStats } from '../types';

export class FirebaseService {
  private static instance: FirebaseService;

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Produtos analisados
  async saveProductAnalysis(analysis: Omit<ProductAnalysis, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'product_analyses'), {
        ...analysis,
        lastUpdated: Timestamp.fromDate(new Date()),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar análise do produto:', error);
      throw new Error('Falha ao salvar análise do produto');
    }
  }

  async updateProductAnalysis(id: string, analysis: Partial<ProductAnalysis>): Promise<void> {
    try {
      const docRef = doc(db, 'product_analyses', id);
      await updateDoc(docRef, {
        ...analysis,
        lastUpdated: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Erro ao atualizar análise do produto:', error);
      throw new Error('Falha ao atualizar análise do produto');
    }
  }

  async deleteProductAnalysis(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'product_analyses', id));
    } catch (error) {
      console.error('Erro ao deletar análise do produto:', error);
      throw new Error('Falha ao deletar análise do produto');
    }
  }

  async getProductAnalyses(limitCount: number = 50): Promise<ProductAnalysis[]> {
    try {
      const q = query(
        collection(db, 'product_analyses'),
        orderBy('lastUpdated', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
      })) as ProductAnalysis[];
    } catch (error) {
      console.error('Erro ao buscar análises de produtos:', error);
      throw new Error('Falha ao buscar análises de produtos');
    }
  }

  async getProductAnalysis(id: string): Promise<ProductAnalysis | null> {
    try {
      const docRef = doc(db, 'product_analyses', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          lastUpdated: docSnap.data().lastUpdated?.toDate() || new Date(),
        } as ProductAnalysis;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar análise do produto:', error);
      throw new Error('Falha ao buscar análise do produto');
    }
  }

  // Configurações de análise
  async saveAnalysisSettings(settings: AnalysisSettings): Promise<void> {
    try {
      const docRef = doc(db, 'settings', 'analysis_settings');
      await updateDoc(docRef, settings as any);
    } catch (error) {
      // Se o documento não existir, cria um novo
      try {
        await addDoc(collection(db, 'settings'), {
          ...settings,
          id: 'analysis_settings',
        } as any);
      } catch (createError) {
        console.error('Erro ao salvar configurações:', createError);
        throw new Error('Falha ao salvar configurações');
      }
    }
  }

  async getAnalysisSettings(): Promise<AnalysisSettings> {
    try {
      const docRef = doc(db, 'settings', 'analysis_settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as AnalysisSettings;
      }
      
      // Configurações padrão
      return {
        targetProfitMargin: 30,
        shippingCostPercentage: 10,
        marketplaceFeePercentage: 12,
        advertisingCostPercentage: 5,
        additionalCosts: 0,
      };
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      // Retorna configurações padrão em caso de erro
      return {
        targetProfitMargin: 30,
        shippingCostPercentage: 10,
        marketplaceFeePercentage: 12,
        advertisingCostPercentage: 5,
        additionalCosts: 0,
      };
    }
  }

  // Dashboard e estatísticas
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const analyses = await this.getProductAnalyses(1000); // Busca mais dados para estatísticas
      
      const totalProducts = analyses.length;
      const averageProfitMargin = analyses.reduce((sum, analysis) => sum + analysis.profitMargin, 0) / totalProducts || 0;
      const totalRevenue = analyses.reduce((sum, analysis) => sum + analysis.netReceived, 0);
      
      // Agrupar por categorias (simulado - seria melhor ter categoryId nos dados)
      const categoryMap = new Map();
      analyses.forEach(analysis => {
        const categoryId = 'general'; // Placeholder - seria analysis.categoryId
        const categoryName = 'Geral'; // Placeholder - seria analysis.categoryName
        
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            categoryId,
            categoryName,
            productCount: 0,
            totalPrice: 0,
          });
        }
        
        const category = categoryMap.get(categoryId);
        category.productCount++;
        category.totalPrice += analysis.currentPrice;
      });
      
      const topCategories = Array.from(categoryMap.values()).map(category => ({
        ...category,
        averagePrice: category.totalPrice / category.productCount,
      }));
      
      return {
        totalProducts,
        averageProfitMargin,
        totalRevenue,
        topCategories,
      };
    } catch (error) {
      console.error('Erro ao gerar estatísticas do dashboard:', error);
      return {
        totalProducts: 0,
        averageProfitMargin: 0,
        totalRevenue: 0,
        topCategories: [],
      };
    }
  }

  // Buscar produtos por filtros
  async searchProductAnalyses(searchTerm: string): Promise<ProductAnalysis[]> {
    try {
      const analyses = await this.getProductAnalyses(1000);
      
      if (!searchTerm) return analyses;
      
      return analyses.filter(analysis => 
        analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.productId.includes(searchTerm)
      );
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }
}