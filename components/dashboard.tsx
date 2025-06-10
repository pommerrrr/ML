"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, TrendingUp, Calculator, Database } from "lucide-react";

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit, setLimit] = useState(20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Análise Mercado Livre
          </h1>
          <p className="text-gray-600 text-lg">
            Descubra os produtos mais vendidos e calcule sua margem de lucro ideal
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Filtros de Análise
            </CardTitle>
            <CardDescription>
              Configure os parâmetros para buscar produtos e analisar custos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[120px]">
                <label className="text-sm font-medium mb-2 block">Limite</label>
                <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 produtos</SelectItem>
                    <SelectItem value="20">20 produtos</SelectItem>
                    <SelectItem value="50">50 produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Analisados</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Lucrativos</p>
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-xs text-gray-500">Margem ≥ 30%</p>
                </div>
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem Média</p>
                  <p className="text-2xl font-bold">0.0%</p>
                  <Badge variant="secondary" className="mt-1">
                    Aguardando
                  </Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Análises Salvas</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Sistema em desenvolvimento - Em breve análise de custos em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sistema sendo configurado...</p>
              <p className="text-sm">Conectando com API do Mercado Livre</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}