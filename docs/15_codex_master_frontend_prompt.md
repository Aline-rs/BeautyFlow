# Prompt Mestre para Codex — Implementar Frontend BeautyFlow

Leia antes de começar:

1. `AGENTS.md`
2. `docs/14_frontend_visual_implementation_spec.md`
3. `design-reference/beautyflow_mvp_mobile_prototype.html`
4. `docs/02_frontend_architecture.md`
5. `specs/001-beautyflow-mvp/tasks.md`

## Tarefa

Implemente o frontend mobile do BeautyFlow em React Native com Expo e TypeScript, reproduzindo com alta fidelidade o protótipo HTML em `design-reference/beautyflow_mvp_mobile_prototype.html`.

## Regras

- Não redesenhe o app.
- Não altere a identidade visual.
- Não implemente backend nesta etapa.
- Use dados mockados inicialmente.
- Crie componentes reutilizáveis.
- Configure navegação real com React Navigation.
- Configure fontes com expo-font.
- Use Expo Image Picker no cadastro de cliente.
- A tela de cadastro/edição de cliente deve permitir inserir foto e exibir preview.
- Implemente todas as telas do MVP listadas no AGENTS.md.

## Ordem de execução

1. Criar projeto Expo TypeScript se ainda não existir.
2. Criar estrutura de pastas.
3. Criar tokens de design.
4. Configurar fontes.
5. Criar componentes compartilhados.
6. Criar navegação.
7. Implementar telas estáticas com mocks.
8. Implementar navegação entre telas.
9. Implementar cálculo da data de retorno.
10. Implementar seleção de foto da cliente.
11. Rodar validações.
12. Corrigir erros.
13. Gerar resumo do que foi implementado.

## Validação final

Antes de finalizar:
- Rodar `npm run lint`, se existir.
- Rodar `npx tsc --noEmit`, se TypeScript estiver configurado.
- Rodar `npx expo start` apenas se o ambiente permitir.
- Comparar visualmente as telas com o protótipo HTML.
- Listar pendências, caso algo não tenha sido implementado.
