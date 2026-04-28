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
- salonId
- email

### BE-013 — Criar Register endpoint

- Criar salão.
- Criar usuário.
- Criar template padrão.
- Criar settings padrão.
- Retornar token.

### BE-014 — Criar Login endpoint

- Validar e-mail e senha.
- Retornar token.

### BE-015 — Criar CurrentUser service

Ler userId e salonId do token.

## Epic BE-04 — Salão

### BE-016 — GET /salon/profile

Retornar dados do salão autenticado.

### BE-017 — PUT /salon/profile

Atualizar dados básicos.

## Epic BE-05 — Clientes

### BE-018 — Criar DTOs de Customer

- CustomerListItemResponse
- CustomerDetailResponse
- CreateCustomerRequest
- UpdateCustomerRequest

### BE-019 — GET /customers

- Filtrar por SalonId.
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
- Filtrar por SalonId.

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

Listar serviços por SalonId.

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

Criar atendimento e mensagem.

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

### BE-046 — Garantir filtro por SalonId

Revisar todos os endpoints privados.

### BE-047 — Criar testes de geração de mensagem

- Template.
- Data retorno.

### BE-048 — Criar testes de isolamento por SalonId

Dados de um salão não devem aparecer para outro.

### BE-049 — Criar testes de autenticação

- Register.
- Login.
- Rota privada sem token.

### BE-050 — Criar health check

GET /health.
