'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useFirebaseAnalyses } from '@/hooks/use-firebase';
import { CostAnalysis } from '@/lib/mercado-livre';
import { ExternalLink, Save, TrendingUp, Calculator, Package, Truck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  analysis: CostAnalysis;
}

export function ProductCard({ analysis }: ProductCardProps) {
  const [notes, setNotes] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { saveAnalysis, loading } = useFirebaseAnalyses();
  
  const { product, salePrice, commission, fixedFee, shippingCost, totalCosts, netRevenue, recommendedCostPrice, profitMargin } = analysis;

  const handleSaveAnalysis = async () => {
    try {
      await saveAnalysis(analysis, notes);
      toast.success('Análise salva com sucesso!');
      setSaveDialogOpen(false);
      setNotes('');
    } catch (error) {
      toast.error('Erro ao salvar análise');
    }
  };

  const profitColor = profitMargin >= 30 
    ? 'text-green-600 bg-green-50' 
    : profitMargin >= 15 
    ? 'text-yellow-600 bg-yellow-50' 
    : 'text-red-600 bg-red-50';

  return (
    <Card className=\"hover:shadow-lg transition-shadow duration-200\">
      <CardHeader className=\"pb-3\">
        <div className=\"flex items-start gap-4\">
          <div className=\"relative w-16 h-16 flex-shrink-0\">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className=\"rounded-md object-cover\"
              sizes=\"64px\"
            />
          </div>
          <div className=\"flex-1 min-w-0\">
            <CardTitle className=\"text-base leading-tight mb-2 line-clamp-2\">
              {product.title}
            </CardTitle>
            <div className=\"flex items-center gap-2 text-sm text-gray-600\">
              <Package className=\"h-4 w-4\" />
              {product.sold_quantity} vendidos
              <span className=\"text-gray-400\">•</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${profitColor}`}>
                {profitMargin.toFixed(1)}% lucro
              </span>
            </div>
          </div>
          <div className=\"flex flex-col items-end gap-2\">
            <div className=\"text-right\">
              <p className=\"text-lg font-bold text-gray-900\">
                R$ {salePrice.toFixed(2)}
              </p>
              <p className=\"text-sm text-gray-500\">Preço de venda</p>
            </div>
            <div className=\"flex gap-1\">
              <Button
                size=\"sm\"
                variant=\"outline\"
                onClick={() => window.open(product.permalink, '_blank')}
              >
                <ExternalLink className=\"h-4 w-4\" />
              </Button>
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button size=\"sm\" variant=\"outline\">
                    <Save className=\"h-4 w-4\" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Análise</DialogTitle>
                    <DialogDescription>
                      Adicione notas sobre esta análise (opcional)
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder=\"Ex: Produto interessante para dropshipping, verificar fornecedores...\"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                  <div className=\"flex gap-2 justify-end\">
                    <Button variant=\"outline\" onClick={() => setSaveDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveAnalysis} disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className=\"pt-0\">
        <div className=\"grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm\">
          {/* Custos */}
          <div className=\"space-y-2\">
            <div className=\"flex items-center gap-1 text-gray-600 font-medium\">
              <CreditCard className=\"h-4 w-4\" />
              Custos ML
            </div>
            <div className=\"space-y-1\">
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">Comissão:</span>
                <span className=\"font-medium\">R$ {commission.toFixed(2)}</span>
              </div>
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">Taxa fixa:</span>
                <span className=\"font-medium\">R$ {fixedFee.toFixed(2)}</span>
              </div>
              {shippingCost > 0 && (
                <div className=\"flex justify-between\">
                  <span className=\"text-gray-600 flex items-center gap-1\">
                    <Truck className=\"h-3 w-3\" />
                    Frete:
                  </span>
                  <span className=\"font-medium\">R$ {shippingCost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Receita */}
          <div className=\"space-y-2\">
            <div className=\"flex items-center gap-1 text-gray-600 font-medium\">
              <Calculator className=\"h-4 w-4\" />
              Receita
            </div>
            <div className=\"space-y-1\">
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">Bruta:</span>
                <span className=\"font-medium\">R$ {salePrice.toFixed(2)}</span>
              </div>
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">Custos:</span>
                <span className=\"font-medium text-red-600\">-R$ {totalCosts.toFixed(2)}</span>
              </div>
              <div className=\"flex justify-between font-semibold border-t pt-1\">
                <span className=\"text-gray-900\">Líquida:</span>
                <span className=\"text-green-600\">R$ {netRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Recomendação */}
          <div className=\"space-y-2\">
            <div className=\"flex items-center gap-1 text-gray-600 font-medium\">
              <TrendingUp className=\"h-4 w-4\" />
              Recomendação
            </div>
            <div className=\"space-y-1\">
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">Custo máx:</span>
                <span className=\"font-medium text-blue-600\">R$ {recommendedCostPrice.toFixed(2)}</span>
              </div>
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">Margem:</span>
                <span className={`font-semibold ${profitMargin >= 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {profitMargin.toFixed(1)}%
                </span>
              </div>
              <Badge variant={profitMargin >= 30 ? \"default\" : \"secondary\"} className=\"w-full justify-center\">
                {profitMargin >= 30 ? \"Recomendado\" : \"Baixa margem\"}
              </Badge>
            </div>
          </div>

          {/* Info adicional */}
          <div className=\"space-y-2\">
            <div className=\"text-gray-600 font-medium\">
              Detalhes
            </div>
            <div className=\"space-y-1 text-xs\">
              <div className=\"flex items-center gap-1\">
                <span className=\"w-2 h-2 bg-blue-500 rounded-full\"></span>
                <span className=\"text-gray-600\">
                  {product.listing_type_id.includes('gold') ? 'Premium' : 'Clássico'}
                </span>
              </div>
              {product.shipping.free_shipping && (
                <div className=\"flex items-center gap-1\">
                  <Truck className=\"h-3 w-3 text-green-500\" />
                  <span className=\"text-gray-600\">Frete grátis</span>
                </div>
              )}
              <div className=\"text-gray-500\">
                Estoque: {product.available_quantity}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}