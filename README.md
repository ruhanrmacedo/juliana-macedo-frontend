# Juliana Macedo — Plataforma de Nutrição

Plataforma web para publicação de conteúdo e acompanhamento nutricional, reunindo blog, autenticação, administração de conteúdo e módulos de atendimento a pacientes.

## Sobre o projeto

O projeto foi originalmente desenvolvido com o nome **Vida & Sabor**. Durante sua evolução, a identidade pública foi alterada para **Juliana Macedo**, por decisão da cliente, aproximando a plataforma da marca profissional da nutricionista.

Este repositório contém a interface construída em React e consome uma API mantida separadamente. A aplicação atende dois contextos principais:

- acesso público a artigos e recursos nutricionais;
- área autenticada para perfil, administração de conteúdo e acompanhamento de pacientes.

## Aplicação em produção

A versão pública da plataforma está disponível em:

- [julianalcmacedo.com.br](https://julianalcmacedo.com.br/)

## Principais funcionalidades

### Conteúdo e comunidade

- listagem e leitura de artigos;
- comentários em publicações;
- registro de curtidas e visualizações;
- criação, edição, arquivamento, republicação e exclusão de posts na área administrativa;
- editor de conteúdo rich text com Tiptap;
- sanitização do conteúdo renderizado com DOMPurify.

### Autenticação e perfil

- cadastro e login;
- persistência da sessão por contexto de autenticação;
- consulta e atualização de perfil;
- proteção de rotas conforme autenticação e permissões.

### Acompanhamento nutricional

- listagem e perfil de pacientes;
- registro e consulta de métricas;
- avaliações antropométricas;
- cálculos antropométricos automáticos e por método específico;
- acompanhamento gestacional e registro de visitas;
- calculadoras de IMC, taxa metabólica basal, gasto energético diário, macronutrientes e ingestão de água.

### Módulos em desenvolvimento

As interfaces de anamnese, plano alimentar, evolução fotográfica, histórico de evolução e financeiro estão estruturadas na navegação, mas ainda são apresentadas como funcionalidades em construção.

## Tecnologias

- React 18;
- TypeScript;
- Vite;
- React Router;
- Axios;
- Tailwind CSS;
- componentes baseados em Radix UI;
- Tiptap;
- DOMPurify;
- date-fns;
- Lucide React;
- Sonner;
- Google reCAPTCHA no fluxo de interface.

O projeto possui a infraestrutura do TanStack React Query configurada, mas os fluxos principais observados utilizam chamadas pelo cliente Axios e funções próprias de acesso à API.

## Arquitetura do frontend

A aplicação segue uma organização por páginas, componentes e serviços de acesso à API:

- **roteamento:** React Router organiza as áreas pública, autenticada, administrativa e de pacientes;
- **autenticação:** `AuthContext` centraliza o estado da sessão;
- **comunicação com a API:** cliente Axios e funções específicas em `src/lib`;
- **interface:** componentes reutilizáveis e infraestrutura visual em `src/components`;
- **páginas:** fluxos de negócio e telas em `src/pages`;
- **estado:** estado local e Context API nos fluxos existentes.

## Estrutura resumida

```text
src/
├── components/       # Componentes, modais, calculadoras e editor
│   └── ui/           # Componentes da interface
├── hooks/            # Contexto e hooks, incluindo autenticação
├── lib/              # Cliente da API, serviços, tipos e utilitários
├── pages/            # Páginas e fluxos da aplicação
└── App.tsx            # Rotas e composição principal
```

## Backend relacionado

A API utilizada por este frontend está disponível em:

- [Juliana Macedo — API](https://github.com/ruhanrmacedo/juliana-macedo-backend)

## Executando localmente

### Requisitos

- Node.js compatível com as dependências do projeto;
- npm;
- instância local ou remota da API Juliana Macedo.

### Configuração

Crie um arquivo de ambiente local e informe a URL da API:

```env
VITE_API_URL=http://localhost:PORTA_DA_API
```

Use somente configurações próprias do seu ambiente e não versione credenciais.

### Instalação e desenvolvimento

```bash
npm install
npm run dev
```

### Build de produção

```bash
npm run build
```

Para visualizar localmente o resultado do build:

```bash
npm run preview
```

Outros scripts disponíveis:

```bash
npm run lint
npm run build:dev
```

## Status

### Implementado

- blog e interação com artigos;
- autenticação e perfil;
- administração de posts;
- pacientes e métricas;
- antropometria;
- acompanhamento gestacional;
- calculadoras nutricionais.

### Em desenvolvimento

- anamnese;
- plano alimentar na interface;
- fotos de evolução;
- histórico de evolução;
- módulo financeiro.

A evolução dos módulos depende também dos contratos e recursos disponíveis na API relacionada.

## Privacidade

O sistema trabalha com domínios que podem envolver informações pessoais e de saúde. Dados usados em demonstrações, documentação e screenshots devem ser exclusivamente fictícios. Credenciais, informações clínicas e dados identificáveis não devem ser publicados.

## Screenshots

Screenshots serão adicionados após a preparação de cenários com dados fictícios e a revisão de privacidade. As imagens planejadas incluem:

- página inicial e listagem de artigos;
- leitura de um artigo;
- editor administrativo;
- listagem de pacientes fictícios;
- avaliação antropométrica;
- acompanhamento gestacional.

## Autoria

Desenvolvido por **Ruhan Macedo**.

## Licença

Este projeto ainda não possui uma licença pública definida.