# Tasks Complementares — Frontend Pixel/Fidelity

## Fase 0 — Preparação do contexto

- [x] Copiar `AGENTS.md` para a raiz do repositório.
- [x] Copiar `design-reference/beautyflow_mvp_mobile_prototype.html` para a raiz do repositório em `design-reference/`.
- [x] Garantir que Codex leia `docs/14_frontend_visual_implementation_spec.md` antes de implementar.

## Fase 1 — Design tokens

- [x] Criar `src/theme/colors.ts` com as cores do protótipo.
- [x] Criar `src/theme/typography.ts` com Playfair Display e DM Sans.
- [x] Criar `src/theme/spacing.ts`.
- [x] Criar `src/theme/radius.ts`.
- [x] Criar `src/theme/shadows.ts`.

## Fase 2 — Fontes

- [x] Instalar `expo-font`.
- [x] Carregar Playfair Display.
- [x] Carregar DM Sans.
- [ ] Garantir fallback enquanto fontes carregam.

## Fase 3 — Componentes base

- [x] Criar `Screen`.
- [x] Criar `TopBar`.
- [x] Criar `AppButton`.
- [x] Criar `AppInput`.
- [x] Criar `AppTextarea`.
- [x] Criar `AppSelect`.
- [x] Criar `AppCard`.
- [x] Criar `AppChip`.
- [x] Criar `Avatar`.
- [x] Criar `PhotoPicker`.
- [x] Criar `StatCard`.
- [x] Criar `ListCard`.
- [x] Criar `EmptyState`.

## Fase 4 — Navegação

- [x] Criar AuthStack.
- [x] Criar MainTabs.
- [x] Criar stacks internos para Clientes, Atendimentos, Mensagens e Mais.
- [x] Configurar bottom tab com Início, Clientes, Atendimentos, Mensagens, Mais.

## Fase 5 — Telas

- [x] Implementar Splash.
- [x] Implementar Login.
- [x] Implementar Criar Conta.
- [~] Implementar Home.
- [~] Implementar Clientes.
- [~] Implementar Nova Cliente / Editar Cliente.
- [~] Implementar Detalhes da Cliente.
- [~] Implementar Serviços.
- [ ] Implementar Novo Serviço / Editar Serviço.
- [~] Implementar Registrar Atendimento.
- [~] Implementar Histórico de Atendimentos.
- [~] Implementar Mensagens.
- [~] Implementar Detalhe da Mensagem.
- [~] Implementar Mensagens Padrão.
- [~] Implementar Meu Salão.
- [~] Implementar Notificações.
- [~] Implementar Mais.

## Fase 6 — Comportamentos do MVP

- [x] Login mockado redireciona para Home.
- [x] Criar Conta mockado redireciona para Home.
- [ ] Registrar Atendimento calcula data de retorno.
- [ ] Cliente permite selecionar foto.
- [ ] Foto aparece no preview.
- [ ] Mensagem permite editar texto.
- [ ] Botão Abrir WhatsApp monta link ou deixa mock documentado.
- [ ] Mensagem pode ser marcada como enviada no estado local.

## Fase 7 — Validação visual

- [ ] Comparar Splash com HTML.
- [ ] Comparar Login com HTML.
- [ ] Comparar Home com HTML.
- [ ] Comparar Clientes com HTML.
- [ ] Comparar Nova Cliente com HTML.
- [ ] Comparar Mensagens com HTML.
- [ ] Ajustar espaçamentos, bordas e cores.
- [ ] Garantir que a identidade visual não foi descaracterizada.

## Fase 8 — Qualidade

- [ ] Rodar TypeScript check.
- [ ] Rodar lint.
- [x] Remover console.log.
- [ ] Remover código morto.
- [ ] Documentar pendências.
