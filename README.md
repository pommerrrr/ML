# Mercado Livre Analyzer

Sistema web para análise de produtos e margens de lucro do Mercado Livre. **Sistema híbrido que SEMPRE funciona**: tenta buscar produtos reais da API do Mercado Livre e, se falhar, usa produtos de demonstração realistas. Utiliza Firebase como banco de dados.

## 🚀 Funcionalidades

- **Sistema Híbrido Inteligente**: Busca produtos reais da API do ML, com fallback para produtos de demonstração
- **Análise Completa**: Calcule margens de lucro e custos operacionais automaticamente
- **Filtros Avançados**: Por categoria, preço, mais vendidos, busca por nome
- **Configurações Personalizáveis**: Ajuste taxas e margens conforme seu negócio
- **Dashboard Completo**: Visualize estatísticas e relatórios detalhados
- **Histórico de Análises**: Gerencie todos os produtos analisados
- **Relatórios Visuais**: Gráficos e insights sobre sua performance

## 🔧 Sistema Híbrido - SEMPRE Funciona

### **Como Funciona:**

```
1º Tentativa: API Real do Mercado Livre
   ├─ Busca produtos por termos populares
   ├─ Filtra produtos válidos (preço > 0, título, etc.)
   └─ Ordena por mais vendidos

2º Tentativa: Produtos de Demonstração
   ├─ 10 produtos realistas com dados reais
   ├─ URLs funcionais do Mercado Livre
   ├─ Imagens e preços atualizados
   └─ Permite testar todas as funcionalidades
```

### **Indicadores Visuais:**
- 🟢 **"API Real"** - Produtos diretos do Mercado Livre
- 🟡 **"Demonstração"** - Produtos para teste das funcionalidades
- ⚠️ **Aviso laranja** - Quando está em modo demonstração

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS V4, ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **API**: Mercado Livre API + Sistema de Fallback

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Conta no Firebase
- Conta de desenvolvedor no Mercado Livre (opcional)

## ⚙️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd mercadolivre-analyzer
   ```

2. **Instale as dependências**
   ```bash
   bun install
   # ou
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Configure as variáveis no arquivo `.env.local`:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

   # NextAuth
   NEXTAUTH_SECRET=seu_secret_aleatorio
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Configure o Firebase**

   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative o Firestore Database
   - Copie as configurações do projeto para as variáveis de ambiente
   - Configure as regras de segurança do Firestore:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Para desenvolvimento
         // Em produção, implemente regras de segurança adequadas
       }
     }
   }
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   bun dev
   # ou
   npm run dev
   ```

   Acesse http://localhost:3000

## 🚀 Deploy no Vercel

### **Configuração Automática**

1. **Conecte seu repositório ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente no painel da Vercel

2. **Variáveis de Ambiente no Vercel:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCcRs1o1MRJQHNjV-m5cyG1aB17zURnHAI
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ml-analise.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=ml-analise
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ml-analise.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1067736402366
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1067736402366:web:03303b5dbd934c4b18d1ef
   NEXTAUTH_SECRET=sua_chave_secreta_aleatoria
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   ```

3. **Deploy automático**
   - O Vercel fará o deploy automaticamente a cada push

## 📖 Como Usar

### 1. Configuração Inicial

Acesse a página de **Configurações** e defina:
- Margem de lucro desejada (padrão: 30%)
- Taxa do Mercado Livre (padrão: 12%)
- Custo de frete (padrão: 10%)
- Investimento em publicidade (padrão: 5%)
- Custos fixos adicionais

### 2. Explorando o Catálogo de Produtos

1. Vá para **Catálogo de Produtos**
2. O sistema carrega automaticamente produtos (reais ou demonstração)
3. Use os filtros para encontrar produtos específicos:
   - **Busca por nome**: Digite palavras-chave
   - **Ordenação**: Mais vendidos, menor/maior preço, A-Z
   - **Faixa de preço**: Filtre por ranges de valor
   - **Categoria**: Selecione categorias específicas
4. Clique em **Analisar** em qualquer produto para ver:
   - Breakdown completo de custos
   - Margem de lucro atual
   - Preço máximo de custo recomendado
   - Análise da concorrência

### 3. Sistema Inteligente

**🟢 Quando a API está funcionando:**
- Produtos reais do Mercado Livre
- Dados atualizados em tempo real
- Links funcionais para os anúncios
- Imagens e preços reais

**🟡 Quando a API não está disponível:**
- Produtos de demonstração realistas
- 10 produtos com dados baseados em produtos reais
- Todas as funcionalidades continuam funcionando
- Permite testar análises e filtros

### 4. Análise Detalhada

O sistema calcula automaticamente:
1. **Custos do ML:** Taxa da plataforma (12% padrão)
2. **Frete:** Percentual do preço (10% padrão) 
3. **Publicidade:** Investment em ads (5% padrão)
4. **Custos fixos:** Embalagem, etiquetas, etc.
5. **Valor líquido:** Preço - todos os custos
6. **Preço de custo máximo:** Para atingir 30% de margem

**Fórmula:** `Custo Máximo = Valor Líquido / (1 + Margem Desejada/100)`

## 🔍 Produtos de Demonstração Incluídos

1. **Samsung Galaxy A55 5G** - R$ 1.899,99 (3.254 vendidos)
2. **Notebook Lenovo IdeaPad 3** - R$ 2.299,99 (1.847 vendidos)  
3. **Fone JBL Bluetooth** - R$ 449,99 (5.641 vendidos)
4. **Apple Watch Series 9** - R$ 3.299,99 (892 vendidos)
5. **Air Fryer Mondial** - R$ 189,99 (8.934 vendidos)
6. **Tênis Nike Air Max** - R$ 349,99 (6.527 vendidos)
7. **Smart TV Samsung 55"** - R$ 2.199,99 (1.234 vendidos)
8. **PlayStation 5 Slim** - R$ 3.799,99 (456 vendidos)
9. **Perfume Ferrari Black** - R$ 279,99 (2.847 vendidos)
10. **Camiseta Premium** - R$ 59,99 (12.847 vendidos)

Todos com:
- ✅ **URLs reais** do Mercado Livre
- ✅ **Imagens reais** dos produtos
- ✅ **Dados de vendas** realistas
- ✅ **Funcionam na análise** completa

## 📊 Funcionalidades da API

### Endpoints Principais

- `/api/mercadolivre/catalog` - **Sistema híbrido** (produtos reais + fallback)
- `/api/mercadolivre/search` - Buscar produtos tradicionais
- `/api/mercadolivre/trends` - Buscar tendências
- `/api/analysis` - Analisar produtos (POST/GET)
- `/api/settings` - Configurações (GET/POST)
- `/api/dashboard` - Estatísticas do dashboard

### Sistema Híbrido de Busca

```javascript
// 1º Tentativa: API Real
await fetch('/sites/MLB/search?q=celular&limit=20')

// 2º Tentativa: Produtos de Demonstração  
return getDemoProducts()
```

## 🎯 Garantias do Sistema

- ✅ **SEMPRE funciona** (híbrido: real + demo)
- ✅ **Interface responsiva** em qualquer dispositivo
- ✅ **Filtros funcionais** independente da fonte dos dados
- ✅ **Análise completa** funciona com todos os produtos
- ✅ **Visual profissional** com indicadores de modo
- ✅ **Dados realistas** mesmo em modo demonstração

## 🔒 Segurança

### Produção

Para uso em produção:

1. **Configure regras de segurança do Firebase**
2. **Implemente autenticação** (NextAuth.js está incluído)
3. **Use HTTPS** sempre
4. **Configure CORS** adequadamente
5. **Valide dados** do lado do servidor

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 🆘 Resolução de Problemas

### Problemas Comuns

1. **"Nenhum produto encontrado"** → Sistema automaticamente usa produtos de demonstração
2. **Erro de CORS** → Configure as variáveis de ambiente corretamente
3. **Firebase Error** → Verifique as configurações do Firebase
4. **Build Error** → Execute `bun install` novamente

### Debug

O sistema inclui logs detalhados:
- Console do navegador mostra tentativas de API
- Feedback visual na interface sobre o status
- Indicadores visuais quando está em modo demonstração

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para vendedores do Mercado Livre**

**Sistema Híbrido Garantido: SEMPRE funciona, com produtos reais ou demonstração! 🚀**