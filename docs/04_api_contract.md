# 04 — Contrato da API REST

Base URL local:

```text
https://localhost:7001/api
```

## 1. Padrão de resposta

### Sucesso

```json
{
  "success": true,
  "data": {},
  "message": null
}
```

### Erro

```json
{
  "success": false,
  "data": null,
  "message": "Mensagem amigável.",
  "errors": []
}
```

## 2. Autenticação

### POST /auth/register

Cria conta, salão e usuário responsável.

Request:

```json
{
  "ownerName": "Bella Martins",
  "salonName": "Studio Bella Hair",
  "salonPhone": "31988880000",
  "email": "bella@email.com",
  "password": "Senha@123",
  "confirmPassword": "Senha@123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "user": {
      "id": "uuid",
      "name": "Bella Martins",
      "email": "bella@email.com",
      "salonId": "uuid",
      "salonName": "Studio Bella Hair"
    }
  },
  "message": null
}
```

### POST /auth/login

Request:

```json
{
  "email": "bella@email.com",
  "password": "Senha@123"
}
```

## 3. Salão

### GET /salon/profile

Retorna dados do salão autenticado.

### PUT /salon/profile

Request:

```json
{
  "salonName": "Studio Bella Hair",
  "ownerName": "Bella Martins",
  "email": "bella@email.com",
  "phone": "31988880000"
}
```

## 4. Clientes

### GET /customers

Query params:

```text
search?: string
page?: number
pageSize?: number
```

### GET /customers/{id}

Retorna cliente com histórico resumido.

### POST /customers

Request:

```json
{
  "name": "Gabriela Alves",
  "phone": "31999999999",
  "birthDate": "1998-04-10",
  "contactPreference": "WhatsApp",
  "notes": "Alérgica a amônia."
}
```

### PUT /customers/{id}

Atualiza cliente.

### POST /customers/{id}/photo

Content-Type: multipart/form-data

Campo:

```text
file
```

Response:

```json
{
  "success": true,
  "data": {
    "photoUrl": "https://..."
  },
  "message": null
}
```

## 5. Serviços

### GET /services

Lista serviços do salão.

### POST /services

Request:

```json
{
  "name": "Mechas",
  "suggestedReturnDays": 15,
  "defaultMessageTemplate": "Oi, {nome}! Já faz {dias} dias desde {servico}.",
  "isActive": true
}
```

### PUT /services/{id}

Atualiza serviço.

### PATCH /services/{id}/status

Request:

```json
{
  "isActive": false
}
```

## 6. Atendimentos

### GET /appointments

Query params:

```text
customerId?: uuid
serviceId?: uuid
startDate?: yyyy-mm-dd
endDate?: yyyy-mm-dd
page?: number
pageSize?: number
```

### POST /appointments

Cria atendimento e mensagem agendada.

Request:

```json
{
  "customerId": "uuid",
  "serviceId": "uuid",
  "appointmentDate": "2026-04-01",
  "notes": "Fez mechas loiras e matização."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "appointmentId": "uuid",
    "scheduledMessageId": "uuid",
    "scheduledSendDate": "2026-04-16"
  },
  "message": "Atendimento salvo. A mensagem de retorno já foi agendada."
}
```

## 7. Mensagens

### GET /messages

Query params:

```text
status?: Pending|Sent|Canceled|Error
date?: yyyy-mm-dd
customerId?: uuid
page?: number
pageSize?: number
```

### GET /messages/{id}

Retorna detalhe da mensagem.

### PUT /messages/{id}

Atualiza texto da mensagem.

Request:

```json
{
  "message": "Oi, Gabriela! Tudo bem?"
}
```

### PATCH /messages/{id}/mark-as-sent

Marca como enviada.

### PATCH /messages/{id}/cancel

Cancela mensagem.

### GET /messages/{id}/whatsapp-link

Retorna URL para abrir WhatsApp.

Response:

```json
{
  "success": true,
  "data": {
    "url": "https://wa.me/5531999999999?text=Oi%2C%20Gabriela..."
  },
  "message": null
}
```

## 8. Mensagem padrão

### GET /settings/message-template

### PUT /settings/message-template

Request:

```json
{
  "template": "Oi, {nome}! Tudo bem? Já faz {dias} dias desde {servico}."
}
```

## 9. Notificações

### GET /settings/notifications

### PUT /settings/notifications

Request:

```json
{
  "enabled": true,
  "preferredTime": "09:00",
  "mode": "OnlyWhenMessagesDue"
}
```
