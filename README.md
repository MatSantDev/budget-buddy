# Budget Buddy

Protótipo de **frontend alternativo** para o [OrcamentoFly](https://github.com/MatSantDev/OrcamentoFly), sistema de controle de orçamentos. A interface foi gerada com [Lovable](https://lovable.dev) e consome a API REST em Spring Boot do OrcamentoFly.

## Páginas

- **Dashboard** — visão geral do sistema
- **Produtos** — cadastro, edição, exclusão e listagem
- **Serviços** — cadastro, edição, exclusão e listagem
- **Orçamentos** — listagem e criação de orçamentos
- **Detalhe do orçamento** — itens, valores e status

## Como executar

1. Suba o backend do [OrcamentoFly](https://github.com/MatSantDev/OrcamentoFly) (a API deve responder em `http://localhost:8080`).
2. Instale as dependências e rode o frontend:

```bash
npm install
npm run dev
```

O endereço da API está em `src/services/api.ts` (`API_BASE`).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Testes com Vitest |
| `npm run lint` | ESLint |

## Tecnologias

React · Vite · TypeScript · Tailwind CSS · shadcn/ui · Vitest · Playwright · Lovable
