# 00 - Contexto para Codex

## Produto

**BeautyFlow** e um aplicativo mobile SaaS para profissionais de beleza acompanharem clientes, registrarem atendimentos e gerarem mensagens de retorno pelo WhatsApp.

O MVP nao envia mensagens automaticamente via WhatsApp Cloud API. A profissional abre o WhatsApp com a mensagem pronta e marca manualmente como enviada.

## Objetivo do MVP

Permitir que uma profissional:

1. crie uma conta profissional
2. cadastre clientes
3. cadastre servicos com prazo sugerido de retorno
4. registre atendimentos
5. gere uma mensagem futura de retorno
6. veja mensagens pendentes
7. abra o WhatsApp com a mensagem preenchida
8. vincule um ou mais saloes apenas quando precisar de contexto operacional

## Principios para o Codex

- nao implementar funcionalidades fora do MVP sem task explicita
- nao integrar WhatsApp Cloud API no MVP
- nao armazenar senha em texto puro
- nao expor dados de uma profissional para outra
- usar `UserId` como identidade principal
- tratar `SalonId` como contexto opcional e validado por `UserSalon` quando necessario
- criar codigo simples, testavel e facil de evoluir
- criar validacoes no frontend e no backend
- usar componentes reutilizaveis no mobile
- usar DTOs no backend

## Definition of Done geral

Uma task so esta concluida quando:

- compila sem erros
- nao quebra navegacao existente
- possui validacao minima
- possui tratamento de erro amigavel
- esta aderente ao design system
- segue o escopo do MVP
- nao introduz mocks em fluxo ja integrado
