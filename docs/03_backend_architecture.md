# 03 — Arquitetura Backend

## 1. Objetivo

Construir uma API REST em ASP.NET Core para sustentar o MVP mobile BeautyFlow, com autenticação JWT, persistência em PostgreSQL, modelo centrado na profissional e regras de geração de mensagens agendadas.

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
- Filtrar clientes por profissional.
- Validar vínculo profissional-salão quando a operação depender de contexto de salão.
- Usar DTOs para request/response.
- Validar dados no backend mesmo que frontend valide.
- Não implementar integração real com WhatsApp no MVP.

## 5. Módulos

### Auth

- Register
- Login
- Refresh futuro, fora do MVP
- Current user

### Professional Profile

- Get profile
- Update profile

### Salons

- List linked salons
- Create/link salon
- Get selected salon profile
- Update selected salon profile

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
UserSalon
Customer
Service
Appointment
ScheduledMessage
MessageTemplate
NotificationSettings
```

## 7. Autenticação e autorização

- JWT Bearer.
- Token deve conter `userId`.
- Todas as rotas privadas devem exigir autenticação.
- Todo acesso a clientes deve usar `userId`.
- Todo acesso contextual por salão deve validar vínculo em `UserSalon`.

## 8. Multi-contexto profissional-salão

O MVP evoluído usa:

- profissional como dona da carteira de clientes
- salões como contextos de trabalho
- tabela de vínculo `UserSalon`

Regras obrigatórias:

```text
Nenhuma consulta de clientes pode ignorar o UserId dono da carteira.
Nenhuma operação contextual por salão pode ocorrer sem validar o vínculo UserSalon.
```

## 9. Geração de mensagem agendada

Ao criar atendimento:

1. Buscar cliente pelo id e userId.
2. Validar vínculo da profissional com o salão informado.
3. Buscar serviço pelo id e salonId.
4. Criar atendimento.
5. Calcular data de envio.
6. Resolver template.
7. Criar ScheduledMessage com status Pending.
8. Salvar transação.

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
