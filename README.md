# WTR Finance

WTR Finance é uma aplicação web moderna para gerenciamento financeiro pessoal, construída com tecnologias de ponta.

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- [Next.js](https://nextjs.org/) - Framework React para produção
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Prisma](https://www.prisma.io/) - ORM para banco de dados
- [Clerk](https://clerk.com/) - Autenticação e gerenciamento de usuários
- [Radix UI](https://www.radix-ui.com/) - Componentes UI primitivos e acessíveis
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários

## Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn
- Docker (para ambiente de desenvolvimento com banco de dados)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/wtr-finance.git
cd wtr-finance
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias.

4. Inicie o ambiente de desenvolvimento:
```bash
# Inicie o banco de dados (Docker)
docker-compose up -d

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de linting

## Estrutura do Projeto

```
wtr-finance/
├── app/                # Páginas e rotas da aplicação
├── components/         # Componentes React reutilizáveis
├── lib/               # Utilitários e configurações
├── prisma/            # Schema e migrações do banco de dados
└── public/            # Arquivos estáticos
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).
