# 00 — Contexto para Codex

## Produto

**BeautyFlow** é um aplicativo mobile SaaS para cabeleireiros e salões de beleza acompanharem clientes, registrarem atendimentos e gerarem mensagens de retorno pelo WhatsApp.

O MVP não deve enviar mensagens automaticamente via WhatsApp Cloud API. No MVP, o app deve abrir o WhatsApp da cliente com a mensagem pronta, e a usuária marca a mensagem como enviada manualmente.

## Objetivo do MVP

Permitir que uma cabeleireira:

1. Crie uma conta para seu salão.
2. Cadastre clientes.
3. Cadastre serviços com prazo sugerido de retorno.
4. Registre atendimentos.
5. Gere automaticamente uma mensagem futura de retorno.
6. Veja mensagens pendentes.
7. Abra o WhatsApp com a mensagem preenchida.
8. Marque a mensagem como enviada.

## Protótipo de referência

Existe um protótipo HTML/CSS/JS navegável com as telas:

- Splash
- Login
- Criar Conta
- Home
- Clientes
- Nova Cliente
- Detalhe Cliente
- Serviços
- Novo Serviço
- Registrar Atendimento
- Histórico de Atendimentos
- Mensagens
- Detalhe da Mensagem
- Mensagens Padrão
- Meu Salão
- Notificações
- Mais

O frontend real deve converter o protótipo em React Native, preservando identidade visual, fluxo de navegação, hierarquia visual e regras de UX.

## Stack recomendada

### Mobile

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
- AsyncStorage ou SecureStore
- Expo Image Picker
- React Hook Form
- Zod

### Backend

- ASP.NET Core Web API
- .NET 8 ou superior
- PostgreSQL
- Entity Framework Core
- JWT Bearer Authentication
- Swagger/OpenAPI
- Serilog

## Princípios para o Codex

- Não implementar funcionalidades fora do MVP sem task explícita.
- Não criar integração real com WhatsApp Cloud API no MVP.
- Não armazenar senha em texto puro.
- Não expor dados de um salão para outro.
- Sempre considerar `SalonId` como escopo obrigatório de dados.
- Criar código simples, testável e fácil de evoluir.
- Criar validações no frontend e no backend.
- Usar componentes reutilizáveis no mobile.
- Usar DTOs no backend, não retornar entidades diretamente.
- Manter nomes em inglês no código e português no texto visível ao usuário.

## Convenções de idioma

- Código: inglês.
- Commits: português ou inglês, manter consistência.
- UI: português do Brasil.
- Documentação: português do Brasil.

## Definition of Done geral

Uma task só está concluída quando:

- Compila sem erros.
- Não quebra navegação existente.
- Possui validação mínima.
- Possui tratamento de erro amigável.
- Está aderente ao design system.
- Segue o escopo do MVP.
- Não introduz dados mockados em fluxo já integrado.
