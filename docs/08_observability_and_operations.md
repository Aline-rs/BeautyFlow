# 08 — Observabilidade e Operação

## 1. Objetivo

Definir como o BeautyFlow deve registrar logs, monitorar erros e facilitar suporte técnico no MVP e em evoluções futuras.

## 2. Logs backend

Usar Serilog.

Eventos importantes:

- Registro de conta.
- Login com sucesso.
- Falha de login sem registrar senha.
- Criação de cliente.
- Upload de foto.
- Criação de serviço.
- Criação de atendimento.
- Criação de mensagem agendada.
- Marcação de mensagem como enviada.
- Erros inesperados.

## 3. Campos de log recomendados

```text
CorrelationId
UserId
SalonId
Action
EntityId
Status
ElapsedMs
```

Não logar:

- Senha.
- Token JWT.
- Conteúdo completo de mensagem, se não necessário.
- Observações sensíveis completas.

## 4. Middleware de erro

Criar middleware global para:

- Capturar exceções.
- Logar erro.
- Retornar resposta padronizada.

## 5. Health check

Criar endpoint:

```text
GET /health
```

Deve verificar:

- API online.
- Banco acessível.

## 6. Ambientes

### Development

- Swagger habilitado.
- Logs detalhados.
- Banco local ou Supabase/Postgres dev.

### Production

- Swagger opcional ou protegido.
- Logs estruturados.
- HTTPS obrigatório.
- CORS restrito.

## 7. Configurações

Usar variáveis de ambiente para:

```text
ConnectionStrings__DefaultConnection
Jwt__Issuer
Jwt__Audience
Jwt__Key
Jwt__ExpirationMinutes
Storage__Provider
Storage__BasePath
```

## 8. Métricas futuras

- Quantidade de mensagens pendentes.
- Quantidade de mensagens enviadas.
- Atendimentos por mês.
- Clientes com retorno próximo.
- Taxa de mensagens marcadas como enviadas.
