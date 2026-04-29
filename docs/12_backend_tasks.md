# 12 — Tasks Detalhadas Backend

## Epic BE-01 — Fundação da API

### BE-001 — Criar solution .NET

Criar:

```text
BeautyFlow.Api
BeautyFlow.Application
BeautyFlow.Domain
BeautyFlow.Infrastructure
BeautyFlow.Tests
```

### BE-002 — Configurar referências entre projetos

- Api referencia Application e Infrastructure.
- Application referencia Domain.
- Infrastructure referencia Domain e Application.
- Tests referencia projetos necessários.

### BE-003 — Configurar appsettings

Adicionar:

- ConnectionStrings
- Jwt
- Storage
- Logging

### BE-004 — Configurar Swagger

- Swagger em desenvolvimento.
- Bearer token configurado.

### BE-005 — Configurar EF Core PostgreSQL

- AppDbContext.
- Connection string.
- Migrations.

## Epic BE-02 — Domínio e Banco

### BE-006 — Criar entidades

- Salon
- User
- UserSalon
- Customer
- Service
- Appointment
- ScheduledMessage
- MessageTemplate
- NotificationSettings

### BE-007 — Criar enums

- MessageStatus
- ContactPreference
- NotificationMode

### BE-008 — Configurar mapeamentos EF

- Chaves.
- Relacionamentos.
- Tamanhos.
- Índices.

### BE-009 — Criar migration inicial

- Gerar migration.
- Validar banco.

### BE-010 — Criar seed opcional

- Serviços padrão ao registrar salão.
- Template padrão.

## Epic BE-03 — Autenticação

### BE-011 — Criar PasswordHasher

Usar implementação segura do .NET.

### BE-012 — Criar JwtTokenService

Gerar token com:

- userId
- email

### BE-013 — Criar Register endpoint

- Criar usuário.
- Criar template padrão.
- Criar settings padrão.
- Retornar token.

### BE-014 — Criar Login endpoint

- Validar e-mail e senha.
- Retornar token.

### BE-015 — Criar CurrentUser service

Ler userId do token.

## Epic BE-04 — Profissional e Salões

### BE-016 — GET /profile

Retornar dados da profissional autenticada.

### BE-017 — PUT /profile

Atualizar dados básicos da profissional.

### BE-018 — POST /salons

Criar salão e vincular profissional.

### BE-019 — GET /salons

Listar salões vinculados.

### BE-020 — GET /salon/profile

Retornar dados do salão selecionado.

### BE-021 — PUT /salon/profile

Atualizar dados básicos do salão selecionado.

## Epic BE-05 — Clientes

### BE-018 — Criar DTOs de Customer

- CustomerListItemResponse
- CustomerDetailResponse
- CreateCustomerRequest
- UpdateCustomerRequest

### BE-019 — GET /customers

- Filtrar por UserId dono da carteira.
- Busca por nome/telefone.
- Paginação.

### BE-020 — GET /customers/{id}

- Detalhes.
- Últimos atendimentos.
- Próxima mensagem pendente.

### BE-021 — POST /customers

- Criar cliente.
- Validar telefone.

### BE-022 — PUT /customers/{id}

- Atualizar cliente.
- Filtrar por UserId.

### BE-023 — POST /customers/{id}/photo

- Multipart.
- Validar imagem.
- Salvar localmente no MVP.
- Atualizar PhotoUrl.

## Epic BE-06 — Serviços

### BE-024 — Criar DTOs de Service

- ServiceResponse
- CreateServiceRequest
- UpdateServiceRequest

### BE-025 — GET /services

Listar serviços do salão selecionado.

### BE-026 — POST /services

Criar serviço.

### BE-027 — PUT /services/{id}

Atualizar serviço.

### BE-028 — PATCH /services/{id}/status

Ativar/desativar.

## Epic BE-07 — Atendimentos

### BE-029 — Criar DTOs de Appointment

- AppointmentResponse
- CreateAppointmentRequest
- AppointmentHistoryItemResponse

### BE-030 — Criar MessageTemplateRenderer

Substituir variáveis:

- nome
- servico
- dias
- salao
- data_atendimento

### BE-031 — Criar AppointmentService

Regra:

- Criar atendimento.
- Calcular data.
- Criar mensagem.
- Usar transação.

### BE-032 — POST /appointments

Criar atendimento e mensagem validando vínculo da profissional com o salão informado.

### BE-033 — GET /appointments

Histórico com filtros.

## Epic BE-08 — Mensagens

### BE-034 — Criar DTOs de ScheduledMessage

- MessageListItemResponse
- MessageDetailResponse
- UpdateMessageRequest

### BE-035 — GET /messages

Filtros:

- Status
- Data
- Cliente
- Paginação

### BE-036 — GET /messages/{id}

Detalhe.

### BE-037 — PUT /messages/{id}

Editar texto.

### BE-038 — PATCH /messages/{id}/mark-as-sent

- Status Sent.
- Set SentAt.

### BE-039 — PATCH /messages/{id}/cancel

- Status Canceled.
- Set CanceledAt.

### BE-040 — GET /messages/{id}/whatsapp-link

Gerar URL com telefone e texto codificado.

## Epic BE-09 — Configurações

### BE-041 — GET /settings/message-template

Buscar template geral.

### BE-042 — PUT /settings/message-template

Atualizar template.

### BE-043 — GET /settings/notifications

Buscar settings.

### BE-044 — PUT /settings/notifications

Atualizar settings.

## Epic BE-10 — Segurança e Qualidade

### BE-045 — Middleware global de erro

Resposta padronizada.

### BE-046 — Garantir regras de ownership e contexto

Revisar todos os endpoints privados e separar:

- filtro por UserId para carteira de clientes
- validação de UserSalon para contexto de salão

### BE-047 — Criar testes de geração de mensagem

- Template.
- Data retorno.

### BE-048 — Criar testes de ownership profissional e contexto de salão

- Clientes de uma profissional não devem aparecer para outra.
- Uma profissional não deve operar em salão sem vínculo `UserSalon`.

### BE-049 — Criar testes de autenticação

- Register.
- Login.
- Rota privada sem token.

### BE-050 — Criar health check

GET /health.
