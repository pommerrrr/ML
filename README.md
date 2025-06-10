# Mercado Livre Analyzer

Sistema web para análise de produtos e margens de lucro do Mercado Livre. Conecta-se à API pública do Mercado Livre e utiliza Firebase como banco de dados.

## 🚀 Funcionalidades

- **Análise de Produtos**: Calcule margens de lucro e custos operacionais automaticamente
- **Tendências**: Veja os produtos mais populares do Mercado Livre
- **Configurações Personalizáveis**: Ajuste taxas e margens conforme seu negócio
- **Dashboard Completo**: Visualize estatísticas e relatórios detalhados
- **Histórico de Análises**: Gerencie todos os produtos analisados
- **Relatórios Visuais**: Gráficos e insights sobre sua performance

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS V4, ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **API**: Mercado Livre API pública

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Conta no Firebase
- Conta de desenvolvedor no Mercado Livre (opcional, para APIs avançadas)

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

   # Mercado Livre API (opcional)
   MERCADOLIVRE_CLIENT_ID=seu_client_id
   MERCADOLIVRE_CLIENT_SECRET=seu_client_secret

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

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente no painel da Vercel

2. **Deploy automático**
   - O Vercel fará o deploy automaticamente a cada push

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📖 Como Usar

### 1. Configuração Inicial

Acesse a página de **Configurações** e defina:
- Margem de lucro desejada (padrão: 30%)
- Taxa do Mercado Livre (padrão: 12%)
- Custo de frete (padrão: 10%)
- Investimento em publicidade (padrão: 5%)
- Custos fixos adicionais

### 2. Analisando Produtos

1. Vá para **Análise de Produtos**
2. Cole a URL do produto do Mercado Livre ou apenas o ID
   - Exemplo: `https://produto.mercadolivre.com.br/MLB-123456789-produto`
   - Ou apenas: `MLB-123456789`
3. Clique em **Analisar**
4. Veja os resultados:
   - Breakdown completo de custos
   - Margem de lucro atual
   - Preço máximo de custo recomendado
   - Análise da concorrência

### 3. Explorando Tendências

- Acesse **Tendências** para ver produtos populares
- Clique em qualquer tendência para ver produtos relacionados
- Use a busca para encontrar produtos específicos

### 4. Gerenciando Produtos

- Em **Produtos Salvos**, veja todas as análises anteriores
- Filtre por status (ganhando/perdendo)
- Busque por nome ou ID do produto
- Exclua análises antigas

### 5. Relatórios

- Acesse **Relatórios** para visualizar:
  - Distribuição de margens
  - Status dos produtos
  - Atividade dos últimos dias
  - Top produtos por margem
- Exporte relatórios em JSON

## 🔧 Estrutura do Projeto

```
mercadolivre-analyzer/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── analysis/          # Página de análise
│   ├── products/          # Produtos salvos
│   ├── trends/            # Tendências
│   ├── reports/           # Relatórios
│   ├── settings/          # Configurações
│   └── page.tsx           # Dashboard principal
├── components/            # Componentes React
│   ├── ui/               # ShadCN UI components
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilitários
│   ├── firebase.ts      # Configuração Firebase
│   ├── firebase-service.ts # Serviços Firebase
│   ├── mercadolivre-api.ts # API Mercado Livre
│   └── utils.ts          # Utilitários gerais
├── types/                # Tipos TypeScript
└── public/               # Arquivos públicos
```

## 📊 Funcionalidades da API

### Endpoints Principais

- `/api/mercadolivre/trends` - Buscar tendências
- `/api/mercadolivre/search` - Buscar produtos
- `/api/analysis` - Analisar produtos (POST/GET)
- `/api/settings` - Configurações (GET/POST)
- `/api/dashboard` - Estatísticas do dashboard

### Integração Mercado Livre

O sistema utiliza a API pública do Mercado Livre:
- Busca de produtos por categoria/palavra-chave
- Informações de produtos (preço, vendas, etc.)
- Tendências e produtos populares
- Análise de concorrência

## 🎨 Personalização

### Cores e Tema

O sistema usa Tailwind CSS V4. Para personalizar as cores, edite o arquivo `app/globals.css`.

### Configurações de Negócio

Ajuste os parâmetros padrão em:
- `lib/firebase-service.ts` - Configurações padrão
- `app/settings/page.tsx` - Interface de configuração

### Fórmulas de Cálculo

Os cálculos de margem estão em `lib/mercadolivre-api.ts` no método `calculateProductAnalysis`.

## 🔒 Segurança

### Produção

Para uso em produção:

1. **Configure regras de segurança do Firebase**
2. **Implemente autenticação** (NextAuth.js está incluído)
3. **Use HTTPS** sempre
4. **Configure CORS** adequadamente
5. **Valide dados** do lado do servidor

### Variáveis de Ambiente

Nunca commite o arquivo `.env.local`. Use sempre `.env.example` como template.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Procure por issues similares no GitHub
3. Abra uma nova issue com detalhes do problema

## 🎯 Roadmap

- [ ] Autenticação de usuários
- [ ] API webhooks para atualizações automáticas
- [ ] Alertas de preço
- [ ] Integração com outras marketplaces
- [ ] App mobile
- [ ] IA para recomendações de produtos

---

**Desenvolvido com ❤️ para vendedores do Mercado Livre**