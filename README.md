# Sistema de Análise Mercado Livre

Sistema web para análise de produtos mais vendidos no Mercado Livre, com cálculo automático de custos e margem de lucro ideal.

## 🚀 Funcionalidades

- **Análise de Produtos**: Busca automática dos produtos mais vendidos e catalogados no Mercado Livre
- **Cálculo de Custos**: Análise detalhada dos custos (comissão ML, taxa fixa, frete)
- **Margem de Lucro**: Calcula o valor ideal de custo para margem ≥ 30%
- **Salvamento no Firebase**: Armazena análises para consulta posterior
- **Dashboard Intuitivo**: Interface moderna com gráficos e estatísticas
- **Filtros por Categoria**: Análise segmentada por categorias do ML

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind V4, ShadCN UI, Recharts
- **Backend**: API Routes do Next.js
- **Banco de Dados**: Firebase Firestore
- **Integrações**: API do Mercado Livre
- **Deploy**: Vercel (configurado)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd ml-analise
```

2. Instale as dependências:
```bash
bun install
```

3. Configure as variáveis de ambiente criando um arquivo `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCcRs1o1MRJQHNjV-m5cyG1aB17zURnHAI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ml-analise.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ml-analise
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ml-analise.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1067736402366
NEXT_PUBLIC_FIREBASE_APP_ID=1:1067736402366:web:03303b5dbd934c4b18d1ef
MERCADO_LIVRE_API_BASE=https://api.mercadolibre.com
```

4. Execute o projeto:
```bash
bun dev
```

## 🔧 Deploy no Vercel

1. Conecte o repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático será realizado a cada push

## 🏗️ Estrutura do Projeto

```
├── app/
│   ├── api/ml/          # API routes para Mercado Livre
│   ├── globals.css      # Estilos globais
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Página inicial
│   └── providers.tsx    # Providers (React Query, Toast)
├── components/
│   ├── ui/              # Componentes ShadCN UI
│   ├── dashboard.tsx    # Dashboard principal
│   ├── product-card.tsx # Card de produto
│   ├── analysis-stats.tsx # Estatísticas
│   └── saved-analyses.tsx # Análises salvas
├── hooks/
│   ├── use-products.ts  # Hook para produtos ML
│   └── use-firebase.ts  # Hook para Firebase
├── lib/
│   ├── firebase.ts      # Configuração Firebase
│   ├── mercado-livre.ts # Utilitários ML
│   └── utils.ts         # Utilitários gerais
└── .env.local           # Variáveis de ambiente
```

## 📊 Como Funciona

### 1. Busca de Produtos
- Utiliza a API do Mercado Livre (`/highlights` e `/search`)
- Filtra apenas produtos catalogados
- Ordena por quantidade vendida

### 2. Cálculo de Custos
- **Comissão**: 12% (Clássico) ou 17% (Premium)
- **Taxa Fixa**: Até R$ 6,75 baseado no preço
- **Frete**: Estimativa baseada no valor do produto

### 3. Margem de Lucro
- Calcula receita líquida (preço - custos)
- Sugere custo máximo para 30%+ de lucro
- Classifica produtos como lucrativos ou não

## 🔥 Recursos Principais

### Dashboard
- Estatísticas em tempo real
- Gráficos de distribuição por margem
- Top 3 produtos mais lucrativos
- Filtros por categoria

### Análise de Produtos
- Card detalhado para cada produto
- Link direto para o produto no ML
- Botão para salvar análise
- Cálculos detalhados de custo

### Firebase Integration
- Salvamento automático de análises
- Histórico de produtos analisados
- Notas personalizadas
- Sincronização em tempo real

## 🎯 Regras de Negócio

### Custos do Mercado Livre
- **Anúncio Clássico**: 10-14% de comissão
- **Anúncio Premium**: 15-19% de comissão
- **Taxa Fixa**: Varia de acordo com o preço
- **Frete Grátis**: Custo assumido pelo vendedor

### Margem de Lucro
- **Meta**: ≥ 30% de margem líquida
- **Aceitável**: 15-30% de margem
- **Baixa**: < 15% de margem

## 🔒 Segurança

- Variáveis de ambiente para chaves sensíveis
- Regras do Firebase configuradas
- CORS configurado para domínio específico
- Rate limiting nas APIs

## 📱 Responsividade

- Design mobile-first
- Interface adaptativa
- Gráficos responsivos
- Navegação otimizada para touch

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido para análise de oportunidades no Mercado Livre** 🛒