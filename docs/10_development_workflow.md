# 10 — Workflow de Desenvolvimento com Codex e Spec Kit

## 1. Objetivo

Definir um fluxo de trabalho controlado para usar Codex na implementação do BeautyFlow sem perder consistência arquitetural.

## 2. Estrutura Spec Kit

Usar a estrutura:

```text
specs/001-beautyflow-mvp/
  spec.md
  plan.md
  tasks.md
  checklists/
    quality.md
```

## 3. Ordem recomendada

1. Codex deve ler `docs/00_codex_context.md`.
2. Codex deve ler `specs/001-beautyflow-mvp/spec.md`.
3. Codex deve ler `specs/001-beautyflow-mvp/plan.md`.
4. Codex deve executar tasks de `tasks.md` em ordem.
5. Cada task deve gerar commit pequeno.

## 4. Modo de trabalho com IA

Para cada etapa:

```text
1. Peça para o Codex explicar o plano antes de codar.
2. Peça para alterar poucos arquivos por vez.
3. Revise diff.
4. Rode build/testes.
5. Só depois avance para a próxima task.
```

## 5. Regras para o Codex

- Não alterar arquitetura sem justificar.
- Não adicionar bibliotecas sem necessidade.
- Não implementar pagamento.
- Não implementar WhatsApp Cloud API no MVP.
- Não deixar secrets no código.
- Não criar dados hardcoded em fluxo real integrado.
- Não ignorar validação backend.

## 6. Branches sugeridas

```text
feature/mobile-foundation
feature/api-foundation
feature/customers
feature/services
feature/appointments
feature/messages
feature/settings
feature/integration-mobile-api
```

## 7. Critério para merge

- Build frontend passa.
- Build backend passa.
- Testes mínimos passam.
- Fluxo principal validado manualmente.
- Documentação atualizada se contrato mudar.
