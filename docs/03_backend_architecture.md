# 03 — Arquitetura Backend

## 1. Objetivo

Construir uma API REST em ASP.NET Core para sustentar o MVP mobile BeautyFlow, com autenticação JWT, persistência em PostgreSQL, escopo multi-tenant por salão e regras de geração de mensagens agendadas.

## 2. Stack

- .NET 8+
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- FluentValidation ou validações manuais com DataAnnotations
- Swagger/OpenAPI
- Serilog
- xUnit
- Testcontainers, opcional

## 3. Arquitetura sugerida

Usar arquitetura em camadas simples:

```text
BeautyFlow.Api
  Controllers
  Middlewares
  Extensions
  Auth

BeautyFlow.Application
  DTOs
  Services
  Interfaces
  Validators
  UseCases

BeautyFlow.Domain
  Entities
  Enums
  ValueObjects
  DomainServices

BeautyFlow.Infrastructure
  Data
  Repositories
  Migrations
  Storage
  ExternalServices
```

## 4. Princípios

- Controllers finos.
- Regra de negócio na camada Application/Domain.
- Entidades não devem ser expostas diretamente na API.
- Sempre filtrar dados por `SalonId`.
- Usar DTOs para request/response.
- Validar dados no backend mesmo que frontend valide.
- Não implementar integração real com WhatsApp no MVP.

## 5. Módulos

### Auth

- Register
- Login
- Refresh futuro, fora do MVP
- Current user

### Salons

- Get profile
- Update profile

### Customers

- List
- Get by id
- Create
- Update
- Upload photo
- Delete lógico, opcional

### Services

- List
- Get by id
- Create
- Update
- Activate/deactivate

### Appointments

- List/history
- Get by id
- Create

### ScheduledMessages

- List/filter
- Get by id
- Update text
- Mark as sent
- Cancel
- Generate WhatsApp link/message payload

### Settings

- Message template
- Notification settings, se persistido

## 6. Entidades

```text
Salon
User
Customer
Service
Appointment
ScheduledMessage
MessageTemplate
NotificationSettings
```

## 7. Autenticação e autorização

- JWT Bearer.
- Token deve conter `userId` e `salonId`.
- Todas as rotas privadas devem exigir autenticação.
- Todo acesso a dados deve usar o `salonId` do token.

## 8. Multi-tenancy

O MVP usa multi-tenancy simples por coluna `SalonId`.

Regra obrigatória:

```text
Nenhuma consulta privada pode retornar dados sem filtrar por SalonId.
```

## 9. Geração de mensagem agendada

Ao criar atendimento:

1. Buscar cliente pelo id e salonId.
2. Buscar serviço pelo id e salonId.
3. Criar atendimento.
4. Calcular data de envio.
5. Resolver template.
6. Criar ScheduledMessage com status Pending.
7. Salvar transação.

## 10. Transações

Criar atendimento e mensagem agendada na mesma transação.

## 11. Upload de foto

Opções:

### MVP simples

Salvar arquivo localmente em `/uploads/customers` durante desenvolvimento.

### Evolução recomendada

Salvar em storage externo:

- Supabase Storage
- S3
- Azure Blob Storage

No banco, armazenar apenas `PhotoUrl`.

## 12. Erros padronizados

Formato sugerido:

```json
{
  "success": false,
  "message": "Cliente não encontrada.",
  "errors": [
    {
      "field": "customerId",
      "message": "Cliente inválida."
    }
  ]
}
```

## 13. Respostas de sucesso

Formato sugerido:

```json
{
  "success": true,
  "data": {},
  "message": null
}
```

## 14. Documentação da API

- Habilitar Swagger em ambiente de desenvolvimento.
- Incluir exemplos de request/response.
- Documentar autenticação Bearer.

## 15. Background jobs

No MVP, não precisa enviar mensagem automaticamente. Porém, o backend pode ter endpoint de listagem de mensagens pendentes por data.

Jobs automáticos ficam para evolução futura.
