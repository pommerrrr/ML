"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface SaveAnalysisButtonProps {
  analysis: any;
}

export function SaveAnalysisButton({ analysis }: SaveAnalysisButtonProps) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento (Firebase será adicionado depois)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Por enquanto, apenas mostrar sucesso
      alert("Análise salva com sucesso! (Firebase será conectado em breve)");
      setOpen(false);
      setNotes("");
    } catch (error) {
      alert("Erro ao salvar análise");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Salvar Análise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Análise</DialogTitle>
          <DialogDescription>
            Adicione notas sobre esta análise (opcional)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Produto:</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {analysis.product.title}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Resumo:</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Preço: R$ {analysis.salePrice.toFixed(2)}</p>
              <p>• Margem: {analysis.profitMargin.toFixed(1)}%</p>
              <p>• Custo máx: R$ {analysis.recommendedCostPrice.toFixed(2)}</p>
            </div>
          </div>
          <Textarea
            placeholder="Ex: Produto interessante para dropshipping, verificar fornecedores..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}