import React, { useState } from 'react';
import { Settings, Copy, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';

export function FirebaseConfig() {
  const [copied, setCopied] = useState(false);
  
  const envTemplate = `# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`;

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita nas análises de produtos
    match /product-analyses/{document} {
      allow read, write: if true;
    }
  }
}`;

  const copyToClipboard = (text: string, type: 'env' | 'rules') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração do Firebase</h2>
        <p className="text-gray-600">
          Configure o Firebase para usar todas as funcionalidades do sistema
        </p>
      </div>

      {/* Passo 1: Criar Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">1</span>
            Criar Projeto no Firebase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Passos:</Label>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Acesse <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
              <li>Clique em "Criar um projeto"</li>
              <li>Digite o nome do projeto (ex: "mercado-livre-analyzer")</li>
              <li>Siga os passos do wizard de criação</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Passo 2: Configurar Firestore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">2</span>
            Configurar Firestore Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Passos:</Label>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>No console do Firebase, vá em "Firestore Database"</li>
              <li>Clique em "Criar banco de dados"</li>
              <li>Escolha "Iniciar em modo de teste"</li>
              <li>Selecione uma localização (recomendado: southamerica-east1)</li>
            </ol>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Configure as regras de segurança do Firestore
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Regras do Firestore:</Label>
            <div className="relative">
              <Textarea
                value={firestoreRules}
                readOnly
                className="font-mono text-sm min-h-[120px]"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(firestoreRules, 'rules')}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Cole essas regras em "Firestore Database" → "Regras"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Passo 3: Configurar App Web */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">3</span>
            Adicionar App Web
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Passos:</Label>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Vá em "Configurações do projeto" (ícone da engrenagem)</li>
              <li>Na aba "Geral", role até "Seus aplicativos"</li>
              <li>Clique no ícone da web (&lt;/&gt;)</li>
              <li>Digite um apelido para o app (ex: "mercado-livre-web")</li>
              <li>Marque "Configurar Firebase Hosting" (opcional)</li>
              <li>Clique em "Registrar app"</li>
              <li>Copie as configurações que aparecem</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Passo 4: Configurar Variáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">4</span>
            Configurar Variáveis de Ambiente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Arquivo .env:</Label>
            <div className="relative">
              <Textarea
                value={envTemplate}
                readOnly
                className="font-mono text-sm min-h-[120px]"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(envTemplate, 'env')}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Como usar:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Copie o conteúdo acima</li>
                <li>Crie um arquivo chamado <code className="bg-gray-100 px-1 rounded">.env</code> na raiz do projeto</li>
                <li>Cole o conteúdo e substitua os valores pelas suas configurações do Firebase</li>
                <li>Reinicie o servidor de desenvolvimento</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Passo 5: Deploy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">5</span>
            Deploy no GitHub Pages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Configurar GitHub Actions:</Label>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Vá nas configurações do seu repositório no GitHub</li>
              <li>Acesse "Secrets and variables" → "Actions"</li>
              <li>Adicione as seguintes secrets com os valores do Firebase:</li>
            </ol>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-600">
              <li><code className="bg-gray-100 px-1 rounded">VITE_FIREBASE_API_KEY</code></li>
              <li><code className="bg-gray-100 px-1 rounded">VITE_FIREBASE_AUTH_DOMAIN</code></li>
              <li><code className="bg-gray-100 px-1 rounded">VITE_FIREBASE_PROJECT_ID</code></li>
              <li><code className="bg-gray-100 px-1 rounded">VITE_FIREBASE_STORAGE_BUCKET</code></li>
              <li><code className="bg-gray-100 px-1 rounded">VITE_FIREBASE_MESSAGING_SENDER_ID</code></li>
              <li><code className="bg-gray-100 px-1 rounded">VITE_FIREBASE_APP_ID</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}