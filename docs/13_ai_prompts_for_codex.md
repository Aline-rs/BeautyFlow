# 13 — Prompts para Codex

## Prompt inicial de contexto

```text
Você está trabalhando no projeto BeautyFlow, um SaaS mobile para cabeleireiros acompanharem clientes, atendimentos e mensagens de retorno pelo WhatsApp.

Antes de codar, leia:
- docs/00_codex_context.md
- docs/01_product_requirements.md
- specs/001-beautyflow-mvp/spec.md
- specs/001-beautyflow-mvp/plan.md
- specs/001-beautyflow-mvp/tasks.md

Regras:
- Não implemente funcionalidades fora do MVP.
- Não implemente WhatsApp Cloud API.
- Use React Native + Expo + TypeScript no frontend.
- Use ASP.NET Core + PostgreSQL no backend.
- Sempre preserve o escopo por SalonId.
- Faça uma task por vez.
- Antes de alterar arquivos, explique o plano.
```

## Prompt para frontend

```text
Execute a próxima task frontend marcada como pendente em docs/11_frontend_tasks.md.

Antes de codar:
1. Liste os arquivos que pretende criar/alterar.
2. Explique como a solução respeita o design system de docs/09_ui_design_system.md.
3. Não implemente outras tasks.

Depois de codar:
1. Explique o que foi feito.
2. Liste comandos para testar.
3. Informe qualquer pendência.
```

## Prompt para backend

```text
Execute a próxima task backend marcada como pendente em docs/12_backend_tasks.md.

Antes de codar:
1. Liste os arquivos que pretende criar/alterar.
2. Explique como a solução garante autenticação, validação e SalonId.
3. Não implemente outras tasks.

Depois de codar:
1. Explique o que foi feito.
2. Liste comandos para testar.
3. Informe riscos ou pendências.
```

## Prompt para revisão de segurança

```text
Revise as alterações recentes procurando problemas de segurança:
- Falta de autenticação.
- Falta de filtro por SalonId.
- Exposição de passwordHash.
- Upload inseguro.
- Logs com dados sensíveis.
- Erros expondo detalhes internos.

Não altere código ainda. Primeiro gere um relatório com achados e recomendações.
```

## Prompt para revisão de qualidade

```text
Revise as alterações recentes com foco em qualidade:
- Duplicação de código.
- Componentes grandes demais.
- Controllers com regra de negócio.
- Falta de DTOs.
- Falta de validação.
- Naming inconsistente.
- Testes ausentes.

Não altere código ainda. Primeiro gere um relatório com achados e recomendações.
```

## Prompt para integração frontend/backend

```text
Integre a tela atual com a API real seguindo docs/04_api_contract.md.

Regras:
- Remova mocks apenas da tela integrada.
- Adicione loading e estado de erro.
- Use services em src/services ou dentro da feature.
- Não chame Axios diretamente dentro de componentes grandes se puder encapsular.
- Mantenha a UI alinhada ao design system.
```
