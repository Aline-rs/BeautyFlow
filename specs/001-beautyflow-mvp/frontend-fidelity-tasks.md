# Tasks Complementares — Frontend Pixel/Fidelity

## Fase 0 — Preparação do contexto

- [ ] Copiar `AGENTS.md` para a raiz do repositório.
- [ ] Copiar `design-reference/beautyflow_mvp_mobile_prototype.html` para a raiz do repositório em `design-reference/`.
- [ ] Garantir que Codex leia `docs/14_frontend_visual_implementation_spec.md` antes de implementar.

## Fase 1 — Design tokens

- [ ] Criar `src/theme/colors.ts` com as cores do protótipo.
- [ ] Criar `src/theme/typography.ts` com Playfair Display e DM Sans.
- [ ] Criar `src/theme/spacing.ts`.
- [ ] Criar `src/theme/radius.ts`.
- [ ] Criar `src/theme/shadows.ts`.

## Fase 2 — Fontes

- [ ] Instalar `expo-font`.
- [ ] Carregar Playfair Display.
- [ ] Carregar DM Sans.
- [ ] Garantir fallback enquanto fontes carregam.

## Fase 3 — Componentes base

- [ ] Criar `Screen`.
- [ ] Criar `TopBar`.
- [ ] Criar `AppButton`.
- [ ] Criar `AppInput`.
- [ ] Criar `AppTextarea`.
- [ ] Criar `AppSelect`.
- [ ] Criar `AppCard`.
- [ ] Criar `AppChip`.
- [ ] Criar `Avatar`.
- [ ] Criar `PhotoPicker`.
- [ ] Criar `StatCard`.
- [ ] Criar `ListCard`.
- [ ] Criar `EmptyState`.

## Fase 4 — Navegação

- [ ] Criar AuthStack.
- [ ] Criar MainTabs.
- [ ] Criar stacks internos para Clientes, Atendimentos, Mensagens e Mais.
- [ ] Configurar bottom tab com Início, Clientes, Atendimentos, Mensagens, Mais.

## Fase 5 — Telas

- [ ] Implementar Splash.
- [ ] Implementar Login.
- [ ] Implementar Criar Conta.
- [ ] Implementar Home.
- [ ] Implementar Clientes.
- [ ] Implementar Nova Cliente / Editar Cliente.
- [ ] Implementar Detalhes da Cliente.
- [ ] Implementar Serviços.
- [ ] Implementar Novo Serviço / Editar Serviço.
- [ ] Implementar Registrar Atendimento.
- [ ] Implementar Histórico de Atendimentos.
- [ ] Implementar Mensagens.
- [ ] Implementar Detalhe da Mensagem.
- [ ] Implementar Mensagens Padrão.
- [ ] Implementar Meu Salão.
- [ ] Implementar Notificações.
- [ ] Implementar Mais.

## Fase 6 — Comportamentos do MVP

- [ ] Login mockado redireciona para Home.
- [ ] Criar Conta mockado redireciona para Home.
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
- [ ] Remover console.log.
- [ ] Remover código morto.
- [ ] Documentar pendências.
