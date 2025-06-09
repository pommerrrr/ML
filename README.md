# 📊 Mercado Livre Analyzer

Sistema web completo para análise de produtos do Mercado Livre, cálculo de margens de lucro e sugestão de preços de custo ideais.

## 🎯 **Funcionalidades**

- **🔍 Busca Inteligente**: Busque produtos por termo ou encontre os mais vendidos
- **📈 Análise de Margens**: Cálculo automático de custos (taxas ML, frete, anúncios)
- **💰 Sugestão de Custo**: Preço máximo que você deve pagar para ter >30% de lucro
- **📊 Dashboard**: Gráficos e métricas dos produtos analisados
- **💾 Histórico**: Salva todas as análises no Firebase

## 🚀 **Acesso Rápido**

🌐 **Site Online:** https://pommerrrr.github.io/ML/

## ⚙️ **Configuração Inicial**

### 1. **Configure o Firebase:**

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative o **Firestore Database** (modo teste)
4. Adicione um app Web e copie as configurações

### 2. **Configure as Secrets no GitHub:**

No seu repositório `https://github.com/pommerrrr/ML`:

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione essas 6 secrets com os valores do Firebase:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 3. **Configure as Regras do Firestore:**

No Firebase Console → Firestore Database → Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /product-analyses/{document} {
      allow read, write: if true;
    }
  }
}
```

### 4. **Ative o GitHub Pages:**

1. Settings → Pages
2. Source: **GitHub Actions**

## 🔄 **Como Usar**

### **1. Buscar Produtos**
- Digite um termo de busca OU
- Clique em "Buscar Mais Vendidos" (com filtro de categoria opcional)

### **2. Analisar Produtos**
- **Individual**: Clique em "Analisar" em qualquer produto
- **Em lote**: Clique em "Analisar Todos"

### **3. Interpretar Resultados**
- **Preço de Venda**: Valor atual no ML
- **Custos Totais**: Taxas ML (12%) + Frete (R$15) + Anúncios (5%)
- **Receita Líquida**: Quanto você realmente recebe
- **Custo Máximo**: Preço que deve pagar para ter 30% de lucro

### **4. Dashboard**
- Visualize estatísticas gerais
- Gráficos de distribuição de margem
- Recomendações baseadas nos dados

## 🛠️ **Desenvolvimento Local**

```bash
# Clone o repositório
git clone https://github.com/pommerrrr/ML.git
cd ML

# Instale dependências
npm install

# Configure variáveis locais
cp .env.example .env
# Edite .env com suas credenciais Firebase

# Execute
npm run dev
```

## 📦 **Build e Deploy**

```bash
# Build para produção
npm run build

# Preview local
npm run preview
```

O deploy automático acontece via GitHub Actions ao fazer push na branch main.

## 🔧 **Personalização**

### **Modificar Taxas de Custos**

Edite `src/services/mercadoLivre.ts`:

```typescript
const mlFeePercentage = 0.12; // 12% taxa ML
const shippingCost = 15; // R$ 15 frete médio
const premiumAdCost = sellingPrice * 0.05; // 5% anúncios
const targetProfitMargin = 0.30; // 30% lucro target
```

## 🌐 **API do Mercado Livre**

### **Endpoints Utilizados (Públicos - sem autenticação):**
- `/sites/MLB/search` - Buscar produtos
- `/sites/MLB/categories` - Listar categorias

### **Fallback Automático:**
- Se a API falhar (CORS/limite), o sistema usa dados mock para demonstração
- Todas as funcionalidades continuam operando normalmente

## 🔍 **Solução de Problemas**

### **Página em Branco:**
1. Verifique se as secrets do Firebase estão configuradas
2. Abra F12 → Console para ver erros específicos

### **Erro 404 nos Assets:**
- Verifique se `base: '/ML/'` está correto no `vite.config.js`

### **API do ML não funciona:**
- Normal! O sistema tem fallback automático com dados mock
- Para produção, implemente um backend próprio

## 📊 **Métricas e KPIs**

O sistema calcula automaticamente:
- **Taxa de conversão**: % de produtos com margem >30%
- **Margem média**: Média de todas as análises
- **ROI projetado**: Retorno sobre investimento esperado
- **Distribuição por categoria**: Quais nichos são mais lucrativos

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 **Suporte**

- **Issues**: [GitHub Issues](https://github.com/pommerrrr/ML/issues)
- **Documentação**: Este README
- **Firebase**: [Documentação Firebase](https://firebase.google.com/docs)

---

✨ **Desenvolvido para otimizar suas vendas no Mercado Livre!**