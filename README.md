# 📊 Mercado Livre Analyzer

Sistema web completo para análise de produtos do Mercado Livre, cálculo de margens de lucro e sugestão de preços de custo ideais.

## 🚀 Funcionalidades

- **🔍 Busca Inteligente**: Busque produtos por termo ou encontre os mais vendidos por categoria
- **📈 Análise de Margens**: Cálculo automático de custos (taxas ML, frete, anúncios)
- **💰 Sugestão de Custo**: Preço máximo que você deve pagar para ter >30% de lucro
- **📊 Dashboard Completo**: Gráficos e métricas dos produtos analisados
- **💾 Histórico**: Salva todas as análises no Firebase
- **📱 Interface Responsiva**: Design moderno e intuitivo

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript + Tailwind V4
- **UI**: ShadCN/UI + Lucide Icons
- **Charts**: Recharts
- **Backend**: Firebase Firestore
- **API**: Mercado Livre API
- **Build**: Vite
- **Package Manager**: Bun

## 📋 Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **Bun** instalado globalmente
3. **Conta Firebase** com projeto criado
4. **Git** para versionamento

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <your-repo-url>
cd mercado-livre-analyzer
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure o Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o Firestore Database
4. Vá em "Configurações do projeto" > "Geral"
5. Role até "Seus aplicativos" e clique em "Web"
6. Registre o app e copie as configurações

### 4. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações do Firebase
nano .env
```

Substitua os valores no arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 5. Configure as regras do Firestore

No console do Firebase, vá em "Firestore Database" > "Regras" e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita nas análises de produtos
    match /product-analyses/{document} {
      allow read, write: if true;
    }
  }
}
```

## 🚀 Executando o projeto

### Desenvolvimento

```bash
bun dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para produção

```bash
bun run build
```

### Preview da build

```bash
bun run preview
```

## 🌐 Deploy

### GitHub Pages

1. Configure o repositório no GitHub
2. Vá em "Settings" > "Pages"
3. Configure a source como "GitHub Actions"
4. Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Build
      run: bun run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. Adicione suas variáveis de ambiente em "Settings" > "Secrets and variables" > "Actions"

## 📊 Como usar

### 1. Buscar Produtos

- **Por termo**: Digite qualquer produto na barra de busca
- **Mais vendidos**: Clique em "Buscar Mais Vendidos" (opcionalmente filtre por categoria)

### 2. Analisar Produtos

- **Individual**: Clique em "Analisar" em qualquer produto
- **Em lote**: Clique em "Analisar Todos" para processar todos os produtos encontrados

### 3. Interpretar Resultados

- **Preço de Venda**: Preço atual no Mercado Livre
- **Custos Totais**: Taxas ML + Frete + Anúncios Premium
- **Receita Líquida**: Quanto você realmente recebe
- **Custo Máximo**: Preço máximo que deve pagar pelo produto para ter 30% de lucro

### 4. Dashboard

- Visualize estatísticas gerais
- Gráficos de distribuição de margem
- Categorias mais analisadas
- Recomendações baseadas nos dados

## 🔧 Customização

### Modificar taxas e custos

Edite o arquivo `src/services/mercadoLivre.ts`:

```typescript
// Configurações padrão
const mlFeePercentage = 0.12; // 12% taxa ML
const shippingCost = 15; // R$ 15 frete médio
const premiumAdCost = sellingPrice * 0.05; // 5% anúncios
const targetProfitMargin = 0.30; // 30% lucro target
```

### Adicionar novas funcionalidades

1. Crie novos componentes em `src/components/`
2. Adicione novos hooks em `src/hooks/`
3. Estenda os tipos em `src/types/`

## 🐛 Solução de Problemas

### CORS Error na API do ML

A API do Mercado Livre pode ter restrições CORS. Para resolver:

1. Use um proxy (como `cors-anywhere`)
2. Configure um backend intermediário
3. Use extensões de browser para desenvolvimento

### Erro de Firebase

1. Verifique se as credenciais estão corretas
2. Confirme se o Firestore está ativado
3. Verifique as regras de segurança

### Build falha

1. Verifique se todas as variáveis de ambiente estão definidas
2. Execute `bun install` novamente
3. Limpe o cache: `rm -rf node_modules .turbo dist && bun install`

## 📝 Licença

Este projeto é distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você tiver dúvidas ou problemas:

1. Abra uma [Issue](../../issues)
2. Consulte a documentação
3. Verifique os exemplos de uso

---

Desenvolvido com ❤️ para otimizar vendas no Mercado Livre