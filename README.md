# BeautyFlow

BeautyFlow e um SaaS mobile para profissionais de beleza centralizarem clientes, servicos, atendimentos e mensagens de retorno com contexto opcional de salao.

## Visao do produto

- a profissional e a identidade principal do sistema
- a carteira de clientes pertence a profissional
- o salao funciona como contexto operacional, nao como dono dos dados
- a profissional pode atuar com ou sem um salao ativo

## Stack

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT

### Mobile

- Expo
- React Native
- TypeScript
- React Navigation

## Estrutura

```text
BeautyFlow
|- beautyflow-api
|- beautyflow-mobile
|- docs
|- specs
|- design-reference
`- README.md
```

## Principais entidades

- `User`: profissional
- `Salon`: contexto de trabalho
- `UserSalon`: vinculo entre profissional e salao
- `Customer`: cliente da profissional
- `Service`: servico da profissional
- `Appointment`: atendimento com contexto de salao opcional
- `ScheduledMessage`: mensagem derivada do atendimento
- `MessageTemplate`: configuracao da profissional
- `NotificationSettings`: configuracao da profissional

## Setup local

### Banco

Crie um banco PostgreSQL local chamado `beautyflow_dev`.

### Backend

Arquivo principal:

```text
beautyflow-api/src/BeautyFlow.Api/appsettings.Development.json
```

Exemplo de configuracao:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=beautyflow_dev;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Issuer": "BeautyFlow",
    "Audience": "BeautyFlow.Mobile",
    "Key": "CHANGE_THIS_DEVELOPMENT_KEY_WITH_AT_LEAST_32_CHARS",
    "ExpiresInMinutes": 120
  }
}
```

Aplicar migrations:

```bash
dotnet ef database update --project beautyflow-api/src/BeautyFlow.Infrastructure --startup-project beautyflow-api/src/BeautyFlow.Api
```

Rodar API:

```bash
dotnet run --project beautyflow-api/src/BeautyFlow.Api
```

### Mobile

```bash
cd beautyflow-mobile
npm install
npm run start
```

## Fluxo principal de validacao

1. Criar conta profissional
2. Fazer login
3. Opcionalmente vincular um salao
4. Cadastrar clientes
5. Cadastrar servicos
6. Registrar atendimentos
7. Revisar mensagens pendentes
8. Abrir WhatsApp com a mensagem pronta

## Status atual

Ja existe base profissional-centrica para:

- auth e sessao com `UserId` como identidade principal
- vinculo multi-salao via `UserSalon`
- selecao real de contexto de salao no app
- clientes, servicos, atendimentos e mensagens orientados a profissional
- contexto de salao visivel quando existir
