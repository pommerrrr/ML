'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Settings, Save, RefreshCw, Info } from 'lucide-react';
import { AnalysisSettings } from '../../types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AnalysisSettings>({
    targetProfitMargin: 30,
    shippingCostPercentage: 10,
    marketplaceFeePercentage: 12,
    advertisingCostPercentage: 5,
    additionalCosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      targetProfitMargin: 30,
      shippingCostPercentage: 10,
      marketplaceFeePercentage: 12,
      advertisingCostPercentage: 5,
      additionalCosts: 0,
    });
    setMessage(null);
  };

  const updateSetting = (key: keyof AnalysisSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Carregando...</p>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Configure os parâmetros para cálculo de margens e custos
        </p>
      </div>

      {/* Configurações principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Parâmetros de Análise</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Margem de lucro alvo */}
          <div>
            <Label htmlFor="profit-margin">Margem de Lucro Alvo (%)</Label>
            <Input
              id="profit-margin"
              type="number"
              min="0"
              max="100"
              value={settings.targetProfitMargin}
              onChange={(e) => updateSetting('targetProfitMargin', Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Margem de lucro desejada para recomendação de preço de custo
            </p>
          </div>

          <Separator />

          {/* Custos do Mercado Livre */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Custos do Mercado Livre
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="marketplace-fee">Taxa do Marketplace (%)</Label>
                <Input
                  id="marketplace-fee"
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={settings.marketplaceFeePercentage}
                  onChange={(e) => updateSetting('marketplaceFeePercentage', Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Taxa cobrada pelo Mercado Livre (geralmente 10-15%)
                </p>
              </div>

              <div>
                <Label htmlFor="shipping-cost">Custo de Frete (%)</Label>
                <Input
                  id="shipping-cost"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={settings.shippingCostPercentage}
                  onChange={(e) => updateSetting('shippingCostPercentage', Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Percentual do preço gasto com frete
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Custos adicionais */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Custos Adicionais
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="advertising-cost">Publicidade (%)</Label>
                <Input
                  id="advertising-cost"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={settings.advertisingCostPercentage}
                  onChange={(e) => updateSetting('advertisingCostPercentage', Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Investimento em anúncios e promoções
                </p>
              </div>

              <div>
                <Label htmlFor="additional-costs">Custos Fixos (R$)</Label>
                <Input
                  id="additional-costs"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.additionalCosts}
                  onChange={(e) => updateSetting('additionalCosts', Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Custos fixos por produto (embalagem, etiquetas, etc.)
                </p>
              </div>
            </div>
          </div>

          {/* Preview do cálculo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Exemplo de Cálculo (Produto de R$ 100,00)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Preço de venda:</span>
                <span>R$ 100,00</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Taxa do Mercado Livre ({settings.marketplaceFeePercentage}%):</span>
                <span>-R$ {(100 * settings.marketplaceFeePercentage / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Frete ({settings.shippingCostPercentage}%):</span>
                <span>-R$ {(100 * settings.shippingCostPercentage / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Publicidade ({settings.advertisingCostPercentage}%):</span>
                <span>-R$ {(100 * settings.advertisingCostPercentage / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Custos fixos:</span>
                <span>-R$ {settings.additionalCosts.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-green-600">
                <span>Valor líquido:</span>
                <span>R$ {(100 - (100 * (settings.marketplaceFeePercentage + settings.shippingCostPercentage + settings.advertisingCostPercentage) / 100) - settings.additionalCosts).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-blue-600">
                <span>Custo máximo para {settings.targetProfitMargin}% margem:</span>
                <span>R$ {((100 - (100 * (settings.marketplaceFeePercentage + settings.shippingCostPercentage + settings.advertisingCostPercentage) / 100) - settings.additionalCosts) / (1 + settings.targetProfitMargin / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Mensagem de feedback */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <Info className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Botões de ação */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
            
            <Button variant="outline" onClick={handleReset}>
              Restaurar Padrões
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre as configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Taxa do Marketplace:</strong> A taxa cobrada pelo Mercado Livre varia de acordo com a categoria 
              e tipo de conta (10-15% é comum para a maioria das categorias).
            </p>
            <p>
              <strong>Custo de Frete:</strong> Mesmo com frete grátis, o custo é absorvido pelo vendedor. 
              Considere o percentual médio dos seus produtos.
            </p>
            <p>
              <strong>Publicidade:</strong> Investimento em Produto Ads e outras ferramentas de marketing 
              do Mercado Livre para aumentar a visibilidade.
            </p>
            <p>
              <strong>Custos Fixos:</strong> Inclua custos de embalagem, etiquetas, mão de obra para 
              preparação do produto, etc.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}