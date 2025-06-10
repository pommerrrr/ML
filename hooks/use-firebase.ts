import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CostAnalysis } from '@/lib/mercado-livre';

export interface SavedAnalysis extends CostAnalysis {
  id?: string;
  savedAt: Date;
  notes?: string;
}

export function useFirebaseAnalyses() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar análises salvas
  const loadAnalyses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const q = query(
        collection(db, 'product-analyses'),
        orderBy('savedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const loadedAnalyses: SavedAnalysis[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedAnalyses.push({
          id: doc.id,
          ...data,
          savedAt: data.savedAt.toDate(),
        } as SavedAnalysis);
      });
      
      setAnalyses(loadedAnalyses);
    } catch (err) {
      setError('Erro ao carregar análises salvas');
      console.error('Erro Firebase:', err);
    } finally {
      setLoading(false);
    }
  };

  // Salvar nova análise
  const saveAnalysis = async (analysis: CostAnalysis, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const savedAnalysis: Omit<SavedAnalysis, 'id'> = {
        ...analysis,
        savedAt: new Date(),
        notes: notes || '',
      };
      
      const docRef = await addDoc(collection(db, 'product-analyses'), {
        ...savedAnalysis,
        savedAt: Timestamp.fromDate(savedAnalysis.savedAt),
      });
      
      const newAnalysis: SavedAnalysis = {
        ...savedAnalysis,
        id: docRef.id,
      };
      
      setAnalyses(prev => [newAnalysis, ...prev]);
      return newAnalysis;
    } catch (err) {
      setError('Erro ao salvar análise');
      console.error('Erro Firebase:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  return {
    analyses,
    loading,
    error,
    saveAnalysis,
    refreshAnalyses: loadAnalyses,
  };
}