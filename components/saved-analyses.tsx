'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebaseAnalyses } from '@/hooks/use-firebase';
import { Database, ExternalLink, Trash2, RefreshCw, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function SavedAnalyses() {
  const { analyses, loading, refreshAnalyses } = useFirebaseAnalyses();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshAnalyses();
    setRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className=\"flex items-center justify-between\">
          <CardTitle className=\"flex items-center gap-2\">
            <Database className=\"h-5 w-5\" />
            Análises Salvas
          </CardTitle>
          <Button
            size=\"sm\"
            variant=\"outline\"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className=\"space-y-4\">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className=\"space-y-2\">
                <Skeleton className=\"h-4 w-3/4\" />
                <Skeleton className=\"h-3 w-1/2\" />
                <Skeleton className=\"h-6 w-1/4\" />
              </div>
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className=\"text-center py-8 text-gray-500\">
            <Database className=\"h-12 w-12 mx-auto mb-4 opacity-50\" />
            <p className=\"text-sm\">Nenhuma análise salva</p>
            <p className=\"text-xs\">Salve produtos interessantes para revisão posterior</p>
          </div>
        ) : (
          <div className=\"space-y-4 max-h-96 overflow-y-auto\">
            {analyses.map((analysis) => (
              <div key={analysis.id} className=\"border rounded-lg p-3 space-y-2\">
                <div className=\"flex items-start justify-between gap-2\">
                  <h4 className=\"text-sm font-medium line-clamp-2 flex-1\">
                    {analysis.product.title}
                  </h4>
                  <Button
                    size=\"sm\"
                    variant=\"ghost\"
                    onClick={() => window.open(analysis.product.permalink, '_blank')}
                    className=\"flex-shrink-0\"
                  >
                    <ExternalLink className=\"h-3 w-3\" />
                  </Button>
                </div>
                
                <div className=\"flex items-center gap-2 text-xs text-gray-500\">
                  <Calendar className=\"h-3 w-3\" />
                  {formatDistanceToNow(analysis.savedAt, { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </div>

                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center gap-2\">
                    <span className=\"text-sm font-medium\">
                      R$ {analysis.salePrice.toFixed(2)}
                    </span>
                    <Badge 
                      variant={analysis.profitMargin >= 30 ? \"default\" : \"secondary\"}
                      className=\"text-xs\"
                    >
                      {analysis.profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className=\"text-right\">
                    <div className=\"text-xs text-gray-500\">Custo máx</div>
                    <div className=\"text-sm font-medium text-blue-600\">
                      R$ {analysis.recommendedCostPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {analysis.notes && (
                  <div className=\"mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600\">
                    {analysis.notes}
                  </div>
                )}

                <div className=\"flex items-center justify-between pt-2 border-t\">
                  <div className=\"text-xs text-gray-500\">
                    {analysis.product.sold_quantity} vendidos
                  </div>
                  <div className=\"text-xs font-medium text-green-600\">
                    Líquido: R$ {analysis.netRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}